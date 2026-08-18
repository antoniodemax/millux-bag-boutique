import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  collection,
  doc,
  setDoc,
  where,
  query,
  getDocs
} from 'firebase/firestore';
import { products } from '@/data/products';

// For now, we'll just use the hardcoded products data since we're not migrating images yet
// We'll need to get the Firebase config from environment variables

// This script should be run with: npx ts-node scripts/migrateData.ts
// Or compiled and run with node

// Firebase configuration - these should come from environment variables in a real scenario
// For this migration script, we'll assume they're set in the environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreInstance = getFirestore(app);
// const storageInstance = getStorage(app); // Not needed for this phase

interface ProductData {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  materials: string;
  dimensions: string;
  care: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
}

interface CategoryData {
  id: number;
  name: string;
  image: string;
  available: boolean;
}

/**
 * Migrate products to Firestore
 * This function is idempotent - it will update existing documents or create new ones
 */
export const migrateProducts = async (): Promise<void> => {
  console.log('Starting product migration...');

  const productsCol = collection(firestoreInstance, 'products');

  // Migrate each product
  for (const productData of products) {
    const productRef = doc(productsCol, productData.id); // Use existing ID as document ID

    try {
      await setDoc(productRef, {
        id: productData.id,
        slug: productData.slug,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        images: productData.images,
        description: productData.description,
        materials: productData.materials,
        dimensions: productData.dimensions,
        care: productData.care,
        availability: productData.availability,
        featured: productData.featured,
        newArrival: productData.newArrival,
        bestseller: productData.bestseller,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true }); // merge: true ensures we don't overwrite if document exists

      console.log(`Migrated product: ${productData.name} (ID: ${productData.id})`);
    } catch (error) {
      console.error(`Failed to migrate product ${productData.name}:`, error);
    }
  }

  console.log('Product migration completed.');
};

/**
 * Migrate categories to Firestore
 */
export const migrateCategories = async (): Promise<void> => {
  console.log('Starting category migration...');

  // Define the categories based on what we saw in the code
  const categoriesData: CategoryData[] = [
    { id: 1, name: 'Handbags for Women', image: '/images/handbags-category.png', available: true },
    { id: 2, name: 'Sling Bags', image: '', available: true },
    { id: 3, name: 'Large Bags', image: '', available: false },
    { id: 4, name: 'Travel Bags', image: '', available: true },
    { id: 5, name: 'Bridal Bags', image: '', available: false },
    { id: 6, name: 'Gym Bags', image: '', available: false },
    { id: 7, name: 'Laptop Bags', image: '', available: false },
    { id: 8, name: 'Briefcase', image: '', available: false },
    { id: 9, name: 'School Bags', image: '', available: false },
    { id: 10, name: 'Lunch Bags', image: '', available: false },
    { id: 11, name: 'Men Bags', image: '', available: false },
    { id: 12, name: 'Baby Diaper Bags', image: '', available: false }
  ];

  const categoriesCol = collection(firestoreInstance, 'categories');

  // Migrate each category
  for (const categoryData of categoriesData) {
    // Use a string ID based on the category name for consistency
    const categoryId = `category_${categoryData.id}`;
    const categoryRef = doc(categoriesCol, categoryId);

    try {
      await setDoc(categoryRef, {
        id: categoryId,
        name: categoryData.name,
        image: categoryData.image,
        available: categoryData.available,
        orderNumber: categoryData.id, // Use the original ID for ordering
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });

      console.log(`Migrated category: ${categoryData.name} (ID: ${categoryId})`);
    } catch (error) {
      console.error(`Failed to migrate category ${categoryData.name}:`, error);
    }
  }

  console.log('Category migration completed.');
};

/**
 * Main migration function
 */
const runMigration = async () => {
  try {
    await migrateProducts();
    await migrateCategories();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

export { migrateProducts, migrateCategories };