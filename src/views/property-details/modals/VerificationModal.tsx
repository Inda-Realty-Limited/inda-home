import { X, Shield, CheckCircle2, Clock } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyPrice: string;
  verificationPaid: boolean;
  onVerificationPaid: (paid: boolean) => void;
}

export function VerificationModal({ isOpen, onClose, propertyName, propertyPrice, onVerificationPaid }: VerificationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onVerificationPaid(true);
    alert('✅ Payment successful! Verification dispatched to gig workers. You\'ll receive an email once the full report is ready (48-72 hours).');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#50b8b1]" />
            <h3 className="text-gray-900">Physical Verification Required</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-6">
            To proceed with your offer for <strong>{propertyName}</strong> at <strong>{propertyPrice}</strong>, we need to verify the following on the ground:
          </p>

          {/* Verification Tasks */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-gray-900 text-sm mb-1">Title Authentication</h4>
                <p className="text-xs text-gray-600">
                  Verify Certificate of Occupancy at Lagos Land Registry
                </p>
                <p className="text-xs text-[#50b8b1] mt-1">Cost: ₦15,000</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-gray-900 text-sm mb-1">Site Inspection</h4>
                <p className="text-xs text-gray-600">
                  Physical visit with 12-photo documentation + construction progress check
                </p>
                <p className="text-xs text-[#50b8b1] mt-1">Cost: ₦20,000</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-gray-900 text-sm mb-1">Land Disputes & Community Check</h4>
                <p className="text-xs text-gray-600">
                  Verify community agreements, talk to local leaders, check dispute history
                </p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#e8f5f4] rounded-lg p-4 mb-6 border border-[#50b8b1]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Total Verification Fee:</span>
              <span className="text-gray-900 text-xl">₦50,000</span>
            </div>
            <p className="text-xs text-gray-600">
              One-time payment • Valid for this property
            </p>
          </div>

          {/* Timeline */}
          <div className="flex items-start gap-2 mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700">
              <strong>Timeline:</strong> Verification dispatched within 24 hours. Full report ready in 48-72 hours.
              <div className="mt-1">📧 You&apos;ll receive an email notification once your report is complete.</div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h4 className="text-sm text-gray-900 mb-2">What you get:</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#50b8b1]">✓</span>
                <span>Registry-verified title documentation with screenshots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#50b8b1]">✓</span>
                <span>Fresh site photos (geo-tagged and timestamped)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#50b8b1]">✓</span>
                <span>Construction progress report (verified % vs developer claim)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#50b8b1]">✓</span>
                <span>Land dispute checks and community safety confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#50b8b1]">✓</span>
                <span>Full verification report (PDF download)</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors"
            >
              Pay ₦50,000 & Verify
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            💡 Verification required before making an offer. Protects you from fraud.
          </p>
        </div>
      </div>
    </div>
  );
}