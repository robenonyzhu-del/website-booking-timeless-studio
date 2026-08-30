"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, role, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-white border-b border-studio-900 sticky top-0 z-50 h-[72px] flex items-center shadow-sm">
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <Image src="/logo.jpg" alt="Timeless Studio Logo" width={32} height={32} className="object-contain rounded md:w-[40px] md:h-[40px]" />
          <div>
            <span className="font-serif font-bold text-base md:text-xl tracking-wide text-studio-900 block leading-none">TIMELESS</span>
            <span className="text-[8px] md:text-[10px] text-studio-500 tracking-[0.2em] uppercase block mt-0.5 md:mt-1">Photo Studio</span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-studio-600">
          <Link href="/" className="hover:text-studio-900 transition">Home</Link>
          <Link href="/packages" className="hover:text-studio-900 transition">Packages</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {!loading && user ? (
            <>
              <Link href="/booking" className="btn-primary text-[10px] md:text-sm px-3 md:px-6 py-1.5 md:py-2.5 rounded-sm font-medium tracking-wide">
                Book Session
              </Link>

              {/* Profile Icon + Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-studio-900 text-white flex items-center justify-center text-xs md:text-sm font-semibold uppercase hover:bg-studio-800 transition"
                >
                  {user.email.charAt(0)}
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-studio-200 rounded-sm shadow-lg py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-studio-100">
                      <p className="text-sm font-semibold text-studio-900 truncate">{user.displayName || user.email.split("@")[0]}</p>
                      <p className="text-xs text-studio-400 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link href="/history" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-studio-600 hover:bg-studio-50 hover:text-studio-900 transition">
                        <i className="fa-solid fa-ticket w-4 text-center text-xs"></i> My Tickets
                      </Link>
                      {role === "admin" && (
                        <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-studio-900 hover:bg-studio-100 hover:text-studio-800 transition">
                          <i className="fa-solid fa-gauge w-4 text-center text-xs"></i> Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-studio-100 pt-1">
                      <button
                        onClick={() => { logout(); setOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition w-full text-left"
                      >
                        <i className="fa-solid fa-right-from-bracket w-4 text-center text-xs"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[10px] md:text-sm font-medium text-studio-600 hover:text-studio-900 transition">
                Login
              </Link>
              <Link href="/booking" className="btn-primary text-[10px] md:text-sm px-3 md:px-6 py-1.5 md:py-2.5 rounded-sm font-medium tracking-wide">
                Book Session
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
