import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../utils/db';
import { OnboardingSchema } from '@repo/shared';
import { generateTokens } from '../utils/jwt';

// Slug generation utility for orgs
const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + crypto.randomBytes(2).toString('hex');
};

export const setupOrganization = async (req: Request, res: Response) => {
    const result = OnboardingSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { orgName, timezone, firstName, lastName } = result.data;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.orgId) {
            return res.status(400).json({ error: 'User already belongs to an organization' });
        }

        const newOrg = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: orgName,
                    slug: generateSlug(orgName),
                    settings: { timezone }
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: {
                    orgId: org.id,
                    role: 'admin',
                    firstName,
                    lastName,
                },
            });

            return org;
        });

        // Generate new tokens because orgId has changed
        const tokens = generateTokens({ userId: user.id, orgId: newOrg.id, role: 'admin' });

        res.status(201).json({
            success: true,
            data: {
                organization: newOrg,
                tokens,
            },
        });
    } catch (error) {
        console.error('Error in setupOrganization:', error);
        res.status(500).json({ error: 'Internal server error while setting up organization' });
    }
};
