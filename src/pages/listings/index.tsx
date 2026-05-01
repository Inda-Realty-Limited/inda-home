import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
    Search, SlidersHorizontal, MapPin, TrendingUp, Building2,
    Plus, ChevronDown, X, Bookmark, BookmarkCheck, Eye, Edit3
} from 'lucide-react';
import { ProListingsService, Listing } from '@/api/pro-listings';
import { PropertyUploadModal } from '@/components/listings/PropertyUploadModal';
import { cn } from '@/lib/utils';

const TYPE_FILTERS = ['All Properties', 'Land', 'Completed', 'Off-Plan'];

const TYPE_BADGE_COLORS: Record<string, string> = {
    land: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    'off-plan': 'bg-blue-100 text-blue-700',
    apartment: 'bg-purple-100 text-purple-700',
    house: 'bg-indigo-100 text-indigo-700',
    default: 'bg-gray-100 text-gray-700',
};

const ENRICHMENT_BADGE_STYLES: Record<string, string> = {
    success: 'bg-green-100 text-green-700',
    failed: 'bg-amber-100 text-amber-700',
    pending: 'bg-blue-100 text-blue-700',
};

function getTypeBadgeClass(type: string) {
    const key = (type || '').toLowerCase();
    return TYPE_BADGE_COLORS[key] || TYPE_BADGE_COLORS.default;
}

function getEnrichmentMeta(status?: string | null) {
    if (status === 'success') {
        return {
            label: 'Insights Ready',
            className: ENRICHMENT_BADGE_STYLES.success,
        };
    }

    if (status === 'failed') {
        return {
            label: 'Insights Delayed',
            className: ENRICHMENT_BADGE_STYLES.failed,
        };
    }

    return {
        label: 'Insights Processing',
        className: ENRICHMENT_BADGE_STYLES.pending,
    };
}

