import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import {
    DollarSign, Users, Target, Eye, Share2, BarChart3,
    FileText, CheckCircle2, TrendingUp, TrendingDown, ArrowRight
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api';
import leadsApi from '@/api/leads';
import { ProListingsService } from '@/api/pro-listings';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [properties, setProperties] = useState<any[]>([]);
    const [leadTrendPercentage, setLeadTrendPercentage] = useState(0);

    const fetchStats = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const [statsResult, leadStatsResult, userListingsResult] = await Promise.allSettled([
                apiClient.get('/listings/dashboard/stats'),
                leadsApi.getStats(),
                ProListingsService.getUserListings(user.id),
            ]);

            if (statsResult.status === 'fulfilled') {
                setStats(statsResult.value.data.data);
            }

            if (leadStatsResult.status === 'fulfilled' && leadStatsResult.value.success) {
                setLeadTrendPercentage(leadStatsResult.value.data.monthOverMonthChangePct ?? 0);
            }

            if (userListingsResult.status === 'fulfilled') {
                setProperties(userListingsResult.value.data ?? []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const totalLeads = stats?.metrics?.totalLeads ?? 0;
    const totalListings = properties.length;
    const dealProgress = stats?.metrics?.dealProgress ?? 0;
    const conversionRate = stats?.metrics?.conversionRate ?? 0;
    const leadTrendPrefix = leadTrendPercentage > 0 ? '+' : '';
    const leadTrendColor = leadTrendPercentage >= 0 ? 'text-green-600' : 'text-red-600';
    const LeadTrendIcon = leadTrendPercentage >= 0 ? TrendingUp : TrendingDown;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">

                    {/* Performance Overview */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">This Month&apos;s Performance</h2>
                        <p className="text-gray-600 mb-6">Track your key metrics and progress</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Revenue */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Revenue</p>
                                        <p className="text-2xl font-semibold text-gray-900">₦0</p>
                                    </div>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Closed:</span>
                                        <span className="font-medium">₦0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pipeline:</span>
                                        <span className="font-medium text-[#4ea8a1]">Coming Soon</span>
                                    </div>
                                </div>
                            </div>

                            {/* All Leads */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">All Leads</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {loading ? <span className="inline-block w-12 h-7 bg-gray-100 animate-pulse rounded" /> : totalLeads}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <LeadTrendIcon className={`w-4 h-4 ${leadTrendColor}`} />
                                    <span className={`font-medium ${leadTrendColor}`}>
                                        {loading ? '...' : `${leadTrendPrefix}${leadTrendPercentage}%`}
                                    </span>
                                    <span className="text-gray-600">vs last month</span>
                                </div>
                            </div>

                            {/* Conversion Rate */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Target className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Conversion Rate</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {loading ? <span className="inline-block w-16 h-7 bg-gray-100 animate-pulse rounded" /> : `${conversionRate}%`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {loading ? '...' : `${stats?.metrics?.dealsThisMonth ?? 0} deals from ${totalLeads} leads`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Your Progress */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Your Progress</h3>
                            <p className="text-sm text-gray-600">Track what&apos;s driving your deals</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Deal Progress</span>
                                <span className="text-lg font-semibold text-[#4ea8a1]">{dealProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-[#4ea8a1] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${dealProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Based on your activity in the last 30 days</p>
                        </div>

                        {/* Stage Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Setup */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Eye className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Setup</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Listings</span>
                                        <span className="font-medium">{loading ? '...' : totalListings}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reports</span>
                                        <span className="font-medium">{stats?.metrics?.reportsCreated ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Profile</span>
                                        <span className="font-medium">
                                            {user?.firstName && user?.lastName && user?.email ? '90%' : '60%'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Activation */}
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <Share2 className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Activation</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shared</span>
                                        <span className="font-medium">{stats?.metrics?.reportsShared ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Link Clicks</span>
                                        <span className="font-medium">{stats?.metrics?.linkClicks ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Investors</span>
                                        <span className="font-medium">{stats?.metrics?.investorsAdded ?? 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Engagement */}
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Engagement</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Returns</span>
                                        <span className="font-medium">{stats?.metrics?.returningViews ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg. Time</span>
                                        <span className="font-medium">—</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Notes</span>
                                        <span className="font-medium">{stats?.metrics?.notesLogged ?? 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deals */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Deals</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Buyers</span>
                                        <span className="font-medium">{stats?.metrics?.buyersMarked ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created</span>
                                        <span className="font-medium">{stats?.metrics?.dealsCreated ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Value</span>
                                        <span className="font-medium">—</span>
                                    </div>
                                </div>
                            </div>

                            {/* Closing */}
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">Closing</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Started</span>
                                        <span className="font-medium">{stats?.metrics?.closingStarted ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">In Progress</span>
                                        <span className="font-medium">{stats?.metrics?.closingInProgress ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Closed</span>
                                        <span className="font-medium">{stats?.metrics?.closingClosed ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Your Properties */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Your Properties</h3>
                            <button
                                onClick={() => router.push('/listings')}
                                className="flex items-center gap-1 text-sm font-medium text-[#4ea8a1] border border-[#4ea8a1]/30 px-3 py-1.5 rounded-lg hover:bg-[#4ea8a1]/5 transition-colors"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <div className="h-32 bg-gray-100 animate-pulse" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                                            <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                                            <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
                                        </div>
                                    </div>
                                ))
                            ) : properties.length > 0 ? properties.slice(0, 3).map((property: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => router.push(`/listings/${property.id || property.indaTag || property._id}`)}
                                >
                                    <div className="h-32 bg-gradient-to-br from-[#4ea8a1]/20 to-[#3d8780]/30" />
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-1">{property.title || 'Untitled Property'}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{property.microlocationStd || property.lga || 'Lagos'}</p>
                                        <p className="text-lg font-semibold text-[#4ea8a1]">₦{(property.priceNGN || property.price || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                                    No properties yet. Add your first property to get started.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
