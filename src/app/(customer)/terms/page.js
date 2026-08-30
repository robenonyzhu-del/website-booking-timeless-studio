import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="bg-studio-50 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-studio-200">
          <h1 className="text-3xl font-serif font-bold text-studio-900 mb-8 border-b pb-4">Syarat & Ketentuan</h1>
          
          <div className="space-y-8 text-studio-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">1. Kebijakan Keterlambatan</h2>
              <p>Waktu sesi self photo studio Anda dimulai tepat sesuai dengan jadwal yang telah Anda pesan. Apabila Anda datang terlambat, waktu sesi akan dipotong sesuai dengan keterlambatan Anda. Tidak ada kompensasi waktu tambahan untuk keterlambatan yang disebabkan oleh pelanggan.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">2. Kebijakan Pembatalan & Pengembalian Dana (Refund)</h2>
              <p>Pembayaran yang sudah masuk tidak dapat dikembalikan (No Refund). Apabila Anda berhalangan hadir, Anda dapat melakukan penjadwalan ulang maksimal 1x24 jam sebelum jadwal sesi Anda. Penjadwalan ulang mendadak tidak akan dilayani.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">3. Kebersihan dan Properti Studio</h2>
              <p>Pelanggan diwajibkan untuk menjaga kebersihan studio. Segala bentuk properti (kamera, lighting, kacamata, topi, dll) harus dikembalikan ke tempat semula dan dijaga dengan baik. Kerusakan atau kehilangan properti studio akibat kelalaian pelanggan akan dikenakan denda sesuai dengan nilai barang.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">4. Hak Cipta Soft File</h2>
              <p>Seluruh hasil foto (soft file) akan kami kirimkan paling lambat 1x24 jam melalui link Google Drive ke email atau WhatsApp Anda. Timeless Studio berhak untuk menyimpan foto-foto Anda untuk keperluan portofolio, namun kami akan selalu meminta izin terlebih dahulu apabila foto tersebut akan diunggah ke publik/media sosial kami.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
