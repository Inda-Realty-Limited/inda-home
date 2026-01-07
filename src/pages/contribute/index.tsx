import React, { useState, useEffect, useRef } from 'react';
import {
    FaCheckCircle, FaCloudUploadAlt, FaChevronDown, FaPlus, FaCalendarAlt, FaFileAlt, FaTimes
} from 'react-icons/fa';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardButton from '@/components/dashboard/DashboardButton';
import { ProContributionService } from '@/api/pro-contributions';

interface ContributionStat {
    label: string;
    value: string | number;
    subtext: string;
    isPrimary?: boolean;
}

export default function DataContributionPage() {
    const [isContributing, setIsContributing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ContributionStat[]>([]);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const loadDashboard = async () => {
            const stored = localStorage.getItem('user');
            if (!stored) return;
            try {
                const user = JSON.parse(stored);
                const userId = user.id || user._id;

                if (userId) {
                    try {
                        const data = await ProContributionService.getDashboard(userId);
                        const dashboard = data.data || data;

                        setStats([
                            { label: 'Total Contributions', value: dashboard.stats?.totalContributions || 0, subtext: 'Verified Transactions', isPrimary: true },
                            { label: 'Credits Gained', value: dashboard.stats?.creditsEarned || 0, subtext: 'From contributions' },
                            { label: 'Impact Score', value: dashboard.stats?.impactScore || 0, subtext: 'Community impact' },
                            { label: 'Leaderboard Rank', value: `#${dashboard.stats?.leaderboardRank || '-'}`, subtext: 'This month' }
                        ]);
                        setHistory(dashboard.history || []);
                    } catch (err) {
                        setStats([
                            { label: 'Total Contributions', value: 0, subtext: 'Verified Transactions', isPrimary: true },
                            { label: 'Credits Earned', value: 0, subtext: 'From contributions' },
                            { label: 'Impact Score', value: 0, subtext: 'Community impact' },
                            { label: 'Leaderboard Rank', value: '-', subtext: 'This month' }
                        ]);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    return (
        <DashboardLayout title="Data Contribution">
            <div className="max-w-6xl mx-auto pb-10">
                {isContributing ? (
                    <ContributionForm onCancel={() => setIsContributing(false)} />
                ) : (
                    <DashboardView
                        loading={loading}
                        stats={stats}
                        history={history}
                        onContribute={() => setIsContributing(true)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}

const DashboardView = ({ loading, stats, history, onContribute }: any) => {
    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-bold text-inda-dark">Data Contribution</h1>
                <p className="text-sm text-gray-500 mt-1">Share real transaction data and earn rewards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat: any, i: number) => (
                    <div key={i} className={`p-6 rounded-xl flex flex-col justify-center h-32 border ${stat.isPrimary ? 'bg-[#2D8B8B] text-white border-transparent' : 'bg-white text-inda-dark border-gray-200'}`}>
                        <div className={`text-xs font-medium mb-1 ${stat.isPrimary ? 'text-white/80' : 'text-gray-500'}`}>{stat.label}</div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className={`text-[10px] ${stat.isPrimary ? 'text-white/70' : 'text-gray-400'}`}>{stat.subtext}</div>
                    </div>
                ))}
            </div>

            <div className="bg-[#EFF8F7] rounded-xl overflow-hidden border border-gray-100 min-h-[300px]">
                <div className="bg-inda-teal text-white p-4 grid grid-cols-12 gap-4 text-xs font-bold items-center">
                    <div className="col-span-3">Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2 text-right">Date</div>
                </div>
                <div className="p-4 space-y-2">
                    {history.length === 0 ? (
                        <p className="text-center text-gray-500 py-10 text-sm">No contributions found.</p>
                    ) : (
                        history.map((item: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-4 text-xs items-center py-3 border-b border-gray-200/50">
                                <div className="col-span-3 font-bold text-gray-700">{item.title || 'Untitled'}</div>
                                <div className="col-span-2 text-gray-500">{item.type}</div>
                                <div className="col-span-2 font-medium">{item.salePrice || item.price || 'N/A'}</div>
                                <div className="col-span-3"><span className="px-2 py-1 bg-white rounded border border-gray-200">{item.status}</span></div>
                                <div className="col-span-2 text-right text-gray-400">{item.date}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <DashboardButton onClick={onContribute} variant="primary" className="shadow-lg flex items-center gap-2">
                    <FaPlus size={12} /> Contribute Data
                </DashboardButton>
            </div>
        </div>
    );
};

const ContributionForm = ({ onCancel }: { onCancel: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        transactionType: '', propertyType: '', address: '', amount: '', date: '', size: '', bedrooms: '', details: ''
    });
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const stored = localStorage.getItem('user');
            if (!stored) throw new Error("User not found");
            const user = JSON.parse(stored);

            await ProContributionService.submit({
                userId: user.id || user._id,
                ...formData,
                amount: Number(formData.amount),
                documents: files
            });

            alert("Contribution submitted successfully!");
            onCancel();
        } catch (err) {
            console.error(err);
            alert("Failed to submit contribution.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h1 className="text-3xl font-bold text-inda-dark">New Contribution</h1>
                <p className="text-sm text-gray-500 mt-1">Submit transaction details for verification</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <input name="transactionType" value={formData.transactionType} onChange={handleChange} placeholder="Transaction Type (Sale/Rent)" className="p-3 bg-gray-50 rounded border-none w-full text-sm" required />
                    <input name="propertyType" value={formData.propertyType} onChange={handleChange} placeholder="Property Type" className="p-3 bg-gray-50 rounded border-none w-full text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Property Address" className="p-3 bg-gray-50 rounded border-none w-full text-sm" required />
                    <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Amount (₦)" className="p-3 bg-gray-50 rounded border-none w-full text-sm" required />
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <input name="date" type="date" value={formData.date} onChange={handleChange} className="p-3 bg-gray-50 rounded border-none w-full text-sm" required />
                    <input name="size" value={formData.size} onChange={handleChange} placeholder="Size (sqm)" className="p-3 bg-gray-50 rounded border-none w-full text-sm" />
                    <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="p-3 bg-gray-50 rounded border-none w-full text-sm" />
                </div>

                <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Additional details..." className="w-full p-3 bg-gray-50 rounded border-none text-sm h-24 resize-none" />

                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 font-bold">Upload Supporting Documents</span>
                    <input type="file" multiple hidden ref={fileInputRef} onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))} />
                </div>
                {files.length > 0 && <div className="text-xs text-gray-500">{files.length} files selected</div>}

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                    <DashboardButton type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Contribution'}</DashboardButton>
                </div>
            </form>
        </div>
    );
};
