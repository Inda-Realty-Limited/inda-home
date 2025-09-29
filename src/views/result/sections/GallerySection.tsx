import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  imageUrls?: string[];
};

const GallerySection: React.FC<Props> = ({ imageUrls }) => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollGalleryBy = (dir: 1 | -1) => {
    const el = galleryRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLDivElement>("div > div");
    const cardWidth = card?.getBoundingClientRect().width || 320;
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  };
  return (
    <div className="w-full px-6">
      <h3 className="text-2xl md:text-3xl font-bold mb-6">Gallery</h3>
      <div className="relative group">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollGalleryBy(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <FaChevronLeft />
        </button>
        <div
          ref={galleryRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {Array.isArray(imageUrls) && imageUrls.length > 0 ? (
            imageUrls.slice(0, 6).map((url, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-80 h-56 md:w-96 md:h-64 lg:w-[420px] lg:h-72 rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`property-${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-24 text-sm text-gray-600">
              No images available.
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollGalleryBy(1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GallerySection;
