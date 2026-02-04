import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Lightbulb,
  Sparkles,
  FileText,
  Camera,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { type PropertyData } from "@/components/dashboard/hub/ViewHub";
import { DisputeReportSection } from "@/components/dashboard/hub/DisputeReportSection";

// ============================================================================
// TYPES
// ============================================================================

export interface PropertyMetrics {
  completenessScore: number;
  daysOnMarket: number;
  viewCount: number;
  viewingConversion: number;
  offerConversion: number;
  averageEngagementTime: number;
  dropOffRate: number;
  areaDaysToSell: number;
  areaViewingConversion: number;
  areaOfferConversion: number;
}

export interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  icon: 'document' | 'camera' | 'dollar' | 'survey';
  metrics: {
    completionBoost: string;
    impactStat: string;
    impactLabel: string;
    timeEstimate: string;
    roi?: string;
  };
  tip: string;
  aiInsight: string;
  actionLabel: string;
  category: 'photos' | 'documentation' | 'details' | 'price';
}

interface ImprovementsTabProps {
  property: PropertyData;
  metrics: PropertyMetrics;
  config: {
    showROI: boolean;
    showBenchmarks: boolean;
    groupByPriority: boolean;
    enableAIInsights: boolean;
  };
  onActionClick: (improvement: { category: string }) => void;
  listingId: string;
  userId?: string;
}

// ============================================================================
// RECOMMENDATION GENERATION
// ============================================================================

function getRecommendations(property: PropertyData, metrics: PropertyMetrics): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Check for title document - check both label and URL
  const hasTitle = property.documents?.some(d =>
    d.label?.toLowerCase().includes("title") ||
    d.label?.toLowerCase().includes("c of o") ||
    d.label?.toLowerCase().includes("governor") ||
    d.label?.toLowerCase().includes("deed") ||
    d.url?.toLowerCase().includes("title")
  );

  if (!hasTitle) {
    recommendations.push({
      id: 'upload-title',
      priority: 'critical',
      title: 'Upload Title Document',
      description: 'Properties with verified title documents get 3x more inquiries and build immediate buyer trust',
      icon: 'document',
      metrics: {
        completionBoost: '+25% completion',
        impactStat: '+67% buyer confidence',
        impactLabel: '',
        timeEstimate: '5 minutes'
      },
      tip: '89% of sold properties had title docs uploaded',
      aiInsight: 'Title verification is the #1 factor buyers look for. Missing this creates immediate doubt.',
      actionLabel: 'Upload Title Document',
      category: 'documentation'
    });
  }

  // Check for survey plan - check both label and URL
  const hasSurvey = property.documents?.some(d =>
    d.label?.toLowerCase().includes("survey") ||
    d.url?.toLowerCase().includes("survey")
  );

  if (!hasSurvey) {
    recommendations.push({
      id: 'upload-survey',
      priority: 'critical',
      title: 'Upload Survey Plan',
      description: 'Buyers need this to verify property boundaries and validate land dimensions',
      icon: 'survey',
      metrics: {
        completionBoost: '+20% completion',
        impactStat: 'Required for 78% of mortgage approvals',
        impactLabel: '',
        timeEstimate: '5 minutes'
      },
      tip: 'Properties with surveys sell 23% faster',
      aiInsight: 'Banks require surveys <5 years old. Missing this blocks financing options.',
      actionLabel: 'Upload Survey Plan',
      category: 'documentation'
    });
  }

  // Check for photos
  const photoCount = property.photos?.length || 0;
  if (photoCount < 10) {
    recommendations.push({
      id: 'add-photos',
      priority: 'high',
      title: 'Add More Photos',
      description: `You have ${photoCount} photos. Properties with 10+ photos get 2x more views and 41% higher engagement`,
      icon: 'camera',
      metrics: {
        completionBoost: '+14% completion',
        impactStat: '+156% viewing requests',
        impactLabel: '',
        timeEstimate: '10 minutes'
      },
      tip: 'Top-selling properties average 28 photos',
      aiInsight: 'Photo count directly correlates with buyer engagement. Each additional photo increases time-on-listing by 12 seconds.',
      actionLabel: 'Upload Photos',
      category: 'photos'
    });
  }

  // Check for pricing optimization (based on days on market)
  if (metrics.daysOnMarket > metrics.areaDaysToSell) {
    recommendations.push({
      id: 'review-pricing',
      priority: 'high',
      title: 'Review Pricing Strategy',
      description: `Property has been on market for ${metrics.daysOnMarket} days vs. ${metrics.areaDaysToSell} day area average. Price may be limiting buyer interest`,
      icon: 'dollar',
      metrics: {
        completionBoost: 'Faster sale velocity',
        impactStat: `-${metrics.daysOnMarket - metrics.areaDaysToSell} days to sell`,
        impactLabel: 'Immediate',
        timeEstimate: '',
        roi: 'ROI: 588%'
      },
      tip: 'Competitive pricing increases viewing requests by 3x',
      aiInsight: `${metrics.dropOffRate}% of viewers drop off after seeing price. Market is signaling resistance at current level.`,
      actionLabel: 'View Pricing Scenarios',
      category: 'price'
    });
  }

  // Check completeness
  if (metrics.completenessScore < 80) {
    recommendations.push({
      id: 'complete-details',
      priority: 'medium',
      title: 'Complete Property Details',
      description: 'Adding more details helps buyers make faster decisions and increases search visibility',
      icon: 'document',
      metrics: {
        completionBoost: '+15% completion',
        impactStat: '+30% search visibility',
        impactLabel: '',
        timeEstimate: '8 minutes'
      },
      tip: 'Complete listings get 2x more inquiries',
      aiInsight: 'Buyers spend 40% more time on listings with complete information.',
      actionLabel: 'Edit Details',
      category: 'details'
    });
  }

  return recommendations;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const priorityConfig = {
  critical: {
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    button: 'bg-red-500 hover:bg-red-600',
    label: 'Critical'
  },
  high: {
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    button: 'bg-[#4ea8a1] hover:bg-[#3d8580]',
    label: 'High Impact'
  },
  medium: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    button: 'bg-[#4ea8a1] hover:bg-[#3d8580]',
    label: 'Medium'
  }
};

