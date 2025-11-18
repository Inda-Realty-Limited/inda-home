// TypeScript types for the computed listing API response

export interface AIReportSection {
  summary: string;
  label: string;
  nextStep: string;
}

export interface AIReport {
  titleSafety?: AIReportSection;
  marketValue?: AIReportSection;
  sellerCredibility?: AIReportSection;
  microlocation?: AIReportSection;
  roi?: AIReportSection;
  finalScore?: number;
}

export interface IndaScoreBreakdownItem {
  label: string;
  score: number;
  weight: number;
}

export interface IndaScore {
  breakdown: {
    titleSafety?: IndaScoreBreakdownItem;
    marketValue?: IndaScoreBreakdownItem;
    sellerCredibility?: IndaScoreBreakdownItem;
    microlocation?: IndaScoreBreakdownItem;
    roi?: IndaScoreBreakdownItem;
  };
  finalScore: number;
  updatedAt: string;
}

export interface MonthlyProjection {
  month: number;
  priceNGN: number;
}

export interface Analytics {
  fmv?: {
    valueNGN: number;
    source: string;
    comparableCount: number;
    confidenceLabel: string;
    change6mNGN: number;
    change6mPct: number;
    reliabilityNotes: string;
  };
  price?: {
    listingPriceNGN: number;
    priceVsFmvPct: number;
    priceVsFmvAmountNGN: number;
    priceVsFmvLabel: string;
  };
  yields?: {
    longTermPct: number;
    shortTermPct: number;
    annualLongTermIncomeNGN: number;
    annualShortTermIncomeNGN: number;
  };
  expenses?: {
    totalExpensesPct: number;
    totalExpensesNGNYearLong: number;
    totalExpensesNGNYearShort: number;
  };
  financing?: {
    downPaymentPct: number;
    downPaymentNGN: number;
    loanPrincipalNGN: number;
    interestRatePct: number;
    tenorYearsDefault: number;
    monthlyPaymentNGN: number;
  };
  appreciation?: {
    nominalPct: number;
    realPct: number;
    usdFxInflAdjPct: number;
    fmvAtSale: number;
  };
  projections?: {
    projectedTotalProfitLongTerm: number;
    projectedTotalProfitShortTerm: number;
    roiLongTermPct: number;
    roiShortTermPct: number;
    monthlyProjection: MonthlyProjection[];
  };
  title?: {
    hasTitleDocs: boolean;
    titleType: string;
    titleSafetyLabel: string;
    titleSafetyScore: number;
  };
  seller?: {
    agentRegistered: boolean;
    sellerCredibilityLabel: string;
    sellerCredibilityScore: number;
  };
  microlocation?: {
    tag: string;
    label: string;
    score: number;
  };
  roi?: {
    label: string;
    longTermPct: number;
    shortTermPct: number;
    marketValueScore: number;
  };
  market?: {
    purchasePrice?: number;
    fairValueNGN?: number;
  };
  updatedAt?: string;
}

export interface ListingSnapshot {
  _id: string;
  listingUrl: string;
  addedOnDate?: string;
  agentCompanyAddress?: string;
  agentCompanyName?: string;
  agentCompanyUrl?: string;
  agentId?: string | null;
  agentName?: string;
  agentPhoneE164?: string;
  agentWhatsappE164?: string;
  approveForProfileCreation?: boolean;
  bathrooms?: number;
  bedrooms?: number;
  coveredAreaSqm?: number | null;
  createdAt?: string;
  currencyOriginal?: string;
  description?: string;
  developerId?: string | null;
  documents?: any[];
  floorPlan?: string | null;
  imageUrls?: string[];
  lastUpdatedDate?: string;
  lga?: string;
  listingStatus?: string;
  marketStatus?: string;
  microlocationStd?: string;
  moderationStatus?: string;
  priceNGN?: number;
  priceOriginal?: number;
  pricePerSqm?: number | null;
  propertyRef?: string;
  propertyTypeStd?: string;
  scrapeDate?: string;
  sizeSqm?: number | null;
  source?: string;
  state?: string;
  title?: string;
  updatedAt?: string;
  validationErrors?: any[];
  verifiedDate?: string | null;
  verifiedStatus?: boolean;
  videoLink?: string | null;
  aiReport?: AIReport;
  analytics?: Analytics;
  computedAt?: string;
  indaScore?: IndaScore;
}

export interface ComputedListing {
  _id: string;
  listingId: string;
  title?: string;
  aiReport?: AIReport;
  analytics?: Analytics;
  autoScore?: boolean;
  computedAt?: string;
  createdAt?: string;
  indaScore?: IndaScore;
  listingUrl: string;
  modelUsed?: string;
  snapshot?: ListingSnapshot;
  updatedAt?: string;
}

export interface ComputedListingApiResponse {
  status: string;
  data: ComputedListing;
}

