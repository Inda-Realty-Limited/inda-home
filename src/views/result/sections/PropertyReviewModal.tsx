import React, { useState } from "react";
import Modal from "@/components/inc/Modal";
import { submitReview } from "@/api/reviews";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  propertyUrl?: string;
  listingId?: string;
  onSuccess?: () => void;
};

const PropertyReviewModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  propertyUrl, 
  listingId,
  onSuccess 
}) => {
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reviewingProperty: "",
    transactionDate: "",
    transactionType: "",
    trustLevel: 5,
    valueForMoney: 5,
    locationAccuracy: 5,
    disclosedHiddenFees: 5,
    detailedFeedback: "",
    tags: [] as string[],
    otherTag: "",
    uploadedFiles: [] as File[],
  });

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSliderChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isAuthenticated) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (!propertyUrl) {
      toast.error("Property URL is required");
      return;
    }

    if (!formData.reviewingProperty) {
      toast.error("Please answer if you're reviewing this specific property");
      return;
    }

    if (formData.detailedFeedback.length < 10) {
      toast.error("Feedback must be at least 10 characters");
      return;
    }

    if (formData.detailedFeedback.length > 2000) {
      toast.error("Feedback must be less than 2000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare tags array
      const allTags = [...formData.tags];
      if (formData.otherTag.trim()) {
        allTags.push(formData.otherTag.trim());
      }

      // Submit review
      const result = await submitReview({
        listingUrl: propertyUrl,
        listingId: listingId,
        isPropertySpecific: formData.reviewingProperty === "yes",
        ratings: {
          trustLevel: formData.trustLevel,
          valueForMoney: formData.valueForMoney,
          locationAccuracy: formData.locationAccuracy,
          disclosedHiddenFees: formData.disclosedHiddenFees,
        },
        detailedFeedback: formData.detailedFeedback,
        tags: allTags,
        transactionDate: formData.transactionDate || undefined,
        transactionType: formData.transactionType || undefined,
        media: formData.uploadedFiles.length > 0 ? formData.uploadedFiles : undefined,
      });

      toast.success(result.message || "Review submitted successfully!");
      
      // Reset form
      setFormData({
        reviewingProperty: "",
        transactionDate: "",
        transactionType: "",
        trustLevel: 5,
        valueForMoney: 5,
        locationAccuracy: 5,
        disclosedHiddenFees: 5,
        detailedFeedback: "",
        tags: [],
        otherTag: "",
        uploadedFiles: [],
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      
      // Handle specific error cases
      if (error.response?.status === 429) {
        toast.error(error.response.data.message || "You've reached your review limit for today");
      } else if (error.response?.status === 401) {
        toast.error("Please log in to submit a review");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Please check your review details");
      } else {
        toast.error(error.message || "Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Leave a Property Review
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Share your experience to help others make informed decisions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Are you reviewing this particular property? */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Are you reviewing this particular property?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, reviewingProperty: "yes" }))}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  formData.reviewingProperty === "yes"
                    ? "bg-inda-teal text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, reviewingProperty: "no" }))}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  formData.reviewingProperty === "no"
                    ? "bg-inda-teal text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Transaction Date (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Transaction Date (Optional)
            </label>
            <input
              type="date"
              value={formData.transactionDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, transactionDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-inda-teal focus:border-transparent"
              placeholder="Select date"
            />
            <div className="flex gap-3 mt-3">
              {["Bought", "Visited", "Inquired Only"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, transactionType: type }))}
                  className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                    formData.transactionType === type
                      ? "bg-inda-teal text-white border-inda-teal"
                      : "bg-white text-gray-700 border-gray-300 hover:border-inda-teal"
                  }`}
                >
                  {type === "Bought" && "🏠 "}
                  {type === "Visited" && "👀 "}
                  {type === "Inquired Only" && "📞 "}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Your Experience */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rate Your Experience</h3>
            <div className="space-y-4">
              {[
                { label: "Trust Level", field: "trustLevel" },
                { label: "Value for Money", field: "valueForMoney" },
                { label: "Location Accuracy", field: "locationAccuracy" },
                { label: "Disclosed Hidden Fees", field: "disclosedHiddenFees" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-900">{label}</label>
                    <span className="text-sm font-semibold text-gray-700">
                      {formData[field as keyof typeof formData]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData[field as keyof typeof formData] as number}
                    onChange={(e) => handleSliderChange(field, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-teal"
                    style={{
                      background: `linear-gradient(to right, #4EA8A1 0%, #4EA8A1 ${
                        ((formData[field as keyof typeof formData] as number) - 1) * 25
                      }%, #E5E7EB ${
                        ((formData[field as keyof typeof formData] as number) - 1) * 25
                      }%, #E5E7EB 100%)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Detailed Feedback
              </label>
              <span className={`text-xs ${
                formData.detailedFeedback.length < 10 
                  ? "text-red-500" 
                  : formData.detailedFeedback.length > 2000 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}>
                {formData.detailedFeedback.length}/2000 characters
                {formData.detailedFeedback.length < 10 && " (min 10)"}
              </span>
            </div>
            <textarea
              value={formData.detailedFeedback}
              onChange={(e) => setFormData((prev) => ({ ...prev, detailedFeedback: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-inda-teal focus:border-transparent resize-none"
              placeholder="Share your experience in detail... (minimum 10 characters)"
              maxLength={2000}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Tags</label>
            <div className="space-y-2">
              {[
                "Hidden Charges",
                "Accurate Photos",
                "Bad Agent Behavior",
                "Great Investment",
              ].map((tag) => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="w-4 h-4 text-inda-teal border-gray-300 rounded focus:ring-inda-teal"
                  />
                  <span className="text-sm text-gray-900">{tag}</span>
                </label>
              ))}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.otherTag !== ""}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setFormData((prev) => ({ ...prev, otherTag: "" }));
                    }
                  }}
                  className="w-4 h-4 text-inda-teal border-gray-300 rounded focus:ring-inda-teal"
                />
                <input
                  type="text"
                  value={formData.otherTag}
                  onChange={(e) => setFormData((prev) => ({ ...prev, otherTag: e.target.value }))}
                  placeholder="Other"
                  className="flex-1 px-3 py-1 text-sm border-b border-gray-300 focus:border-inda-teal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Upload Media (Optional) */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-1 text-center">Upload Media (Optional)</h4>
            <p className="text-sm text-gray-600 mb-4 text-center">Add photos or videos to your review</p>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Upload button */}
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                Upload
              </button>
            </div>

            {/* Display uploaded files */}
            {formData.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {formData.uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {file.type.startsWith("image/") ? (
                        <svg className="w-5 h-5 text-inda-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-inda-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                      aria-label="Remove file"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.reviewingProperty || formData.detailedFeedback.length < 10}
            className={`w-full py-3 font-semibold rounded-lg transition-colors ${
              isSubmitting || !formData.reviewingProperty || formData.detailedFeedback.length < 10
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-inda-teal text-white hover:bg-inda-teal/90"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .slider-thumb-teal::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4ea8a1;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider-thumb-teal::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #4ea8a1;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Modal>
  );
};

export default PropertyReviewModal;

