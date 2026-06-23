import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  trackChannelClick,
  getPublicProfileBySlug,
  getPublicListingsBySlug,
  getPublicListingBySlug,
  submitInquiry,
  PublicListing,
  PublicAgentProfile,
} from '@/api/channels';
import { Container, Navbar, Footer } from '@/components';
import {
  FaSpinner,
  FaHome,
  FaBuilding,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCheck,
  FaArrowLeft,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { useToast } from '@/components/ToastProvider';

export default function AgentPublicProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { slug, c: channel, listing: listingIdParam } = router.query;

  const [profile, setProfile] = useState<PublicAgentProfile | null>(null);
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [detailedListing, setDetailedListing] = useState<PublicListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<PublicListing | null>(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchProfileAndListings = async () => {
      if (!router.isReady || !slug || typeof slug !== 'string') {
        return;
      }

      try {
        const [profileData, listingsData] = await Promise.all([
          getPublicProfileBySlug(slug),
          getPublicListingsBySlug(slug),
        ]);

        setProfile(profileData);
        setListings(listingsData);

        if (channel && typeof channel === 'string') {
          sessionStorage.setItem('inda_channel_source', channel);
          sessionStorage.setItem('inda_agent_id', profileData.id);
          trackChannelClick(profileData.id, channel).catch((err) => {
            console.error('Failed to track channel click:', err);
          });
        }
      } catch (error) {
        console.error('Failed to fetch public profile:', error);
        toast.showToast('Failed to load public agent page', 3000, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndListings();
  }, [router.isReady, slug, channel]);

  useEffect(() => {
    const fetchDetailedListing = async () => {
      if (!router.isReady || !slug || typeof slug !== 'string' || !listingIdParam || typeof listingIdParam !== 'string') {
        setDetailedListing(null);
        return;
      }

      setDetailLoading(true);
      try {
        const data = await getPublicListingBySlug(slug, listingIdParam);
        setDetailedListing(data);
        if (data) {
          setSelectedListing(data);
        }
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        toast.showToast('Failed to load property details', 3000, 'error');
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetailedListing();
  }, [router.isReady, slug, listingIdParam]);

  const formatPrice = (price?: number | null) => {
    if (!price) return 'Price on request';
    return `₦${price.toLocaleString()}`;
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

  const handleListingClick = (listingId: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          listing: listingId,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleBackToProfile = () => {
    const { listing, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true },
    );
    setDetailedListing(null);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      return;
    }

    if (!formData.name || !formData.email) {
      toast.showToast('Please fill in your name and email', 2000, 'error');
      return;
    }

    setInquirySubmitting(true);

    try {
      const storedChannel = sessionStorage.getItem('inda_channel_source') || (channel as string) || 'direct';

      const response = await submitInquiry({
        agentUserId: profile.id,
        channel: storedChannel,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        listingId: selectedListing?.id || detailedListing?.id,
      });

      setInquirySubmitted(true);
      toast.showToast('Inquiry sent successfully!', 3000, 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      if (response.agentPhone) {
        const phoneNumber = response.agentPhone.replace(/\D/g, '');
        const listingInstance = detailedListing || selectedListing;
        const propertyInfo = listingInstance?.title ? `\n\nProperty: ${listingInstance.title}` : '';
        const whatsappMessage = encodeURIComponent(
          `Hi ${response.agentName}, I'm ${formData.name}.\n\nI just submitted an inquiry on Inda about your properties.${propertyInfo}\n\nPlease get back to me at your earliest convenience.\n\nEmail: ${formData.email}${formData.phone ? `\nPhone: ${formData.phone}` : ''}${formData.message ? `\n\nMessage: ${formData.message}` : ''}`,
        );
        window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
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

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
        {detailLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-3xl text-[#4EA8A1] mb-4" />
            <p className="text-gray-500">Loading property details...</p>
          </div>
        ) : detailedListing ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleBackToProfile}
              className="mb-8 flex items-center gap-2 font-semibold text-[#4EA8A1] hover:underline group"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              Back to Listings
            </button>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 shadow-md">
                  {detailedListing.images && detailedListing.images.length > 0 ? (
                    <img
                      src={detailedListing.images[0]}
                      alt={detailedListing.title || 'Property'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FaHome className="text-6xl text-gray-200" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {detailedListing.images?.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                      <img src={img} alt={`${detailedListing.title || 'Property'} ${idx + 2}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 inline-block rounded-full bg-[#4EA8A1]/10 px-4 py-1.5 text-sm font-bold text-[#4EA8A1]">
                  {detailedListing.propertyTypeStd || 'Property'}
                </div>
                <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                  {detailedListing.title || 'Untitled Property'}
                </h1>
                <p className="mb-6 flex items-center gap-2 text-gray-500">
                  <FaMapMarkerAlt className="text-[#4EA8A1]" />
                  {[detailedListing.microlocationStd, detailedListing.lga, detailedListing.state].filter(Boolean).join(', ')}
                </p>

                <div className="mb-8 text-4xl font-black text-[#4EA8A1]">
                  {formatPrice(detailedListing.priceNGN)}
                </div>

                <div className="mb-8 grid grid-cols-3 gap-6 border-y border-gray-100 py-8">
                  <div className="text-center">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Bedrooms</div>
                    <div className="flex items-center justify-center gap-2 text-lg font-bold text-gray-900">
                      <FaBed className="text-[#4EA8A1]" /> {detailedListing.bedrooms || '-'}
                    </div>
                  </div>
                  <div className="border-x border-gray-100 text-center">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Bathrooms</div>
                    <div className="flex items-center justify-center gap-2 text-lg font-bold text-gray-900">
                      <FaBath className="text-[#4EA8A1]" /> {detailedListing.bathrooms || '-'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Area</div>
                    <div className="flex items-center justify-center gap-2 text-lg font-bold text-gray-900">
                      <FaRulerCombined className="text-[#4EA8A1]" /> {detailedListing.sizeSqm ? `${detailedListing.sizeSqm} sqm` : '-'}
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm mb-10 max-w-none text-gray-600">
                  <h3 className="mb-2 font-bold text-gray-900">Description</h3>
                  <p className="whitespace-pre-line">
                    {detailedListing.description || 'No description provided for this property.'}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={() => openInquiryForm(detailedListing)}
                    className="flex-1 rounded-2xl bg-[#4EA8A1] py-4 text-lg font-bold text-white shadow-lg shadow-[#4EA8A1]/20 transition-all hover:bg-[#3d8a84]"
                  >
                    Inquire Now
                  </button>
                  {detailedListing.listingUrl && (
                    <a
                      href={detailedListing.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      View Original <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center gap-2 font-semibold text-[#4EA8A1] hover:underline group"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              Back
            </button>

            <section className="mb-12 rounded-[2rem] border border-[#DCEAE8] bg-gradient-to-br from-[#F7FCFB] to-white px-6 py-10 shadow-sm sm:px-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#4EA8A1]/10">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />
                    ) : (
                      <FaBuilding className="text-3xl text-[#4EA8A1]" />
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#4EA8A1]">
                      Public Agent Page
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                      {profile?.displayName || 'Agent Profile'}
                    </h1>
                    {profile?.companyName && (
                      <p className="mt-2 text-lg font-medium text-gray-600">{profile.companyName}</p>
                    )}
                    {profile?.title && (
                      <p className="mt-4 max-w-2xl text-base text-gray-700">{profile.title}</p>
                    )}
                    {profile?.bio && (
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">{profile.bio}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[280px]">
                  <div className="rounded-2xl border border-[#DCEAE8] bg-white px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active Listings</p>
                    <p className="mt-2 text-3xl font-bold text-[#4EA8A1]">{profile?.listingCount || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-[#DCEAE8] bg-white px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</p>
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      {profile?.phoneNumber || 'Inquiry form available'}
                    </p>
                  </div>
                  <button
                    onClick={() => openInquiryForm()}
                    className="sm:col-span-2 rounded-2xl bg-[#4EA8A1] px-6 py-4 text-base font-semibold text-white transition-all hover:bg-[#3d8a84]"
                  >
                    Contact Agent
                  </button>
                </div>
              </div>
            </section>

            {listings.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                <FaHome className="mx-auto mb-4 text-4xl text-gray-300" />
                <h2 className="mb-2 text-xl font-bold text-gray-700">No Listings Available</h2>
                <p className="mx-auto max-w-md text-sm text-gray-500">
                  This agent has not published any active listings yet. Check back later or contact them directly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => handleListingClick(listing.id)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title || 'Property'}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FaHome className="text-4xl text-gray-300" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 backdrop-blur-sm">
                        {listing.propertyTypeStd || 'Property'}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">
                        {listing.title || 'Untitled Property'}
                      </h3>

                      <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                        <FaMapMarkerAlt className="text-[#4EA8A1]" />
                        <span className="truncate">
                          {[listing.microlocationStd, listing.lga, listing.state].filter(Boolean).join(', ') || 'Location not specified'}
                        </span>
                      </div>

                      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                        {listing.bedrooms ? (
                          <span className="flex items-center gap-1">
                            <FaBed /> {listing.bedrooms}
                          </span>
                        ) : null}
                        {listing.bathrooms ? (
                          <span className="flex items-center gap-1">
                            <FaBath /> {listing.bathrooms}
                          </span>
                        ) : null}
                        {listing.sizeSqm ? (
                          <span className="flex items-center gap-1">
                            <FaRulerCombined /> {listing.sizeSqm}sqm
                          </span>
                        ) : null}
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
      </main>

      {showInquiryForm && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowInquiryForm(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:text-gray-600"
            >
              ✕
            </button>

            {inquirySubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <FaCheck className="text-3xl text-green-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Inquiry Sent!</h3>
                <p className="text-gray-500">The agent will get back to you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="mb-1 text-2xl font-bold text-gray-900">Contact {profile.displayName}</h3>
                <p className="mb-8 text-sm text-gray-500">
                  {selectedListing?.title ? (
                    <>
                      Inquiry about: <span className="font-semibold text-[#4EA8A1]">{selectedListing.title}</span>
                    </>
                  ) : (
                    'Fill in the form below to reach out.'
                  )}
                </p>

                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block px-1 text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-2xl border border-transparent bg-gray-50 py-3.5 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#4EA8A1]"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block px-1 text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-2xl border border-transparent bg-gray-50 py-3.5 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#4EA8A1]"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block px-1 text-xs font-bold uppercase tracking-widest text-gray-400">Phone (Optional)</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-transparent bg-gray-50 py-3.5 pl-12 pr-4 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#4EA8A1]"
                        placeholder="+234..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block px-1 text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full resize-none rounded-2xl border border-transparent bg-gray-50 px-4 py-3.5 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#4EA8A1]"
                      rows={3}
                      placeholder="I'm interested in this property..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#4EA8A1] py-4 text-lg font-bold text-white shadow-lg shadow-[#4EA8A1]/20 transition-all hover:bg-[#3d8a84] disabled:opacity-50"
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
