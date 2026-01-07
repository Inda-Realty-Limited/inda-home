import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaCheck, FaChevronDown,
    FaExclamationCircle, FaSpinner, FaFileAlt
} from 'react-icons/fa';
import { ProReportsService } from '@/api/pro-reports';

type TabOption = 'library' | 'generate';

interface Report {
    id: string;
    client: string;
    analyst: string;
    date: string;
    status: 'Completed' | 'Pending' | 'In Progress';
    type: string;
    reportType?: string;
    propertyAddress?: string;
    createdAt?: string;
}

const REPORT_TYPES = [
    {
        title: "Instant",
        displayTitle: "Instant Report",
        desc: "Quick snapshot",
        credits: 1,
        features: ["Title Insights", "Market valuation", "Risk snapshot"],
        bg: "bg-[#F3F4F6]",
        badgeColor: "bg-[#54A6A6]"
    },
    {
        title: "Deep Dive",
        displayTitle: "Deep Dive Report",
        desc: "Legal & survey",
        credits: 5,
        features: ["C of O / Deed check", "Governor's consent", "Zoning compliance", "Survey verification", "Litigation search"],
        bg: "bg-[#F0FDF4]",
        badgeColor: "bg-[#54A6A6]"
    },
    {
        title: "Deeper Dive",
        displayTitle: "Deeper Dive Report",
        desc: "Full due diligence",
        credits: 12,
        features: ["Everything in Deep Dive", "Seller identity verification", "On-site inspection", "Photo evidence"],
        bg: "bg-[#F0F9FF]",
        badgeColor: "bg-[#54A6A6]"
    }
];

import { useAuth } from '@/contexts/AuthContext';

