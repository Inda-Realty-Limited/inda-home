import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaEye, FaUserFriends, FaBullseye, FaChartLine,
    FaStar, FaBolt, FaCheck, FaChartBar, FaBullhorn, FaPlus
} from 'react-icons/fa';

interface PerformanceMetric {
    label: string;
    value: string;
    icon: React.ElementType;
    bg: string;
    textColor: string;
}

interface FeaturedListing {
    id: number;
    title: string;
    location: string;
    price: string;
    fmvScore: number;
    views: string;
    leads: number;
    daysLeft: number;
    progress: number;
    imageClass: string;
}

const PRO_BENEFITS = [
    "Unlimited featured listings",
    "Homepage banner placement",
    "Priority search ranking",
    "Advanced analytics & insights"
];

export default function AdvertisementPage() {
    const [listings] = useState<FeaturedListing[]>([]);

    const metrics: PerformanceMetric[] = [
        { label: "Views from Features", value: "0", icon: FaEye, bg: "bg-[#F0F9F9]", textColor: "text-inda-teal" },
        { label: "Verified Leads", value: "0", icon: FaUserFriends, bg: "bg-[#D0E8E8]", textColor: "text-inda-dark" },
        { label: "Conversion Rate", value: "0%", icon: FaBullseye, bg: "bg-[#F0F9F9]", textColor: "text-inda-teal" },
        { label: "ROI per Lead", value: "₦0", icon: FaChartLine, bg: "bg-[#E2EBEB]", textColor: "text-inda-dark" },
    ];

    return (
        <DashboardLayout title="Advertisement">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-inda-dark">Advertisement</h1>
                    <p className="text-gray-500 mt-1">Boost visibility and get your verified listings featured to serious buyers</p>
                </div>
                <button className="bg-[#54A6A6] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-teal-700 transition shadow-sm flex items-center gap-2">
                    <FaPlus size={10} /> Feature a Listing
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-gray-700 font-medium">
                    <FaChartBar className="text-inda-teal" /> Featured Listings Performance
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className={`${metric.bg} p-6 rounded-lg flex flex-col items-center justify-center text-center min-h-[140px] transition-transform hover:scale-[1.02]`}>
                            <metric.icon className={`mb-3 text-2xl opacity-60 ${metric.textColor}`} />
                            <h3 className={`text-3xl font-bold mb-1 ${metric.textColor}`}>{metric.value}</h3>
                            <p className="text-xs text-gray-500 font-medium">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-bold text-inda-dark mb-6">Active Featured Listings</h3>

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Map items... */}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <FaBullhorn className="text-3xl text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 font-bold mb-2">No Active Advertisements</h4>
                        <p className="text-gray-500 text-sm max-w-sm mb-6">
                            You haven't promoted any listings yet. Feature your best properties to appear on the homepage and get 3x more leads.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-r from-[#54A6A6] to-[#2D5555] rounded-xl p-8 md:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-3 text-white/80 font-bold text-xs uppercase tracking-wider">
                        <FaBolt /> Upgrade to Pro Plan
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Get unlimited credits + banner placements on high-traffic pages</h2>

                    <div className="mt-6 space-y-2">
                        {PRO_BENEFITS.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium opacity-90">
                                <div className="bg-white/20 p-1 rounded-full shrink-0">
                                    <FaCheck size={8} />
                                </div>
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center md:text-right shrink-0">
                    <h3 className="text-4xl font-bold mb-1">₦100,000</h3>
                    <p className="text-sm opacity-70 mb-6">per month</p>
                    <button className="bg-white text-[#2D5555] font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg w-full md:w-auto text-sm uppercase tracking-wide">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
