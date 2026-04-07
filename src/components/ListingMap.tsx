"use client";
import React from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ListingMapProps {
  location: string;
  address?: string;
}

export function ListingMap({ location, address }: ListingMapProps) {
  const { t } = useLanguage();
  const searchQuery = encodeURIComponent(
    `${address ? address + ", " : ""}${location}, Montenegro`,
  );
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${searchQuery}`;

  return (
    <div className='w-full space-y-3'>
      <div className='flex items-center gap-2 text-gray-800 font-bold'>
        <MapPin className='h-5 w-5 text-orange-500' />
        <span>{t.location_on_map}</span>
      </div>
      <div className='w-full h-[300px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50'>
        <iframe
          width='100%'
          height='100%'
          frameBorder='0'
          title={t.location_on_map}
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
