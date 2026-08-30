import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="bg-studio-50 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-studio-200">
          <h1 className="text-3xl font-serif font-bold text-studio-900 mb-8 border-b pb-4">Kebijakan Privasi</h1>
          
          <div className="space-y-8 text-studio-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">Pengumpulan Informasi</h2>
              <p>Kami di Timeless Studio mengumpulkan informasi dasar dari Anda seperti Nama Lengkap, Nomor Handphone (WhatsApp), dan Email pada saat Anda melakukan pendaftaran akun dan pemesanan layanan studio kami. Informasi ini hanya digunakan semata-mata untuk tujuan kelancaran operasional booking, verifikasi pembayaran, dan pengiriman file foto.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">Keamanan Data Anda</h2>
              <p>Kami sangat menghargai privasi pelanggan kami. Semua data yang dikumpulkan tersimpan secara aman dalam server Firebase kami dan dilengkapi dengan sistem keamanan standar industri. Kami tidak akan pernah menjual, menukar, atau memindahkan data pribadi Anda kepada pihak luar manapun.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">Penggunaan Foto (Portofolio)</h2>
              <p>File hasil foto self-studio Anda adalah hak milik privasi Anda. Kami berdedikasi menjaga kerahasiaannya. Namun, terkadang kami membutuhkan sampel untuk portofolio di Instagram atau website. Tim kami akan selalu mengirimkan pesan permintaan izin (consent) secara tertulis kepada Anda sebelum menayangkan wajah Anda di platform publik.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-studio-900 mb-4">Perubahan Kebijakan</h2>
              <p>Kebijakan privasi ini sewaktu-waktu bisa diperbarui sejalan dengan perkembangan fitur di dalam sistem kami. Kami menyarankan Anda untuk membaca ulang dokumen ini sesekali untuk melihat jika ada perubahan pada sistem kami.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
