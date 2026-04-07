import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.error("Kritik Xəta: Firebase API Key tapılmadı! .env.local faylını yoxlayın.");
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics =
  typeof window !== "undefined" 
    ? isSupported().then(yes => yes ? getAnalytics(app) : null) 
    : null;

/**
 * Şəkilləri Firebase Storage-ə yükləmək üçün köməkçi funksiya
 * Qeyd: Real layihədə şəkilləri 'browser-image-compression' və ya 
 * canvas vasitəsilə WebP formatına çevirib sonra yükləmək məsləhətdir (Bənd 32).
 */
export const uploadImage = async (file: File | Blob, fileName?: string) => {
  // Şəklin adını təhlükəsiz hala gətiririk
  const name = fileName || (file as File).name || "image";
  const safeName = name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const storageRef = ref(storage, `listings/${Date.now()}_${safeName}.webp`);
  const snapshot = await uploadBytes(storageRef, file, { contentType: 'image/webp' });
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

export default app;