export interface Review {
  id: string;
  reviewer: string;
  location: string;
  timeAgo: string;
  rating: number;
  title: string;
  content: string;
}

export interface Document {
  name: string;
  status: "verified" | "not-provided" | "in-review";
  notes: string;
  icon?: string;
}

export interface Comparable {
  id: string;
  title: string;
  location: string;
  price: string;
  pricePerSqm: string;
  yield: string;
  beds: number;
  developerTrustScore: number;
  image: string;
}

export interface ROIMetric {
  label: string;
  value: string;
}

export interface ROIMetricTwo {
  label: string;
  value: string;
}

export interface ResultData {
  // Basic Property Info
  title: string;
  location: string;
  price: string;
  fairMarketValue: string;
  overpriced: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;

  // Developer Info
  developer: {
    name: string;
    trustScore: number;
    profileLink: string;
  };

  // Status & Delivery
  status: "Off-Plan" | "Completed" | "Under Construction";
  deliveryDate: string;
  title_status: string;

  // Amenities
  amenities: string[];

  // Inda Verdict
  verdict: {
    text: string;
    warning: boolean;
  };

  // Trust Score
  indaTrustScore: number;
  trustScoreTooltip: string;

  // Reviews
  overallRating: number;
  totalReviews: number;
  ratingBreakdown: {
    stars: number;
    percentage: number;
  }[];
  reviews: Review[];

  // AI Summary
  aiSummary: string;

  // Price Analysis
  priceAnalysis: {
    currentPrice: string;
    fairValue: string;
    overpriced: string;
    aiSummary: string;
  };

  // Documents
  documents: Document[];
  legalNote: string;

  // ROI Panel
  roiMetrics: ROIMetric[];
  roiMetricsTwo: ROIMetricTwo[];
  roiSummary: string;

  // Comparables
  comparables: Comparable[];

  // Legal Disclaimer
  legalDisclaimer: string;
}

