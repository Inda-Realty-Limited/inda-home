import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, ArrowRight, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { type PropertyData } from "@/components/dashboard/hub/ViewHub";

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

interface ImprovementsTabProps {
  property: PropertyData;
  metrics: PropertyMetrics;
  config: any;
  onActionClick: (improvement: any) => void;
}

interface Improvement {
  id: string;
  title: string;
  description: string;
  category: 'photos' | 'documentation' | 'details' | 'price';
  impact: 'high' | 'medium' | 'low';
  actionLabel: string;
  color: 'yellow' | 'blue' | 'red' | 'green';
}

function getImprovements(property: PropertyData, metrics: PropertyMetrics): Improvement[] {
  const improvements: Improvement[] = [];

  // Photos Check
  if (property.photos.length < 5) {
    improvements.push({
      id: 'photos-count',
      title: 'Add Professional Photos',
      description: `You only have ${property.photos.length} photos. Listings with 10+ photos get 145% more views.`,
      category: 'photos',
      impact: 'high',
      actionLabel: 'Upload Photos',
      color: 'yellow'
    });
  }

  // Documents Check
  const hasTitle = property.documents.some(d => d.label?.toLowerCase().includes("title") || d.label?.toLowerCase().includes("c of o"));
  if (!hasTitle) {
    improvements.push({
      id: 'docs-title',
      title: 'Verify Property Title',
      description: 'Upload a C of O or Governor\'s Consent to build trust and sell 2x faster.',
      category: 'documentation',
      impact: 'high',
      actionLabel: 'Verify Now',
      color: 'blue'
    });
  }

  // Completeness Check
  if (metrics.completenessScore < 80) {
    improvements.push({
      id: 'details-completeness',
      title: 'Complete Listing Details',
      description: 'Your listing is missing key details. Complete listings rank higher in search results.',
      category: 'details',
      impact: 'medium',
      actionLabel: 'Edit Details',
      color: 'red'
    });
  }

  // Price Check (Simple logic for now, could be based on market data)
  // Example: If we had a market price comparison
  
  return improvements;
}

const colorStyles = {
  yellow: { 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-100', 
    badge: 'bg-white border-yellow-200 text-yellow-700',
    button: 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50'
  },
  blue: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-100', 
    badge: 'bg-white border-blue-200 text-blue-700',
    button: 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
  },
  red: { 
    bg: 'bg-red-50', 
    border: 'border-red-100', 
    badge: 'bg-white border-red-200 text-red-700',
    button: 'bg-white border-red-200 text-red-700 hover:bg-red-50'
  },
  green: { 
    bg: 'bg-green-50', 
    border: 'border-green-100', 
    badge: 'bg-white border-green-200 text-green-700',
    button: 'bg-white border-green-200 text-green-700 hover:bg-green-50'
  }
};

export function ImprovementsTab({ property, metrics, config, onActionClick }: ImprovementsTabProps) {
  const improvements = getImprovements(property, metrics);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Recommended Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {improvements.length > 0 ? (
            <div className="space-y-4">
              {improvements.map((improvement) => {
                const styles = colorStyles[improvement.color];
                return (
                  <div 
                    key={improvement.id} 
                    className={`border rounded-lg p-4 ${styles.bg} ${styles.border}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{improvement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{improvement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${styles.badge}`}>
                             {improvement.impact} Impact
                           </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => onActionClick({ category: improvement.category })}
                        className={`px-3 py-1.5 border text-sm font-medium rounded-md whitespace-nowrap ml-4 ${styles.button}`}
                      >
                        {improvement.actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Great Job!</h3>
                <p className="text-gray-500">Your listing is well-optimized. Keep monitoring your engagement metrics.</p>
             </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Market Comparison</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-500">Days on Market</span>
                 <div className="flex items-center gap-2">
                   <span className="font-bold">{metrics.daysOnMarket}</span>
                   <span className="text-xs text-red-500">(Avg: {metrics.areaDaysToSell})</span>
                 </div>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-500">Viewing Conversion</span>
                 <div className="flex items-center gap-2">
                   <span className="font-bold">{metrics.viewingConversion}%</span>
                   <span className="text-xs text-green-500">(Avg: {metrics.areaViewingConversion}%)</span>
                 </div>
               </div>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ROI Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">High</div>
                <p className="text-xs text-gray-500">Based on location trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
