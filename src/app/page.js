import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center text-center p-6 lg:p-12 bg-white min-h-[calc(100vh-72px)]">
        <div className="max-w-3xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-studio-500">
            Premium Self Photo Studio in Sumedang
          </span>
          
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-studio-900 leading-tight">
            Capture your true essence, uninterrupted.
          </h1>
          
          <p className="text-studio-600 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Experience professional-grade lighting and absolute privacy. Reserve your session seamlessly and create timeless memories without a photographer.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/packages" 
              className="btn-primary px-8 py-4 rounded-sm text-sm font-medium tracking-wide w-full sm:w-auto inline-block text-center"
            >
              View Packages
            </Link>
            <Link 
              href="/booking" 
              className="btn-outline px-8 py-4 rounded-sm text-sm font-medium tracking-wide w-full sm:w-auto inline-block text-center"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
