import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle, Send, CheckCircle2 } from "lucide-react";
import { DisputeService } from "@/api/listing-hub";

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
  listingId: string;
  userId?: string;
  onSubmitSuccess?: (disputeId: string) => void;
  onSubmitError?: (error: string) => void;
}

export function DisputeReportSection({
  listingId,
  userId,
  onSubmitSuccess,
  onSubmitError
}: DisputeReportSectionProps) {
  const [category, setCategory] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disputeId, setDisputeId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !explanation.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await DisputeService.submit({
        listingId,
        category,
        explanation: explanation.trim(),
        userId
      });

      if (response.success) {
        setIsSubmitted(true);
        setDisputeId(response.data?.id || null);
        setCategory('');
        setExplanation('');

        if (onSubmitSuccess && response.data?.id) {
          onSubmitSuccess(response.data.id);
        }

        // Reset success message after 10 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setDisputeId(null);
        }, 10000);
      } else {
        throw new Error(response.message || 'Failed to submit dispute');
      }
    } catch (err: any) {
      console.error('Error submitting dispute:', err);
      const errorMessage = err.message || 'Failed to submit dispute. Please try again.';
      setError(errorMessage);
      if (onSubmitError) {
        onSubmitError(errorMessage);
      }
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Your dispute has been submitted successfully.</p>
              <p className="text-green-600 text-sm mt-1">
                Our team will review it within 24-48 hours and you'll be notified of any updates.
              </p>
              {disputeId && (
                <p className="text-green-600 text-xs mt-2">
                  Reference ID: <span className="font-mono">{disputeId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

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
            <p className="text-xs text-gray-500 mt-1">
              Please be as specific as possible to help us resolve your dispute quickly.
            </p>
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
