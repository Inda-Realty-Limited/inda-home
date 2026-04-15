import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share2, Users, BarChart3, Calendar, Download } from 'lucide-react';
import { MarketingService, AnalyticsData } from '@/api/marketing';

interface Props { onBack: () => void; }

export function AnalyticsView({ onBack }: Props) {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    MarketingService.getAnalytics(period)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [period]);

  const km = data?.keyMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300">
          <ArrowLeft className="w-4 h-4" /> Back to Marketing
        </button>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">This Year</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 hover:border-gray-300">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-inda-teal to-teal-700 bg-clip-text text-transparent">
          Performance Analytics
        </h1>
        <p className="text-gray-500 mt-0.5">Track your social media and marketing performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Eye, bg: 'bg-blue-100', color: 'text-blue-600', value: km?.totalReach?.toLocaleString() ?? '—', label: 'Total Reach', trend: km?.totalReachTrend, up: km?.totalReachTrend?.startsWith('+') },
          { icon: Heart, bg: 'bg-purple-100', color: 'text-purple-600', value: km ? `${km.engagementRate}%` : '—', label: 'Engagement Rate', trend: km?.engagementTrend, up: km?.engagementTrend?.startsWith('+') },
          { icon: Users, bg: 'bg-inda-teal/10', color: 'text-inda-teal', value: km?.leadsGenerated?.toString() ?? '—', label: 'Leads Generated', trend: km?.leadsTrend, up: km?.leadsTrend?.startsWith('+') },
          { icon: BarChart3, bg: 'bg-pink-100', color: 'text-pink-600', value: km?.postsPublished?.toString() ?? '—', label: 'Posts Published', trend: km?.postsTrend, up: km?.postsTrend?.startsWith('+') },
        ].map((m, i) => {
          const Icon = m.icon;
          const TrendIcon = m.up ? TrendingUp : TrendingDown;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                {m.trend && (
                  <div className={`flex items-center gap-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">{m.trend}</span>
                  </div>
                )}
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{m.value}</p>
              )}
              <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
            </div>
          );
        })}
      </div>

      {/* Platform Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Performance</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : !data?.platformStats?.length ? (
          <div className="text-center py-12 text-gray-400">
            <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No platform data yet. Start publishing content to see stats.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.platformStats.map(stat => {
              const colorMap: Record<string, string> = {
                instagram: 'from-purple-500 to-pink-500',
                facebook: 'from-blue-600 to-blue-400',
                linkedin: 'from-blue-700 to-blue-500',
                tiktok: 'from-gray-900 to-gray-700',
                youtube: 'from-red-600 to-red-400',
                twitter: 'from-gray-800 to-gray-600',
              };
              const iconMap: Record<string, string> = {
                instagram: '📸', facebook: '📘', linkedin: '💼',
                tiktok: '🎵', youtube: '▶️', twitter: '𝕏',
              };
              const color = colorMap[stat.platform.toLowerCase()] || 'from-gray-500 to-gray-400';
              const icon = iconMap[stat.platform.toLowerCase()] || '📱';
              return (
                <div key={stat.platform} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-2xl`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">{stat.platform}</h3>
                        <p className="text-sm text-gray-500">{stat.posts} posts this month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{stat.reach.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">total reach</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Heart, label: 'Engagement', value: stat.engagement },
                      { icon: Users, label: 'Leads', value: stat.leads },
                      { icon: Share2, label: 'Avg. Reach', value: stat.posts ? Math.floor(stat.reach / stat.posts) : 0 },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <p className="text-xs text-gray-500">{item.label}</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : !data?.recentPosts?.length ? (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No posts yet. Create your first branded content to see results here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{post.content}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                      <span className="font-medium capitalize">{post.platform}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-center flex-shrink-0 ml-4">
                  <div><p className="text-xs text-gray-500 mb-0.5">Reach</p><p className="font-bold text-gray-900">{post.reach.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500 mb-0.5">Engagement</p><p className="font-bold text-gray-900">{post.engagement}</p></div>
                  <div><p className="text-xs text-gray-500 mb-0.5">Leads</p><p className="font-bold text-inda-teal">{post.leads}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" /> Top Performing Content
          </h3>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Property tours get 3× more engagement than static posts</li>
            <li>• Posts with price tags generate 45% more inquiries</li>
            <li>• Evening posts (6–8 PM) reach 28% more people</li>
            <li>• Video content has 2.1× higher engagement rate</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Recommendations
          </h3>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li>• Increase posting frequency on Instagram (best ROI)</li>
            <li>• Try more video content on TikTok</li>
            <li>• Schedule posts for Tuesday–Thursday evenings</li>
            <li>• Add more call-to-action buttons to posts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
