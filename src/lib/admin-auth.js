import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config"; // Import primary db connection

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "API_KEY_PLACEHOLDER",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "PROJECT_ID.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "PROJECT_ID.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "APP_ID"
};

// Initialize Secondary App to prevent auto-logout of primary user
let secondaryApp;
let secondaryAuth;

// We only initialize this when the function is called to avoid unnecessary client-side overhead
function initSecondaryApp() {
  const existingApps = getApps();
  const secApp = existingApps.find(app => app.name === 'SecondaryAdminApp');
  
  if (secApp) {
    secondaryApp = secApp;
  } else {
    secondaryApp = initializeApp(firebaseConfig, 'SecondaryAdminApp');
  }
  
  secondaryAuth = getAuth(secondaryApp);
  return secondaryAuth;
}

export async function createAdminAccount(email, password, name) {
  try {
    const authInstance = initSecondaryApp();
    
    // Create user in Firebase Auth using the secondary app
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const newAdmin = userCredential.user;
    
    // Save to primary Firestore db
    // Collection "users" is used for RBAC (role-based access control)
    await setDoc(doc(db, "users", newAdmin.uid), {
      namaLengkap: name,
      email: email,
      noWa: "-",
      role: "admin",
      createdAt: new Date().toISOString()
    });
    
    // Sign out the secondary app immediately so it doesn't leave an active session hanging
    await authInstance.signOut();
    
    return { success: true, uid: newAdmin.uid };
  } catch (error) {
    console.error("Failed to create admin:", error);
    return { success: false, error: error.message };
  }
}
