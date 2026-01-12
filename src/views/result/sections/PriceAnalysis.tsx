import React, { useEffect, useMemo, useRef, useState } from "react";

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
  dataPoints?: number;
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
  dataPoints,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [hoveredBar, setHoveredBar] = useState<null | { series: "fmv" | "price"; index: number }>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const element = chartContainerRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setChartWidth(element.clientWidth);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries.find((item) => item.target === element);
      if (!entry) {
        return;
      }
      setChartWidth(entry.contentRect.width);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const chartDimensions = useMemo(() => {
    const baseWidth = chartWidth > 0 ? chartWidth : 720;
    const clampedWidth = Math.min(Math.max(baseWidth, 320), 1024);
    const proportionalHeight = clampedWidth * 0.45;
    const clampedHeight = Math.min(
      Math.max(Math.round(proportionalHeight), 220),
      360
    );
    return { width: clampedWidth, height: clampedHeight };
  }, [chartWidth]);

  return (
    <div className="w-full px-6">
      <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
          Property Price Analysis
        </h3>

        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#4EA8A1]/5 border border-[#4EA8A1]/20 rounded-xl p-6 shadow-sm">
              <h4 className="text-base font-bold mb-2 text-[#101820]/70">
                Price
              </h4>
              <p className="text-2xl font-bold text-inda-teal">
                {price ? `₦${price.toLocaleString()}` : "—"}
              </p>
            </div>
            <div className="bg-[#4EA8A1]/5 border border-[#4EA8A1]/20 rounded-xl p-6 shadow-sm">
              <h4 className="text-base font-bold mb-2 text-[#101820]/70">
                Fair Market Value
              </h4>
              <p className="text-2xl font-bold text-inda-teal">
                {fmv ? `₦${fmv.toLocaleString()}` : "—"}
              </p>
            </div>
          </div>
          {dataPoints && (
            <div className="flex justify-end mt-3">
              <p className="text-xs text-inda-teal">
                Verified using {dataPoints} data points
              </p>
            </div>
          )}
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
                Sales from {windowLabel || "(last 12 months)df"}
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
              ref={chartContainerRef}
              className="relative w-full max-w-4xl mx-auto"
            >
              {(() => {
                const { width: W, height: H } = chartDimensions;
                const padL = Math.max(40, Math.min(72, W * 0.12));
                const padR = Math.max(16, Math.min(32, W * 0.06));
                const padT = 12;
                const padB = Math.max(28, Math.min(40, H * 0.18));
                const innerW = Math.max(1, W - padL - padR);
                const innerH = Math.max(1, H - padT - padB);
                const maxY = Math.max(...fmvSeries, ...priceSeries, 1);
                const minY = Math.min(...fmvSeries, ...priceSeries, 0);
                const yMin = Math.max(0, minY * 0.9);
                const yMax = maxY <= 0 ? 1 : maxY * 1.08;
                const yRange = yMax - yMin || 1;
                const groupCount = months.length;
                const groupW = innerW / groupCount;
                const gap = Math.max(4, Math.min(12, groupW * 0.18));
                const barW = Math.max(2, Math.min(18, (groupW - gap) / 2));
                const halfGap = gap / 2;
                const xCenter = (i: number) => padL + groupW * i + groupW / 2;
                const yScale = (val: number) =>
                  padT + innerH - ((val - yMin) / yRange) * innerH;
                const tickCount = H > 280 ? 5 : 4;
                const tickVals = Array.from(
                  { length: tickCount + 1 },
                  (_, i) => yMin + (yRange * i) / tickCount
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
                      const x = xCenter(i) - halfGap - barW;
                      const y = yScale(v);
                      const h = Math.max(2, padT + innerH - y);
                      const isSelected =
                        selectedBar?.series === "fmv" &&
                        selectedBar.index === i;
                      const isHovered = 
                        hoveredBar?.index === i;
                      const animatedH = isAnimating ? 0 : h;
                      return (
                        <g key={`bf-${i}`}>
                          <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={animatedH}
                            fill={isSelected ? "#3b8f89" : "#4EA8A1"}
                            rx={2}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                              transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                              transformOrigin: 'bottom',
                              filter: isHovered ? 'drop-shadow(0 4px 6px rgba(78, 168, 161, 0.4))' : 'none',
                              transition: isAnimating ? 'height 0.8s ease-out' : 'all 0.2s ease',
                            }}
                            onClick={() =>
                              setSelectedBar(
                                isSelected ? null : { series: "fmv", index: i }
                              )
                            }
                            onMouseEnter={() => setHoveredBar({ series: "fmv", index: i })}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                        </g>
                      );
                    })}
                    {priceSeries.map((v, i) => {
                      const x = xCenter(i) + halfGap;
                      const y = yScale(v);
                      const h = Math.max(2, padT + innerH - y);
                      const isSelected =
                        selectedBar?.series === "price" &&
                        selectedBar.index === i;
                      const isHovered = 
                        hoveredBar?.index === i;
                      const animatedH = isAnimating ? 0 : h;
                      return (
                        <g key={`bp-${i}`}>
                          <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={animatedH}
                            fill={isSelected ? "#9aa4ae" : "#D1D5DB"}
                            rx={2}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                              transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                              transformOrigin: 'bottom',
                              filter: isHovered ? 'drop-shadow(0 4px 6px rgba(209, 213, 219, 0.5))' : 'none',
                              transition: isAnimating ? 'height 0.8s ease-out' : 'all 0.2s ease',
                            }}
                            onClick={() =>
                              setSelectedBar(
                                isSelected ? null : { series: "price", index: i }
                              )
                            }
                            onMouseEnter={() => setHoveredBar({ series: "price", index: i })}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                        </g>
                      );
                    })}
                    {hoveredBar &&
                      (() => {
                        const i = hoveredBar.index;
                        const fmvVal = fmvSeries[i];
                        const priceVal = priceSeries[i];
                        const month = months[i];
                        const x = xCenter(i);
                        const maxY = Math.max(yScale(fmvVal), yScale(priceVal));
                        
                        // Calculate tooltip dimensions
                        const tooltipPadding = 12;
                        const tooltipWidth = 180;
                        const tooltipHeight = 90;
                        
                        // Position tooltip above the bars
                        const tooltipX = Math.max(
                          padL + 10,
                          Math.min(x - tooltipWidth / 2, W - padR - tooltipWidth - 10)
                        );
                        const tooltipY = Math.max(padT + 10, maxY - tooltipHeight - 16);
                        
                        return (
                          <g key="hover-tooltip" style={{ pointerEvents: 'none' }}>
                            {/* Tooltip background */}
                            <rect
                              x={tooltipX}
                              y={tooltipY}
                              width={tooltipWidth}
                              height={tooltipHeight}
                              rx={8}
                              fill="#4EA8A1"
                              opacity={0.95}
                              filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
                            />
                            
                            {/* Month label */}
                            <text
                              x={tooltipX + tooltipWidth / 2}
                              y={tooltipY + tooltipPadding + 12}
                              textAnchor="middle"
                              fontSize={12}
                              fill="#ffffff"
                              fontWeight="600"
                            >
                              {month}
                            </text>
                            
                            {/* Divider line */}
                            <line
                              x1={tooltipX + tooltipPadding}
                              x2={tooltipX + tooltipWidth - tooltipPadding}
                              y1={tooltipY + tooltipPadding + 20}
                              y2={tooltipY + tooltipPadding + 20}
                              stroke="#ffffff"
                              strokeOpacity={0.2}
                              strokeWidth={1}
                            />
                            
                            {/* FMV value */}
                            <circle
                              cx={tooltipX + tooltipPadding + 4}
                              cy={tooltipY + tooltipPadding + 34}
                              r={4}
                              fill="#4EA8A1"
                            />
                            <text
                              x={tooltipX + tooltipPadding + 12}
                              y={tooltipY + tooltipPadding + 38}
                              fontSize={10}
                              fill="#ffffff"
                              opacity={0.8}
                            >
                              FMV:
                            </text>
                            <text
                              x={tooltipX + tooltipWidth - tooltipPadding}
                              y={tooltipY + tooltipPadding + 38}
                              textAnchor="end"
                              fontSize={11}
                              fill="#ffffff"
                              fontWeight="600"
                            >
                              {formatCompact(fmvVal)}
                            </text>
                            
                            {/* Price value */}
                            <circle
                              cx={tooltipX + tooltipPadding + 4}
                              cy={tooltipY + tooltipPadding + 54}
                              r={4}
                              fill="#D1D5DB"
                            />
                            <text
                              x={tooltipX + tooltipPadding + 12}
                              y={tooltipY + tooltipPadding + 58}
                              fontSize={10}
                              fill="#ffffff"
                              opacity={0.8}
                            >
                              Price:
                            </text>
                            <text
                              x={tooltipX + tooltipWidth - tooltipPadding}
                              y={tooltipY + tooltipPadding + 58}
                              textAnchor="end"
                              fontSize={11}
                              fill="#ffffff"
                              fontWeight="600"
                            >
                              {formatCompact(priceVal)}
                            </text>
                            
                            {/* Difference */}
                            <text
                              x={tooltipX + tooltipPadding}
                              y={tooltipY + tooltipPadding + 75}
                              fontSize={9}
                              fill="#ffffff"
                              opacity={0.7}
                            >
                              Difference:
                            </text>
                            <text
                              x={tooltipX + tooltipWidth - tooltipPadding}
                              y={tooltipY + tooltipPadding + 75}
                              textAnchor="end"
                              fontSize={10}
                              fill={fmvVal > priceVal ? "#10B981" : "#EF4444"}
                              fontWeight="600"
                            >
                              {formatCompact(Math.abs(fmvVal - priceVal))}
                            </text>
                            
                            {/* Pointer arrow */}
                            <path
                              d={`M ${x - 6} ${tooltipY + tooltipHeight} L ${x + 6} ${tooltipY + tooltipHeight} L ${x} ${tooltipY + tooltipHeight + 8} Z`}
                              fill="#4EA8A1"
                              opacity={0.95}
                            />
                          </g>
                        );
                      })()}
                    {selectedBar &&
                      (() => {
                        const isFMV = selectedBar.series === "fmv";
                        const i = selectedBar.index;
                        const val = isFMV ? fmvSeries[i] : priceSeries[i];
                        const x = isFMV
                          ? xCenter(i) - halfGap - barW + barW / 2
                          : xCenter(i) + halfGap + barW / 2;
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
