import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { FavoritesProvider } from "../../FavoritesContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "montetap.me - Montenegro Classifieds",
  description: "Buy and sell in Montenegro",
};

export default function RootLayout({
  // `lang` atributu əlavə edildi
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head></head>
      <body suppressHydrationWarning className='antialiased min-h-screen'>
        <LanguageProvider>
          <ThemeProvider>
            <Toaster position='top-center' richColors />
            <FavoritesProvider>
              <ClientBody>{children}</ClientBody>
            </FavoritesProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
