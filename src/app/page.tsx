"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Categories } from "@/components/Categories";
import { Listings } from "@/components/Listings";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/LanguageContext";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1'>
        {/* Hero Section - Axtarış və Başlıq */}
        <section className='relative py-12 md:py-20 overflow-hidden bg-gray-50/50 dark:bg-slate-900/20'>
          <div className='container mx-auto px-4 relative z-10'>
            <div className='max-w-4xl mx-auto text-center space-y-8'>
              <h1 className='text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight'>
                {t.hero_title_1}{" "}
                <span className='text-orange-500'>{t.hero_title_accent}</span>
                {t.hero_title_2}
              </h1>
              <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                {t.hero_subtitle}
              </p>

              {/* Main Search Bar */}
              <div className='max-w-2xl mx-auto relative group'>
                <div className='absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200'></div>
                <div className='relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-2 border border-gray-100 dark:border-slate-800'>
                  <div className='flex-1 flex items-center px-4'>
                    <Search className='h-5 w-5 text-gray-400 mr-3' />
                    <Input
                      type='text'
                      placeholder={t.search_placeholder}
                      className='border-none bg-transparent focus-visible:ring-0 text-base md:text-lg placeholder:text-gray-400 h-12 dark:text-white'
                    />
                  </div>
                  <Button className='h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all'>
                    {t.search_button}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Background decorations */}
          <div className='absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-0'>
            <div className='absolute -top-[10%] -left-[5%] w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50' />
            <div className='absolute top-[20%] -right-[5%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50' />
          </div>
        </section>

        {/* Categories Section (Category Grid) */}
        <Categories />

        {/* Point 23: Top Cities Section */}
        <section className='py-12 bg-background'>
          <div className='container mx-auto px-4'>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3'>
              <span className='w-1.5 h-8 bg-orange-500 rounded-full' />
              {t.top_cities_title}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[
                {
                  name: "Budva",
                  slug: "budva",
                  img: "https://images.unsplash.com/photo-1555990548-024886616462?auto=format&fit=crop&w=400&q=80",
                  count: "12,400+",
                },
                {
                  name: "Podgorica",
                  slug: "podgorica",
                  img: "https://images.unsplash.com/photo-1563294371-33104930250d?auto=format&fit=crop&w=400&q=80",
                  count: "8,900+",
                },
                {
                  name: "Bar",
                  slug: "bar",
                  img: "https://images.unsplash.com/photo-1589410714241-768143924f0c?auto=format&fit=crop&w=400&q=80",
                  count: "5,200+",
                },
              ].map((city) => (
                <Link
                  key={city.slug}
                    href={`/listings?city=${city.slug}`}
                  className='group relative h-48 rounded-3xl overflow-hidden shadow-lg'
                >
                  <img
                    src={city.img}
                    alt={city.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6'>
                    <h3 className='text-white font-bold text-xl'>
                      {city.name}
                    </h3>
                    <p className='text-orange-400 text-sm font-bold'>
                      {city.count} elan
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Point 24: Influencer Choice */}
        <section className='py-12 bg-orange-50/50 dark:bg-orange-950/10'>
          <div className='container mx-auto px-4'>
            <div className='bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-orange-100 dark:border-orange-900/30 shadow-sm flex flex-col md:flex-row items-center gap-8'>
              <div className='shrink-0 w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-1'>
                <div className='w-full h-full rounded-full bg-white p-1'>
                  <img
                    src='https://i.pravatar.cc/150?u=influencer'
                    className='w-full h-full rounded-full object-cover'
                    alt='Influencer'
                  />
                </div>
              </div>
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  {t.influencer_choice}
                </h2>
                <p className='text-gray-500 dark:text-gray-400 max-w-xl'>
                  Məşhur blogger Milica tərəfindən bu həftə seçilmiş ən maraqlı
                  elanlar.
                </p>
              </div>
              <Button className='ml-auto bg-orange-500 hover:bg-orange-600 rounded-2xl h-12 px-8 font-bold'>
                Hamısına bax
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Ads Section (Product Grid) */}
        <Listings />
      </main>

      <Footer />
    </div>
  );
}
