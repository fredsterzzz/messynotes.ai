import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Debug environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.toString().trim();
console.log('Raw API Key:', apiKey);

const firebaseConfig = {
  apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.toString().trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.toString().trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.toString().trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.toString().trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.toString().trim(),
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey?.slice(0, 5) + '...'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
