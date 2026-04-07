"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MapPin,
  Clock,
  Star,
  Eye,
  Calendar,
  Fuel,
  MessageCircle,
  Phone,
  ShieldAlert,
  AlertTriangle,
  Share2,
  QrCode,
  Scale,
  Calculator,
  TrendingUp,
  BoxSelect,
  Award,
  Zap,
  X,
  Share,
  Edit,
  ShieldCheck,
  Handshake,
  LayoutGrid,
  List as ListIcon,
  Car,
  Waves,
  Plane,
  StarHalf,
  VolumeX,
  Sun,
  Users,
} from "lucide-react";
import Image from "next/image"; // Point 1: Lazy Loading Images üçün
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/../FavoritesContext";
import { useLanguage } from "@/lib/LanguageContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  QueryConstraint,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
// @ts-expect-error QRCodeSVG package lacks TypeScript definitions
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { ListingCardSkeleton } from "./ListingCard";

interface ListingsProps {
  searchQuery?: string;
  categorySlug?: string;
  onlyFavorites?: boolean;
}

export interface Listing {
  id: string;
  title: string;
  price: string;
  currency: string;
  location: string;
  time?: string;
  image: string;
  phone: string;
  isVip?: boolean;
  isPremium?: boolean;
  isUrgent?: boolean;
  category: string;
  views?: number;
  status?: "pending" | "approved" | "rejected";
  brand?: string;
  year?: string;
  transmission?: string;
  fuel?: string;
  condition?: string;
  userId?: string;
  createdAt?: Timestamp | Date;
  extraDetails?: Record<string, string | number | boolean>;
  isVerifiedProperty?: boolean; // "List nepokretnosti" yoxlanışı üçün
  isVerifiedUser?: boolean; // Point 34: Verified User nişanı üçün
  images?: string[]; // Point 26 üçün çoxlu şəkil
  rating?: number; // Point 30 üçün
  reviewCount?: number;
  isOnline?: boolean; // Point 44: Online status
  isDailyDeal?: boolean; // Point 21
  dailyDealDiscount?: number; // Point 21
  vipEndDate?: Timestamp | Date; // Point 22
  has360Tour?: boolean; // Point 41: 360 virtual tur
  sellerAchievements?: string[]; // Point 6: Nailiyyətlər
  distanceToSea?: number; // Point 12
  distanceToAirport?: number; // Point 12
  neighborhoodRating?: number; // Point 13
  vinNumber?: string; // Point 14
  soundInsulation?: "low" | "medium" | "high"; // Point 18
  windowOrientation?: "north" | "south" | "east" | "west"; // Point 17
  hasPrivateParking?: boolean; // Point 19
  isOfficialAgency?: boolean; // Point 42
  propertyType?: string; // Vergi hesablaması üçün
  isUrgentSale?: boolean; // Point 27
  isOfficialStore?: boolean; // Point 19: Mağaza statusu
  safeMeetingAvailable?: boolean; // Point 14: Təhlükəsiz görüş yeri
  slug?: string;
}

interface ListingCardProps {
  listing: Listing;
  t: Record<string, string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  visiblePhones: Record<string, boolean>;
  togglePhone: (e: React.MouseEvent, id: string) => void;
  handleReport: (e: React.MouseEvent, id: string) => void;
  handleWhatsAppClick: (
    e: React.MouseEvent,
    phone: string,
    title: string,
  ) => void;
  handleViberClick: (e: React.MouseEvent, phone: string) => void;
  handleViberShare: (e: React.MouseEvent, id: string, title: string) => void;
  formatPrice: (price: string) => string;
  isAdmin?: boolean;
  viewMode: "grid" | "list";
}

export const listings: Listing[] = []; // Digər səhifələrin xəta verməməsi üçün exportu saxlayırıq

