import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Eye,
  Globe,
  Mail,
  Lock,
  EyeOff,
  Check,
  Phone
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface BuyerPreviewSettings {
  visibilityMode: "public" | "gated" | "invitation" | "hidden";
  requirePhone: boolean;
  badgeStyle: "full" | "minimal";
  showConfidenceScore: boolean;
  badgePlacements: string[];
  sectionAccess: Array<{ sectionId: string; sectionName: string; isPublic: boolean }>;
  leadCaptureFields: Array<{ fieldId: string; fieldName: string; fieldType: string; label: string; required: boolean }>;
  enableSmartGating: boolean;
  smartGatingCriteria: {
    minVisits: number;
    minTimeOnPage: number;
    minInteractions: number;
  };
}

export interface BuyerPreviewMetrics {
  totalViews: number;
  uniqueViewers: number;
  leadsCaptured: number;
  reportUnlocks: number;
  averageEngagement: number;
  conversionRate: number;
}

interface BuyerPreviewTabProps {
  property: any;
  settings: BuyerPreviewSettings;
  metrics: BuyerPreviewMetrics;
  onSettingsChange: (updates: Partial<BuyerPreviewSettings>) => void;
}

// ============================================================================
// VISIBILITY MODE OPTIONS
// ============================================================================

const visibilityModes = [
  {
    id: 'public' as const,
    title: 'Fully Public',
    badge: 'Recommended',
    badgeColor: 'bg-green-100 text-green-700 border-green-200',
    icon: Globe,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    description: 'Anyone can view the buyer preview via link',
    benefits: [
      'Maximum transparency = Maximum trust',
      '3-5x more viewing requests',
      'Best for confident sellers'
    ],
    stats: {
      avgViews: '47/week',
      leadQuality: 'Medium',
      timeToSell: '52 days'
    }
  },
  {
    id: 'gated' as const,
    title: 'Gated Access',
    badge: 'Popular',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Mail,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    description: 'Buyers provide email/phone to view preview',
    benefits: [
      'Capture lead info before they see preview',
      '2x more qualified leads',
      'Balance of transparency and control'
    ],
    stats: {
      avgViews: '31/week',
      leadQuality: 'High',
      timeToSell: '64 days'
    }
  },
  {
    id: 'invitation' as const,
    title: 'Invitation Only',
    badge: null,
    badgeColor: '',
    icon: Lock,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    description: 'Only buyers you invite can view',
    benefits: [
      'Maximum control over who sees report',
      'Track individual buyer engagement',
      'Best for exclusive/off-market deals'
    ],
    stats: {
      avgViews: '8/week',
      leadQuality: 'Very High',
      timeToSell: '89 days'
    }
  },
  {
    id: 'hidden' as const,
    title: 'Completely Hidden',
    badge: null,
    badgeColor: '',
    icon: EyeOff,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    description: 'Report exists but not accessible publicly',
    benefits: [
      'Internal use only (sales training)',
      'No public benefit',
      'Can enable later when ready'
    ],
    stats: {
      avgViews: '0/week',
      leadQuality: 'N/A',
      timeToSell: 'Same as unverified'
    }
  }
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface VisibilityModeCardProps {
  mode: typeof visibilityModes[number];
  isSelected: boolean;
  onSelect: () => void;
}

function VisibilityModeCard({ mode, isSelected, onSelect }: VisibilityModeCardProps) {
  const IconComponent = mode.icon;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-[#4ea8a1] bg-teal-50/30'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-teal-100' : mode.iconBg}`}>
            <IconComponent className={`w-5 h-5 ${isSelected ? 'text-teal-600' : mode.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{mode.title}</h4>
              {mode.badge && (
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${mode.badgeColor}`}>
                  {mode.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-0.5">{mode.description}</p>
          </div>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-[#4ea8a1] rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Benefits List */}
      <ul className="space-y-1.5 mb-4 ml-12">
        {mode.benefits.map((benefit, index) => (
          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="text-gray-400 mt-1.5">•</span>
            {benefit}
          </li>
        ))}
      </ul>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 ml-12">
        <div>
          <div className="font-semibold text-gray-900">{mode.stats.avgViews}</div>
          <div className="text-xs text-gray-500">Avg Views</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{mode.stats.leadQuality}</div>
          <div className="text-xs text-gray-500">Lead Quality</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{mode.stats.timeToSell}</div>
          <div className="text-xs text-gray-500">Time to Sell</div>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BuyerPreviewTab({ property, settings, metrics, onSettingsChange }: BuyerPreviewTabProps) {
  const selectedMode = visibilityModes.find(m => m.id === settings.visibilityMode) || visibilityModes[1];

  return (
    <div className="space-y-6">
      {/* Current Mode Banner */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-500 rounded-lg">
                <selectedMode.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{selectedMode.title}</h3>
                  {selectedMode.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${selectedMode.badgeColor}`}>
                      {selectedMode.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{selectedMode.description}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.uniqueViewers}</div>
              <div className="text-sm text-gray-600">Unique Viewers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.leadsCaptured}</div>
              <div className="text-sm text-gray-600">Leads Captured</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.reportUnlocks}</div>
              <div className="text-sm text-gray-600">Reports Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#4ea8a1]">{metrics.conversionRate}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Visibility Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Visibility Settings</h3>
        </div>

        <div className="space-y-3">
          {visibilityModes.map((mode) => (
            <VisibilityModeCard
              key={mode.id}
              mode={mode}
              isSelected={settings.visibilityMode === mode.id}
              onSelect={() => onSettingsChange({ visibilityMode: mode.id })}
            />
          ))}
        </div>
      </div>

      {/* Phone Requirement */}
      {(settings.visibilityMode === 'gated' || settings.visibilityMode === 'invitation') && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Require phone number (not just email)</h4>
                <p className="text-sm text-gray-600">
                  Higher barrier = More qualified leads. Expected: -40% volume, +120% quality
                </p>
              </div>
            </div>
            <button
              onClick={() => onSettingsChange({ requirePhone: !settings.requirePhone })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.requirePhone ? 'bg-[#4ea8a1]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                  settings.requirePhone ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
