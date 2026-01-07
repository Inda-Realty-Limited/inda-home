import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaBed, FaBath, FaRulerCombined, FaEye,
    FaPen, FaComment, FaTrash, FaSpinner, FaPlusCircle, FaMapMarkerAlt
} from 'react-icons/fa';
import { ProListingsService, Listing } from '@/api/pro-listings';

type TabOption = 'active' | 'analytics';

export default function ListingsManagerPage() {
    const [activeTab, setActiveTab] = useState<TabOption>('active');
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            const stored = localStorage.getItem('user');
            if (!stored) {
                setLoading(false);
                return;
            }

            try {
                const user = JSON.parse(stored);
                const userId = user.id || user._id || user.user?.id;

                if (userId) {
                    const response = await ProListingsService.getUserListings(userId);
                    let data: Listing[] = [];

                    if (Array.isArray(response)) {
                        data = response;
                    }
                    else if (response && Array.isArray(response.data)) {
                        data = response.data;
                    }
                    else if (response && response.success && Array.isArray(response.data)) {
                        data = response.data;
                    }

                    setListings(data);
                }
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError("Could not load listings.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const handleDelete = async (indaTag: string) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await ProListingsService.deleteListing(indaTag);
            setListings(prev => prev.filter(l => l.indaTag !== indaTag && l.id !== indaTag));
        } catch (err) {
            alert("Failed to delete listing.");
        }
    };

    return (
        <DashboardLayout title="Listings Manager">
            <div className="max-w-6xl mx-auto pb-10">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-inda-dark">My Listings</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and track your property portfolio</p>
                    </div>
                    <Link href="/listings/add">
                        <button className="bg-inda-teal text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2">
                            <FaPlusCircle /> Create New Listing
                        </button>
                    </Link>
                </div>

                <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-3 text-sm font-medium transition-all ${activeTab === 'active' ? 'border-b-2 border-inda-teal text-inda-teal' : 'text-gray-500 hover:text-inda-dark'
                            }`}
                    >
                        Active Listings
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`pb-3 text-sm font-medium transition-all ${activeTab === 'analytics' ? 'border-b-2 border-inda-teal text-inda-teal' : 'text-gray-500 hover:text-inda-dark'
                            }`}
                    >
                        Performance Analytics
                    </button>
                </div>

                {activeTab === 'active' && (
                    <div>
                        {loading ? (
                            <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-inda-teal" /></div>
                        ) : error ? (
                            <div className="text-red-500 text-center py-10 bg-red-50 rounded-lg border border-red-100">
                                {error}
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed flex flex-col items-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <FaPlusCircle className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">No listings yet</h3>
                                <p className="text-gray-500 mb-6 max-w-sm">
                                    You haven&apos;t created any listings yet. Start adding your properties to track them here.
                                </p>
                                <Link href="/listings/add">
                                    <button className="bg-inda-teal text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors">
                                        Create your first listing
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((item: any) => {
                                    const displayImage = item.imageUrl || item.images?.[0] || 'https://placehold.co/600x400?text=No+Image';
                                    const rawPrice = item.price || item.purchasePrice || 0;
                                    const displayPrice = Number(rawPrice).toLocaleString();
                                    const displayLocation = item.address || item.microlocation || 'Location N/A';
                                    const beds = item.bedrooms || item.specs?.bed || item.specs?.bedrooms || 0;
                                    const baths = item.bathrooms || item.specs?.bath || item.specs?.bathrooms || 0;
                                    const size = item.size || item.specs?.size || 'N/A';

                                    return (
                                        <div key={item.id || item.indaTag} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                            <div className="h-48 bg-gray-200 relative group overflow-hidden">
                                                <img
                                                    src={displayImage}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-inda-dark shadow-sm border border-gray-100">
                                                    {item.status || 'Active'}
                                                </div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-inda-teal bg-inda-teal/10 px-2 py-1 rounded uppercase tracking-wide">
                                                        {item.propertyType || item.type || 'Property'}
                                                    </span>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₦{displayPrice}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1" title={item.title}>
                                                    {item.title || 'Untitled Property'}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-4 line-clamp-1 flex items-center gap-1">
                                                    <FaMapMarkerAlt size={10} />
                                                    {displayLocation}
                                                </p>

                                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    <div className="flex flex-col items-center justify-center border-r border-gray-200">
                                                        <span className="flex items-center gap-1 font-semibold text-gray-800"><FaBed /> {beds}</span>
                                                        <span className="text-[10px] text-gray-400">Beds</span>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center border-r border-gray-200">
                                                        <span className="flex items-center gap-1 font-semibold text-gray-800"><FaBath /> {baths}</span>
                                                        <span className="text-[10px] text-gray-400">Baths</span>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="flex items-center gap-1 font-semibold text-gray-800"><FaRulerCombined /> {size}</span>
                                                        <span className="text-[10px] text-gray-400">Sqm</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex gap-3 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1 hover:text-inda-teal" title="Views">
                                                            <FaEye /> {item.views || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1 hover:text-inda-teal" title="Leads">
                                                            <FaComment /> {item.leads || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href={`/listings/edit?id=${item.indaTag || item.id}`}>
                                                            <button className="text-gray-400 hover:text-inda-teal transition-colors p-2 rounded-full hover:bg-gray-100">
                                                                <FaPen size={12} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.indaTag || item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-500">Detailed performance analytics are coming soon.</p>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
