import { useState, useEffect } from 'react';
import {
  Mail, Megaphone, Camera, Video, Box, BarChart3, Sparkles, TrendingUp,
  ChevronRight, ChevronLeft, Instagram, Facebook, Youtube, Linkedin,
  ArrowLeft, Zap, Target, CheckCircle2, Layout, Globe, Hash, Palette,
  ImageIcon, AlertCircle
} from 'lucide-react';
import { MarketingService, MarketingCredits, MarketingStats } from '@/api/marketing';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EmailCampaignFlow } from '@/components/marketing/EmailCampaignFlow';
import { DigitalAdsFlow } from '@/components/marketing/DigitalAdsFlow';
import { ServiceBookingFlow } from '@/components/marketing/ServiceBookingFlow';
import { AnalyticsView } from '@/components/marketing/AnalyticsView';
import { useAuth } from '@/contexts/AuthContext';
import { ProListingsService } from '@/api/pro-listings';
import { DIGITAL_ADS_MINIMUM, SERVICE_PRICING } from '@/components/marketing/pricing';

type Step = 'main' | 'create' | 'email' | 'ads' | 'photography' | 'videography' | '3d-tour' | 'analytics';
type Platform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin';
type InstagramType = 'feed' | 'reel' | 'story' | 'carousel';
type FacebookType = 'feed' | 'story' | 'reel';
type ContentCategory = 'property-listing' | 'market-update' | 'agent-branding' | 'educational';

interface Template {
  id: string;
  name: string;
  category: ContentCategory;
  aspectRatio: string;
  platforms: Platform[];
}

const TEMPLATES: Template[] = [
  { id: 't1', name: 'Just Listed - Modern', category: 'property-listing', aspectRatio: '1:1', platforms: ['instagram', 'facebook'] },
  { id: 't2', name: 'Luxury Showcase', category: 'property-listing', aspectRatio: '4:5', platforms: ['instagram', 'facebook', 'linkedin'] },
  { id: 't3', name: 'Story - Property Tour', category: 'property-listing', aspectRatio: '9:16', platforms: ['instagram', 'facebook', 'tiktok'] },
  { id: 't4', name: 'Market Insights', category: 'market-update', aspectRatio: '16:9', platforms: ['linkedin', 'facebook', 'twitter'] },
  { id: 't5', name: 'Meet the Agent', category: 'agent-branding', aspectRatio: '1:1', platforms: ['instagram', 'facebook', 'linkedin'] },
  { id: 't6', name: 'Buying Tips - Carousel', category: 'educational', aspectRatio: '1:1', platforms: ['instagram', 'linkedin'] },
];

const TEMPLATE_CATEGORIES: { id: ContentCategory; name: string; icon: any }[] = [
  { id: 'property-listing', name: 'Property Listings', icon: ImageIcon },
  { id: 'market-update', name: 'Market Updates', icon: TrendingUp },
  { id: 'agent-branding', name: 'Agent Branding', icon: Palette },
  { id: 'educational', name: 'Educational', icon: Layout },
];

const AI_CAPTIONS = [
  `🏡 New Listing Alert!\n\nStunning 4-bedroom penthouse in the heart of Ikoyi.\n\n✨ Features:\n• 4 beds, 5 baths\n• 320 sqm living space\n• Pool, Smart Home, Ocean View\n\n📍 Ikoyi, Lagos\n\nDM for viewing! 👋`,
  `✨ JUST LISTED ✨\n\nModern Duplex | Lekki, Lagos\n\n4 🛏️ | 4 🚿 | 280 sqm\n\nSmart home features, private garden & stunning finishes.\n\nBook your viewing today!`,
  `📍 Exclusive Listing — Victoria Island\n\nThis stunning property redefines luxury living. Premium finishes throughout, breathtaking views, and world-class amenities.\n\nContact us now to schedule a private tour.`,
];


