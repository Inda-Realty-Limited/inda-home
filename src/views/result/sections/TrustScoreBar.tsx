import React from "react";

type Props = {
  trustScore: number | null;
  displayScore: number; // animated value
};

const TrustScoreBar: React.FC<Props> = ({ trustScore, displayScore }) => {
  return (
    <div className="w-full px-6 my-6 relative z-20">
      <div className="rounded-2xl p-6 md:p-8 bg-[#4EA8A1] border-2 border-[#4EA8A1]/20 shadow-sm">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <span className="text-lg md:text-xl font-semibold text-[#ffffff]">
            Inda Trust Score
          </span>
          <span className="text-lg md:text-xl font-bold tabular-nums text-[#ffffff]">
            {trustScore !== null ? `${displayScore}%` : "—"}
          </span>
        </div>
        <div className="w-full h-4 bg-[#10182033] rounded-full overflow-hidden">
          <div
            className="h-4 rounded-full transition-[width] duration-200 ease-out bg-[#ffffff]"
            style={{
              width: `${trustScore !== null ? displayScore : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrustScoreBar;
