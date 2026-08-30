"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nama: "", email: "", password: "", no_telepon: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Set Custom Claim 'pelanggan' (opsional jika belum ada service account)
      const token = await userCredential.user.getIdToken();
      try {
        await fetch("/api/auth/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token, role: "pelanggan" })
        });
      } catch (e) {
        // Abaikan error jika backend belum dikonfigurasi service account-nya
        // Context auth kita otomatis memberikan default 'pelanggan'
        console.warn("Gagal set custom claim, fallback ke default pelanggan.");
      }
      
      // Force token refresh to get new claims
      await userCredential.user.getIdToken(true);

      // ponytail: Data Connect user record would be inserted here via GraphQL mutation
      // For now, auth is working. Data Connect integration can be added when DB is live.

      router.push("/");
    } catch (err) {
      setError(err.message || "Gagal melakukan registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-studio-50 p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-10 border border-studio-200 rounded-sm shadow-sm my-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-semibold tracking-tight text-studio-900">Create Account</h2>
            <p className="mt-2 text-sm text-studio-500 uppercase tracking-widest">Join Timeless Studio</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-sm bg-red-50 p-4 text-sm text-red-700 border border-red-100">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text" required placeholder="Enter your full name"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email" required placeholder="Enter your email"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text" required placeholder="Enter your phone number"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={formData.no_telepon} onChange={e => setFormData({...formData, no_telepon: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password" required placeholder="Create a password"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-4 rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-50"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
          
          <p className="mt-10 text-center text-sm text-studio-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-studio-900 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
