import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle, Send } from "lucide-react";

const DISPUTE_CATEGORIES = [
  { value: '', label: '-- Select a category --' },
  { value: 'ai-recommendation', label: 'AI Recommendation (Improvements)' },
  { value: 'extracted-data', label: 'Extracted Document Data (Title, Survey, etc.)' },
  { value: 'market-analysis', label: 'Market Analysis & Pricing' },
  { value: 'risk-assessment', label: 'Risk Assessment' },
  { value: 'property-valuation', label: 'Property Valuation' },
  { value: 'location-amenities', label: 'Location & Amenities Analysis' },
  { value: 'financial-projections', label: 'Financial Projections' },
  { value: 'other', label: 'Other / General Feedback' }
];

interface DisputeReportSectionProps {
  onSubmit?: (data: { category: string; explanation: string }) => void;
}

export function DisputeReportSection({ onSubmit }: DisputeReportSectionProps) {
  const [category, setCategory] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !explanation.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit({ category, explanation });
      } else {
        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Dispute submitted:', { category, explanation });
      }

      setIsSubmitted(true);
      setCategory('');
      setExplanation('');

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting dispute:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-red-50 border-red-100 p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-full">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Dispute Report Information</h3>
          <p className="text-sm text-gray-600 mt-1">
            Found incorrect AI analysis, data extraction, or recommendations? Let us know so we can review and correct it.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">Your dispute has been submitted successfully.</p>
          <p className="text-green-600 text-sm mt-1">We'll review it within 24-48 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What are you disputing?
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              {DISPUTE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Explanation Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Explain what's incorrect and provide the correct information:
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Example: The AI extracted the title registration date as 2015, but the actual date on the document is 2018. Please review page 3 of the title document."
              rows={4}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button & Response Time */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!category || !explanation.trim() || isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
            </button>
            <span className="text-sm text-gray-500">
              Response time: <span className="font-medium text-gray-700">24-48 hours</span>
            </span>
          </div>
        </form>
      )}
    </Card>
  );
}
