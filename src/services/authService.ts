import {
  auth,
  // We'll import the firestore and storage if needed for auth, but for now just auth
} from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';

/**
 * Sign in with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns Promise resolving to UserCredential
 */
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 * @returns Promise that resolves when sign out is complete
 */
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

/**
 * Observe authentication state changes
 * @param callback - Function to call when auth state changes, receives the current user (or null)
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current authenticated user
 * @returns Current user or null if not signed in
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};