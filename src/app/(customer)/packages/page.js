import { getPackages } from "@/lib/data";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <Navbar />
      <section className="flex-col p-6 lg:p-12 bg-studio-50 min-h-[calc(100vh-72px)]">
        <div className="max-w-5xl mx-auto w-full space-y-12">
          <div className="text-center space-y-4 pt-8">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-studio-900">Curated Packages</h2>
            <p className="text-studio-500 text-sm tracking-wide">Select a session tailored to your vision.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const features = pkg.deskripsi.split(", ");
              const isPopular = pkg.isPopular;

              return (
                <div key={pkg.id} className={isPopular 
                  ? "bg-studio-900 text-white p-8 border border-studio-900 flex flex-col justify-between relative shadow-lg transform md:-translate-y-4" 
                  : "bg-white p-8 border border-studio-900 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"}>
                  
                  {isPopular && <div className="absolute top-0 right-0 bg-white text-studio-900 text-[9px] font-bold px-3 py-1 uppercase tracking-widest">Most Popular</div>}
                  
                  <div>
                    <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${isPopular ? 'text-studio-400' : 'text-studio-400'}`}>{pkg.kategori}</span>
                    <h3 className={`text-2xl font-serif font-semibold mt-2 ${isPopular ? '' : 'text-studio-900'}`}>{pkg.namaPaket}</h3>
                    <div className="my-6">
                      <span className={`text-3xl font-medium ${isPopular ? '' : 'text-studio-900'}`}>Rp {pkg.hargaDasar.toLocaleString('id-ID')}</span>
                      <span className={`text-sm ${isPopular ? 'text-studio-400' : 'text-studio-500'}`}> / {pkg.durasiMenit} Min</span>
                    </div>
                    
                    <ul className={`text-sm space-y-4 mb-8 ${isPopular ? 'text-studio-300' : 'text-studio-600'}`}>
                      <li className="flex items-start gap-3">
                        <i className="fa-solid fa-check mt-1 text-xs"></i> Max {pkg.maksOrang} Person{pkg.maksOrang > 1 ? 's' : ''}
                      </li>
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <i className="fa-solid fa-check mt-1 text-xs"></i> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={`/booking?paket=${pkg.id}`} className={isPopular 
                    ? "bg-white text-studio-900 hover:bg-studio-100 transition-colors w-full py-3 rounded-sm text-sm text-center font-medium uppercase tracking-wide block mt-8" 
                    : "btn-outline w-full py-3 rounded-sm text-sm font-medium uppercase tracking-wide text-center block mt-8"}>
                    Select Package
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
