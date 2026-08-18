import { firestore } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';
import { Product } from '@/types/firebase';

/**
 * Get all products from Firestore
 * @returns Promise resolving to array of products
 */
export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(firestore, 'products');
  const productsQuery = query(productsCol, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(productsQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      images: data.images || [],
      description: data.description || '',
      materials: data.materials || '',
      dimensions: data.dimensions || '',
      care: data.care || '',
      availability: data.availability || 'in_stock',
      featured: data.featured || false,
      newArrival: data.newArrival || false,
      bestseller: data.bestseller || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Product;
  });
};

/**
 * Get a product by its slug
 * @param slug - Product slug
 * @returns Promise resolving to product or null if not found
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const productsCol = collection(firestore, 'products');
  const productsQuery = query(productsCol, where('slug', '==', slug));
  const querySnapshot = await getDocs(productsQuery);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: data.price,
    images: data.images || [],
    description: data.description || '',
    materials: data.materials || '',
    dimensions: data.dimensions || '',
    care: data.care || '',
    availability: data.availability || 'in_stock',
    featured: data.featured || false,
    newArrival: data.newArrival || false,
    bestseller: data.bestseller || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
  } as Product;
};

/**
 * Get featured products
 * @returns Promise resolving to array of featured products
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const productsCol = collection(firestore, 'products');
  const productsQuery = query(
    productsCol,
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(productsQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      images: data.images || [],
      description: data.description || '',
      materials: data.materials || '',
      dimensions: data.dimensions || '',
      care: data.care || '',
      availability: data.availability || 'in_stock',
      featured: data.featured || false,
      newArrival: data.newArrival || false,
      bestseller: data.bestseller || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Product;
  });
};

/**
 * Get new arrival products
 * @returns Promise resolving to array of new arrival products
 */
export const getNewArrivals = async (): Promise<Product[]> => {
  const productsCol = collection(firestore, 'products');
  const productsQuery = query(
    productsCol,
    where('newArrival', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(productsQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      images: data.images || [],
      description: data.description || '',
      materials: data.materials || '',
      dimensions: data.dimensions || '',
      care: data.care || '',
      availability: data.availability || 'in_stock',
      featured: data.featured || false,
      newArrival: data.newArrival || false,
      bestseller: data.bestseller || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Product;
  });
};

/**
 * Get bestseller products
 * @returns Promise resolving to array of bestseller products
 */
export const getBestSellers = async (): Promise<Product[]> => {
  const productsCol = collection(firestore, 'products');
  const productsQuery = query(
    productsCol,
    where('bestseller', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(productsQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      images: data.images || [],
      description: data.description || '',
      materials: data.materials || '',
      dimensions: data.dimensions || '',
      care: data.care || '',
      availability: data.availability || 'in_stock',
      featured: data.featured || false,
      newArrival: data.newArrival || false,
      bestseller: data.bestseller || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Product;
  });
};

/**
 * Get products by category
 * @param category - Category name
 * @returns Promise resolving to array of products in that category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const productsCol = collection(firestore, 'products');
  const productsQuery = query(
    productsCol,
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(productsQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      images: data.images || [],
      description: data.description || '',
      materials: data.materials || '',
      dimensions: data.dimensions || '',
      care: data.care || '',
      availability: data.availability || 'in_stock',
      featured: data.featured || false,
      newArrival: data.newArrival || false,
      bestseller: data.bestseller || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Product;
  });
};