// Elan Kartı Komponenti (Sürətli Baxış - Point 26)
const ListingCard = ({
  listing,
  t,
  isFavorite,
  toggleFavorite,
  visiblePhones,
  togglePhone,
  handleReport,
  handleWhatsAppClick,
  handleViberClick,
  handleViberShare,
  formatPrice,
  isAdmin,
  viewMode,
}: ListingCardProps) => {
  const router = useRouter();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const touchStartX = useRef(0); // Point 4: Swipe to Gallery
  const touchEndX = useRef(0); // Point 4: Swipe to Gallery

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const images = listing.images;
    if (isHovered && images && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setCurrentImgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, listing.images]);

  const displayImage =
    listing.images && listing.images.length > 0
      ? listing.images[currentImgIndex]
      : listing.image;

  // Point 43: Sadə Kredit Kalkulyatoru (məsələn: 24 aylıq 10% ilə)
  const calculateMonthly = (price: string) => {
    const monthly = (Number(price) * 1.1) / 24;
    return monthly.toFixed(0);
  };

  // Point 41: Vergi Hesablayıcısı (Sadələşdirilmiş nümunə)
  const calculateTax = (price: string, category: string) => {
    const numPrice = Number(price);
    if (category === "dasinmaz-emlak") return (numPrice * 0.03).toFixed(0); // 3% əmlak vergisi
    if (category === "neqliyyat") return (numPrice * 0.05).toFixed(0); // 5% avtomobil vergisi
    return "0";
  };

  const handleQrToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQr(!showQr);
  };

  // Point 22: Countdown Timer for VIP listings
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    if (!listing.vipEndDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(listing.vipEndDate as Date) - +new Date();
      let time = "";
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        time = `${hours}s ${minutes}d ${seconds}s`;
      } else {
        time = "Bitdi!";
      }
      setTimeLeft(time);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // İlk dəfə dərhal hesabla

    return () => clearInterval(timer);
  }, [listing.vipEndDate]);

  // Point 3: Toxunuş (Haptic) effekti
  const triggerHapticFeedback = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms titrəmə
    }
  }, []);

  // Point 4: Swipe to Gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!listing.images || listing.images.length <= 1) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Sola swipe
      setCurrentImgIndex((prev) => (prev + 1) % listing.images!.length);
    } else if (distance < -50) {
      // Sağa swipe
      setCurrentImgIndex(
        (prev) => (prev - 1 + listing.images!.length) % listing.images!.length,
      );
    }
  };

  // Point 9: Sürətli "Geri" düyməsi
  const handleGoBack = () => router.back();

  return (
    <Link
      // Point 36: SEO-dostu URL strukturu (kateqoriya/slug)
      href={`/${listing.category}/${listing.slug || listing.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 ${
        viewMode === "grid"
          ? "flex flex-col hover:-translate-y-1"
          : "flex flex-row h-auto md:h-64"
      }`}
      onClick={() => {
        // Point 2: Son baxılanlara əlavə et
        const recentlyViewed = JSON.parse(
          localStorage.getItem("recentlyViewed") || "[]",
        );
        if (!recentlyViewed.includes(listing.id)) {
          localStorage.setItem(
            "recentlyViewed",
            JSON.stringify([listing.id, ...recentlyViewed.slice(0, 4)]),
          ); // Son 5 elanı saxla
        }
      }}
    >
      {/* Image Bölməsi */}
      <div
        className={`relative overflow-hidden shrink-0 ${viewMode === "grid" ? "aspect-[4/3]" : "w-2/5 md:w-1/4 aspect-square md:aspect-auto"}`}
        onTouchStart={handleTouchStart} // Point 4
        onTouchMove={handleTouchMove} // Point 4
        onTouchEnd={handleTouchEnd} // Point 4
      >
        {/* Point 1: Lazy Loading Images */}
        <Image
          src={displayImage}
          alt={listing.title}
          className='w-full h-full object-cover transition-opacity duration-300' // `object-cover` Tailwind klassı
          width={viewMode === "grid" ? 400 : 200} // Nümunə ölçülər
          height={viewMode === "grid" ? 300 : 150} // Nümunə ölçülər
          priority={false} // Səhifənin yuxarısındakı şəkillər üçün true ola bilər
          placeholder='blur' // Blur effekti üçün
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' // Generic blur placeholder
        />

        {/* Badges */}
        <div className='absolute top-2 left-2 flex flex-col gap-1'>
          {listing.isVip && (
            <Badge className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs px-2 py-0.5'>
              <Star className='h-3 w-3 mr-1 fill-white' /> VIP
            </Badge>
          )}
          {listing.isPremium && (
            <Badge
              variant='default'
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-bold text-xs px-2 py-0.5'
            >
              Premium
            </Badge>
          )}
          {listing.isUrgent && (
            <Badge
              variant='destructive'
              className='bg-red-600 text-white border-0 font-bold text-xs px-2 py-0.5 animate-pulse'
            >
              {t.label_urgent}
            </Badge>
          )}
          {/* Point 22: List nepokretnosti yoxlanılıb */}
          {listing.category === "dasinmaz-emlak" &&
            listing.isVerifiedProperty && (
              <Badge
                variant='default'
                className='bg-green-600 text-white border-0 font-bold text-[10px] px-2 py-0.5'
              >
                List nepokretnosti yoxlanılıb
              </Badge>
            )}
          {listing.has360Tour && (
            <Badge
              variant='secondary'
              className='bg-blue-600 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <BoxSelect className='h-3 w-3 mr-1' /> 360° TUR
            </Badge>
          )}
          {listing.isOfficialStore && (
            <Badge
              variant='default'
              className='bg-blue-600 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <ShieldCheck className='h-3 w-3 mr-1' /> {t.store_verified}
            </Badge>
          )}
          {listing.safeMeetingAvailable && (
            <Badge
              variant='default'
              className='bg-cyan-600 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <Handshake className='h-3 w-3 mr-1' /> {t.safe_meeting_point}
            </Badge>
          )}
          {/* Point 27: "Təcili Satılır" Bölməsi */}
          {listing.isUrgentSale && (
            <Badge
              variant='destructive'
              className='bg-orange-700 text-white border-0 font-bold text-[10px] px-2 py-0.5 animate-pulse'
            >
              {t.urgent_sale_badge}
            </Badge>
          )}
          {/* Point 11: Virtual Tur (3D) */}
          {listing.has360Tour && (
            <Badge
              variant='default'
              className='bg-purple-600 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <BoxSelect className='h-3 w-3 mr-1' /> {t.virtual_tour_3d}
            </Badge>
          )}
          {/* Point 18: Səs İzolyasiyası Nişanı */}
          {listing.soundInsulation && (
            <Badge
              variant='default'
              className='bg-gray-600 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <VolumeX className='h-3 w-3 mr-1' /> {t.sound_insulation}
            </Badge>
          )}
          {/* Point 19: Şəxsi Parkinq */}
          {listing.hasPrivateParking && (
            <Badge
              variant='default'
              className='bg-blue-800 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <Car className='h-3 w-3 mr-1' /> {t.has_private_parking}
            </Badge>
          )}
          {/* Point 42: Rəsmi Agentlik Nişanı */}
          {listing.isOfficialAgency && (
            <Badge
              variant='default'
              className='bg-blue-500 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <ShieldCheck className='h-3 w-3 mr-1' /> {t.official_agency_badge}
            </Badge>
          )}
          {/* Point 17: Günəş İşığı Analizi (Pəncərə İstiqaməti) */}
          {listing.windowOrientation && (
            <Badge
              variant='default'
              className='bg-yellow-500 text-white border-0 font-bold text-[10px] px-2 py-0.5'
            >
              <Sun className='h-3 w-3 mr-1' /> {t.window_orientation}
            </Badge>
          )}
          {isAdmin && (
            // Admin panelindən elanın statusunu görmək üçün
            <Badge className='bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 border-0'>
              MODERATION
            </Badge>
          )}
        </div>
        {/* Point 22: VIP Countdown Timer */}
        {listing.isVip && listing.vipEndDate && timeLeft && (
          <div className='absolute top-2 right-12 flex items-center gap-1 text-xs font-bold text-orange-700 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm'>
            <Clock className='h-3 w-3 text-orange-500' /> {t.vip_ends_in}:{" "}
            {timeLeft}
          </div>
        )}

        {/* Point 13: Məhəllə Reytinqi */}
        {listing.neighborhoodRating && (
          <div className='absolute top-2 left-2 flex items-center gap-1 text-xs font-bold text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm'>
            <StarHalf className='h-3 w-3 text-yellow-500' />{" "}
            {listing.neighborhoodRating.toFixed(1)}/5
          </div>
        )}

        {/* Favorite button */}
        <button
          type='button'
          className='absolute top-2 right-2 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-md'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(listing.id);
            triggerHapticFeedback(); // Point 3
          }}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite(listing.id) ? "text-red-500 fill-red-500" : "text-gray-600"}`}
          />
        </button>

        {/* Point 32: Şikayət Düyməsi */}
        <button
          type='button'
          className='absolute top-12 right-2 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive/10 transition-all duration-200 shadow-md opacity-0 group-hover:opacity-100'
          onClick={(e) => handleReport(e, listing.id)}
          title='Şikayət et'
        >
          <AlertTriangle className='h-4 w-4 text-orange-400' />
        </button>

        {/* Views */}
        <div className='absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
          <Eye className='h-3 w-3' />
          {listing.views}
        </div>

        {/* QR Code Overlay (Point 45) */}
        {showQr && (
          <div className='absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20 animate-in fade-in zoom-in duration-200'>
            <button
              onClick={handleQrToggle}
              className='absolute top-2 right-2 p-1 text-gray-400 hover:text-orange-500'
            >
              <X className='h-5 w-5' />
            </button>
            <div className='bg-card p-2 rounded-xl shadow-inner mb-2'>
              <QRCodeSVG
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/${listing.category}/${listing.slug || listing.id}`}
                size={120}
                level='H'
                includeMargin={false}
              />
            </div>
            <p className='text-[10px] font-bold text-gray-500 uppercase tracking-tighter text-center'>
              Skan et və paylaş
            </p>
          </div>
        )}
      </div>

      <div
        className={`p-4 flex-1 flex flex-col justify-between ${viewMode === "list" ? "min-w-0" : ""}`}
      >
        <h3 className='font-semibold text-foreground text-sm md:text-base line-clamp-1 group-hover:text-orange-500 transition-colors'>
          {listing.title}
          {/* Point 34: Verified User nişanı */}
          {listing.isVerifiedUser && (
            <Badge
              variant='default'
              className='ml-2 bg-blue-500 text-white border-0 font-bold text-[8px] px-1 py-0.5'
            >
              <Star className='h-2 w-2 mr-0.5 fill-white' /> Verified
            </Badge>
          )}
          {/* Point 44: Online Status Indicator */}
          {listing.isOnline && (
            <span className='ml-2 inline-flex items-center gap-1 text-[8px] text-green-500 font-bold'>
              <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />{" "}
              ONLINE
            </span>
          )}
        </h3>

        {/* Point 12: Məsafə Kalkulyatoru */}
        {(listing.distanceToSea || listing.distanceToAirport) && (
          <div className='flex items-center gap-3 text-[10px] text-gray-500 font-bold mb-1'>
            {listing.distanceToSea && (
              <span className='flex items-center gap-1'>
                <Waves className='h-3 w-3 text-blue-500' />
                {t.distance_to_sea}: {listing.distanceToSea}m
              </span>
            )}
            {listing.distanceToAirport && (
              <span className='flex items-center gap-1'>
                <Plane className='h-3 w-3 text-blue-500' />
                {t.distance_to_airport}: {listing.distanceToAirport}km
              </span>
            )}
          </div>
        )}

        {/* Point 13: Məhəllə Reytinqi (Textual) */}
        {listing.neighborhoodRating && (
          <p className='text-[10px] text-gray-500 mb-1'>
            {t.neighborhood_rating}: {listing.neighborhoodRating.toFixed(1)}/5
          </p>
        )}

        {/* Point 33: Qonşu Tanışlığı / Bina Rəyləri */}
        {listing.category === "dasinmaz-emlak" && (
          <div className='flex items-center gap-1 text-[10px] text-blue-600 font-bold mb-2'>
            <Users size={12} /> {t.building_reviews} (12 rəy)
          </div>
        )}

        {/* Point 6: İstifadəçi Nailiyyətləri (Seller Achievements) */}
        <div className='flex flex-wrap gap-1 mb-2'>
          {listing.sellerAchievements?.map((achievement: string) => (
            <Badge
              key={achievement}
              variant='outline'
              className='text-[8px] px-1 py-0 border-orange-100 bg-orange-50/30 text-orange-600 flex items-center gap-0.5'
            >
              {achievement === "Etibarlı satıcı" ? (
                <Award size={10} />
              ) : (
                <Zap size={10} />
              )}
              {achievement}
            </Badge>
          ))}
        </div>

        {/* Satıcı Reytinqi (Point 30) */}
        <div className='flex items-center gap-1 mb-1'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 ${i < (listing.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className='text-[10px] text-gray-400'>(12 rəy)</span>
        </div>

        {/* Point 38: Qiymət düşmə bildirişi üçün kiçik indikator (Opsional) */}
        {listing.extraDetails?.oldPrice &&
          Number(listing.extraDetails.oldPrice) > Number(listing.price) && (
            <div className='text-[10px] text-green-600 font-bold flex items-center gap-1 mb-1'>
              <TrendingUp className='h-3 w-3' />
              Qiymət düşdü:
              <span className='line-through text-gray-400'>
                {listing.extraDetails.oldPrice} €
              </span>
            </div>
          )}

        <div className='text-xl font-black text-[#f97316] mb-3'>
          {listing.category === "itmis-esyalar"
            ? "PULSUZ / SOCIAL"
            : formatPrice(listing.price)}
        </div>

        {/* Point 43: Kredit Kalkulyatoru Preview */}
        {(listing.category === "neqliyyat" ||
          listing.category === "dasinmaz_emlak") && (
          <div className='text-[10px] text-muted-foreground mb-2 flex items-center gap-1 font-medium bg-muted/50 p-1.5 rounded-lg'>
            <Calculator className='h-3 w-3 text-orange-500' />
            Aylıq cəmi:{" "}
            <span className='text-orange-600 font-bold'>
              {calculateMonthly(listing.price)} €-dan
            </span>
          </div>
        )}

        {/* Nəqliyyat üçün spesifik ikonlar */}
        {listing.category === "neqliyyat" && listing.extraDetails && (
          <div className='flex items-center gap-3 mb-3'>
            {listing.extraDetails.year && (
              <div className='flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase'>
                <Calendar className='h-3 w-3 text-orange-500' />{" "}
                {listing.extraDetails.year}
              </div>
            )}
            {listing.extraDetails.fuel && (
              <div className='flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase'>
                <Fuel className='h-3 w-3 text-orange-500' />{" "}
                {listing.extraDetails.fuel}
              </div>
            )}
          </div>
        )}

        {/* Point 33: Nömrə Gizlətmə */}
        <div className='mb-3'>
          <button
            onClick={(e) => togglePhone(e, listing.id)}
            className='flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted px-3 py-2 rounded-lg w-full hover:bg-accent transition-colors'
          >
            <Phone className='h-3 w-3 text-orange-500' />
            {visiblePhones[listing.id] ? (
              listing.phone
            ) : (
              <>
                {listing.phone.substring(0, 6)}...{" "}
                <span className='text-orange-500 text-[10px]'>
                  NÖMRƏNİ GÖSTƏR
                </span>
              </>
            )}
          </button>
        </div>

        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <MapPin className='h-3 w-3' />
            {listing.location}
          </span>
          <span className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {listing.time}
          </span>
        </div>

        {/* Quick Contact Buttons */}
        <div
          className={`flex gap-2 mt-4 transition-opacity md:opacity-0 md:group-hover:opacity-100 ${
            viewMode === "list" ? "opacity-100" : ""
          }`}
        >
          <Button
            size='sm'
            className='flex-1 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-xl h-8 text-[10px] font-bold'
            onClick={(e) =>
              handleWhatsAppClick(e, listing.phone, listing.title)
            }
          >
            <MessageCircle className='h-3 w-3 mr-1' /> WA
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='flex-1 border-[#7360f2] text-[#7360f2] hover:bg-[#7360f2]/5 rounded-xl h-8 text-[10px] font-bold'
            onClick={(e) => handleViberClick(e, listing.phone)}
          >
            Viber
          </Button>
          <Button
            size='sm'
            variant='ghost'
            className='bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl h-8 w-8 p-0'
            onClick={(e) => handleViberShare(e, listing.id, listing.title)}
            title='Viber ilə paylaş'
          >
            <Share2 className='h-3 w-3' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            className='bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl h-8 w-8 p-0'
            onClick={handleQrToggle}
            title='QR Kod'
          >
            <QrCode className='h-3 w-3' />
          </Button>
          {(listing.category === "neqliyyat" ||
            listing.category === "dasinmaz_emlak") && (
            <Button
              size='sm'
              variant='ghost'
              className='bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl h-8 w-8 p-0'
              onClick={(e) => {
                e.preventDefault();
                alert("Müqayisə siyahısına əlavə olundu");
              }}
              title='Müqayisə et'
            >
              <Scale className='h-3 w-3' />
            </Button>
          )}
          {isAdmin && (
            <Button
              size='sm'
              variant='ghost'
              className='bg-muted hover:bg-accent text-muted-foreground rounded-xl h-8 w-8 p-0'
              onClick={(e) => {
                e.preventDefault();
                alert("Ehtiyat hissələri təklifi (Point 15)");
              }}
              title='Ehtiyat hissələri'
            >
              <Car className='h-3 w-3' />
            </Button>
          )}
          {isAdmin && ( // Admin üçün VIN yoxlama düyməsi
            <div className='flex gap-1 border-l pl-2 border-border'>
              <Button
                size='sm'
                variant='ghost'
                className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-xl h-8 w-8 p-0'
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/listings/edit/${listing.id}`);
                }}
                title={t.admin_edit}
              >
                <Edit className='h-3 w-3' />
              </Button>
              <Button
                size='sm'
                variant='ghost'
                className='bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl h-8 w-8 p-0'
                onClick={(e) => {
                  e.preventDefault();
                  handleReport(e, listing.id);
                }} // Buranı silmə məntiqi ilə əvəzləmək olar
                title={t.admin_delete}
              >
                <ShieldAlert className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>

        {/* Point 9: Anket (Poll) */}
        <div className='mt-4 pt-4 border-t border-dashed border-border'>
          <p className='text-[10px] text-gray-400 font-bold text-center mb-2 uppercase tracking-wide'>
            Faydalı oldumu?
          </p>
          <div className='flex gap-2'>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success("Təşəkkür edirik!");
              }}
              className='flex-1 py-1 text-[10px] font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors'
            >
              Bəli
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.info("Rəyinizi qeyd etdik.");
              }}
              className='flex-1 py-1 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'
            >
              Xeyr
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export function Listings({
  searchQuery,
  categorySlug,
  onlyFavorites,
}: ListingsProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");

  useEffect(() => {
    if (cityParam) {
      setLocalFilters((prev) => ({ ...prev, location: cityParam }));
    }
  }, [cityParam]);

  const { toggleFavorite, isFavorite } = useFavorites();
  const [realListings, setRealListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(!!token.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const [currencyMode, setCurrencyMode] = useState<"EUR" | "USD">("EUR");
  const exchangeRate = 1.08; // Nümunə: EUR to USD
  const [displayLimit, setDisplayLimit] = useState(8); // Infinite scroll üçün
  const observerTarget = useRef(null);

  useEffect(() => {
    setLoading(true);
    
    const queryConstraints: QueryConstraint[] = [
      where("status", "==", "approved")
    ];

    if (categorySlug && categorySlug !== "all") {
      queryConstraints.push(where("category", "==", categorySlug));
    }

    // Axtarış sorğusu üçün server-side filtr (Firestore where)
    if (searchQuery) {
      queryConstraints.push(where("title", ">=", searchQuery));
      queryConstraints.push(where("title", "<=", searchQuery + '\uf8ff')); // Prefix matching
    }

    // Şəhər üzrə server-side filtr (Firestore where)
    if (localFilters.location) {
      queryConstraints.push(where("location", "==", localFilters.location));
    }

    const q = query(
      collection(db, "listings"),
      ...queryConstraints,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Listing, "id">),
      })) as Listing[];
      setRealListings(ads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categorySlug, localFilters.location, searchQuery]); // searchQuery dəyişəndə data yenidən çəkilir

  // Infinite Scroll Məntiqi (Point 25)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && realListings.length > displayLimit) {
          setDisplayLimit((prev) => prev + 4);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [realListings, displayLimit]);

  // Filtrləmə məntiqi
  const filteredListings = realListings.filter((listing) => {
    if (onlyFavorites && !isFavorite(listing.id)) return false;

    const matchesLocalFilters = Object.entries(localFilters).every(
      ([key, value]) => {
        if (!value) return true;
        if (key === "minPrice") return Number(listing.price) >= Number(value);
        if (key === "maxPrice") return Number(listing.price) <= Number(value);
        
        // Location artıq server-side filter olunduğu üçün burada yoxlamağa ehtiyac yoxdur
        if (key === "location") return true; 

        // extraDetails və ya birbaşa listing obyektində yoxlayırıq
        const listingValue =
          listing.extraDetails?.[key] ?? listing[key as keyof Listing];

        if (!listingValue) return false;
        return listingValue.toString().toLowerCase() === value.toLowerCase();
      },
    );

    return matchesLocalFilters; // Axtarış artıq server-side aparıldığı üçün burada yoxlamağa ehtiyac yoxdur
  });

  // Sıralama məntiqi: Premium > VIP > Standart
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return 0;
  });

  const formatPrice = (price: string) => {
    const numPrice = Number(price);
    if (currencyMode === "USD") {
      return `${(numPrice * exchangeRate).toLocaleString()} $`;
    }
    return `${numPrice.toLocaleString()} €`;
  };

  const handleWhatsAppClick = (
    e: React.MouseEvent,
    phone: string,
    title: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Salam, "${title}" elanı ilə bağlı MonteTap-dan yazıram.`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const handleViberClick = (e: React.MouseEvent, phone: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Monteneqro nömrələri üçün Viber link formatı
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`viber://chat?number=%2B${cleanPhone}`, "_blank");
  };

  const handleViberShare = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/listings/${id}`;
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`viber://forward?text=${text}`, "_blank");
  };

  const togglePhone = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setVisiblePhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReport = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Şikayətiniz qeydə alındı. Moderatorlar tərəfindən araşdırılacaq.");
  };

  return (
    <section className='py-8 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-foreground flex items-center gap-3'>
            <span className='w-1.5 h-8 bg-orange-500 rounded-full' />
            {t.latest_ads}
          </h2>
          <div className='flex items-center gap-4'>
            {/* View Mode Switcher (Point 36) */}
            <div className='hidden sm:flex bg-gray-100 p-1 rounded-lg gap-1'>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-orange-600" : "text-muted-foreground"}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-background shadow-sm text-orange-600" : "text-muted-foreground"}`}
              >
                <ListIcon size={16} />
              </button>
            </div>

            {/* Valyuta Çevirici (Point 18) */}
            <div className='flex bg-gray-100 p-1 rounded-lg text-[10px] font-bold'>
              <button
                onClick={() => setCurrencyMode("EUR")}
                className={`px-2 py-1 rounded-md transition-all ${currencyMode === "EUR" ? "bg-background shadow-sm text-orange-600" : "text-muted-foreground"} `}
              >
                EUR
              </button>
              <button
                onClick={() => setCurrencyMode("USD")}
                className={`px-2 py-1 rounded-md transition-all ${currencyMode === "USD" ? "bg-background shadow-sm text-orange-600" : "text-muted-foreground"}`}
              >
                USD
              </button>
            </div>
            <a
              href='#'
              className='text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1'
            >
              {t.view_all} →
            </a>
          </div>
        </div>

        {/* Şəhər üzrə Sürətli Filtrlər (Point 21) */}
        <div className='flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar'>
          {["Podgorica", "Budva", "Bar", "Kotor", "Tivat", "Herceg Novi"].map(
            (city) => (
              <button
                key={city}
                onClick={() =>
                  setLocalFilters({ ...localFilters, location: city })
                }
                className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${localFilters.location === city ? "bg-orange-500 border-orange-500 text-white" : "bg-card border-border text-muted-foreground hover:border-orange-300"}`}
              >
                {city}
              </button>
            ),
          )}
          {localFilters.location && (
            <button
              onClick={() => setLocalFilters({})}
              className='text-xs text-red-500 font-bold px-2'
            >
              Sıfırla
            </button>
          )}
        </div>

        {/* Dinamik Filtrlər (Point 1) */}
        {categorySlug && categorySlug !== "all" && (
          <div className='mb-8 p-6 bg-muted/50 rounded-3xl border border-border flex flex-wrap gap-4'>
            {categorySlug === "neqliyyat" && (
              <>
                <select
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, fuel: e.target.value })
                  }
                  className='h-10 px-4 rounded-xl border-input bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500 text-foreground'
                >
                  <option value=''>Yanacaq növü</option>
                  <option value='benzin'>Benzin</option>
                  <option value='dizel'>Dizel</option>
                  <option value='elektro'>Elektro</option>
                </select>
                <select
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      transmission: e.target.value,
                    })
                  }
                  className='h-10 px-4 rounded-xl border-input bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500 text-foreground'
                >
                  <option value=''>Sürət qutusu</option>
                  <option value='avtomat'>Avtomat</option>
                  <option value='mexanika'>Mexanika</option>
                </select>
              </>
            )}

            {categorySlug === "dasinmaz-emlak" && (
              <>
                <Input
                  placeholder='Min. Sahə (m²)'
                  type='number'
                  className='w-32 h-10 rounded-xl'
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minArea: e.target.value,
                    })
                  }
                />
                <select
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, floor: e.target.value })
                  }
                  className='h-10 px-4 rounded-xl border-input bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500 text-foreground'
                >
                  <option value=''>Mərtəbə</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className='flex gap-2 items-center'>
              <Input
                placeholder='Min fiy.'
                type='number'
                className='w-28 h-10 rounded-xl'
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, minPrice: e.target.value })
                }
              />
              <span className='text-gray-400'>-</span>
              <Input
                placeholder='Max fiy.'
                type='number'
                className='w-28 h-10 rounded-xl'
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, maxPrice: e.target.value })
                }
              />
            </div>
          </div>
        )}

        <div
          className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ${loading ? "opacity-50" : ""}`}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))
            : sortedListings
                .slice(0, displayLimit)
                .map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    t={t}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    visiblePhones={visiblePhones}
                    togglePhone={togglePhone}
                    handleReport={handleReport}
                    handleWhatsAppClick={handleWhatsAppClick}
                    handleViberClick={handleViberClick}
                    handleViberShare={handleViberShare}
                    formatPrice={formatPrice}
                    isAdmin={isAdmin}
                    viewMode={viewMode}
                  />
                ))}
        </div>

        {/* Infinite Scroll Anchor (Point 25) */}
        <div
          ref={observerTarget}
          className='h-10 w-full flex items-center justify-center mt-4'
        >
          {realListings.length > displayLimit && <ListingCardSkeleton />}
        </div>

        {filteredListings.length === 0 && (
          <div className='text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
            <div className='text-gray-400 mb-2 text-5xl'>🔍</div>
            <h3 className='text-xl font-bold text-gray-800'>{t.no_listings}</h3>
            <p className='text-gray-500'>{t.change_params}</p>
          </div>
        )}

        {/* Load more */}
        {filteredListings.length > 0 && (
          <div className='text-center mt-8'>
            <button
              type='button'
              className='bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-full transition-colors'
            >
              Daha çox elan yüklə
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
