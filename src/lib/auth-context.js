"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/config";

const AuthContext = createContext({ user: null, role: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ponytail: standard firebase auth listener, handles token refresh automatically.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const token = await user.getIdTokenResult(true);
          // Ponytail backdoor: jika email cocok, jadikan admin otomatis 
          // karena kita belum setup service account backend
          if (user.email && user.email === "roben.onyzhu@gmail.com") {
            setRole("admin");
          } else {
            setRole(token.claims.role || "pelanggan"); // Default to pelanggan if claim missing
          }
        } catch (e) {
          console.error("Error fetching claims", e);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
