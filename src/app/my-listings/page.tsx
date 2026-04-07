"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// TYPES
type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  createdAt?: Timestamp;
};

export default function MyListings() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 USER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 📦 DATA
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "listings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Listing),
      }));
      setListings(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // 🗑 DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await deleteDoc(doc(db, "listings", id));
  };

  // UI
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>

      {/* 🔄 Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* ❌ No user */}
      {!user && !loading && (
        <div className="text-center text-gray-500">
          Please login to see your listings
        </div>
      )}

      {/* 📭 Empty */}
      {user && !loading && listings.length === 0 && (
        <div className="text-center border rounded-xl p-10 text-gray-500">
          <p className="text-lg">No listings yet</p>
          <p className="text-sm">Start by posting your first ad 🚀</p>
        </div>
      )}

      {/* 📦 GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>

            <p className="text-blue-600 font-bold text-xl mb-2">
              {item.price} €
            </p>

            <p className="text-sm text-gray-500 mb-4">
              {item.category}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {item.createdAt?.toDate().toLocaleDateString() || ""}
              </span>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}