import { X, Shield, CheckCircle2 } from "lucide-react";

interface DueDiligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyPrice: string;
  tier: 'deep' | 'deeper';
  onTierChange: (tier: 'deep' | 'deeper') => void;
}

export function DueDiligenceModal({ isOpen, onClose, propertyName, propertyPrice, tier, onTierChange }: DueDiligenceModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${tier === 'deep' ? 'Deep' : 'Deeper'} Dive report order submitted! Our team will contact you within 24 hours.`);
    onClose();
  };

  const isDeepDive = tier === 'deep';
  const price = isDeepDive ? '₦25,000' : '₦50,000';
  const deliveryTime = isDeepDive ? '5-7 business days' : '10-15 business days';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#50b8b1]" />
            <h2 className="text-gray-900">{isDeepDive ? 'Deep' : 'Deeper'} Dive Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Tier Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => onTierChange('deep')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${isDeepDive
                ? 'border-[#50b8b1] bg-[#e8f5f4]'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="font-semibold text-gray-900 mb-1">Deep Dive</div>
              <div className="text-xs text-gray-600 mb-2">Registry + Legal checks</div>
              <div className="text-[#50b8b1]">₦25K</div>
            </button>
            <button
              onClick={() => onTierChange('deeper')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${!isDeepDive
                ? 'border-[#50b8b1] bg-[#e8f5f4]'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="font-semibold text-gray-900 mb-1">Deeper Dive</div>
              <div className="text-xs text-gray-600 mb-2">Full package + In-person visits</div>
              <div className="text-[#50b8b1]">₦50K</div>
            </button>
          </div>

          {/* Property Info */}
          <div className="bg-[#e8f5f4] rounded-lg p-4 mb-6">
            <h3 className="text-gray-900 mb-1">{propertyName}</h3>
            <p className="text-[#50b8b1]">{propertyPrice}</p>
          </div>

          {/* What's Included */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">What&apos;s Included:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Title Verification & Land Registry Search</p>
                  <p className="text-sm text-gray-600">Comprehensive registry check for liens, encumbrances, and ownership history</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Legal Documentation Review</p>
                  <p className="text-sm text-gray-600">Property lawyer review of C of O, Governor&apos;s Consent, and all relevant documents</p>
                </div>
              </div>

              {!isDeepDive && (
                <>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900">Survey Plan Verification</p>
                      <p className="text-sm text-gray-600">Professional survey to confirm property boundaries match documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900">Structural Inspection</p>
                      <p className="text-sm text-gray-600">Certified structural engineer assessment of foundation, roofing, electrical, and plumbing systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900">Community & Neighborhood Verification</p>
                      <p className="text-sm text-gray-600">On-ground checks with neighbors, Oba/Baale, and local authorities</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900">Comprehensive Report</p>
                  <p className="text-sm text-gray-600">Detailed PDF report with findings, risk assessment, and recommendations ({deliveryTime} delivery)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-[#e8f5f4] to-[#f0fdf4] rounded-lg p-6 mb-6 border-2 border-[#50b8b1]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-900">Total Investment</h3>
              <div className="text-3xl text-[#50b8b1]">{price}</div>
            </div>
            <p className="text-sm text-gray-600">
              One-time fee • {isDeepDive ? 'Registry + Legal verification' : 'Complete verification package'} • Results in {deliveryTime}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                placeholder="+234 800 000 0000"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent resize-none"
                placeholder="Any specific concerns or areas you'd like us to focus on?"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Order Report - {price}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            💡 Payment via bank transfer or card • Full refund if we can&apos;t complete the report • Secure & confidential
          </p>
        </div>
      </div>
    </div>
  );
}