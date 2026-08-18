import { firestore } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { Category } from '@/types/firebase';

/**
 * Get all categories from Firestore
 * @returns Promise resolving to array of categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const categoriesCol = collection(firestore, 'categories');
  const categoriesQuery = query(categoriesCol, orderBy('orderNumber', 'asc'));
  const querySnapshot = await getDocs(categoriesQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      image: data.image || '',
      available: data.available !== undefined ? data.available : true,
      orderNumber: data.orderNumber || 0,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Category;
  });
};

/**
 * Get only available categories
 * @returns Promise resolving to array of available categories
 */
export const getAvailableCategories = async (): Promise<Category[]> => {
  const categoriesCol = collection(firestore, 'categories');
  const categoriesQuery = query(
    categoriesCol,
    where('available', '==', true),
    orderBy('orderNumber', 'asc')
  );
  const querySnapshot = await getDocs(categoriesQuery);

  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      image: data.image || '',
      available: data.available !== undefined ? data.available : true,
      orderNumber: data.orderNumber || 0,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || ''
    } as Category;
  });
};