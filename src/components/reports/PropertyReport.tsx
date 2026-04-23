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
  TrendingDown,
  Key,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import Modal from "@/components/inc/Modal";

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
  isOffPlan?: boolean;
  offPlanData?: {
    indaVerifiedCompletion?: number;
    lastVerificationDate?: string;
    expectedHandoverDate?: string;
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
}: {
  property: PropertyReportData;
  onBack?: () => void;
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
      ? parseInt((property.price as string).replace(/[^\d]/g, "")) || 45000000
      : property.price || 45000000;

  const marketPrice = askingPrice * 0.97;
  const pricePerSqm = Math.round(askingPrice / 150);
  const legalFees = askingPrice * 0.05;
  const stampDuty = askingPrice * 0.015;
  const agencyFee = askingPrice * 0.05;
  const totalInvestment = askingPrice + legalFees + stampDuty + agencyFee;
  const annualRent = askingPrice * 0.078;
  const monthlyRent = annualRent / 12;
  const netYield = 6.5;

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

  const lifestyleData = {
    eat: [
      { name: "Yellow Chilli", category: "Upscale Restaurant", distance: "2km", rating: 4.5 },
      { name: "Sailors Lounge", category: "Bar & Grill", distance: "3.5km", rating: 4.3 },
      { name: "Hard Rock Cafe", category: "International Dining", distance: "5km", rating: 4.4 },
      { name: "Craft Gourmet", category: "Bakery & Cafe", distance: "2.8km", rating: 4.6 },
    ],
    work: [
      { name: "Workstation Lagos", category: "Co-working Space", distance: "3km", rating: 4.4 },
      { name: "Lagos Business School", category: "Education & Networking", distance: "8km", rating: 4.7 },
      { name: "Tech Hub Lekki", category: "Startup Community", distance: "4.5km", rating: 4.2 },
      { name: "Venia Business Hub", category: "Office & Meeting Rooms", distance: "3.2km", rating: 4.3 },
    ],
    relax: [
      { name: "Elegushi Beach", category: "Beach & Watersports", distance: "7km", rating: 4.1 },
      { name: "Silverbird Cinemas", category: "Movies & Entertainment", distance: "6km", rating: 4.3 },
      { name: "Genesis Gym & Spa", category: "Fitness & Wellness", distance: "1.5km", rating: 4.4 },
      { name: "Lekki Arts & Crafts", category: "Weekend Market", distance: "4km", rating: 4.2 },
    ],
  };

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
                <img
                  src={
                    property.image ||
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  }
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <TrendingDown className="w-4 h-4" />
                    Great Deal — 3% below market
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    23 views this week
                  </div>
                </div>
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
                        {property.bed ?? 3}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Bedrooms</div>
                    </div>
                  )}
                  {!isLand && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-gray-900">
                        <Bath className="w-5 h-5" />
                        {property.bath ?? 3}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                      {property.size || (isLand ? "Plot Size" : "150m²")}
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
        />
        <ActionModal
          isOpen={showMakeOffer}
          onClose={() => setShowMakeOffer(false)}
          title="Make an Offer"
          icon={<Target className="w-6 h-6 text-inda-teal" />}
        >
          <p className="text-sm text-gray-600 mb-4">
            Submit your offer for <span className="font-semibold">{property.name}</span>. An agent
            will contact you within 24 hours.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your offer amount (₦)"
              className="w-full px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
            />
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
            />
            <button className="w-full py-3 bg-inda-teal text-white rounded-lg font-semibold hover:bg-inda-teal/90 transition-colors">
              Submit Offer
            </button>
          </div>
        </ActionModal>
        <ActionModal
          isOpen={showSiteVisit}
          onClose={() => setShowSiteVisit(false)}
          title="Schedule a Visit"
          icon={<Calendar className="w-6 h-6 text-inda-teal" />}
        >
          <p className="text-sm text-gray-600 mb-4">
            Book a site visit for <span className="font-semibold">{property.name}</span> at{" "}
            {property.location}.
          </p>
          <div className="space-y-3">
            <input
              type="date"
              className="w-full px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
            />
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
            />
            <button className="w-full py-3 bg-inda-teal text-white rounded-lg font-semibold hover:bg-inda-teal/90 transition-colors">
              Confirm Visit
            </button>
          </div>
        </ActionModal>
        <ActionModal
          isOpen={showVirtualTour}
          onClose={() => setShowVirtualTour(false)}
          title="Virtual Tour"
          icon={<Eye className="w-6 h-6 text-inda-teal" />}
        >
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-inda-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-inda-teal" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Virtual Tour Coming Soon</h3>
            <p className="text-sm text-gray-600 mb-4">
              The seller is uploading a virtual tour for this property. We'll notify you when it's
              available.
            </p>
            <button className="px-6 py-2.5 bg-inda-teal text-white rounded-lg text-sm font-medium hover:bg-inda-teal/90 transition-colors">
              Notify Me
            </button>
          </div>
        </ActionModal>
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
          <OverviewSection property={property} isLand={isLand} isOffPlan={isOffPlan} />
        )}
        {selectedSection === "pricing" && (
          <PricingSection
            askingPrice={askingPrice}
            marketPrice={marketPrice}
            pricePerSqm={pricePerSqm}
            isLand={isLand}
            landSize={property.size}
          />
        )}
        {selectedSection === "location" && <LocationSection property={property} />}
        {selectedSection === "financials" && (
          <FinancialsSection
            totalInvestment={totalInvestment}
            askingPrice={askingPrice}
            legalFees={legalFees}
            stampDuty={stampDuty}
            agencyFee={agencyFee}
            annualRent={annualRent}
            monthlyRent={monthlyRent}
            netYield={netYield}
            roiYears={roiYears}
            setRoiYears={setRoiYears}
            isLand={isLand}
          />
        )}
        {selectedSection === "legal" && (
          <LegalSection property={property} askingPrice={askingPrice} />
        )}
        {selectedSection === "neighborhood" && (
          <NeighborhoodSection
            lifestyleTab={lifestyleTab}
            setLifestyleTab={setLifestyleTab}
            lifestyleData={lifestyleData}
          />
        )}
      </div>

      <AskAIModal
        isOpen={showAskAI}
        onClose={() => setShowAskAI(false)}
        propertyName={property.name}
      />
    </div>
  );
}

