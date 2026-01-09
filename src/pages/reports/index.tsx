import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaCheck, FaChevronDown,
    FaExclamationCircle, FaSpinner, FaFileAlt
} from 'react-icons/fa';
import {
    FiPackage, FiCreditCard, FiChevronLeft, FiChevronRight, FiAlertCircle, FiLoader
} from 'react-icons/fi';
import { ProReportsService } from '@/api/pro-reports';
import { useAuth } from '@/contexts/AuthContext';
import OrderCard from '@/components/dashboard/OrderCard';
import {
    getOrdersAndPayments,
    OrdersApiResponse,
    OrdersByListingItem,
} from "@/api/payments";
import PaymentReceipt from "@/components/inc/PaymentReceipt";

type TabOption = 'library' | 'payments' | 'generate';

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

export default function ReportsHubPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabOption>('library');
    const [generateStep, setGenerateStep] = useState(1);
    const [data, setData] = useState<OrdersApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
    const [propertyInput, setPropertyInput] = useState({ address: '', type: '' });
    const [generating, setGenerating] = useState<string | null>(null);
    const itemsPerPage = 5;

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const res = await getOrdersAndPayments({ page, limit: 100 });
            setData(res);
            setError(null);
        } catch (e: any) {
            setError(e?.message || "Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData(1);
        }
    }, [isAuthenticated]);

    // Paginate orders locally
    const paginatedOrders = useMemo(() => {
        if (!data?.orders) return [];
        const start = (currentPage - 1) * itemsPerPage;
        return data.orders.slice(start, start + itemsPerPage);
    }, [data?.orders, currentPage]);

    const totalOrderPages = useMemo(() => {
        if (!data?.orders) return 0;
        return Math.ceil(data.orders.length / itemsPerPage);
    }, [data?.orders]);

    // Paginate payments locally
    const paginatedPayments = useMemo(() => {
        if (!data?.payments?.items) return [];
        const start = (currentPage - 1) * itemsPerPage;
        return data.payments.items.slice(start, start + itemsPerPage);
    }, [data?.payments?.items, currentPage]);

    const totalPaymentPages = useMemo(() => {
        if (!data?.payments?.items) return 0;
        return Math.ceil(data.payments.items.length / itemsPerPage);
    }, [data?.payments?.items]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleTabChange = (tab: TabOption) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

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
                fetchData(1);
            }
        } catch (err: any) {
            console.error("Generation failed:", err);
            alert(err.message || "Failed to generate report. Please try again.");
        } finally {
            setGenerating(null);
        }
    };

    const formatPrice = (price?: number) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getPlanColor = (plan: string) => {
        switch (plan.toLowerCase()) {
            case "free": return "bg-green-100 text-green-800 border-green-200";
            case "instant": return "bg-blue-100 text-blue-800 border-blue-200";
            case "deep dive":
            case "deepdive": return "bg-purple-100 text-purple-800 border-purple-200";
            case "deeper dive":
            case "deeperdive": return "bg-indigo-100 text-indigo-800 border-indigo-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "success": return "bg-green-100 text-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "failed": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const navigateToReport = (order: OrdersByListingItem) => {
        // Find if there's a corresponding report ID
        // Note: The backend getOrdersAndPayments doesn't directly return the report ID in the 'orders' array currently,
        // but we can navigate to deep-dive-report or deeper-dive-report with the listing URL
        if (!order.listing.listingUrl) return;

        const plan = order.plans[0]?.plan.toLowerCase();
        if (plan === 'deepdive' || plan === 'deep dive') {
            router.push(`/deep-dive-report?q=${encodeURIComponent(order.listing.listingUrl)}&type=link`);
        } else if (plan === 'deeperdive' || plan === 'deeper dive') {
            router.push(`/deeper-dive-report?q=${encodeURIComponent(order.listing.listingUrl)}&type=link`);
        }
    };

    return (
        <DashboardLayout title="Reports Hub">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-inda-dark">Reports Hub</h1>
                    <p className="text-gray-500 mt-1">Generate and track your property analysis reports</p>
                </div>

                {/* Top summary - Replicated from orders.tsx */}
                {data && (
                    <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
                        <div className="rounded-xl bg-white border border-black/10 p-4 shadow-sm">
                            <div className="text-xs text-[#6B7280]">Total orders</div>
                            <div className="text-2xl font-bold">{data.summary.totalOrders}</div>
                        </div>
                        <div className="rounded-xl bg-white border border-black/10 p-4 shadow-sm">
                            <div className="text-xs text-[#6B7280]">Listings</div>
                            <div className="text-2xl font-bold">{data.summary.totalListings}</div>
                        </div>
                        <div className="rounded-xl bg-white border border-black/10 p-4 shadow-sm">
                            <div className="text-xs text-[#6B7280]">Payments</div>
                            <div className="text-2xl font-bold">{data.summary.totalPayments}</div>
                        </div>
                    </div>
                )}

                {/* Tabs - Underlined system from orders.tsx */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => handleTabChange('library')}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all ${activeTab === 'library'
                                ? "border-[#4EA8A1] text-[#4EA8A1]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <FiPackage size={16} />
                            Reports Library {data && `(${data.summary.totalListings})`}
                        </button>
                        <button
                            onClick={() => handleTabChange('payments')}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all ${activeTab === 'payments'
                                ? "border-[#4EA8A1] text-[#4EA8A1]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <FiCreditCard size={16} />
                            Payment History {data && `(${data.summary.totalPayments})`}
                        </button>
                        <button
                            onClick={() => handleTabChange('generate')}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all relative ${activeTab === 'generate'
                                ? "border-[#4EA8A1] text-[#4EA8A1]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            <FaFileAlt size={14} />
                            Generate New Report
                        </button>
                    </nav>
                </div>

                {/* Loading / Error states */}
                {loading && (
                    <div className="p-12 flex flex-col items-center justify-center text-inda-teal bg-white rounded-xl border border-gray-200">
                        <FiLoader className="animate-spin text-3xl mb-4" />
                        <p className="text-sm text-gray-500">Loading your reports history...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl flex flex-col items-center">
                        <FiAlertCircle className="text-red-500 text-2xl mb-2" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Library Tab content */}
                {!loading && !error && activeTab === 'library' && (
                    <div className="space-y-4">
                        {paginatedOrders.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    {paginatedOrders.map((order) => (
                                        <OrderCard
                                            key={order.listingId}
                                            order={order}
                                            onClick={navigateToReport}
                                            formatPrice={formatPrice}
                                            getPlanColor={getPlanColor}
                                        />
                                    ))}
                                </div>
                                {/* Pagination */}
                                {totalOrderPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                        <div className="text-sm text-[#6B7280]">Page {currentPage} of {totalOrderPages}</div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FiChevronLeft size={16} /> Previous
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalOrderPages}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next <FiChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm text-sm flex flex-col items-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-3">
                                    <FiPackage className="text-gray-300 text-xl" />
                                </div>
                                No reports found. Generate your first report to see it here.
                            </div>
                        )}
                    </div>
                )}

                {/* Payments Tab content */}
                {!loading && !error && activeTab === 'payments' && (
                    <div className="space-y-4">
                        {paginatedPayments.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {paginatedPayments.map((payment) => (
                                        <div key={payment._id} className="rounded-xl bg-white border border-black/10 p-4 shadow-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPlanColor(payment.plan)}`}>
                                                            {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getPaymentStatusColor(payment.status)}`}>
                                                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-[#101820] line-clamp-1 text-sm">
                                                        {payment.listingUrl ? new URL(payment.listingUrl).pathname.split("/").pop()?.replace(/-/g, " ") : "Property Analysis"}
                                                    </p>
                                                    <p className="text-xs text-[#6B7280]">Ref: {payment.reference}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-[#101820] text-sm">{formatPrice(payment.amountNGN)}</div>
                                                    <div className="text-xs text-[#6B7280]">
                                                        {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Pending"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Pagination */}
                                {totalPaymentPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                        <div className="text-sm text-[#6B7280]">Page {currentPage} of {totalPaymentPages}</div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FiChevronLeft size={16} /> Previous
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPaymentPages}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next <FiChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm text-sm flex flex-col items-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-3">
                                    <FiCreditCard className="text-gray-300 text-xl" />
                                </div>
                                No payment history found.
                            </div>
                        )}
                    </div>
                )}

                {/* Generate Tab content */}
                {!loading && activeTab === 'generate' && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <h2 className="text-lg font-bold text-inda-dark mb-6">Generate New Report</h2>

                        <div className="flex items-center mb-8 relative">
                            <div className="absolute left-4 right-auto top-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-300 -z-0"></div>
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
                                        <div key={type.title} className={`p-6 rounded-xl border border-transparent hover:border-inda-teal/30 transition-all ${type.bg} flex flex-col justify-between shadow-sm`}>
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
                                    className="bg-white border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition shadow-sm"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Payment Receipt Modal */}
            {selectedPayment && (
                <PaymentReceipt
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </DashboardLayout>
    );
}
