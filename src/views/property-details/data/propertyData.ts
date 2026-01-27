// Property data types and mock data
export interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  priceNumeric?: number;
  images: string[];
  bedrooms: number;
  developerRating: string;
  isScanned?: boolean;
  scannedFrom?: string | null;
  // For offer/inquiry submission
  listingId?: string;
  agentUserId?: string;
  dataQuality?: {
    completeness: number;
    lastVerified: string;
    missingFields: string[];
  };
  socialProof?: {
    views: number;
    interestedBuyers: number;
    lastUpdated: string;
  };
  scannedData?: {
    bathrooms?: number | null;
    parkingSpaces?: number | null;
    propertyType?: string | null;
    description?: string | null;
    features?: string[];
    landSize?: string | null;
    builtUpArea?: string | null;
    listedDate?: string | null;
  };
  listedBy?: {
    name: string;
    company: string;
    verified: boolean;
  } | null;
  isOffPlan?: boolean;
  offPlanData?: {
    developerClaimedCompletion: number;
    indaVerifiedCompletion: number;
    lastVerificationDate: string;
    expectedHandoverDate: string;
    milestones: Array<{
      number: number;
      name: string;
      status: "Complete" | "In Progress" | "Not Started" | "Disputed";
      developerClaimed: number;
      indaVerified: number;
      paymentPercentage: number;
      paymentReleased: boolean;
      verificationDate?: string;
      discrepancy?: boolean;
    }>;
  };
}

export interface QASection {
  title: string;
  type?: "financial" | "risk" | "exit" | "developer" | "portfolio" | "price" | "mortgage";
  layer?: "verification-required";
  questions: {
    question: string;
    answer: string;
    details?: string;
  }[];
}

export const qaData: QASection[] = [
  {
    title: "Price & Value Analysis",
    type: "price",
    questions: [
      {
        question: "What is the Fair Market Value (FMV)?",
        answer: "Based on our analysis of comparable properties in the area, the Fair Market Value is estimated at ₦45.2M.",
        details: "This valuation is based on recent sales data, location factors, and property characteristics."
      }
    ]
  },
  {
    title: "Financial Performance Projections",
    type: "financial",
    questions: [
      {
        question: "What is the expected rental yield?",
        answer: "The projected rental yield ranges from 6-8% annually based on current market rates.",
      }
    ]
  },
  {
    title: "Risk Assessment",
    type: "risk",
    questions: [
      {
        question: "What are the main risks?",
        answer: "Overall risk is low. Main considerations include market volatility and location-specific factors.",
      }
    ]
  },
  {
    title: "Exit & Liquidity Analysis",
    type: "exit",
    questions: [
      {
        question: "How liquid is this property?",
        answer: "Liquidity score: 8.2/10. Properties in this area typically sell within 60-90 days.",
      }
    ]
  },
  {
    title: "Developer & Project Credibility",
    type: "developer",
    layer: "verification-required",
    questions: [
      {
        question: "Who is the developer?",
        answer: "Developer information requires verification.",
      }
    ]
  },
  {
    title: "Portfolio Fit",
    type: "portfolio",
    questions: [
      {
        question: "Is this a good investment?",
        answer: "This property fits well in a balanced portfolio, offering steady rental income and capital appreciation potential.",
      }
    ]
  },
  {
    title: "Mortgage & Insurance Partners",
    type: "mortgage",
    questions: [
      {
        question: "Can I get a mortgage?",
        answer: "Yes, we have partnered mortgage providers. Apply for mortgage pre-approval to get started.",
        details: "Apply for mortgage pre-approval"
      }
    ]
  },
  {
    title: "Construction & Property Condition",
    questions: [
      {
        question: "What is the construction status?",
        answer: "Construction is 85% complete with expected delivery in Q2 2025.",
      }
    ]
  }
];

export const scannedQAData: QASection[] = [
  {
    title: "Price & Value Analysis",
    type: "price",
    questions: [
      {
        question: "What is the Fair Market Value (FMV)?",
        answer: "Based on our AI analysis of this external listing and our database, the Fair Market Value is estimated.",
      }
    ]
  },
  {
    title: "Location & Infrastructure Insights",
    questions: [
      {
        question: "What are the location advantages?",
        answer: "This location offers good connectivity, nearby amenities, and strong growth potential.",
      }
    ]
  },
  {
    title: "Financial Performance Projections",
    type: "financial",
    questions: [
      {
        question: "What is the expected ROI?",
        answer: "Projected ROI ranges from 6-8% annually based on market analysis.",
      }
    ]
  },
  {
    title: "Risk Assessment",
    type: "risk",
    questions: [
      {
        question: "What are the main risks?",
        answer: "Risk assessment based on external listing data. Independent verification recommended.",
      }
    ]
  },
  {
    title: "Exit & Liquidity Analysis",
    type: "exit",
    questions: [
      {
        question: "How liquid is this property?",
        answer: "Liquidity analysis based on market trends in the area.",
      }
    ]
  },
  {
    title: "Developer & Project Credibility",
    type: "developer",
    layer: "verification-required",
    questions: [
      {
        question: "Who is the developer?",
        answer: "Developer information from external listing. Verification required for purchase.",
      }
    ]
  },
  {
    title: "Portfolio Fit",
    type: "portfolio",
    questions: [
      {
        question: "Is this a good investment?",
        answer: "Portfolio fit analysis based on property characteristics and market position.",
      }
    ]
  }
];

