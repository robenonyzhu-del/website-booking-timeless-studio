"use client";

import { useTransition, useState } from "react";
import {
  deleteScheduleAction, createScheduleAction, updateScheduleAction,
  updateBookingStatusAction,
  createPackageAction, updatePackageAction, deletePackageAction,
  createServiceAction, updateServiceAction, deleteServiceAction,
  createVoucherAction, updateVoucherAction, deleteVoucherAction
} from "@/app/admin/actions";

// ============================================================
// Shared Modal Shell
// ============================================================
function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-studio-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white p-8 max-w-md w-full rounded-2xl shadow-2xl border border-studio-100 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-serif font-bold text-studio-900">{title}</h3>
           <button onClick={onClose} type="button" className="w-8 h-8 rounded-full bg-studio-50 hover:bg-studio-100 flex items-center justify-center text-studio-500 transition-colors">
              <i className="fa-solid fa-xmark"></i>
           </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-xs font-bold uppercase tracking-wider text-studio-500 mb-2">{children}</label>;
}

function Input({ type = "text", ...props }) {
  return <input type={type} className="w-full bg-studio-50 border border-studio-200 p-3.5 text-sm font-medium focus:ring-2 focus:ring-studio-900 focus:border-studio-900 focus:outline-none rounded-xl transition shadow-sm hover:shadow-md" {...props} />;
}

function ModalButtons({ onClose, isPending, label = "Simpan" }) {
  return (
    <div className="flex gap-4 pt-6 mt-6 border-t border-studio-100">
      <button type="button" onClick={onClose} className="w-full py-3.5 bg-white border border-studio-200 hover:bg-studio-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Batal</button>
      <button type="submit" disabled={isPending} className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-studio-900/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
        {isPending ? "Menyimpan..." : label}
      </button>
    </div>
  );
}

