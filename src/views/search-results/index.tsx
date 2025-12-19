import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, SlidersHorizontal, ChevronDown, MapPin, TrendingUp, Home, Check, Search } from 'lucide-react';
import { PropertyCard } from './sections/PropertyCard';
import { MakeOfferModal } from './sections/MakeOfferModal';
import PropertyMap from '@/components/PropertyMap';
import { Navbar } from '@/components';

// Mock property data
const mockProperties = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2MzkwMjc2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '2-Bed Apartment in Lekki',
    location: 'Lekki Phase 1',
    latitude: 6.4522,
    longitude: 3.5819,
    beds: 2,
    trustScore: 87,
    price: '₦45M',
    priceValue: 45000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348012345678'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MzkwMjk5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Luxury Apartment',
    location: 'Victoria Island',
    latitude: 6.4301,
    longitude: 3.4289,
    beds: 3,
    trustScore: 92,
    price: '₦85M',
    priceValue: 85000000,
    fmv: 'At FMV',
    verified: true,
    whatsapp: '2348023456789'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1756016865217-bac7c13c3238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXBsZXglMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2Mzk5NDkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '4-Bed Duplex',
    location: 'Ikoyi',
    latitude: 6.4608,
    longitude: 3.4295,
    beds: 4,
    trustScore: 95,
    price: '₦120M',
    priceValue: 120000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348034567890'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1703783028657-5905a1662aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZXJyYWNlJTIwaG91c2V8ZW58MXx8fHwxNzYzOTk0OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Terrace',
    location: 'Ajah',
    latitude: 6.4968,
    longitude: 3.5623,
    beds: 3,
    trustScore: 78,
    price: '₦38M',
    priceValue: 38000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348045678901'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzkzMDAwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '2-Bed Apartment',
    location: 'Yaba',
    beds: 2,
    trustScore: 82,
    price: '₦32M',
    priceValue: 32000000,
    fmv: 'At FMV',
    verified: true,
    whatsapp: '2348056789012'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHByb3BlcnR5JTIwbmlnZXJpYXxlbnwxfHx8fDE3NjM5OTQ5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Semi-Detached',
    location: 'Ikeja GRA',
    beds: 3,
    trustScore: 88,
    price: '₦65M',
    priceValue: 65000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348171851665'
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2MzkwMjc2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '1-Bed Studio Apartment',
    location: 'Lekki Phase 2',
    beds: 1,
    trustScore: 75,
    price: '₦28M',
    priceValue: 28000000,
    fmv: 'At FMV',
    whatsapp: '2348078901234',
    verified: false
  },
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1756016865217-bac7c13c3238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXBsZXglMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2Mzk5NDkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Duplex',
    location: 'Magodo',
    beds: 3,
    trustScore: 84,
    price: '₦52M',
    priceValue: 52000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348089012345'
  },
  {
    id: '10',
    image: 'https://images.unsplash.com/photo-1703783028657-5905a1662aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZXJyYWNlJTIwaG91c2V8ZW58MXx8fHwxNzYzOTk0OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '4-Bed Terrace House',
    location: 'Surulere',
    beds: 4,
    trustScore: 79,
    price: '₦48M',
    priceValue: 48000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348090123456'
  },
  {
    id: '11',
    image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzkzMDAwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '2-Bed Modern Flat',
    location: 'Gbagada',
    beds: 2,
    trustScore: 81,
    price: '₦35M',
    priceValue: 35000000,
    fmv: 'At FMV',
    verified: true,
    whatsapp: '2348091234567'
  },
  {
    id: '12',
    image: 'https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHByb3BlcnR5JTIwbmlnZXJpYXxlbnwxfHx8fDE3NjM5OTQ5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Detached House',
    location: 'Maryland',
    beds: 3,
    trustScore: 86,
    price: '₦70M',
    priceValue: 70000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348092345678'
  },
  {
    id: '13',
    image: 'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2MzkwMjc2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '2-Bed Serviced Apartment',
    location: 'Lekki Phase 1',
    beds: 2,
    trustScore: 90,
    price: '₦55M',
    priceValue: 55000000,
    fmv: 'At FMV',
    verified: true,
    whatsapp: '2348093456789'
  },
  {
    id: '14',
    image: 'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MzkwMjk5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Luxury Flat',
    location: 'Oniru',
    beds: 3,
    trustScore: 93,
    price: '₦95M',
    priceValue: 95000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348094567890'
  },
  {
    id: '15',
    image: 'https://images.unsplash.com/photo-1756016865217-bac7c13c3238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdXBsZXglMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2Mzk5NDkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '5-Bed Mansion',
    location: 'Victoria Island',
    beds: 5,
    trustScore: 96,
    price: '₦180M',
    priceValue: 180000000,
    fmv: 'Below FMV',
    verified: true,
    whatsapp: '2348095678901'
  },
  {
    id: '16',
    image: 'https://images.unsplash.com/photo-1703783028657-5905a1662aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZXJyYWNlJTIwaG91c2V8ZW58MXx8fHwxNzYzOTk0OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '3-Bed Terrace',
    location: 'Sangotedo',
    beds: 3,
    trustScore: 76,
    price: '₦42M',
    priceValue: 42000000,
    fmv: 'At FMV',
    verified: true,
    whatsapp: '2348096789012'
  },
  {
    id: '17',
    image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MzkzMDAwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '1-Bed Compact Apartment',
    location: 'Ogudu',
    beds: 1,
    trustScore: 74,
    price: '₦25M',
    priceValue: 25000000,
    fmv: 'Below FMV',
    verified: false,
    whatsapp: '2348097890123'
  },
  {
    id: '18',
    image: 'https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHByb3BlcnR5JTIwbmlnZXJpYXxlbnwxfHx8fDE3NjM5OTQ5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '4-Bed Executive Home',
    location: 'Parkview Estate',
    beds: 4,
    trustScore: 94,
    price: '₦140M',
    priceValue: 140000000,
    fmv: 'At FMV',
    verified: true,
    whatsapp: '2348098901234'
  }
];

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

