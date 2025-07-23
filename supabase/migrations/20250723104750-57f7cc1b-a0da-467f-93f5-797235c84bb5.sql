-- Update existing handbag products with new images and prices
UPDATE products 
SET 
  image_url = CASE 
    WHEN name = 'Classic Leather Handbag' THEN '/lovable-uploads/c6717043-79d2-4d41-9bf6-79294f46bdd9.png'
    WHEN name = 'Designer Tote Bag' THEN '/lovable-uploads/8a944d88-5465-49e1-8d59-ca2b18ae75d1.png'
    WHEN name = 'Evening Clutch' THEN '/lovable-uploads/0849630a-8707-453e-ba19-f044b88df5b4.png'
    ELSE image_url
  END,
  price = CASE 
    WHEN name = 'Classic Leather Handbag' THEN 2500
    WHEN name = 'Designer Tote Bag' THEN 2200
    WHEN name = 'Evening Clutch' THEN 1800
    ELSE price
  END,
  updated_at = now()
WHERE category = 'Handbags for Women';

-- Add new handbag products with the remaining images
INSERT INTO products (name, description, price, category, image_url, stock_quantity, is_active)
VALUES 
  ('Elegant Beige Handbag', 'Sophisticated beige leather handbag with brown handles perfect for professional and casual use', 2300, 'Handbags for Women', '/lovable-uploads/a0f7ab0f-5ac3-4f1a-96e6-cfc1aad7901b.png', 12, true),
  ('Stylish Blue Tote', 'Beautiful blue leather tote bag with contrasting handles, perfect for everyday elegance', 2100, 'Handbags for Women', '/lovable-uploads/1202f9fc-d67b-4666-9ccc-eb302555fec8.png', 8, true),
  ('Professional Black Handbag', 'Classic black leather handbag with gold hardware, ideal for business and formal occasions', 2400, 'Handbags for Women', '/lovable-uploads/bc44b908-cbbe-436f-b84d-ae9eca3bd09f.png', 15, true);