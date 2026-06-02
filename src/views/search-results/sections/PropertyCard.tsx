import React, { useState } from 'react';
import Image from 'next/image';
import { Bed, Bath, Ruler, MapPin, Eye, BadgeCheck } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  beds: number;
  baths?: number;
  size?: string;
  price: string;
  priceValue: number;
  fmv?: string;
  verified?: boolean;
  onClick?: () => void;
  onViewProperty?: (id: string) => void;
  onMakeOffer?: (id: string) => void;
}

export function PropertyCard({
  id,
  image,
  title,
  location,
  beds,
  baths,
  size,
  price,
  fmv,
  verified,
  onViewProperty,
  onMakeOffer
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.12)'
          : '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />



        {/* FMV Badge */}
        {fmv === 'Below FMV' && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-gradient-to-r from-[#4ea8a1] to-[#3d8882] text-white rounded-full px-3 py-1 shadow-lg">
              <span className="text-[12px] font-medium">Below Market Value</span>
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {verified && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
              <BadgeCheck className="w-4 h-4 text-[#4ea8a1]" />
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="mb-1.5 line-clamp-1 group-hover:text-[#4ea8a1] transition-colors">{title}</h3>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-[13px] line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Property Specs */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Bed className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Bedrooms</p>
                <p className="text-[14px] font-medium">{beds}</p>
              </div>
            </div>
            {typeof baths === 'number' && baths > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Bath className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Bathrooms</p>
                  <p className="text-[14px] font-medium">{baths}</p>
                </div>
              </div>
            )}
            {size && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Ruler className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Size</p>
                  <p className="text-[14px] font-medium">{size}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-[12px] text-gray-500 mb-1">Asking Price</p>
          <p className="text-[24px] font-semibold text-gray-900">{price}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onMakeOffer?.(id)}
            className="flex-1 py-2.5 border-2 border-[#4ea8a1] text-[#4ea8a1] rounded-xl text-[14px] font-medium hover:bg-[#4ea8a1]/5 transition-all active:scale-95"
          >
            Make Offer
          </button>
          <button
            onClick={() => onViewProperty?.(id)}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#4ea8a1] to-[#3d8882] text-white rounded-xl text-[14px] font-medium hover:shadow-lg hover:shadow-[#4ea8a1]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
