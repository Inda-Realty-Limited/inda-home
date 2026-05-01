import { X, Video, Calendar, Clock, User, Phone, Mail, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { InquiriesService } from "@/api/inquiries";

interface BookVirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyLocation: string;
  listingId?: string;
  agentUserId?: string;
}

export function BookVirtualTourModal({
  isOpen,
  onClose,
  propertyName,
  propertyLocation,
  listingId,
}: BookVirtualTourModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    platform: "whatsapp",
    numberOfViewers: "1",
    specificAreas: "",
    howDidYouHear: "",
    location: "",
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

    if (!listingId) {
      setError("Unable to submit — listing information not available. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const platformLabel =
        formData.platform === "whatsapp" ? "WhatsApp Video Call" :
        formData.platform === "zoom" ? "Zoom" :
        formData.platform === "google-meet" ? "Google Meet" : "FaceTime";

      const tourDetails = [
        `Virtual tour via ${platformLabel}`,
        `Viewers: ${formData.numberOfViewers}`,
        formData.location ? `Calling from: ${formData.location}` : null,
        formData.specificAreas ? `Focus areas: ${formData.specificAreas}` : null,
        formData.howDidYouHear ? `How they heard: ${formData.howDidYouHear}` : null,
      ].filter(Boolean).join("\n");

      await InquiriesService.createVisitRequest({
        listingId,
        buyerName: formData.fullName,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: tourDetails,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit virtual tour request:", err);
      setError(err?.response?.data?.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      preferredDate: "",
      preferredTime: "",
      platform: "whatsapp",
      numberOfViewers: "1",
      specificAreas: "",
      howDidYouHear: "",
      location: "",
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Virtual Tour Booked!</h2>
            <p className="text-gray-600 mb-4">
              The agent will contact you within 24 hours to confirm your virtual tour of {propertyName}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Check your email ({formData.email}) for confirmation details.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900 mb-1">Book Virtual Tour</h2>
            <p className="text-sm text-gray-600">{propertyName} • {propertyLocation}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="mx-6 mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Video className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-gray-900 text-sm mb-1">Live Video Property Tour</h4>
              <p className="text-xs text-gray-700">
                Perfect for diaspora buyers or busy schedules. Our agent will walk through the property live via video call, showing you every room and answering questions in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-gray-900 mb-4">Your Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number (WhatsApp preferred) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Where are you calling from? *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  placeholder="E.g., London UK, Lagos Nigeria, New York USA"
                />
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div>
            <h3 className="text-gray-900 mb-4">Tour Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Preferred Time (WAT) *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  >
                    <option value="">Select time</option>
                    <option value="9am-11am">9:00 AM – 11:00 AM</option>
                    <option value="11am-1pm">11:00 AM – 1:00 PM</option>
                    <option value="1pm-3pm">1:00 PM – 3:00 PM</option>
                    <option value="3pm-5pm">3:00 PM – 5:00 PM</option>
                    <option value="5pm-7pm">5:00 PM – 7:00 PM (if available)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Video className="w-4 h-4 inline mr-1" />
                  Preferred Video Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                >
                  <option value="whatsapp">WhatsApp Video Call (Recommended)</option>
                  <option value="zoom">Zoom</option>
                  <option value="google-meet">Google Meet</option>
                  <option value="facetime">FaceTime (iOS only)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  WhatsApp is fastest and doesn&apos;t require app installation
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Number of Viewers
                </label>
                <select
                  name="numberOfViewers"
                  value={formData.numberOfViewers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                >
                  <option value="1">Just me</option>
                  <option value="2">2 people (spouse/partner)</option>
                  <option value="3">3 people</option>
                  <option value="4+">4+ people (family/team)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Specific Areas or Features to Focus On (Optional)
                </label>
                <textarea
                  name="specificAreas"
                  value={formData.specificAreas}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                  placeholder="E.g., Show me the kitchen, master bedroom view, parking space..."
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal"
                >
                  <option value="">Select option</option>
                  <option value="inda-search">Inda search/browsing</option>
                  <option value="social-media">Social media (Instagram, Twitter, etc.)</option>
                  <option value="friend-referral">Friend/family referral</option>
                  <option value="agent">Real estate agent</option>
                  <option value="google">Google search</option>
                  <option value="whatsapp">WhatsApp link</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
            <p>✓ Tours typically last 20–30 minutes. Ask questions anytime during the tour.</p>
            <p>✓ You&apos;ll receive a meeting link 1 hour before the scheduled time.</p>
            <p>✓ Recording is allowed for personal reference only.</p>
            <p>✓ Can&apos;t make the scheduled time? We&apos;ll work with you to reschedule.</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-inda-teal text-white rounded-lg hover:bg-inda-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Book Virtual Tour"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
