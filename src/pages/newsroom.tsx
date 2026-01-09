import { useState, useEffect } from 'react';
import { Button } from '../views/index/sections/ui/button';
import { Search, ArrowRight, TrendingUp, Download, Calendar, ExternalLink, FileText } from 'lucide-react';
import { FooterCTA } from '../views/index/sections/FooterCTA';
import { Navbar } from '@/components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const priceData = [
  { month: 'Jan', value: 32 },
  { month: 'Feb', value: 34 },
  { month: 'Mar', value: 36 },
  { month: 'Apr', value: 38 },
  { month: 'May', value: 41 },
  { month: 'Jun', value: 43 },
];

const tickerData = [
  { location: 'Ikoyi (Banana Island)', price: '₦1.2B', change: '+8.7%', updatedAt: new Date(Date.now() - 3 * 60 * 1000) },
  { location: 'Lekki Phase 1', price: '₦85M', change: '+12.3%', updatedAt: new Date(Date.now() - 7 * 60 * 1000) },
  { location: 'Victoria Island (VI)', price: '₦450M', change: '+6.1%', updatedAt: new Date(Date.now() - 12 * 60 * 1000) },
  { location: 'Ajah', price: '₦32M', change: '+15.2%', updatedAt: new Date(Date.now() - 45 * 1000) },
  { location: 'Abuja (Maitama)', price: '₦280M', change: '+9.4%', updatedAt: new Date(Date.now() - 1 * 3600 * 1000) },
  { location: 'Port Harcourt (GRA)', price: '₦95M', change: '+11.7%', updatedAt: new Date(Date.now() - 2 * 3600 * 1000) },
];

