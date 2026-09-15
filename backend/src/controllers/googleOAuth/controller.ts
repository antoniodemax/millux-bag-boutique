import { Request, Response } from 'express';
import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { sign } from 'jsonwebtoken';
import googleOAuthService from '../../services/googleOAuth/service';
import { findOrCreateGoogleCustomer, generateCustomerToken } from '../../services/customerService';
import { config } from '../../config';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE, authCookieOptions } from '../../utils/cookies';

type Flow = 'admin' | 'customer';

const STATE_COOKIE = 'oauth_state';
const STATE_MAX_AGE = 10 * 60 * 1000; // the round trip to Google should never take longer

const frontendBase = () => config.frontendUrl.split(',')[0].trim().replace(/\/+$/, '');

/** Only ever redirect back to a relative path on our own frontend */
const safeReturnTo = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return value;
};

/**
 * The OAuth `state` carries which flow started the sign-in and where to send
 * the user afterwards, signed with the JWT secret; a nonce cookie ties it to
 * the browser that started the flow (CSRF protection).
 */
const encodeState = (payload: { flow: Flow; returnTo: string; nonce: string }): string => {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const mac = createHmac('sha256', config.jwtSecret).update(body).digest('base64url');
  return `${body}.${mac}`;
};

const decodeState = (state: unknown): { flow: Flow; returnTo: string; nonce: string } | null => {
  if (typeof state !== 'string' || !state.includes('.')) return null;
  const [body, mac] = state.split('.');
  const expected = createHmac('sha256', config.jwtSecret).update(body).digest('base64url');
  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString());
    if ((parsed.flow !== 'admin' && parsed.flow !== 'customer') || typeof parsed.nonce !== 'string') return null;
    return { flow: parsed.flow, returnTo: safeReturnTo(parsed.returnTo, '/'), nonce: parsed.nonce };
  } catch {
    return null;
  }
};

/**
 * Initiate Google OAuth flow
 * GET /api/auth/google?flow=admin|customer&returnTo=/relative/path
 */
export const googleAuth = (req: Request, res: Response): void => {
  if (!config.googleClientId || !config.googleCallbackUrl) {
    res.status(500).json({ error: 'Google OAuth not configured' });
    return;
  }

  const flow: Flow = req.query.flow === 'customer' ? 'customer' : 'admin';
  const returnTo = safeReturnTo(req.query.returnTo, flow === 'customer' ? '/customer/profile' : '/admin/');
  const nonce = randomBytes(16).toString('hex');

  // Nonce lives in a cookie on the API origin; Lax is enough because Google
  // returns the browser here with a top-level GET navigation.
  res.cookie(STATE_COOKIE, nonce, {
    httpOnly: true,
    secure: authCookieOptions.secure,
    sameSite: 'lax',
    path: '/api/auth/google',
    maxAge: STATE_MAX_AGE,
  });

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', config.googleClientId);
  authUrl.searchParams.set('redirect_uri', config.googleCallbackUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', encodeState({ flow, returnTo, nonce }));
  authUrl.searchParams.set('prompt', 'select_account');

  res.redirect(authUrl.toString());
};

/**
 * Google OAuth callback handler (shared by the admin and customer flows)
 */
export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const state = decodeState(req.query.state);
  const flow: Flow = state?.flow ?? 'admin';
  const failureUrl = `${frontendBase()}${flow === 'customer' ? '/customer/login' : '/admin/login'}?error=google_auth_failed`;
  res.clearCookie(STATE_COOKIE, { path: '/api/auth/google' });

  try {
    const code = req.query.code as string | undefined;
    if (!code) {
      throw new Error(`Authorization code not provided${req.query.error ? ` (${req.query.error})` : ''}`);
    }

    const nonceCookie = req.cookies?.[STATE_COOKIE];
    if (!state || !nonceCookie || nonceCookie !== state.nonce) {
      throw new Error('OAuth state mismatch');
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        code,
        redirect_uri: config.googleCallbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData: any = await tokenResponse.json().catch(() => ({}));
      throw new Error(`Failed to exchange code for token: ${errorData.error_description || errorData.error || tokenResponse.status}`);
    }

    const tokenData: any = await tokenResponse.json();
    const idToken = tokenData.id_token as string | undefined;
    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    const googleUser = await googleOAuthService.verifyGoogleToken(idToken);

    if (flow === 'customer') {
      if (!googleUser.emailVerified) {
        throw new Error('Google account email is not verified');
      }
      const customer = await findOrCreateGoogleCustomer({ email: googleUser.email, name: googleUser.name });
      res.cookie(AUTH_COOKIE_NAME, generateCustomerToken(customer), { ...authCookieOptions, maxAge: AUTH_COOKIE_MAX_AGE });
      res.redirect(`${frontendBase()}${state!.returnTo}`);
      return;
    }

    // Admin flow: find or create the staff user (restricted to ADMIN_GOOGLE_EMAIL)
    const user = await googleOAuthService.findOrCreateGoogleUser(googleUser);
    const jwtToken = sign({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.cookie(AUTH_COOKIE_NAME, jwtToken, { ...authCookieOptions, maxAge: AUTH_COOKIE_MAX_AGE });
    res.redirect(`${frontendBase()}/admin/`);
  } catch (error: any) {
    console.error(`Google OAuth callback error (${flow}):`, error?.message ?? error);
    res.redirect(failureUrl);
  }
};

export default {
  googleAuth,
  googleAuthCallback,
};
