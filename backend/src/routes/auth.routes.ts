import { Router, Request, Response } from 'express';
import passport from '../utils/passport';
import { register, login, refresh, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router: import('express').Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req: Request, res: Response) => {
    const { tokens } = req.user as any;
    // Redirect to frontend with tokens in URL or cookie. For SPA, URL fragment is common or query param
    res.redirect(`${process.env.FRONTEND_URL}/login?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
});

export default router;
