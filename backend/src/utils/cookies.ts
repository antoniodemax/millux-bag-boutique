import { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'token';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Cookie attributes shared by login, OAuth callback and logout.
 * Production: frontend (Vercel) and API (Render) are cross-site, so the cookie
 * must be SameSite=None + Secure. clearCookie must send the same attributes or
 * browsers ignore the clearing header.
 */
export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
