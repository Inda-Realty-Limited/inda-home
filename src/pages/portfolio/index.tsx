import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaArrowUp, FaArrowDown, FaStar, FaChartBar,
    FaLightbulb, FaChartLine, FaBolt, FaInbox
} from 'react-icons/fa';

export interface DashboardData {
    metrics: {
        fmv: { value: string; trend: string; isPositive: boolean };
        credits: { used: number; total: number; percentage: number };
        marketTrend: { region: string; growth: string; tag: string };
        reports: { count: number; growth: string; isPositive: boolean };
    };
    trends: Array<{
        id: number;
        region: string;
        propertyType: string;
        price: string;
        growth: string;
        isPositive: boolean;
    }>;
    activities: Array<{
        id: number;
        title: string;
        description: string;
        timestamp: string;
        type: 'report' | 'watchlist' | 'system' | 'alert';
    }>;
    watchlist: Array<{
        id: number;
        title: string;
        location: string;
        price: string;
        fmv: string;
        dealBadge: { label: string; colorVariant: 'gray' | 'yellow' | 'teal' };
    }>;
}

const INITIAL_DATA: DashboardData = {
    metrics: {
        fmv: { value: '₦0', trend: '—', isPositive: true },
        credits: { used: 0, total: 0, percentage: 0 },
        marketTrend: { region: '—', growth: '—', tag: 'No Data' },
        reports: { count: 0, growth: '—', isPositive: true }
    },
    trends: [],
    activities: [],
    watchlist: []
};

export default function PortfolioPage() {
    const [data] = useState<DashboardData>(INITIAL_DATA);



    return (
        <DashboardLayout title="Inda Pro">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Portfolio FMV">
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-inda-dark">{data.metrics.fmv.value}</h3>
                        <TrendIndicator value={data.metrics.fmv.trend} isPositive={data.metrics.fmv.isPositive} />
                    </div>
                </MetricCard>

                <div className="bg-inda-teal text-white p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[140px]">
                    <h4 className="text-xs font-medium opacity-90 uppercase tracking-wide">Credits Remaining</h4>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1 font-bold opacity-90">
                            <span>{data.metrics.credits.used}/{data.metrics.credits.total} used</span>
                        </div>
                        <div className="w-full bg-teal-800/30 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${data.metrics.credits.percentage}%` }} />
                        </div>
                        <p className="text-xs mt-2 opacity-80 font-medium">{data.metrics.credits.percentage}%</p>
                    </div>
                </div>

                <MetricCard title="Market Trend Alerts">
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold text-inda-dark">
                            {data.metrics.marketTrend.region} {data.metrics.marketTrend.growth}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{data.metrics.marketTrend.tag}</p>
                    </div>
                </MetricCard>

                <MetricCard title="Reports Run (MTD)">
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-inda-dark">{data.metrics.reports.count}</h3>
                        <TrendIndicator value={data.metrics.reports.growth !== '—' ? `↑ ${data.metrics.reports.growth}` : '—'} isPositive={data.metrics.reports.isPositive} />
                    </div>
                </MetricCard>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-[#EAF4F4] p-6 rounded-xl border border-transparent">
                    <div className="flex items-center gap-2 mb-1">
                        <FaChartBar className="text-inda-dark" />
                        <h4 className="font-bold text-inda-dark text-sm">Buyer Demand Heatline</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-8">Buyer activity across your listings — 7-day trend</p>

                    <div className="h-32 flex items-end justify-between gap-4 px-2 border-b border-gray-300/30 pb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <div key={day} className="flex flex-col items-center gap-2 w-full group">
                                <div
                                    className="w-full rounded-sm bg-[#CBD5E1] opacity-50"
                                    style={{ height: '4px' }}
                                />
                                <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 bg-[#CBD5E1] text-gray-600 text-xs py-2 px-4 rounded text-center font-medium shadow-sm">
                        No activity data available for this week.
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#EAF4F4] border border-inda-teal/20 p-6 rounded-xl flex flex-col justify-center h-full">
                        <div className="flex items-center gap-2 mb-3 text-inda-dark font-bold text-xs uppercase tracking-wide">
                            <FaLightbulb /> Action Suggestion
                        </div>
                        <h4 className="font-bold text-sm text-inda-dark mb-2">No actions needed</h4>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            We need more portfolio data to generate insights for you.
                        </p>
                        <button disabled className="bg-gray-300 text-white text-xs font-bold px-4 py-2 rounded cursor-not-allowed w-full sm:w-auto">
                            View Insights
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard value="0%" label="ROI Searches" />
                        <StatCard value="0" label="Buyer Views" />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#EAF4F4] p-8 rounded-xl flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <FaChartLine className="text-inda-teal" />
                        <h4 className="font-bold text-inda-dark text-lg">Market Trend Alerts</h4>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                        <FaInbox className="text-2xl mb-2 opacity-50" />
                        <span className="text-xs">No market trends detected yet.</span>
                    </div>
                </div>

                <div className="bg-[#EAF4F4] p-8 rounded-xl flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <FaBolt className="text-inda-teal" />
                        <h4 className="font-bold text-inda-dark text-lg">Recent Activities</h4>
                    </div>
                    <div className="space-y-8 relative pl-2 flex-1">
                        <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-gray-200"></div>
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8 relative z-10 bg-[#EAF4F4]">
                            <span className="text-xs">No recent activity.</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h4 className="font-bold text-inda-dark mb-4 flex items-center gap-2 text-lg">
                    <FaStar className="text-inda-teal" /> Watchlist Properties
                </h4>
                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-12 text-center text-gray-500">
                    <div className="bg-white p-3 rounded-full inline-block shadow-sm mb-3">
                        <FaStar className="text-gray-300 text-xl" />
                    </div>
                    <p className="text-sm font-medium">Your watchlist is empty.</p>
                    <p className="text-xs text-gray-400 mt-1">Star properties to track their price movements here.</p>
                </div>
            </section>
        </DashboardLayout>
    );
}

function MetricCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-[#EAF4F4] p-6 rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition-all min-h-[140px] flex flex-col justify-between">
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</h4>
            {children}
        </div>
    );
}

function TrendIndicator({ value, isPositive }: { value: string, isPositive: boolean }) {
    const isNeutral = value === '—';
    return (
        <span className={`text-xs font-bold flex items-center gap-1 mt-2 ${isNeutral ? 'text-gray-400' : isPositive ? 'text-green-600' : 'text-red-500'
            }`}>
            {!isNeutral && (isPositive ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />)}
            {value}
        </span>
    );
}

function StatCard({ value, label }: { value: string, label: string }) {
    return (
        <div className="bg-[#EAF4F4] p-6 rounded-xl text-center flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-inda-dark">{value}</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase">{label}</p>
        </div>
    );
}
