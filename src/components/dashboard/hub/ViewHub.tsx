import { useState } from "react";
import {
  Edit3,
  Eye,
  Users,
  MessageSquare,
  Star,
  FileText,
  ExternalLink,
  Lightbulb,
  ArrowLeft,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ImprovementsTab, type PropertyMetrics } from "@/components/dashboard/hub/ImprovementsTab";
import {
  BuyerPreviewTab,
  type BuyerPreviewSettings,
  type BuyerPreviewMetrics
} from "@/components/dashboard/hub/BuyerPreviewTab";

// ============================================================================
// TYPES
// ============================================================================

export interface PropertyData {
  id: string;
  propertyType: string;
  address: string;
  price: string;
  bedrooms?: string;
  bathrooms?: string;
  documents: Array<{
    url?: string;
    file?: File;
    label: string;
    aiExtractedData?: any;
  }>;
  photos: Array<{
    url?: string;
    file?: File;
    label: string;
    category: string;
  }>;
  isOffPlan?: boolean;
  expectedCompletion?: string;
  lastConstructionUpdate?: string;
  createdAt?: string;
  
  // Engagement metrics
  views?: number;
  questions?: number;
  offers?: number;
  engaged?: number;
}

export interface ViewHubProps {
  property: PropertyData;
  intelligenceData?: any;
  daysOnMarket?: number;
  onEdit: () => void;
  onBack: () => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateCompletenessScore(property: PropertyData): number {
  let score = 0;
  let total = 0;
  
  // Basic info (40%)
  total += 40;
  if (property.address) score += 10;
  if (property.price) score += 10;
  if (property.bedrooms) score += 10;
  if (property.bathrooms) score += 10;
  
  // Documents (40%)
  total += 40;
  const hasTitle = property.documents.some(d => d.label?.toLowerCase().includes("title"));
  const hasSurvey = property.documents.some(d => d.label?.toLowerCase().includes("survey"));
  if (hasTitle) score += 20;
  if (hasSurvey) score += 20;
  
  // Photos (20%)
  total += 20;
  if (property.photos.length >= 10) score += 20;
  else if (property.photos.length >= 5) score += 15;
  else if (property.photos.length >= 3) score += 10;
  else if (property.photos.length >= 1) score += 5;
  
  return Math.round((score / total) * 100);
}

function getReportStrength(score: number) {
  if (score >= 80) {
    return { label: "Excellent", color: "green", icon: "check" as const };
  } else if (score >= 60) {
    return { label: "Good", color: "yellow", icon: "warning" as const };
  } else {
    return { label: "Needs Work", color: "red", icon: "x" as const };
  }
}

// ============================================================================
// MAIN COMPONENT (ViewHub)
// ============================================================================

export function ViewHub({ property, intelligenceData, daysOnMarket = 0, onEdit, onBack }: ViewHubProps) {
  const [activeTab, setActiveTab] = useState("improvements");
  
  // Calculate metrics
  const completenessScore = calculateCompletenessScore(property);
  const strength = getReportStrength(completenessScore);
  
  // Mock metrics (replace with real data where available)
  const propertyMetrics: PropertyMetrics = {
    completenessScore,
    daysOnMarket: daysOnMarket || 89,
    viewCount: property.views || 0,
    viewingConversion: 23, // Still mock
    offerConversion: 13, // Still mock
    averageEngagementTime: 514, // Still mock
    dropOffRate: 34, // Still mock
    areaDaysToSell: 64, // Still mock
    areaViewingConversion: 18, // Still mock
    areaOfferConversion: 22 // Still mock
  };
  
  // Buyer Preview Settings
  const [buyerPreviewSettings, setBuyerPreviewSettings] = useState<BuyerPreviewSettings>({
    visibilityMode: "gated" as const,
    requirePhone: false,
    badgeStyle: "full",
    showConfidenceScore: true,
    badgePlacements: [],
    sectionAccess: [
      { sectionId: "property-details", sectionName: "Property Details", isPublic: true },
      { sectionId: "documents", sectionName: "Documents & Verification", isPublic: true },
      { sectionId: "financials", sectionName: "Financials & Pricing", isPublic: true },
      { sectionId: "location", sectionName: "Location & Amenities", isPublic: true },
      { sectionId: "market-analysis", sectionName: "Market Analysis", isPublic: false },
      { sectionId: "risk-assessment", sectionName: "Risk Assessment", isPublic: false },
      { sectionId: "investment-projections", sectionName: "Investment Projections", isPublic: false },
      { sectionId: "recommendations", sectionName: "Recommendations", isPublic: false }
    ],
    leadCaptureFields: [
      { fieldId: "name", fieldName: "name", fieldType: "text", label: "Full Name", required: true },
      { fieldId: "email", fieldName: "email", fieldType: "email", label: "Email Address", required: true },
      { fieldId: "phone", fieldName: "phone", fieldType: "phone", label: "Phone Number", required: false }
    ],
    enableSmartGating: true,
    smartGatingCriteria: {
      minVisits: 2,
      minTimeOnPage: 60,
      minInteractions: 3
    }
  });
  
  const buyerPreviewMetrics: BuyerPreviewMetrics = {
    totalViews: property.views || 147,
    uniqueViewers: Math.floor((property.views || 147) * 0.6), // Estimated
    leadsCaptured: property.questions || 23,
    reportUnlocks: 18, // Mock
    averageEngagement: 324, // Mock
    conversionRate: 20.2 // Mock
  };
  
  const handleBuyerPreviewSettingsChange = (updates: Partial<BuyerPreviewSettings>) => {
    setBuyerPreviewSettings(prev => ({ ...prev, ...updates }));
    console.log("Buyer preview settings updated:", updates);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Property Hub</h1>
              <p className="text-sm text-gray-600">{property.address}</p>
            </div>
            <a
              href={`/property/${property.id}`}
              className="px-6 py-3 bg-gradient-to-r from-[#4ea8a1] to-[#3d8580] text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              View Full Report
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Property
            </button>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4">
            {/* Completeness */}
            <Card className={`p-4 border-2 ${
              strength.color === "green" ? "border-green-500 bg-green-50" :
              strength.color === "yellow" ? "border-yellow-500 bg-yellow-50" :
              "border-red-500 bg-red-50"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Completeness</span>
                {strength.icon === "check" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {strength.icon === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                {strength.icon === "x" && <X className="w-5 h-5 text-red-600" />}
              </div>
              <div className={`text-2xl font-bold ${
                strength.color === "green" ? "text-green-700" :
                strength.color === "yellow" ? "text-yellow-700" :
                "text-red-700"
              }`}>
                {completenessScore}%
              </div>
              <div className="text-xs text-gray-600 mt-1">{strength.label}</div>
            </Card>
            
            {/* Views */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Views</span>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {property.views || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Last 7 days</div>
            </Card>
            
            {/* Engaged */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Engaged</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {property.engaged || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Buyers</div>
            </Card>
            
            {/* Questions */}
            <Card className="p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Questions</span>
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {property.questions || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Asked</div>
            </Card>
            
            {/* Offers */}
            <Card className="p-4 bg-white border-2 border-[#4ea8a1]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Offers</span>
                <Star className="w-4 h-4 text-[#4ea8a1]" />
              </div>
              <div className="text-2xl font-bold text-[#4ea8a1]">
                {property.offers || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Received</div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="improvements" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Improvements
            </TabsTrigger>
            <TabsTrigger value="buyer-preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Buyer Preview
            </TabsTrigger>
          </TabsList>
          
          {/* Improvements Tab */}
          <TabsContent value="improvements" className="space-y-6">
            <ImprovementsTab
              property={property}
              metrics={propertyMetrics}
              config={{
                showROI: true,
                showBenchmarks: true,
                groupByPriority: true,
                enableAIInsights: true
              }}
              onActionClick={(improvement) => {
                console.log("Action clicked:", improvement);
                // Handle improvement action (e.g., navigate to edit page)
                if (improvement.category === "documentation" || 
                    improvement.category === "photos" || 
                    improvement.category === "details") {
                  onEdit();
                }
              }}
            />
          </TabsContent>
          
          {/* Buyer Preview Tab */}
          <TabsContent value="buyer-preview" className="space-y-6">
            <BuyerPreviewTab
              property={property}
              settings={buyerPreviewSettings}
              metrics={buyerPreviewMetrics}
              onSettingsChange={handleBuyerPreviewSettingsChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
