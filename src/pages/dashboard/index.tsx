import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaPlus, FaUsers, FaRocket, FaWhatsapp,
    FaChartLine, FaClock, FaStar, FaEye, FaShareAlt, FaExternalLinkAlt,
    FaArrowUp, FaArrowDown, FaCheckCircle, FaExclamationCircle, FaRobot
} from 'react-icons/fa';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { PlanGuard } from '@/components/dashboard/PlanGuard';

// --- Mock Data / Constants ---

const QUICK_ACTIONS = [
    { name: 'Add Property', icon: FaPlus, href: '/listings?add=true', color: 'bg-white/10' },
    { name: 'All Leads', icon: FaUsers, href: '/leads', color: 'bg-white/10' },
    { name: 'Portfolio Page', icon: FaExternalLinkAlt, href: '/portfolio', color: 'bg-white/10' },
    { name: 'Upgrade Plan', icon: FaRocket, href: '/for-professionals#pricing', color: 'bg-[#E2E689] text-gray-900', isSpecial: true },
];

const PERFORMANCE_STATS = [
    { label: 'Revenue This Month', value: 'Coming Soon', trend: 'Coming Soon', icon: FaChartLine, color: 'bg-[#67B148]', trendIcon: FaArrowUp },
    { label: 'WhatsApp Leads', value: '127', trend: '+34% this week', icon: FaWhatsapp, color: 'bg-white', trendIcon: FaArrowUp, textColor: 'text-gray-900', iconColor: 'text-[#67B148]' },
    { label: 'Avg. Close Time', value: 'Coming Soon', trend: 'Coming Soon', icon: FaClock, color: 'bg-white', trendIcon: FaArrowDown, textColor: 'text-gray-900', iconColor: 'text-orange-500' },
    { label: 'Top Performing Channel', value: 'Instagram', trend: '2,103 clicks', icon: FaStar, color: 'bg-[#A374FF]', trendIcon: null },
];

const CHANNEL_PERFORMANCE = [
    { channel: 'WhatsApp Groups', leads: 127, trend: 'Improving', trendColor: 'text-green-500', action: 'Keep using', actionColor: 'text-green-600' },
    { channel: 'Instagram', leads: 89, trend: 'Improving', trendColor: 'text-green-500', action: 'Keep using', actionColor: 'text-green-600' },
    { channel: 'Jiji.ng', leads: 34, trend: 'Declining', trendColor: 'text-red-500', action: 'Consider pausing', actionColor: 'text-red-600' },
    { channel: 'Property Pro', leads: 12, trend: 'Declining', trendColor: 'text-red-500', action: 'Consider pausing', actionColor: 'text-red-600' },
];

const PROPERTIES_DATA = [
    { title: '4-Bedroom Duplex', location: 'Lekki, Lagos', price: '₦78,500,000', views: 918, viewsTrend: '+28% this week', leads: 27, hotLeads: 8, status: 'Active' },
    { title: '3-Bedroom Apartment', location: 'Victoria Island, Lagos', price: '₦52,000,000', views: 906, viewsTrend: '+31% this week', leads: 27, hotLeads: 8, status: 'Active' },
    { title: '5-Bedroom Penthouse', location: 'Ikoyi, Lagos', price: '₦125,000,000', views: 1224, viewsTrend: '+17% this week', leads: 36, hotLeads: 10, status: 'Active' },
    { title: 'Contemporary Villa', location: 'Banana Island, Lagos', price: '₦195,000,000', views: 700, viewsTrend: '+35% this week', leads: 21, hotLeads: 6, status: 'Active' },
    { title: '2-Bedroom Flat', location: 'Ajah, Lagos', price: '₦32,000,000', views: 1604, viewsTrend: '+10% this week', leads: 48, hotLeads: 14, status: 'Active', isHot: true },
];

