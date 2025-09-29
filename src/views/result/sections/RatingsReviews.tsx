import React from "react";

export interface RatingBreakdownItem {
  stars: number; // 1-5
  percentage: number; // 0-100
}

export interface ReviewItem {
  id: string;
  reviewer: string;
  location?: string;
  timeAgo?: string;
  rating: number;
  title?: string;
  content: string;
}

export interface RatingsReviewsProps {
  overall: number; // e.g., 4.2
  total: number; // e.g., 128
  breakdown: RatingBreakdownItem[];
  reviews: ReviewItem[];
  className?: string;
}

export const RatingsReviews: React.FC<RatingsReviewsProps> = ({
  overall,
  total,
  breakdown,
  reviews,
  className,
}) => {
  return (
    <section className={className}>
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-3xl font-semibold text-[#0A1A22]">
              {overall.toFixed(1)}
              <span className="text-base text-[#6B7A88]">/5</span>
            </div>
            <div className="text-xs text-[#3D4C59]">
              Based on {total} reviews
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2">
            {breakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-2">
                <span className="text-xs text-[#3D4C59] w-8 text-right">
                  {b.stars}★
                </span>
                <div className="h-2 flex-1 rounded-full bg-black/5 overflow-hidden">
                  <div
                    className="h-full bg-[#4EA8A1]"
                    style={{
                      width: `${Math.max(0, Math.min(100, b.percentage))}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-[#6B7A88] w-8">
                  {b.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 divide-y divide-black/5">
          {reviews.map((r) => (
            <article key={r.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[#0A1A22]">
                  {r.reviewer}
                  {r.location ? (
                    <span className="text-[#6B7A88] font-normal">
                      {" "}
                      · {r.location}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-[#6B7A88]">{r.timeAgo}</div>
              </div>
              {r.title && (
                <div className="mt-1 text-sm font-semibold text-[#0A1A22]">
                  {r.title}
                </div>
              )}
              <div className="mt-1 text-[11px] text-[#6B7A88]">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <p className="mt-2 text-sm text-[#101820] leading-relaxed">
                {r.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RatingsReviews;
