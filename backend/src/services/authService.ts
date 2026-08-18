import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { query } from '../db/index';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';

// User interface (without password)
export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Register a new user (admin only in practice)
 */
export const registerUser = async (email: string, password: string, role: string = 'user'): Promise<User> => {
  const passwordHash = await hash(password, 12);
  const result = await query(
    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, createdAt, updatedAt`,
    [email, passwordHash, role]
  );
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    role: result.rows[0].role,
    createdAt: result.rows[0].createdAt,
    updatedAt: result.rows[0].updatedAt,
  };
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string): Promise<{ id: string; email: string; password_hash: string; role: string; createdAt: Date; updatedAt: Date } | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Validate password
 */
export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return compare(password, hash);
};

/**
 * Generate JWT token
 */
export const generateToken = (user: User): string => {
  return sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const decoded = verify(token, config.jwtSecret) as { userId: string; email: string; role: string };
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    // Attach user to request for downstream use
    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

/**
 * Authorization middleware - check if user is admin
 */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

/**
 * Login user and set cookie
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginCredentials;
  const userRecord = await findUserByEmail(email);
  if (!userRecord) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isValid = await validatePassword(password, userRecord.password_hash);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const user: User = {
    id: userRecord.id,
    email: userRecord.email,
    role: userRecord.role,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt,
  };

  const token = generateToken(user);

  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ message: 'Logged in successfully', user: { id: user.id, email: user.email, role: user.role } });
};

/**
 * Logout user by clearing cookie
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

/**
 * Get current user
 */
export const me = (req: Request, res: Response): void => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ user });
};
