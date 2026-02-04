import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { X, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { startListingPayment } from "@/api/payments";
import { PaymentPlan } from "@/types/questionnaire";

interface DueDiligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyPrice: string;
  propertyAddress?: string;
  listingId?: string;
  listingUrl?: string;
  tier: 'deep' | 'deeper';
  onTierChange: (tier: 'deep' | 'deeper') => void;
}

export function DueDiligenceModal({
  isOpen,
  onClose,
  propertyName,
  propertyPrice,
  propertyAddress,
  listingId,
  listingUrl,
  tier,
  onTierChange
}: DueDiligenceModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
        email: prev.email || user.email || "",
        phone: prev.phone || (user as any).phoneNumber || (user as any).phone || ""
      }));
    }
  }, [user]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(formData.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    // Check if user is logged in
    if (!user) {
      const returnPath = encodeURIComponent(router.asPath || "/");
      router.push(`/auth/signin?returnTo=${returnPath}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const plan: PaymentPlan = tier === 'deep' ? 'deepDive' : 'deeperDive';

      // Build callback URL
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const callbackPath = `/order/received?plan=${plan}&q=${encodeURIComponent(listingUrl || propertyName)}`;
      const callbackUrl = origin ? `${origin}${callbackPath}` : undefined;

      // Build payload
      const payload = {
        plan,
        listingId: listingId || undefined,
        listingUrl: listingUrl || undefined,
        callbackUrl,
        questionnaire: {
          propertyBasics: {
            propertyAddress: propertyAddress || propertyName,
            propertyDescription: `${tier === 'deep' ? 'Deep' : 'Deeper'} Dive verification request for ${propertyName}`,
            propertyCategory: "residential",
            propertyType: "property",
            propertyStatus: "existing",
            listingUrl: listingUrl || undefined
          },
          legalDocuments: {},
          buyerInformation: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phone.trim(),
            notes: formData.notes.trim() || undefined
          },
          metadata: {
            formVersion: "due-diligence-modal-v1",
            uiPath: "property-details/DueDiligenceModal",
            propertyName,
            propertyPrice,
            ...(listingId && { listingId }),
            ...(listingUrl && { listingUrl })
          }
        }
      };

      const response = await startListingPayment(payload);

      // Check if already paid
      if (response.alreadyPaid) {
        const reference = response.reference || response.payment?.reference || "";
        const params = new URLSearchParams({ plan, q: listingUrl || propertyName });
        if (reference) params.set("reference", reference);
        router.push(`/order/received?${params.toString()}`);
        return;
      }

      // Redirect to payment
      const redirectUrl =
        response.authorizationUrl ||
        response.payment?.authorizationUrl ||
        response.payment?.initResponse?.data?.link;

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // Fallback if no redirect URL
      setError("Payment initialization failed. Please try again or contact support.");
    } catch (err: any) {
      console.error("Payment error:", err);
      console.error("Payment error details:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        data: err?.response?.data
      });

      let message = "Something went wrong. Please try again.";
      if (err?.response?.status === 404) {
        message = "Payment service unavailable. Please try again later or contact support.";
      } else if (err?.response?.status === 401) {
        message = "Please sign in to continue.";
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="+234 800 000 0000"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Any specific concerns or areas you'd like us to focus on?"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Order Report - {price}
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Payment via card or bank transfer - Full refund if we can&apos;t complete the report - Secure &amp; confidential
          </p>
        </div>
      </div>
    </div>
  );
}