import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './db';
import { generateTokens } from './jwt';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0].value;
                    if (!email) {
                        return done(new Error('No email found in Google profile'));
                    }

                    let user = await prisma.user.findFirst({
                        where: {
                            OR: [{ googleId: profile.id }, { email }],
                        },
                        include: { organization: true },
                    });

                    // Link Google ID if email matches but Google ID wasn't linked yet
                    if (user && !user.googleId) {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: { googleId: profile.id },
                            include: { organization: true },
                        });
                    }

                    // In this specific platform, org creation might be required first or via invite.
                    // If no user exists at all, we create a pseudo-org for them or reject.
                    // Based on Phase 1 requirements, "After first login: if no org -> redirect to /onboarding"
                    // Let's create an onboarding pseudo-org and user if totally new.
                    if (!user) {
                        const orgName = `${profile.displayName || 'User'}'s Workspace`;
                        // generate a slug
                        const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 5);

                        const newOrg = await prisma.organization.create({
                            data: { name: orgName, slug },
                        });

                        user = await prisma.user.create({
                            data: {
                                email,
                                googleId: profile.id,
                                role: 'admin',
                                orgId: newOrg.id,
                            },
                            include: { organization: true },
                        });
                    }

                    if (user.status !== 'active') {
                        return done(new Error('Account is inactive'));
                    }

                    // We pass the generated tokens directly into the user object returned to Passport
                    const tokens = generateTokens({ userId: user.id, orgId: user.orgId, role: user.role });

                    return done(null, {
                        userId: user.id,
                        orgId: user.orgId,
                        role: user.role,
                        tokens
                    });
                } catch (error) {
                    return done(error as Error);
                }
            }
        )
    );
} else {
    console.warn('Google OAuth credentials missing - skipping Passport setup');
}

export default passport;
