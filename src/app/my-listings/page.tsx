"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ FIREBASE SETUP
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ TYPES
export type Listing = {
  id?: string;
  title: string;
  price: number;
  category: string;
  userId: string;
  createdAt: Timestamp | FieldValue | null;
};

// ✅ ADD LISTING
export const addListing = async (data: Omit<Listing, "id" | "createdAt">) => {
  await addDoc(collection(db, "listings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// ✅ MY LISTINGS PAGE
export default function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const auth = getAuth(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "listings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Listing[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Listing),
      }));
      setListings(data);
    });

    return () => unsub();
  }, [auth.currentUser]);

  return (
    <div>
      <h1>My Listings</h1>
      {listings.length === 0 && <p>No listings yet</p>}

      {listings.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.price}€</p>
        </div>
      ))}
    </div>
  );
}
