import { Router } from 'express';
import { login, logout, me, registerUser } from '../services/authService';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (admin only)
 * @access  Private/Admin
 */
router.post('/register', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await registerUser(email, password, role);
    // Don't return password hash
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === '23505') {
      // Unique violation
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and set cookie
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear cookie
 * @access  Private
 */
router.post('/logout', requireAuth, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', requireAuth, me);

export default router;
