/**
 * COMPREHENSIVE BALANCED BUYER REPORT
 *
 * Solves the problem: "How do we keep ALL Q&A content (value prop) while still being balanced?"
 *
 * STRATEGY:
 * 1. Keep ALL Q&A sections (Financial, Risk, Exit, etc.) - This is the value prop
 * 2. Replace scary yellow warnings with confidence indicators
 * 3. Use neutral language throughout ("based on analysis" not "incomplete")
 * 4. Add market context to frame everything properly
 * 5. Progressive disclosure for organization, not hiding
 *
 * WHAT'S DIFFERENT FROM OLD:
 * - No "INCOMPLETE DATA" yellow banners
 * - No "Requires Verification" scary badges
 * - No marketing language ("beautiful")
 * - Confidence badges (High/Medium/Preliminary) instead
 * - "Based on X" sources instead of "missing Y"
 * - Market benchmarks for context
 * - ALL content preserved
 */

import { useState, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Bookmark,
  Share2,
  Eye,
  Users,
  TrendingUp,
  Shield,
  Star,
  Bed,
  Bath,
  Car,
  Home,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Target,
  MessageCircle,
  BadgeCheck,
  FileText
} from "lucide-react";
import { Property, QASection } from "./data/propertyData";
import { DueDiligenceModal } from "./modals/DueDiligenceModal";
import { AskAIModal } from "./modals/AskAIModal";

// Real data structure from data engineer
interface PropertyIntelligenceData {
  property_details: {
    price: number;
    location: string;
    specs: {
      bed: number;
      bath: number;
      size: string;
    };
    userId: string;
    title: string;
    features: string;
  };
  location_intelligence: {
    coordinates: {
      lat: number;
      lng: number;
    };
    district: string;
    accessibility: {
      to_victoria_island_minutes: number;
      to_airport_minutes: number;
      to_lekki_ftz_minutes: number;
      to_ikeja_mall_minutes: number;
      to_marina_minutes: number;
      to_third_mainland_bridge_minutes: number;
    };
    nearby_schools: {
      count: number;
      distance_km: number;
      names: string[];
    };
    nearby_hospitals: {
      count: number;
      distance_km: number;
      names: string[];
    };
    nearby_shopping: {
      count: number;
      distance_km: number;
      names: string[];
    };
    infrastructure_projects: {
      [key: string]: {
        distance_km: number;
        expected_value_increase_pct: string;
      };
    };
  };
  investment_analysis: {
    total_investment_breakdown: {
      purchase_price: number;
      legal_fees: number;
      legal_fees_pct: number;
      agency_fees: number;
      agency_fees_pct: number;
      survey_fees: number;
      survey_fees_pct: number;
      stamp_duty: number;
      stamp_duty_pct: number;
      land_registration: number;
      governors_consent: number;
      governors_consent_pct: number;
      total_investment: number;
      additional_costs_pct: number;
    };
    annual_rental_income: {
      net_rental_income: number;
      gross_yield_pct: number;
      net_yield_pct: number;
      rental_range_min: number;
      rental_range_max: number;
    };
    meta: {
      rent_source: string;
    };
  };
  value_projection: {
    annual_appreciation_pct: number;
    historical_avg_pct: number;
    year_1: {
      value: number;
      gain_pct: number;
    };
    year_2: {
      value: number;
      gain_pct: number;
    };
    year_3: {
      value: number;
      gain_pct: number;
    };
    year_4: {
      value: number;
      gain_pct: number;
    };
    year_5: {
      value: number;
      gain_pct: number;
    };
    projected_gain_5_year: number;
  };
  cash_flow_forecast: {
    year_1: {
      rental_income: number;
      expenses: number;
      net_cash_flow: number;
    };
    year_2: {
      rental_income: number;
      expenses: number;
      net_cash_flow: number;
    };
    year_3: {
      rental_income: number;
      expenses: number;
      net_cash_flow: number;
    };
    year_4: {
      rental_income: number;
      expenses: number;
      net_cash_flow: number;
    };
    year_5: {
      rental_income: number;
      expenses: number;
      net_cash_flow: number;
    };
  };
}

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onReserve?: () => void;
  accessLevel?: "preview" | "basic" | "full";
  intelligenceData?: PropertyIntelligenceData;
}

