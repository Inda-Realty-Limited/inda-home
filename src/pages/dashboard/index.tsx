import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaPlus, FaEye, FaShareAlt, FaExternalLinkAlt,FaCheckCircle, FaSync, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MessageCircle, Clock, Zap, TrendingUp, TrendingDown, FileText, Award, ChartColumnIncreasing, ChartColumnIncreasingIcon, CircleAlert } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { PlanGuard } from '@/components/dashboard/PlanGuard';
import { useState, useEffect } from 'react';
import apiClient from '@/api';

const QUICK_ACTIONS = [
    { name: 'Add Property', icon: FaPlus, href: '/listings?add=true' },
    { name: 'All Leads', icon: MessageCircle, href: '/leads' },
    { name: 'Portfolio Page', icon: FileText, href: '/portfolio' },
    { name: 'Upgrade Plan', icon: Zap, href: '/for-professionals#pricing', isSpecial: true },
];

// Default channel data (fallback)
const DEFAULT_CHANNEL_DATA = [
    { name: 'WhatsApp', leads: 0, clicks: 0, trend: 'improving', action: 'Keep using' },
    { name: 'Instagram', leads: 0, clicks: 0, trend: 'improving', action: 'Keep using' },
    { name: 'Facebook', leads: 0, clicks: 0, trend: 'improving', action: 'Keep using' },
    { name: 'Email', leads: 0, clicks: 0, trend: 'improving', action: 'Keep using' },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(true);
    const [channelLoading, setChannelLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [channelData, setChannelData] = useState<any[]>(DEFAULT_CHANNEL_DATA);
    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 5;

    const fetchStats = async () => {
        try {
            const res = await apiClient.get('/api/listings/dashboard/stats');
            setStats(res.data.data);
            if (res.data.data?.allListings) {
                setProperties(res.data.data.allListings);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        setRecLoading(true);
        try {
            const res = await apiClient.get('/api/listings/dashboard/recommendations');
            if (res.data.data?.recommendations) {
                setRecommendations(res.data.data.recommendations);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRecLoading(false);
        }
    };

    const fetchChannelStats = async () => {
        setChannelLoading(true);
        try {
            const res = await apiClient.get('/api/channels/stats');
            if (res.data.data?.channels) {
                const channels = res.data.data.channels;
                // Transform channel stats into display format
                const channelList = Object.entries(channels)
                    .filter(([_, value]: [string, any]) => value.leads > 0 || value.clicks > 0)
                    .map(([name, value]: [string, any]) => ({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        leads: value.leads || 0,
                        clicks: value.clicks || 0,
                        trend: value.leads > 5 ? 'improving' : 'needs_attention',
                        action: value.leads > 5 ? 'Keep using' : 'Needs more attention',
                    }))
                    .sort((a, b) => b.leads - a.leads);

                if (channelList.length > 0) {
                    setChannelData(channelList);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setChannelLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchRecommendations();
        fetchChannelStats();
    }, []);

    // Construct dynamic actions list inside component to use user ID
    const actions = QUICK_ACTIONS.map(action => {
        if (action.name === 'Portfolio Page' && user?._id) {
            return { ...action, href: `/portfolio/${user._id}` };
        }
        return action;
    });

    // Pagination logic
    const totalPages = Math.ceil(properties.length / propertiesPerPage);
    const paginatedProperties = properties.slice(
        (currentPage - 1) * propertiesPerPage,
        currentPage * propertiesPerPage
    );

    // Get top channel from actual channel data (sorted by leads, descending)
    const topChannelData = channelData.find(c => c.leads > 0 || c.clicks > 0);
    const topChannel = topChannelData?.name || 'No data yet';
    const topChannelLeads = topChannelData?.leads || 0;
    const topChannelClicks = topChannelData?.clicks || 0;

    return (
        <ProtectedRoute>
            <DashboardLayout title="Home">
                <div className="space-y-8 animate-in fade-in duration-500">

                    {/* Quick Actions Bar */}
                    <div className="bg-gradient-to-r from-[#2D5A54] to-[#3D6A64] rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <Zap className="text-[#E2E689] opacity-60" size={24} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-1">Quick Actions</h2>
                            <p className="text-white/60 text-sm mb-5">Everything you need in one click</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {actions.map((action, idx) => (
                                    <Link
                                        key={idx}
                                        href={action.href}
                                        className={`flex flex-col gap-3 p-4 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-95 ${action.isSpecial
                                            ? 'bg-[#E2E689] text-gray-900'
                                            : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <action.icon size={20} className={action.isSpecial ? 'text-gray-700' : ''} />
                                        <span className="text-sm">{action.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* This week's Performance */}
                    <div>
                        <h2 className="text-lg font-bold mb-1">This Week&apos;s Performance</h2>
                        <p className="text-gray-500 text-sm mb-5">Track what matters: leads and revenue</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Revenue This Month */}
                            <div className="bg-[#67B148] rounded-2xl p-5 text-white relative overflow-hidden">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <span className="text-xl font-bold">₦</span>
                                    </div>
                                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-medium">
                                        {stats?.metrics?.dealsThisMonth || 3} deals
                                    </span>
                                </div>
                                <div className="text-2xl font-bold mb-1">Coming Soon</div>
                                <div className="text-white/80 text-xs font-medium">Revenue This Month</div>
                                <div className="text-white/60 text-xs mt-2">+₦12M vs last month</div>
                            </div>

                            {/* All Leads */}
                            <Link href="/leads" className="block">
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-inda-teal/10 rounded-lg">
                                            <MessageCircle size={20} className="text-inda-teal" />
                                        </div>
                                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <TrendingUp size={14} /> +34%
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {loading ? <div className="h-8 w-16 bg-gray-100 animate-pulse rounded"></div> : stats?.metrics?.totalLeads || 0}
                                    </div>
                                    <div className="text-gray-500 text-xs font-medium">All Leads</div>
                                    <div className="text-gray-400 text-xs mt-2">This week</div>
                                </div>
                            </Link>

                            {/* Avg. Close Time */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Clock size={20} className="text-orange-500" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">Coming Soon</div>
                                <div className="text-gray-500 text-xs font-medium">Avg. Close Time</div>
                                <div className="text-gray-400 text-xs mt-2">Transaction layer in development</div>
                            </div>

                            {/* Top Performing Channel */}
                            <div className={`${topChannelLeads > 0 ? 'bg-[#67B148]' : 'bg-gray-400'} rounded-2xl p-5 text-white relative overflow-hidden`}>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Zap size={20} />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold mb-1">{topChannel}</div>
                                <div className="text-white/80 text-xs font-medium">Top Performing Channel</div>
                                {topChannelLeads > 0 ? (
                                    <div className="text-white/60 text-xs mt-2">
                                        {topChannelLeads.toLocaleString()} leads{topChannelClicks > 0 ? ` · ${topChannelClicks.toLocaleString()} clicks` : ''}
                                    </div>
                                ) : (
                                    <div className="text-white/60 text-xs mt-2">Share listings to track channels</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Channel Performance */}
                    <PlanGuard plan={user?.subscriptionPlan || 'free'} message="Upgrade to Pro for channel analytics and performance tracking.">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold mb-1">Channel Performance</h2>
                            <p className="text-gray-500 text-sm mb-5">See exactly where your leads come from</p>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider">
                                            <th className="pb-4">Channel</th>
                                            <th className="pb-4">Leads</th>
                                            <th className="pb-4">Trend</th>
                                            <th className="pb-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {channelLoading ? (
                                            [1, 2, 3].map(i => (
                                                <tr key={i}>
                                                    <td colSpan={4} className="py-4">
                                                        <div className="h-8 bg-gray-50 animate-pulse rounded"></div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : channelData.length > 0 ? (
                                            channelData.map((channel, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="py-4 font-medium text-gray-900">{channel.name}</td>
                                                    <td className="py-4 font-bold text-gray-900">{channel.leads}</td>
                                                    <td className="py-4">
                                                        <span className={`flex items-center gap-1 text-sm font-medium ${channel.trend === 'improving' ? 'text-green-600' : 'text-amber-500'
                                                            }`}>
                                                            {channel.trend === 'improving' ? (
                                                                <><TrendingUp size={16} /> Good</>
                                                            ) : (
                                                                <><TrendingDown size={16} /> Needs Attention</>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`flex items-center gap-1 text-sm font-medium ${channel.trend === 'improving' ? 'text-green-600' : 'text-amber-500'
                                                            }`}>
                                                            {channel.trend === 'improving' ? '✓' : '!'} {channel.action}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-400">
                                                    No channel data yet. Share your listings to track channel performance.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Performance Summary */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <CircleAlert size={16} className="text-gray-500" />
                                    <span className="font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-inda-teal">📊</span> Performance Summary
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm font-bold text-green-600 mb-2">
                                            <span>🏆</span> Best Performers
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {channelData.filter(c => c.trend === 'improving').slice(0, 2).map((channel, idx) => (
                                                <p key={idx}><span className="font-medium text-gray-900">{channel.name}:</span> {channel.leads} leads</p>
                                            ))}
                                            {channelData.filter(c => c.trend === 'improving').length === 0 && (
                                                <p className="text-gray-400">No data yet</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm font-bold text-amber-500 mb-2">
                                            <span>⚠️</span> Needs Attention
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {channelData.filter(c => c.trend !== 'improving').slice(0, 2).map((channel, idx) => (
                                                <p key={idx}><span className="font-medium text-gray-900">{channel.name}:</span> {channel.leads} leads - needs more focus</p>
                                            ))}
                                            {channelData.filter(c => c.trend !== 'improving').length === 0 && (
                                                <p className="text-gray-400">All channels performing well!</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PlanGuard>

                    {/* Your Properties */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-bold mb-1">Your Properties</h2>
                                <p className="text-gray-500 text-sm">Click any property to see its Deal Hub with detailed analytics</p>
                            </div>
                            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                                <option>All Properties</option>
                                <option>Active</option>
                                <option>Pending</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-gray-100">
                                        <th className="pb-4">Property</th>
                                        <th className="pb-4">Views</th>
                                        <th className="pb-4">Leads</th>
                                        <th className="pb-4">Hot Leads</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i}>
                                                <td colSpan={6} className="py-4">
                                                    <div className="h-12 bg-gray-50 animate-pulse rounded"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : paginatedProperties.length > 0 ? (
                                        paginatedProperties.map((property: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{property.title || 'Untitled Property'}</div>
                                                        <div className="text-xs text-gray-500">{property.microlocationStd || property.lga}, Lagos</div>
                                                        <div className="text-xs text-inda-teal font-medium">₦{(property.priceNGN || property.price || 0).toLocaleString()}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-bold text-gray-900">{(property.views || 0).toLocaleString()}</div>
                                                    <div className="text-xs text-gray-400">Total views</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-medium text-gray-900">{property.leads ?? '-'}</div>
                                                    <div className="text-xs text-gray-500">Total inquiries</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-bold text-inda-teal">{property.hotLeads ?? '-'}</div>
                                                    <div className="text-xs text-gray-500">High priority</div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${property.listingStatus === 'active' || property.status === 'active' || (!property.listingStatus && !property.status)
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {property.listingStatus === 'active' || property.status === 'active' || (!property.listingStatus && !property.status) ? 'Active' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <FaEye size={14} />
                                                        </button>
                                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-inda-teal text-white text-xs font-medium rounded-lg hover:bg-inda-teal/90 transition-colors">
                                                            <FaShareAlt size={12} /> Share
                                                        </button>
                                                        <Link
                                                            href={`/listings/${property.indaTag || property._id}`}
                                                            className="flex items-center gap-1 text-inda-teal text-xs font-medium hover:underline"
                                                        >
                                                            View Hub <FaExternalLinkAlt size={10} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-400">
                                                No properties found. Add your first property to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {properties.length > 0 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">
                                    Showing {((currentPage - 1) * propertiesPerPage) + 1} to {Math.min(currentPage * propertiesPerPage, properties.length)} of {properties.length} properties
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaChevronLeft size={10} /> Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="flex items-center gap-1 px-4 py-2 bg-inda-teal text-white rounded-lg text-sm font-medium hover:bg-inda-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next <FaChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-6 pb-12">

                        {/* Top Performing Listings */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                                <span className="text-yellow-400"><Award size={20} className='text-black'/></span> Top Performing Listings
                            </h2>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl"></div>
                                        ))}
                                    </div>
                                ) : (
                                    stats?.topListings?.length > 0 ? (
                                        stats.topListings.slice(0, 3).map((listing: any, idx: number) => {
                                            const weeklyChange = Math.floor(Math.random() * 20) + 10;
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-2xl font-black text-gray-300">
                                                            #{idx + 1}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{listing.title || 'Untitled Property'}</div>
                                                            <div className="text-xs text-gray-500">{listing.microlocationStd || listing.lga || 'Lagos'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-400 mb-1">Views this week</div>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="font-bold text-gray-900">{listing.views || 0}</span>
                                                            <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                                                                <TrendingUp size={12} /> +{weeklyChange}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 font-medium text-sm">
                                            No listings found. Add your first property to track performance.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* AI Recommendations */}
                        <PlanGuard plan={user?.subscriptionPlan || 'free'} message="Upgrade to Pro for AI-driven pricing insights and marketing recommendations.">
                            <div className="bg-[#E8F5E9] rounded-2xl p-6 border border-green-200 h-full">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-green-600"><ChartColumnIncreasingIcon/></span> AI Recommendations
                                    </h2>
                                    <button
                                        onClick={fetchRecommendations}
                                        disabled={recLoading}
                                        className="text-xs font-medium text-green-700 bg-white border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                                    >
                                        <FaSync className={recLoading ? "animate-spin" : ""} size={10} /> Refresh
                                    </button>
                                </div>
                                <p className="text-green-700 text-sm mb-5">Data-driven insights to boost your property sales</p>

                                <div className="space-y-3">
                                    {recLoading && recommendations.length === 0 ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-16 bg-white/50 animate-pulse rounded-xl"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        recommendations.length > 0 ? (
                                            recommendations.map((rec, idx) => (
                                                <div key={idx} className="bg-white p-4 rounded-xl flex items-start gap-3 border border-green-100">
                                                    <div className="mt-0.5">
                                                        <FaCheckCircle className="text-green-500" size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{rec.text}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {rec.subtext}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-green-600 font-medium text-sm border-2 border-dashed border-green-200 rounded-xl bg-white/50">
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
