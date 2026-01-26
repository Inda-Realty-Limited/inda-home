import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, Bookmark, Share2, ChevronDown, ChevronUp, MapPin, Bed, Bath, Car, Home, Eye, Users, AlertTriangle, CheckCircle2, Link2, Star, TrendingUp, Shield, Building2, MessageCircle, BadgeCheck, FileText, Sparkles } from "lucide-react";
import { Property, QASection } from "../property-details/data/propertyData";
import { qaData } from "../property-details/data/propertyData";
import { scannedQAData } from "../property-details/data/scannedQAData";
import { FinancialPerformanceSection } from "./sections/FinancialPerformanceSection";
import { RiskAssessmentSection } from "./sections/RiskAssessmentSection";
import { ExitLiquiditySection } from "./sections/ExitLiquiditySection";
import { DeveloperCredibilitySection } from "./sections/DeveloperCredibilitySection";
import { PortfolioFitSection } from "./sections/PortfolioFitSection";
import { PriceValueSection } from "./sections/PriceValueSection";
import { MortgageInsuranceSection } from "./sections/MortgageInsuranceSection";
import { OffPlanProtection } from "./sections/OffPlanProtection";
import { AskAIModal } from "./modals/AskAIModal";
import { MakeOfferModal } from "./modals/MakeOfferModal";
import { DueDiligenceModal } from "./modals/DueDiligenceModal";
import { VerificationModal } from "./modals/VerificationModal";
import { ScheduleSiteVisitModal } from "./modals/ScheduleSiteVisitModal";

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onReserve: () => void;
}

