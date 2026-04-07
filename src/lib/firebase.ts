"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔥 ENV-dən gəlir (Vercel-də əlavə edəcəksən)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
};

// 🔒 App init (duplicate qarşısı alınır)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔥 Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 📸 Image upload helper
export const uploadImage = async (file: File | Blob) => {
  const safeName = "image_" + Date.now() + ".webp";
  const storageRef = ref(storage, `listings/${safeName}`);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: "image/webp",
  });
  return await getDownloadURL(snapshot.ref);
};

export default app;