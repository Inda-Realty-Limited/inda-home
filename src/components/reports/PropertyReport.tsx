"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Home,
  MapPin,
  DollarSign,
  TrendingUp,
  Shield,
  FileText,
  Users,
  Sparkles,
  MessageCircle,
  Heart,
  Share2,
  Bed,
  Bath,
  Calendar,
  CheckCircle2,
  Eye,
  Clock,
  Target,
  Utensils,
  Briefcase,
  Dumbbell,
  ShoppingBag,
  GraduationCap,
  Star,
  MapPinned,
  Navigation,
  Key,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { useRouter } from "next/router";
import { AskAIModal } from "@/views/property-details/modals/AskAIModal";
import { MakeOfferModal } from "@/views/property-details/modals/MakeOfferModal";
import { ScheduleSiteVisitModal } from "@/views/property-details/modals/ScheduleSiteVisitModal";
import { BookVirtualTourModal } from "@/views/property-details/modals/BookVirtualTourModal";

export interface PropertyReportData {
  name: string;
  location: string;
  price: number;
  bed?: number;
  bath?: number;
  size?: string;
  type?: string;
  image?: string;
  yearBuilt?: number;
  amenities?: string[];
  views?: number;
  isOffPlan?: boolean;
  offPlanData?: {
    indaVerifiedCompletion?: number;
    lastVerificationDate?: string;
    expectedHandoverDate?: string;
  };
}

interface PropertyIntelligenceData {
  location_intelligence?: {
    coordinates?: {
      lat?: number;
      lng?: number;
    };
    district?: string;
    accessibility?: {
      to_victoria_island_minutes?: number;
      to_airport_minutes?: number;
      to_lekki_ftz_minutes?: number;
      to_ikeja_mall_minutes?: number;
      to_marina_minutes?: number;
      to_third_mainland_bridge_minutes?: number;
    };
    nearby_schools?: {
      count?: number;
      distance_km?: number;
      names?: string[];
    };
    nearby_hospitals?: {
      count?: number;
      distance_km?: number;
      names?: string[];
    };
    nearby_shopping?: {
      count?: number;
      distance_km?: number;
      names?: string[];
    };
    infrastructure_projects?: Record<
      string,
      { distance_km?: number; expected_value_increase_pct?: string }
    >;
    nearby_amenities?: Array<{
      name?: string;
      category?: string;
      distance_km?: number;
      rating?: number;
    }>;
  };
  investment_analysis?: {
    total_investment_breakdown?: {
      purchase_price?: number;
      legal_fees?: number;
      legal_fees_pct?: number;
      agency_fees?: number;
      agency_fees_pct?: number;
      survey_fees?: number;
      survey_fees_pct?: number;
      stamp_duty?: number;
      stamp_duty_pct?: number;
      land_registration?: number;
      governors_consent?: number;
      governors_consent_pct?: number;
      total_investment?: number;
      additional_costs_pct?: number;
    };
    annual_rental_income?: {
      net_rental_income?: number;
      gross_yield_pct?: number;
      net_yield_pct?: number;
      rental_range_min?: number;
      rental_range_max?: number;
    };
  };
  value_projection?: {
    annual_appreciation_pct?: number;
    historical_avg_pct?: number;
    year_5?: {
      value?: number;
      gain_pct?: number;
    };
    projected_gain_5_year?: number;
  };
  cash_flow_forecast?: {
    year_1?: {
      rental_income?: number;
      expenses?: number;
      net_cash_flow?: number;
    };
    year_5?: {
      rental_income?: number;
      expenses?: number;
      net_cash_flow?: number;
    };
  };
}

type ReportSection =
  | "overview"
  | "pricing"
  | "location"
  | "financials"
  | "legal"
  | "neighborhood";

type LifestyleTab = "eat" | "work" | "relax";

