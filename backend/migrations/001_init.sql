-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  materials TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  care TEXT NOT NULL,
  availability VARCHAR(20) NOT NULL DEFAULT 'in_stock' CHECK (availability IN ('in_stock', 'low_stock', 'out_of_stock')),
  featured BOOLEAN DEFAULT FALSE,
  newArrival BOOLEAN DEFAULT FALSE,
  bestseller BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image TEXT,
  available BOOLEAN DEFAULT TRUE,
  orderNumber INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (for admin/auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  phone VARCHAR(20),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customerId UUID REFERENCES customers(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  totalAmount DECIMAL(10, 2) NOT NULL CHECK (totalAmount >= 0),
  whatsappMessage TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orderId UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  productId UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  priceAtPurchase DECIMAL(10, 2) NOT NULL CHECK (priceAtPurchase >= 0),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table (stock levels per product)
CREATE TABLE IF NOT EXISTS inventory (
  productId UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  productId UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  change INTEGER NOT NULL, -- positive for addition, negative for removal
  reason VARCHAR(255) NOT NULL,
  referenceId UUID, -- could be orderId, etc.
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_newArrival ON products(newArrival);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(bestseller);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_available ON categories(available);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_customerId ON orders(customerId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orderItems_orderId ON order_items(orderId);
CREATE INDEX IF NOT EXISTS idx_orderItems_productId ON order_items(productId);
CREATE INDEX IF NOT EXISTS idx_inventory_productId ON inventory(productId);
CREATE INDEX IF NOT EXISTS idx_inventoryMovements_productId ON inventory_movements(productId);
CREATE INDEX IF NOT EXISTS idx_inventoryMovements_reason ON inventory_movements(reason);
