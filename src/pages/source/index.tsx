import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaSearch, FaCheck, FaBed, FaBath, FaRulerCombined,
    FaMapMarkerAlt, FaEye, FaFilter, FaSpinner, FaSync
} from 'react-icons/fa';
import { ProListingsService, Listing } from '@/api/pro-listings';

const FILTERS = [
    "Fastest Moving Price Range",
    "Slowest Moving Price Range",
    "Sells Fast (<60 Days)",
    "Rents Fast (<30 Days)",
    "Fix & Flip",
    "Repossessed",
    "Below Market Value"
];

export default function SourceExplorerPage() {
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchListings = async (reset = false) => {
        try {
            if (reset) setLoading(true);
            const currentPage = reset ? 1 : page;
            const apiFilters: any = {};
            if (activeFilters.length > 0) apiFilters.tags = activeFilters.join(',');
            if (searchQuery) apiFilters.search = searchQuery;

            const response = await ProListingsService.getAllListings(currentPage, 9, apiFilters);
            const newData = response.data || (Array.isArray(response) ? response : []);
            const total = response.meta?.total || response.count || 0;

            if (reset) {
                setListings(newData);
            } else {
                setListings(prev => [...prev, ...newData]);
            }

            if (newData.length < 9 || (listings.length + newData.length) >= total) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error("Failed to load source explorer:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchListings(true);
    }, [activeFilters]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
        const nextPage = page + 1;
        ProListingsService.getAllListings(nextPage, 9, {
            tags: activeFilters.join(','),
            search: searchQuery
        }).then(response => {
            const newData = response.data || (Array.isArray(response) ? response : []);
            setListings(prev => [...prev, ...newData]);
            if (newData.length < 9) setHasMore(false);
        });
    };

    const handleSearch = () => {
        setPage(1);
        fetchListings(true);
    };

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    return (
        <DashboardLayout title="Source Explorer">
            <div className="max-w-7xl mx-auto pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-inda-dark">Source Explorer</h1>
                    <p className="text-gray-500 mt-1">Discover and analyze investment opportunities</p>
                </div>

                <div className="bg-[#F3F4F6] p-6 rounded-xl mb-10 border border-gray-200">
                    <h3 className="font-bold text-inda-dark mb-4">Property Search & Filters</h3>

                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-[#54A6A6] rounded-lg p-1 flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by location, property type..."
                                className="w-full bg-transparent text-white placeholder-white/70 px-4 outline-none text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-white border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition"
                        >
                            <FaSearch /> Search
                        </button>
                    </div>

                    <div className="border border-gray-300 rounded-lg p-4 bg-white mb-6">
                        <p className="text-sm font-bold text-gray-700 mb-3">Quick Filters</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {FILTERS.map(filter => (
                                <label key={filter} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                                    <div
                                        onClick={() => toggleFilter(filter)}
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeFilters.includes(filter) ? 'bg-inda-teal border-inda-teal text-white' : 'border-gray-400 bg-white'
                                            }`}
                                    >
                                        {activeFilters.includes(filter) && <FaCheck size={10} />}
                                    </div>
                                    {filter}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectDropdown label="Property Type" />
                        <SelectDropdown label="Price Range" />
                        <SelectDropdown label="All Categories" />
                    </div>
                </div>

                {loading && listings.length === 0 ? (
                    <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-inda-teal" /></div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No listings found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {listings.map((property) => {
                            const displayImage = property.imageUrl || (property.images && property.images[0]) || 'https://placehold.co/600x400?text=No+Image';
                            const displayPrice = Number(property.purchasePrice || property.price || 0).toLocaleString();
                            const displayFmv = Number(property.fmv || property.purchasePrice || 0).toLocaleString();
                            const location = property.microlocation || property.address || 'Unknown Location';
                            const beds = property.bedrooms || property.specs?.bed || 0;
                            const baths = property.bathrooms || property.specs?.bath || 0;
                            const size = property.size || property.specs?.size || 'N/A';

                            const roi = property.roi || "+12.5%";
                            const indaScore = property.indaScore || { label: "Medium", value: 65, color: "bg-[#D9A54C]" };
                            const verified = property.status === 'Active';

                            return (
                                <div key={property.id || property._id || property.indaTag} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-48 w-full bg-gray-200 relative group overflow-hidden">
                                        <img
                                            src={displayImage}
                                            alt={property.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                            <span className="bg-white/90 text-inda-dark text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                {property.propertyType || 'Property'}
                                            </span>
                                            {verified && (
                                                <span className="bg-[#54A6A6] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                                    <FaCheck size={8} /> Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="text-center mb-6">
                                            <h3 className="font-bold text-inda-dark text-lg line-clamp-1" title={property.title}>{property.title}</h3>
                                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                                                <FaMapMarkerAlt className="text-inda-teal" /> {location}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="text-gray-500">Asking Price:</span>
                                            <span className="font-bold text-inda-dark text-sm">₦{displayPrice}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs mb-4">
                                            <span className="text-gray-500">Fair Market Value: (FMV)</span>
                                            <span className="font-bold text-[#54A6A6] text-sm">₦{displayFmv}</span>
                                        </div>

                                        <div className="flex justify-between text-[10px] text-gray-500 mb-4 border-b border-gray-100 pb-4">
                                            <span className="flex items-center gap-1"><FaBed /> {beds} beds</span>
                                            <span className="flex items-center gap-1"><FaBath /> {baths} baths</span>
                                            <span className="flex items-center gap-1"><FaRulerCombined /> {size} sqm</span>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-gray-500 font-bold">ROI Snapshot:</span>
                                                <span className="text-[#54A6A6] font-bold">{roi}</span>
                                            </div>
                                            <div className="h-6 w-full flex items-end gap-1 opacity-50">
                                                {[20, 35, 45, 30, 60, 75, 50, 80].map((h, i) => (
                                                    <div key={i} className="bg-[#54A6A6] flex-1 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-gray-500 font-bold">Inda Score</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 relative">
                                                <div
                                                    className={`h-1.5 rounded-full ${indaScore.color || 'bg-inda-teal'}`}
                                                    style={{ width: `${indaScore.value}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-right mt-1">
                                                <span className={`text-[9px] text-white px-2 py-0.5 rounded-full ${indaScore.color || 'bg-inda-teal'}`}>
                                                    {indaScore.label}
                                                </span>
                                            </div>
                                        </div>

                                        <button className="w-full bg-[#F3F4F6] text-gray-600 text-xs font-bold py-3 rounded hover:bg-gray-200 transition flex items-center justify-center gap-2">
                                            <FaEye /> View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    {hasMore && !loading && (
                        <button
                            onClick={handleLoadMore}
                            className="bg-inda-dark text-white px-6 py-3 rounded-lg text-xs font-bold hover:bg-black transition shadow-lg flex items-center gap-2"
                        >
                            <FaSync /> Load More Properties
                        </button>
                    )}
                    <button className="bg-[#4A5568] text-white px-6 py-3 rounded-lg text-xs font-bold hover:bg-gray-700 transition shadow-lg flex items-center gap-2">
                        <FaFilter /> Save Search
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

function SelectDropdown({ label }: { label: string }) {
    return (
        <div className="relative">
            <select className="w-full bg-[#E5E7EB] text-gray-700 text-xs font-bold px-4 py-3 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition">
                <option>{label}</option>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <div className="absolute right-4 top-3.5 text-gray-500 pointer-events-none text-xs">▼</div>
        </div>
    );
}
