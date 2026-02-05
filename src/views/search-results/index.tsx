import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Home,
  Check,
  Search,
  Loader2,
} from "lucide-react";
import { PropertyCard } from "./sections/PropertyCard";
import { MakeOfferModal } from "./sections/MakeOfferModal";
import { Navbar } from "@/components";
import { useDebounce } from "@/hooks/useDebounce";
import apiClient from "@/api";

// Property interface matching what we display
interface Property {
  id: string;
  image: string;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  beds: number;
  trustScore: number;
  price: string;
  priceValue: number;
  fmv: string;
  verified: boolean;
  whatsapp: string;
}

const filterOptions = [
  "Price Range",
  "Bedrooms",
  "Inda Score",
  "Location",
  "Property Type",
];

const bedroomOptions = ["1 Bed", "2 Beds", "3 Beds", "4 Beds", "5+ Beds"];

const propertyTypes = [
  "Apartment",
  "Duplex",
  "Terrace",
  "Semi-Detached",
  "Detached House",
  "Penthouse",
  "Studio",
  "Land",
];

// Helper to format price
const formatPriceDisplay = (priceNGN: number | null | undefined): string => {
  if (!priceNGN) return "₦0";
  if (priceNGN >= 1000000000) {
    return `₦${(priceNGN / 1000000000).toFixed(1)}B`;
  }
  if (priceNGN >= 1000000) {
    return `₦${(priceNGN / 1000000).toFixed(0)}M`;
  }
  return `₦${priceNGN.toLocaleString()}`;
};

// Helper to determine FMV status
const getFmvStatus = (listing: any): string => {
  const price = Number(listing.purchasePrice) || listing.priceNGN || 0;
  const fmv =
    Number(listing.fmv) || listing.fmvNGN || listing.analytics?.fmvNGN || 0;
  if (!fmv || !price) return "Unknown";
  const diff = ((price - fmv) / fmv) * 100;
  if (diff < -5) return "Below FMV";
  if (diff > 5) return "Above FMV";
  return "At FMV";
};

// Map API listing to our display format
const mapListingToProperty = (listing: any): Property => {
  // Use photosWithMeta (new structure) with fallback to legacy fields
  const photosWithMeta = listing.photosWithMeta || [];
  const images =
    photosWithMeta.length > 0
      ? photosWithMeta.map((p: any) => p.url)
      : listing.imageUrls || listing.images || listing.propertyImages || [];
  const firstImage =
    images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1662454419736-de132ff75638?w=800";
  const bedroomCount = parseInt(listing.bedrooms) || listing.bedrooms || 0;
  const priceValue = Number(listing.purchasePrice) || listing.priceNGN || 0;

  return {
    id: listing._id || listing.id || listing.indaTag || String(Math.random()),
    image: firstImage,
    title:
      listing.title ||
      `${bedroomCount}-Bed ${listing.propertyType || listing.propertyTypeStd || "Property"}`,
    location:
      listing.microlocation ||
      listing.microlocationStd ||
      listing.lga ||
      listing.state ||
      "Lagos",
    latitude: listing.latitude,
    longitude: listing.longitude,
    beds:
      typeof bedroomCount === "number"
        ? bedroomCount
        : parseInt(bedroomCount) || 0,
    trustScore:
      listing.indaScore ||
      listing.analytics?.indaScore ||
      Math.floor(Math.random() * 20) + 70,
    price: formatPriceDisplay(priceValue),
    priceValue: priceValue,
    fmv: getFmvStatus(listing),
    verified: listing.verified !== false && listing.status === "Active",
    whatsapp: listing.sellerPhone || "2347084960775",
  };
};

