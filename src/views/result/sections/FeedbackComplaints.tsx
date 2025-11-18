import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import PropertyReviewModal from "./PropertyReviewModal";
import { getReviewsByListing, Review, ReviewSummary } from "@/api/reviews";

type Props = {
  listingUrl?: string;
  listingId?: string;
  // Legacy props (for backward compatibility if needed)
  average?: number | null;
  total?: number | null;
  breakdown?: Array<{ stars: number; percentage: number }>;
  reviews?: Array<{
    id: string | number;
    reviewer?: string;
    title?: string;
    rating?: number;
    content?: string;
    timeAgo?: string;
    location?: string;
  }>;
  aiSummary?: string | null;
};

const FeedbackComplaints: React.FC<Props> = ({
  listingUrl,
  listingId,
  average,
  total,
  breakdown,
  reviews: legacyReviews,
  aiSummary,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Fetch reviews from API
  useEffect(() => {
    if (listingUrl) {
      setIsLoadingReviews(true);
      getReviewsByListing(listingUrl, 1, 10, "recent")
        .then((response) => {
          setApiReviews(response.data.reviews);
          setReviewSummary(response.data.summary);
        })
        .catch((error) => {
          console.error("Failed to load reviews:", error);
        })
        .finally(() => {
          setIsLoadingReviews(false);
        });
    }
  }, [listingUrl]);

  // Use API data if available, otherwise fall back to legacy props
  const reviews = apiReviews.length > 0 ? apiReviews : legacyReviews;
  const avg = reviewSummary?.averageRating ?? average ?? 0;
  const count = reviewSummary?.totalReviews ?? total ?? 0;
  const bars = reviewSummary?.ratingBreakdown
    ? reviewSummary.ratingBreakdown.map((item) => ({
        stars: item.stars,
        percentage: item.percentage,
      }))
    : breakdown ?? [5, 4, 3, 2, 1].map((s) => ({ stars: s, percentage: 0 }));

  const handleReviewSuccess = () => {
    // Refresh reviews after successful submission
    if (listingUrl) {
      getReviewsByListing(listingUrl, 1, 10, "recent")
        .then((response) => {
          setApiReviews(response.data.reviews);
          setReviewSummary(response.data.summary);
        })
        .catch((error) => {
          console.error("Failed to reload reviews:", error);
        });
    }
  };

  return (
    <div className="w-full px-6">
      <div className="rounded-lg bg-white/80 border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-inda-teal">
          Feedback & Complaints
        </h3>
        <div>
          <div className="rounded-2xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center md:items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl sm:text-4xl font-extrabold">
                      {avg.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const active = i < Math.round(avg);
                      return (
                        <FaStar
                          key={i}
                          className={
                            active
                              ? "text-yellow-400 h-6 w-6 sm:h-6 sm:w-6"
                              : "text-gray-300 h-5 w-5 sm:h-6 sm:w-6"
                          }
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs sm:text-sm text-[#0F1417] font-normal">
                    {count} reviews
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {bars.map((b) => (
                  <div key={b.stars} className="flex items-center gap-3">
                    <span className="w-6 sm:w-8 text-xs sm:text-sm text-[#101820]">
                      {b.stars}
                    </span>
                    <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-[#101820]/40 rounded-full"
                        style={{ width: `${b.percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-10 sm:w-12 text-right text-xs sm:text-sm text-[#101820]/65">
                      {b.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl sm:text-2xl text-[#0A1A22]">
                Reviews
              </h1>
            
            </div>

            {!reviews || reviews.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4EA8A1]/5 via-transparent to-[#4EA8A1]/10 rounded-3xl"></div>
                <div className="relative w-full border-2 border-dashed border-[#4EA8A1]/30 rounded-3xl min-h-48 sm:min-h-56 md:min-h-64 flex flex-col items-center justify-center px-6 py-8">
                  <div className="w-16 h-16 bg-[#4EA8A1]/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-[#4EA8A1]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A1A22] mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-center text-base text-gray-600 max-w-md">
                    Be the first to share your experience with this property and
                    help others make informed decisions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reviews.map((r: any, index) => {
                  // Handle both API and legacy review formats
                  const isApiReview = 'ratings' in r && typeof r.ratings === 'object';
                  const reviewerName = isApiReview ? r.reviewer?.name : r.reviewer;
                  const reviewerInitials = isApiReview ? r.reviewer?.initials : (reviewerName || "Rdf").charAt(0).toUpperCase();
                  const rating = isApiReview ? r.ratings?.averageRating : r.rating;
                  const content = isApiReview ? r.content : r.content;
                  const location = isApiReview ? undefined : r.location;
                  const timeAgo = r.timeAgo;
                  const title = isApiReview ? undefined : r.title;
                  const tags = isApiReview ? r.tags : [];

                  return (
                    <div
                      key={r.id}
                      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      {/* Gradient accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4EA8A1] via-[#6BB6B0] to-[#4EA8A1]"></div>

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#4EA8A1] to-[#0A655E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {reviewerInitials}
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#0A1A22] text-base">
                                  {reviewerName || "Anonymousdf"}
                                </h4>
                                {location && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {location}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          {timeAgo && (
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                              {timeAgo}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-lg ${
                                  (rating ?? 0) > i
                                    ? "text-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {rating?.toFixed(1) || 0}/5
                          </span>
                        </div>

                        {/* Title */}
                        {title && (
                          <h5 className="font-semibold text-[#0A1A22] mb-3 text-base leading-tight">
                            "{title}"
                          </h5>
                        )}

                        {/* Content */}
                        <div className="relative mb-4">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {content}
                          </p>
                          {/* Quote decoration */}
                          <div className="absolute -top-2 -left-2 text-4xl text-[#4EA8A1]/20 font-serif leading-none">
                            "
                          </div>
                        </div>

                        {/* Tags */}
                        {tags && tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-inda-teal/10 text-inda-teal text-xs font-medium rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4EA8A1]/0 via-transparent to-[#4EA8A1]/0 group-hover:from-[#4EA8A1]/5 group-hover:to-[#4EA8A1]/10 transition-all duration-300 pointer-events-none rounded-2xl"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 pt-6 border-top border-gray-200">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 text-lg sm:text-xl font-bold text-inda-teal hover:text-inda-teal/80 transition-colors"
            >
              {` Report Your Experience Here`}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
          </div>

          {/* <div className="mt-6 sm:mt-8 pt-6 border-top border-gray-200">
            <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-inda-teal">
              AI Summary
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {aiSummary || "—"}
            </p>
          </div> */}
        </div>
      </div>

      {/* Review Modal */}
      <PropertyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        propertyUrl={listingUrl}
        listingId={listingId}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default FeedbackComplaints;
