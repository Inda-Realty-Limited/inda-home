import { useState } from "react";
import { X, User, Mail, Phone as PhoneIcon, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { InquiriesService } from "@/api/inquiries";

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyPrice: string;
  priceNumeric?: number;
  listingId: string;
}

export function MakeOfferModal({
  isOpen,
  onClose,
  propertyName,
  propertyPrice,
  priceNumeric,
  listingId,
}: MakeOfferModalProps) {
  const [offerAmount, setOfferAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setOfferAmount("");
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!offerAmount || !fullName || !email || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await InquiriesService.createOffer({
        listingId,
        buyerName: fullName,
        buyerEmail: email,
        buyerPhone: phone,
        offerAmount: parseInt(offerAmount),
        message: message || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to submit offer:", err);
      setError(err?.response?.data?.message || "Failed to submit offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
        <div className="bg-white w-full md:max-w-md rounded-xl shadow-2xl">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Offer Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your offer of ₦{parseInt(offerAmount).toLocaleString()} for {propertyName} has been sent to the agent.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>

            <p className="text-xs text-gray-500 mt-4">
              The agent will also receive an email notification about your offer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white w-full md:max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#50b8b1] text-white p-6 rounded-t-xl flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">Make Your Offer</h3>
            <p className="text-sm text-white/90">{propertyName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Current Asking Price */}
            <div className="bg-[#e8f5f4] rounded-lg p-4 border border-[#50b8b1]/20">
              <div className="text-sm text-gray-600 mb-1">Current Asking Price</div>
              <div className="text-gray-900">{propertyPrice}</div>
            </div>

            {/* Your Offer Amount */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Your Offer Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ₦
                </div>
                <input
                  type="text"
                  value={offerAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setOfferAmount(value);
                  }}
                  placeholder="e.g., 40000000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {offerAmount && (
                <p className="text-sm text-gray-600 mt-2">
                  ₦{parseInt(offerAmount).toLocaleString()}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your interest..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!offerAmount || !fullName || !email || !phone || isSubmitting}
              className="flex-1 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Offer"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to be contacted by the property owner or agent.
          </p>
        </div>
      </div>
    </div>
  );
}