export function Newsroom() {
  const [activeTab, setActiveTab] = useState('market-news');
  const [selectedIndicator, setSelectedIndicator] = useState('House Price Index');
  const [relativeTime, setRelativeTime] = useState<{ [key: number]: string }>({});

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  useEffect(() => {
    const updateTimes = () => {
      const newRelativeTime: { [key: number]: string } = {};
      tickerData.forEach((item, index) => {
        newRelativeTime[index] = formatRelativeTime(item.updatedAt);
      });
      setRelativeTime(newRelativeTime);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const indicators = [
    'House Price Index',
    'Rent Indices',
    'CPI',
    'Interest Rate',
    'Transaction Volume',
    'Exchange Rate',
    'Employment & Savings',
    'Inflation (YY)',
    'Development Spending',
    'Construction Index',
    'Labour Index',
    'Infrastructural Projects',
  ];

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-gradient-to-br from-[#4ea8a1] via-teal-600 to-emerald-700">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative text-center">
          <h1 className="text-5xl lg:text-6xl mb-6 leading-tight text-white">
            The Pulse of African Real Estate.
          </h1>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Verified news, market data, and Inda announcements.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search news, data, or reports..." 
                className="w-full outline-none text-gray-900"
              />
            </div>
            <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Real-time Ticker */}
      <section className="bg-gray-900 py-6 px-6 border-y border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 mb-3 px-6">
          <TrendingUp className="w-4 h-4 text-[#4ea8a1]" />
          <span className="text-xs uppercase tracking-wider text-gray-400">Live FMV</span>
        </div>
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling ticker container */}
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-scroll-slow w-max">
              {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 whitespace-nowrap flex-shrink-0"
                >
                  <div>
                    <div className="text-white text-sm font-medium">{item.location}</div>
                    <div className="text-gray-400 text-xs">{item.price}</div>
                  </div>
                  <div className="text-emerald-400 text-sm font-medium">
                    {item.change}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {relativeTime[index % tickerData.length] || 'updating...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Categories Tabs */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 flex-wrap mb-12 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('market-news')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'market-news'
                  ? 'bg-[#4ea8a1] text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Market News
            </button>
            <button
              onClick={() => setActiveTab('data-center')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'data-center'
                  ? 'bg-[#4ea8a1] text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Data Center
            </button>
            <button
              onClick={() => setActiveTab('inda-reports')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'inda-reports'
                  ? 'bg-[#4ea8a1] text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Inda Reports
            </button>
            <button
              onClick={() => setActiveTab('weekly-snapshots')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                activeTab === 'weekly-snapshots'
                  ? 'bg-[#4ea8a1] text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Weekly Snapshots
            </button>
          </div>

          {/* Featured Stories */}
          {activeTab === 'market-news' && (
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">Featured Stories</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Story 1 */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-[#4ea8a1] to-teal-600 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>December 5, 2024</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Market Update</span>
                    </div>
                    <h3 className="text-xl mb-3 text-gray-900">
                      Lagos Property Market Hits Record High in Q4 2024
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Average property values in Lagos increased 12% year-over-year, with Lekki, Ikoyi, and VI leading the surge. Inda data shows strong buyer confidence.
                    </p>
                    <a href="#" className="text-[#4ea8a1] hover:underline flex items-center gap-2">
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>November 28, 2024</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Policy</span>
                    </div>
                    <h3 className="text-xl mb-3 text-gray-900">
                      New Property Verification Standards Introduced
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Federal government announces mandatory property verification for transactions above ₦50M. Inda already compliant with all new requirements.
                    </p>
                    <a href="#" className="text-[#4ea8a1] hover:underline flex items-center gap-2">
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>November 20, 2024</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Data Insight</span>
                    </div>
                    <h3 className="text-xl mb-3 text-gray-900">
                      ROI Patterns: Which Lagos Areas Offer Best Returns?
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Inda's Q4 report reveals Ajah and Epe leading with 14-16% annual ROI, while established areas maintain steady 8-10% returns.
                    </p>
                    <a href="#" className="text-[#4ea8a1] hover:underline flex items-center gap-2">
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Center Tab */}
          {activeTab === 'data-center' && (
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">National Data Center</h2>
              
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Indicators */}
                <div className="lg:col-span-1 bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg mb-4 text-gray-900">Data Indicators</h3>
                  <ul className="space-y-2">
                    {indicators.map((indicator) => (
                      <li key={indicator}>
                        <button
                          onClick={() => setSelectedIndicator(indicator)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                            selectedIndicator === indicator
                              ? 'bg-[#4ea8a1] text-white'
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {indicator}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Content - Chart */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl mb-2 text-gray-900">{selectedIndicator}</h3>
                        <p className="text-gray-600">Last updated: December 9, 2024</p>
                      </div>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={priceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4ea8a1" 
                          strokeWidth={3}
                          dot={{ fill: '#4ea8a1', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Current Value</div>
                        <div className="text-2xl text-gray-900">43.2</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Change (YoY)</div>
                        <div className="text-2xl text-emerald-600">+12.5%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">6-Month Avg</div>
                        <div className="text-2xl text-gray-900">37.3</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
                        Download Full Report
                        <Download className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inda Reports Tab */}
          {activeTab === 'inda-reports' && (
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">Inda Reports</h2>
              
              <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-3xl p-12 mb-8 border border-gray-200">
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-3xl mb-4 text-gray-900">Q4 2024 Market Report</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Comprehensive analysis of Nigeria's real estate market trends, pricing patterns, and investment opportunities.
                  </p>
                  <Button size="lg" className="bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] hover:from-[#3d8680] hover:to-[#2d7670]">
                    Download Full Report
                    <Download className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Report 1 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl mb-6 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-[#4ea8a1]" />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">
                    2026 ROI Outlook — Where Investors Win
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Data-driven predictions for high-yield areas across Nigeria in 2026                                                                                                                                                                                                                                                                                     .
                  </p>
                  <Button variant="outline" className="w-full border-[#4ea8a1] text-[#4ea8a1] hover:bg-[#4ea8a1] hover:text-white">
                    Read Report
                  </Button>
                </div>

                {/* Report 2 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mb-6 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">
                    How Inflation Reshapes Nigerian Real Estate
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Understanding macro trends and their impact on property values.
                  </p>
                  <Button variant="outline" className="w-full border-[#4ea8a1] text-[#4ea8a1] hover:bg-[#4ea8a1] hover:text-white">
                    Read Report
                  </Button>
                </div>

                {/* Report 3 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-6 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-purple-600" />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">
                    The Rise of Verified Listings in Africa
                  </h3>
                  <p className="text-gray-600 mb-4">
                    How property verification is transforming the African market.
                  </p>
                  <Button variant="outline" className="w-full border-[#4ea8a1] text-[#4ea8a1] hover:bg-[#4ea8a1] hover:text-white">
                    Read Report
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Snapshots Tab */}
          {activeTab === 'weekly-snapshots' && (
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">Weekly Snapshots</h2>
              
              <div className="space-y-6">
                {/* Snapshot 1 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#4ea8a1] text-white rounded-full text-sm">This Week</span>
                        <span className="text-sm text-gray-600">December 2-9, 2024</span>
                      </div>
                      <h3 className="text-2xl mb-3 text-gray-900">
                        Week in Review: Lagos Market Surge Continues
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        This week saw a 2.3% increase in average property values across Lagos mainland. Ikorodu and Ikeja led with 3.5% and 3.1% gains respectively. Transaction volume up 18% week-over-week.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
                          Read Snapshot
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button variant="outline">
                          Download PDF
                          <Download className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-32 h-32 bg-gradient-to-br from-[#4ea8a1] to-teal-600 rounded-2xl flex items-center justify-center ml-6 flex-shrink-0">
                      <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>

                {/* Snapshot 2 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Last Week</span>
                        <span className="text-sm text-gray-600">November 25 - December 1, 2024</span>
                      </div>
                      <h3 className="text-2xl mb-3 text-gray-900">
                        Abuja Emerges as High-ROI Destination
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Abuja recorded 11.2% ROI across all property types last week. Gwarinpa and Kubwa leading with residential investments. Commercial spaces in Wuse showing strong rental yields.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
                          Read Snapshot
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button variant="outline">
                          Download PDF
                          <Download className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center ml-6 flex-shrink-0">
                      <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>

                {/* Snapshot 3 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">2 Weeks Ago</span>
                        <span className="text-sm text-gray-600">November 18-24, 2024</span>
                      </div>
                      <h3 className="text-2xl mb-3 text-gray-900">
                        Port Harcourt Real Estate Renaissance
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Port Harcourt GRA properties gained 15% in value this month. Increased business activity and oil sector recovery driving demand. New developments in Trans-Amadi showing promise.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
                          Read Snapshot
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button variant="outline">
                          Download PDF
                          <Download className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center ml-6 flex-shrink-0">
                      <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl mb-8 text-gray-900">Press Releases & Announcements</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Press Release 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-sm text-gray-600 mb-3">November 15, 2024</div>
              <h3 className="text-xl mb-3 text-gray-900">
                Inda Secures $5M Series A Funding
              </h3>
              <p className="text-gray-600 mb-4">
                Leading African VCs back Inda's mission to bring transparency to real estate across the continent.
              </p>
              <a href="#" className="text-[#4ea8a1] hover:underline flex items-center gap-2">
                Read More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Press Release 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-sm text-gray-600 mb-3">October 28, 2024</div>
              <h3 className="text-xl mb-3 text-gray-900">
                Partnership with 5 Major Nigerian Banks
              </h3>
              <p className="text-gray-600 mb-4">
                Inda verification reports now accepted for mortgage approvals at leading financial institutions.
              </p>
              <a href="#" className="text-[#4ea8a1] hover:underline flex items-center gap-2">
                Read More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Press Release 3 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-sm text-gray-600 mb-3">October 10, 2024</div>
              <h3 className="text-xl mb-3 text-gray-900">
                New Leadership: Chief Data Officer Joins Inda
              </h3>
              <p className="text-gray-600 mb-4">
                Former World Bank economist Dr. Amara Okafor joins to lead data intelligence and market research.
              </p>
              <a href="#" className="text-[#4ea8a1] hover:underline flex items-center gap-2">
                Read More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#4ea8a1] to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">
            Stay Updated with Africa's Verified Property Intelligence
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Get weekly market insights, data reports, and Inda updates delivered to your inbox.
          </p>
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl outline-none text-gray-900"
            />
            <Button size="lg" className="bg-white text-[#4ea8a1] hover:bg-emerald-50 px-8 py-4">
              Join Newsletter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}

export default Newsroom;
