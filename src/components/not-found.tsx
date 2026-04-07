"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <Header />
      <main className='flex-1 flex flex-col items-center justify-center p-4 text-center'>
        <div className='relative mb-8'>
          <h1 className='text-9xl font-black text-gray-100 select-none'>404</h1>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Compass className='h-24 w-24 text-orange-500 animate-[spin_10s_linear_infinite]' />
          </div>
        </div>

        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          Ups! Səhifə dumanlar içində itdi...
        </h2>
        <p className='text-gray-500 max-w-md mb-8'>
          Monteneqronun gözəl dağlarında yolunuzu azmısınız? Narahat olmayın,
          ana səhifəyə qayıtmaq üçün bir yolumuz var.
        </p>

        <div className='flex flex-col sm:flex-row gap-4'>
          <Link href='/'>
            <Button className='bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-2xl font-bold gap-2'>
              <Home size={18} /> Ana səhifəyə qayıt
            </Button>
          </Link>
          <Link href='/search'>
            <Button
              variant='outline'
              className='h-12 px-8 rounded-2xl font-bold gap-2'
            >
              <Search size={18} /> Yeni axtarış et
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
