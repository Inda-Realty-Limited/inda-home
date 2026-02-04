import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Download } from "lucide-react";

interface ComprehensiveBalancedReportProps {
  property: any;
  onBack: () => void;
  accessLevel: string;
  intelligenceData: any;
}

export function ComprehensiveBalancedReport({ property, onBack, accessLevel, intelligenceData }: ComprehensiveBalancedReportProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-inda-teal text-white rounded-lg hover:bg-inda-teal/90">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
          <p className="text-gray-500">{property.location}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Price</span>
                  <span className="font-bold">₦{intelligenceData.investment_analysis.total_investment_breakdown.purchase_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proj. 5-Year Gain</span>
                  <span className="font-bold text-green-600">+₦{intelligenceData.value_projection.projected_gain_5_year.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Yield</span>
                  <span className="font-bold">{intelligenceData.investment_analysis.annual_rental_income.net_yield_pct}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">District</span>
                  <span className="font-bold">{intelligenceData.location_intelligence.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Schools Nearby</span>
                  <span className="font-bold">{intelligenceData.location_intelligence.nearby_schools.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To Airport</span>
                  <span className="font-bold">{intelligenceData.location_intelligence.accessibility.to_airport_minutes} mins</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
