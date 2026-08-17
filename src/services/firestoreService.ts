import { firestore } from '@/lib/firebase';

// Re-export firestore for use in other services or components
export { firestore };

// Example helper function to get a collection reference (not used yet, but available for future)
/**
 * Get a collection reference from Firestore
 * @param collectionName - Name of the collection
 */
export const getCollection = (collectionName: string) => {
  return firestore.collection(collectionName);
};

// Example helper function to get a document reference
/**
 * Get a document reference from Firestore
 * @param collectionName - Name of the collection
 * @param documentId - ID of the document (if null, returns a new document reference with auto-generated ID)
 */
export const getDocument = (collectionName: string, documentId: string | null = null) => {
  if (documentId) {
    return firestore.collection(collectionName).doc(documentId);
  }
  return firestore.collection(collectionName).doc();
};