export function PropertyReport({
  property,
  onBack,
  onEdit,
  intelligenceData,
  sourceListing,
}: {
  property: PropertyReportData;
  onBack?: () => void;
  onEdit?: () => void;
  intelligenceData?: PropertyIntelligenceData | null;
  sourceListing?: any;
}) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  const [selectedSection, setSelectedSection] = useState<ReportSection | null>(null);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showSiteVisit, setShowSiteVisit] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [lifestyleTab, setLifestyleTab] = useState<LifestyleTab>("eat");
  const [roiYears, setRoiYears] = useState(5);

  const isLand = property.bed === 0 || property.type?.toLowerCase() === "land";
  const isOffPlan = property.isOffPlan ?? false;

  const askingPrice =
    typeof property.price === "string"
      ? parseInt((property.price as string).replace(/[^\d]/g, "")) || 0
      : property.price || 0;

  const investmentBreakdown =
    intelligenceData?.investment_analysis?.total_investment_breakdown;
  const rentalIncome = intelligenceData?.investment_analysis?.annual_rental_income;
  const valueProjection = intelligenceData?.value_projection;

  const legalFees = investmentBreakdown?.legal_fees;
  const stampDuty = investmentBreakdown?.stamp_duty;
  const agencyFee = investmentBreakdown?.agency_fees;
  const surveyFees = investmentBreakdown?.survey_fees;
  const landRegistration = investmentBreakdown?.land_registration;
  const totalInvestment = investmentBreakdown?.total_investment;
  const annualRent = rentalIncome?.net_rental_income;
  const monthlyRent = annualRent ? annualRent / 12 : undefined;
  const netYield = rentalIncome?.net_yield_pct;
  const hasFinancialIntelligence = Boolean(
    investmentBreakdown?.purchase_price &&
      totalInvestment &&
      valueProjection?.year_5?.value,
  );

  const reportCards = [
    {
      id: "overview" as ReportSection,
      title: "Your New Home",
      subtitle: "See what makes this special",
      icon: Home,
      color: "text-inda-teal",
      bgColor: "bg-inda-teal/10",
    },
    {
      id: "pricing" as ReportSection,
      title: "Smart Money Decision",
      subtitle: "Deal analysis & ROI calculator",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "location" as ReportSection,
      title: "Your Daily Life Here",
      subtitle: "Commutes, groceries, schools, healthcare",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "financials" as ReportSection,
      title: "Real Cost & Returns",
      subtitle: "Calculate your actual profit",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "legal" as ReportSection,
      title: "Peace of Mind Checklist",
      subtitle: "Documents & safety score",
      icon: Shield,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: "neighborhood" as ReportSection,
      title: "Living Here",
      subtitle: "Dining, entertainment, social scene, vibe",
      icon: Users,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  const lifestyleData = buildLifestyleData(intelligenceData);

  if (selectedSection === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Floating Ask AI - Mobile Only */}
        <div className="fixed bottom-8 right-8 z-30 lg:hidden">
          <button
            onClick={() => setShowAskAI(true)}
            className="flex items-center gap-3 px-5 py-4 bg-inda-teal text-white rounded-full shadow-2xl hover:bg-inda-teal/90 transition-all hover:scale-105"
          >
            <MessageCircle className="w-6 h-6 animate-pulse" />
            <span className="font-semibold text-sm">Ask Inda AI</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-inda-gray sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900">{property.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-inda-teal hover:text-inda-teal transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                {property.image ? (
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    No image available
                  </div>
                )}
                {typeof property.views === "number" && property.views > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {property.views} views
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
                <div className={`grid gap-6 ${isLand ? "grid-cols-2" : "grid-cols-4"}`}>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                      ₦{(askingPrice / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Asking Price</div>
                  </div>
                  {!isLand && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-gray-900">
                        <Bed className="w-5 h-5" />
                        {property.bed ?? "—"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Bedrooms</div>
                    </div>
                  )}
                  {!isLand && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-gray-900">
                        <Bath className="w-5 h-5" />
                        {property.bath ?? "—"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                      {property.size || "—"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{isLand ? "Plot Size" : "Size"}</div>
                  </div>
                </div>
              </div>

              {/* AI Intro */}
              <div className="bg-inda-teal/5 border border-inda-teal/20 rounded-2xl p-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-inda-teal/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-inda-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Your AI-Powered Property Report
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We've analyzed this property across 6 key areas. Tap any card to explore
                      interactive tools, calculators, and insights — no jargon, just what you need
                      to decide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {reportCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setSelectedSection(card.id)}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray hover:shadow-md hover:border-gray-200 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                          <p className="text-sm text-gray-600">{card.subtitle}</p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-inda-teal transition-colors rotate-180" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action CTAs */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
                <h3 className="font-semibold text-gray-900 mb-4">Ready to take action?</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowVirtualTour(true)}
                    className="px-4 py-3 border border-inda-gray rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Virtual Tour
                  </button>
                  <button
                    onClick={() => setShowSiteVisit(true)}
                    className="px-4 py-3 border border-inda-gray rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Visit
                  </button>
                  <button
                    onClick={() => setShowMakeOffer(true)}
                    className="px-4 py-3 bg-inda-teal text-white rounded-lg text-sm font-medium hover:bg-inda-teal/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Make Offer
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Ask Inda Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-inda-teal/5 border-2 border-inda-teal/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-inda-teal flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Ask Inda Anything</h3>
                      <p className="text-xs text-gray-600">AI assistant ready to help</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Popular questions:
                    </div>
                    {[
                      "What are the hidden costs?",
                      "How does this compare?",
                      "Good for rental income?",
                      "What's the neighborhood like?",
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setShowAskAI(true)}
                        className="w-full text-left px-3 py-2.5 bg-white hover:bg-inda-teal/5 border border-inda-gray hover:border-inda-teal/30 rounded-lg text-xs text-gray-700 transition-all group"
                      >
                        <span className="group-hover:text-inda-teal">{question}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAskAI(true)}
                    className="w-full px-4 py-3 bg-inda-teal text-white rounded-xl font-semibold hover:bg-inda-teal/90 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Start Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AskAIModal
          isOpen={showAskAI}
          onClose={() => setShowAskAI(false)}
          propertyName={property.name}
          propertyData={{
            id: sourceListing?._id || sourceListing?.id || "unknown",
            name: property.name,
            location: property.location,
            price: `₦${askingPrice.toLocaleString()}`,
            priceNumeric: askingPrice,
            bedrooms: property.bed || 0,
            scannedData: {
              bathrooms: property.bath ?? null,
              propertyType: property.type ?? null,
            },
          }}
          intelligenceData={intelligenceData ?? undefined}
          agentName={sourceListing?.agentName || sourceListing?.snapshot?.agentName || undefined}
        />
        <MakeOfferModal
          isOpen={showMakeOffer}
          onClose={() => setShowMakeOffer(false)}
          propertyName={property.name}
          propertyPrice={`₦${askingPrice.toLocaleString()}`}
          priceNumeric={askingPrice}
          listingId={sourceListing?._id || sourceListing?.id}
          agentUserId={sourceListing?.userId}
        />
        <ScheduleSiteVisitModal
          isOpen={showSiteVisit}
          onClose={() => setShowSiteVisit(false)}
          propertyName={property.name}
          propertyLocation={property.location}
          listingId={sourceListing?._id || sourceListing?.id}
          agentUserId={sourceListing?.userId}
        />
        <BookVirtualTourModal
          isOpen={showVirtualTour}
          onClose={() => setShowVirtualTour(false)}
          propertyName={property.name}
          propertyLocation={property.location}
          listingId={sourceListing?._id || sourceListing?.id}
          agentUserId={sourceListing?.userId}
        />
      </div>
    );
  }

  // Section Detail View
  const currentCard = reportCards.find((c) => c.id === selectedSection);
  const Icon = currentCard?.icon || Home;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Ask AI */}
      <div className="fixed bottom-8 right-8 z-30">
        <button
          onClick={() => setShowAskAI(true)}
          className="flex items-center gap-3 px-5 py-4 bg-inda-teal text-white rounded-full shadow-2xl hover:bg-inda-teal/90 transition-all hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
          <span className="font-semibold text-sm">Ask AI</span>
        </button>
      </div>

      {/* Section Header */}
      <div className="bg-white border-b border-inda-gray sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSection(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              className={`w-10 h-10 rounded-xl ${currentCard?.bgColor} flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 ${currentCard?.color}`} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{currentCard?.title}</h2>
              <p className="text-sm text-gray-600">{currentCard?.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {selectedSection === "overview" && (
          <OverviewSection
            property={property}
            isLand={isLand}
            isOffPlan={isOffPlan}
            sourceListing={sourceListing}
          />
        )}
        {selectedSection === "pricing" && (
          <PricingSection
            askingPrice={askingPrice}
            isLand={isLand}
            intelligenceData={intelligenceData}
          />
        )}
        {selectedSection === "location" && (
          <LocationSection property={property} intelligenceData={intelligenceData} />
        )}
        {selectedSection === "financials" && (
          <FinancialsSection
            totalInvestment={totalInvestment}
            askingPrice={askingPrice}
            legalFees={legalFees}
            stampDuty={stampDuty}
            agencyFee={agencyFee}
            surveyFees={surveyFees}
            landRegistration={landRegistration}
            annualRent={annualRent}
            monthlyRent={monthlyRent}
            netYield={netYield}
            roiYears={roiYears}
            setRoiYears={setRoiYears}
            isLand={isLand}
            intelligenceData={intelligenceData}
            hasFinancialIntelligence={hasFinancialIntelligence}
          />
        )}
        {selectedSection === "legal" && (
          <LegalSection
            intelligenceData={intelligenceData}
            sourceListing={sourceListing}
          />
        )}
        {selectedSection === "neighborhood" && (
          <NeighborhoodSection
            lifestyleTab={lifestyleTab}
            setLifestyleTab={setLifestyleTab}
            lifestyleData={lifestyleData}
            intelligenceData={intelligenceData}
          />
        )}
      </div>

      <AskAIModal
        isOpen={showAskAI}
        onClose={() => setShowAskAI(false)}
        propertyName={property.name}
        propertyData={{
          id: sourceListing?._id || sourceListing?.id || "unknown",
          name: property.name,
          location: property.location,
          price: `₦${askingPrice.toLocaleString()}`,
          priceNumeric: askingPrice,
          bedrooms: property.bed || 0,
          scannedData: {
            bathrooms: property.bath ?? null,
            propertyType: property.type ?? null,
          },
        }}
        intelligenceData={intelligenceData ?? undefined}
        agentName={sourceListing?.agentName || sourceListing?.snapshot?.agentName || undefined}
      />
    </div>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

function OverviewSection({
  property,
  isLand,
  isOffPlan,
  sourceListing,
}: {
  property: PropertyReportData;
  isLand: boolean;
  isOffPlan: boolean;
  sourceListing?: any;
}) {
  const photoAnalysis = sourceListing?.aiReport?.photoAnalysis;
  const documentAnalysis = sourceListing?.aiReport?.documentAnalysis;
  const propertyCondition = toTitleCase(
    photoAnalysis?.propertyCondition || sourceListing?.condition,
  );
  const finishQuality = toTitleCase(photoAnalysis?.finishingQuality);
  const conditionScore = getConditionScore(
    photoAnalysis?.propertyCondition || sourceListing?.condition,
  );
  const constructionStatus = toTitleCase(sourceListing?.constructionStatus);
  const declaredDocumentCount = Array.isArray(sourceListing?.declaredDocumentTypes)
    ? sourceListing.declaredDocumentTypes.length
    : 0;
  const uploadedDocumentCount = Array.isArray(sourceListing?.documents)
    ? sourceListing.documents.length
    : 0;
  const landSummary = [
    property.size ? `${property.size} recorded` : null,
    documentAnalysis?.titleType || sourceListing?.titleVerification || null,
    uploadedDocumentCount > 0 ? `${uploadedDocumentCount} document(s) uploaded` : null,
    declaredDocumentCount > 0 ? `${declaredDocumentCount} document type(s) declared` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      {/* Hero Score Card — varies by type */}
      {!isLand && !isOffPlan && (
        <div className="bg-inda-teal rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Property Condition</div>
              <div className="text-3xl font-bold">{propertyCondition || "Not available"}</div>
            </div>
            <div className="text-5xl font-bold">
              {typeof conditionScore === "number" ? (
                <>
                  {conditionScore}
                  <span className="text-2xl">/10</span>
                </>
              ) : (
                <span className="text-2xl">--</span>
              )}
            </div>
          </div>
          <p className="text-sm opacity-90">
            {[
              finishQuality ? `${finishQuality} finish quality` : null,
              constructionStatus,
              sourceListing?.buildYear ? `Built in ${sourceListing.buildYear}` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "Condition details are not available for this listing."}
          </p>
        </div>
      )}

      {isOffPlan && property.offPlanData && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Construction Progress</div>
              <div className="text-3xl font-bold">
                {property.offPlanData.indaVerifiedCompletion ?? 0}%
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-white/40 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {property.offPlanData.indaVerifiedCompletion ?? 0}
              </span>
            </div>
          </div>
          <p className="text-sm opacity-90">
            Verified by Inda on {property.offPlanData.lastVerificationDate || "—"}. Expected
            handover: {property.offPlanData.expectedHandoverDate || "TBD"}
          </p>
        </div>
      )}

      {isLand && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Plot Size</div>
              <div className="text-3xl font-bold">{property.size || "Not available"}</div>
            </div>
            <div className="text-5xl">🌳</div>
          </div>
          <p className="text-sm opacity-90">
            {landSummary || "Land-specific legal and survey details are not available yet."}
          </p>
        </div>
      )}

      {/* What You're Getting */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">What you&apos;re getting</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-inda-teal/10 flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-inda-teal" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Property Type</div>
              <div className="text-sm text-gray-600 mt-1">{property.type || "Not available"}</div>
            </div>
          </div>

          {isLand && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-inda-teal/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-inda-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Land Dimensions</div>
                <div className="text-sm text-gray-600 mt-1">{property.size || "—"} total plot area</div>
              </div>
            </div>
          )}

          {!isLand && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-inda-teal/10 flex items-center justify-center flex-shrink-0">
                <Bed className="w-4 h-4 text-inda-teal" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Space</div>
                <div className="text-sm text-gray-600 mt-1">
                  {property.bed ?? "—"} bedrooms · {property.bath ?? "—"} bathrooms
                  {property.size ? ` · ${property.size}` : ""}
                </div>
              </div>
            </div>
          )}

          {!isLand && !isOffPlan && property.yearBuilt && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-inda-teal/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-inda-teal" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Age</div>
                <div className="text-sm text-gray-600 mt-1">
                  Built in {property.yearBuilt} ({new Date().getFullYear() - property.yearBuilt} years old)
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-inda-teal/10 flex items-center justify-center flex-shrink-0">
              <Key className="w-4 h-4 text-inda-teal" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Availability</div>
              <div className="text-sm text-gray-600 mt-1">
                {isOffPlan
                  ? `Expected completion: ${property.offPlanData?.expectedHandoverDate || "TBD"}`
                  : isLand
                  ? constructionStatus || "Availability not provided"
                  : constructionStatus || "Availability not provided"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features / Location advantages */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">
          {isLand ? "Location advantages" : isOffPlan ? "Planned features" : "What makes this special"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {isLand
            ? (property.amenities || []).map((feature) => (
                <div
                  key={feature}
                  className="px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                >
                  {feature}
                </div>
              ))
            : (property.amenities || []).slice(0, 6).map((f) => `✅ ${f}`).map((feature) => (
                <div
                  key={feature}
                  className="px-3 py-2 bg-inda-teal/10 text-inda-teal rounded-full text-sm font-medium"
                >
                  {feature}
                </div>
              ))}
          {!property.amenities?.length && (
            <div className="text-sm text-gray-600">No verified features available.</div>
          )}
        </div>
      </div>

      {/* Amenities (buildings) / Infrastructure (land) */}
      {!isLand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isOffPlan ? "Planned amenities" : "Estate amenities included"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(property.amenities || []).map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{amenity}</span>
              </div>
            ))}
            {!property.amenities?.length && (
              <div className="text-sm text-gray-600 col-span-2">
                No verified amenities available.
              </div>
            )}
          </div>
        </div>
      )}

      {isLand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">Available infrastructure</h3>
          <div className="grid grid-cols-2 gap-3">
            {(property.amenities || []).map((infra) => (
              <div key={infra} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{infra}</span>
              </div>
            ))}
            {!property.amenities?.length && (
              <div className="text-sm text-gray-600 col-span-2">
                No verified infrastructure data available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Condition Details — completed buildings only */}
      {!isLand && !isOffPlan && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">Property condition details</h3>
          <div className="space-y-3">
            {[
              {
                label: "Condition",
                rating: propertyCondition || "Not available",
                stars: getConditionStars(photoAnalysis?.propertyCondition || sourceListing?.condition),
              },
              {
                label: "Finish Quality",
                rating: finishQuality || "Not available",
                stars: getFinishQualityStars(photoAnalysis?.finishingQuality),
              },
              {
                label: "Construction Status",
                rating: constructionStatus || "Not available",
                stars: getConstructionStatusStars(sourceListing?.constructionStatus),
              },
            ].map(({ label, rating, stars }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{rating}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= stars ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              💡 We recommend getting a professional inspection before purchase (₦50K–₦100K)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PricingSection({
  askingPrice,
  isLand,
  intelligenceData,
}: {
  askingPrice: number;
  isLand: boolean;
  intelligenceData?: PropertyIntelligenceData | null;
}) {
  const investmentBreakdown =
    intelligenceData?.investment_analysis?.total_investment_breakdown;
  const valueProjection = intelligenceData?.value_projection;
  const hasPricingIntelligence = Boolean(
    investmentBreakdown?.purchase_price && valueProjection?.year_5?.value,
  );

  if (!hasPricingIntelligence) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-2">Pricing intelligence</h3>
        <p className="text-sm text-gray-600">
          Pricing intelligence is not available for this listing yet.
        </p>
      </div>
    );
  }

  const purchasePrice = investmentBreakdown?.purchase_price ?? askingPrice;
  const totalInvestment = investmentBreakdown?.total_investment;
  const additionalCostsPct = investmentBreakdown?.additional_costs_pct;
  const projectedValue = valueProjection?.year_5?.value;
  const projectedGain = valueProjection?.projected_gain_5_year;
  const annualAppreciationPct = valueProjection?.annual_appreciation_pct;
  const historicalAvgPct = valueProjection?.historical_avg_pct;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="text-sm opacity-90 mb-1">
          {isLand ? "Land pricing outlook" : "Pricing outlook"}
        </div>
        <div className="text-3xl font-bold">
          {annualAppreciationPct?.toFixed(1)}% yearly projection
        </div>
        {typeof historicalAvgPct === "number" && (
          <p className="text-sm opacity-90 mt-2">
            Historical average in this area: {historicalAvgPct.toFixed(1)}%.
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Pricing breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Purchase price</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(purchasePrice)}
            </span>
          </div>
          {typeof totalInvestment === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total investment</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalInvestment)}
              </span>
            </div>
          )}
          {typeof additionalCostsPct === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Additional costs</span>
              <span className="text-lg font-semibold text-gray-900">
                {additionalCostsPct.toFixed(1)}%
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-900">Projected value in 5 years</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(projectedValue)}
            </span>
          </div>
          {typeof projectedGain === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projected gain in 5 years</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(projectedGain)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FinancialsSection({
  totalInvestment,
  askingPrice,
  legalFees,
  stampDuty,
  agencyFee,
  surveyFees,
  landRegistration,
  annualRent,
  monthlyRent,
  netYield,
  roiYears,
  setRoiYears,
  isLand,
  intelligenceData,
  hasFinancialIntelligence,
}: {
  totalInvestment?: number;
  askingPrice: number;
  legalFees?: number;
  stampDuty?: number;
  agencyFee?: number;
  surveyFees?: number;
  landRegistration?: number;
  annualRent?: number;
  monthlyRent?: number;
  netYield?: number;
  roiYears: number;
  setRoiYears: (v: number) => void;
  isLand: boolean;
  intelligenceData?: PropertyIntelligenceData | null;
  hasFinancialIntelligence: boolean;
}) {
  if (!hasFinancialIntelligence) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-2">Financial intelligence</h3>
        <p className="text-sm text-gray-600">
          Financial intelligence is not available for this listing yet.
        </p>
      </div>
    );
  }

  const purchasePrice =
    intelligenceData?.investment_analysis?.total_investment_breakdown?.purchase_price ?? askingPrice;
  const annualAppreciationPct = intelligenceData?.value_projection?.annual_appreciation_pct ?? 0;
  const projectedValue = intelligenceData?.value_projection?.year_5?.value ?? purchasePrice;
  const projectedGain =
    intelligenceData?.value_projection?.projected_gain_5_year ??
    Math.max(projectedValue - purchasePrice, 0);
  const year1CashFlow = intelligenceData?.cash_flow_forecast?.year_1?.net_cash_flow;
  const year5CashFlow = intelligenceData?.cash_flow_forecast?.year_5?.net_cash_flow;
  const landAppreciationRate = 0.12;
  const roiProjectionValue = isLand
    ? purchasePrice * Math.pow(1 + landAppreciationRate, roiYears)
    : purchasePrice * Math.pow(1 + annualAppreciationPct / 100, roiYears);
  const roiBase = totalInvestment ?? purchasePrice;
  const totalGain = roiProjectionValue - roiBase;
  const totalRentalIncome = isLand ? 0 : (annualRent ?? 0) * roiYears;
  const totalReturn = totalGain + totalRentalIncome;
  const roiPercentage = roiBase > 0 ? (totalReturn / roiBase) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* ROI / Appreciation Calculator */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">
          {isLand ? "Land Appreciation Calculator" : "ROI Calculator"}
        </h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Investment Period</span>
            <span className="font-semibold">{roiYears} years</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={roiYears}
            onChange={(e) => setRoiYears(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-sm opacity-90 mb-1">
              {isLand ? "Appreciation Gain" : "Total Return"}
            </div>
            <div className="text-2xl font-bold">₦{(totalReturn / 1000000).toFixed(1)}M</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">ROI</div>
            <div className="text-2xl font-bold">{roiPercentage.toFixed(0)}%</div>
          </div>
        </div>
        {isLand && (
          <p className="text-xs opacity-80 mt-3 border-t border-white/20 pt-3">
            Based on {(landAppreciationRate * 100).toFixed(0)}% annual land appreciation in this area. Returns are from land value increase only.
          </p>
        )}
      </div>

      {/* Total Investment */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Total investment needed</h3>
        <div className="space-y-3">
          {[
            { label: "Purchase price", value: purchasePrice },
            { label: "Legal fees", value: legalFees },
            { label: "Stamp duty", value: stampDuty },
            { label: "Agency fee", value: agencyFee },
            { label: "Survey fees", value: surveyFees },
            { label: "Land registration", value: landRegistration },
          ]
            .filter(
              (item): item is { label: string; value: number } =>
                typeof item.value === "number" && item.value > 0,
            )
            .map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-medium text-gray-900">
                ₦{(value / 1000000).toFixed(2)}M
              </span>
            </div>
            ))}
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
            <span className="font-semibold text-gray-900">Total needed</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
        </div>
      </div>

      {/* Rental Income — buildings only */}
      {!isLand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">If you rent it out</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Expected annual rent</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(annualRent)} / year
              </div>
              {typeof monthlyRent === "number" && (
                <div className="text-sm text-gray-600 mt-1">
                  ({formatCurrency(monthlyRent)} per month)
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-1">Annual return</div>
              <div className="text-2xl font-bold text-green-600">{netYield}%</div>
            </div>
            {typeof year1CashFlow === "number" && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Year 1 net cash flow</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(year1CashFlow)}
                </div>
              </div>
            )}
            {typeof year5CashFlow === "number" && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Year 5 net cash flow</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(year5CashFlow)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Land Investment Returns — land only */}
      {isLand && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3">Land Investment Returns</h3>
          <p className="text-sm text-gray-700 mb-3">
            Land returns depend on value appreciation data for this listing.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Annual appreciation</span>
              <span className="text-sm font-bold text-green-600">
                {annualAppreciationPct ? `${annualAppreciationPct.toFixed(1)}%` : "Not available"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">5-year projected value</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(projectedValue)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-amber-200">
              <span className="text-sm font-medium text-gray-900">Potential profit (5 years)</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(projectedGain)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocationSection({
  property,
  intelligenceData,
}: {
  property: PropertyReportData;
  intelligenceData?: PropertyIntelligenceData | null;
}) {
  const locationIntelligence = intelligenceData?.location_intelligence;
  const commuteRoutes = [
    {
      destination: "Victoria Island",
      time: locationIntelligence?.accessibility?.to_victoria_island_minutes,
      icon: "💼",
      type: "Business District",
    },
    {
      destination: "Murtala Muhammed Airport",
      time: locationIntelligence?.accessibility?.to_airport_minutes,
      icon: "✈️",
      type: "International Airport",
    },
    {
      destination: "Lekki FTZ",
      time: locationIntelligence?.accessibility?.to_lekki_ftz_minutes,
      icon: "🏭",
      type: "Trade & Industry",
    },
    {
      destination: "Marina",
      time: locationIntelligence?.accessibility?.to_marina_minutes,
      icon: "🏙️",
      type: "Island CBD",
    },
  ].filter(
    (route): route is { destination: string; time: number; icon: string; type: string } =>
      typeof route.time === "number",
  );
  const essentialServices = [
    {
      icon: <ShoppingBag className="w-4 h-4 text-blue-600" />,
      label: "Groceries & Shopping",
      count: locationIntelligence?.nearby_shopping?.count,
      distanceKm: locationIntelligence?.nearby_shopping?.distance_km,
      names: locationIntelligence?.nearby_shopping?.names,
    },
    {
      icon: <GraduationCap className="w-4 h-4 text-purple-600" />,
      label: "Schools",
      count: locationIntelligence?.nearby_schools?.count,
      distanceKm: locationIntelligence?.nearby_schools?.distance_km,
      names: locationIntelligence?.nearby_schools?.names,
    },
    {
      icon: (
        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      label: "Healthcare",
      count: locationIntelligence?.nearby_hospitals?.count,
      distanceKm: locationIntelligence?.nearby_hospitals?.distance_km,
      names: locationIntelligence?.nearby_hospitals?.names,
    },
  ].filter(
    (service) =>
      typeof service.count === "number" ||
      typeof service.distanceKm === "number" ||
      (Array.isArray(service.names) && service.names.length > 0),
  );

  if (commuteRoutes.length === 0 && essentialServices.length === 0 && !locationIntelligence?.district) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-2">Location intelligence</h3>
        <p className="text-sm text-gray-600">
          Location intelligence is not available for this listing yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Address */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Address</h3>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-inda-teal flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900">{property.location}</div>
            {locationIntelligence?.district && (
              <div className="text-sm text-gray-600 mt-1">
                District: {locationIntelligence.district}
              </div>
            )}
          </div>
        </div>
      </div>

      {commuteRoutes.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">Commute times</h3>
          <div className="space-y-3">
            {commuteRoutes.map((route) => (
              <div
                key={route.destination}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl">{route.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{route.destination}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{route.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">{route.time} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {essentialServices.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">Essential services nearby</h3>
          <div className="space-y-4">
            {essentialServices.map(({ icon, label, count, distanceKm, names }) => (
              <div key={label} className="pt-2 first:pt-0 border-t border-gray-100 first:border-0">
                <div className="flex items-center gap-2 mb-2">
                  {icon}
                  <div className="text-sm font-medium text-gray-900">{label}</div>
                </div>
                <div className="text-sm text-gray-600 pl-6">
                  {typeof count === "number" ? `${count} within ${distanceKm ?? "?"} km` : null}
                  {Array.isArray(names) && names.length > 0
                    ? `${typeof count === "number" ? " · " : ""}${names.slice(0, 3).join(" · ")}`
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function buildLifestyleData(
  intelligenceData?: PropertyIntelligenceData | null,
): Record<
  LifestyleTab,
  { name: string; category: string; distance: string; rating?: number }[]
> {
  const nearbyAmenities = intelligenceData?.location_intelligence?.nearby_amenities;
  const amenityGroups =
    Array.isArray(nearbyAmenities) && nearbyAmenities.length > 0
      ? {
          eat: nearbyAmenities
            .filter((item) =>
              (item.category || "").toLowerCase().includes("food") ||
              (item.category || "").toLowerCase().includes("restaurant") ||
              (item.category || "").toLowerCase().includes("shop"),
            )
            .map((item) => ({
              name: item.name || "Unnamed place",
              category: item.category || "Nearby amenity",
              distance:
                typeof item.distance_km === "number"
                  ? `${item.distance_km} km`
                  : "Distance not available",
              rating: item.rating,
            })),
          work: nearbyAmenities
            .filter((item) =>
              (item.category || "").toLowerCase().includes("school") ||
              (item.category || "").toLowerCase().includes("office") ||
              (item.category || "").toLowerCase().includes("business"),
            )
            .map((item) => ({
              name: item.name || "Unnamed place",
              category: item.category || "Nearby amenity",
              distance:
                typeof item.distance_km === "number"
                  ? `${item.distance_km} km`
                  : "Distance not available",
              rating: item.rating,
            })),
          relax: nearbyAmenities
            .filter((item) =>
              (item.category || "").toLowerCase().includes("hospital") ||
              (item.category || "").toLowerCase().includes("park") ||
              (item.category || "").toLowerCase().includes("leisure"),
            )
            .map((item) => ({
              name: item.name || "Unnamed place",
              category: item.category || "Nearby amenity",
              distance:
                typeof item.distance_km === "number"
                  ? `${item.distance_km} km`
                  : "Distance not available",
              rating: item.rating,
            })),
        }
      : null;

  if (
    amenityGroups &&
    (amenityGroups.eat.length > 0 ||
      amenityGroups.work.length > 0 ||
      amenityGroups.relax.length > 0)
  ) {
    return {
      eat: amenityGroups.eat,
      work: amenityGroups.work,
      relax: amenityGroups.relax,
    };
  }

  return {
    eat: (intelligenceData?.location_intelligence?.nearby_shopping?.names || []).map((name) => ({
      name,
      category: "Shopping",
      distance:
        typeof intelligenceData?.location_intelligence?.nearby_shopping?.distance_km === "number"
          ? `${intelligenceData.location_intelligence.nearby_shopping.distance_km} km`
          : "Distance not available",
    })),
    work: (intelligenceData?.location_intelligence?.nearby_schools?.names || []).map((name) => ({
      name,
      category: "School",
      distance:
        typeof intelligenceData?.location_intelligence?.nearby_schools?.distance_km === "number"
          ? `${intelligenceData.location_intelligence.nearby_schools.distance_km} km`
          : "Distance not available",
    })),
    relax: (intelligenceData?.location_intelligence?.nearby_hospitals?.names || []).map((name) => ({
      name,
      category: "Healthcare",
      distance:
        typeof intelligenceData?.location_intelligence?.nearby_hospitals?.distance_km === "number"
          ? `${intelligenceData.location_intelligence.nearby_hospitals.distance_km} km`
          : "Distance not available",
    })),
  };
}

function buildLegalChecklist({
  uniqueDocumentTypes,
  documentAnalysis,
  titleType,
  documentVerification,
  sourceListing,
}: {
  uniqueDocumentTypes: string[];
  documentAnalysis: any;
  titleType: string;
  documentVerification?: any;
  sourceListing?: any;
}) {
  const hasDocumentType = (patterns: string[]) =>
    uniqueDocumentTypes.some((type) =>
      patterns.some((pattern) => type.toLowerCase().includes(pattern)),
    );

  const items = [
    {
      item: titleType,
      status: titleType !== "Not available" ? "provided" : "pending",
      color: titleType !== "Not available" ? "green" : "blue",
    },
    {
      item: "Survey Plan",
      status:
        hasDocumentType(["survey"]) || documentAnalysis?.surveyNumber
          ? "provided"
          : "pending",
      color:
        hasDocumentType(["survey"]) || documentAnalysis?.surveyNumber
          ? "green"
          : "blue",
    },
    {
      item: "Building Approval",
      status: documentAnalysis?.buildingApproval ? "provided" : "pending",
      color: documentAnalysis?.buildingApproval ? "green" : "blue",
    },
    {
      item: "Tax Records",
      status: documentAnalysis?.propertyTax ? "provided" : "pending",
      color: documentAnalysis?.propertyTax ? "green" : "blue",
    },
    {
      item: "Governor's Consent",
      status: documentAnalysis?.governorsConsent ? "provided" : "pending",
      color: documentAnalysis?.governorsConsent ? "green" : "blue",
    },
    {
      item: "Encumbrance Check",
      status: sourceListing?.encumbrances || documentVerification?.verificationStatus || "not available",
      color:
        sourceListing?.encumbrances || documentVerification?.verificationStatus
          ? "amber"
          : "blue",
    },
  ];

  return items;
}

function getConditionScore(value?: string) {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("excellent")) return 9;
  if (normalized.includes("good")) return 7;
  if (normalized.includes("fair")) return 5;
  if (normalized.includes("poor")) return 3;
  return undefined;
}

function getConditionStars(value?: string) {
  const score = getConditionScore(value);
  if (!score) return 0;
  return Math.max(1, Math.min(5, Math.round(score / 2)));
}

function getFinishQualityStars(value?: string) {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("luxury")) return 5;
  if (normalized.includes("standard")) return 3;
  if (normalized.includes("basic")) return 2;
  return 0;
}

function getConstructionStatusStars(value?: string) {
  const normalized = (value || "").toLowerCase();
  if (normalized.includes("complete")) return 5;
  if (normalized.includes("finish")) return 4;
  if (normalized.includes("roof")) return 3;
  if (normalized.includes("structure")) return 2;
  return 0;
}

function toTitleCase(value?: string) {
  if (!value) return undefined;
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function firstMatchingDocumentType(types: string[], patterns: string[]) {
  return (
    types.find((type) =>
      patterns.some((pattern) => type.toLowerCase().includes(pattern)),
    ) || undefined
  );
}

function formatPercentCost(amount?: number, pct?: number) {
  if (typeof amount === "number" && amount > 0 && typeof pct === "number") {
    return `${formatCurrency(amount)} (${pct}%)`;
  }
  if (typeof amount === "number" && amount > 0) {
    return formatCurrency(amount);
  }
  return undefined;
}

function formatCurrency(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Not available";
  }
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(1)}M`;
  }
  return `₦${Math.round(value).toLocaleString()}`;
}

function LegalSection({
  intelligenceData,
  sourceListing,
}: {
  intelligenceData?: PropertyIntelligenceData | null;
  sourceListing?: any;
}) {
  const documentVerification = sourceListing?.documentVerification;
  const aggregatedData = documentVerification?.aggregatedData;
  const documentAnalysis = sourceListing?.aiReport?.documentAnalysis || {};
  const documents = Array.isArray(sourceListing?.documents) ? sourceListing.documents : [];
  const declaredDocumentTypes = Array.isArray(sourceListing?.declaredDocumentTypes)
    ? sourceListing.declaredDocumentTypes
    : [];
  const documentTypes = [
    ...documents.map((doc: any) => doc.type),
    ...declaredDocumentTypes.map((doc: any) => doc.type),
    ...((documentVerification?.documentTypes as string[]) || []),
  ].filter(Boolean);
  const uniqueDocumentTypes = Array.from(new Set(documentTypes));
  const titleType =
    aggregatedData?.titleTypeValue ||
    documentAnalysis?.titleType ||
    sourceListing?.titleVerification ||
    firstMatchingDocumentType(uniqueDocumentTypes, ["title", "c of o", "deed"]) ||
    "Not available";
  const verificationStatus =
    documentVerification?.verificationStatus ||
    sourceListing?.titleVerification ||
    "Not available";
  const confidence =
    typeof documentVerification?.overallConfidence !== "undefined"
      ? Number(documentVerification.overallConfidence)
      : undefined;
  const riskLevel = toTitleCase(documentVerification?.riskLevel);
  const recommendations = Array.isArray(documentVerification?.recommendations)
    ? documentVerification.recommendations
    : [];
  const flags = Array.isArray(documentVerification?.flagsAndWarnings)
    ? documentVerification.flagsAndWarnings
    : [];
  const legalCosts = [
    {
      label: "Governor's Consent",
      value:
        formatPercentCost(
          intelligenceData?.investment_analysis?.total_investment_breakdown?.governors_consent,
          intelligenceData?.investment_analysis?.total_investment_breakdown?.governors_consent_pct,
        ) || "Not available",
    },
    {
      label: "Survey Fees",
      value:
        formatPercentCost(
          intelligenceData?.investment_analysis?.total_investment_breakdown?.survey_fees,
          intelligenceData?.investment_analysis?.total_investment_breakdown?.survey_fees_pct,
        ) || "Not available",
    },
    {
      label: "Land Registration",
      value:
        formatCurrency(
          intelligenceData?.investment_analysis?.total_investment_breakdown?.land_registration,
        ),
    },
  ];
  const checklist = buildLegalChecklist({
    uniqueDocumentTypes,
    documentAnalysis,
    titleType,
    documentVerification,
    sourceListing,
  });

  return (
    <div className="space-y-6">
      {/* Document Health Score */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">Document Health Score</div>
            <div className="text-3xl font-bold">
              {riskLevel || toTitleCase(verificationStatus) || "Not available"}
            </div>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((s) => (
              <Star
                key={s}
                className={`w-8 h-8 ${
                  confidence && s <= Math.max(1, Math.round(confidence / 25))
                    ? "fill-white text-white"
                    : "text-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm opacity-90">
          {[
            confidence ? `${confidence.toFixed(0)}% confidence` : null,
            uniqueDocumentTypes.length > 0
              ? `${uniqueDocumentTypes.length} document type(s) identified`
              : null,
            documentVerification?.documentCount
              ? `${documentVerification.documentCount} document(s) processed`
              : null,
          ]
            .filter(Boolean)
            .join(" · ") || "No document verification data is available for this listing."}
        </p>
      </div>

      {/* Title Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Title document</h3>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{titleType}</div>
            <div className="text-sm text-gray-600 mt-1">
              {documentAnalysis?.registrationNumber
                ? `Registration No: ${documentAnalysis.registrationNumber}`
                : documentAnalysis?.surveyNumber
                  ? `Survey No: ${documentAnalysis.surveyNumber}`
                  : "Registration number not available"}
            </div>
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900 mb-1">Verification status</div>
              <p className="text-sm text-amber-700">
                {[
                  verificationStatus !== "Not available" ? verificationStatus : null,
                  documentAnalysis?.transferDate
                    ? `Transfer date: ${documentAnalysis.transferDate}`
                    : null,
                  documentAnalysis?.governorsConsent?.status
                    ? `Governor's Consent: ${documentAnalysis.governorsConsent.status}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "No title verification details are available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Checklist */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Your legal checklist</h3>
        <div className="space-y-3">
          {checklist.map((check) => (
            <div
              key={check.item}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {check.status === "provided" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {check.status === "verify" && <AlertCircle className="w-5 h-5 text-amber-600" />}
                {(check.status === "pending" || check.status === "recommended") && (
                  <Clock className="w-5 h-5 text-blue-600" />
                )}
                <span className="text-sm text-gray-900">{check.item}</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  check.color === "green"
                    ? "bg-green-100 text-green-700"
                    : check.color === "amber"
                      ? "bg-amber-100 text-amber-700"
                      : check.color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                }`}
              >
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Costs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Legal costs to expect</h3>
        <div className="space-y-3">
          {legalCosts.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-t border-gray-100 first:border-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Recommended next steps</h3>
        <div className="space-y-4">
          {(
            recommendations.length > 0
              ? recommendations.map((item: string) => ({
                  step: item,
                  detail: "From document verification recommendations",
                }))
              : flags.slice(0, 4).map((flag: any) => ({
                  step: flag.category || "Verification flag",
                  detail: flag.message,
                }))
          ).map(({ step, detail }, idx) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-inda-teal text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                {idx + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{step}</div>
                <div className="text-sm text-gray-600 mt-1">{detail}</div>
              </div>
            </div>
          ))}
          {recommendations.length === 0 && flags.length === 0 && (
            <div className="text-sm text-gray-600">
              No backend recommendations are available for this listing yet.
            </div>
          )}
        </div>
      </div>

      {/* Legal Partner CTA */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Need help with legal verification?</h3>
            <p className="text-sm text-gray-600 mb-3">
              We partner with trusted property lawyers for title search, document verification, and
              closing.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Connect with Legal Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeighborhoodSection({
  lifestyleTab,
  setLifestyleTab,
  lifestyleData,
  intelligenceData,
}: {
  lifestyleTab: LifestyleTab;
  setLifestyleTab: (t: LifestyleTab) => void;
  lifestyleData: Record<LifestyleTab, { name: string; category: string; distance: string; rating?: number }[]>;
  intelligenceData?: PropertyIntelligenceData | null;
}) {
  const tabs: { id: LifestyleTab; label: string; icon: React.ElementType }[] = [
    { id: "eat", label: "Eat & Shop", icon: Utensils },
    { id: "work", label: "Work & Learn", icon: Briefcase },
    { id: "relax", label: "Relax & Play", icon: Dumbbell },
  ];
  const coordinates = intelligenceData?.location_intelligence?.coordinates;
  const district = intelligenceData?.location_intelligence?.district;
  const infrastructureProjects = intelligenceData?.location_intelligence?.infrastructure_projects;
  const commuteHighlights = intelligenceData?.location_intelligence?.accessibility;

  return (
    <div className="space-y-6">
      {/* Lifestyle Map */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Interactive Lifestyle Map</h3>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setLifestyleTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  lifestyleTab === tab.id
                    ? "bg-inda-teal text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <TabIcon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Map placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center">
          <div className="text-center">
            <MapPinned className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {coordinates?.lat && coordinates?.lng
                ? `${coordinates.lat}, ${coordinates.lng}`
                : district || "Map coordinates not available"}
            </p>
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid md:grid-cols-2 gap-3">
          {(lifestyleData[lifestyleTab] || []).map((place) => (
            <div
              key={place.name}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">{place.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{place.category}</div>
                </div>
                {place.rating && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Star className="w-3 h-3 fill-current" />
                    {place.rating}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Navigation className="w-3 h-3" />
                {place.distance}
              </div>
            </div>
          ))}
          {lifestyleData[lifestyleTab].length === 0 && (
            <div className="text-sm text-gray-600 md:col-span-2">
              No nearby places were provided for this category.
            </div>
          )}
        </div>
      </div>

      {/* Community Vibe */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Community vibe & character</h3>
        <div className="space-y-4">
          {[
            {
              label: "District",
              value: district || "Not available",
            },
            {
              label: "Victoria Island commute",
              value:
                typeof commuteHighlights?.to_victoria_island_minutes === "number"
                  ? `${commuteHighlights.to_victoria_island_minutes} min`
                  : "Not available",
            },
            {
              label: "Airport commute",
              value:
                typeof commuteHighlights?.to_airport_minutes === "number"
                  ? `${commuteHighlights.to_airport_minutes} min`
                  : "Not available",
            },
            {
              label: "Marina commute",
              value:
                typeof commuteHighlights?.to_marina_minutes === "number"
                  ? `${commuteHighlights.to_marina_minutes} min`
                  : "Not available",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What Makes This Special */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4">What makes this neighborhood special</h3>
        <div className="space-y-4">
          {(infrastructureProjects && Object.keys(infrastructureProjects).length > 0
            ? Object.entries(infrastructureProjects).map(([title, project]) => ({
                emoji: "🏗️",
                color: "bg-indigo-600",
                title,
                desc: [
                  typeof project.distance_km === "number"
                    ? `${project.distance_km} km away`
                    : null,
                  project.expected_value_increase_pct
                    ? `Expected value impact: ${project.expected_value_increase_pct}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · "),
              }))
            : [
                {
                  emoji: "📍",
                  color: "bg-indigo-600",
                  title: "District",
                  desc: district || "Not available",
                },
                {
                  emoji: "🛣️",
                  color: "bg-purple-600",
                  title: "Accessibility",
                  desc:
                    typeof commuteHighlights?.to_third_mainland_bridge_minutes === "number"
                      ? `Third Mainland Bridge: ${commuteHighlights.to_third_mainland_bridge_minutes} min`
                      : "Not available",
                },
                {
                  emoji: "🏢",
                  color: "bg-green-600",
                  title: "Commercial Access",
                  desc:
                    typeof commuteHighlights?.to_lekki_ftz_minutes === "number"
                      ? `Lekki FTZ: ${commuteHighlights.to_lekki_ftz_minutes} min`
                      : "Not available",
                },
              ]).map(({ emoji, color, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-lg">{emoji}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{title}</div>
                <div className="text-sm text-gray-600 mt-1">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
