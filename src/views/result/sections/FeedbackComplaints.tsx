import React from "react";
import { FaStar } from "react-icons/fa";

type Props = {
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
  average,
  total,
  breakdown,
  reviews,
  aiSummary,
}) => {
  const avg = average ?? 0;
  const count = total ?? 0;
  const bars =
    breakdown ?? [5, 4, 3, 2, 1].map((s) => ({ stars: s, percentage: 0 }));
  return (
    <div className="w-full px-6">
      <div className="rounded-lg p-6 sm:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-inda-teal">
          Feedback & Complaints
        </h3>
        <div>
          <div className="bg-[#E5E5E566] rounded-2xl p-4 sm:p-6 mb-6">
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

          <div className="space-y-4 sm:space-y-6">
            <h1 className="font-bold text-lg sm:text-xl">Reviews</h1>
            {!reviews || reviews.length === 0 ? (
              <div className="w-full border border-[#4EA8A1] rounded-2xl min-h-40 sm:min-h-56 md:min-h-64 flex items-center justify-center px-4">
                <p className="text-center text-base sm:text-lg font-medium">
                  No Reviews Yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">
                        {r.title || r.reviewer || "Review"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.timeAgo || r.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            (r.rating ?? 0) > i
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-700">{r.content}</div>
                  </div>
                ))}
              </div>
            )}
            <button className="text-[#4EA8A1] text-base sm:text-lg font-semibold hover:underline">
              Report Your Experience here &lt;&lt;
            </button>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 border-top border-gray-200">
            <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-inda-teal">
              AI Summary
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {aiSummary || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackComplaints;
