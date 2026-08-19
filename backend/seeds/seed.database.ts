import { Pool } from 'pg';
import { config } from '../src/config';
import { products } from '../../src/data/products';

// Extract unique categories from products
const getUniqueCategories = (products: any[]): Array<{name: string; image: string; available: boolean; orderNumber: number}> => {
  const categoriesMap = new Map<string, {name: string; image: string; available: boolean; orderNumber: number}>();
  
  // Process products to extract category info
  products.forEach((product, index) => {
    if (!categoriesMap.has(product.category)) {
      // Assign orderNumber based on first appearance
      categoriesMap.set(product.category, {
        name: product.category,
        image: '', // Default empty image - can be updated later
        available: true,
        orderNumber: categoriesMap.size // 0-based index
      });
    }
  });
  
  return Array.from(categoriesMap.values());
};

const categories = getUniqueCategories(products);

const seedDatabase = async () => {
  const pool = new Pool({
    connectionString: config.databaseUrl,
  });

  let client;
  
  try {
    client = await pool.connect();
    console.log('Connected to database');

    // Start transaction
    await client.query('BEGIN');

    // Seed categories first (idempotent)
    console.log(`Seeding ${categories.length} categories...`);
    for (const category of categories) {
      // Check if category already exists
      const checkResult = await client.query(
        'SELECT id FROM categories WHERE name = $1',
        [category.name]
      );
      
      if (checkResult.rows.length === 0) {
        // Insert new category
        await client.query(
          `INSERT INTO categories (name, image, available, orderNumber) 
           VALUES ($1, $2, $3, $4)`,
          [category.name, category.image, category.available, category.orderNumber]
        );
        console.log(`  ✓ Inserted category: ${category.name}`);
      } else {
        console.log(`  ⚠ Category already exists: ${category.name}`);
      }
    }

    // Seed products (idempotent)
    console.log(`Seeding ${products.length} products...`);
    for (const product of products) {
      // Check if product already exists by slug
      const checkResult = await client.query(
        'SELECT id FROM products WHERE slug = $1',
        [product.slug]
      );
      
      if (checkResult.rows.length === 0) {
        // Insert new product
        await client.query(
          `INSERT INTO products (
            slug, name, category, price, images, description, materials, dimensions, care,
            availability, featured, newArrival, bestseller
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            product.slug,
            product.name,
            product.category,
            product.price,
            product.images,
            product.description,
            product.materials,
            product.dimensions,
            product.care,
            product.availability,
            product.featured,
            product.newArrival,
            product.bestseller
          ]
        );
        console.log(`  ✓ Inserted product: ${product.name}`);
      } else {
        console.log(`  ⚠ Product already exists: ${product.name}`);
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    // Rollback transaction on error
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Release client back to pool
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

// Run the seed function
seedDatabase().catch(console.error);
