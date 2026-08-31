-- Add password_hash column to customers table for customer authentication
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index on email for faster lookups (though email is already UNIQUE)
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);