const iconMap = {
  document: FileText,
  camera: Camera,
  dollar: DollarSign,
  survey: FileText
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction: () => void;
  onDismiss?: () => void;
}

function RecommendationCard({ recommendation, onAction, onDismiss }: RecommendationCardProps) {
  const config = priorityConfig[recommendation.priority];
  const IconComponent = iconMap[recommendation.icon];

  return (
    <Card className="p-5 bg-white border border-gray-200 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <IconComponent className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded border font-medium ${config.badge}`}>
          {config.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>

      {/* Metrics Row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          {recommendation.metrics.completionBoost}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {recommendation.metrics.impactStat}
        </span>
        {recommendation.metrics.timeEstimate && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {recommendation.metrics.timeEstimate}
          </span>
        )}
        {recommendation.metrics.roi && (
          <span className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {recommendation.metrics.roi}
          </span>
        )}
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg mb-3">
        <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">{recommendation.tip}</p>
      </div>

      {/* AI Insight */}
      <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg mb-4">
        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-purple-800">
          <span className="font-medium">AI Insight:</span> {recommendation.aiInsight}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAction}
          className={`flex-1 py-3 px-4 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${config.button}`}
        >
          {recommendation.actionLabel}
          <ExternalLink className="w-4 h-4" />
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Dismiss for now"
          >
            <Clock className="w-5 h-5" />
          </button>
        )}
      </div>
    </Card>
  );
}

interface PrioritySectionProps {
  priority: 'critical' | 'high' | 'medium';
  recommendations: Recommendation[];
  onAction: (recommendation: Recommendation) => void;
  defaultExpanded?: boolean;
}

function PrioritySection({ priority, recommendations, onAction, defaultExpanded = false }: PrioritySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const config = priorityConfig[priority];

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`}></span>
          <span className="font-medium text-gray-900">
            {config.label} ({recommendations.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAction={() => onAction(rec)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ImprovementsTab({ property, metrics, config, onActionClick, listingId, userId }: ImprovementsTabProps) {
  const recommendations = getRecommendations(property, metrics);

  // Group by priority
  const criticalRecs = recommendations.filter(r => r.priority === 'critical');
  const highRecs = recommendations.filter(r => r.priority === 'high');
  const mediumRecs = recommendations.filter(r => r.priority === 'medium');

  const totalRecs = recommendations.length;

  // Calculate potential improvement based on what's missing
  const potentialImprovement = 100 - metrics.completenessScore;

  const handleAction = (recommendation: Recommendation) => {
    onActionClick({ category: recommendation.category });
  };

  return (
    <div className="space-y-6">
      {/* Optimization Potential Banner */}
      <div className={`rounded-xl p-5 flex items-center justify-between ${
        totalRecs === 0
          ? 'bg-gradient-to-r from-green-50 to-teal-50'
          : totalRecs <= 2
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
          : 'bg-gradient-to-r from-red-50 to-orange-50'
      }`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {totalRecs === 0 ? 'Listing Optimized' : 'Optimization Potential'}
          </h3>
          <p className="text-sm text-gray-600">
            {totalRecs === 0
              ? 'Your listing is complete and optimized'
              : `${totalRecs} active recommendation${totalRecs > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            totalRecs === 0 ? 'text-green-600' : totalRecs <= 2 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {totalRecs === 0 ? metrics.completenessScore : `+${potentialImprovement}`}%
          </div>
          <div className="text-xs text-gray-500">
            {totalRecs === 0 ? 'Completeness' : 'Potential Gain'}
          </div>
        </div>
      </div>

      {/* Priority Sections */}
      {totalRecs > 0 ? (
        <div>
          <PrioritySection
            priority="critical"
            recommendations={criticalRecs}
            onAction={handleAction}
            defaultExpanded={true}
          />
          <PrioritySection
            priority="high"
            recommendations={highRecs}
            onAction={handleAction}
            defaultExpanded={true}
          />
          <PrioritySection
            priority="medium"
            recommendations={mediumRecs}
            onAction={handleAction}
            defaultExpanded={false}
          />
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Job!</h3>
          <p className="text-gray-600">Your listing is well-optimized. Keep monitoring your engagement metrics.</p>
        </Card>
      )}

      {/* Dispute Report Section */}
      <DisputeReportSection
        listingId={listingId}
        userId={userId}
        onSubmitSuccess={(disputeId) => {
          console.log('Dispute submitted successfully:', disputeId);
        }}
        onSubmitError={(error) => {
          console.error('Dispute submission failed:', error);
        }}
      />
    </div>
  );
}
