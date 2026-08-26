-- Add Google OAuth fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS google_email_verified BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups by google_id
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
