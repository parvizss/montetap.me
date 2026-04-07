"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "sonner";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className='bg-gray-900 text-white'>
      {/* Main footer */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {/* Logo and description */}
          <div className='col-span-2 md:col-span-1'>
            <div className='bg-orange-500 rounded-xl px-3 py-2 inline-flex items-center mb-4'>
              <span className='text-white font-black text-xl tracking-tight'>
                montetap
              </span>
              <span className='text-white font-medium text-sm'>.me</span>
            </div>
            <p className='text-gray-400 text-sm leading-relaxed mb-4'>
              {t.footer_desc}
            </p>
            <div className='flex gap-3'>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors'
              >
                <Instagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors'
              >
                <Youtube className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors'
              >
                <MessageCircle className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className='font-bold text-white mb-4'>{t.categories_title}</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.cats.neqliyyat}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.cats.dasinmaz_emlak}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.cats.elektronika}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.cats.is_elanlari}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.cats.xidmetler}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-white mb-4'>{t.about_us}</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_about_company}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_rules}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_privacy}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_ads}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_contact}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-white mb-4'>{t.support}</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_help}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_security}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_faq}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-orange-400 transition-colors'>
                  {t.footer_app}
                </a>
              </li>
              <li className='pt-2'>
                <button
                  onClick={() =>
                    toast.success(
                      "Fikirləriniz bizim üçün önəmlidir! Tezliklə anket açılacaq.",
                    )
                  }
                  className='flex items-center gap-2 bg-gray-800 text-orange-400 px-3 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider'
                >
                  <HeartHandshake className='h-3 w-3' />
                  Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-gray-800'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-gray-500'>
              © 2026 montetap.me — {t.all_rights}
            </p>
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <a href='#' className='hover:text-orange-400 transition-colors'>
                {t.footer_terms}
              </a>
              <span>•</span>
              <a href='#' className='hover:text-orange-400 transition-colors'>
                {t.footer_privacy_short}
              </a>
              <span>•</span>
              <a href='#' className='hover:text-orange-400 transition-colors'>
                {t.footer_cookies}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
