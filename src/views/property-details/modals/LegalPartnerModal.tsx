import { useState } from "react";
import { X, Check, Phone } from "lucide-react";
import { InquiriesService } from "@/api/inquiries";

interface LegalPartnerProperty {
  id?: string;
  name?: string;
  location?: string;
}

interface LegalPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: LegalPartnerProperty;
}

export function LegalPartnerModal({ isOpen, onClose, property }: LegalPartnerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    needs: "",
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await InquiriesService.createLegalPartnerRequest({
        listingId: property.id,
        propertyName: property.name,
        propertyAddress: property.location,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        needs: formData.needs || undefined,
        agreed: formData.agreed,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Legal partner request failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to submit request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      needs: "",
      agreed: false,
    });
    setIsSubmitting(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">Request Received!</h2>
            <p className="mb-6 text-gray-600">Thanks {formData.name}! We&apos;ve received your request.</p>

            <div className="mb-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 text-left">
              <p className="mb-4 font-bold text-gray-900">What happens next:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4ea8a1] font-bold text-white">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">We&apos;ll call you within 24 hours</p>
                    <p className="mt-0.5 text-xs text-gray-600">Our legal partner will reach out</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4ea8a1] font-bold text-white">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Discuss your needs &amp; get a quote</p>
                    <p className="mt-0.5 text-xs text-gray-600">Transparent pricing, no hidden fees</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4ea8a1] font-bold text-white">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">You decide if you want to proceed</p>
                    <p className="mt-0.5 text-xs text-gray-600">No pressure, totally your call</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-amber-700" />
                <p className="text-sm text-amber-800">
                  Expect a call from: <strong className="font-bold">0800-INDA-LAW</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-[#4ea8a1] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#3d9691]"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="relative my-8 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4ea8a1]/10">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Connect with Legal Partner</h2>
              <p className="text-sm text-gray-600">Get expert help for your property purchase</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <p className="mb-3 text-sm font-bold text-gray-900">Get expert help with:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Title verification",
                "Document review",
                "Contract drafting",
                "Due diligence",
                "Purchase agreement",
                "Legal representation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-blue-200 pt-3">
              <p className="text-xs text-gray-700">
                <strong className="font-bold">Starting from ₦150,000</strong> • Our verified legal partners handle everything
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#4ea8a1]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#4ea8a1]"
                placeholder="+234 800 000 0000"
              />
              <p className="mt-1 text-xs text-gray-500">We&apos;ll call you on this number within 24 hours</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#4ea8a1]"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                What do you need help with?
              </label>
              <textarea
                rows={4}
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#4ea8a1]"
                placeholder="e.g., I need help verifying the C of O for this property and reviewing the purchase agreement"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <input
                  id="legal-consent"
                  type="checkbox"
                  required
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4ea8a1] focus:ring-[#4ea8a1]"
                />
                <label htmlFor="legal-consent" className="text-xs text-gray-700">
                  I agree to be contacted by Inda&apos;s verified legal partners regarding my request.
                  I understand they will call me to discuss my needs and provide a quote.
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.agreed || !formData.name || !formData.phone || isSubmitting}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#4ea8a1] to-[#3d8780] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-[#3d9691] hover:to-[#2d6660] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? "Submitting..." : "Connect Me"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
