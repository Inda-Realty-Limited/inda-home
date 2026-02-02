import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
    FaBed, FaBath, FaRulerCombined, FaEye,
    FaPen, FaComment, FaTrash, FaSpinner, FaPlusCircle, FaMapMarkerAlt,
    FaExternalLinkAlt, FaShareAlt, FaCheck, FaLock, FaRocket
} from 'react-icons/fa';
import { ProListingsService, Listing } from '@/api/pro-listings';
import { PropertyUploadModal } from '@/components/listings/PropertyUploadModal';
import { PricingModal } from '@/components/dashboard/PricingModal';

// Plan listing limits
const PLAN_LIMITS: Record<string, number> = {
    free: 1,
    pro: 20,
    enterprise: Infinity,
};


export default function ListingsManagerPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const userPlan = user?.subscriptionPlan || 'free';
    const listingLimit = PLAN_LIMITS[userPlan] || 1;
    const hasReachedLimit = listings.length >= listingLimit;

    const handleOpenUploadModal = useCallback(() => {
        if (hasReachedLimit) {
            setIsLimitModalOpen(true);
        } else {
            setIsUploadModalOpen(true);
        }
    }, [hasReachedLimit]);

    const handleCopyLink = (listingId: string) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const link = `${baseUrl}/property/${listingId}`;
        navigator.clipboard.writeText(link);
        setCopiedId(listingId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (router.query.add === 'true' && !loading) {
            handleOpenUploadModal();
            // Clear the query param to avoid re-opening on refresh
            router.replace('/listings', undefined, { shallow: true });
        }
    }, [router.query.add, router, loading, handleOpenUploadModal]);

    useEffect(() => {
        const fetchListings = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const userId = user.id || user._id || (user as any).user?.id;

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
            } catch (_err) {
                console.error("Failed to fetch listings:", _err);
                setError("Could not load listings.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchListings();
        } else {
            // If no user immediately, wait or stop loading? 
            // Ideally loading stays true until auth check is done, but useAuth usually handles that.
            // If user is null but loading is true in auth context, we wait.
            // Assuming useAuth provides a loading state too, but I'll stick to this for now.
            // Actually, if user is null initially (before context loads), we shouldn't confirm "no user" yet if auth is loading.
            // But for now replacing localStorage logic directly.
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (listingId: string) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        if (!user) {
            alert("You must be logged in to delete listings.");
            return;
        }

        try {
            const userId = user.id || user._id || (user as any).user?.id;
            await ProListingsService.deleteListing(listingId, userId);
            setListings(prev => prev.filter(l =>
                (l as any)._id !== listingId &&
                l.indaTag !== listingId &&
                l.id !== listingId
            ));
        } catch (_err) {
            alert("Failed to delete listing.");
        }
    };

    const handlePropertyAdded = (newProperty: any) => {
        setListings(prev => [newProperty, ...prev]);
    };

    return (
        <DashboardLayout title="Listings Manager">
            <div className="max-w-6xl mx-auto pb-10">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-inda-dark">My Listings</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and track your property portfolio</p>
                    </div>
                    <button
                        onClick={handleOpenUploadModal}
                        className="bg-inda-teal text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2"
                    >
                        <FaPlusCircle /> Create New Listing
                    </button>
                </div>


                <div className="mt-4">
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
                                <button
                                    onClick={handleOpenUploadModal}
                                    className="bg-inda-teal text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors"
                                >
                                    Create your first listing
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((item: any) => {
                                    const displayImage = item.imageUrls?.[0] || item.imageUrl || item.images?.[0] || 'https://placehold.co/600x400?text=No+Image';
                                    const rawPrice = item.price || item.purchasePrice || 0;
                                    const displayPrice = Number(rawPrice).toLocaleString();
                                    const displayLocation = item.address || item.microlocation || 'Location N/A';
                                    const beds = item.bedrooms || item.specs?.bed || item.specs?.bedrooms || 0;
                                    const baths = item.bathrooms || item.specs?.bath || item.specs?.bathrooms || 0;
                                    const size = item.size || item.specs?.size || 'N/A';

                                    return (
                                        <div key={item._id || item.id || item.indaTag} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
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
                                                    <div className="flex gap-1">
                                                        <Link href={`/property/${item._id || item.id}`}>
                                                            <button
                                                                className="text-gray-400 hover:text-inda-teal transition-colors p-2 rounded-full hover:bg-gray-100"
                                                                title="View Property"
                                                            >
                                                                <FaExternalLinkAlt size={12} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleCopyLink(item._id || item.id)}
                                                            className="text-gray-400 hover:text-inda-teal transition-colors p-2 rounded-full hover:bg-gray-100"
                                                            title={copiedId === (item._id || item.id) ? "Copied!" : "Copy Link"}
                                                        >
                                                            {copiedId === (item._id || item.id) ? <FaCheck size={12} className="text-green-500" /> : <FaShareAlt size={12} />}
                                                        </button>
                                                        <Link href={`/listings/edit?id=${item._id || item.indaTag || item.id}`}>
                                                            <button
                                                                className="text-gray-400 hover:text-inda-teal transition-colors p-2 rounded-full hover:bg-gray-100"
                                                                title="Edit Listing"
                                                            >
                                                                <FaPen size={12} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item._id || item.indaTag || item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                                                            title="Delete Listing"
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
                </div>

            </div>

            {isUploadModalOpen && (
                <PropertyUploadModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onPropertyAdded={handlePropertyAdded}
                />
            )}

            {isLimitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
                        <div className="w-16 h-16 bg-inda-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaLock className="text-inda-teal text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-inda-dark mb-2">
                            Listing Limit Reached
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                            You&apos;ve reached the maximum of <strong>{listingLimit} listing{listingLimit !== 1 ? 's' : ''}</strong> on the <strong className="capitalize">{userPlan}</strong> plan.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Upgrade your plan to add more properties and unlock advanced features.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setIsLimitModalOpen(false);
                                    setIsPricingModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 bg-inda-teal text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg"
                            >
                                <FaRocket /> Upgrade Now
                            </button>
                            <button
                                onClick={() => setIsLimitModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PricingModal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
            />
        </DashboardLayout>
    );
}
