"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Email tidak ditemukan. Pastikan email sudah terdaftar.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
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
            <h2 className="text-3xl font-serif font-semibold tracking-tight text-studio-900">Forgot Password</h2>
            <p className="mt-2 text-sm text-studio-500 uppercase tracking-widest">Reset your password</p>
          </div>

          {success ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-sm bg-green-50 p-4 text-sm text-green-700 border border-green-100">
                Link reset password telah dikirim ke <strong>{email}</strong>. Silakan cek inbox atau folder spam Anda.
              </div>
              <Link
                href="/login"
                className="btn-primary w-full py-4 rounded-sm text-sm font-medium tracking-wide uppercase block text-center"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && <div className="rounded-sm bg-red-50 p-4 text-sm text-red-700 border border-red-100">{error}</div>}

              <div>
                <label className="block text-xs font-medium text-studio-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  className="block w-full rounded-sm border-0 py-3 px-4 text-studio-900 ring-1 ring-inset ring-studio-200 focus:ring-1 focus:ring-studio-900 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="mt-10 text-center text-sm text-studio-600">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-studio-900 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
