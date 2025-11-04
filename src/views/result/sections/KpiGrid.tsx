import React from "react";

export interface KpiItem {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

export interface KpiGridProps {
  items: KpiItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  items,
  columns = 4,
  className,
}) => {
  const gridCols =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return (
    <section className={className}>
      <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
        {items.map((it, i) => (
          <div key={i} className="rounded-xl bg-white ring-1 ring-black/5 p-4">
            <div className="text-xs text-[#3D4C59]">{it.label}</div>
            <div className="mt-1 text-lg font-semibold text-[#0A1A22]">
              {it.value}
            </div>
            {it.hint && (
              <div className="mt-1 text-[11px] text-[#6B7A88]">{it.hint}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default KpiGrid;
