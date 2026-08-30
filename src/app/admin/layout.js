"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Bookings", href: "/admin/bookings" },
    { name: "Packages", href: "/admin/packages" },
    { name: "Schedules", href: "/admin/schedules" },
    { name: "Vouchers", href: "/admin/vouchers" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Manajemen Admin", href: "/admin/users" },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-studio-50 flex flex-col md:flex-row">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-studio-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <Link href="/" className="block">
            <h2 className="text-lg font-serif font-bold text-white tracking-wide">TIMELESS</h2>
          </Link>
          <button onClick={toggleSidebar} className="text-white focus:outline-none p-2 rounded-md hover:bg-white/10">
            <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 z-50 h-screen
          w-64 bg-studio-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 pb-2 hidden md:block">
            <Link href="/" className="block">
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">TIMELESS</h2>
              <p className="text-[10px] text-studio-400 tracking-[0.2em] uppercase mt-1">Admin Panel</p>
            </Link>
          </div>
          <nav className="flex-1 px-4 mt-8 md:mt-8 space-y-1 text-sm font-medium overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-3 rounded-sm transition ${
                    isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-studio-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto w-full md:w-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