// ─── Inline Modal Wrappers ────────────────────────────────────────────────────

function ActionModal({
  isOpen,
  onClose,
  title,
  icon,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </Modal>
  );
}

function AskAIModal({
  isOpen,
  onClose,
  propertyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
}) {
  const [input, setInput] = useState("");
  const suggestions = [
    "What are the hidden costs?",
    "Is this a good investment?",
    "What's the neighborhood like?",
    "How does price compare to market?",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-inda-teal flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ask Inda AI</h2>
          <p className="text-xs text-gray-500">About: {propertyName}</p>
        </div>
      </div>

      <div className="bg-inda-teal/5 rounded-xl p-4 mb-4 text-sm text-gray-600">
        Hi! I'm Inda AI. I can answer any questions about this property — pricing, location,
        legal status, investment potential, and more.
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Suggested questions:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-inda-teal/10 hover:text-inda-teal text-xs text-gray-700 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this property..."
          className="flex-1 px-4 py-3 border border-inda-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
        />
        <button className="px-4 py-3 bg-inda-teal text-white rounded-lg text-sm font-medium hover:bg-inda-teal/90 transition-colors">
          Ask
        </button>
      </div>
    </Modal>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

function OverviewSection({
  property,
  isLand,
  isOffPlan,
}: {
  property: PropertyReportData;
  isLand: boolean;
  isOffPlan: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Hero Score Card — varies by type */}
      {!isLand && !isOffPlan && (
        <div className="bg-inda-teal rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Property Condition</div>
              <div className="text-3xl font-bold">Excellent</div>
            </div>
            <div className="text-5xl font-bold">
              8.5<span className="text-2xl">/10</span>
            </div>
          </div>
          <p className="text-sm opacity-90">
            Better condition than 73% of similar properties. Well-maintained with modern fixtures.
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
              <div className="text-3xl font-bold">{property.size || "Plot"}</div>
            </div>
            <div className="text-5xl">🌳</div>
          </div>
          <p className="text-sm opacity-90">
            Prime {property.size || ""} land plot ready for development. Clean title and
            infrastructure in place.
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
              <div className="text-sm text-gray-600 mt-1">{property.type || "Residential Property"}</div>
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
                  {property.bed ?? 3} bedrooms · {property.bath ?? 3} bathrooms
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
                  ? "Ready for development immediately"
                  : "Ready for immediate occupancy"}
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
            ? (property.amenities || [
                "🌟 Premium Location",
                "🛣️ Dual Road Access",
                "🔒 Gated Estate",
                "⚡ Electricity Available",
                "💧 Drainage System",
                "🚧 Tarred Roads",
              ]).map((feature) => (
                <div
                  key={feature}
                  className="px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                >
                  {feature}
                </div>
              ))
            : (property.amenities
                ? property.amenities.slice(0, 6).map((f) => `✅ ${f}`)
                : [
                    "🌟 Premium Location",
                    "🏊 Swimming Pool",
                    "🔒 24/7 Security",
                    "⚡ Backup Generator",
                    "💧 Borehole Water",
                    "🚗 Dedicated Parking",
                  ]
              ).map((feature) => (
                <div
                  key={feature}
                  className="px-3 py-2 bg-inda-teal/10 text-inda-teal rounded-full text-sm font-medium"
                >
                  {feature}
                </div>
              ))}
        </div>
      </div>

      {/* Amenities (buildings) / Infrastructure (land) */}
      {!isLand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">
            {isOffPlan ? "Planned amenities" : "Estate amenities included"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(
              property.amenities || [
                "Swimming Pool",
                "24/7 Security",
                "Gym & Fitness Center",
                "Children's Playground",
                "Backup Generator",
                "Borehole Water",
                "Estate Management",
                "Visitor Parking",
              ]
            ).map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">Available infrastructure</h3>
          <div className="grid grid-cols-2 gap-3">
            {(
              property.amenities || [
                "Tarred Road Access",
                "Electricity Connection",
                "Drainage System",
                "Street Lights",
                "Security Gate",
                "Perimeter Fencing",
                "Water Supply Ready",
                "Telecommunication Lines",
              ]
            ).map((infra) => (
              <div key={infra} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{infra}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition Details — completed buildings only */}
      {!isLand && !isOffPlan && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-4">Property condition details</h3>
          <div className="space-y-3">
            {[
              { label: "Structure", rating: "Excellent", stars: 5 },
              { label: "Fixtures & Fittings", rating: "Modern", stars: 4 },
              { label: "Maintenance", rating: "Well-maintained", stars: 5 },
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
  marketPrice,
  pricePerSqm,
  isLand,
  landSize,
}: {
  askingPrice: number;
  marketPrice: number;
  pricePerSqm: number;
  isLand: boolean;
  landSize?: string;
}) {
  return (
    <div className="space-y-6">
      {/* Deal / Land Value Score */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">{isLand ? "Land Value Score" : "Deal Score"}</div>
            <div className="text-3xl font-bold">Great Deal!</div>
          </div>
          <div className="text-5xl font-bold">8.5</div>
        </div>
        <p className="text-sm opacity-90">
          {isLand
            ? `This land is priced at ₦${(pricePerSqm / 1000).toFixed(0)}K per sqm, which is 3% below market average. Excellent value for this prime location.`
            : "This property is priced 3% below market average. Better than 73% of similar properties."}
        </p>
      </div>

      {/* Price Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">
          {isLand ? "Price breakdown" : "How does this compare?"}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Asking Price</span>
            <span className="text-lg font-semibold text-gray-900">
              ₦{(askingPrice / 1000000).toFixed(1)}M
            </span>
          </div>
          {isLand ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plot Size</span>
                <span className="text-lg font-semibold text-gray-900">{landSize || "—"}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-900">Price per sqm</span>
                <span className="text-lg font-bold text-inda-teal">
                  ₦{(pricePerSqm / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Market avg (per sqm)</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₦{((pricePerSqm * 1.03) / 1000).toFixed(0)}K
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Market Average</span>
              <span className="text-lg font-semibold text-gray-900">
                ₦{(marketPrice / 1000000).toFixed(1)}M
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-green-600 font-medium">You Save</span>
            <span className="text-lg font-bold text-green-600">
              ₦{((marketPrice - askingPrice) / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>

      {/* Price per sqm — shown for all but more prominent for buildings */}
      {!isLand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
          <h3 className="font-semibold text-gray-900 mb-2">Price per sqm</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ₦{pricePerSqm.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">per square metre — in line with area average</p>
        </div>
      )}

      {/* Similar Properties */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">
          {isLand ? "Similar land plots nearby" : "Similar properties nearby"}
        </h3>
        <div className="space-y-3">
          {isLand
            ? [
                { address: "Plot 12, Same Estate", price: 92000000, size: "580 sqm", pricePerSqm: 159 },
                { address: "Adjacent Development", price: 98000000, size: "610 sqm", pricePerSqm: 161 },
                { address: "500m Away", price: 88000000, size: "550 sqm", pricePerSqm: 160 },
              ].map((comp) => (
                <div
                  key={comp.address}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{comp.address}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {comp.size} · ₦{comp.pricePerSqm}K/sqm
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₦{(comp.price / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))
            : [
                { address: "Block 4, Same Estate", price: 43000000, beds: 3 },
                { address: "Adjacent Estate", price: 46500000, beds: 3 },
                { address: "2km Away", price: 42000000, beds: 3 },
              ].map((comp) => (
                <div
                  key={comp.address}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{comp.address}</div>
                    <div className="text-xs text-gray-600 mt-1">{comp.beds} bed apartment</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₦{(comp.price / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))}
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
  annualRent,
  monthlyRent,
  netYield,
  roiYears,
  setRoiYears,
  isLand,
}: {
  totalInvestment: number;
  askingPrice: number;
  legalFees: number;
  stampDuty: number;
  agencyFee: number;
  annualRent: number;
  monthlyRent: number;
  netYield: number;
  roiYears: number;
  setRoiYears: (v: number) => void;
  isLand: boolean;
}) {
  const landAppreciationRate = 0.12;
  const projectedValue = isLand
    ? askingPrice * Math.pow(1 + landAppreciationRate, roiYears)
    : askingPrice * Math.pow(1.09, roiYears);
  const totalGain = projectedValue - totalInvestment;
  const totalRentalIncome = isLand ? 0 : annualRent * roiYears;
  const totalReturn = totalGain + totalRentalIncome;
  const roiPercentage = (totalReturn / totalInvestment) * 100;

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
            { label: "Purchase price", value: askingPrice },
            { label: "Legal fees (5%)", value: legalFees },
            { label: "Stamp duty (1.5%)", value: stampDuty },
            { label: "Agency fee (5%)", value: agencyFee },
          ].map(({ label, value }) => (
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
              ₦{(totalInvestment / 1000000).toFixed(1)}M
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
                ₦{(annualRent / 1000000).toFixed(1)}M / year
              </div>
              <div className="text-sm text-gray-600 mt-1">
                (₦{Math.round(monthlyRent / 1000)}K per month)
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-1">Annual return</div>
              <div className="text-2xl font-bold text-green-600">{netYield}%</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">📊 Based on similar properties in this area</p>
          </div>
        </div>
      )}

      {/* Land Investment Returns — land only */}
      {isLand && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Land Investment Returns</h3>
          <p className="text-sm text-gray-700 mb-3">
            Land generates returns through appreciation, not rental income. Based on historical
            trends in this area:
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Annual appreciation (historical)</span>
              <span className="text-sm font-bold text-green-600">12–15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">5-year projected value</span>
              <span className="text-sm font-bold text-gray-900">
                ₦{((askingPrice * Math.pow(1.12, 5)) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-amber-200">
              <span className="text-sm font-medium text-gray-900">Potential profit (5 years)</span>
              <span className="text-lg font-bold text-green-600">
                ₦{(((askingPrice * Math.pow(1.12, 5)) - askingPrice) / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocationSection({ property }: { property: PropertyReportData }) {
  return (
    <div className="space-y-6">
      {/* Address */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Address</h3>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-inda-teal flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900">{property.location}</div>
            <div className="text-sm text-gray-600 mt-1">Lagos, Nigeria</div>
          </div>
        </div>
      </div>

      {/* Commute Times */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Your daily commute</h3>
        <div className="space-y-3">
          {[
            { destination: "Victoria Island", time: "25–40 min", icon: "💼", type: "Business District" },
            { destination: "Lekki Phase 1", time: "10 min", icon: "🏢", type: "Commercial Hub" },
            { destination: "Ajah", time: "15 min", icon: "🏪", type: "Shopping & Business" },
            { destination: "Murtala Muhammed Airport", time: "45 min", icon: "✈️", type: "International Airport" },
          ].map((route) => (
            <div
              key={route.destination}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl">{route.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{route.destination}</div>
                <div className="text-xs text-gray-600 mt-0.5">{route.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">{route.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-800">
            ⏱️ Times vary with Lagos traffic — allow extra time during peak hours (7–9am, 5–8pm)
          </p>
        </div>
      </div>

      {/* Essential Services */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Essential services nearby</h3>
        <div className="space-y-4">
          {[
            {
              icon: <ShoppingBag className="w-4 h-4 text-blue-600" />,
              label: "Groceries & Supermarkets",
              value: "Shoprite (3km) · The Place Mall (4km) · Lekki Market (2.5km)",
            },
            {
              icon: <GraduationCap className="w-4 h-4 text-purple-600" />,
              label: "Schools",
              value: "Greensprings School (1.2km) · Corona School (2.5km) · Lagoon School (3km)",
            },
            {
              icon: (
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              ),
              label: "Healthcare & Pharmacies",
              value: "Reddington Hospital (4km) · MediPlus Pharmacy (1.8km) · Lekki Clinic (2.2km)",
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="pt-2 first:pt-0 border-t border-gray-100 first:border-0">
              <div className="flex items-center gap-2 mb-2">
                {icon}
                <div className="text-sm font-medium text-gray-900">{label}</div>
              </div>
              <div className="text-sm text-gray-600 pl-6">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Walkability */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Walkability & Access</h3>
        <div className="space-y-4">
          {[
            { label: "Walk Score", score: 65, color: "bg-amber-500", note: "Some errands on foot" },
            { label: "Transit Score", score: 55, color: "bg-blue-500", note: "Some public transport options" },
          ].map(({ label, score, color, note }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-2xl font-bold text-gray-900">
                  {score}<span className="text-sm text-gray-500">/100</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalSection({
  property,
  askingPrice,
}: {
  property: PropertyReportData;
  askingPrice: number;
}) {
  const governorsConsent = askingPrice * 0.03;

  return (
    <div className="space-y-6">
      {/* Document Health Score */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">Document Health Score</div>
            <div className="text-3xl font-bold">Good Standing</div>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((s) => (
              <Star key={s} className="w-8 h-8 fill-white text-white" />
            ))}
            <Star className="w-8 h-8 text-white/30" />
          </div>
        </div>
        <p className="text-sm opacity-90">
          Basic documentation is in order. Independent verification recommended before purchase.
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
            <div className="font-medium text-gray-900">Certificate of Occupancy (C of O)</div>
            <div className="text-sm text-gray-600 mt-1">Government-issued title document</div>
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900 mb-1">Verify before purchase</div>
              <p className="text-sm text-amber-700">
                We recommend independent title verification with a property lawyer. Cost: ₦75K–₦150K.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Checklist */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Your legal checklist</h3>
        <div className="space-y-3">
          {[
            { item: "Title Document (C of O)", status: "provided", color: "green" },
            { item: "Survey Plan", status: "provided", color: "green" },
            { item: "Building Approval", status: "verify", color: "amber" },
            { item: "Tax Receipts (3 years)", status: "verify", color: "amber" },
            { item: "Title Search at Registry", status: "pending", color: "blue" },
            { item: "Independent Inspection", status: "recommended", color: "purple" },
          ].map((check) => (
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
          {[
            { label: "Governor's Consent (3%)", value: `₦${(governorsConsent / 1000000).toFixed(2)}M` },
            { label: "Title Verification", value: "₦75K – ₦150K" },
            { label: "Legal Representation", value: "₦500K – ₦1M" },
            { label: "Survey Plan Confirmation", value: "₦150K – ₦250K" },
          ].map(({ label, value }) => (
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
          {[
            { step: "Hire a property lawyer", detail: "To verify documents and handle paperwork (₦500K–₦1M)" },
            { step: "Conduct title search", detail: "Verify ownership at Lagos State Land Registry (₦75K–₦150K)" },
            { step: "Professional inspection", detail: "Check structural integrity and systems (₦50K–₦100K)" },
            { step: "Review all documents", detail: "C of O, survey plan, tax receipts, building approval, etc." },
          ].map(({ step, detail }, idx) => (
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
}: {
  lifestyleTab: LifestyleTab;
  setLifestyleTab: (t: LifestyleTab) => void;
  lifestyleData: Record<LifestyleTab, { name: string; category: string; distance: string; rating?: number }[]>;
}) {
  const tabs: { id: LifestyleTab; label: string; icon: React.ElementType }[] = [
    { id: "eat", label: "Eat & Shop", icon: Utensils },
    { id: "work", label: "Work & Learn", icon: Briefcase },
    { id: "relax", label: "Relax & Play", icon: Dumbbell },
  ];

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
            <p className="text-sm text-gray-500">Interactive map coming soon</p>
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid md:grid-cols-2 gap-3">
          {lifestyleData[lifestyleTab].map((place) => (
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
        </div>
      </div>

      {/* Community Vibe */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-inda-gray">
        <h3 className="font-semibold text-gray-900 mb-4">Community vibe & character</h3>
        <div className="space-y-4">
          {[
            { label: "Family-Friendly", score: 8, color: "bg-green-500", desc: "Great for raising kids" },
            { label: "Safety & Security", score: 9, color: "bg-blue-500", desc: "Well-secured estate" },
            { label: "Social Scene", score: 6, color: "bg-purple-500", desc: "Moderate nightlife" },
            { label: "Expat Community", score: 7, color: "bg-inda-teal", desc: "Diverse residents" },
          ].map((vibe) => (
            <div key={vibe.label}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-gray-900">{vibe.label}</span>
                  <span className="text-xs text-gray-500 ml-2">· {vibe.desc}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{vibe.score}/10</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${vibe.color} rounded-full transition-all`}
                  style={{ width: `${vibe.score * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Makes This Special */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4">What makes this neighborhood special</h3>
        <div className="space-y-4">
          {[
            {
              emoji: "🌊",
              color: "bg-indigo-600",
              title: "Waterfront Living",
              desc: "Minutes from Elegushi Beach and Atlantic Ocean views. Weekend beach culture is strong here.",
            },
            {
              emoji: "🍽️",
              color: "bg-purple-600",
              title: "Culinary Hub",
              desc: "Diverse dining scene — from street food to upscale restaurants. Yellow Chilli, The Place, and local spots.",
            },
            {
              emoji: "👨‍👩‍👧",
              color: "bg-green-600",
              title: "Young Professional Vibe",
              desc: "Popular with Lagos professionals aged 28–45. Active community events, fitness groups, and networking.",
            },
          ].map(({ emoji, color, title, desc }) => (
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
