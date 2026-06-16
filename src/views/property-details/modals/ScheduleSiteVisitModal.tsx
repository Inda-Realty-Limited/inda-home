import { X, Calendar, Clock, User, Phone, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { InquiriesService } from "@/api/inquiries";
import { getAnalyticsContext } from "@/utils/analytics";

interface ScheduleSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyLocation: string;
  listingId: string;
}

export function ScheduleSiteVisitModal({
  isOpen,
  onClose,
  propertyName,
  propertyLocation,
  listingId,
}: ScheduleSiteVisitModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    visitType: "individual",
    numberOfPeople: "1",
    specificQuestions: "",
    howDidYouHear: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const analytics = getAnalyticsContext(listingId);
      const notes = [
        `Visit Type: ${formData.visitType}`,
        formData.visitType !== "individual" ? `Number of People: ${formData.numberOfPeople}` : null,
        formData.specificQuestions ? `Questions/Focus Areas: ${formData.specificQuestions}` : null,
        formData.howDidYouHear ? `How they heard about property: ${formData.howDidYouHear}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await InquiriesService.createVisitRequest({
        listingId,
        buyerName: formData.fullName,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: notes || undefined,
        requestType: "PHYSICAL_VISIT",
        visitorId: analytics.visitorId,
        sessionId: analytics.sessionId,
        source: analytics.source,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit site visit request:", err);
      setError(err?.response?.data?.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      preferredDate: "",
      preferredTime: "",
      visitType: "individual",
      numberOfPeople: "1",
      specificQuestions: "",
      howDidYouHear: "",
    });
    setSubmitted(false);
    setIsSubmitting(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
        <div className="flex min-h-full items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Visit Request Submitted!</h2>
              <p className="text-gray-600 mb-6">
                The agent will contact you within 24 hours to confirm your site visit at {propertyName}.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Check your email ({formData.email}) for confirmation details.
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-6">
      <div className="flex min-h-full items-start justify-center py-4 sm:items-center sm:py-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-4rem)]">
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-gray-900 mb-1">Schedule Site Visit</h2>
              <p className="text-sm text-gray-600">
                {propertyName} • {propertyLocation}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <h4 className="text-gray-900 text-sm mb-1">Important Notice</h4>
                  <p className="text-xs text-gray-700">
                    Site visits must be scheduled at least 24 hours in advance. Same-day bookings are not available to ensure proper preparation and security clearance.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <h3 className="text-gray-900 mb-4">Your Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      <User className="mr-1 inline h-4 w-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      <Phone className="mr-1 inline h-4 w-4" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      <Mail className="mr-1 inline h-4 w-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-4">Visit Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        <Calendar className="mr-1 inline h-4 w-4" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={getMinDate()}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        <Clock className="mr-1 inline h-4 w-4" />
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      >
                        <option value="">Select time</option>
                        <option value="9am-11am">9:00 AM - 11:00 AM</option>
                        <option value="11am-1pm">11:00 AM - 1:00 PM</option>
                        <option value="1pm-3pm">1:00 PM - 3:00 PM</option>
                        <option value="3pm-5pm">3:00 PM - 5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Visit Type *</label>
                    <select
                      name="visitType"
                      value={formData.visitType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                    >
                      <option value="individual">Individual Visit (just me)</option>
                      <option value="family">Family Visit (with family members)</option>
                      <option value="agent">With Real Estate Agent</option>
                      <option value="lawyer">With Lawyer/Legal Advisor</option>
                    </select>
                  </div>

                  {formData.visitType !== "individual" && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Number of People Attending *
                      </label>
                      <select
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      >
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5+">5+ people</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Specific Questions or Areas to Focus On (Optional)
                    </label>
                    <textarea
                      name="specificQuestions"
                      value={formData.specificQuestions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                      placeholder="E.g., Want to see the master bedroom, check plumbing, assess natural lighting..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      How did you hear about this property? *
                    </label>
                    <select
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                    >
                      <option value="">Select option</option>
                      <option value="inda-search">Inda search/browsing</option>
                      <option value="social-media">Social media</option>
                      <option value="friend-referral">Friend/family referral</option>
                      <option value="agent">Real estate agent</option>
                      <option value="google">Google search</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
                <p className="mb-2">
                  ✓ You&apos;ll receive a confirmation email within 24 hours with exact meeting point and security access details.
                </p>
                <p>✓ Please bring a valid ID for security clearance at the estate gate.</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#50b8b1] px-6 py-3 text-white transition-colors hover:bg-[#45a69f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
