import React, { useMemo, useState } from "react";

export interface AmenityItem {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AmenitySectionProps {
  title?: string;
  items: AmenityItem[];
  initialVisible?: number;
  className?: string;
}

export const AmenitySection: React.FC<AmenitySectionProps> = ({
  title = "Amenities",
  items,
  initialVisible = 10,
  className,
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = useMemo(
    () => (showAll ? items : items.slice(0, initialVisible)),
    [showAll, items, initialVisible]
  );
  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-[#0A1A22]">{title}</h3>
        {items.length > initialVisible && (
          <button
            className="text-xs font-medium text-[#0A1A22] hover:underline"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll
              ? "Show less"
              : `Show ${items.length - initialVisible} more`}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {visible.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.key}
              className="group flex items-center gap-3 rounded-xl bg-white ring-1 ring-black/5 px-3 py-3 sm:px-4 sm:py-4"
            >
              {Icon && (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4EA8A1]/10 text-[#4EA8A1] ring-1 ring-[#4EA8A1]/20">
                  <Icon className="text-base sm:text-lg" />
                </span>
              )}
              <span className="text-xs sm:text-sm font-medium text-[#101820] line-clamp-2">
                {a.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AmenitySection;
