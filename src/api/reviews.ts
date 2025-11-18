import apiClient from ".";

// TypeScript interfaces
export interface SubmitReviewRequest {
  listingUrl: string;
  isPropertySpecific: boolean;
  ratings: {
    trustLevel: number;
    valueForMoney: number;
    locationAccuracy: number;
    disclosedHiddenFees: number;
  };
  detailedFeedback: string;
  tags: string[];
  listingId?: string;
  transactionDate?: string;
  transactionType?: "Bought" | "Visited" | "Inquired Only";
  media?: File[];
}

export interface Review {
  id: string;
  reviewer: {
    name: string;
    initials: string;
    isVerified: boolean;
  };
  isPropertySpecific: boolean;
  transactionType?: string;
  ratings: {
    trustLevel: number;
    valueForMoney: number;
    locationAccuracy: number;
    disclosedHiddenFees: number;
    averageRating: number;
  };
  content: string;
  tags: string[];
  mediaUrls: string[];
  helpfulCount: number;
  timeAgo: string;
  createdAt: string;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Array<{ stars: number; count: number; percentage: number }>;
  commonTags: Array<{ tag: string; count: number }>;
}

export interface GetReviewsResponse {
  status: string;
  data: {
    reviews: Review[];
    summary: ReviewSummary;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
      limit: number;
    };
  };
}

export interface SubmitReviewResponse {
  status: string;
  message: string;
  data: {
    reviewId: string;
    listingId: string;
    userId: string;
    listingUrl: string;
    isPropertySpecific: boolean;
    transactionDate?: string;
    transactionType?: string;
    ratings: {
      trustLevel: number;
      valueForMoney: number;
      locationAccuracy: number;
      disclosedHiddenFees: number;
      averageRating: number;
    };
    detailedFeedback: string;
    tags: string[];
    mediaUrls: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MyReview {
  id: string;
  listingUrl: string;
  listingTitle: string;
  ratings: {
    averageRating: number;
  };
  detailedFeedback: string;
  status: "pending_moderation" | "approved" | "rejected";
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMyReviewsResponse {
  status: string;
  data: {
    reviews: MyReview[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
      limit: number;
    };
  };
}

// API functions

/**
 * Submit a property review
 */
export const submitReview = async (
  reviewData: SubmitReviewRequest
): Promise<SubmitReviewResponse> => {
  const hasMedia = reviewData.media && reviewData.media.length > 0;

  if (hasMedia) {
    // Use FormData for file uploads
    const formData = new FormData();

    // Required fields
    formData.append("listingUrl", reviewData.listingUrl);
    formData.append("isPropertySpecific", String(reviewData.isPropertySpecific));
    
    // Ratings as nested object
    formData.append("ratings[trustLevel]", String(reviewData.ratings.trustLevel));
    formData.append("ratings[valueForMoney]", String(reviewData.ratings.valueForMoney));
    formData.append("ratings[locationAccuracy]", String(reviewData.ratings.locationAccuracy));
    formData.append("ratings[disclosedHiddenFees]", String(reviewData.ratings.disclosedHiddenFees));
    
    formData.append("detailedFeedback", reviewData.detailedFeedback);

    // Optional fields
    if (reviewData.listingId) {
      formData.append("listingId", reviewData.listingId);
    }
    if (reviewData.transactionDate) {
      formData.append("transactionDate", reviewData.transactionDate);
    }
    if (reviewData.transactionType) {
      formData.append("transactionType", reviewData.transactionType);
    }

    // Tags array
    if (reviewData.tags && reviewData.tags.length > 0) {
      reviewData.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
    }

    // Media files
    reviewData.media.forEach((file) => {
      formData.append("media", file);
    });

    // Axios automatically sets correct Content-Type with boundary
    const response = await apiClient.post<SubmitReviewResponse>("/reviews", formData);
    return response.data;
  } else {
    // Use JSON for requests without files
    const payload = {
      listingUrl: reviewData.listingUrl,
      listingId: reviewData.listingId,
      isPropertySpecific: reviewData.isPropertySpecific,
      ratings: {
        trustLevel: reviewData.ratings.trustLevel,
        valueForMoney: reviewData.ratings.valueForMoney,
        locationAccuracy: reviewData.ratings.locationAccuracy,
        disclosedHiddenFees: reviewData.ratings.disclosedHiddenFees,
      },
      detailedFeedback: reviewData.detailedFeedback,
      tags: reviewData.tags || [],
      transactionDate: reviewData.transactionDate,
      transactionType: reviewData.transactionType,
    };

    const response = await apiClient.post<SubmitReviewResponse>("/reviews", payload);
    return response.data;
  }
};

/**
 * Get reviews for a specific listing
 */
export const getReviewsByListing = async (
  listingUrl: string,
  page: number = 1,
  limit: number = 10,
  sortBy: "recent" | "rating" | "helpful" = "recent"
): Promise<GetReviewsResponse> => {
  const response = await apiClient.get<GetReviewsResponse>("/reviews/by-listing", {
    params: {
      url: listingUrl,
      page,
      limit,
      sortBy,
    },
  });

  return response.data;
};

/**
 * Get user's own reviews
 */
export const getMyReviews = async (
  page: number = 1,
  limit: number = 10,
  status: "all" | "approved" | "pending_moderation" | "rejected" = "all"
): Promise<GetMyReviewsResponse> => {
  const response = await apiClient.get<GetMyReviewsResponse>("/reviews/my-reviews", {
    params: {
      page,
      limit,
      status,
    },
  });

  return response.data;
};

/**
 * Update a review
 */
export const updateReview = async (
  reviewId: string,
  updates: {
    ratings?: Partial<SubmitReviewRequest["ratings"]>;
    detailedFeedback?: string;
    tags?: string[];
  }
): Promise<{ status: string; message: string; data: any }> => {
  const response = await apiClient.patch(`/reviews/${reviewId}`, updates);
  return response.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (
  reviewId: string
): Promise<{ status: string; message: string }> => {
  const response = await apiClient.delete(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Mark a review as helpful (toggle)
 */
export const toggleReviewHelpful = async (
  reviewId: string
): Promise<{ status: string; message: string; data: { helpfulCount: number } }> => {
  const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
  return response.data;
};

