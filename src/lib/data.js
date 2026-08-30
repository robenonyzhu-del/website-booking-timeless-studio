import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase/config";

export const dummyPackages = [
  { id: "pkg1", namaPaket: "Package A", kategori: "Intimate / Duos", hargaDasar: 30000, durasiMenit: 10, maksOrang: 2, deskripsi: "10 Mins Unlimited Shots, 1x Physical Print (4R), All Color-graded Soft Files", isPopular: false },
  { id: "pkg2", namaPaket: "Package B", kategori: "Group / Family", hargaDasar: 50000, durasiMenit: 15, maksOrang: 4, deskripsi: "15 Mins Unlimited Shots, 2x Physical Prints (4R), All Color-graded Soft Files", isPopular: true },
  { id: "pkg3", namaPaket: "ID Photo", kategori: "Formal / ID", hargaDasar: 35000, durasiMenit: 10, maksOrang: 1, deskripsi: "Max 5 Best Shots, Prints (2x3, 3x4, 4x6), Retouched Soft File", isPopular: false },
];

export const dummySchedules = [
  { id: "sch1", tanggal: "2026-09-01", jamMulai: "09:00", jamSelesai: "09:30", statusSlot: "tersedia" },
  { id: "sch2", tanggal: "2026-09-01", jamMulai: "09:30", jamSelesai: "10:00", statusSlot: "dipesan" },
  { id: "sch3", tanggal: "2026-09-01", jamMulai: "10:00", jamSelesai: "10:30", statusSlot: "tersedia" },
  { id: "sch4", tanggal: "2026-09-02", jamMulai: "14:00", jamSelesai: "14:30", statusSlot: "tersedia" },
  { id: "sch5", tanggal: "2026-09-02", jamMulai: "14:30", jamSelesai: "15:00", statusSlot: "tidak_tersedia" },
];

export const getPackages = async () => {
  const q = query(collection(db, "packages"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id,
      id_paket: doc.id, 
      nama_paket: data.namaPaket,
      kategori: data.kategori,
      harga_dasar: data.hargaDasar,
      durasi_menit: data.durasiMenit,
      maks_orang: data.maksOrang,
      deskripsi: data.deskripsi,
      isPopular: data.isPopular,
      ...data
    };
  });
};

export const getPackageById = async (id) => {
  const docRef = doc(db, "packages", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
};

export const getAdditionalServices = async () => {
  const q = query(collection(db, "additionalServices"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSchedules = async (tanggal) => {
  if (!tanggal) return [];
  
  // 1. Generate slots
  const slots = [];
  for (let h = 10; h <= 17; h++) {
    for (let m of ["00", "30"]) {
      const jamMulai = `${h.toString().padStart(2, '0')}:${m}`;
      let endH = h;
      let endM = "30";
      if (m === "30") {
         endH = h + 1;
         endM = "00";
      }
      const jamSelesai = `${endH.toString().padStart(2, '0')}:${endM}`;
      const id = `${tanggal}-${jamMulai.replace(':', '')}`;
      
      slots.push({
        id,
        id_jadwal: id,
        tanggal,
        jam_mulai: jamMulai,
        jamMulai,
        jam_selesai: jamSelesai,
        jamSelesai,
        status_slot: "tersedia",
        statusSlot: "tersedia"
      });
    }
  }

  // 2. Fetch bookings for that date
  const q = query(collection(db, "bookings"), where("tanggal", "==", tanggal));
  const snapshot = await getDocs(q);
  const bookedJamMulai = new Set();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.status !== "dibatalkan" && data.status !== "kadaluarsa") {
       if (data.jamMulai) {
         bookedJamMulai.add(data.jamMulai);
       }
    }
  });

  // 3. Mark booked slots
  return slots.map(slot => {
    if (bookedJamMulai.has(slot.jamMulai)) {
      slot.status_slot = "dipesan";
      slot.statusSlot = "dipesan";
    }
    return slot;
  });
};

export const getVouchers = async () => {
  const q = query(collection(db, "vouchers"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const checkVoucherKode = async (kode) => {
  const q = query(collection(db, "vouchers"), where("kodeVoucher", "==", kode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const getBookings = async () => {
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Manual join for Package and Schedule
  for (let b of bookings) {
    if (b.packageId) {
      const pkg = await getPackageById(b.packageId);
      b.package = pkg || { namaPaket: "Unknown Package" };
    }
    
    if (b.tanggal && b.jamMulai) {
      let [h, m] = b.jamMulai.split(':');
      let endH = parseInt(h);
      let endM = "30";
      if (m === "30") { endH++; endM = "00"; }
      b.schedule = { tanggal: b.tanggal, jamMulai: b.jamMulai, jamSelesai: `${endH.toString().padStart(2, '0')}:${endM}` };
    } else if (b.scheduleId) {
      const schRef = doc(db, "schedules", b.scheduleId);
      const schSnap = await getDoc(schRef);
      b.schedule = schSnap.exists() ? { id: schSnap.id, ...schSnap.data() } : { tanggal: "-", jamMulai: "-", jamSelesai: "-" };
    } else {
      b.schedule = { tanggal: "-", jamMulai: "-", jamSelesai: "-" };
    }
  }
  
  return bookings;
};

export const getBookingById = async (kode) => {
  const q = query(collection(db, "bookings"), where("kodeBooking", "==", kode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const b = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  if (b.packageId) {
    b.package = await getPackageById(b.packageId);
  }
  
  if (b.tanggal && b.jamMulai) {
    let [h, m] = b.jamMulai.split(':');
    let endH = parseInt(h);
    let endM = "30";
    if (m === "30") { endH++; endM = "00"; }
    b.schedule = { tanggal: b.tanggal, jamMulai: b.jamMulai, jamSelesai: `${endH.toString().padStart(2, '0')}:${endM}` };
  } else if (b.scheduleId) {
    const schRef = doc(db, "schedules", b.scheduleId);
    const schSnap = await getDoc(schRef);
    b.schedule = schSnap.exists() ? { id: schSnap.id, ...schSnap.data() } : null;
  }
  return b;
};

export const getBookingsByEmail = async (email) => {
  const q = query(collection(db, "bookings"), where("email", "==", email));
  const snapshot = await getDocs(q);
  const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Sort in-memory to avoid Firestore composite index requirements
  bookings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  
  // Manual join for Package and Schedule
  for (let b of bookings) {
    if (b.packageId) {
      const pkg = await getPackageById(b.packageId);
      b.package = pkg || { namaPaket: "Unknown Package", kategori: "-" };
    }
    
    if (b.tanggal && b.jamMulai) {
      let [h, m] = b.jamMulai.split(':');
      let endH = parseInt(h);
      let endM = "30";
      if (m === "30") { endH++; endM = "00"; }
      b.schedule = { tanggal: b.tanggal, jamMulai: b.jamMulai, jamSelesai: `${endH.toString().padStart(2, '0')}:${endM}` };
    } else if (b.scheduleId) {
      const schRef = doc(db, "schedules", b.scheduleId);
      const schSnap = await getDoc(schRef);
      b.schedule = schSnap.exists() ? { id: schSnap.id, ...schSnap.data() } : { tanggal: "-", jamMulai: "-", jamSelesai: "-" };
    } else {
      b.schedule = { tanggal: "-", jamMulai: "-", jamSelesai: "-" };
    }
  }
  
  return bookings;
};
