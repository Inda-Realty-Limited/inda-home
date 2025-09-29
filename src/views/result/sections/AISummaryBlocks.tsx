import React from "react";

type Props = { aiReport?: any };

const AISummaryBlocks: React.FC<Props> = ({ aiReport }) => {
  const ai = aiReport || {};
  const items = [
    { key: "titleSafety", label: "Title Safety" },
    { key: "marketValue", label: "Market Value" },
    { key: "sellerCredibility", label: "Seller Credibility" },
    { key: "microlocation", label: "Microlocation" },
    { key: "roi", label: "ROI" },
  ];
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 w-full px-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg lg:text-xl font-bold text-inda-teal">
          AI Summary
        </h4>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => {
          const sec = ai?.[it.key] || {};
          const badge = sec?.label || "—";
          const summary = sec?.summary || "—";
          const next = sec?.nextStep;
          return (
            <div
              key={it.key}
              className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-[#0A655E]">{it.label}</div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#E5F4F2] text-[#0A655E] border border-[#4EA8A1]/20">
                  {badge}
                </span>
              </div>
              <p className="text-sm text-[#101820]/80 leading-relaxed">
                {summary}
              </p>
              {next && (
                <div className="mt-2 text-xs text-[#101820]/60">
                  Next: {next}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AISummaryBlocks;
