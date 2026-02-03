import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Lock, Globe, Smartphone } from "lucide-react";

export interface BuyerPreviewSettings {
  visibilityMode: "gated" | "public" | "private";
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

export function BuyerPreviewTab({ property, settings, metrics, onSettingsChange }: BuyerPreviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Leads Captured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.leadsCaptured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visibility Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Public Visibility</div>
                  <div className="text-sm text-gray-500">Control who can see your property details</div>
                </div>
              </div>
              <select 
                value={settings.visibilityMode}
                onChange={(e) => onSettingsChange({ visibilityMode: e.target.value as any })}
                className="border rounded-md px-3 py-1.5 text-sm bg-white"
              >
                <option value="public">Public</option>
                <option value="gated">Gated (Registration Required)</option>
                <option value="private">Private (Link Only)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Require Phone Number</div>
                  <div className="text-sm text-gray-500">Mandatory phone number for interested buyers</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.requirePhone}
                onChange={(e) => onSettingsChange({ requirePhone: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-inda-teal focus:ring-inda-teal"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Smart Gating</div>
                  <div className="text-sm text-gray-500">Automatically gate content based on engagement</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.enableSmartGating}
                onChange={(e) => onSettingsChange({ enableSmartGating: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-inda-teal focus:ring-inda-teal"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
