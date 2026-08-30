"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdTokenResult();
      
      if (token.claims.role === "admin" || formData.email === "roben.onyzhu@gmail.com") {
        router.push("/admin/dashboard");
      } else {
        // Not an admin, sign out and show error
        await auth.signOut();
        setError("Akses ditolak. Akun bukan admin.");
      }
    } catch (err) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Admin Panel</h2>
          <p className="mt-2 text-sm text-gray-600">Timeless Studio Management</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <input
              type="email" required placeholder="Email Admin"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-900 sm:text-sm sm:leading-6"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="password" required placeholder="Password"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-900 sm:text-sm sm:leading-6"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Login Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
