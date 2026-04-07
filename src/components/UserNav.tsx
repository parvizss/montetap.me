"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut, User as FirebaseUser } from "firebase/auth";
import {
  User,
  Settings,
  Heart,
  ListOrdered,
  LogOut,
  Bell,
  MessageCircle,
  Crown,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "sonner";

interface UserNavProps {
  user: (FirebaseUser & { isAdmin?: boolean }) | null;
  onLoginClick: () => void;
}

export function UserNav({ user, onLoginClick }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Menyunun kənarına klikləyəndə bağlanması
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className='flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors'
      >
        <User size={20} />
        <span>{t.login}</span>
      </button>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      toast.success("Çıxış edildi");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { label: t.my_listings, href: "/my-listings", icon: ListOrdered },
    {
      label: t.dashboard_messages,
      href: "/messages",
      icon: MessageCircle,
      count: 2,
    },
    { label: t.favorites, href: "/favorites", icon: Heart },
    { label: t.notifications, href: "/notifications", icon: Bell },
    { label: t.dashboard_settings, href: "/profile/settings", icon: Settings },
  ];

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 ring-2 ring-orange-500 ring-offset-2 focus:outline-none transition-all overflow-hidden hover:ring-orange-600 active:scale-95 shadow-sm'
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || ""}
            className='h-full w-full object-cover'
          />
        ) : (
          <span className='text-orange-600 font-bold'>
            {user.email?.charAt(0).toUpperCase()}
          </span>
        )}
        <span className='absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white' />
      </button>

      {isOpen && (
        <div className='absolute right-0 z-[100] mt-3 w-72 origin-top-right rounded-[2rem] bg-popover p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 border border-border'>
          {/* Profile Summary */}
          <div className='flex items-center gap-3 p-4 border-b border-border mb-2'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 overflow-hidden ring-2 ring-orange-50'>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=''
                  className='h-full w-full object-cover'
                />
              ) : (
                <User className='h-6 w-6 text-orange-600' />
              )}
            </div>
            <div className='flex flex-col min-w-0'>
              <p className='font-bold text-foreground truncate flex items-center gap-1'>
                {user.displayName || user.email?.split("@")[0]}
                {user.isAdmin && (
                  <Crown className='h-4 w-4 text-yellow-500 fill-yellow-500' />
                )}
              </p>
              <p className='text-xs text-gray-500 truncate'>{user.email}</p>
              <Link
                href='/profile'
                className='text-xs font-bold text-orange-600 hover:text-orange-700 mt-1'
                onClick={() => setIsOpen(false)}
              >
                {t.dashboard_profile}
              </Link>
            </div>
          </div>

          {/* Nav Links */}
          <div className='space-y-1'>
            {user.isAdmin && (
              <Link
                href='/admin'
                className='flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors'
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck className='h-5 w-5' />
                <span>{t.admin_panel_title}</span>
              </Link>
            )}
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className='group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-orange-500/10 hover:text-orange-500 transition-colors'
                onClick={() => setIsOpen(false)}
              >
                <item.icon className='h-5 w-5 text-muted-foreground group-hover:text-orange-600' />
                <span>{item.label}</span>
                {item.count && (
                  <span className='ml-auto bg-orange-100 text-[10px] font-black px-2 py-0.5 rounded-full text-orange-700'>
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Point 46: Məlumatların Silinməsi */}
          <div className='border-t border-border mt-2 pt-2'>
            <button
              onClick={() => {
                if (window.confirm(t.data_delete_confirm)) {
                  toast.info(
                    "Məlumatların silinməsi funksiyası tezliklə aktiv olacaq.",
                  );
                }
                setIsOpen(false);
              }}
              className='flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors'
            >
              <Trash2 className='h-5 w-5' />
              {t.delete_my_data}
            </button>
          </div>

          {/* Logout */}
          <div className='border-t border-border mt-2 pt-2'>
            <button
              onClick={handleSignOut}
              className='flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors'
            >
              <LogOut className='h-5 w-5' />
              {t.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
