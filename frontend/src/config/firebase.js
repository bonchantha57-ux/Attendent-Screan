// Firebase Client SDK Configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAENxaXRCLxnA5YqJzCJTIjnLrbzWKQUOs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "test-ca6dd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "test-ca6dd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "test-ca6dd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "64302962042",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:64302962042:web:5b7dc3a279f7236121f2c3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-628XM8ZBVH",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://test-ca6dd-default-rtdb.firebaseio.com",
};

let app = null;
let firestore = null;
let database = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firestore = getFirestore(app);
  if (firebaseConfig.databaseURL) {
    database = getDatabase(app);
  }
  console.log('🔥 Connected to Firebase Web Client (test-ca6dd)');
} catch (error) {
  console.warn('Firebase client init notice:', error.message);
}

export { app, firestore, database };