export function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showDueDiligence, setShowDueDiligence] = useState(false);
  const [dueDiligenceTier, setDueDiligenceTier] = useState<'deep' | 'deeper'>('deep');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationPaid, setVerificationPaid] = useState(false);
  const [showSiteVisit, setShowSiteVisit] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Use different Q&A data based on whether property is scanned
  const currentQAData = property.isScanned ? scannedQAData : qaData;

  // Initialize with first 3 sections expanded by default
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    return currentQAData.slice(0, 3).map(section => section.title);
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isExpanded = (title: string) => expandedSections.includes(title);

  const scrollToSection = (title: string) => {
    const section = sectionRefs.current[title];
    if (section) {
      const yOffset = -80; // Account for sticky header
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Expand the section if not already expanded
      if (!expandedSections.includes(title)) {
        setExpandedSections((prev) => [...prev, title]);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.name,
          text: `Check out this property: ${property.name} in ${property.location}`,
          url: window.location.href,
        });
      } catch (_err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Helper to render details with clickable links
  const renderDetails = (details: string) => {
    // Check if details contain mortgage or insurance keywords
    if (details.includes('mortgage pre-approval') || details.includes('Apply for mortgage')) {
      return (
        <button
          onClick={() => window.open('https://forms.gle/mortgage-preapproval', '_blank')}
          className="text-sm text-gray-700 hover:text-[#50b8b1] underline text-left w-full"
        >
          {details}
        </button>
      );
    }

    if (details.includes('title insurance') || details.includes('Get a quote')) {
      return (
        <button
          onClick={() => window.open('https://forms.gle/insurance-quote', '_blank')}
          className="text-sm text-gray-700 hover:text-[#50b8b1] underline text-left w-full"
        >
          {details}
        </button>
      );
    }

    if (details.includes('Bundle your insurance') || details.includes('Bundle insurance')) {
      return (
        <button
          onClick={() => window.open('https://forms.gle/insurance-bundle', '_blank')}
          className="text-sm text-gray-700 hover:text-[#50b8b1] underline text-left w-full"
        >
          {details}
        </button>
      );
    }

    // Default non-clickable rendering
    return <p className="text-sm text-gray-700">{details}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900">{property.name}</h2>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-[#f59e0b] text-[#f59e0b]" : "text-gray-600"}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Image Carousel */}
        <div className="relative mb-6 rounded-xl overflow-hidden h-64 md:h-96">
          <Image
            src={property.images[currentImageIndex]}
            alt={property.name}
            fill
            unoptimized
            className="object-cover"
          />
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Social Proof & Activity */}
        {property.socialProof && (
          <div className="bg-[#fef3c7] rounded-lg p-4 mb-6 border border-[#f59e0b]/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Eye className="w-4 h-4 text-[#f59e0b]" />
                  <span>{property.socialProof.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-[#f59e0b]" />
                  <span>{property.socialProof.interestedBuyers} interested</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                📝 Last updated: {property.socialProof.lastUpdated}
              </div>
            </div>
          </div>
        )}

        {/* Data Quality Warning */}
        {property.dataQuality && property.dataQuality.completeness < 80 && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-gray-900">
                    {property.isScanned ? "External Listing - AI-Enhanced Analysis" : "Incomplete Data Report"}
                  </h5>
                  <span className="text-sm font-semibold text-yellow-700">
                    {property.dataQuality.completeness}% Complete
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {property.isScanned
                    ? `✓ We've analyzed this external listing using our database. You'll get FMV, location insights, financial projections, risk scoring, and market analysis. Only title verification and developer credentials require manual checking.`
                    : `This property report is missing some information. Data was last verified on ${property.dataQuality.lastVerified}.`}
                </p>
                {property.isScanned && property.scannedFrom && (
                  <div className="text-xs text-gray-600 mb-2 flex items-center gap-1 flex-wrap">
                    <Link2 className="w-3 h-3 flex-shrink-0" />
                    <span>Source:</span>
                    <a
                      href={property.scannedFrom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#50b8b1] hover:underline break-all"
                    >
                      {property.scannedFrom}
                    </a>
                  </div>
                )}
                {property.dataQuality.missingFields.length > 0 && (
                  <div className="text-xs text-gray-600 mb-2">
                    <span className="font-semibold">⚠️ Requires Verification:</span> {property.dataQuality.missingFields.slice(0, 3).join(", ")}
                    {property.dataQuality.missingFields.length > 3 && ` and ${property.dataQuality.missingFields.length - 3} more`}
                  </div>
                )}
                {property.isScanned && (
                  <div className="text-xs text-green-700 bg-green-50 rounded p-2 mb-2">
                    ✓ <strong>Available:</strong> Fair Market Value • Location & Infrastructure • Financial Projections • Risk Assessment • Exit & Liquidity Analysis
                  </div>
                )}
                <button
                  onClick={() => setShowAskAI(true)}
                  className="mt-2 text-sm text-[#50b8b1] hover:text-[#45a69f] font-semibold"
                >
                  {property.isScanned ? "Ask AI about missing details →" : "Ask AI for this information →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Quality Score - High Quality */}
        {property.dataQuality && property.dataQuality.completeness >= 80 && (
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-gray-900">Verified Report</h5>
                  <span className="text-sm font-semibold text-green-700">
                    {property.dataQuality.completeness}% Complete
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Last verified on {property.dataQuality.lastVerified}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#50b8b1] to-[#3d9691] rounded-xl p-4 text-white shadow-sm">
            <TrendingUp className="w-5 h-5 mb-2 opacity-80" />
            <div className="text-xs opacity-80 mb-1">Rental Yield</div>
            <div className="text-2xl">6-8%</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-sm">
            <Shield className="w-5 h-5 mb-2 opacity-80" />
            <div className="text-xs opacity-80 mb-1">Risk Score</div>
            <div className="text-2xl">Low</div>
          </div>
          <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl p-4 text-white shadow-sm">
            <Star className="w-5 h-5 mb-2 opacity-80" />
            <div className="text-xs opacity-80 mb-1">Liquidity</div>
            <div className="text-2xl">8.2/10</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-sm">
            <Building2 className="w-5 h-5 mb-2 opacity-80" />
            <div className="text-xs opacity-80 mb-1">Completion</div>
            <div className="text-2xl">85%</div>
          </div>
        </div>

        {/* Property Info Banner */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">{property.name} | {property.location}</h1>
              <p className="text-[#50b8b1]">{property.price}</p>
            </div>
            <div className="flex items-center gap-1 bg-[#e8f5f4] px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="text-sm">{property.developerRating}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            {property.scannedData?.bathrooms && (
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5" />
                <span>{property.scannedData.bathrooms} Baths</span>
              </div>
            )}
            {property.scannedData?.parkingSpaces && (
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                <span>{property.scannedData.parkingSpaces} Parking</span>
              </div>
            )}
            {property.scannedData?.propertyType && (
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>{property.scannedData.propertyType}</span>
              </div>
            )}
          </div>

          {/* Viewing Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setShowSiteVisit(true)}
              className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-[#50b8b1] rounded-lg hover:bg-[#50b8b1] hover:text-white transition-all group"
            >
              <MapPin className="w-6 h-6 text-[#50b8b1] group-hover:text-white transition-colors" />
              <span className="font-semibold">Schedule Site Visit</span>
              <span className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">In-person viewing</span>
            </button>

            <button
              onClick={() => setShowSiteVisit(true)}
              className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-[#f59e0b] rounded-lg hover:bg-[#f59e0b] hover:text-white transition-all group"
            >
              <MessageCircle className="w-6 h-6 text-[#f59e0b] group-hover:text-white transition-colors" />
              <span className="font-semibold">Book Virtual Tour</span>
              <span className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">30-min video call</span>
            </button>
          </div>

          {/* Scanned Data Details */}
          {property.scannedData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-gray-900 mb-3">Property Details</h4>

              {property.scannedData.description && (
                <p className="text-sm text-gray-700 mb-4">{property.scannedData.description}</p>
              )}

              {property.scannedData.features && property.scannedData.features.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm text-gray-900 mb-2">Features:</h5>
                  <ul className="grid grid-cols-2 gap-2">
                    {property.scannedData.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[#50b8b1] mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                {property.scannedData.landSize && (
                  <div>
                    <span className="text-gray-600">Land Size:</span>
                    <span className="ml-2 text-gray-900">{property.scannedData.landSize}</span>
                  </div>
                )}
                {property.scannedData.builtUpArea && (
                  <div>
                    <span className="text-gray-600">Built Area:</span>
                    <span className="ml-2 text-gray-900">{property.scannedData.builtUpArea}</span>
                  </div>
                )}
                {property.scannedData.listedDate && (
                  <div>
                    <span className="text-gray-600">Listed:</span>
                    <span className="ml-2 text-gray-900">{property.scannedData.listedDate}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Listed By Info */}
          {property.listedBy && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-900">{property.listedBy.name}</h4>
                    {property.listedBy.verified && (
                      <BadgeCheck className="w-4 h-4 text-[#50b8b1]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{property.listedBy.company}</p>
                  <p className="text-xs text-gray-500">All transactions processed through Inda</p>
                </div>
              </div>
            </div>
          )}

          {/* 3-Click Actions */}
          <div>
            {property.isScanned ? (
              /* External Listing CTAs */
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setDueDiligenceTier('deep');
                    setShowDueDiligence(true);
                  }}
                  className="w-full px-6 py-4 bg-white text-[#50b8b1] rounded-lg hover:bg-[#e8f5f4] transition-colors border-2 border-[#50b8b1] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Deep Dive Report</div>
                      <div className="text-xs text-gray-600">Registry checks only</div>
                    </div>
                  </div>
                  <div className="text-sm">₦750K</div>
                </button>
                <button
                  onClick={() => {
                    setDueDiligenceTier('deeper');
                    setShowDueDiligence(true);
                  }}
                  className="w-full px-6 py-4 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Deeper Dive Report</div>
                      <div className="text-xs text-white/80">Registry + Legal + In-person visits</div>
                    </div>
                  </div>
                  <div className="text-sm">₦1.5M</div>
                </button>
                <p className="text-xs text-gray-600 text-center">
                  💡 External listings require independent verification before purchase.
                </p>
              </div>
            ) : (
              /* Verified Listing 3-Click Flow */
              <>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowMakeOffer(true)}
                    className="px-4 py-3 bg-[#e8f5f4] text-[#50b8b1] rounded-lg hover:bg-[#50b8b1] hover:text-white transition-colors border border-[#50b8b1]"
                  >
                    1. Make Offer
                  </button>
                  <button
                    className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg border border-gray-200 cursor-not-allowed"
                    title="Coming soon"
                  >
                    2. Lock Offer
                  </button>
                  <button
                    className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg border border-gray-200 cursor-not-allowed"
                    title="Coming soon"
                  >
                    3. Schedule
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Steps 2 & 3 coming soon
                </p>
              </>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {currentQAData.map((section) => (
              <button
                key={section.title}
                onClick={() => scrollToSection(section.title)}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-[#e8f5f4] text-gray-700 hover:text-[#50b8b1] rounded-lg transition-colors whitespace-nowrap"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions Banner */}
        <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-xl p-4 mb-6 border border-[#f59e0b]/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-[#f59e0b] flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-gray-900 mb-2">💡 Have questions?</h4>
              <p className="text-sm text-gray-700 mb-3">
                Get instant answers about this property based on real market data and verified insights.
              </p>
              <button
                onClick={() => setShowAskAI(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#f59e0b] rounded-lg hover:bg-gray-50 transition-colors text-sm border border-[#f59e0b]/20"
              >
                <MessageCircle className="w-4 h-4" />
                Ask Anything
              </button>
            </div>
          </div>
        </div>

        {/* Q&A Sections */}
        <div className="space-y-4">
          <h2 className="text-gray-900 mb-2">Everything You Need to Know</h2>

          {currentQAData.map((section: QASection) => (
            <div
              key={section.title}
              ref={(el) => (sectionRefs.current[section.title] = el)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-gray-900">{section.title}</h3>
                  {/* Layer 2 Badge - Verification Required */}
                  {section.layer === "verification-required" && !verificationPaid && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      Verification Required
                    </span>
                  )}
                  {/* Layer 2 Badge - Verified */}
                  {section.layer === "verification-required" && verificationPaid && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                {isExpanded(section.title) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              {isExpanded(section.title) && (
                <div className="px-6 pb-4 space-y-4">
                  {/* Layer 2 Verification CTA */}
                  {section.layer === "verification-required" && !verificationPaid && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-2">🔒 Verification Required</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            The information below is based on developer claims. Pay ₦50,000 to unlock independent verification by our on-ground team.
                          </p>
                          <button
                            onClick={() => setShowVerificationModal(true)}
                            className="px-4 py-2 bg-[#f59e0b] text-white rounded-lg hover:bg-[#d97706] transition-colors text-sm"
                          >
                            Verify Now - ₦50,000
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render specialized section if type is defined */}
                  {section.type === "financial" && section.title === "Financial Performance" ? (
                    <FinancialPerformanceSection />
                  ) : section.type === "financial" && section.title === "Financial Performance Projections" ? (
                    <FinancialPerformanceSection />
                  ) : section.type === "risk" && section.title === "Risk Assessment" ? (
                    <RiskAssessmentSection />
                  ) : section.type === "exit" && (section.title === "Exit & Liquidity" || section.title === "Exit & Liquidity Analysis") ? (
                    <ExitLiquiditySection />
                  ) : section.type === "developer" && section.title === "Developer & Project Credibility" ? (
                    <DeveloperCredibilitySection />
                  ) : section.type === "portfolio" && (section.title === "Portfolio Fit" || section.title === "Investment Fit") ? (
                    <PortfolioFitSection />
                  ) : section.type === "price" && (section.title === "Price Value" || section.title === "Price & Value Analysis") ? (
                    <PriceValueSection />
                  ) : section.type === "mortgage" && (section.title === "Mortgage & Insurance Partners") ? (
                    <MortgageInsuranceSection />
                  ) : section.title === "Construction & Property Condition" && property.isOffPlan ? (
                    // /* Off-Plan Protection Section */
                    <>
                      <OffPlanProtection property={property} />
                      {/* Still show standard Q&A after off-plan protection */}
                      {section.questions.map((qa, index) => (
                        <div key={index} className="border-t border-gray-100 pt-4 mt-4">
                          {/* Question */}
                          <p className="text-gray-900 mb-2 font-semibold">{qa.question}</p>

                          {/* Answer */}
                          <p className="text-gray-600 text-sm mb-2">{qa.answer}</p>

                          {/* Details */}
                          {qa.details && (
                            <div className="flex items-start gap-2 mt-2 p-3 bg-[#e8f5f4] rounded-lg">
                              <FileText className="w-4 h-4 text-[#50b8b1] mt-0.5 flex-shrink-0" />
                              {renderDetails(qa.details)}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    /* Standard Q&A rendering */
                    section.questions.map((qa, index) => (
                      <div key={index} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                        {/* Question */}
                        <p className="text-gray-900 mb-2 font-semibold">{qa.question}</p>

                        {/* Answer */}
                        <p className="text-gray-600 text-sm mb-2">{qa.answer}</p>

                        {/* Details */}
                        {qa.details && (
                          <div className="flex items-start gap-2 mt-2 p-3 bg-[#e8f5f4] rounded-lg">
                            <FileText className="w-4 h-4 text-[#50b8b1] mt-0.5 flex-shrink-0" />
                            {renderDetails(qa.details)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={() => setShowAskAI(true)}
            className="px-6 py-4 bg-white text-[#50b8b1] rounded-xl border-2 border-[#50b8b1] hover:bg-[#e8f5f4] transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:inline">Ask Anything</span>
          </button>
          <button
            onClick={() => {
              if (property.isScanned) {
                setShowDueDiligence(true);
              } else {
                setShowMakeOffer(true);
              }
            }}
            className="flex-1 px-6 py-4 bg-[#50b8b1] text-white rounded-xl hover:bg-[#45a69f] transition-colors"
          >
            {property.isScanned ? "Run Due Diligence" : "Make Offer"}
          </button>
        </div>
      </div>

      {/* Ask AI Modal */}
      <AskAIModal
        isOpen={showAskAI}
        onClose={() => setShowAskAI(false)}
        propertyName={property.name}
      />

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={showMakeOffer}
        onClose={() => setShowMakeOffer(false)}
        propertyName={property.name}
        propertyPrice={property.price}
      />

      {/* Due Diligence Modal */}
      <DueDiligenceModal
        isOpen={showDueDiligence}
        onClose={() => setShowDueDiligence(false)}
        propertyName={property.name}
        propertyPrice={property.price}
        tier={dueDiligenceTier}
        onTierChange={setDueDiligenceTier}
      />

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        propertyName={property.name}
        propertyPrice={property.price}
        verificationPaid={verificationPaid}
        onVerificationPaid={setVerificationPaid}
      />

      {/* Schedule Site Visit Modal */}
      <ScheduleSiteVisitModal
        isOpen={showSiteVisit}
        onClose={() => setShowSiteVisit(false)}
        propertyName={property.name}
        propertyLocation={property.location}
      />
    </div>
  );
}

