"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
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
        router.push("/");
      }
    } catch (err) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-studio-50 p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-10 border border-studio-200 rounded-sm shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-semibold tracking-tight text-studio-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-studio-500 uppercase tracking-widest">Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-sm bg-red-50 p-4 text-sm text-red-700 border border-red-100">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email" required placeholder="Enter your email"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-studio-900 hover:underline">Forgot password?</Link>
                </div>
                <input
                  type="password" required placeholder="Enter your password"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-4 rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <p className="mt-10 text-center text-sm text-studio-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-studio-900 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
