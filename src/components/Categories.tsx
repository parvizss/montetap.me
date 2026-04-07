"use client";

import Link from "next/link";
import {
  Car,
  Home,
  Smartphone,
  Shirt,
  Briefcase,
  Wrench,
  Baby,
  Dumbbell,
  PawPrint,
  Gamepad2,
  BookOpen,
  MoreHorizontal,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const categories = [
  {
    slug: "neqliyyat",
    translationKey: "neqliyyat",
    icon: Car,
    color: "bg-blue-500",
    count: "45,892",
  },
  {
    slug: "dasinmaz-emlak",
    translationKey: "dasinmaz_emlak",
    icon: Home,
    color: "bg-green-500",
    count: "23,456",
  },
  {
    slug: "elektronika",
    translationKey: "elektronika",
    icon: Smartphone,
    color: "bg-purple-500",
    count: "67,234",
  },
  {
    slug: "geyim-ve-aksesuar",
    translationKey: "geyim",
    icon: Shirt,
    color: "bg-pink-500",
    count: "34,567",
  },
  {
    slug: "is-elanlari",
    translationKey: "is_elanlari",
    icon: Briefcase,
    color: "bg-indigo-500",
    count: "12,890",
  },
  {
    slug: "xidmetler",
    translationKey: "xidmetler",
    icon: Wrench,
    color: "bg-yellow-500",
    count: "8,765",
  },
  {
    slug: "usaq-dunyasi",
    translationKey: "usaq_dunyasi",
    icon: Baby,
    color: "bg-red-400",
    count: "15,432",
  },
  {
    slug: "idman-ve-hobbi",
    translationKey: "idman",
    icon: Dumbbell,
    color: "bg-teal-500",
    count: "9,876",
  },
  {
    slug: "heyvanlar",
    translationKey: "heyvanlar",
    icon: PawPrint,
    color: "bg-orange-400",
    count: "5,678",
  },
  {
    slug: "oyunlar",
    translationKey: "oyunlar",
    icon: Gamepad2,
    color: "bg-cyan-500",
    count: "11,234",
  },
  {
    slug: "kitab-ve-derslikler",
    translationKey: "kitablar",
    icon: BookOpen,
    color: "bg-amber-600",
    count: "7,654",
  },
  {
    slug: "itmis-esyalar",
    translationKey: "cat_lost_found",
    icon: HelpCircle,
    color: "bg-orange-600",
    count: "Sosial Layihə",
  },
  {
    slug: "all",
    translationKey: "hamisi",
    icon: MoreHorizontal,
    color: "bg-gray-500",
    count: "",
  },
];

export function Categories() {
  const { t } = useLanguage();

  return (
    <section className='py-12 bg-background'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3'>
          <span className='w-1.5 h-8 bg-orange-500 rounded-full' />
          {t.categories_title}
        </h2>

        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3 md:gap-4'>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className='group flex flex-col items-center p-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-50 dark:border-slate-800 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1.5'
              >
                <div
                  className={`${category.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className='h-7 w-7 text-white' />
                </div>
                <span className='text-sm font-bold text-gray-800 dark:text-white text-center leading-tight mb-1'>
                  {t.cats[category.translationKey]}
                </span>
                {category.count && (
                  <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    {category.count} elan
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
