"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  User,
  Menu,
  X,
  Globe,
  Moon,
  Sun,
  Mic,
  ShieldCheck,
  Type,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/lib/LanguageContext";
import { languages, Language } from "@/lib/translations";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { UserNav } from "./UserNav";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { language: lang, setLanguage: setLang, t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrueBlack, setIsTrueBlack] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const { theme, setTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [suggestion, setSuggestion] = useState<{
    slug: string;
    name: string;
  } | null>(null);

  // True Black və Font Size rejimlərini tətbiq etmək üçün
  useEffect(() => {
    const root = document.documentElement;
    if (isTrueBlack) root.classList.add("true-black");
    else root.classList.remove("true-black");
  }, [isTrueBlack]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "large") root.classList.add("text-large");
    else root.classList.remove("text-large");
  }, [fontSize]);

  const smartKeywords: Record<string, { slug: string; name: string }> = {
    bmw: { slug: "transport", name: "Transport" },
    mercedes: { slug: "transport", name: "Transport" },
    house: { slug: "real-estate", name: "Real Estate" },
    apartment: { slug: "real-estate", name: "Real Estate" },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });

    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((currentScroll / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateScroll);

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    const lowerVal = val.toLowerCase();
    const foundKeyword = Object.keys(smartKeywords).find((k) =>
      lowerVal.includes(k),
    );
    if (foundKeyword) setSuggestion(smartKeywords[foundKeyword]);
    else setSuggestion(null);
  };

  // Səsli Axtarış (Point 28)
  const handleVoiceSearch = () => {
    interface SpeechRecognitionEvent {
      results: { [key: number]: { [key: number]: { transcript: string } } };
    }

    interface SpeechRecognitionInterface {
      lang: string;
      onresult: (event: SpeechRecognitionEvent) => void;
      start: () => void;
    }

    const SpeechRecognition =
      (
        window as unknown as {
          SpeechRecognition?: new () => SpeechRecognitionInterface;
          webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
        }
      ).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 
      lang === "me" ? "sr-ME" : 
      lang === "ru" ? "ru-RU" : 
      lang === "tr" ? "tr-TR" : 
      "en-US";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setSearchQuery(text);

      // Point 4: Səsli komanda ilə filtrləmə (Smart Parsing)
      const lowerText = text.toLowerCase();
      if (lowerText.includes("avro") || lowerText.includes("euro")) {
        const priceMatch = lowerText.match(/\d+/);
        if (priceMatch) {
          router.push(
            `/search?q=${encodeURIComponent(text)}&maxPrice=${priceMatch[0]}`,
          );
          return;
        }
      }

      router.push(`/search?q=${encodeURIComponent(text)}`);
    };
    recognition.start();
  };

  return (
    <>
      <header className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm transition-all duration-300'>
        {/* Scroll indicator (Point 38) */}
        <div className='absolute bottom-0 left-0 h-0.5 w-full bg-transparent'>
          <div
            className='h-full bg-orange-500 transition-all duration-150'
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Top bar */}
        <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white py-1.5 text-center text-sm font-medium'>
          <span>{t.banner}</span>
        </div>

        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16 gap-4'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2 shrink-0'>
              <div className='bg-orange-500 rounded-xl px-3 py-2 flex items-center'>
                <span className='text-white font-black text-xl tracking-tight'>
                  montetap
                </span>
                <span className='text-white font-medium text-sm'>.me</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className='hidden md:flex flex-1 max-w-2xl mx-4'>
              <form onSubmit={handleSearch} className='relative w-full'>
                <Input
                  type='text'
                  placeholder={t.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className='w-full h-11 pl-4 pr-12 rounded-full border-2 border-input bg-muted/50 focus:border-primary focus:ring-primary text-sm transition-all'
                />
                {suggestion && (
                  <button
                    onClick={() => {
                      router.push(`/categories/${suggestion.slug}`);
                      setSuggestion(null);
                    }}
                    className='absolute -bottom-8 left-4 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md animate-in fade-in slide-in-from-top-1'
                  >
                  Suggested category: {suggestion.name}
                  </button>
                )}
                <button
                  type='button'
                  onClick={handleVoiceSearch}
                  className='absolute right-12 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors'
                  title={t.search_button}
                >
                  <Mic size={18} />
                </button>
                <Button
                  type='submit'
                  size='icon'
                  className='absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-orange-500 hover:bg-orange-600'
                >
                  <Search className='h-4 w-4 text-white' />
                </Button>
              </form>
            </div>

            {/* Actions - Desktop */}
            <div className='hidden md:flex items-center gap-3'>
              {/* Dark Mode Toggle (Point 23) */}
              <ThemeToggle />

              {/* Point 5: True Black Mode Toggle */}
              <button
                onClick={() => setIsTrueBlack(!isTrueBlack)}
                className={`p-2 rounded-full transition-colors ${isTrueBlack ? "bg-foreground text-background" : "hover:bg-accent text-muted-foreground"}`}
                title={t.true_black_mode}
              >
                <Palette size={20} />
              </button>
              {/* Font Size Toggle (Point 38) */}
              <button
                onClick={() =>
                  setFontSize(fontSize === "normal" ? "large" : "normal")
                }
                className={`p-2 rounded-full transition-colors ${fontSize === "large" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600" : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"}`}
                title={t.font_size_label}
              >
                <Type size={20} />
              </button>

              {/* Language Switcher */}
              <div className='flex items-center gap-1 mr-4 border-r pr-4 border-gray-200 dark:border-slate-800'>
                <Globe className='h-4 w-4 text-gray-400' />
                <select
                  value={lang}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setLang(e.target.value as Language)
                  }
                  className='text-sm font-semibold bg-transparent outline-none cursor-pointer text-gray-600 hover:text-orange-500'
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <UserNav
                user={
                  user
                    ? ({ ...user, isAdmin } as FirebaseUser & {
                        isAdmin: boolean;
                      })
                    : null
                }
                onLoginClick={() => setIsAuthModalOpen(true)}
              />

              <Link href='/create-listing'>
                <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 font-semibold'>
                  <Plus className='h-5 w-5 mr-2' />
                  {t.add_listing}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type='button'
              className='md:hidden p-2 text-gray-600'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className='md:hidden pb-3'>
            <form onSubmit={handleSearch} className='relative'>
              <Input
                type='text'
                placeholder={t.search_placeholder}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className='w-full h-10 pl-4 pr-10 rounded-full border-2 border-gray-200 dark:border-slate-800 dark:bg-slate-900 focus:border-orange-400'
              />
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 py-4 px-4 space-y-3'>
            {user ? (
              <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl'>
                {user.photoURL && (
                  <img
                    src={user.photoURL} // `alt` atributu əlavə edildi
                    alt={user.displayName || "User"}
                    className='w-12 h-12 rounded-full border-2 border-orange-200 object-cover'
                  />
                )}
                <div className='flex-1'>
                  <p className='font-bold text-gray-900'>
                    {user.displayName || user.email}
                  </p>
                  <Link
                    href='/profile'
                    className='text-xs font-bold text-orange-600 block mb-1'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.dashboard_profile}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className='text-sm text-orange-500 font-semibold'
                  >
                    {t.logout}
                  </button>
                </div>
              </div>
            ) : (
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className='h-5 w-5 mr-3' />
                {t.login}
              </Button>
            )}
            <Link href='/create-listing' className='w-full'>
              <Button className='w-full bg-orange-500 hover:bg-orange-600 text-white'>
                <Plus className='h-5 w-5 mr-3' />
                {t.add_listing}
              </Button>
            </Link>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
