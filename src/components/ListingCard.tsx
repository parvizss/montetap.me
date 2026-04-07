import Link from "next/link";
import { Euro, MapPin } from "lucide-react";

export interface Listing {
  id: string;
  title: string;
  price: string | number;
  city: string;
  category: string;
  images?: string[];
  status: string;
  createdAt: any;
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCardSkeleton() {
  return (
    <div className='bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse'>
      <div className='aspect-[4/3] bg-gray-200' />
      <div className='p-5 space-y-3'>
        <div className='h-5 bg-gray-200 rounded w-3/4' />
        <div className='h-7 bg-orange-50 rounded w-1/2' />
        <div className='flex items-center gap-1 mt-3'>
          <div className='h-3 bg-gray-100 rounded w-1/4' />
        </div>
      </div>
    </div>
  );
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/details/${listing.id}`}
      className='group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all'
    >
      <div className='aspect-[4/3] bg-gray-100 overflow-hidden'>
        <img
          src={listing.images?.[0] || "/placeholder.png"}
          alt={listing.title}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
        />
      </div>
      <div className='p-5'>
        <h3 className='font-bold text-gray-900 truncate'>{listing.title}</h3>
        <div className='flex items-center gap-1 text-orange-500 font-black text-xl mt-1'>
          {listing.price} <Euro size={18} />
        </div>
        <div className='flex items-center gap-1 text-xs text-gray-400 mt-3'>
          <MapPin size={12} /> {listing.city}
        </div>
      </div>
    </Link>
  );
}
