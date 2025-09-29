import React, { useState } from "react";

export interface AISummariesProps {
  summaries: string[];
  title?: string;
  className?: string;
}

export const AISummaries: React.FC<AISummariesProps> = ({
  summaries,
  title = "AI summary",
  className,
}) => {
  const [idx, setIdx] = useState(0);
  const active = summaries[idx] ?? "—";
  return (
    <section className={className}>
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#0A1A22]">{title}</h3>
          {summaries.length > 1 && (
            <div className="flex items-center gap-2">
              {summaries.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Summary ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === idx ? "bg-[#0A1A22]" : "bg-black/10"
                  }`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-[#101820] leading-relaxed">{active}</p>
      </div>
    </section>
  );
};

export default AISummaries;
