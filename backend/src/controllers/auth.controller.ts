import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../utils/db';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '@repo/shared';

// Slug generation utility for orgs
const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + crypto.randomBytes(2).toString('hex');
};

export const register = async (req: Request, res: Response) => {
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { orgName, email, password, firstName, lastName } = result.data;

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create org and user in a transaction
        const newUser = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: orgName,
                    slug: generateSlug(orgName),
                },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: 'admin', // First user in org is admin
                    orgId: org.id,
                },
            });

            return user;
        });

        const tokens = generateTokens({ userId: newUser.id, orgId: newUser.orgId, role: newUser.role });

        res.status(201).json({
            success: true,
            data: {
                user: { id: newUser.id, email: newUser.email, role: newUser.role, orgId: newUser.orgId },
                tokens,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while registering' });
    }
};

export const login = async (req: Request, res: Response) => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { email, password } = result.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ error: 'User account is inactive' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const tokens = generateTokens({ userId: user.id, orgId: user.orgId, role: user.role });

        res.status(200).json({
            success: true,
            data: {
                user: { id: user.id, email: user.email, role: user.role, orgId: user.orgId },
                tokens,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while logging in' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
        const payload = verifyRefreshToken(refreshToken);

        // In a prod app, verify if the user/org still exist and are active
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user || user.status !== 'active') {
            return res.status(401).json({ error: 'User is inactive or deleted' });
        }

        const tokens = generateTokens({ userId: user.id, orgId: user.orgId, role: user.role });

        res.status(200).json({ success: true, data: { tokens } });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
    const result = ForgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    const { email } = result.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return 200 anyway to prevent user enumeration
            return res.status(200).json({ success: true, message: 'If an account exists, a reset link has been sent' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiresAt },
        });

        // TODO: Send Email using Nodemailer
        // const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        // await sendEmail(user.email, 'Reset your password', resetLink);

        res.status(200).json({ success: true, message: 'If an account exists, a reset link has been sent' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const result = ResetPasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { token, password } = result.data;

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiresAt: null,
            },
        });

        res.status(200).json({ success: true, message: 'Password has been safely reset' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
