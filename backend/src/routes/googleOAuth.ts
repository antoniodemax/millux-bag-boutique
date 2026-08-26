import { Router } from 'express';
import googleOAuthController from '../controllers/googleOAuth/controller';

const router = Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google', googleOAuthController.googleAuth);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback handler
 * @access  Public
 */
router.get('/google/callback', googleOAuthController.googleAuthCallback);

export default router;
