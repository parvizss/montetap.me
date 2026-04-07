"use client";
import React from "react";

interface AdBannerProps {
  imageUrl: string;
  linkUrl: string;
  className?: string;
}

export function AdBanner({ imageUrl, linkUrl, className }: AdBannerProps) {
  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <a href={linkUrl} target='_blank' rel='noopener noreferrer'>
        <img
          src={imageUrl}
          alt='Sponsorlu Reklam'
          className='w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-500'
        />
      </a>
    </div>
  );
}