export function ResultsView() {
  const router = useRouter();
  const query = (router.query.q as string) || '';
  
  const [sortBy, setSortBy] = useState('Highest Inda Score');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState<string>('');
  const [selectedPropertyPrice, setSelectedPropertyPrice] = useState<string>('');
  const [selectedPropertyWhatsapp, setSelectedPropertyWhatsapp] = useState<string>('');

  const handleViewProperty = (propertyId: string) => {
    console.log('Viewing property:', propertyId);
    // Future: Navigate to property details page
    // navigate(`/property/${propertyId}`);
  };

  const handleMakeOffer = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    setSelectedPropertyId(propertyId);
    if (property) {
      setSelectedPropertyTitle(property.title);
      setSelectedPropertyPrice(property.price);
      setSelectedPropertyWhatsapp(property.whatsapp || '');
    }
    setShowMakeOfferModal(true);
    console.log('Making offer for property:', propertyId);
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

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...mockProperties];
    
    switch (sortBy) {
      case 'Highest Inda Score':
        return sorted.sort((a, b) => b.trustScore - a.trustScore);
      case 'Highest FMV':
        return sorted.filter(p => p.fmv === 'Below FMV');
      case 'Lowest Price':
        return sorted.sort((a, b) => a.priceValue - b.priceValue);
      case 'Newest':
        return sorted;
      default:
        return sorted;
    }
  }, [sortBy]);

  const selectedProperty = mockProperties.find(p => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-slate-50">
          <Navbar/>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">

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
                  <option>Highest FMV</option>
                  <option>Lowest Price</option>
                  <option>Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Search Query Pill */}
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-muted-foreground">Searching for:</span>
            <div className="px-4 py-2 bg-[#4ea8a1]/10 text-[#4ea8a1] rounded-full text-[14px] border border-[#4ea8a1]/20">
              {query}
            </div>
            <span className="text-[14px] text-muted-foreground">
              {sortedProperties.length} properties found
            </span>
          </div>
        </div>

        {/* Horizontal Filter Bar */}
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
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Property Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} onViewProperty={handleViewProperty} onMakeOffer={handleMakeOffer} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          {showSidebar && (
            <div className="w-80 flex-shrink-0 space-y-4">
              {/* Area Stats Card */}
              <div className="bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <h3 className="mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4ea8a1]" />
                  Area Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] text-muted-foreground">Average FMV</span>
                      <span className="text-[14px]">₦58M</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] text-muted-foreground">Median Asking Price</span>
                      <span className="text-[14px]">₦52M</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] text-muted-foreground">Verified Properties</span>
                      <span className="text-[14px] text-[#4ea8a1]">15 of 17</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div className="bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <h3 className="mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4ea8a1]" />
                  Location Map
                </h3>
                <PropertyMap
                  latitude={6.4600}
                  longitude={3.4829}
                  zoom={12}
                  height="aspect-square"
                  className="rounded-lg"
                  title="Properties in Lagos"
                />
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8882] rounded-[14px] p-5 text-white shadow-[0_2px_12px_rgba(78,168,161,0.3)]">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5" />
                  <h3 className="text-white">Market Insight</h3>
                </div>
                <p className="text-[14px] text-white/90 leading-relaxed">
                  Properties in this area are trending{' '}
                  <span className="font-medium">12% below FMV</span>, making it an excellent time for buyers.
                </p>
              </div>
            </div>
          )}
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
            <div className="p-5">
              {getFilterContent(activeFilter)}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-5 flex gap-3">
              <button
                onClick={() => {
                  setPriceRange([0, 300000000]);
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

export default ResultsView
