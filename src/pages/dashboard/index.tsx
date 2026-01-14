import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaPlus, FaUsers, FaRocket, FaWhatsapp,
    FaChartLine, FaClock, FaStar, FaEye, FaShareAlt, FaExternalLinkAlt,
    FaArrowUp, FaArrowDown, FaCheckCircle, FaExclamationCircle, FaRobot,
    FaSync
} from 'react-icons/fa';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { PlanGuard } from '@/components/dashboard/PlanGuard';
import { useState, useEffect } from 'react';
import apiClient from '@/api';

const QUICK_ACTIONS = [
    { name: 'Add Property', icon: FaPlus, href: '/listings?add=true', color: 'bg-white/10' },
    { name: 'All Leads', icon: FaUsers, href: '/leads', color: 'bg-white/10' },
    { name: 'Portfolio Page', icon: FaExternalLinkAlt, href: '/portfolio', color: 'bg-white/10' },
    { name: 'Upgrade Plan', icon: FaRocket, href: '/for-professionals#pricing', color: 'bg-[#E2E689] text-gray-900', isSpecial: true },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    const fetchStats = async () => {
        try {
            const res = await apiClient.get('/listings/dashboard/stats');
            setStats(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        setRecLoading(true);
        try {
            const res = await apiClient.get('/listings/dashboard/recommendations');
            if (res.data.data?.recommendations) {
                setRecommendations(res.data.data.recommendations);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRecLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchRecommendations();
    }, []);

    // Construct dynamic actions list inside component to use user ID
    const actions = QUICK_ACTIONS.map(action => {
        if (action.name === 'Portfolio Page' && user?._id) {
            return { ...action, href: `/portfolio/${user._id}` };
        }
        return action;
    });

    const performanceStats = [
        {
            label: 'Revenue This Month',
            // Mock revenue logic for now as requested
            value: stats?.metrics?.revenue ? `₦${stats.metrics.revenue.toLocaleString()}` : 'Coming Soon',
            trend: 'Coming Soon',
            icon: FaChartLine,
            color: 'bg-[#67B148]',
            trendIcon: FaArrowUp
        },
        {
            label: 'All Leads',
            value: stats?.metrics?.totalLeads || '0',
            trend: 'Lifetime',
            icon: FaWhatsapp,
            color: 'bg-white',
            trendIcon: FaArrowUp,
            textColor: 'text-gray-900',
            iconColor: 'text-[#67B148]'
        },
        {
            label: 'Active Listings',
            value: stats?.metrics?.activeListings || '0',
            trend: 'Currently live',
            icon: FaClock,
            color: 'bg-white',
            trendIcon: FaArrowUp,
            textColor: 'text-gray-900',
            iconColor: 'text-orange-500'
        },
        {
            label: 'Top Performing Channel',
            value: stats?.metrics?.topChannel === 'N/A' ? 'None' : stats?.metrics?.topChannel,
            trend: `${stats?.metrics?.topChannelLeads || 0} leads`,
            icon: FaStar,
            color: 'bg-[#A374FF]',
            trendIcon: null
        },
    ];

    return (
        <ProtectedRoute>
            <DashboardLayout title="Home">
                <div className="space-y-8 animate-in fade-in duration-500">

                    {/* Quick Actions Bar */}
                    <div className="bg-[#2D5A54] rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <FaRocket size={120} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold mb-1">Quick Actions</h2>
                            <p className="text-white/60 text-sm mb-6">Everything you need in one click</p>

                            <div className="flex flex-wrap gap-4">
                                {actions.map((action, idx) => (
                                    <Link
                                        key={idx}
                                        href={action.href}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 ${action.color} ${action.isSpecial ? '' : 'hover:bg-white/20'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${action.isSpecial ? 'bg-black/10' : 'bg-white/10'}`}>
                                            <action.icon />
                                        </div>
                                        {action.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                        <h2 className="text-xl font-bold mb-1">Performance Overview</h2>
                        <p className="text-gray-500 text-sm mb-6">Track what matters: leads and revenue</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {performanceStats.map((stat, idx) => (
                                <div key={idx} className={`${stat.color} rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden`}>
                                    <div className={`flex justify-between items-start ${stat.textColor || 'text-white'}`}>
                                        <div>
                                            <div className="text-3xl font-black mb-1">
                                                {loading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : stat.value}
                                            </div>
                                            <div className="text-xs font-bold opacity-80 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                        <div className={`p-3 rounded-2xl ${stat.textColor ? 'bg-gray-100' : 'bg-black/10'}`}>
                                            <stat.icon className={stat.iconColor || 'text-white'} size={20} />
                                        </div>
                                    </div>
                                    <div className={`mt-4 flex items-center gap-1 text-[11px] font-bold ${stat.textColor || 'text-white opacity-90'}`}>
                                        {stat.trendIcon && <stat.trendIcon size={12} />}
                                        {stat.trend}
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-4 opacity-5">
                                        <stat.icon size={60} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">

                        {/* Top Listings */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                                <FaStar className="text-yellow-400" /> Top Performing Listings
                            </h2>
                            <p className="text-gray-500 text-sm mb-8">Properties driving the highest engagement</p>

                            <div className="space-y-6">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl"></div>
                                        ))}
                                    </div>
                                ) : (
                                    stats?.topListings?.length > 0 ? (
                                        stats.topListings.map((listing: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-5">
                                                    <div className="text-2xl font-black text-gray-300 group-hover:text-inda-teal transition-colors">
                                                        #{idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">{listing.title || 'Untitled Property'}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{listing.microlocationStd || listing.lga || 'Unknown Location'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5 text-[9px]">Total Views</div>
                                                    <div className="flex items-center justify-end gap-3">
                                                        <span className="font-black text-lg">{listing.views || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 font-medium text-sm">
                                            No listings found. Add your first property to track performance.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* AI Recommendations */}
                        <PlanGuard plan={user?.subscriptionPlan || 'free'} message="Upgrade to Pro for AI-driven pricing insights and marketing recommendations that boost sales.">
                            <div className="bg-[#F9F6FF] rounded-3xl p-8 shadow-sm border border-purple-100 h-full">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="text-xl font-bold text-[#6A4FC5] flex items-center gap-2">
                                        <FaRobot className="text-[#A374FF]" /> AI Recommendations
                                    </h2>
                                    <button
                                        onClick={fetchRecommendations}
                                        disabled={recLoading}
                                        className="text-xs font-bold text-[#A374FF] bg-white border border-purple-100 px-3 py-1.5 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2"
                                    >
                                        <FaSync className={recLoading ? "animate-spin" : ""} /> Refresh
                                    </button>
                                </div>
                                <p className="text-purple-400 text-sm font-medium mb-8">Data-driven insights to boost your property sales</p>

                                <div className="space-y-4">
                                    {recLoading && recommendations.length === 0 ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-20 bg-white/50 animate-pulse rounded-2xl"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        recommendations.length > 0 ? (
                                            recommendations.map((rec, idx) => (
                                                <div key={idx} className="bg-white p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-white hover:border-purple-200 transition-all group">
                                                    <div className="mt-1">
                                                        <FaCheckCircle className="text-green-500 group-hover:scale-110 transition-transform" size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 mb-1">{rec.text}</div>
                                                        <div className="text-xs text-gray-500 leading-relaxed font-medium">
                                                            {rec.subtext}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-purple-300 font-medium text-sm border-2 border-dashed border-purple-100 rounded-2xl">
                                                Not enough data for insights yet. Create listings and track leads first.
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </PlanGuard>

                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
