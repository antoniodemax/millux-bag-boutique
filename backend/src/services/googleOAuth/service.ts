import { OAuth2Client } from 'google-auth-library';
import { query } from '../../db/index';
import { config } from '../../config';
import { User } from '../../services/authService';

// Initialize Google OAuth client
const oAuth2Client = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  config.googleCallbackUrl
);

/**
 * Verify Google ID token and return user info
 */
export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }
    
    // Extract user info from Google token - ensure required fields are present
    const email = payload.email;
    if (!email) {
      throw new Error('Google account must have an email address');
    }
    
    return {
      googleId: payload.sub,
      email: email,
      emailVerified: payload.email_verified || false,
      name: payload.name || '',
      picture: payload.picture || '',
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('Invalid Google token');
  }
};

/**
 * Find or create user from Google account
 */
export const findOrCreateGoogleUser = async (googleUser: {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture?: string;
}): Promise<{ id: string; email: string; role: string; createdAt: Date; updatedAt: Date }> => {
  // First, try to find existing user by Google ID
  let userRecord = await query(
    'SELECT * FROM users WHERE google_id = $1',
    [googleUser.googleId]
  );
  
  if (userRecord.rows.length > 0) {
    const user = userRecord.rows[0];
    // Update last login time
    await query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
  
  // If no user found by Google ID, try to find by email (for account linking)
  userRecord = await query(
    'SELECT * FROM users WHERE email = $1',
    [googleUser.email]
  );
  
  if (userRecord.rows.length > 0) {
    const user = userRecord.rows[0];
    // Link Google ID to existing account
    await query(
      'UPDATE users SET google_id = $1, google_email_verified = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [googleUser.googleId, googleUser.emailVerified, user.id]
    );
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
  
  // Check if email is authorized for admin access
  const authorizedEmail = config.adminGoogleEmail;
  if (authorizedEmail && googleUser.email.toLowerCase() !== authorizedEmail.toLowerCase()) {
    throw new Error('Google account not authorized for admin access');
  }
  
  // Create new user account (admin role if authorized email matches)
  const role = (config.adminGoogleEmail && 
                googleUser.email.toLowerCase() === config.adminGoogleEmail.toLowerCase()) 
                ? 'admin' 
                : 'user';
  
  const result = await query(
    `INSERT INTO users (email, google_id, google_email_verified, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, role, created_at, updated_at`,
    [googleUser.email, googleUser.googleId, googleUser.emailVerified, role]
  );
  
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at,
    updatedAt: result.rows[0].updated_at,
  };
};

export default {
  verifyGoogleToken,
  findOrCreateGoogleUser,
};
