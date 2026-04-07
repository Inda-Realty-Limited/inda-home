import { useState, useEffect, useRef } from 'react';
import {
  Database, Upload, CheckCircle2, DollarSign,
  Award, FileText, Clock, TrendingUp,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  ProContributionService,
  type Contribution,
  type ContributionStats,
} from '@/api/pro-contributions';
import Input from '@/components/base/Input';
import { cn } from '@/lib/utils';

type Tab = 'contribute' | 'history';
type DataType = 'Property Sale Data' | 'Market Trends' | 'Developer Info' | '';

const CONTRIBUTION_TYPES = [
  { title: 'Property Sale Data', icon: DollarSign, description: 'Recent transaction prices in your area' },
  { title: 'Market Trends', icon: TrendingUp, description: 'Local price movements and demand insights' },
  { title: 'Developer Info', icon: FileText, description: 'Developer credentials and project updates' },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusLabel(status: string): 'Approved' | 'Pending' | 'Rejected' {
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Pending';
}

export default function DataContributionPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contribute');
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [history, setHistory] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [dataType, setDataType] = useState<DataType>('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedStats, contributions] = await Promise.all([
        ProContributionService.getStats(),
        ProContributionService.getMyContributions(),
      ]);
      setStats(fetchedStats);
      setHistory(contributions);
    } catch {
      // leave null so UI can show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataType || !location || !details) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await ProContributionService.submit({ type: dataType, description: details, location });
      setSubmitSuccess(true);
      setDataType('');
      setLocation('');
      setDetails('');
      setFiles([]);
      // Refresh stats and history
      await loadData();
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
              Data Contribution
            </h1>
            <p className="text-gray-600 mt-1">
              Help build Nigeria&apos;s most comprehensive real estate database — earn credits per approved submission
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Database className="w-5 h-5 text-inda-teal" />}
              iconBg="bg-inda-teal/10"
              value={loading ? '—' : String(stats?.totalSubmitted ?? 0)}
              label="Total Submitted"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-100"
              value={loading ? '—' : String(stats?.approved ?? 0)}
              label="Approved"
            />
            <StatCard
              icon={<Clock className="w-5 h-5 text-amber-600" />}
              iconBg="bg-amber-100"
              value={loading ? '—' : String(stats?.pending ?? 0)}
              label="Pending Review"
            />
            <StatCard
              icon={<Award className="w-5 h-5 text-inda-teal" />}
              iconBg="bg-inda-teal/10"
              value={loading ? '—' : (stats?.creditsEarned ?? 0).toLocaleString()}
              label="Credits Earned"
            />
          </div>

          {/* Credits Banner */}
          <div className="bg-gradient-to-r from-inda-teal to-[#3d8780] rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-lg flex-shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Earn Marketing Credits Per Approval</h3>
                <p className="text-white/90 mb-4">
                  Submit sales data, market trends, or developer info. Each approved submission earns you credits
                  automatically added to your balance for use on any marketing service.
                </p>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3 w-fit">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Credits automatically added · No redemption needed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl p-1 shadow-sm border border-inda-gray inline-flex">
            {(['contribute', 'history'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  activeTab === tab
                    ? 'bg-gradient-to-r from-inda-teal to-[#3d8780] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab === 'contribute' ? 'Submit Data' : 'Submission History'}
              </button>
            ))}
          </div>

          {/* Submit Data Tab */}
          {activeTab === 'contribute' && (
            <div className="space-y-6">
              {/* Type cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CONTRIBUTION_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.title}
                      onClick={() => setDataType(type.title)}
                      className={cn(
                        'bg-white rounded-xl p-6 shadow-sm border transition-colors cursor-pointer',
                        dataType === type.title
                          ? 'border-inda-teal ring-1 ring-inda-teal'
                          : 'border-inda-gray hover:border-inda-teal/50'
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-inda-teal/10 rounded-lg">
                          <Icon className="w-6 h-6 text-inda-teal" />
                        </div>
                        <div className="bg-green-50 px-3 py-1 rounded-full">
                          <span className="text-sm font-semibold text-green-700">+credits</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Submit Form */}
              <div className="bg-white rounded-xl shadow-sm border border-inda-gray p-6">
                <h3 className="font-bold text-gray-900 mb-4">Submit New Data</h3>

                {submitSuccess && (
                  <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Submitted successfully! Credits will be added once approved.
                  </div>
                )}
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data Type</label>
                    <select
                      value={dataType}
                      onChange={(e) => setDataType(e.target.value as DataType)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal text-sm"
                    >
                      <option value="">Select data type...</option>
                      <option>Property Sale Data</option>
                      <option>Market Trends</option>
                      <option>Developer Info</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <Input
                      placeholder="e.g. Lekki Phase 1, Lagos"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Details</label>
                    <textarea
                      placeholder="Provide as much detail as possible..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal text-sm resize-none min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Supporting Documents <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-inda-teal transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                      {files.length > 0 && (
                        <p className="text-xs text-inda-teal font-medium mt-2">
                          {files.length} file{files.length > 1 ? 's' : ''} selected
                        </p>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
                  >
                    <Upload className="w-4 h-4" />
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm border border-inda-gray overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-sm text-gray-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Date', 'Type', 'Location', 'Status', 'Credits'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {history.map((row) => {
                        const label = statusLabel(row.status);
                        const loc = (row.data as any)?.location ?? '—';
                        return (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{formatDate(row.createdAt)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{loc}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                'px-3 py-1 rounded-full text-xs font-semibold',
                                label === 'Approved' ? 'bg-green-100 text-green-700' :
                                label === 'Rejected' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              )}>
                                {label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">
                              {row.points > 0 ? `+${row.points}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                      {history.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                            No submissions yet. Start contributing to see your history here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function StatCard({ icon, iconBg, value, label }: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-inda-gray">
      <div className={cn('p-2 rounded-lg w-fit mb-3', iconBg)}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