export default function ListingsHubPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'marketplace' | 'mine'>('marketplace');
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All Properties');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bedroomsFilter, setBedroomsFilter] = useState('');
    const [sortBy, setSortBy] = useState('Newest First');
    const [savedListings, setSavedListings] = useState<Set<string>>(new Set());

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleOpenUploadModal = useCallback(() => {
        setIsUploadModalOpen(true);
    }, []);

    useEffect(() => {
        if (router.query.add === 'true' && !loading) {
            handleOpenUploadModal();
            router.replace('/listings', undefined, { shallow: true });
        }
    }, [router.query.add, router, loading, handleOpenUploadModal]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await ProListingsService.getAllListings(1, 50);
                const data = Array.isArray(res) ? res : (res?.data ?? []);
                setAllListings(data);
            } catch {
                setAllListings([]);
            }
        };

        const fetchMine = async () => {
            if (!user) return;
            try {
                const userId = user.id || user._id || (user as any).user?.id;
                if (userId) {
                    const res = await ProListingsService.getUserListings(userId);
                    const data = Array.isArray(res) ? res : (res?.data ?? []);
                    setMyListings(data);
                }
            } catch {
                setMyListings([]);
            }
        };

        Promise.all([fetchAll(), fetchMine()]).finally(() => setLoading(false));
    }, [user]);

    const handlePropertyAdded = (newProperty: any) => {
        setMyListings(prev => [newProperty, ...prev]);
        setAllListings(prev => [newProperty, ...prev]);
    };

    const toggleSaved = (id: string) => {
        setSavedListings(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setTypeFilter('All Properties');
        setMinPrice('');
        setMaxPrice('');
        setBedroomsFilter('');
    };

    const source = activeTab === 'marketplace' ? allListings : myListings;

    const filtered = source.filter(item => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q ||
            (item.title || '').toLowerCase().includes(q) ||
            (item.location || '').toLowerCase().includes(q) ||
            ((item as any).lga || '').toLowerCase().includes(q);

        const itemType = ((item as any).propertyType || (item as any).type || '').toLowerCase();
        const matchType = typeFilter === 'All Properties' ||
            itemType.includes(typeFilter.toLowerCase().replace(' ', '-')) ||
            itemType.includes(typeFilter.toLowerCase());

        const price = Number((item as any).priceNGN || (item as any).price || 0);
        const matchMin = !minPrice || price >= Number(minPrice);
        const matchMax = !maxPrice || price <= Number(maxPrice);

        const beds = Number((item as any).bedrooms || (item as any).specs?.bed || 0);
        const matchBeds = !bedroomsFilter || beds >= Number(bedroomsFilter);

        return matchSearch && matchType && matchMin && matchMax && matchBeds;
    });

    const hasActiveFilters = searchQuery || typeFilter !== 'All Properties' || minPrice || maxPrice || bedroomsFilter;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-inda-teal to-teal-700 bg-clip-text text-transparent">
                                Listings Hub
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">Browse the marketplace or manage your own properties</p>
                        </div>
                        <button
                            onClick={handleOpenUploadModal}
                            className="flex items-center gap-2 bg-inda-teal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Property
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                        {[
                            { key: 'marketplace', label: 'Listings Marketplace' },
                            { key: 'mine', label: 'My Listings' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as 'marketplace' | 'mine')}
                                className={cn(
                                    'px-4 py-2 rounded-md text-sm font-medium transition-all',
                                    activeTab === tab.key
                                        ? 'bg-gradient-to-r from-inda-teal to-teal-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search + Filter Bar */}
                    <div className="space-y-3">
                        <div className="flex gap-3 flex-wrap">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[220px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search properties, locations..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30 focus:border-inda-teal"
                                />
                            </div>

                            {/* Filters toggle */}
                            <button
                                onClick={() => setShowFilters(v => !v)}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors',
                                    showFilters
                                        ? 'bg-inda-teal text-white border-inda-teal'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-inda-teal'
                                )}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                )}
                            </button>

                            {/* Quick type filters */}
                            <div className="flex gap-2 flex-wrap">
                                {TYPE_FILTERS.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTypeFilter(t)}
                                        className={cn(
                                            'px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors',
                                            typeFilter === t
                                                ? 'bg-inda-teal text-white border-inda-teal'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-inda-teal'
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced filters */}
                        {showFilters && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 flex-wrap items-end">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Bedrooms</label>
                                    <select
                                        value={bedroomsFilter}
                                        onChange={e => setBedroomsFilter(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                                    >
                                        <option value="">Any</option>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n}+</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Min Price (₦)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Max Price (₦)</label>
                                    <input
                                        type="number"
                                        placeholder="Any"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                                    />
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 ml-auto"
                                >
                                    <X className="w-3.5 h-3.5" /> Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results bar */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {loading ? 'Loading...' : `${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'} found`}
                        </p>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30 cursor-pointer"
                            >
                                <option>Newest First</option>
                                <option>Oldest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
                                    <div className="w-16 h-12 bg-gray-100 animate-pulse rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-100 animate-pulse rounded w-48" />
                                        <div className="h-3 bg-gray-100 animate-pulse rounded w-32" />
                                    </div>
                                    <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                                    <div className="h-4 bg-gray-100 animate-pulse rounded w-16" />
                                    <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 py-20 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-700 mb-1">No properties found</p>
                                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-inda-teal hover:text-inda-teal transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" /> Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Table header */}
                            <div className="grid grid-cols-[2fr_1.2fr_0.8fr_1fr_0.8fr_0.6fr_1.2fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                <span>Property</span>
                                <span>Location</span>
                                <span>Type</span>
                                <span>Insights</span>
                                <span>Price</span>
                                <span>ROI</span>
                                <span className="text-right">Actions</span>
                            </div>

                            {/* Table rows */}
                            {filtered.map((item: any, idx) => {
                                const id = item.id || item._id || item.indaTag || String(idx);
                                const image = item.imageUrls?.[0] || item.imageUrl || item.images?.[0];
                                const price = Number(item.priceNGN || item.price || 0);
                                const location = item.microlocationStd || item.lga || item.location || item.address || '—';
                                const type = item.propertyType || item.type || '—';
                                const beds = item.bedrooms || item.specs?.bed || null;
                                const baths = item.bathrooms || item.specs?.bath || null;
                                const size = item.size || item.specs?.size || null;
                                const roi = item.roi || item.intelligenceData?.roi || null;
                                const enrichment = getEnrichmentMeta(item.locationIntelligenceStatus);
                                const isSaved = savedListings.has(id);

                                return (
                                    <div
                                        key={id}
                                        className="grid grid-cols-[2fr_1.2fr_0.8fr_1fr_0.8fr_0.6fr_1.2fr] gap-4 px-5 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Property */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-inda-teal/20 to-teal-600/30">
                                                {image && (
                                                    <img src={image} alt={item.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.title || 'Untitled'}</p>
                                                {item.indaTag && (
                                                    <span className="inline-block text-[10px] font-medium bg-inda-teal/10 text-inda-teal px-1.5 py-0.5 rounded mt-0.5">
                                                        {item.indaTag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600 min-w-0">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{location}</span>
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getTypeBadgeClass(type))}>
                                                {type}
                                            </span>
                                        </div>

                                        {/* Insights */}
                                        <div className="min-w-0">
                                            <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-medium', enrichment.className)}>
                                                {enrichment.label}
                                            </span>
                                            <p className="mt-1 truncate text-xs text-gray-500">
                                                {item.locationIntelligenceStatus === 'success'
                                                    ? roi
                                                        ? `${roi}% projected ROI available`
                                                        : 'Area analytics attached'
                                                    : item.locationIntelligenceStatus === 'failed'
                                                        ? 'Retrying enrichment in background'
                                                        : beds !== null && baths !== null
                                                            ? `${beds} bed · ${baths} bath`
                                                            : size
                                                                ? `${size} sqm`
                                                                : 'Waiting for analysis'}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-sm font-semibold text-gray-900">
                                            ₦{price.toLocaleString()}
                                        </div>

                                        {/* ROI */}
                                        <div className="flex items-center gap-1 text-sm">
                                            {roi ? (
                                                <>
                                                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                                    <span className="text-green-600 font-medium">{roi}%</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => router.push(`/property/${item.indaTag || item.id || item._id}`)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-inda-teal border border-inda-teal/30 px-3 py-1.5 rounded-lg hover:bg-inda-teal/5 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </button>
                                            {activeTab === 'mine' && (
                                                <button
                                                    onClick={() => router.push(`/listings/edit?id=${item.id || item._id}`)}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-inda-teal hover:text-inda-teal transition-colors"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                            )}
                                            {activeTab === 'marketplace' && (
                                                <button
                                                    onClick={() => toggleSaved(id)}
                                                    className={cn(
                                                        'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
                                                        isSaved
                                                            ? 'bg-inda-teal text-white border-inda-teal'
                                                            : 'text-gray-600 border-gray-200 hover:border-inda-teal hover:text-inda-teal'
                                                    )}
                                                >
                                                    {isSaved
                                                        ? <><BookmarkCheck className="w-3.5 h-3.5" /> Saved</>
                                                        : <><Bookmark className="w-3.5 h-3.5" /> Save</>
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                {/* Modals */}
                {isUploadModalOpen && (
                    <PropertyUploadModal
                        onClose={() => setIsUploadModalOpen(false)}
                        onPropertyAdded={handlePropertyAdded}
                    />
                )}

            </DashboardLayout>
        </ProtectedRoute>
    );
}
