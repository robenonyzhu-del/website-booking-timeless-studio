import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dummyPackages = [
  { namaPaket: "Package A", kategori: "Intimate / Duos", hargaDasar: 30000, durasiMenit: 10, maksOrang: 2, deskripsi: "10 Mins Unlimited Shots, 1x Physical Print (4R), All Color-graded Soft Files", isPopular: false },
  { namaPaket: "Package B", kategori: "Group / Family", hargaDasar: 50000, durasiMenit: 15, maksOrang: 4, deskripsi: "15 Mins Unlimited Shots, 2x Physical Prints (4R), All Color-graded Soft Files", isPopular: true },
  { namaPaket: "ID Photo", kategori: "Formal / ID", hargaDasar: 35000, durasiMenit: 10, maksOrang: 1, deskripsi: "Max 5 Best Shots, Prints (2x3, 3x4, 4x6), Retouched Soft File", isPopular: false },
];

async function seed() {
  console.log("Memulai seeding Firestore...");

  const today = new Date();
  
  let batch = writeBatch(db);
  let count = 0;
  
  // Generate Schedules from today for the next 60 days
  for (let d = 0; d < 60; d++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + d);
    const dateStr = currentDate.toISOString().split("T")[0];
    
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
        
        const sch = {
          tanggal: dateStr,
          jamMulai,
          jamSelesai,
          statusSlot: "tersedia"
        };
        
        const ref = doc(collection(db, "schedules"));
        batch.set(ref, sch);
        count++;
        
        if (count === 400) {
           await batch.commit();
           console.log("Committed a batch of 400 schedules...");
           batch = writeBatch(db);
           count = 0;
        }
      }
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`Committed remaining ${count} schedules...`);
  }

  console.log("Seeding Firestore selesai untuk 2 bulan ke depan!");
  process.exit(0);
}

seed().catch(console.error);