export default function MarketingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('main');

  // Main view data
  const [credits, setCredits] = useState<MarketingCredits | null>(null);
  const [marketingStats, setMarketingStats] = useState<MarketingStats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Create wizard state
  const [createStep, setCreateStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [instagramType, setInstagramType] = useState<InstagramType | null>(null);
  const [facebookType, setFacebookType] = useState<FacebookType | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('18:00');
  const userId = user?.id || user?._id || (user as any)?.user?.id;

  // Load credits + stats on mount
  useEffect(() => {
    setDataLoading(true);
    Promise.allSettled([
      MarketingService.getCredits(),
      MarketingService.getStats(),
    ]).then(([creditsRes, statsRes]) => {
      if (creditsRes.status === 'fulfilled') setCredits(creditsRes.value);
      if (statsRes.status === 'fulfilled') setMarketingStats(statsRes.value);
    }).finally(() => setDataLoading(false));
  }, []);

  useEffect(() => {
    if (userId && step === 'create' && createStep === 2) {
      ProListingsService.getUserListings(userId).then(data => setListings(data || [])).catch(() => {});
    }
  }, [userId, step, createStep]);

  const togglePlatform = (p: Platform) =>
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const resetCreate = () => {
    setCreateStep(1);
    setSelectedPlatforms([]);
    setInstagramType(null);
    setFacebookType(null);
    setSelectedProperty(null);
    setSelectedTemplate(null);
    setCaption('');
    setHashtags('');
    setScheduleDate('');
    setScheduleTime('18:00');
  };

  const generateAICaption = () => {
    setCaption(AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)]);
    setHashtags('#LagosRealEstate #NigeriaProperty #LuxuryHomes #PropertyForSale #IndaHomes');
  };

  const [submitting, setSubmitting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const handlePublish = async () => {
    setSubmitting(true);
    try {
      const contentTypes: Record<string, string> = {};
      if (instagramType) contentTypes.instagram = instagramType;
      if (facebookType) contentTypes.facebook = facebookType;

      await MarketingService.createContent({
        platforms: selectedPlatforms,
        contentTypes,
        propertyId: selectedProperty?.id || selectedProperty?._id,
        templateId: selectedTemplate!.id,
        caption,
        hashtags,
        brandingOptions: { showWatermark: true, showContactInfo: true, showCompanyName: true },
        scheduleDate: scheduleDate || undefined,
        scheduleTime: scheduleDate ? scheduleTime : undefined,
      });
      setCreateSuccess(true);
    } catch {
      alert('Failed to publish content. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sub-flow renders
  const renderSubFlow = () => {
    if (step === 'email') return <EmailCampaignFlow onBack={() => setStep('main')} />;
    if (step === 'ads') return <DigitalAdsFlow onBack={() => setStep('main')} />;
    if (step === 'photography') return <ServiceBookingFlow serviceType="photography" onBack={() => setStep('main')} />;
    if (step === 'videography') return <ServiceBookingFlow serviceType="videography" onBack={() => setStep('main')} />;
    if (step === '3d-tour') return <ServiceBookingFlow serviceType="3d-tour" onBack={() => setStep('main')} />;
    if (step === 'analytics') return <AnalyticsView onBack={() => setStep('main')} />;
    return null;
  };

  const subFlow = renderSubFlow();
  if (subFlow) {
    return (
      <ProtectedRoute>
        <DashboardLayout>{subFlow}</DashboardLayout>
      </ProtectedRoute>
    );
  }

  // ===== CREATE WIZARD =====
  if (step === 'create' && createSuccess) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {scheduleDate ? 'Content Scheduled!' : 'Content Published!'}
            </h2>
            <p className="text-gray-500 mb-2">
              Your branded content has been {scheduleDate ? 'scheduled' : 'published'} to {selectedPlatforms.join(', ')}.
            </p>
            <button onClick={() => { resetCreate(); setCreateSuccess(false); setStep('main'); }}
              className="mt-6 bg-inda-teal text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700">
              Back to Marketing
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (step === 'create') {
    const filteredTemplates = TEMPLATES.filter(t =>
      t.platforms.some(p => selectedPlatforms.includes(p))
    );

    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { if (createStep === 1) { setStep('main'); resetCreate(); } else { setCreateStep(s => s - 1); } }}
                className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300">
                <ArrowLeft className="w-4 h-4" />
                {createStep === 1 ? 'Back to Marketing' : 'Previous Step'}
              </button>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={cn('h-2 w-12 rounded-full transition-all', s <= createStep ? 'bg-inda-teal' : 'bg-gray-200')} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-8">

              {/* Step 1: Platform Selection */}
              {createStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Platform(s)</h2>
                    <p className="text-gray-600">Select where you want to post your content</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Instagram */}
                    {([
                      { id: 'instagram' as Platform, label: 'Instagram', desc: 'Posts, Reels, Stories, Carousels', icon: <Instagram className="w-6 h-6 text-white" />, bg: 'bg-gradient-to-br from-purple-500 to-pink-500', subtypes: ['feed', 'reel', 'story', 'carousel'] as InstagramType[], stateKey: 'instagram' },
                      { id: 'facebook' as Platform, label: 'Facebook', desc: 'Posts, Stories, Reels', icon: <Facebook className="w-6 h-6 text-white" />, bg: 'bg-blue-600', subtypes: ['feed', 'story', 'reel'] as FacebookType[], stateKey: 'facebook' },
                    ]).map(platform => {
                      const selected = selectedPlatforms.includes(platform.id);
                      return (
                        <div key={platform.id} onClick={() => togglePlatform(platform.id)}
                          className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selected ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${platform.bg} rounded-xl flex items-center justify-center`}>{platform.icon}</div>
                            {selected && <CheckCircle2 className="w-6 h-6 text-inda-teal" />}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{platform.label}</h3>
                          <p className="text-sm text-gray-600 mb-3">{platform.desc}</p>
                          {selected && (
                            <div className="space-y-2 pt-3 border-t border-gray-200" onClick={e => e.stopPropagation()}>
                              <p className="text-xs font-medium text-gray-700 mb-2">Content Type:</p>
                              {platform.subtypes.map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name={`${platform.id}-type`}
                                    checked={platform.id === 'instagram' ? instagramType === type : facebookType === type}
                                    onChange={() => platform.id === 'instagram' ? setInstagramType(type as InstagramType) : setFacebookType(type as FacebookType)}
                                    className="w-4 h-4 accent-inda-teal" />
                                  <span className="text-sm capitalize text-gray-700">{type}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* TikTok */}
                    {(() => {
                      const selected = selectedPlatforms.includes('tiktok');
                      return (
                        <div onClick={() => togglePlatform('tiktok')}
                          className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selected ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-lg">TT</span></div>
                            {selected && <CheckCircle2 className="w-6 h-6 text-inda-teal" />}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">TikTok</h3>
                          <p className="text-sm text-gray-600">Short vertical videos</p>
                        </div>
                      );
                    })()}
                    {/* YouTube */}
                    {(() => {
                      const selected = selectedPlatforms.includes('youtube');
                      return (
                        <div onClick={() => togglePlatform('youtube')}
                          className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selected ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center"><Youtube className="w-6 h-6 text-white" /></div>
                            {selected && <CheckCircle2 className="w-6 h-6 text-inda-teal" />}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">YouTube</h3>
                          <p className="text-sm text-gray-600">Shorts & Full Videos</p>
                        </div>
                      );
                    })()}
                    {/* Twitter/X */}
                    {(() => {
                      const selected = selectedPlatforms.includes('twitter');
                      return (
                        <div onClick={() => togglePlatform('twitter')}
                          className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selected ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center"><Globe className="w-5 h-5 text-white" /></div>
                            {selected && <CheckCircle2 className="w-6 h-6 text-inda-teal" />}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">X (Twitter)</h3>
                          <p className="text-sm text-gray-600">Tweets & Threads</p>
                        </div>
                      );
                    })()}
                    {/* LinkedIn */}
                    {(() => {
                      const selected = selectedPlatforms.includes('linkedin');
                      return (
                        <div onClick={() => togglePlatform('linkedin')}
                          className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selected ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center"><Linkedin className="w-6 h-6 text-white" /></div>
                            {selected && <CheckCircle2 className="w-6 h-6 text-inda-teal" />}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">LinkedIn</h3>
                          <p className="text-sm text-gray-600">Professional posts</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button onClick={() => setCreateStep(2)} disabled={selectedPlatforms.length === 0}
                      className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                      Continue to Property <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Property Selection */}
              {createStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Property</h2>
                    <p className="text-gray-600">Choose a listing to feature in your content</p>
                  </div>
                  {listings.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No listings found. Add a property first.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                      {listings.map((property: any) => {
                        const isSelected = selectedProperty?.id === property.id || selectedProperty?._id === property._id;
                        return (
                          <div key={property.id || property._id} onClick={() => setSelectedProperty(property)}
                            className={cn('border-2 rounded-xl overflow-hidden cursor-pointer transition-all', isSelected ? 'border-inda-teal ring-2 ring-inda-teal/20' : 'border-gray-200 hover:border-gray-300')}>
                            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                              {property.images?.[0]
                                ? <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
                              }
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle2 className="w-6 h-6 text-inda-teal bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1">{property.title || property.propertyName}</h3>
                              <p className="text-sm text-gray-600 mb-2">{property.location || property.state}</p>
                              {property.price && <p className="text-lg font-bold text-inda-teal mb-2">₦{Number(property.price).toLocaleString()}</p>}
                              <div className="flex gap-3 text-xs text-gray-600">
                                {property.bedrooms && <span>{property.bedrooms} beds</span>}
                                {property.bathrooms && <><span>•</span><span>{property.bathrooms} baths</span></>}
                                {property.size && <><span>•</span><span>{property.size} sqm</span></>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button onClick={() => setCreateStep(1)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => setCreateStep(3)} disabled={!selectedProperty}
                      className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                      Continue to Templates <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Template Selection */}
              {createStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Template</h2>
                    <p className="text-gray-600">Pick a design that matches your style</p>
                  </div>
                  {TEMPLATE_CATEGORIES.map(category => {
                    const CategoryIcon = category.icon;
                    const categoryTemplates = filteredTemplates.filter(t => t.category === category.id);
                    if (categoryTemplates.length === 0) return null;
                    return (
                      <div key={category.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <CategoryIcon className="w-5 h-5 text-inda-teal" />
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          {categoryTemplates.map(template => {
                            const isSelected = selectedTemplate?.id === template.id;
                            return (
                              <div key={template.id} onClick={() => setSelectedTemplate(template)}
                                className={cn('border-2 rounded-xl overflow-hidden cursor-pointer transition-all', isSelected ? 'border-inda-teal ring-2 ring-inda-teal/20' : 'border-gray-200 hover:border-gray-300')}>
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
                                  <Layout className="w-12 h-12 text-gray-400" />
                                  {isSelected && (
                                    <div className="absolute top-2 right-2">
                                      <CheckCircle2 className="w-6 h-6 text-inda-teal bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{template.aspectRatio}</span>
                                    <span className="text-xs text-gray-500">{template.platforms.length} platforms</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button onClick={() => setCreateStep(2)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => setCreateStep(4)} disabled={!selectedTemplate}
                      className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                      Continue to Customize <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Customization */}
              {createStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Content</h2>
                    <p className="text-gray-600">Add your branding and write your caption</p>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Per-platform previews */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Preview with Your Branding</h3>
                      {selectedPlatforms.map(platform => {
                        const isVertical = platform === 'tiktok' || platform === 'youtube' || instagramType === 'story' || instagramType === 'reel';
                        const aspectClass = isVertical ? 'aspect-[9/16]' : selectedTemplate?.aspectRatio === '16:9' ? 'aspect-video' : selectedTemplate?.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square';
                        return (
                          <div key={platform} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              {platform === 'instagram' && <Instagram className="w-5 h-5 text-purple-600" />}
                              {platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                              {platform === 'tiktok' && <span className="text-sm font-bold">TT</span>}
                              {platform === 'youtube' && <Youtube className="w-5 h-5 text-red-600" />}
                              {platform === 'twitter' && <Globe className="w-5 h-5 text-gray-900" />}
                              {platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-700" />}
                              <span className="font-medium text-gray-900 capitalize">{platform}</span>
                            </div>
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                              <div className={cn('relative bg-gradient-to-br from-blue-100 to-purple-100', aspectClass)}>
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                  <div className="text-center">
                                    <p className="text-sm mb-1">{selectedProperty?.title || selectedProperty?.propertyName}</p>
                                    <p className="text-xs">{selectedTemplate?.name}</p>
                                  </div>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                                  <p className="text-xs font-bold text-gray-900">YOUR LOGO</p>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                                  <p className="text-xs text-white font-medium">{user?.name || 'Agent Name'}</p>
                                  <p className="text-xs text-white/80">{user?.phone || '+234 800 000 0000'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Caption & Settings */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-gray-900">Caption</label>
                          <button onClick={generateAICaption}
                            className="flex items-center gap-1 text-xs text-inda-teal border border-inda-teal/40 px-3 py-1.5 rounded-lg hover:bg-inda-teal/5">
                            <Sparkles className="w-3.5 h-3.5" /> AI Generate
                          </button>
                        </div>
                        <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={8}
                          placeholder="Write your caption or use AI to generate one..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-inda-teal focus:ring-1 focus:ring-inda-teal/30 resize-none text-sm" />
                        <p className="text-xs text-gray-500 mt-1">{caption.length} characters</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <label className="text-sm font-semibold text-gray-900">Hashtags</label>
                        </div>
                        <input value={hashtags} onChange={e => setHashtags(e.target.value)}
                          placeholder="#LagosRealEstate #PropertyForSale..."
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:border-inda-teal focus:ring-1 focus:ring-inda-teal/30 text-sm" />
                        <p className="text-xs text-gray-500 mt-1">{hashtags.split(' ').filter(t => t.startsWith('#')).length} hashtags</p>
                      </div>
                      <div className="bg-inda-teal/5 rounded-lg p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900">Branding Options</h4>
                        {[
                          { label: 'Show watermark' },
                          { label: 'Show contact info' },
                          { label: 'Show company name' },
                        ].map(opt => (
                          <label key={opt.label} className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-gray-700">{opt.label}</span>
                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-inda-teal rounded" />
                          </label>
                        ))}
                      </div>
                      {selectedProperty && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-green-900 mb-1">Property Details Auto-filled</p>
                              <p className="text-xs text-green-700">Price, location, beds/baths, and features automatically added to your design</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button onClick={() => setCreateStep(3)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => setCreateStep(5)} disabled={!caption}
                      className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                      Continue to Schedule <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Schedule & Publish */}
              {createStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule & Publish</h2>
                    <p className="text-gray-600">Choose when to post your content</p>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Scheduling */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-inda-teal/10 to-teal-50 border border-inda-teal/30 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-inda-teal" />
                          <h3 className="font-semibold text-gray-900">Best Time to Post</h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">Based on your audience engagement data, we recommend posting at:</p>
                        <div className="bg-white rounded-lg p-3">
                          <p className="font-semibold text-gray-900">📊 Peak Engagement: 6:00 PM – 8:00 PM</p>
                          <p className="text-xs text-gray-600 mt-1">Weekdays get 35% more engagement</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Schedule Date</label>
                          <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Schedule Time</label>
                          <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                          <p className="text-xs text-gray-500 mt-1">Time zone: WAT (Lagos)</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Post Summary</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Publishing to:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedPlatforms.map(p => (
                                <span key={p} className="px-3 py-1 bg-inda-teal/10 text-inda-teal text-sm rounded-full capitalize">{p}</span>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-xs text-gray-600 mb-1">Property:</p>
                            <p className="font-medium text-gray-900">{selectedProperty?.title || selectedProperty?.propertyName}</p>
                            <p className="text-sm text-gray-600">{selectedProperty?.location || selectedProperty?.state}</p>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-xs text-gray-600 mb-1">Template:</p>
                            <p className="font-medium text-gray-900">{selectedTemplate?.name}</p>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-xs text-gray-600 mb-1">Caption:</p>
                            <p className="text-sm text-gray-700 line-clamp-3">{caption || 'No caption'}</p>
                          </div>
                          {scheduleDate && (
                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-xs text-gray-600 mb-1">Scheduled for:</p>
                              <p className="font-medium text-gray-900">
                                {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-green-900 mb-1">Ready to Publish!</p>
                            <p className="text-xs text-green-700">
                              Your branded content will be posted to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button onClick={() => setCreateStep(4)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex gap-3">
                      <button onClick={() => { resetCreate(); setStep('main'); }}
                        className="border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:border-gray-300">
                        Save Draft
                      </button>
                      <button onClick={handlePublish} disabled={submitting}
                        className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                        <Zap className="w-4 h-4" />
                        {submitting ? 'Publishing...' : scheduleDate ? 'Schedule Post' : 'Publish Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // ===== MAIN VIEW =====
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-teal-700 bg-clip-text text-transparent">Marketing Center</h1>
            <p className="text-gray-600 mt-1">Create branded content, run campaigns, and grow your business</p>
          </div>

          {/* Credits wallet */}
          <div className="bg-gradient-to-br from-inda-teal to-teal-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Marketing Credits</h2>
            </div>
            <p className="text-white/90 mb-4">Use credits for photography, videography, ads, and more. Credits are allocated monthly by Inda.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Available Credits', value: credits?.available },
                { label: 'Used This Month', value: credits?.used },
                { label: 'Monthly Allocation', value: credits?.monthlyAllocation },
              ].map(item => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-white/80 text-sm mb-1">{item.label}</p>
                  {dataLoading
                    ? <div className="h-10 w-16 bg-white/20 rounded animate-pulse" />
                    : <p className="text-4xl font-bold">{item.value ?? '—'}</p>
                  }
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/80 mb-2">Service Pricing:</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-3 py-1 bg-white/10 rounded-full">Photography: from {SERVICE_PRICING.photography.basic.credits} credits</span>
                <span className="px-3 py-1 bg-white/10 rounded-full">Videography: from {SERVICE_PRICING.videography.walkthrough.credits} credits</span>
                <span className="px-3 py-1 bg-white/10 rounded-full">3D Tour: {SERVICE_PRICING['3d-tour'].standard.credits} credits</span>
                <span className="px-3 py-1 bg-white/10 rounded-full">Ads: from {DIGITAL_ADS_MINIMUM.credits} credits</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, label: 'Posts This Month', value: marketingStats?.postsThisMonth, bg: 'bg-purple-100', color: 'text-purple-600' },
              { icon: TrendingUp, label: 'Total Reach', value: marketingStats?.totalReach?.toLocaleString(), bg: 'bg-inda-teal/10', color: 'text-inda-teal' },
              {
                icon: Target,
                label: 'Engagement Rate',
                value:
                  marketingStats && typeof marketingStats.engagementRate === 'number'
                    ? `${marketingStats.engagementRate}%`
                    : '—',
                bg: 'bg-pink-100',
                color: 'text-pink-600',
              },
              { icon: CheckCircle2, label: 'Leads Generated', value: marketingStats?.leadsGenerated, bg: 'bg-green-100', color: 'text-green-600' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      {dataLoading
                        ? <div className="h-7 w-12 bg-gray-100 rounded animate-pulse mb-1" />
                        : <p className="text-2xl font-bold text-gray-900">{s.value ?? '—'}</p>
                      }
                      <p className="text-xs text-gray-600">{s.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main CTA */}
          <div className="bg-gradient-to-br from-inda-teal to-teal-700 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Create Branded Content</h2>
                </div>
                <p className="text-white/90 mb-4">Generate professional social media posts, reels, stories with your branding in minutes</p>
                <button onClick={() => { resetCreate(); setStep('create'); }}
                  className="flex items-center gap-2 bg-white text-inda-teal hover:bg-gray-100 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
                  <Layout className="w-5 h-5" /> Start Creating
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-3 gap-3">
                  {[Instagram, Facebook, Youtube].map((Icon, i) => (
                    <div key={i} className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep('email')}>
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-inda-teal" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Campaigns</h3>
              <p className="text-sm text-gray-600 mb-4">Send beautiful property emails to your contact list with tracking</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Free</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Templates</span>
              </div>
              <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">Create Campaign</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep('ads')}>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Megaphone className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Ads</h3>
              <p className="text-sm text-gray-600 mb-4">Run targeted ads on Google, Facebook & Instagram</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">From ₦25k</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">ROI Tracking</span>
              </div>
              <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">Run Ads</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep('photography')}>
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-inda-teal" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Photography</h3>
              <p className="text-sm text-gray-600 mb-4">HDR property photos with same-day editing</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">₦10k</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Pro Quality</span>
              </div>
              <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">Book Session</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep('videography')}>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Videography</h3>
              <p className="text-sm text-gray-600 mb-4">Cinematic 4K video tours with aerial footage</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">₦20k</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">4K Quality</span>
              </div>
              <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">Book Session</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep('3d-tour')}>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3D Virtual Tours</h3>
              <p className="text-sm text-gray-600 mb-4">Immersive 360° walkthroughs for your listings</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">₦15k</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Interactive</span>
              </div>
              <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">Request Service</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep('analytics')}>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Reports</h3>
              <p className="text-sm text-gray-600 mb-4">Track engagement, reach, and lead generation</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Free</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Real-time</span>
              </div>
              <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">View Analytics</button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