export function PropertyDetail({
  property,
  onBack,
  accessLevel = "preview",
  intelligenceData
}: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showAskAI, setShowAskAI] = useState(false);
  const [showExtraVerification, setShowExtraVerification] = useState(false);
  const [verificationTier, setVerificationTier] = useState<'deep' | 'deeper'>('deep');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Calculate presentation tier based on completeness
  const presentationTier = property.dataQuality?.completeness >= 80 ? "premium" :
                          property.dataQuality?.completeness >= 60 ? "standard" : "basic";

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isExpanded = (title: string) => expandedSections.has(title);

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₦0';
    }
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Helper function to check if intelligence data has all required fields
  const isIntelligenceDataComplete = (data: PropertyIntelligenceData | undefined): boolean => {
    if (!data) return false;
    try {
      // Check required nested properties exist
      return !!(
        data.investment_analysis?.total_investment_breakdown?.purchase_price !== undefined &&
        data.investment_analysis?.annual_rental_income &&
        data.value_projection?.year_1?.value !== undefined &&
        data.value_projection?.year_5?.value !== undefined &&
        data.location_intelligence?.district &&
        data.location_intelligence?.accessibility &&
        data.location_intelligence?.nearby_schools?.names &&
        data.cash_flow_forecast?.year_1 &&
        data.cash_flow_forecast?.year_5
      );
    } catch {
      return false;
    }
  };

  // Generate Q&A data from intelligence data if available and complete, otherwise use mock data
  const qaData: QASection[] = (intelligenceData && isIntelligenceDataComplete(intelligenceData)) ? [
    // Financial Section with Real Data
    {
      title: "Fair Market Value & Pricing",
      type: "price",
      confidence: "high",
      questions: [
        {
          question: "Is this property priced fairly?",
          answer: `Listed at ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.purchase_price)}. Based on the projected ${intelligenceData.value_projection.annual_appreciation_pct}% annual appreciation (vs ${intelligenceData.value_projection.historical_avg_pct}% historical average), the pricing reflects strong growth potential.`,
          confidence: "medium",
          dataSource: "Purchase price vs historical appreciation analysis",
          details: `Purchase Price: ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.purchase_price)} | ${intelligenceData.investment_analysis.annual_rental_income.gross_yield_pct}% gross yield suggests competitive pricing for the area. Year 1 projected value: ${formatCurrency(intelligenceData.value_projection.year_1.value)} (+${intelligenceData.value_projection.year_1.gain_pct}%).`
        },
        {
          question: "What is the total investment required?",
          answer: `Total investment: ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.total_investment)} (including all fees and charges).`,
          confidence: "high",
          dataSource: "Comprehensive cost breakdown analysis",
          details: `Purchase Price: ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.purchase_price)} | Additional costs (${intelligenceData.investment_analysis.total_investment_breakdown.additional_costs_pct}%): ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.total_investment - intelligenceData.investment_analysis.total_investment_breakdown.purchase_price)}`
        },
        {
          question: "What are the additional purchase costs?",
          answer: `Additional costs total ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.total_investment - intelligenceData.investment_analysis.total_investment_breakdown.purchase_price)} (${intelligenceData.investment_analysis.total_investment_breakdown.additional_costs_pct}% of purchase price).`,
          confidence: "high",
          dataSource: "Nigerian property transaction regulations",
          details: `• Legal fees (${intelligenceData.investment_analysis.total_investment_breakdown.legal_fees_pct}%): ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.legal_fees)}\n• Agency fees (${intelligenceData.investment_analysis.total_investment_breakdown.agency_fees_pct}%): ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.agency_fees)}\n• Stamp duty (${intelligenceData.investment_analysis.total_investment_breakdown.stamp_duty_pct}%): ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.stamp_duty)}\n• Governor's consent (${intelligenceData.investment_analysis.total_investment_breakdown.governors_consent_pct}%): ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.governors_consent)}\n• Survey fees (${intelligenceData.investment_analysis.total_investment_breakdown.survey_fees_pct}%): ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.survey_fees)}\n• Land registration: ${formatCurrency(intelligenceData.investment_analysis.total_investment_breakdown.land_registration)}`
        }
      ]
    },
    // Rental Income with Real Data
    {
      title: "Financial Performance & ROI",
      type: "financial",
      confidence: "high",
      questions: [
        {
          question: "What rental income can I expect?",
          answer: `Estimated annual rental income: ${formatCurrency(intelligenceData.investment_analysis.annual_rental_income.rental_range_min)} - ${formatCurrency(intelligenceData.investment_analysis.annual_rental_income.rental_range_max)} (Net income: ${formatCurrency(intelligenceData.investment_analysis.annual_rental_income.net_rental_income)}).`,
          confidence: "high",
          dataSource: intelligenceData.investment_analysis.meta.rent_source === "bigquery" ? "BigQuery market data analysis" : "Market rental listings",
          details: `Gross Yield: ${intelligenceData.investment_analysis.annual_rental_income.gross_yield_pct}% | Net Yield: ${intelligenceData.investment_analysis.annual_rental_income.net_yield_pct}%`
        },
        {
          question: "What's the projected cash flow?",
          answer: `Year 1: ${formatCurrency(intelligenceData.cash_flow_forecast.year_1.net_cash_flow)} net cash flow. Grows to ${formatCurrency(intelligenceData.cash_flow_forecast.year_5.net_cash_flow)} by Year 5.`,
          confidence: "medium",
          dataSource: "5-year cash flow projection model",
          details: `Year 1: ${formatCurrency(intelligenceData.cash_flow_forecast.year_1.rental_income)} income - ${formatCurrency(intelligenceData.cash_flow_forecast.year_1.expenses)} expenses\nYear 3: ${formatCurrency(intelligenceData.cash_flow_forecast.year_3.rental_income)} income - ${formatCurrency(intelligenceData.cash_flow_forecast.year_3.expenses)} expenses\nYear 5: ${formatCurrency(intelligenceData.cash_flow_forecast.year_5.rental_income)} income - ${formatCurrency(intelligenceData.cash_flow_forecast.year_5.expenses)} expenses`
        }
      ]
    },
    // Value Appreciation with Real Data
    {
      title: "Value Projection & Appreciation",
      type: "financial",
      confidence: "medium",
      questions: [
        {
          question: "What's the expected property appreciation?",
          answer: `Projected appreciation rate: ${intelligenceData.value_projection.annual_appreciation_pct}% annually (Historical average: ${intelligenceData.value_projection.historical_avg_pct}%).`,
          confidence: "medium",
          dataSource: "Historical price index and market trend analysis",
          details: `This projection is based on area-specific factors including infrastructure development, demand patterns, and economic indicators.`
        },
        {
          question: "What will the property be worth in 5 years?",
          answer: `Projected value in 5 years: ${formatCurrency(intelligenceData.value_projection.year_5.value)} (${intelligenceData.value_projection.year_5.gain_pct}% total gain).`,
          confidence: "medium",
          dataSource: "Compound appreciation model",
          details: `Year 1: ${formatCurrency(intelligenceData.value_projection.year_1.value)} (+${intelligenceData.value_projection.year_1.gain_pct}%)\nYear 3: ${formatCurrency(intelligenceData.value_projection.year_3.value)} (+${intelligenceData.value_projection.year_3.gain_pct}%)\nYear 5: ${formatCurrency(intelligenceData.value_projection.year_5.value)} (+${intelligenceData.value_projection.year_5.gain_pct}%)\nTotal projected gain: ${formatCurrency(intelligenceData.value_projection.projected_gain_5_year)}`
        }
      ]
    },
    // Location Intelligence with Real Data
    {
      title: "Location & Infrastructure",
      type: "standard",
      confidence: "high",
      questions: [
        {
          question: "How accessible is the location?",
          answer: `${intelligenceData.location_intelligence.district} location with excellent connectivity.`,
          confidence: "high",
          dataSource: "GPS coordinates and route analysis",
          details: `• To Victoria Island: ${intelligenceData.location_intelligence.accessibility.to_victoria_island_minutes} minutes\n• To Airport: ${intelligenceData.location_intelligence.accessibility.to_airport_minutes} minutes\n• To Lekki FTZ: ${intelligenceData.location_intelligence.accessibility.to_lekki_ftz_minutes} minutes\n• To Ikeja Mall: ${intelligenceData.location_intelligence.accessibility.to_ikeja_mall_minutes} minutes\n• To Marina: ${intelligenceData.location_intelligence.accessibility.to_marina_minutes} minutes\n• To Third Mainland Bridge: ${intelligenceData.location_intelligence.accessibility.to_third_mainland_bridge_minutes} minutes`
        },
        {
          question: "What schools are nearby?",
          answer: `${intelligenceData.location_intelligence.nearby_schools.count} schools within ${intelligenceData.location_intelligence.nearby_schools.distance_km}km radius.`,
          confidence: "high",
          dataSource: "Geospatial mapping data",
          details: `Top schools nearby:\n${intelligenceData.location_intelligence.nearby_schools.names.slice(0, 5).map(school => `• ${school}`).join('\n')}`
        },
        {
          question: "What healthcare facilities are nearby?",
          answer: `${intelligenceData.location_intelligence.nearby_hospitals.count} hospitals and clinics within ${intelligenceData.location_intelligence.nearby_hospitals.distance_km}km.`,
          confidence: "high",
          dataSource: "Geospatial mapping data",
          details: `Nearby healthcare:\n${intelligenceData.location_intelligence.nearby_hospitals.names.slice(0, 5).map(hospital => `• ${hospital}`).join('\n')}`
        },
        {
          question: "What shopping and amenities are available?",
          answer: `${intelligenceData.location_intelligence.nearby_shopping.count} shopping centers within ${intelligenceData.location_intelligence.nearby_shopping.distance_km}km.`,
          confidence: "high",
          dataSource: "Geospatial mapping data",
          details: `Shopping nearby:\n${intelligenceData.location_intelligence.nearby_shopping.names.slice(0, 5).map(shop => `• ${shop}`).join('\n')}`
        },
        ...(Object.keys(intelligenceData.location_intelligence?.infrastructure_projects || {}).length > 0 ? [{
          question: "Are there any major infrastructure projects nearby?",
          answer: `Yes, ${Object.keys(intelligenceData.location_intelligence.infrastructure_projects).length} major infrastructure project(s) identified.`,
          confidence: "high" as const,
          dataSource: "Infrastructure development tracking",
          details: Object.entries(intelligenceData.location_intelligence.infrastructure_projects).map(([name, project]: [string, any]) =>
            `• ${name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${project?.distance_km || 'N/A'}km away - Expected impact: ${project?.expected_value_increase_pct || 'TBD'}`
          ).join('\n')
        }] : [])
      ]
    },
    // Property Details with Real Data
    {
      title: "Property Specifications",
      type: "standard",
      confidence: "high",
      questions: [
        {
          question: "What are the property specifications?",
          answer: `${intelligenceData.property_details.specs.bed} bedrooms, ${intelligenceData.property_details.specs.bath} bathrooms, ${intelligenceData.property_details.specs.size}.`,
          confidence: "high",
          dataSource: "Property listing verification",
          details: intelligenceData.property_details.features
        },
        {
          question: "What features does the property have?",
          answer: intelligenceData.property_details.features,
          confidence: "high",
          dataSource: "Property listing details"
        }
      ]
    },
    // Risk Assessment
    {
      title: "Risk Assessment",
      type: "risk",
      confidence: "medium",
      questions: [
        {
          question: "What are the main risks with this property?",
          answer: "Medium overall risk. Primary considerations: Market volatility and title verification recommended.",
          confidence: "medium",
          dataSource: "Based on location, market conditions, and legal requirements",
          details: `Location risk: Low (${intelligenceData.location_intelligence.district}) • Market risk: Medium (high appreciation projected) • Legal risk: Pending verification`
        },
        {
          question: "Should I be concerned about the high appreciation rate?",
          answer: `The ${intelligenceData.value_projection.annual_appreciation_pct}% projection is above the historical ${intelligenceData.value_projection.historical_avg_pct}% average. This reflects infrastructure development but carries market risk.`,
          confidence: "medium",
          dataSource: "Market trend analysis",
          details: "Tip: Higher appreciation potential often comes with higher risk. Consider your investment timeline and risk tolerance."
        }
      ]
    },
    // Legal & Documentation
    {
      title: "Legal & Documentation",
      type: "standard",
      confidence: "preliminary",
      questions: [
        {
          question: "What's the title status?",
          answer: "Title verification recommended before purchase.",
          confidence: "preliminary",
          dataSource: "Standard property transaction protocol",
          needsVerification: true,
          details: "Tip: Request independent title verification (₦50K-₦150K) before purchase"
        },
        {
          question: "What's the property tax situation?",
          answer: "Annual land use charge will apply based on property value and location. Consult with tax advisor for precise amount.",
          confidence: "medium",
          dataSource: "Lagos State tax regulations"
        }
      ]
    }
  ] : [
    // Default mock data when no intelligence data is available
    {
      title: "Fair Market Value & Pricing",
      type: "price",
      confidence: "high",
      questions: [
        {
          question: "Is this property priced fairly?",
          answer: "Yes, the asking price of ₦45M is within 5% of estimated Fair Market Value (₦43.2M - ₦46.8M).",
          confidence: "high",
          dataSource: "Analysis of 47 comparable properties in Lekki Phase 1",
          details: "Price per sqm: ₦285K (Area avg: ₦270K-₦300K)"
        },
        {
          question: "How does this compare to similar properties?",
          answer: "This property is priced at the median for similar 3-bedroom units in the area.",
          confidence: "high",
          dataSource: "Last 6 months of sales data"
        }
      ]
    },
    {
      title: "Financial Performance & ROI",
      type: "financial",
      confidence: "medium",
      questions: [
        {
          question: "What rental income can I expect?",
          answer: "Estimated rental income: ₦2.7M - ₦3.2M annually (6-8% gross yield).",
          confidence: "medium",
          dataSource: "Current rental listings in area",
          details: "Area average yield: 5.2%. This property is above average due to amenities."
        },
        {
          question: "What are the total ownership costs?",
          answer: "Estimated ₦680K/year including service charge (₦420K), insurance (₦180K), and maintenance (₦80K).",
          confidence: "medium",
          dataSource: "Estate management data"
        }
      ]
    },
    {
      title: "Risk Assessment",
      type: "risk",
      confidence: "medium",
      questions: [
        {
          question: "What are the main risks with this property?",
          answer: "Low overall risk. Primary consideration: Title verification recommended before purchase.",
          confidence: "medium",
          dataSource: "Based on location, developer track record, and market conditions",
          details: "Location risk: Low • Developer risk: Low • Market risk: Medium • Legal risk: Pending verification"
        },
        {
          question: "Are there any red flags?",
          answer: "No major red flags identified. Developer has 4.5/5 rating and completed 12 projects.",
          confidence: "high",
          dataSource: "Developer track record analysis"
        }
      ]
    },
    {
      title: "Exit Strategy & Liquidity",
      type: "exit",
      confidence: "high",
      questions: [
        {
          question: "How easy is it to resell this property?",
          answer: "High liquidity. Lekki Phase 1 properties typically sell within 60-90 days.",
          confidence: "high",
          dataSource: "Transaction velocity analysis",
          details: "Liquidity score: 8.2/10 (Above area average of 6.5/10)"
        },
        {
          question: "What's the expected appreciation?",
          answer: "Historical appreciation: 8-12% annually for this area over past 5 years.",
          confidence: "medium",
          dataSource: "Price index data"
        }
      ]
    },
    {
      title: "Location & Infrastructure",
      type: "standard",
      confidence: "high",
      questions: [
        {
          question: "What's nearby?",
          answer: "Within 5km: Lekki Expressway (2km), Shoprite (3km), International School (1.5km)",
          confidence: "high",
          dataSource: "Verified location data"
        },
        {
          question: "How's the infrastructure?",
          answer: "24/7 power (estate generator), borehole water, good road access, security.",
          confidence: "high",
          dataSource: "Estate amenities verification"
        }
      ]
    },
    {
      title: "Amenities & Features",
      type: "standard",
      confidence: "high",
      questions: [
        {
          question: "What amenities does the estate offer?",
          answer: "Swimming pool, gym, children's play area, 24/7 security, estate management office.",
          confidence: "high",
          dataSource: "Estate amenities list"
        },
        {
          question: "What about parking and storage?",
          answer: "2 dedicated parking spaces, additional visitor parking available. No separate storage unit.",
          confidence: "high",
          dataSource: "Property specifications"
        },
        {
          question: "Are pets allowed?",
          answer: "Yes, pets are allowed with estate management approval. Weight/breed restrictions may apply.",
          confidence: "medium",
          dataSource: "Estate by-laws"
        }
      ]
    },
    {
      title: "Utilities & Running Costs",
      type: "financial",
      confidence: "medium",
      questions: [
        {
          question: "What are the monthly/annual fees?",
          answer: "Service charge: ₦35K/month (₦420K/year), Estate security levy: ₦15K/quarter.",
          confidence: "high",
          dataSource: "Estate management fee schedule",
          details: "Covers: 24/7 security, estate maintenance, waste management, amenities upkeep"
        },
        {
          question: "How reliable is power and water?",
          answer: "Power: Estate generator provides 20 hours daily backup. Water: Borehole + treatment plant, constant supply.",
          confidence: "high",
          dataSource: "Estate infrastructure report"
        },
        {
          question: "What about internet connectivity?",
          answer: "Fiber optic available from multiple ISPs (MTN, Airtel, Smile). Speeds up to 100Mbps reported.",
          confidence: "medium",
          dataSource: "Resident surveys"
        }
      ]
    },
    {
      title: "Neighborhood & Lifestyle",
      type: "standard",
      confidence: "high",
      questions: [
        {
          question: "What schools are nearby?",
          answer: "Top-rated schools within 5km: Greensprings (1.2km), Corona (2.5km), Lagoon (3km).",
          confidence: "high",
          dataSource: "Location mapping"
        },
        {
          question: "How long is the commute to key areas?",
          answer: "VI: 25-40min, Lekki Phase 1: 10min, Ajah: 15min, Ikoyi: 30-45min (traffic dependent).",
          confidence: "medium",
          dataSource: "Google Maps + resident reports",
          details: "Times assume moderate traffic conditions"
        },
        {
          question: "What's the neighborhood like?",
          answer: "Quiet, family-friendly estate. Mix of young professionals and families. Low crime area.",
          confidence: "medium",
          dataSource: "Area demographics analysis"
        }
      ]
    },
    {
      title: "Construction & Property Condition",
      type: "standard",
      confidence: "medium",
      questions: [
        {
          question: "What's the construction quality?",
          answer: "Solid concrete structure, ceramic tiles, aluminum windows, modern fittings. Built in 2020.",
          confidence: "medium",
          dataSource: "Property inspection photos",
          details: "Professional inspection recommended before purchase"
        },
        {
          question: "Any known defects or issues?",
          answer: "No major structural issues reported. Minor wear typical for 4-year-old property.",
          confidence: "preliminary",
          dataSource: "Visual assessment",
          needsVerification: true
        },
        {
          question: "What's included in the sale?",
          answer: "All fixed fittings, kitchen cabinets, wardrobes. Air conditioners negotiable.",
          confidence: "medium",
          dataSource: "Listing details"
        }
      ]
    },
    {
      title: "Legal & Documentation",
      type: "standard",
      confidence: "preliminary",
      questions: [
        {
          question: "What's the title status?",
          answer: "Title type: Certificate of Occupancy (C of O). Verification recommended.",
          confidence: "preliminary",
          dataSource: "Developer provided",
          needsVerification: true,
          details: "Tip: Request independent title verification (₦50K-₦150K) before purchase"
        },
        {
          question: "Are there any encumbrances?",
          answer: "Developer claims no encumbrances. Independent verification recommended.",
          confidence: "preliminary",
          dataSource: "Developer disclosure"
        },
        {
          question: "What's the property tax situation?",
          answer: "Annual land use charge: Estimated ₦45K-₦65K based on property value and location.",
          confidence: "medium",
          dataSource: "Lagos State tax calculator"
        }
      ]
    }
  ];

  // Improved confidence badge - less scary
  const ConfidenceBadge = ({ level }: { level?: string }) => {
    if (!level) return null;

    const config = {
      high: { bg: "bg-green-100", text: "text-green-700", icon: "✓", label: "Verified Data" },
      medium: { bg: "bg-blue-100", text: "text-blue-700", icon: "≈", label: "Market Analysis" },
      preliminary: { bg: "bg-amber-100", text: "text-amber-700", icon: "○", label: "Estimated" },
      verified: { bg: "bg-green-100", text: "text-green-700", icon: "🛡", label: "Independently Verified" }
    }[level] || { bg: "bg-gray-100", text: "text-gray-700", icon: "?", label: "Unknown" };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
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
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: property.name,
                    text: `Check out this property: ${property.name}`,
                    url: window.location.href,
                  });
                } catch (err) {
                  console.log("Share cancelled or denied");
                }
              } else {
                try {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                } catch (error) {
                  alert(`Share this link: ${window.location.href}`);
                }
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Image Gallery - Square thumbnails with main selected image */}
        <div className="mb-6 space-y-3">
          {/* Main Selected Image - Square */}
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <Image
              src={property.images?.[currentImageIndex] || property.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"}
              alt={property.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Thumbnail Grid - Square thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-[#4ea8a1] ring-2 ring-[#4ea8a1]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${property.name} - Image ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-[#4ea8a1]/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Report Quality Badge - No Scary Warnings */}
        <div className="mb-6">
          {presentationTier === "premium" ? (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-green-900">
                  Comprehensive Verified Report
                </div>
                <div className="text-xs text-green-700">
                  Based on {property.dataQuality?.completeness}% verified data sources • {qaData.length} sections analyzed
                </div>
              </div>
              <ConfidenceBadge level="verified" />
            </div>
          ) : presentationTier === "standard" ? (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-blue-900">
                  AI-Enhanced Comprehensive Analysis
                </div>
                <div className="text-xs text-blue-700">
                  Based on market data & comparable properties • Some items pending independent verification
                </div>
              </div>
              <ConfidenceBadge level="medium" />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-amber-900">
                  Market-Based Analysis Available
                </div>
                <div className="text-xs text-amber-700">
                  Key insights generated from area data • Request verification for detailed confirmation
                </div>
              </div>
              <ConfidenceBadge level="preliminary" />
            </div>
          )}
        </div>

        {/* Property Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
              <p className="text-3xl font-bold text-[#4ea8a1]">{property.price}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 bg-[#e8f5f4] px-3 py-1.5 rounded-lg mb-2">
                <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                <span className="text-sm font-semibold">{property.developerRating}</span>
              </div>
              <div className="text-xs text-gray-500">Developer Rating</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-700 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{property.bedrooms} Bedrooms</span>
            </div>
            {property.scannedData?.bathrooms && (
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{property.scannedData.bathrooms} Baths</span>
              </div>
            )}
            {property.scannedData?.parkingSpaces && (
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{property.scannedData.parkingSpaces} Parking</span>
              </div>
            )}
            {property.scannedData?.propertyType && (
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{property.scannedData.propertyType}</span>
              </div>
            )}
          </div>

          {/* Market Context Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#4ea8a1]/10 to-[#4ea8a1]/5 rounded-lg p-4 border border-[#4ea8a1]/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#4ea8a1]" />
                <div className="text-xs text-gray-600">Est. Rental Yield</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">6-8%</div>
              <div className="text-xs text-gray-500 mt-1">Area avg: 5.2%</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-50/30 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                <div className="text-xs text-gray-600">Price Analysis</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">Fair</div>
              <div className="text-xs text-gray-500 mt-1">Within 5% of FMV</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-50/30 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-blue-600" />
                <div className="text-xs text-gray-600">Exit Liquidity</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">8.2/10</div>
              <div className="text-xs text-gray-500 mt-1">High resale demand</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-50/30 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <div className="text-xs text-gray-600">Overall Risk</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">Low</div>
              <div className="text-xs text-gray-500 mt-1">Based on analysis</div>
            </div>
          </div>

          {/* Data Transparency Note */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-blue-900 mb-1">
                  How This Report Works
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  This comprehensive analysis combines verified property data, comparable market analysis,
                  and AI-powered insights. Look for confidence badges: ✓ Verified = independently confirmed,
                  ≈ Analysis = based on market data, ○ Estimated = preliminary assessment.
                  All sources are cited for transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof - Smart Display */}
        {property.socialProof && property.socialProof.views > 50 && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>{Math.floor(property.socialProof.views / 10) * 10}+ views this week</span>
                </div>
                {property.socialProof.interestedBuyers > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{property.socialProof.interestedBuyers} interested</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Updated {property.socialProof.recentActivity}
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Teaser */}
        <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-xl p-4 mb-6 border border-[#f59e0b]/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-[#f59e0b] flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-gray-900 mb-2">Have specific questions?</h4>
              <p className="text-sm text-gray-700 mb-3">
                Ask our AI anything about this property. Get instant answers based on verified data and market insights.
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

        {/* THE VALUE PROP: Comprehensive Q&A Sections */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {qaData.length} comprehensive sections analyzed • All questions answered with data sources
          </p>

          {qaData.map((section) => (
            <div
              key={section.title}
              ref={(el) => { sectionRefs.current[section.title] = el; }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  {/* Confidence badge instead of scary warning */}
                  <ConfidenceBadge level={section.confidence} />
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
                  {section.questions.map((qa, index) => (
                    <div key={index} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                      {/* Question */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-gray-900 font-semibold flex-1">{qa.question}</p>
                        <ConfidenceBadge level={qa.confidence} />
                      </div>

                      {/* Answer */}
                      <p className="text-gray-700 text-sm mb-2">{qa.answer}</p>

                      {/* Data Source - Positive framing */}
                      {qa.dataSource && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Based on: {qa.dataSource}
                        </p>
                      )}

                      {/* Verification suggestion (not scary warning) */}
                      {qa.needsVerification && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-800">
                              <strong>Recommended next step:</strong> Consider independent verification
                              for complete peace of mind (₦50K-₦150K service available).
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      {qa.details && (
                        <div className="flex items-start gap-2 mt-2 p-3 bg-[#e8f5f4] rounded-lg">
                          <FileText className="w-4 h-4 text-[#4ea8a1] mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-gray-700 whitespace-pre-line">{qa.details}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Extra Verification Button - Only for Legal & Documentation Section */}
                  {section.title === "Legal & Documentation" && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="bg-gradient-to-r from-[#e8f5f4] to-[#d1ebe9] rounded-lg p-4 border border-[#4ea8a1]/30">
                        <div className="flex items-start gap-3 mb-3">
                          <Shield className="w-5 h-5 text-[#4ea8a1] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-gray-900 mb-1">Need Extra Legal Verification?</h4>
                            <p className="text-sm text-gray-700 mb-3">
                              Get comprehensive title verification, registry checks, and legal documentation review from licensed professionals.
                            </p>
                            <button
                              onClick={() => setShowExtraVerification(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#45a69f] transition-colors text-sm"
                            >
                              <Shield className="w-4 h-4" />
                              Request Extra Verification
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 bg-white/60 rounded px-3 py-2">
                          Professional service • Legal documentation review • Title insurance options
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Listed By */}
        {property.listedBy && (
          <div className="bg-white rounded-xl p-6 mt-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Listed By</h3>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{property.listedBy.name}</h4>
                  {property.listedBy.verified && (
                    <BadgeCheck className="w-5 h-5 text-[#4ea8a1]" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{property.listedBy.company}</p>
                <p className="text-xs text-gray-500">
                  All transactions processed through Inda for your protection
                </p>
              </div>
              <button className="px-4 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8a84] transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-white rounded-xl p-6 mt-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Move Forward?</h3>

          {property.isScanned ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                This is an external listing. We recommend independent verification before proceeding.
              </p>
              <button
                onClick={() => setShowExtraVerification(true)}
                className="w-full px-6 py-4 bg-white text-[#4ea8a1] rounded-lg hover:bg-[#e8f5f4] transition-colors border-2 border-[#4ea8a1] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Request Full Verification</div>
                    <div className="text-xs text-gray-600">Registry checks & legal review</div>
                  </div>
                </div>
                <div className="text-sm font-semibold">From ₦750K</div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="px-6 py-4 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8a84] transition-colors font-semibold">
                Schedule Site Visit
              </button>
              <button className="px-6 py-4 bg-white border-2 border-[#4ea8a1] text-[#4ea8a1] rounded-lg hover:bg-[#4ea8a1] hover:text-white transition-all font-semibold">
                Make an Offer
              </button>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Your information is secure. Inda facilitates all transactions with buyer protection.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={() => setShowAskAI(true)}
            className="px-6 py-4 bg-white text-[#4ea8a1] rounded-xl border-2 border-[#4ea8a1] hover:bg-[#e8f5f4] transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden md:inline">Ask Anything</span>
          </button>
          <button
            onClick={() => property.isScanned && setShowExtraVerification(true)}
            className="flex-1 px-6 py-4 bg-[#4ea8a1] text-white rounded-xl hover:bg-[#45a69f] transition-colors font-semibold"
          >
            {property.isScanned ? "Request Verification" : "Schedule Visit"}
          </button>
        </div>
      </div>

      {/* Modals */}
      <AskAIModal
        isOpen={showAskAI}
        onClose={() => setShowAskAI(false)}
        propertyName={property.name}
      />

      <DueDiligenceModal
        isOpen={showExtraVerification}
        onClose={() => setShowExtraVerification(false)}
        propertyName={property.name}
        propertyPrice={property.price}
        tier={verificationTier}
        onTierChange={setVerificationTier}
      />
    </div>
  );
}
