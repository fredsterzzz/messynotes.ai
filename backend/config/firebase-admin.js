import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'messynotesai'
  });
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export const auth = admin.auth();
export const db = admin.firestore();
