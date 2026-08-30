"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles = ["pelanggan", "admin"] }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role && !allowedRoles.includes(role)) {
        // Redirect non-admin trying to access admin
        router.push("/");
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (loading || !user || (role && !allowedRoles.includes(role))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Memuat...</div>
      </div>
    );
  }

  return children;
}
