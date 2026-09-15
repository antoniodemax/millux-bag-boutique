-- Users who sign in only with Google have no password.
-- password_hash was NOT NULL in 001_init.sql, which made every Google-only
-- admin creation fail. DROP NOT NULL is idempotent and non-destructive.
ALTER TABLE users
ALTER COLUMN password_hash DROP NOT NULL;
