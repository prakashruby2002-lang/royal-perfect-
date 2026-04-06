-- Royal Perfect - Supabase Database Setup
-- Run this SQL script in your Supabase SQL editor to initialize all tables

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2),
    actual_price DECIMAL(10, 2),
    category VARCHAR(100),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create story table
CREATE TABLE IF NOT EXISTS story (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    section_order INTEGER DEFAULT 1,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id),
    customer_email VARCHAR(255),
    total DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Pending',
    items JSONB DEFAULT '[]'::jsonb,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255),
    customer_id UUID REFERENCES users(id),
    customer_name VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact links table
CREATE TABLE IF NOT EXISTS contactlinks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(100),
    url TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create website content table
CREATE TABLE IF NOT EXISTS website_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section VARCHAR(100) UNIQUE NOT NULL,
    content JSONB,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
    ('Earrings', 'Premium earrings collection'),
    ('Bangles', 'Elegant bangles and bracelets'),
    ('Rings', 'Designer rings for all occasions'),
    ('Chains', 'Beautiful chains and necklaces'),
    ('Bracelets', 'Luxury bracelets collection'),
    ('Sarees', 'Designer sarees collection')
ON CONFLICT (name) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('store_name', 'Royal Perfect'),
    ('store_email', 'info@royalperfect.com'),
    ('admin_password', 'RoyalPerfect2024')
ON CONFLICT (key) DO NOTHING;

-- Insert sample story sections
INSERT INTO story (title, description, section_order) VALUES
    ('Our Heritage', 'Royal Perfect was founded with a passion for luxury and elegance. We believe every customer deserves to feel like royalty.', 1),
    ('Craftsmanship', 'Each piece is carefully handcrafted by our expert artisans using premium materials and traditional techniques.', 2),
    ('Quality Assurance', 'We maintain the highest standards of quality, ensuring every product meets our strict criteria before reaching you.', 3),
    ('Customer Commitment', 'Your satisfaction is our priority. We provide exceptional customer service and lifetime support for all our products.', 4)
ON CONFLICT (title) DO NOTHING;

-- Enable RLS (Row Level Security) for public access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable public read access on products" ON products AS (SELECT) USING (true);
CREATE POLICY "Enable public read access on categories" ON categories AS (SELECT) USING (true);
CREATE POLICY "Enable public read access on story" ON story AS (SELECT) USING (true);
CREATE POLICY "Enable public read access on reviews" ON reviews AS (SELECT) USING (true);

-- Create policies for insert/update/delete (for admin use with proper auth)
CREATE POLICY "Enable insert on products" ON products AS (INSERT) WITH CHECK (true);
CREATE POLICY "Enable update on products" ON products AS (UPDATE) USING (true);
CREATE POLICY "Enable delete on products" ON products AS (DELETE) USING (true);

CREATE POLICY "Enable insert on categories" ON categories AS (INSERT) WITH CHECK (true);
CREATE POLICY "Enable delete on categories" ON categories AS (DELETE) USING (true);

CREATE POLICY "Enable insert on story" ON story AS (INSERT) WITH CHECK (true);
CREATE POLICY "Enable update on story" ON story AS (UPDATE) USING (true);
CREATE POLICY "Enable delete on story" ON story AS (DELETE) USING (true);

-- Create indexes for performance
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_createdat_idx ON products(createdat);
CREATE INDEX story_order_idx ON story(section_order);
CREATE INDEX orders_customer_idx ON orders(customer_id);
CREATE INDEX reviews_product_idx ON reviews(product_id);

-- Log initialization
SELECT 'Royal Perfect Database Initialized Successfully' as status;