const TOP_LISTINGS = [
    { rank: 1, title: '4-Bedroom Duplex', location: 'Lekki, Lagos', views: 234, trend: '+18%' },
    { rank: 2, title: '3-Bedroom Apartment', location: 'Victoria Island, Lagos', views: 184, trend: '+16%' },
    { rank: 3, title: '5-Bedroom Penthouse', location: 'Ikoyi, Lagos', views: 134, trend: '+14%' },
];

const AI_RECOMMENDATIONS = [
    { text: 'Reduce Lekki property price by 8%', subtext: 'Similar properties sell at ₦262M avg. You\'re priced 8% above market.', icon: FaCheckCircle },
    { text: 'Stop advertising on Property Pro', subtext: '₦1,667 per lead vs ₦39 on WhatsApp. Save ₦20K/month.', icon: FaCheckCircle },
    { text: 'Follow up with 12 hot leads', subtext: 'These buyers viewed properties 3+ times. They\'re ready.', icon: FaCheckCircle },
];

export default function DashboardPage() {
    const { user } = useAuth();

    // Construct dynamic actions list inside component to use user ID
    const actions = QUICK_ACTIONS.map(action => {
        if (action.name === 'Portfolio Page' && user?._id) {
            return { ...action, href: `/portfolio/${user._id}` };
        }
        return action;
    });

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
                        <h2 className="text-xl font-bold mb-1">This Week's Performance</h2>
                        <p className="text-gray-500 text-sm mb-6">Track what matters: leads and revenue</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {PERFORMANCE_STATS.map((stat, idx) => (
                                <div key={idx} className={`${stat.color} rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden`}>
                                    <div className={`flex justify-between items-start ${stat.textColor || 'text-white'}`}>
                                        <div>
                                            <div className="text-3xl font-black mb-1">{stat.value}</div>
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

                    {/* Channel Performance Table */}
                    <PlanGuard plan={user?.subscriptionPlan || 'free'} message="Upgrade to Pro to see exactly where your leads come from. Track Instagram, WhatsApp, and more.">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                            <h2 className="text-xl font-bold mb-1">Channel Performance</h2>
                            <p className="text-gray-500 text-sm mb-8">See exactly where your leads come from</p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-50">
                                            <th className="pb-4">Channel</th>
                                            <th className="pb-4">Leads</th>
                                            <th className="pb-4">Trend</th>
                                            <th className="pb-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {CHANNEL_PERFORMANCE.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 font-bold text-gray-800">{item.channel}</td>
                                                <td className="py-5 font-black text-lg">{item.leads}</td>
                                                <td className={`py-5 font-bold ${item.trendColor} flex items-center gap-2 italic`}>
                                                    <FaChartLine size={12} /> {item.trend}
                                                </td>
                                                <td className={`py-5 font-bold ${item.actionColor}`}>
                                                    {item.action === 'Keep using' ? '✓ ' : '✕ '}{item.action}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Performance Summary Box */}
                            <div className="mt-8 bg-[#E9F3F6] rounded-2xl p-6 flex flex-wrap gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm">
                                        <FaExclamationCircle className="text-blue-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-[#2D5A54] uppercase tracking-wider flex items-center gap-2">
                                            📊 Performance Summary
                                        </h3>
                                        <div className="flex gap-8">
                                            <div>
                                                <div className="text-xs font-bold text-green-600 mb-2">🏆 Best Performers</div>
                                                <div className="text-xs text-gray-600 leading-relaxed font-medium">
                                                    <span className="font-bold text-gray-800">WhatsApp:</span> 127 leads, 6% conversion<br />
                                                    <span className="font-bold text-gray-800">Instagram:</span> 89 leads, 6% conversion
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-red-600 mb-2">⚠️ Needs Attention</div>
                                                <div className="text-xs text-gray-600 leading-relaxed font-medium">
                                                    <span className="font-bold text-gray-800">Property Pro:</span> Only 2% conversion<br />
                                                    <span className="font-bold text-gray-800">Jiji:</span> 4% conversion, below average
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PlanGuard>

                    {/* Your Properties Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                            <h2 className="text-xl font-bold">Your Properties</h2>
                            <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-inda-teal/20 transition-all">
                                <option>All Properties</option>
                                <option>Active</option>
                                <option>Sold</option>
                            </select>
                        </div>
                        <p className="text-gray-500 text-sm mb-8">Click any property to see its Deal Hub with detailed analytics</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-50">
                                        <th className="pb-4">Property</th>
                                        <th className="pb-4">Views</th>
                                        <th className="pb-4">Leads</th>
                                        <th className="pb-4">Hot Leads</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {PROPERTIES_DATA.map((prop, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="font-bold text-gray-800 text-base flex items-center gap-2">
                                                    {prop.title}
                                                    {prop.isHot && (
                                                        <span className="bg-orange-100 text-orange-600 text-[9px] uppercase font-black px-2 py-0.5 rounded-full">🔥 Hot</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">{prop.location}</div>
                                                <div className="text-xs text-inda-teal font-bold mt-0.5">{prop.price}</div>
                                            </td>
                                            <td className="py-6">
                                                <div className="font-black text-lg">{prop.views.toLocaleString()}</div>
                                                <div className="text-[10px] font-bold text-green-500">{prop.viewsTrend}</div>
                                            </td>
                                            <td className="py-6">
                                                <div className="font-black text-lg">{prop.leads}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase">Total inquiries</div>
                                            </td>
                                            <td className="py-6">
                                                <div className="font-black text-lg text-orange-600">{prop.hotLeads}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase italic">Viewed 3+ times</div>
                                            </td>
                                            <td className="py-6">
                                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {prop.status}
                                                </span>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <button className="text-gray-400 hover:text-inda-teal transition-colors" title="Quick View">
                                                        <FaEye size={16} />
                                                    </button>
                                                    <button className="bg-[#67B148] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#5a9c3e] transition-all">
                                                        <FaShareAlt size={12} /> Share
                                                    </button>
                                                    <Link href="/deal-hub" className="text-inda-teal font-bold text-xs hover:underline flex items-center gap-1">
                                                        View Hub <FaExternalLinkAlt size={10} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-xs font-bold text-gray-400">
                                Showing 1-5 of 24 properties
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-gray-50 text-gray-400 font-bold rounded-xl text-xs" disabled>Previous</button>
                                <button className="px-4 py-2 bg-[#4EA8A1] text-white font-bold rounded-xl text-xs">Next</button>
                            </div>
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
                                {TOP_LISTINGS.map((listing, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className="text-2xl font-black text-gray-300 group-hover:text-inda-teal transition-colors">
                                                #{listing.rank}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{listing.title}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{listing.location}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5 text-[9px]">Views this week</div>
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="font-black text-lg">{listing.views}</span>
                                                <span className="text-[11px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                    <FaArrowUp size={8} /> {listing.trend}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Recommendations */}
                        <PlanGuard plan={user?.subscriptionPlan || 'free'} message="Upgrade to Pro for AI-driven pricing insights and marketing recommendations that boost sales.">
                            <div className="bg-[#F9F6FF] rounded-3xl p-8 shadow-sm border border-purple-100 h-full">
                                <h2 className="text-xl font-bold mb-1 text-[#6A4FC5] flex items-center gap-2">
                                    <FaRobot className="text-[#A374FF]" /> AI Recommendations
                                </h2>
                                <p className="text-purple-400 text-sm font-medium mb-8">Data-driven insights to boost your property sales</p>

                                <div className="space-y-4">
                                    {AI_RECOMMENDATIONS.map((rec, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-white hover:border-purple-200 transition-all group">
                                            <div className="mt-1">
                                                <rec.icon className="text-green-500 group-hover:scale-110 transition-transform" size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 mb-1">{rec.text}</div>
                                                <div className="text-xs text-gray-500 leading-relaxed font-medium">
                                                    {rec.subtext}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PlanGuard>

                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