export default function ReportsHubPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabOption>('library');
    const [generateStep, setGenerateStep] = useState(1);
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [propertyInput, setPropertyInput] = useState({ address: '', type: '' });
    const [error, setError] = useState<string | null>(null);
    const [generating, setGenerating] = useState<string | null>(null);

    const fetchReports = async () => {
        if (!user) return;

        try {
            setLoadingReports(true);
            const userId = user.id || user._id || (user as any).user?.id;

            if (userId) {
                const data = await ProReportsService.getUserReports(userId);
                setReports(Array.isArray(data) ? data : (data.data || []));
            }
        } catch (err) {
            console.error("Failed to load reports:", err);
        } finally {
            setLoadingReports(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'library' && user) {
            fetchReports();
        }
    }, [activeTab, user]);

    const handleContinue = () => {
        if (!propertyInput.address.trim()) {
            setError("Please enter a property link or address.");
            return;
        }
        if (!propertyInput.type) {
            setError("Please select a property type.");
            return;
        }
        setError(null);
        setGenerateStep(2);
    };

    const handleGenerateReport = async (reportTitle: string) => {
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            setGenerating(reportTitle);
            const userId = user.id || user._id || (user as any).user?.id;

            const payload = {
                userId,
                propertyAddress: propertyInput.address,
                propertyType: propertyInput.type,
                reportType: reportTitle
            };

            const response = await ProReportsService.generateReport(payload);

            if (response.success || response.reportId) {
                alert(`Report started! Credits deducted: ${response.creditsDeducted || 'N/A'}`);
                setGenerateStep(1);
                setPropertyInput({ address: '', type: '' });
                setActiveTab('library');
                fetchReports();
            }
        } catch (err: any) {
            console.error("Generation failed:", err);
            alert(err.message || "Failed to generate report. Please try again.");
        } finally {
            setGenerating(null);
        }
    };

    return (
        <DashboardLayout title="Reports Hub">
            <div className="max-w-5xl mx-auto pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-inda-dark">Reports Hub</h1>
                    <p className="text-gray-500 mt-1">Generate comprehensive property analysis reports</p>
                </div>

                <div className="bg-[#54A6A6] p-1 rounded-lg flex mb-10 shadow-sm">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${activeTab === 'library' ? 'bg-white text-inda-teal shadow-sm' : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Reports Library
                    </button>
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`flex-1 py-3 text-sm font-bold rounded-md transition-all relative ${activeTab === 'generate' ? 'bg-white text-inda-teal shadow-sm' : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Generate New Report
                        {activeTab === 'generate' && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-inda-teal rounded-full"></div>}
                    </button>
                </div>

                {activeTab === 'library' && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden auto-in fade-in duration-300">
                        <div className="grid grid-cols-5 bg-[#F9FAFB] p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <div className="col-span-1">Report ID</div>
                            <div className="col-span-2">Property / Client</div>
                            <div className="col-span-1">Date</div>
                            <div className="col-span-1">Status</div>
                        </div>

                        {loadingReports ? (
                            <div className="p-12 flex justify-center text-inda-teal">
                                <FaSpinner className="animate-spin text-2xl" />
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {reports.length > 0 ? (
                                    reports.map((report) => (
                                        <Link href={`/reports/${report.id}`} key={report.id || Math.random()} className="grid grid-cols-5 p-4 items-center hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium cursor-pointer group">
                                            <div className="col-span-1 font-bold text-inda-dark group-hover:text-inda-teal transition-colors underline decoration-dotted underline-offset-2">
                                                {report.id}
                                            </div>
                                            <div className="col-span-2 flex flex-col">
                                                <span className="truncate font-bold">{report.propertyAddress || report.client || "Property Report"}</span>
                                                <span className="text-xs text-gray-400">{report.type || report.reportType}</span>
                                            </div>
                                            <div className="col-span-1 text-xs text-gray-500">{report.date || (report.createdAt && new Date(report.createdAt).toLocaleDateString()) || 'N/A'}</div>
                                            <div className="col-span-1">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${report.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        report.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {report.status || 'In Progress'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center">
                                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                                            <FaFileAlt className="text-gray-300 text-xl" />
                                        </div>
                                        No reports found. Generate your first report above.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'generate' && (
                    <div className="auto-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-lg font-bold text-inda-dark mb-6">Generate New Report</h2>

                        <div className="flex items-center mb-8 relative">
                            <div className="absolute left-4 right-auto top-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-300 -z-10"></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-8 z-10 transition-colors duration-300 ${generateStep >= 1 ? 'bg-[#54A6A6]' : 'bg-gray-300'
                                }`}>
                                {generateStep > 1 ? <FaCheck /> : '1'}
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition-colors duration-300 ${generateStep === 2 ? 'border-[#54A6A6] text-[#54A6A6] bg-white' : 'border-gray-300 text-gray-400 bg-white'
                                }`}>
                                2
                            </div>
                        </div>

                        {generateStep === 1 && (
                            <div className="space-y-6 max-w-2xl">
                                <h3 className="text-sm font-bold text-inda-dark">Step 1: Property Input</h3>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                        <FaExclamationCircle /> {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Property Link or Address</label>
                                    <input
                                        type="text"
                                        placeholder="Paste Property Link or enter Address"
                                        className={`w-full bg-[#F3F4F6] border rounded-lg px-4 py-3 text-sm text-gray-700 focus:bg-white focus:outline-none transition-all ${error && !propertyInput.address ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-inda-teal'
                                            }`}
                                        value={propertyInput.address}
                                        onChange={(e) => {
                                            setPropertyInput({ ...propertyInput, address: e.target.value });
                                            if (error) setError(null);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Property Type</label>
                                    <div className="relative">
                                        <select
                                            className={`w-full bg-[#F3F4F6] border rounded-lg px-4 py-3 text-sm text-gray-700 appearance-none focus:bg-white focus:outline-none cursor-pointer ${error && !propertyInput.type ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-inda-teal'
                                                }`}
                                            value={propertyInput.type}
                                            onChange={(e) => {
                                                setPropertyInput({ ...propertyInput, type: e.target.value });
                                                if (error) setError(null);
                                            }}
                                        >
                                            <option value="" disabled>Select type</option>
                                            <option>Residential</option>
                                            <option>Commercial</option>
                                            <option>Land</option>
                                            <option>Mixed Use</option>
                                        </select>
                                        <FaChevronDown className="absolute right-4 top-4 text-gray-400 text-xs pointer-events-none" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleContinue}
                                    className="bg-[#54A6A6] text-white px-8 py-3 rounded-lg text-xs font-bold hover:bg-teal-700 transition shadow-sm mt-4"
                                >
                                    Continue to Report Selection
                                </button>
                            </div>
                        )}

                        {generateStep === 2 && (
                            <div>
                                <h3 className="text-sm font-bold text-inda-dark mb-6">Step 2: Choose Report Depth</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {REPORT_TYPES.map((type) => (
                                        <div key={type.title} className={`p-6 rounded-xl border border-transparent hover:border-inda-teal/30 transition-all ${type.bg} flex flex-col justify-between`}>
                                            <div>
                                                <div className="mb-4">
                                                    <h4 className="font-bold text-inda-dark text-lg">{type.displayTitle}</h4>
                                                    <p className="text-xs text-gray-500">{type.desc}</p>
                                                </div>

                                                <div className="flex items-center gap-2 mb-6">
                                                    <span className="text-xs font-bold text-gray-600">Credits Required:</span>
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${type.badgeColor}`}>
                                                        {type.credits}
                                                    </span>
                                                </div>

                                                <ul className="space-y-3 mb-6">
                                                    {type.features.map((feat, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                                            <div className="bg-black rounded-full p-0.5 mt-0.5 shrink-0"><FaCheck className="text-white text-[6px]" /></div>
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <button
                                                onClick={() => handleGenerateReport(type.title)}
                                                disabled={!!generating}
                                                className="w-full bg-[#54A6A6] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-teal-700 transition shadow-sm mt-auto disabled:opacity-50 flex justify-center gap-2 items-center"
                                            >
                                                {generating === type.title ? <FaSpinner className="animate-spin" /> : 'Generate Report'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setGenerateStep(1)}
                                    disabled={!!generating}
                                    className="bg-white border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
