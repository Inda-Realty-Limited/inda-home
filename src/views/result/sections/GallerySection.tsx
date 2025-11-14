import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  imageUrls?: string[];
  isHeaderGallery?: boolean;
};

const GallerySection: React.FC<Props> = ({ imageUrls, isHeaderGallery = false }) => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const scrollGalleryBy = (dir: 1 | -1) => {
    const el = galleryRef.current;
    if (!el) return;
    const firstChild = el.children[0] as HTMLElement;
    const cardWidth = firstChild?.getBoundingClientRect().width || 320;
    const gap = 16;
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const images = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : [];
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    const images = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : [];
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isHeaderGallery) {
    const images = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : [];
    
    return (
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gray-200" style={{ height: '340px' }}>
          {images.length > 0 ? (
            <>
              <img
                src={images[currentIndex]}
                alt={`property-${currentIndex}`}
                className="w-full h-full object-cover"
              />
              
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-gray-800" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                aria-label="Next image"
              >
                <FaChevronRight className="text-gray-800" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? "bg-white w-8" : "bg-white/60 w-2"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No images available
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`relative rounded-2xl overflow-hidden transition-all ${
                  idx === currentIndex ? "ring-2 ring-white ring-offset-2 ring-offset-gray-100" : "opacity-70 hover:opacity-100"
                }`}
                style={{ aspectRatio: '4/3' }}
              >
                <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

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
                className="flex-shrink-0 bg-[#DDECEB] p-4 rounded-3xl"
              >
                <div className="w-72 h-48 md:w-88 md:h-56 lg:w-96 lg:h-64 rounded-2xl overflow-hidden">
                  <img
                    src={url}
                    alt={`property-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
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
