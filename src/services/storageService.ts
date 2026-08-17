import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param path - Storage path (e.g., 'products/image1.jpg')
 * @param file - File object (from input or Blob)
 * @returns Promise resolving to the download URL
 */
export const uploadFile = async (path: string, file: File | Blob): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

/**
 * Get download URL for a file stored in Firebase Storage
 * @param path - Storage path
 * @returns Promise resolving to the download URL
 */
export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path
 * @returns Promise that resolves when deletion is complete
 */
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
};

// Re-export storage for direct use if needed
export { storage };