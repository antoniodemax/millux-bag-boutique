import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import googleOAuthService from '../../services/googleOAuth/service';
import { User } from '../../services/authService';

/**
 * Initiate Google OAuth flow
 * Redirects user to Google's consent screen
 */
export const googleAuth = (req: Request, res: Response): void => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500).json({ error: 'Google OAuth not configured' });
    return;
  }
  
  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' ');
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', process.env.GOOGLE_CALLBACK_URL!);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  
  res.redirect(authUrl.toString());
};

/**
 * Google OAuth callback handler
 * Processes the authorization code from Google
 */
export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;
    
    if (!code) {
      res.status(400).json({ error: 'Authorization code not provided' });
      return;
    }
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencode',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to exchange code for token: ${errorData.error_description || errorData.error}`);
    }
    
    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;
    
    if (!idToken) {
      throw new Error('No ID token received from Google');
    }
    
    // Verify the Google ID token
    const googleUser = await googleOAuthService.verifyGoogleToken(idToken);
    
    // Find or create user in our database
    const user = await googleOAuthService.findOrCreateGoogleUser(googleUser);
    
    // Generate JWT token for our application
    const jwtToken = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie with JWT token
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Redirect to admin dashboard
    res.redirect('/admin/');
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    // Redirect back to login with error
    res.redirect('/admin/login?error=google_auth_failed');
  }
};

export default {
  googleAuth,
  googleAuthCallback,
};
