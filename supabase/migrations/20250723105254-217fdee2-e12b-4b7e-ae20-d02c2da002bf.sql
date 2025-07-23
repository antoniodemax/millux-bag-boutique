-- Update handbag products with correct public image URLs
UPDATE products 
SET 
  image_url = CASE 
    WHEN name = 'Classic Leather Handbag' THEN '/lovable-uploads/c6717043-79d2-4d41-9bf6-79294f46bdd9.png'
    WHEN name = 'Designer Tote Bag' THEN '/lovable-uploads/8a944d88-5465-49e1-8d59-ca2b18ae75d1.png'
    WHEN name = 'Evening Clutch' THEN '/lovable-uploads/0849630a-8707-453e-ba19-f044b88df5b4.png'
    WHEN name = 'Elegant Beige Handbag' THEN '/lovable-uploads/a0f7ab0f-5ac3-4f1a-96e6-cfc1aad7901b.png'
    WHEN name = 'Stylish Blue Tote' THEN '/lovable-uploads/1202f9fc-d67b-4666-9ccc-eb302555fec8.png'
    WHEN name = 'Professional Black Handbag' THEN '/lovable-uploads/bc44b908-cbbe-436f-b84d-ae9eca3bd09f.png'
    ELSE image_url
  END,
  updated_at = now()
WHERE category = 'Handbags for Women';