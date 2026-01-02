import { Button } from '../views/index/sections/ui/button';
import { Search, SlidersHorizontal, ChevronDown, MapPin, Home, Check, Loader2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../views/index/sections/ui/tabs';
import { PropertyCard } from '../views/search-results/sections/PropertyCard';
import { MakeOfferModal } from '../views/search-results/sections/MakeOfferModal';
import { useDebounce } from '@/hooks/useDebounce';
import apiClient from '@/api';

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
  'Price Range',
  'Bedrooms',
  'Inda Score',
  'Location',
  'Property Type'
];

const bedroomOptions = ['1 Bed', '2 Beds', '3 Beds', '4 Beds', '5+ Beds'];

const propertyTypes = [
  'Apartment',
  'Duplex',
  'Terrace',
  'Semi-Detached',
  'Detached House',
  'Penthouse',
  'Studio',
  'Land'
];

const formatPriceDisplay = (priceNGN: number | null | undefined): string => {
  if (!priceNGN) return '₦0';
  if (priceNGN >= 1000000000) {
    return `₦${(priceNGN / 1000000000).toFixed(1)}B`;
  }
  if (priceNGN >= 1000000) {
    return `₦${(priceNGN / 1000000).toFixed(0)}M`;
  }
  return `₦${priceNGN.toLocaleString()}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFmvStatus = (listing: any): string => {
  const price = Number(listing.purchasePrice) || listing.priceNGN || 0;
  const fmv = Number(listing.fmv) || listing.fmvNGN || listing.analytics?.fmvNGN || 0;
  if (!fmv || !price) return 'Unknown';
  const diff = ((price - fmv) / fmv) * 100;
  if (diff < -5) return 'Below FMV';
  if (diff > 5) return 'Above FMV';
  return 'At FMV';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapListingToProperty = (listing: any): Property => {
  const images = listing.imageUrls || listing.images || listing.propertyImages || [];
  const firstImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1662454419736-de132ff75638?w=800';
  const bedroomCount = parseInt(listing.bedrooms) || listing.bedrooms || 0;
  const priceValue = Number(listing.purchasePrice) || listing.priceNGN || 0;
  
  return {
    id: listing._id || listing.id || listing.indaTag || String(Math.random()),
    image: firstImage,
    title: listing.title || `${bedroomCount}-Bed ${listing.propertyType || listing.propertyTypeStd || 'Property'}`,
    location: listing.microlocation || listing.microlocationStd || listing.lga || listing.state || 'Lagos',
    latitude: listing.latitude,
    longitude: listing.longitude,
    beds: typeof bedroomCount === 'number' ? bedroomCount : parseInt(bedroomCount) || 0,
    trustScore: listing.indaScore || listing.analytics?.indaScore || Math.floor(Math.random() * 20) + 70,
    price: formatPriceDisplay(priceValue),
    priceValue: priceValue,
    fmv: getFmvStatus(listing),
    verified: listing.verified !== false && listing.status === 'Active',
    whatsapp: listing.sellerPhone || '2347084960775'
  };
};

export function ForBuyers() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"link" | "ai">("ai");
  const [searchPending, setSearchPending] = useState(false);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [suggestedProperties, setSuggestedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Highest Inda Score');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const isResettingRef = useRef(false);
  
  const debouncedPriceRange = useDebounce(priceRange, 500);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);

  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState<string>('');
  const [selectedPropertyPrice, setSelectedPropertyPrice] = useState<string>('');
  const [selectedPropertyWhatsapp, setSelectedPropertyWhatsapp] = useState<string>('');

  const isValidUrl = useMemo(
    () =>
      (value: string) => {
        try {
          const url = new URL(value.trim());
          return ["http:", "https:"].includes(url.protocol);
        } catch {
          return false;
        }
      },
    [],
  );

  const handleSearch = useCallback(() => {
    if (searchMode === "ai") return;
    if (!isValidUrl(search)) return;

    const encoded = encodeURIComponent(search.trim());

    if (isLoading) {
      setSearchPending(true);
      return;
    }

    if (!isAuthenticated) {
      router.push(`/auth/signup?q=${encoded}&type=link`);
      return;
    }

    router.push(`/result?q=${encoded}&type=link`);
  }, [isAuthenticated, isLoading, router, search, isValidUrl, searchMode]);

  const handleAiSearch = useCallback(() => {
    if (searchMode !== "ai") return;
    const query = search.trim();
    if (!query) {
      setPage(1);
      isResettingRef.current = true;
      return;
    }

    setPage(1);
    isResettingRef.current = true;
  }, [searchMode, search]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && searchPending) {
      handleSearch();
      setSearchPending(false);
    }
  }, [handleSearch, isAuthenticated, isLoading, searchPending]);

  const lastPropertyElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && searchMode === "ai") {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, searchMode]);

  useEffect(() => {
    isResettingRef.current = true;
    setPage(1);
    setHasMore(true);
  }, [search, selectedBedrooms, debouncedPriceRange, selectedPropertyTypes, debouncedLocationSearch, sortBy]);

  useEffect(() => {
    if (searchMode !== "ai") {
      setProperties([]);
      return;
    }

    const fetchListings = async () => {
      if (page !== 1 && isResettingRef.current) {
        return;
      }
      isResettingRef.current = false;
      
      setLoading(true);
      setError(null);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, any> = {
          page: page,
          limit: 20,
        };
        
        if (search.trim()) {
          params.q = search.trim();
        }
        
        if (selectedBedrooms.length > 0) {
          const bedroomNums = selectedBedrooms.map(b => {
            const match = b.match(/\d+/);
            return match ? parseInt(match[0]) : null;
          }).filter((num): num is number => num !== null);
          if (bedroomNums.length === 1) {
            params.bedrooms = bedroomNums[0];
          }
        }
        
        if (debouncedPriceRange[0] > 0) {
          params.minPrice = debouncedPriceRange[0];
        }
        if (debouncedPriceRange[1] < 5000000000) {
          params.maxPrice = debouncedPriceRange[1];
        }
        
        if (selectedPropertyTypes.length > 0) {
          params.propertyType = selectedPropertyTypes.join(',');
        }
        
        if (debouncedLocationSearch.trim()) {
          params.microlocation = debouncedLocationSearch.trim();
        }
        
        let sortParam = 'newest';
        if (sortBy === 'Lowest Price') {
          sortParam = 'price_asc';
        } else if (sortBy === 'Highest Price') {
          sortParam = 'price_desc';
        }
        params.sort = sortParam;
        
        const response = await apiClient.get('/listings', { params });
        
        const data = response.data;
        const listings = data.data?.items || data.data?.listings || data.listings || data.data || [];
        
        if (Array.isArray(listings)) {
          const mappedProperties = listings.map(mapListingToProperty);
          
          if (page === 1) {
            setProperties(mappedProperties);
          } else {
            setProperties(prev => [...prev, ...mappedProperties]);
          }

          const pagination = data.data?.pagination;
          if (pagination) {
            setHasMore(pagination.page < pagination.totalPages);
          } else {
            setHasMore(mappedProperties.length === 20);
          }
          
          if (mappedProperties.length === 0) {
            try {
              const suggestionResponse = await apiClient.get('/listings', {
                params: { page: 1, limit: 6, sort: 'newest' }
              });
              const suggestionData = suggestionResponse.data;
              const suggestions = suggestionData.data?.items || suggestionData.data?.listings || suggestionData.listings || suggestionData.data || [];
              if (Array.isArray(suggestions)) {
                setSuggestedProperties(suggestions.map(mapListingToProperty));
              }
            } catch (suggestionErr) {
              console.warn('Failed to fetch suggestions:', suggestionErr);
            }
          } else {
             setSuggestedProperties([]);
          }
        } else {
          console.warn('Unexpected API response format:', data);
          setProperties([]);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listings');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchMode, search, selectedBedrooms, debouncedPriceRange, selectedPropertyTypes, debouncedLocationSearch, sortBy, page]);

  const handleViewProperty = (propertyId: string) => {
    console.log('Viewing property:', propertyId);
  };

  const handleMakeOffer = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setSelectedPropertyId(propertyId);
    if (property) {
      setSelectedPropertyTitle(property.title);
      setSelectedPropertyPrice(property.price);
      setSelectedPropertyWhatsapp(property.whatsapp || '');
    }
    setShowMakeOfferModal(true);
  };

  const toggleSelection = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
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
      case 'Price Range':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">Min Price</span>
              <span className="text-[15px]">{formatPrice(priceRange[0])}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000000"
              step="5000000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #4ea8a1 0%, #4ea8a1 ${(priceRange[0] / 5000000000) * 100}%, #e5e7eb ${(priceRange[0] / 5000000000) * 100}%, #e5e7eb 100%)`
              }}
            />
            
            <div className="flex items-center justify-between mt-8">
              <span className="text-[14px] text-muted-foreground">Max Price</span>
              <span className="text-[15px]">{formatPrice(priceRange[1])}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000000"
              step="5000000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #4ea8a1 0%, #4ea8a1 ${(priceRange[1] / 5000000000) * 100}%, #e5e7eb ${(priceRange[1] / 5000000000) * 100}%, #e5e7eb 100%)`
              }}
            />

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-muted-foreground">Selected Range:</span>
                <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        );
      case 'Location':
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
                <p className="text-[13px] text-muted-foreground mb-2">Suggested locations:</p>
                {[
                  'Lekki Phase 1, Lagos, Nigeria',
                  'Victoria Island, Lagos, Nigeria',
                  'Ikoyi, Lagos, Nigeria',
                  'Ajah, Lagos, Nigeria',
                  'Yaba, Lagos, Nigeria'
                ].filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase())).map((location, index) => (
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
                <p className="text-[13px] text-muted-foreground mb-3">Popular locations:</p>
                <div className="space-y-2">
                  {[
                    'Lekki Phase 1, Lagos',
                    'Victoria Island, Lagos',
                    'Ikoyi, Lagos',
                    'Banana Island, Lagos',
                    'Ikeja GRA, Lagos'
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
      case 'Bedrooms':
        return (
          <div className="space-y-2">
            {bedroomOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleSelection(selectedBedrooms, setSelectedBedrooms, option)}
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
      case 'Property Type':
        return (
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleSelection(selectedPropertyTypes, setSelectedPropertyTypes, type)}
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

  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    
    switch (sortBy) {
      case 'Highest Inda Score':
        return sorted.sort((a, b) => b.trustScore - a.trustScore);
      default:
        return sorted;
    }
  }, [sortBy, properties]);

  const filteredProperties = sortedProperties;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <section className="relative pt-32 pb-8 px-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="max-w-7xl mx-auto relative">
            <div className="mb-8 text-center">
              <h1 className="text-4xl lg:text-5xl mb-4 leading-tight text-gray-900">
                Buy with certainty. Get the truth about{' '}
                <span className="bg-gradient-to-r from-[#4ea8a1] to-teal-600 bg-clip-text text-transparent">
                  any property.
                </span>
              </h1>
            </div>

            <Tabs 
              defaultValue="ai" 
              value={searchMode}
              onValueChange={(value: string) => setSearchMode(value as "link" | "ai")}
              className="w-full"
            >
              <TabsList className="w-full mb-6 bg-white rounded-2xl shadow-lg p-1.5 max-w-2xl mx-auto">
               
                <TabsTrigger 
                  value="ai"
                  className="flex-1 data-[state=active]:bg-[#4ea8a1] data-[state=active]:text-white"
                >
                  Search Listings
                </TabsTrigger>
                <TabsTrigger 
                  value="link" 
                  className="flex-1 data-[state=active]:bg-[#4ea8a1] data-[state=active]:text-white"
                >
                  Scan Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="mt-0">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                      id="buyer-search-input"
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      placeholder="Paste property link..."
                      className="flex-1 outline-none text-gray-900"
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={!isValidUrl(search)}
                      className={`bg-[#4ea8a1] hover:bg-[#3d8680] px-6 ${!isValidUrl(search) ? "opacity-60 cursor-not-allowed hover:bg-[#4ea8a1]" : ""}`}
                    >
                      Scan
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto mb-8">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                      id="buyer-search-input"
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAiSearch();
                        }
                      }}
                      placeholder="e.g. 3 bedroom flat in Ikoyi"
                      className="flex-1 outline-none text-gray-900"
                    />
                    <Button
                      onClick={handleAiSearch}
                      disabled={!search.trim()}
                      className={`bg-[#4ea8a1] hover:bg-[#3d8680] px-6 ${!search.trim() ? "opacity-60 cursor-not-allowed hover:bg-[#4ea8a1]" : ""}`}
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {searchMode === "ai" && (
                  <div className="max-w-7xl mx-auto">
                    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 mb-6">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              {filteredProperties.length} Properties Found
                              {search && <span className="text-gray-500 font-normal ml-2">for &quot;{search}&quot;</span>}
                            </h2>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setActiveFilter(activeFilter ? null : 'Price Range')}
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
                                <option>Highest Price</option>
                                <option>Newest</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[14px] text-muted-foreground">Searching for:</span>
                          <div className="px-4 py-2 bg-[#4ea8a1]/10 text-[#4ea8a1] rounded-full text-[14px] border border-[#4ea8a1]/20">
                            {search || 'All properties'}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-6 py-3 overflow-x-auto">
                        <div className="flex gap-2 min-w-max">
                          {filterOptions.map((filter, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveFilter(filter)}
                              className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] hover:border-[#4ea8a1] hover:text-[#4ea8a1] transition-colors whitespace-nowrap ${activeFilter === filter ? 'border-[#4ea8a1] text-[#4ea8a1]' : ''}`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-8">
                      {loading && page === 1 ? (
                        <div className="flex items-center justify-center py-20">
                          <Loader2 className="w-10 h-10 text-[#4ea8a1] animate-spin" />
                          <span className="ml-3 text-gray-500">Loading properties...</span>
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
                            <p className="text-gray-500 text-lg">No properties found {search && `for "${search}"`}</p>
                            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search query</p>
                          </div>
                          
                          {suggestedProperties.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-700 mb-4">You might also like</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {suggestedProperties.map((property) => (
                                  <PropertyCard key={property.id} {...property} onViewProperty={handleViewProperty} onMakeOffer={handleMakeOffer} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((property, index) => {
                              const isLastElement = filteredProperties.length === index + 1;
                              return (
                                <div key={property.id} ref={isLastElement ? lastPropertyElementRef : null}>
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
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>

      {activeFilter && searchMode === "ai" && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setActiveFilter(null)}
          />
          
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
            <div className="p-5">
              {getFilterContent(activeFilter)}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-5 flex gap-3">
              <button
                onClick={() => {
                  setPriceRange([0, 5000000000]);
                  setSelectedBedrooms([]);
                  setSelectedPropertyTypes([]);
                  setLocationSearch('');
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

      <MakeOfferModal
        isOpen={showMakeOfferModal}
        onClose={() => setShowMakeOfferModal(false)}
        propertyId={selectedPropertyId}
        propertyTitle={selectedPropertyTitle}
        propertyPrice={selectedPropertyPrice}
        propertyWhatsapp={selectedPropertyWhatsapp}
      />
    </>
  );
}

export default ForBuyers;