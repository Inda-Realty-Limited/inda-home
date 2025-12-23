import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaChartLine, FaArrowUp, FaArrowDown, FaMapMarkerAlt,
    FaCity, FaLightbulb, FaChevronDown, FaCircle, FaExclamationCircle
} from 'react-icons/fa';

interface RoiMetric {
    title: string;
    value: string;
    sub: string;
    color: string;
    progress: number;
}

interface MarketItem {
    id: number;
    area: string;
    type: string;
    price: string;
    growth: string;
    status: string;
    isNegative?: boolean;
}

interface RankingItem {
    rank: number;
    name: string;
    label: string;
}

const INITIAL_ROI_CARDS: RoiMetric[] = [
    { title: "Yield High-end Apts (Lekki)", value: "0.0%", sub: "Waiting for data...", color: "text-gray-400", progress: 0 },
    { title: "Demand for 2-Bed (Yaba)", value: "0.0%", sub: "Waiting for data...", color: "text-gray-400", progress: 0 },
    { title: "Land Value Appreciation (Ibeju)", value: "0.0%", sub: "Waiting for data...", color: "text-gray-400", progress: 0 },
    { title: "Luxury Short-lets Occupancy", value: "0%", sub: "Waiting for data...", color: "text-gray-400", progress: 0 },
];

export default function InsightsPage() {
    const [roiCards] = useState<RoiMetric[]>(INITIAL_ROI_CARDS);
    const [microMarkets] = useState<MarketItem[]>([]);
    const [emergingAreas] = useState<RankingItem[]>([]);
    const [coolingAreas] = useState<RankingItem[]>([]);
    const [recommendations] = useState<string[]>([]);

    return (
        <DashboardLayout title="Insights">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-inda-dark">Insights</h1>
                <p className="text-gray-500 mt-1">Intelligence reports on areas, trends, and ROI.</p>
            </div>

            <div className="bg-[#EAF4F4] rounded-xl p-8 mb-8 relative overflow-hidden border border-transparent shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-bold text-inda-dark text-lg">Market Volume vs Rental Value</h3>
                        <div className="flex gap-4 mt-2 text-xs font-medium text-gray-600">
                            <span className="flex items-center gap-2"><FaCircle className="text-inda-teal text-[8px]" /> Market Volume</span>
                            <span className="flex items-center gap-2"><FaCircle className="text-[#D9A54C] text-[8px]" /> Rental Value</span>
                        </div>
                    </div>
                    <div className="bg-white px-3 py-1 rounded text-xs font-bold text-inda-dark shadow-sm">
                        Last 6 Months
                    </div>
                </div>

                <div className="h-64 w-full relative">
                    <div className="absolute inset-0 flex flex-col justify-between text-gray-400 text-[10px]">
                        {[100, 75, 50, 25, 0].map((val) => (
                            <div key={val} className="w-full border-b border-gray-300/50 h-0 flex items-center">
                                <span className="mb-2 opacity-50">{val}k</span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-gray-500 px-4">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => <span key={m}>{m}</span>)}
                    </div>

                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 250">
                        <path
                            d="M0,250 L1200,250"
                            fill="none" stroke="#54A6A6" strokeWidth="2" vectorEffect="non-scaling-stroke"
                            className="opacity-50"
                        />
                        <path
                            d="M0,250 L1200,250"
                            fill="none" stroke="#D9A54C" strokeWidth="2" vectorEffect="non-scaling-stroke"
                            strokeDasharray="5,5"
                            className="opacity-50"
                        />
                        <foreignObject x="0" y="0" width="100%" height="100%">
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-200">
                                    Insufficient data for trend analysis
                                </div>
                            </div>
                        </foreignObject>
                    </svg>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="font-bold text-inda-dark mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <FaChartLine className="text-[#D9A54C]" /> ROI & Demand Trends
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roiCards.map((card, i) => (
                        <div key={i} className="bg-[#EAF4F4] p-6 rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition-all">
                            <h4 className="text-xs font-bold text-gray-600 mb-3 truncate">{card.title}</h4>
                            <div className="flex justify-between items-end mb-2">
                                <span className={`text-2xl font-bold ${card.color}`}>
                                    {card.value}
                                </span>
                                <div className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 bg-gray-200 text-gray-500">
                                    -
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-3">{card.sub}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="h-1.5 rounded-full bg-gray-400"
                                    style={{ width: `${card.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-8 mb-8 min-h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-inda-dark flex items-center gap-2 text-sm uppercase tracking-wide">
                        <FaCity className="text-inda-teal" /> Micro-market Movement
                    </h3>
                    <button className="text-xs font-bold text-white bg-inda-teal px-4 py-2 rounded hover:bg-teal-700 transition-colors flex items-center gap-2">
                        All Zones <FaChevronDown />
                    </button>
                </div>

                {microMarkets.length > 0 ? (
                    <div className="space-y-4">
                        {/* Map items... */}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <FaCity className="text-xl opacity-50" />
                        </div>
                        <p className="text-sm font-medium">No micro-market data available</p>
                        <p className="text-xs mt-1">Market movements will appear here once we have enough data.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#EAF4F4] rounded-xl p-8 border border-transparent min-h-[250px] flex flex-col">
                    <h3 className="font-bold text-inda-dark mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <FaArrowUp className="text-green-600" /> Top 5 Emerging Areas
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-xs italic">No emerging areas identified yet.</p>
                    </div>
                </div>

                <div className="bg-[#FFF5F5] rounded-xl p-8 border border-red-100 min-h-[250px] flex flex-col">
                    <h3 className="font-bold text-red-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <FaArrowDown className="text-red-500" /> Areas Cooling Down
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-red-300">
                        <p className="text-xs italic">No cooling trends detected.</p>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h3 className="font-bold text-inda-dark mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <FaLightbulb className="text-[#D9A54C]" /> Smart Recommendations
                </h3>
                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center flex flex-col items-center">
                    <FaExclamationCircle className="text-gray-300 text-2xl mb-2" />
                    <h4 className="text-gray-700 font-bold text-sm">No Recommendations Generated</h4>
                    <p className="text-xs text-gray-500 mt-1">Our AI needs more market data to generate smart investment insights for you.</p>
                </div>
            </div>

        </DashboardLayout>
    );
}