export function ResultsView() {
  const router = useRouter();
  const query = (router.query.q as string) || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [suggestedProperties, setSuggestedProperties] = useState<Property[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState("Highest Inda Score");
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 5000000000,
  ]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );
  const [locationSearch, setLocationSearch] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const isResettingRef = useRef(false);

  const lastPropertyElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const debouncedPriceRange = useDebounce(priceRange, 500);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);

  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [selectedPropertyTitle, setSelectedPropertyTitle] =
    useState<string>("");
  const [selectedPropertyPrice, setSelectedPropertyPrice] =
    useState<string>("");
  const [selectedPropertyWhatsapp, setSelectedPropertyWhatsapp] =
    useState<string>("");

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search-results?q=${encodeURIComponent(searchQuery.trim())}&type=ai`,
      );
    }
  };

  // Reset page when filters change
  useEffect(() => {
    isResettingRef.current = true;
    setPage(1);
    setHasMore(true);
  }, [
    query,
    selectedBedrooms,
    debouncedPriceRange,
    selectedPropertyTypes,
    debouncedLocationSearch,
    sortBy,
  ]);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      if (page !== 1 && isResettingRef.current) {
        return;
      }
      isResettingRef.current = false;

      setLoading(true);
      setError(null);
      try {
        // Build query params based on filters
        const params: Record<string, any> = {
          page: page,
          limit: 20,
        };

        // Add text search query if present
        if (query.trim()) {
          params.q = query.trim();
        }

        // Add bedroom filter
        if (selectedBedrooms.length > 0) {
          // Extract number from "1 Bed", "2 Beds", etc.
          const bedroomNums = selectedBedrooms
            .map((b) => {
              const match = b.match(/\d+/);
              return match ? parseInt(match[0]) : null;
            })
            .filter(Boolean);
          if (bedroomNums.length === 1) {
            params.bedrooms = bedroomNums[0];
          }
        }

        // Add price range filter
        if (debouncedPriceRange[0] > 0) {
          params.minPrice = debouncedPriceRange[0];
        }
        if (debouncedPriceRange[1] < 5000000000) {
          params.maxPrice = debouncedPriceRange[1];
        }

        // Add property type filter
        if (selectedPropertyTypes.length > 0) {
          params.propertyType = selectedPropertyTypes.join(",");
        }

        // Add location filter if set
        if (debouncedLocationSearch.trim()) {
          params.microlocation = debouncedLocationSearch.trim();
        }

        // Add sort parameter
        let sortParam = "newest";
        if (sortBy === "Lowest Price") {
          sortParam = "price_asc";
        } else if (sortBy === "Highest Price") {
          sortParam = "price_desc";
        }
        params.sort = sortParam;

        const response = await apiClient.get("/listings", { params });

        const data = response.data;
        // Handle response format: { data: { items: [...] } } or { data: { listings: [...] } }
        const listings =
          data.data?.items ||
          data.data?.listings ||
          data.listings ||
          data.data ||
          [];

        if (Array.isArray(listings)) {
          const mappedProperties = listings.map(mapListingToProperty);

          if (page === 1) {
            setProperties(mappedProperties);
          } else {
            setProperties((prev) => [...prev, ...mappedProperties]);
          }

          // Check if there are more results
          const pagination = data.data?.pagination;
          if (pagination) {
            setHasMore(pagination.page < pagination.totalPages);
          } else {
            // Fallback if pagination object is missing
            setHasMore(mappedProperties.length === 20);
          }

          // If no results found with filters, fetch suggestions
          if (mappedProperties.length === 0) {
            try {
              // Fetch suggestions (latest 6 listings without filters)
              const suggestionResponse = await apiClient.get("/listings", {
                params: { page: 1, limit: 6, sort: "newest" },
              });
              const suggestionData = suggestionResponse.data;
              const suggestions =
                suggestionData.data?.items ||
                suggestionData.data?.listings ||
                suggestionData.listings ||
                suggestionData.data ||
                [];
              if (Array.isArray(suggestions)) {
                setSuggestedProperties(suggestions.map(mapListingToProperty));
              }
            } catch (suggestionErr) {
              console.warn("Failed to fetch suggestions:", suggestionErr);
            }
          } else {
            setSuggestedProperties([]);
          }
        } else {
          console.warn("Unexpected API response format:", data);
          setProperties([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch listings:", err);
        setError(err.message || "Failed to load listings");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [
    query,
    selectedBedrooms,
    debouncedPriceRange,
    selectedPropertyTypes,
    debouncedLocationSearch,
    sortBy,
    page,
  ]);

  const handleViewProperty = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const handleMakeOffer = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    setSelectedPropertyId(propertyId);
    if (property) {
      setSelectedPropertyTitle(property.title);
      setSelectedPropertyPrice(property.price);
      setSelectedPropertyWhatsapp(property.whatsapp || "");
    }
    setShowMakeOfferModal(true);
    console.log("Making offer for property:", propertyId);
  };

  const toggleSelection = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000000) {
      return `₦${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(0)}M`;
    }
    return `₦${value.toLocaleString()}`;
  };

  const getFilterContent = (filterName: string) => {
    switch (filterName) {
      case "Price Range":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">
                Min Price
              </span>
              <span className="text-[15px]">{formatPrice(priceRange[0])}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000000"
              step="5000000"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #4ea8a1 0%, #4ea8a1 ${(priceRange[0] / 5000000000) * 100}%, #e5e7eb ${(priceRange[0] / 5000000000) * 100}%, #e5e7eb 100%)`,
              }}
            />

            <div className="flex items-center justify-between mt-8">
              <span className="text-[14px] text-muted-foreground">
                Max Price
              </span>
              <span className="text-[15px]">{formatPrice(priceRange[1])}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000000"
              step="5000000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #4ea8a1 0%, #4ea8a1 ${(priceRange[1] / 5000000000) * 100}%, #e5e7eb ${(priceRange[1] / 5000000000) * 100}%, #e5e7eb 100%)`,
              }}
            />

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-muted-foreground">Selected Range:</span>
                <span>
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
              </div>
            </div>
          </div>
        );
      case "Location":
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search for address, neighborhood, or city..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[14px]"
              />
            </div>

            {locationSearch && (
              <div className="space-y-1">
                <p className="text-[13px] text-muted-foreground mb-2">
                  Suggested locations:
                </p>
                {[
                  "Lekki Phase 1, Lagos, Nigeria",
                  "Victoria Island, Lagos, Nigeria",
                  "Ikoyi, Lagos, Nigeria",
                  "Ajah, Lagos, Nigeria",
                  "Yaba, Lagos, Nigeria",
                ]
                  .filter((loc) =>
                    loc.toLowerCase().includes(locationSearch.toLowerCase()),
                  )
                  .map((location, index) => (
                    <button
                      key={index}
                      onClick={() => setLocationSearch(location)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-[14px]">{location}</span>
                    </button>
                  ))}
              </div>
            )}

            {!locationSearch && (
              <div className="pt-2">
                <p className="text-[13px] text-muted-foreground mb-3">
                  Popular locations:
                </p>
                <div className="space-y-2">
                  {[
                    "Lekki Phase 1, Lagos",
                    "Victoria Island, Lagos",
                    "Ikoyi, Lagos",
                    "Banana Island, Lagos",
                    "Ikeja GRA, Lagos",
                  ].map((location, index) => (
                    <button
                      key={index}
                      onClick={() => setLocationSearch(location)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-[#4ea8a1] flex-shrink-0" />
                      <span className="text-[14px]">{location}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "Bedrooms":
        return (
          <div className="space-y-2">
            {bedroomOptions.map((option) => (
              <button
                key={option}
                onClick={() =>
                  toggleSelection(selectedBedrooms, setSelectedBedrooms, option)
                }
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <span className="text-[14px]">{option}</span>
                {selectedBedrooms.includes(option) && (
                  <Check className="w-4 h-4 text-[#4ea8a1]" />
                )}
              </button>
            ))}
          </div>
        );
      case "Property Type":
        return (
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  toggleSelection(
                    selectedPropertyTypes,
                    setSelectedPropertyTypes,
                    type,
                  )
                }
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <span className="text-[14px]">{type}</span>
                {selectedPropertyTypes.includes(type) && (
                  <Check className="w-4 h-4 text-[#4ea8a1]" />
                )}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Sort properties (client-side for Inda Score, API handles price sorting)
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];

    switch (sortBy) {
      case "Highest Inda Score":
        return sorted.sort((a, b) => b.trustScore - a.trustScore);
      default:
        // For price sorts and newest, API already handled it
        return sorted;
    }
  }, [sortBy, properties]);

  // Use sortedProperties directly since API handles the text search filtering
  const filteredProperties = sortedProperties;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for properties, locations, or features..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[15px] bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#4ea8a1] text-white rounded-lg text-[14px] hover:bg-[#3d8882] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {filteredProperties.length} Properties Found
                {query && (
                  <span className="text-gray-500 font-normal ml-2">
                    for &quot;{query}&quot;
                  </span>
                )}
              </h1>
            </div>

            {/* Sort & Filter */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[14px]">Filters</span>
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-[14px] bg-white"
                >
                  <option>Highest Inda Score</option>
                  <option>Lowest Price</option>
                  <option>Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Search Query Pill */}
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-muted-foreground">
              Searching for:
            </span>
            <div className="px-4 py-2 bg-[#4ea8a1]/10 text-[#4ea8a1] rounded-full text-[14px] border border-[#4ea8a1]/20">
              {query || "All properties"}
            </div>
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <div className="border-t border-gray-200 px-6 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {filterOptions.map((filter, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] hover:border-[#4ea8a1] hover:text-[#4ea8a1] transition-colors whitespace-nowrap ${activeFilter === filter ? "border-[#4ea8a1] text-[#4ea8a1]" : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Property Grid */}
          <div className="flex-1">
            {loading && page === 1 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#4ea8a1] animate-spin" />
                <span className="ml-3 text-gray-500">
                  Loading properties...
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8882]"
                >
                  Retry
                </button>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div>
                <div className="flex flex-col items-center justify-center py-12 text-center mb-8">
                  <Home className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    No properties found for &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try adjusting your filters or search query
                  </p>
                </div>

                {/* Suggested Properties */}
                {suggestedProperties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      You might also like
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {suggestedProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          {...property}
                          onViewProperty={handleViewProperty}
                          onMakeOffer={handleMakeOffer}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => {
                    const isLastElement =
                      filteredProperties.length === index + 1;
                    return (
                      <div
                        key={property.id}
                        ref={isLastElement ? lastPropertyElementRef : null}
                      >
                        <PropertyCard
                          {...property}
                          onViewProperty={handleViewProperty}
                          onMakeOffer={handleMakeOffer}
                        />
                      </div>
                    );
                  })}
                </div>
                {loading && page > 1 && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#4ea8a1] animate-spin" />
                    <span className="ml-2 text-gray-500">Loading more...</span>
                  </div>
                )}
                {!hasMore && filteredProperties.length > 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No more properties found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      {activeFilter && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setActiveFilter(null)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
              <h3>{activeFilter}</h3>
              <button
                onClick={() => setActiveFilter(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">{getFilterContent(activeFilter)}</div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-5 flex gap-3">
              <button
                onClick={() => {
                  setPriceRange([0, 300000000]);
                  setSelectedBedrooms([]);
                  setSelectedPropertyTypes([]);
                  setLocationSearch("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-[14px]"
              >
                Clear All
              </button>
              <button
                onClick={() => setActiveFilter(null)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-br from-[#4ea8a1] to-[#3d8882] text-white rounded-lg hover:shadow-lg transition-all text-[14px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={showMakeOfferModal}
        onClose={() => setShowMakeOfferModal(false)}
        propertyId={selectedPropertyId}
        propertyTitle={selectedPropertyTitle}
        propertyPrice={selectedPropertyPrice}
        propertyWhatsapp={selectedPropertyWhatsapp}
      />
    </div>
  );
}

export default ResultsView;
