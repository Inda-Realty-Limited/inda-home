import { useState } from "react";
import { X, User, Mail, Phone as PhoneIcon, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { submitInquiry } from "../../../api/channels";

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyPrice: string;
  priceNumeric?: number;
  listingId?: string;
  agentUserId?: string;
}

export function MakeOfferModal({
  isOpen,
  onClose,
  propertyName,
  propertyPrice,
  priceNumeric,
  listingId,
  agentUserId
}: MakeOfferModalProps) {
  const [offerAmount, setOfferAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentInfo, setAgentInfo] = useState<{ phone: string | null; name: string } | null>(null);

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
    setAgentInfo(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!offerAmount || !fullName || !email || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate we have agent info to submit to
    if (!agentUserId) {
      setError("Unable to submit offer - property agent information not available");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format the offer message with offer amount
      const offerAmountFormatted = `₦${parseInt(offerAmount).toLocaleString()}`;
      const fullMessage = `OFFER: ${offerAmountFormatted} for ${propertyName}${message ? `\n\nAdditional message: ${message}` : ""}`;

      const response = await submitInquiry({
        agentUserId,
        channel: "property_offer",
        name: fullName,
        email,
        phone,
        message: fullMessage,
        listingId
      });

      setAgentInfo({
        phone: response.agentPhone,
        name: response.agentName
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to submit offer:", err);
      setError(err?.response?.data?.message || "Failed to submit offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!agentInfo?.phone) return null;
    const offerAmountFormatted = `₦${parseInt(offerAmount).toLocaleString()}`;
    const whatsappMessage = encodeURIComponent(
      `Hi ${agentInfo.name}, I just submitted an offer of ${offerAmountFormatted} for ${propertyName} on Inda. I'd like to discuss this further.`
    );
    return `https://wa.me/${agentInfo.phone.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;
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
              Your offer of ₦{parseInt(offerAmount).toLocaleString()} for {propertyName} has been sent to {agentInfo?.name || "the agent"}.
            </p>

            {agentInfo?.phone && (
              <a
                href={getWhatsAppLink() || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            )}

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
