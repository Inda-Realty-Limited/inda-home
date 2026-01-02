import { X, Calendar, Clock, User, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ScheduleSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyLocation: string;
}

export function ScheduleSiteVisitModal({
  isOpen,
  onClose,
  propertyName,
  propertyLocation,
}: ScheduleSiteVisitModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    visitType: "individual", // individual or group
    numberOfPeople: "1",
    specificQuestions: "",
    howDidYouHear: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to backend
    console.log("Site visit request:", formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Visit Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              We'll contact you within 24 hours to confirm your site visit appointment at {propertyName}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Check your email ({formData.email}) for confirmation details.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full px-6 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors"
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
            <h2 className="text-gray-900 mb-1">Schedule Site Visit</h2>
            <p className="text-sm text-gray-600">{propertyName} • {propertyLocation}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice - No Same Day Visits */}
        <div className="mx-6 mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-gray-900 text-sm mb-1">Important Notice</h4>
              <p className="text-xs text-gray-700">
                Site visits must be scheduled at least 24 hours in advance. Same-day bookings are not available to ensure proper preparation and security clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div>
            <h3 className="text-gray-900 mb-4">Visit Details</h3>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Preferred Time *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
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
                <label className="block text-sm text-gray-700 mb-2">
                  Visit Type *
                </label>
                <select
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
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

          {/* Additional Information */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1]"
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

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
            <p className="mb-2">
              ✓ By submitting this request, you agree to Inda's site visit terms and conditions.
            </p>
            <p className="mb-2">
              ✓ You'll receive a confirmation email within 24 hours with exact meeting point and security access details.
            </p>
            <p>
              ✓ Please bring a valid ID for security clearance at the estate gate.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}