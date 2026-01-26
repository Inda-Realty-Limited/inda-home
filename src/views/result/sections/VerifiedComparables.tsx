import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ComparableProperty {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  indaTrustScore: number;
  price: string;
  imageUrl?: string;
}

type Props = {
  comparables?: ComparableProperty[];
};

const VerifiedComparables: React.FC<Props> = ({ comparables }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const defaultComparables: ComparableProperty[] = [
    {
      id: "1",
      title: "5-Bed Apartment in Ajah",
      location: "Ajah",
      bedrooms: 5,
      indaTrustScore: 83,
      price: "₦110M",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      title: "4-Bed Apartment in Lekki",
      location: "Ajah",
      bedrooms: 5,
      indaTrustScore: 84,
      price: "₦125M",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      title: "5-Bed Apartment in VI",
      location: "Ajah",
      bedrooms: 5,
      indaTrustScore: 88,
      price: "₦128M",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: "4",
      title: "5-Bed Apartment in Osapa London",
      location: "Ajah",
      bedrooms: 5,
      indaTrustScore: 83,
      price: "₦110M",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: "5",
      title: "5-Bed Apartment in Chevron",
      location: "Ajah",
      bedrooms: 5,
      indaTrustScore: 85,
      price: "₦115M",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
  ];

  const displayComparables = comparables || defaultComparables;

  const scrollBy = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 340;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 10);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-bold text-inda-teal mb-6">
          Comparable Properties
        </h3>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scrollBy("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-inda-teal text-xl" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scrollBy("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-inda-teal text-xl" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayComparables.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 w-[300px] bg-[#D5E9E7] rounded-2xl overflow-hidden"
              >
                <div className="relative h-32 bg-gray-200 overflow-hidden">
                  {property.imageUrl ? (
                    <Image
                      src={property.imageUrl}
                      alt={property.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <h4 className="text-lg font-bold text-gray-900">
                    {property.title}
                  </h4>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      Location: {property.location}
                    </p>
                    <p className="text-sm text-gray-700">
                      Number of beds: {property.bedrooms}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Inda Trust Score</span>
                      <span className="font-bold text-gray-900">
                        {property.indaTrustScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-inda-teal transition-all duration-500"
                        style={{ width: `${property.indaTrustScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-300">
                    <p className="text-base font-bold text-gray-900">
                      Price: {property.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VerifiedComparables;