// ============================================================
// SCHEDULES (existing, cleaned up)
// ============================================================
export function ActionButtons({ id, entityName }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStatus = new FormData(e.target).get("status_slot");
    startTransition(async () => {
      await updateScheduleAction(id, { status_slot: newStatus });
      setIsEditing(false);
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${entityName} ini?`)) {
      startTransition(() => deleteScheduleAction(id));
    }
  };

  return (
    <>
      <div className="flex justify-end gap-3">
        <button onClick={() => setIsEditing(true)} disabled={isPending} className="text-studio-600 hover:text-studio-900 font-medium text-xs uppercase tracking-wider disabled:opacity-50">Edit</button>
        <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 font-medium text-xs uppercase tracking-wider disabled:opacity-50">Hapus</button>
      </div>
      <Modal title={`Edit Status ${entityName}`} isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel>Pilih Status Baru</FieldLabel>
            <select name="status_slot" className="w-full ring-1 ring-gray-200 rounded-sm p-2 text-sm bg-white outline-none">
              <option value="tersedia">Tersedia</option>
              <option value="dipesan">Dipesan</option>
              <option value="tidak_tersedia">Tidak Tersedia</option>
            </select>
          </div>
          <ModalButtons onClose={() => setIsEditing(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

export function CreateButton({ label, entityName }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await createScheduleAction({
        tanggal: fd.get("tanggal"),
        jam_mulai: fd.get("jam_mulai"),
        jam_selesai: fd.get("jam_selesai"),
        status_slot: "tersedia"
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button" className="btn-primary block px-4 py-2 text-center text-xs tracking-widest font-semibold uppercase rounded-sm">
        {label}
      </button>
      <Modal title={`Tambah ${entityName} Baru`} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel>Tanggal</FieldLabel>
            <Input type="date" name="tanggal" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Mulai</FieldLabel>
              <Input type="time" name="jam_mulai" required />
            </div>
            <div>
              <FieldLabel>Selesai</FieldLabel>
              <Input type="time" name="jam_selesai" required />
            </div>
          </div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

// ============================================================
// BOOKINGS — Verify Payment
// ============================================================
export function VerifyPaymentButton({ id }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (window.confirm("Verifikasi pembayaran booking ini?")) {
      startTransition(() => updateBookingStatusAction(id, "dibayar"));
    }
  };

  return (
    <button onClick={handleClick} disabled={isPending} className="text-studio-900 hover:text-studio-600 font-medium text-sm disabled:opacity-50">
      {isPending ? "Memproses..." : "Verifikasi Bayar"}
    </button>
  );
}

// ============================================================
// PACKAGES — Create / Edit
// ============================================================
export function CreatePackageButton() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await createPackageAction({
        namaPaket: fd.get("namaPaket"),
        kategori: fd.get("kategori"),
        hargaDasar: fd.get("hargaDasar"),
        durasiMenit: fd.get("durasiMenit"),
        maksOrang: fd.get("maksOrang"),
        deskripsi: fd.get("deskripsi"),
        isPopular: fd.get("isPopular") === "on"
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button" className="block rounded-md bg-studio-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-studio-800">
        Tambah Paket
      </button>
      <Modal title="Tambah Paket Baru" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><FieldLabel>Nama Paket</FieldLabel><Input name="namaPaket" required /></div>
          <div><FieldLabel>Kategori</FieldLabel><Input name="kategori" required placeholder="e.g. Group / Family" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Harga (Rp)</FieldLabel><Input type="number" name="hargaDasar" required /></div>
            <div><FieldLabel>Durasi (Menit)</FieldLabel><Input type="number" name="durasiMenit" required /></div>
          </div>
          <div><FieldLabel>Maks Orang</FieldLabel><Input type="number" name="maksOrang" required /></div>
          <div><FieldLabel>Deskripsi (pisah koma)</FieldLabel><Input name="deskripsi" required placeholder="Fitur 1, Fitur 2, Fitur 3" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isPopular" id="isPopular" className="rounded" />
            <label htmlFor="isPopular" className="text-sm text-studio-600">Tandai sebagai Popular</label>
          </div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

export function EditPackageButton({ pkg }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await updatePackageAction(pkg.id, {
        namaPaket: fd.get("namaPaket"),
        kategori: fd.get("kategori"),
        hargaDasar: fd.get("hargaDasar"),
        durasiMenit: fd.get("durasiMenit"),
        maksOrang: fd.get("maksOrang"),
        deskripsi: fd.get("deskripsi"),
        isPopular: fd.get("isPopular") === "on"
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-studio-900 hover:text-studio-600">Edit</button>
      <Modal title="Edit Paket" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><FieldLabel>Nama Paket</FieldLabel><Input name="namaPaket" required defaultValue={pkg.namaPaket} /></div>
          <div><FieldLabel>Kategori</FieldLabel><Input name="kategori" required defaultValue={pkg.kategori} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Harga (Rp)</FieldLabel><Input type="number" name="hargaDasar" required defaultValue={pkg.hargaDasar} /></div>
            <div><FieldLabel>Durasi (Menit)</FieldLabel><Input type="number" name="durasiMenit" required defaultValue={pkg.durasiMenit} /></div>
          </div>
          <div><FieldLabel>Maks Orang</FieldLabel><Input type="number" name="maksOrang" required defaultValue={pkg.maksOrang} /></div>
          <div><FieldLabel>Deskripsi (pisah koma)</FieldLabel><Input name="deskripsi" required defaultValue={pkg.deskripsi} /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isPopular" id={`pop-${pkg.id}`} className="rounded" defaultChecked={pkg.isPopular} />
            <label htmlFor={`pop-${pkg.id}`} className="text-sm text-studio-600">Tandai sebagai Popular</label>
          </div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

// ============================================================
// ADDITIONAL SERVICES — Create / Edit
// ============================================================
export function CreateServiceButton() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await createServiceAction({
        namaLayanan: fd.get("namaLayanan"),
        hargaSatuan: fd.get("hargaSatuan")
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button" className="block rounded-md bg-studio-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-studio-800">
        Tambah Layanan
      </button>
      <Modal title="Tambah Layanan Baru" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><FieldLabel>Nama Layanan</FieldLabel><Input name="namaLayanan" required /></div>
          <div><FieldLabel>Harga Satuan (Rp)</FieldLabel><Input type="number" name="hargaSatuan" required /></div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

export function EditServiceButton({ svc }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await updateServiceAction(svc.id, {
        namaLayanan: fd.get("namaLayanan"),
        hargaSatuan: fd.get("hargaSatuan")
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-studio-900 hover:text-studio-600 mr-4">Edit</button>
      <Modal title="Edit Layanan" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><FieldLabel>Nama Layanan</FieldLabel><Input name="namaLayanan" required defaultValue={svc.namaLayanan} /></div>
          <div><FieldLabel>Harga Satuan (Rp)</FieldLabel><Input type="number" name="hargaSatuan" required defaultValue={svc.hargaSatuan} /></div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

export function DeleteServiceButton({ id }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      startTransition(() => deleteServiceAction(id));
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
      {isPending ? "..." : "Hapus"}
    </button>
  );
}

export function DeletePackageButton({ id }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      startTransition(() => deletePackageAction(id));
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
      {isPending ? "..." : "Hapus"}
    </button>
  );
}

// ============================================================
// VOUCHERS — Create / Edit / Delete
// ============================================================
export function CreateVoucherButton() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await createVoucherAction({
        kodeVoucher: fd.get("kodeVoucher"),
        tipeDiskon: fd.get("tipeDiskon"),
        nilaiDiskon: fd.get("nilaiDiskon"),
        tglBerakhir: fd.get("tglBerakhir"),
        kuota: fd.get("kuota")
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button" className="block rounded-md bg-studio-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-studio-800">
        Tambah Voucher
      </button>
      <Modal title="Tambah Voucher Baru" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><FieldLabel>Kode Voucher</FieldLabel><Input name="kodeVoucher" required placeholder="e.g. PROMO2026" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Tipe Diskon</FieldLabel>
              <select name="tipeDiskon" className="w-full ring-1 ring-gray-200 rounded-sm p-2 text-sm bg-white outline-none">
                <option value="persen">Persen (%)</option>
                <option value="nominal">Nominal (Rp)</option>
              </select>
            </div>
            <div><FieldLabel>Nilai Diskon</FieldLabel><Input type="number" name="nilaiDiskon" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Berlaku Sampai</FieldLabel><Input type="date" name="tglBerakhir" required /></div>
            <div><FieldLabel>Kuota</FieldLabel><Input type="number" name="kuota" required /></div>
          </div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

export function EditVoucherButton({ voucher }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    startTransition(async () => {
      await updateVoucherAction(voucher.id, {
        kodeVoucher: fd.get("kodeVoucher"),
        tipeDiskon: fd.get("tipeDiskon"),
        nilaiDiskon: fd.get("nilaiDiskon"),
        tglBerakhir: fd.get("tglBerakhir"),
        kuota: fd.get("kuota")
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-studio-900 hover:text-studio-600 mr-4">Edit</button>
      <Modal title="Edit Voucher" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><FieldLabel>Kode Voucher</FieldLabel><Input name="kodeVoucher" required defaultValue={voucher.kodeVoucher} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Tipe Diskon</FieldLabel>
              <select name="tipeDiskon" defaultValue={voucher.tipeDiskon} className="w-full ring-1 ring-gray-200 rounded-sm p-2 text-sm bg-white outline-none">
                <option value="persen">Persen (%)</option>
                <option value="nominal">Nominal (Rp)</option>
              </select>
            </div>
            <div><FieldLabel>Nilai Diskon</FieldLabel><Input type="number" name="nilaiDiskon" required defaultValue={voucher.nilaiDiskon} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Berlaku Sampai</FieldLabel><Input type="date" name="tglBerakhir" required defaultValue={voucher.tglBerakhir} /></div>
            <div><FieldLabel>Kuota</FieldLabel><Input type="number" name="kuota" required defaultValue={voucher.kuota} /></div>
          </div>
          <ModalButtons onClose={() => setIsOpen(false)} isPending={isPending} />
        </form>
      </Modal>
    </>
  );
}

export function DeleteVoucherButton({ id }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus voucher ini?")) {
      startTransition(() => deleteVoucherAction(id));
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
      {isPending ? "..." : "Hapus"}
    </button>
  );
}
