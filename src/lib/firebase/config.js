import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Placeholder untuk konfigurasi Firebase
// Silakan isi ini nanti ketika project Firebase sudah dibuat
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "API_KEY_PLACEHOLDER",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "PROJECT_ID.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "PROJECT_ID.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "APP_ID"
};

// Inisialisasi Firebase (mencegah multiple initialization di SSR/Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi layanan yang akan digunakan
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
