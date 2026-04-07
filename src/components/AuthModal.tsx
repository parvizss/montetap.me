"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogIn, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Modal hər dəfə açılanda xəta mesajını sıfırla
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  // Point 2: Auth state dəyişəndə (login olanda) modalı bağla
  useEffect(() => {
    if (!isOpen) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setError(null); // Uğurlu giriş zamanı xətanı təmizlə
        onClose();
      }
    });
    return () => unsub();
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Welcome, " + user.displayName);
      onClose();
      router.push("/profile"); // Point 4: Profil səhifəsinə yönləndir
    } catch (error: unknown) {
      console.error("Auth error:", error);
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code !== "auth/popup-closed-by-user"
      ) {
        const message = "Authentication failed. Please try again.";
        setError(message);
        toast.error(message);
      }
    }
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='relative w-full max-w-md bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200'>
        <button
          onClick={onClose}
          className='absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors'
        >
          <X size={20} />
        </button>

        <div className='flex flex-col items-center gap-6 py-10 px-6 bg-card text-card-foreground'>
          <div className='h-20 w-20 rounded-[2rem] bg-orange-100 flex items-center justify-center text-orange-500 mb-2'>
            <LogIn size={40} />
          </div>
          <div className='text-center'>
            <h2 className='text-2xl font-black mb-2'>{t.auth_login}</h2>
            <p className='text-muted-foreground text-sm px-4'>
              {t.new_listing_subtitle}
            </p>
          </div>
          {error && (
            <div className='w-full p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-1'>
              {error}
            </div>
          )}
          <Button
            onClick={loginWithGoogle}
            className='w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-lg font-bold gap-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95'
          >
            {t.auth_login} (Google)
          </Button>
        </div>
      </div>
    </div>
  );
}
