"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { isAdmin, loading };
}