export const dummyResultData: ResultData = {
  title: "Luxury 3-Bedroom Apartment in Lekki Phase 1",
  location: "Lekki Phase 1, Lagos",
  price: "₦120,000,000",
  fairMarketValue: "₦95,000,000",
  overpriced: "17% Overpriced",
  bedrooms: 3,
  bathrooms: 4,
  propertyType: "Apartment",

  developer: {
    name: "ABC Properties Ltd.",
    trustScore: 83,
    profileLink: "/developer/abc-properties",
  },

  status: "Off-Plan",
  deliveryDate: "Q3 2026",
  title_status: "C of O ✅",

  amenities: [
    "Swimming Pool",
    "Security",
    "Accessible Roads",
    "24 hours Electricity",
    "Well-Planned Layout",
  ],

  verdict: {
    text: "⚠️ Overpriced. Moderate Legal Risk",
    warning: true,
  },

  indaTrustScore: 83,
  trustScoreTooltip:
    "The Inda score(0-100) is a trust rating based on verified documents, price accuracy vs market, complaint history, CAC and legal checks and responsiveness. Each score is updated regularly and weighted based on what matters most to safe investing.",

  overallRating: 3.4,
  totalReviews: 7,
  ratingBreakdown: [
    { stars: 5, percentage: 10 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 30 },
    { stars: 2, percentage: 30 },
    { stars: 1, percentage: 10 },
  ],

  reviews: [
    {
      id: "1",
      reviewer: "Chinedu O.",
      location: "Lagos, NG",
      timeAgo: "2 months ago",
      rating: 3,
      title: "Good finishing, but delayed delivery",
      content:
        "I bought into one of ABC's estates off-plan. Delivery was 7 months late, which was frustrating. However, the property quality was solid and their team was responsive when I had issues.",
    },
    {
      id: "2",
      reviewer: "Fatima S.",
      location: "Abuja, NG",
      timeAgo: "1 month ago",
      rating: 2,
      title: "Okay experience — not the best, not the worst",
      content:
        "Estate delivered eventually but there was a 6-month delay. Customer service was hard to reach at times. I wouldn't recommend for first-time buyers who need peace of mind.",
    },
    {
      id: "3",
      reviewer: "Emeka A.",
      location: "Port Harcourt, NG",
      timeAgo: "3 weeks ago",
      rating: 5,
      title: "No issues at all",
      content:
        "I bought into one of their earlier developments — everything went smoothly. Delivery was on time, finishing was great, and I had zero issues. Maybe I was just lucky!",
    },
  ],

  aiSummary:
    "ABC Properties has delivered 12 estates, 3 delayed by 6+ months. 2 complaints in the last year. Rated Medium Trust.",

  priceAnalysis: {
    currentPrice: "₦120,000,000",
    fairValue: "₦95,000,000",
    overpriced: "17% Overpriced",
    aiSummary:
      "This 3-bed in Lekki is listed at ₦120M. Our engine values it at ₦95M, based on 17 comparable sales from 2023–2024. ROI is 7.2% from current rent trends.",
  },

  documents: [
    {
      name: "Certificate of Occupancy",
      status: "verified",
      notes: "Linked to registry",
    },
    {
      name: "Deed of Assignment",
      status: "not-provided",
      notes: "Request Upload",
    },
    {
      name: "Developer MOU",
      status: "in-review",
      notes: "Pending verification",
    },
    {
      name: "Floor Plan",
      status: "verified",
      notes: "PDF View",
    },
    {
      name: "Survey Plan",
      status: "verified",
      notes: "Cross-checked",
    },
  ],

  legalNote:
    "🛡 Legal risk detected: Developer has court cases. Title verified but not uploaded. Market liquidity is moderate — similar homes sell in 3–5 months. All documents are anonymized under NDPR. Legal advice is still strongly recommended.",

  roiMetrics: [
    {
      label: "Purchase Price",
      value: "₦130,000,000",
    },
    {
      label: "Financing",
      value: "4.5%",
    },
    {
      label: "Financing Tenure",
      value: "10 years",
    },
    {
      label: "Holding Period",
      value: "3 years",
    },
  ],

  roiMetricsTwo: [
    {
      label: "Avg. Rental Yield (Long Term)",
      value: "5.2%",
    },
    {
      label: "Avg. Rental Yield (Short Term)",
      value: "6.8",
    },
    {
      label: "Total Expense (% of Rent)",
      value: "18.2",
    },
  ],

  roiSummary:
    "Summarize ROI projection using rental yield, appreciation trends, and future resale value. Highlight how it compares to micro location average and what kind of buyer it suits (e.g. rental investor, flip buyer, etc.)",

  comparables: [
    {
      id: "1",
      title: "5-Bed Apartment in Ajah",
      location: "Ajah",
      beds: 5,
      price: "₦110M",
      pricePerSqm: "₦100k/Sqm",
      yield: "6.5% Yield",
      developerTrustScore: 83,
      image: "https://share.google/images/aLqn3qjeANrudQu8u",
    },
    {
      id: "2",
      title: "4-Bed Apartment in Lekki",
      location: "Lekki",
      price: "₦125M",
      pricePerSqm: "₦120k/Sqm",
      yield: "7% Yield",
      beds: 4,
      developerTrustScore: 83,
      image: "https://share.google/images/aLqn3qjeANrudQu8u",
    },
    {
      id: "3",
      title: "5-Bed Apartment in VI",
      location: "VI",
      price: "₦110M",
      pricePerSqm: "₦100k/Sqm",
      yield: "6.5% Yield",
      beds: 5,
      developerTrustScore: 83,
      image: "https://share.google/images/aLqn3qjeANrudQu8u",
    },
    {
      id: "4",
      title: "5-Bed Apartment in Ajah",
      location: "Ajah",
      price: "₦110M",
      pricePerSqm: "₦100k/Sqm",
      yield: "6.5% Yield",
      beds: 5,
      developerTrustScore: 83,
      image: "https://share.google/images/aLqn3qjeANrudQu8u",
    },
    {
      id: "5",
      title: "5-Bed Apartment in Ajah",
      location: "Ajah",
      price: "₦110M",
      pricePerSqm: "₦100k/Sqm",
      yield: "6.5% Yield",
      beds: 5,
      developerTrustScore: 83,
      image: "https://share.google/images/aLqn3qjeANrudQu8u",
    },
    {
      id: "6",
      title: "5-Bed Apartment in Ajah",
      location: "Ajah",
      price: "₦110M",
      pricePerSqm: "₦100k/Sqm",
      yield: "6.5% Yield",
      beds: 5,
      developerTrustScore: 83,
      image: "https://share.google/images/aLqn3qjeANrudQu8u",
    },
  ],

  legalDisclaimer:
    "This report is generated using verified market data, RCIS valuation standards, and legal doc summaries. Inda does not offer financial or legal advice. Users are advised to confirm with licensed professionals before transacting. All personal or sensitive information is anonymized in line with the Nigeria Data Protection Regulation (NDPR).",
};
