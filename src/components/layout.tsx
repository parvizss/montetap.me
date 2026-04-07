"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Loader2,
  ShieldAlert,
  Home,
  LayoutDashboard,
  ListOrdered,
  Users,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAdmin === null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Loader2 className='h-10 w-10 animate-spin text-orange-500' />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center'>
        <div className='bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6'>
          <ShieldAlert className='h-16 w-16 text-red-500' />
        </div>
        <h1 className='text-2xl font-black text-foreground mb-2'>
          {t.admin_restricted}
        </h1>
        <Link href='/'>
          <Button className='bg-orange-500 hover:bg-orange-600 rounded-2xl h-12 px-8 font-bold gap-2'>
            <Home size={18} /> {t.admin_go_back}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='flex h-screen bg-background text-foreground'>
      {/* Sidebar */}
      <aside className='w-64 bg-slate-900 text-white flex flex-col'>
        <div className='p-6 border-b border-slate-800'>
          <Link href='/admin' className='flex items-center gap-2'>
            <div className='bg-orange-500 rounded-lg px-2 py-1'>
              <span className='font-bold text-lg'>Admin</span>
            </div>
            <span className='font-semibold text-slate-400 italic'>Panel</span>
          </Link>
        </div>

        <nav className='flex-1 p-4 space-y-1'>
          <Link
            href='/admin'
            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white'
          >
            <LayoutDashboard size={20} />
            <span className='font-medium'>Dashboard</span>
          </Link>
          <Link
            href='/admin/listings'
            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white'
          >
            <ListOrdered size={20} />
            <span className='font-medium'>Elanlar</span>
          </Link>
          <Link
            href='/admin/users'
            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white'
          >
            <Users size={20} />
            <span className='font-medium'>İstifadəçilər</span>
          </Link>
          <Link
            href='/admin/settings'
            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white'
          >
            <Settings size={20} />
            <span className='font-medium'>Tənzimləmələr</span>
          </Link>
        </nav>

        <div className='p-4 border-t border-slate-800'>
          <Link
            href='/'
            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/20 text-red-400 transition-colors font-medium'
          >
            <LogOut size={20} /> Sayta qayıt
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        <header className='h-16 bg-background border-b border-border flex items-center justify-between px-8 shrink-0'>
          <div className='flex items-center gap-4 text-slate-400 italic font-medium'>
            İdarəetmə Paneli v1.0
          </div>
          <div className='flex items-center gap-6'>
            <button className='text-muted-foreground hover:text-orange-500 transition-colors relative'>
              <Bell size={20} />
              <span className='absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background'></span>
            </button>
            <div className='w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold border border-border'>
              AD
            </div>
          </div>
        </header>

        <div className='flex-1 overflow-y-auto p-8 bg-muted/30'>{children}</div>
      </main>
    </div>
  );
}
