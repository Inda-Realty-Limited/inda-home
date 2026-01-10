import { useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { trackChannelClick, getPublicListings, getPublicListingById, submitInquiry, PublicListing } from '@/api/channels';
import { Container, Navbar, Footer } from '@/components';
import { FaSpinner, FaHome, FaBuilding, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEnvelope, FaPhone, FaUser, FaCheck, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { useToast } from '@/components/ToastProvider';

export default function PublicPortfolio() {
    const router = useRouter();
    const toast = useToast();
    const { userId, c: channel, listing: listingIdParam } = router.query;

    const [listings, setListings] = useState<PublicListing[]>([]);
    const [detailedListing, setDetailedListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [selectedListing, setSelectedListing] = useState<PublicListing | null>(null);
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySubmitted, setInquirySubmitted] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    useEffect(() => {
        // Track click if a channel parameter is present
        if (router.isReady && userId && channel && typeof userId === 'string' && typeof channel === 'string') {
            // Store channel in sessionStorage for lead attribution
            sessionStorage.setItem('inda_channel_source', (channel as string));
            sessionStorage.setItem('inda_agent_id', (userId as string));

            trackChannelClick(userId, channel).catch((err) => {
                console.error('Failed to track channel click:', err);
            });
        }
    }, [router.isReady, userId, channel]);

    // Fetch listings for the grid
    useEffect(() => {
        const fetchListings = async () => {
            if (!router.isReady || !userId || typeof userId !== 'string') return;

            try {
                const data = await getPublicListings(userId);
                setListings(data);
            } catch (error) {
                console.error('Failed to fetch listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [router.isReady, userId]);

    // Fetch single listing if listingId is in URL
    useEffect(() => {
        const fetchDetailedListing = async () => {
            if (!router.isReady || !listingIdParam || typeof listingIdParam !== 'string') {
                setDetailedListing(null);
                return;
            }

            setDetailLoading(true);
            try {
                const data = await getPublicListingById(listingIdParam);
                setDetailedListing(data);
                // Also set this as the selected listing for the inquiry form context
                if (data) setSelectedListing(data as any);
            } catch (error) {
                console.error('Failed to fetch detailed listing:', error);
                toast.showToast('Failed to load property details', 3000, 'error');
            } finally {
                setDetailLoading(false);
            }
        };

        fetchDetailedListing();
    }, [router.isReady, listingIdParam]);

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.showToast('Please fill in your name and email', 2000, 'error');
            return;
        }

        setInquirySubmitting(true);

        try {
            const storedChannel = sessionStorage.getItem('inda_channel_source') || (channel as string) || 'direct';
            const agentId = sessionStorage.getItem('inda_agent_id') || (userId as string);

            const response = await submitInquiry({
                agentUserId: agentId,
                channel: storedChannel,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                listingId: (selectedListing?._id || detailedListing?._id),
            });

            setInquirySubmitted(true);
            toast.showToast('Inquiry sent successfully!', 3000, 'success');

            // Reset form
            setFormData({ name: '', email: '', phone: '', message: '' });

            // Open WhatsApp if agent has phone number
            if (response.agentPhone) {
                const phoneNumber = response.agentPhone.replace(/\D/g, ''); // Remove non-digits
                const listingInstance = detailedListing || selectedListing;
                const propertyInfo = listingInstance ? `\n\nProperty: ${listingInstance.title}` : '';
                const whatsappMessage = encodeURIComponent(
                    `Hi ${response.agentName}, I'm ${formData.name}.\n\nI just submitted an inquiry on Inda about your properties.${propertyInfo}\n\nPlease get back to me at your earliest convenience.\n\nEmail: ${formData.email}${formData.phone ? `\nPhone: ${formData.phone}` : ''}${formData.message ? `\n\nMessage: ${formData.message}` : ''}`
                );
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

                // Open WhatsApp in new tab
                window.open(whatsappUrl, '_blank');
            }

            setTimeout(() => {
                setShowInquiryForm(false);
                setInquirySubmitted(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
            toast.showToast('Failed to send inquiry. Please try again.', 3000, 'error');
        } finally {
            setInquirySubmitting(false);
        }
    };

    const openInquiryForm = (listing?: PublicListing) => {
        if (listing) {
            setSelectedListing(listing);
        } else if (detailedListing) {
            setSelectedListing(detailedListing);
        } else {
            setSelectedListing(null);
        }
        setShowInquiryForm(true);
    };

    const handleListingClick = (lid: string) => {
        // Update URL to show specific listing
        const currentQuery = { ...router.query, listing: lid };
        router.push({
            pathname: router.pathname,
            query: currentQuery,
        }, undefined, { shallow: true });
    };

    const handleBackToPortfolio = () => {
        const { listing, ...restQuery } = router.query;
        router.push({
            pathname: router.pathname,
            query: restQuery,
        }, undefined, { shallow: true });
        setDetailedListing(null);
    };

    const formatPrice = (price?: number) => {
        if (!price) return 'Price on request';
        return `₦${price.toLocaleString()}`;
    };

    // While loading
    if (!router.isReady || loading) {
        return (
            <Container noPadding className="min-h-screen flex items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-[#4EA8A1]" />
            </Container>
        );
    }

    return (
        <Container noPadding className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
                {detailLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-3xl text-[#4EA8A1] mb-4" />
                        <p className="text-gray-500">Loading property details...</p>
                    </div>
                ) : detailedListing ? (
                    /* Dedicated Property View */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleBackToPortfolio}
                            className="flex items-center gap-2 text-[#4EA8A1] font-semibold mb-8 hover:underline group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Portfolio
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Images Section */}
                            <div className="space-y-4">
                                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-md">
                                    {detailedListing.images && detailedListing.images.length > 0 ? (
                                        <img
                                            src={detailedListing.images[0]}
                                            alt={detailedListing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaHome className="text-6xl text-gray-200" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {detailedListing.images?.slice(1, 5).map((img: string, idx: number) => (
                                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                                            <img src={img} alt={`${detailedListing.title} ${idx + 2}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div>
                                <div className="inline-block bg-[#4EA8A1]/10 text-[#4EA8A1] px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                                    {detailedListing.propertyTypeStd || 'Property'}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {detailedListing.title}
                                </h1>
                                <p className="flex items-center gap-2 text-gray-500 mb-6">
                                    <FaMapMarkerAlt className="text-[#4EA8A1]" />
                                    {[detailedListing.microlocationStd, detailedListing.lga, detailedListing.state].filter(Boolean).join(', ')}
                                </p>

                                <div className="text-4xl font-black text-[#4EA8A1] mb-8">
                                    {formatPrice(detailedListing.priceNGN)}
                                </div>

                                <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-100 mb-8">
                                    <div className="text-center">
                                        <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Bedrooms</div>
                                        <div className="flex items-center justify-center gap-2 text-gray-900 font-bold text-lg">
                                            <FaBed className="text-[#4EA8A1]" /> {detailedListing.bedrooms || '-'}
                                        </div>
                                    </div>
                                    <div className="text-center border-x border-gray-100">
                                        <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Bathrooms</div>
                                        <div className="flex items-center justify-center gap-2 text-gray-900 font-bold text-lg">
                                            <FaBath className="text-[#4EA8A1]" /> {detailedListing.bathrooms || '-'}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Area</div>
                                        <div className="flex items-center justify-center gap-2 text-gray-900 font-bold text-lg">
                                            <FaRulerCombined className="text-[#4EA8A1]" /> {detailedListing.sizeSqm ? `${detailedListing.sizeSqm} sqm` : '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-sm text-gray-600 mb-10 max-w-none">
                                    <h3 className="text-gray-900 font-bold mb-2">Description</h3>
                                    <p className="whitespace-pre-line">
                                        {detailedListing.description || "No description provided for this property."}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => openInquiryForm(detailedListing)}
                                        className="flex-1 bg-[#4EA8A1] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#4EA8A1]/20 hover:bg-[#3d8a84] transition-all"
                                    >
                                        Inquire Now
                                    </button>
                                    {detailedListing.listingUrl && (
                                        <a
                                            href={detailedListing.listingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                                        >
                                            View Original <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Main Portfolio View */
                    <>
                        <div className="mb-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-[#4EA8A1]/10 flex items-center justify-center mx-auto mb-6">
                                <FaBuilding className="text-3xl text-[#4EA8A1]" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Property Portfolio
                            </h1>
                            <p className="text-gray-500 max-w-lg mx-auto">
                                Explore available properties from this agent/developer. Contact them directly for inquiries.
                            </p>
                            <button
                                onClick={() => openInquiryForm()}
                                className="mt-6 bg-[#4EA8A1] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3d8a84] transition-all"
                            >
                                Contact Agent/Developer
                            </button>
                        </div>

                        {/* Listings Grid */}
                        {listings.length === 0 ? (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                                <FaHome className="text-4xl text-gray-300 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-gray-700 mb-2">No Listings Available</h2>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">
                                    This agent hasn't listed any properties yet. Check back later or contact them directly.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <div
                                        key={listing._id}
                                        onClick={() => handleListingClick(listing._id)}
                                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 bg-gray-100">
                                            {listing.images && listing.images.length > 0 ? (
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.title || 'Property'}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FaHome className="text-4xl text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                                                {listing.propertyTypeStd || 'Property'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                                {listing.title || 'Untitled Property'}
                                            </h3>

                                            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                                <FaMapMarkerAlt className="text-[#4EA8A1]" />
                                                <span className="truncate">
                                                    {[listing.microlocationStd, listing.lga, listing.state].filter(Boolean).join(', ') || 'Location not specified'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                                                {listing.bedrooms && (
                                                    <span className="flex items-center gap-1">
                                                        <FaBed /> {listing.bedrooms}
                                                    </span>
                                                )}
                                                {listing.bathrooms && (
                                                    <span className="flex items-center gap-1">
                                                        <FaBath /> {listing.bathrooms}
                                                    </span>
                                                )}
                                                {listing.sizeSqm && (
                                                    <span className="flex items-center gap-1">
                                                        <FaRulerCombined /> {listing.sizeSqm}sqm
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-[#4EA8A1]">
                                                    {formatPrice(listing.priceNGN)}
                                                </span>
                                                <span className="text-sm font-semibold text-[#4EA8A1] group-hover:underline">
                                                    View Details
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Channel Attribution Notice */}
                {channel && (
                    <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-50 pt-8">
                        Tracking Source: <span className="font-semibold capitalize text-gray-500">{channel}</span>
                    </div>
                )}
            </main>

            {/* Inquiry Form Modal */}
            {showInquiryForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] max-w-md w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowInquiryForm(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>

                        {inquirySubmitted ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaCheck className="text-3xl text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
                                <p className="text-gray-500">The agent/developer will get back to you soon.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Contact Agent/Developer</h3>
                                <p className="text-gray-500 text-sm mb-8">
                                    {detailedListing ? (
                                        <>Inquiry about: <span className="text-[#4EA8A1] font-semibold">{detailedListing.title}</span></>
                                    ) : selectedListing ? (
                                        <>Inquiry about: <span className="text-[#4EA8A1] font-semibold">{selectedListing.title}</span></>
                                    ) : (
                                        'Fill in the form below to reach out.'
                                    )}
                                </p>

                                <form onSubmit={handleInquirySubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4EA8A1] focus:border-transparent transition-all outline-none"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4EA8A1] focus:border-transparent transition-all outline-none"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Phone (Optional)</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4EA8A1] focus:border-transparent transition-all outline-none"
                                                placeholder="+234..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Message</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4EA8A1] focus:border-transparent transition-all outline-none resize-none"
                                            rows={3}
                                            placeholder="I'm interested in this property..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={inquirySubmitting}
                                        className="w-full bg-[#4EA8A1] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#4EA8A1]/20 hover:bg-[#3d8a84] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                                    >
                                        {inquirySubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Sending...
                                            </>
                                        ) : (
                                            'Send Inquiry'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </Container>
    );
}
