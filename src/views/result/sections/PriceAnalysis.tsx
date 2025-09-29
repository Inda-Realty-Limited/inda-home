import React from "react";

type Props = {
  price?: number | null;
  fmv?: number | null;
  months: string[];
  fmvSeries: number[];
  priceSeries: number[];
  windowLabel: string;
  last6ChangePct: number;
  marketPositionPct: number;
  selectedBar: null | { series: "fmv" | "price"; index: number };
  setSelectedBar: (
    v: null | { series: "fmv" | "price"; index: number }
  ) => void;
};

const formatCompact = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `₦${v >= 10 ? v.toFixed(0) : v.toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    const v = n / 1_000_000;
    return `₦${v >= 10 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  return `₦${Math.round(n).toLocaleString()}`;
};

const PriceAnalysis: React.FC<Props> = ({
  price,
  fmv,
  months,
  fmvSeries,
  priceSeries,
  windowLabel,
  last6ChangePct,
  marketPositionPct,
  selectedBar,
  setSelectedBar,
}) => {
  return (
    <div className="w-full px-6">
      <div className="bg-[#E5E5E533] rounded-2xl p-6 sm:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
          Property Price Analysis
        </h3>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#4EA8A114] rounded-xl p-6">
            <h4 className="text-base font-bold mb-2 text-[#101820]/70">
              Price
            </h4>
            <p className="text-2xl font-bold text-inda-teal">
              {price ? `₦${price.toLocaleString()}` : "—"}
            </p>
          </div>
          <div className="bg-[#4EA8A114] rounded-xl p-6">
            <h4 className="text-base font-bold mb-2 text-[#101820]/70">
              Fair Market Value
            </h4>
            <p className="text-2xl font-bold text-inda-teal">
              {fmv ? `₦${fmv.toLocaleString()}` : "—"}
            </p>
          </div>
        </div>

        <div className="bg-transparent rounded-xl p-4 sm:p-6 mb-6">
          <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5">
            <div>
              <p className="text-sm text-inda-teal font-medium mb-1">{`${
                last6ChangePct >= 0 ? "↑" : "↓"
              } ${Math.abs(last6ChangePct).toFixed(
                1
              )}% in the last 6 months`}</p>
              <p className="text-xs text-gray-500">
                {windowLabel || "Sales (last 12 months)"}
              </p>
            </div>
            <div className="bg-transparent border border-gray-200 rounded-lg px-4 py-3 ">
              <div className="text-xs font-medium text-gray-600 mb-1">
                Market Position
              </div>
              {price != null && fmv != null ? (
                <div
                  className={`text-sm font-bold ${
                    marketPositionPct >= 5
                      ? "text-red-500"
                      : marketPositionPct <= -5
                      ? "text-green-600"
                      : "text-amber-500"
                  }`}
                >
                  {`${Math.abs(marketPositionPct).toFixed(0)}% ${
                    marketPositionPct >= 0 ? "Overpriced" : "Underpriced"
                  }`}
                </div>
              ) : (
                <div className="text-sm font-bold text-gray-500">—</div>
              )}
            </div>
          </div>

          {months.length >= 2 &&
          fmvSeries.length === months.length &&
          priceSeries.length === months.length ? (
            <div
              className="relative min-w-[600px] sm:min-w-0 w-full max-w-4xl mx-auto overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {(() => {
                const W = 720;
                const H = 240;
                const padL = 56,
                  padR = 20,
                  padT = 12,
                  padB = 32;
                const innerW = W - padL - padR;
                const innerH = H - padT - padB;
                const maxY = Math.max(...fmvSeries, ...priceSeries, 1);
                const minY = Math.min(...fmvSeries, ...priceSeries, 0);
                const yMin = Math.max(0, minY * 0.9);
                const yMax = maxY * 1.08;
                const groupCount = months.length;
                const groupW = innerW / groupCount;
                const barW = Math.min(14, groupW * 0.3);
                const gap = 4;
                const xCenter = (i: number) => padL + groupW * i + groupW / 2;
                const yScale = (val: number) =>
                  padT + innerH - ((val - yMin) / (yMax - yMin)) * innerH;
                const ticks = 5;
                const tickVals = Array.from(
                  { length: ticks + 1 },
                  (_, i) => yMin + ((yMax - yMin) * i) / ticks
                );
                return (
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {tickVals.map((tv, i) => {
                      const y = yScale(tv);
                      return (
                        <g key={`g-${i}`}>
                          <line
                            x1={padL}
                            x2={W - padR}
                            y1={y}
                            y2={y}
                            stroke="#E5E7EB"
                            strokeWidth={1}
                          />
                          <text
                            x={padL - 8}
                            y={y + 3}
                            textAnchor="end"
                            fontSize={10}
                            fill="#6B7280"
                          >
                            {formatCompact(tv)}
                          </text>
                        </g>
                      );
                    })}
                    {months.map((m, i) => (
                      <text
                        key={`xm-${m}-${i}`}
                        x={xCenter(i)}
                        y={H - 8}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#6B7280"
                      >
                        {m}
                      </text>
                    ))}
                    {fmvSeries.map((v, i) => {
                      const x = xCenter(i) - gap / 2 - barW;
                      const y = yScale(v);
                      const h = Math.max(2, padT + innerH - y);
                      const isSelected =
                        selectedBar?.series === "fmv" &&
                        selectedBar.index === i;
                      return (
                        <rect
                          key={`bf-${i}`}
                          x={x}
                          y={y}
                          width={barW}
                          height={h}
                          fill={isSelected ? "#3b8f89" : "#4EA8A1"}
                          rx={2}
                          className="cursor-pointer"
                          onClick={() =>
                            setSelectedBar(
                              isSelected ? null : { series: "fmv", index: i }
                            )
                          }
                        />
                      );
                    })}
                    {priceSeries.map((v, i) => {
                      const x = xCenter(i) + gap / 2;
                      const y = yScale(v);
                      const h = Math.max(2, padT + innerH - y);
                      const isSelected =
                        selectedBar?.series === "price" &&
                        selectedBar.index === i;
                      return (
                        <rect
                          key={`bp-${i}`}
                          x={x}
                          y={y}
                          width={barW}
                          height={h}
                          fill={isSelected ? "#9aa4ae" : "#D1D5DB"}
                          rx={2}
                          className="cursor-pointer"
                          onClick={() =>
                            setSelectedBar(
                              isSelected ? null : { series: "price", index: i }
                            )
                          }
                        />
                      );
                    })}
                    {selectedBar &&
                      (() => {
                        const isFMV = selectedBar.series === "fmv";
                        const i = selectedBar.index;
                        const val = isFMV ? fmvSeries[i] : priceSeries[i];
                        const x = isFMV
                          ? xCenter(i) - gap / 2 - barW + barW / 2
                          : xCenter(i) + gap / 2 + barW / 2;
                        const y = yScale(val) - 8;
                        const label = `₦${Math.round(val).toLocaleString()}`;
                        const bubblePadX = 8;
                        const rectH = 24;
                        const textW = Math.max(40, label.length * 7.2);
                        const rectW = textW + bubblePadX * 2;
                        const rectX = Math.max(
                          padL,
                          Math.min(x - rectW / 2, W - padR - rectW)
                        );
                        const rectY = Math.max(padT, y - rectH - 8);
                        const pointerX = x;
                        const color = isFMV ? "#4EA8A1" : "#9AA4AE";
                        return (
                          <g key="tooltip">
                            <rect
                              x={rectX}
                              y={rectY}
                              width={rectW}
                              height={rectH}
                              rx={6}
                              fill={color}
                              opacity={0.95}
                            />
                            <text
                              x={rectX + rectW / 2}
                              y={rectY + rectH / 2 + 4}
                              textAnchor="middle"
                              fontSize={11}
                              fill="#ffffff"
                              fontWeight={600}
                            >
                              {label}
                            </text>
                            <path
                              d={`M ${pointerX - 6} ${rectY + rectH} L ${
                                pointerX + 6
                              } ${rectY + rectH} L ${pointerX} ${
                                rectY + rectH + 8
                              } Z`}
                              fill={color}
                              opacity={0.95}
                            />
                          </g>
                        );
                      })()}
                  </svg>
                );
              })()}
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: "#4EA8A1" }}
                  />
                  <span className="text-xs text-gray-600 font-medium">FMV</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: "#D1D5DB" }}
                  />
                  <span className="text-xs text-gray-600 font-medium">
                    Price
                  </span>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#F9F9F9] to-transparent sm:hidden" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#F9F9F9] to-transparent sm:hidden" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;
