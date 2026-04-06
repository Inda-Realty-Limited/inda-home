import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
    User, Home, DollarSign, Calendar, MessageSquare, Phone, Mail,
    Eye, ChevronRight, Plus, Search, LayoutGrid, LayoutList, Clock,
    CheckCircle2, XCircle, TrendingUp, FileText, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DealsService, Deal, DealStage, CreateDealPayload } from '@/api/crm';

// ── Stage config ─────────────────────────────────────────────────────────────

type LocalStage =
    | 'lead-captured' | 'report-viewed' | 'inquiry' | 'inspection'
    | 'offer' | 'negotiation' | 'closing' | 'lost';

const STAGE_MAP: Record<DealStage, LocalStage> = {
    LEAD_CAPTURED: 'lead-captured',
    REPORT_VIEWED: 'report-viewed',
    INQUIRY: 'inquiry',
    INSPECTION: 'inspection',
    OFFER: 'offer',
    NEGOTIATION: 'negotiation',
    CLOSING: 'closing',
    LOST: 'lost',
};

const API_STAGE_MAP: Record<LocalStage, DealStage> = {
    'lead-captured': 'LEAD_CAPTURED',
    'report-viewed': 'REPORT_VIEWED',
    'inquiry': 'INQUIRY',
    'inspection': 'INSPECTION',
    'offer': 'OFFER',
    'negotiation': 'NEGOTIATION',
    'closing': 'CLOSING',
    'lost': 'LOST',
};

const stageConfig: Record<LocalStage, { label: string; color: string; headerColor: string; icon: any }> = {
    'lead-captured': { label: 'Lead Captured', color: 'bg-gray-100 text-gray-700 border-gray-300', headerColor: 'border-gray-300 bg-gray-50', icon: User },
    'report-viewed': { label: 'Report Viewed', color: 'bg-blue-100 text-blue-700 border-blue-300', headerColor: 'border-blue-200 bg-blue-50', icon: Eye },
    'inquiry': { label: 'Inquiry / Contact', color: 'bg-purple-100 text-purple-700 border-purple-300', headerColor: 'border-purple-200 bg-purple-50', icon: MessageSquare },
    'inspection': { label: 'Inspection', color: 'bg-amber-100 text-amber-700 border-amber-300', headerColor: 'border-amber-200 bg-amber-50', icon: Calendar },
    'offer': { label: 'Offer Made', color: 'bg-orange-100 text-orange-700 border-orange-300', headerColor: 'border-orange-200 bg-orange-50', icon: FileText },
    'negotiation': { label: 'Negotiation', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', headerColor: 'border-indigo-200 bg-indigo-50', icon: TrendingUp },
    'closing': { label: 'Closing / Won', color: 'bg-green-100 text-green-700 border-green-300', headerColor: 'border-green-200 bg-green-50', icon: CheckCircle2 },
    'lost': { label: 'Lost', color: 'bg-red-100 text-red-700 border-red-300', headerColor: 'border-red-200 bg-red-50', icon: XCircle },
};

const activityIcon: Record<string, { icon: any; bg: string; color: string }> = {
    call: { icon: Phone, bg: 'bg-green-100', color: 'text-green-600' },
    message: { icon: MessageSquare, bg: 'bg-blue-100', color: 'text-blue-600' },
    'report-view': { icon: Eye, bg: 'bg-purple-100', color: 'text-purple-600' },
    'status-change': { icon: TrendingUp, bg: 'bg-amber-100', color: 'text-amber-600' },
    note: { icon: FileText, bg: 'bg-gray-100', color: 'text-gray-600' },
};

function getActivityIcon(type: string) {
    return activityIcon[type] ?? activityIcon.note;
}

function localStage(deal: Deal): LocalStage {
    return STAGE_MAP[deal.stage] ?? 'lead-captured';
}

function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}

const emptyForm: CreateDealPayload & { stage: LocalStage } = {
    buyerName: '', buyerEmail: '', buyerPhone: '',
    propertyName: '', propertyLocation: '',
    budget: '', timeline: '',
    stage: 'lead-captured', notes: '',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CRMPage() {
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStage, setFilterStage] = useState<LocalStage | 'all'>('all');
    const [showAddDeal, setShowAddDeal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [editingNotes, setEditingNotes] = useState('');
    const [logActivity, setLogActivity] = useState<{ type: string; text: string } | null>(null);

    const load = useCallback(async () => {
        try {
            const data = await DealsService.getAll();
            setDeals(data);
        } catch {
            // silently keep empty
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Filtering ──────────────────────────────────────────────────────────────

    const filtered = deals.filter(d => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q ||
            d.buyerName.toLowerCase().includes(q) ||
            d.propertyName.toLowerCase().includes(q) ||
            (d.propertyLocation ?? '').toLowerCase().includes(q);
        const matchStage = filterStage === 'all' || localStage(d) === filterStage;
        return matchSearch && matchStage;
    });

    const byStage = (s: LocalStage) => filtered.filter(d => localStage(d) === s);

    // ── Actions ────────────────────────────────────────────────────────────────

    const moveDeal = async (id: string, newLocal: LocalStage) => {
        const apiStage = API_STAGE_MAP[newLocal];
        // Optimistic update
        setDeals(prev => prev.map(d => d.id === id ? { ...d, stage: apiStage } : d));
        if (selectedDeal?.id === id) setSelectedDeal(prev => prev ? { ...prev, stage: apiStage } : null);
        try {
            const updated = await DealsService.update(id, { stage: apiStage });
            setDeals(prev => prev.map(d => d.id === id ? updated : d));
            if (selectedDeal?.id === id) setSelectedDeal(updated);
        } catch {
            load(); // revert on failure
        }
    };

    const saveNotes = async () => {
        if (!selectedDeal) return;
        setSaving(true);
        try {
            const updated = await DealsService.update(selectedDeal.id, { notes: editingNotes });
            setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
            setSelectedDeal(updated);
        } finally {
            setSaving(false);
        }
    };

    const handleAddActivity = async () => {
        if (!selectedDeal || !logActivity?.text.trim()) return;
        try {
            const updated = await DealsService.addActivity(selectedDeal.id, logActivity.type, logActivity.text.trim());
            setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
            setSelectedDeal(updated);
            setLogActivity(null);
        } catch { /* silent */ }
    };

    const handleAddDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload: CreateDealPayload = {
                buyerName: form.buyerName,
                buyerEmail: form.buyerEmail || undefined,
                buyerPhone: form.buyerPhone || undefined,
                propertyName: form.propertyName,
                propertyLocation: form.propertyLocation || undefined,
                budget: form.budget || undefined,
                timeline: form.timeline || undefined,
                stage: API_STAGE_MAP[form.stage],
                notes: form.notes || undefined,
            };
            const created = await DealsService.create(payload);
            setDeals(prev => [created, ...prev]);
            setShowAddDeal(false);
            setForm(emptyForm);
        } finally {
            setSaving(false);
        }
    };

    const openDeal = (deal: Deal) => {
        setSelectedDeal(deal);
        setEditingNotes(deal.notes ?? '');
    };

    // ── Stats ──────────────────────────────────────────────────────────────────

    const activeDeals = deals.filter(d => d.stage !== 'CLOSING' && d.stage !== 'LOST').length;

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-inda-teal to-teal-700 bg-clip-text text-transparent">
                                Deal Pipeline
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">Manage buyer relationships and track deals</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setView('kanban')}
                                    className={cn('p-1.5 rounded transition-colors', view === 'kanban' ? 'bg-inda-teal text-white' : 'text-gray-500 hover:text-gray-900')}
                                    title="Kanban view"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={cn('p-1.5 rounded transition-colors', view === 'list' ? 'bg-inda-teal text-white' : 'text-gray-500 hover:text-gray-900')}
                                    title="List view"
                                >
                                    <LayoutList className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => setShowAddDeal(true)}
                                className="flex items-center gap-2 bg-inda-teal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Deal
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500 mb-1">Active Deals</p>
                            <p className="text-3xl font-bold text-gray-900">{loading ? '—' : activeDeals}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500 mb-1">Total Deals</p>
                            <p className="text-3xl font-bold text-inda-teal">{loading ? '—' : deals.length}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500 mb-1">Closing / Won</p>
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? '—' : deals.filter(d => d.stage === 'CLOSING').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500 mb-1">Lost</p>
                            <p className="text-3xl font-bold text-red-500">
                                {loading ? '—' : deals.filter(d => d.stage === 'LOST').length}
                            </p>
                        </div>
                    </div>

                    {/* Search + Filter */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search buyers or properties..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30 focus:border-inda-teal"
                            />
                        </div>
                        <select
                            value={filterStage}
                            onChange={e => setFilterStage(e.target.value as LocalStage | 'all')}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                        >
                            <option value="all">All Stages</option>
                            {(Object.keys(stageConfig) as LocalStage[]).map(s => (
                                <option key={s} value={s}>{stageConfig[s].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                                    <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                                    <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── KANBAN VIEW ── */}
                    {!loading && view === 'kanban' && (
                        <div className="overflow-x-auto pb-4 -mx-2 px-2">
                            <div className="flex gap-4 min-w-max">
                                {(Object.keys(stageConfig) as LocalStage[]).map(stage => {
                                    const cfg = stageConfig[stage];
                                    const Icon = cfg.icon;
                                    const stageDeals = byStage(stage);
                                    return (
                                        <div key={stage} className="w-72 flex-shrink-0">
                                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                                <div className={cn('px-4 py-3 border-b-2 flex items-center justify-between', cfg.headerColor)}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        <span className="text-sm font-semibold text-gray-800">{cfg.label}</span>
                                                    </div>
                                                    <span className="text-xs font-bold bg-white/70 rounded-full px-2 py-0.5">{stageDeals.length}</span>
                                                </div>
                                                <div className="p-3 space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto">
                                                    {stageDeals.length === 0 ? (
                                                        <p className="text-center text-xs text-gray-400 py-8">No deals</p>
                                                    ) : stageDeals.map(deal => (
                                                        <div
                                                            key={deal.id}
                                                            onClick={() => openDeal(deal)}
                                                            className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">{deal.buyerName}</p>
                                                                    <p className="text-xs text-gray-500">{deal.propertyName}</p>
                                                                </div>
                                                                {deal.reportViewed && <Eye className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />}
                                                            </div>
                                                            <div className="space-y-1 mb-3">
                                                                {deal.propertyLocation && (
                                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                        <Home className="w-3 h-3" />{deal.propertyLocation}
                                                                    </div>
                                                                )}
                                                                {deal.budget && (
                                                                    <div className="flex items-center gap-1.5 text-xs">
                                                                        <DollarSign className="w-3 h-3 text-gray-400" />
                                                                        <span className="font-semibold text-inda-teal">{deal.budget}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                                    <Clock className="w-3 h-3" />{relativeTime(deal.lastActivityAt)}
                                                                </div>
                                                            </div>
                                                            {deal.nextAction && (
                                                                <div className="border-t border-gray-200 pt-2 mb-2">
                                                                    <p className="text-xs text-gray-600">
                                                                        <span className="font-medium">Next:</span> {deal.nextAction}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <select
                                                                onClick={e => e.stopPropagation()}
                                                                value={localStage(deal)}
                                                                onChange={e => { moveDeal(deal.id, e.target.value as LocalStage); e.stopPropagation(); }}
                                                                className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 bg-white focus:outline-none"
                                                            >
                                                                {(Object.keys(stageConfig) as LocalStage[]).map(s => (
                                                                    <option key={s} value={s}>{stageConfig[s].label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── LIST VIEW ── */}
                    {!loading && view === 'list' && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        {['Buyer', 'Property', 'Budget', 'Stage', 'Last Activity', 'Next Action', ''].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-16 text-gray-400 text-sm">No deals found</td></tr>
                                    ) : filtered.map(deal => {
                                        const cfg = stageConfig[localStage(deal)];
                                        const Icon = cfg.icon;
                                        return (
                                            <tr key={deal.id} onClick={() => openDeal(deal)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-gray-900">{deal.buyerName}</p>
                                                    <p className="text-xs text-gray-500">{deal.buyerPhone}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{deal.propertyName}</p>
                                                    <p className="text-xs text-gray-500">{deal.propertyLocation}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-inda-teal">{deal.budget ?? '—'}</p>
                                                    <p className="text-xs text-gray-500">{deal.timeline}</p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cfg.color)}>
                                                        <Icon className="w-3 h-3" />{cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{relativeTime(deal.lastActivityAt)}</td>
                                                <td className="px-5 py-4 text-sm text-gray-700">{deal.nextAction ?? '—'}</td>
                                                <td className="px-5 py-4"><ChevronRight className="w-4 h-4 text-gray-300" /></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── DEAL DETAIL SIDEBAR ── */}
                {selectedDeal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-stretch justify-end">
                        <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
                            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{selectedDeal.buyerName}</h2>
                                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border mt-1', stageConfig[localStage(selectedDeal)].color)}>
                                        {stageConfig[localStage(selectedDeal)].label}
                                    </span>
                                </div>
                                <button onClick={() => setSelectedDeal(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Quick actions */}
                                <div className="flex gap-2">
                                    <a href={`tel:${selectedDeal.buyerPhone}`} className="flex-1 flex items-center justify-center gap-2 bg-inda-teal text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                                        <Phone className="w-4 h-4" /> Call
                                    </a>
                                    <a href={`mailto:${selectedDeal.buyerEmail}`} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:border-inda-teal hover:text-inda-teal transition-colors">
                                        <Mail className="w-4 h-4" /> Email
                                    </a>
                                    <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:border-inda-teal hover:text-inda-teal transition-colors">
                                        <MessageSquare className="w-4 h-4" /> Message
                                    </button>
                                </div>

                                {/* Buyer info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Buyer Information</h3>
                                    <div className="space-y-2">
                                        {selectedDeal.buyerEmail && (
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />{selectedDeal.buyerEmail}
                                            </div>
                                        )}
                                        {selectedDeal.buyerPhone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />{selectedDeal.buyerPhone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Property */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Property Details</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="font-semibold text-gray-900">{selectedDeal.propertyName}</p>
                                        {selectedDeal.propertyLocation && <p className="text-sm text-gray-500">{selectedDeal.propertyLocation}</p>}
                                        <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                                            {selectedDeal.budget && <span><span className="text-gray-500">Budget:</span> <span className="font-semibold text-inda-teal">{selectedDeal.budget}</span></span>}
                                            {selectedDeal.timeline && <span><span className="text-gray-500">Timeline:</span> {selectedDeal.timeline}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Stage */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Deal Stage</h3>
                                    <select
                                        value={localStage(selectedDeal)}
                                        onChange={e => moveDeal(selectedDeal.id, e.target.value as LocalStage)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                                    >
                                        {(Object.keys(stageConfig) as LocalStage[]).map(s => (
                                            <option key={s} value={s}>{stageConfig[s].label}</option>
                                        ))}
                                    </select>
                                    {selectedDeal.nextAction && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-3">
                                            <p className="text-xs font-semibold text-blue-800 mb-0.5">Next Action</p>
                                            <p className="text-sm text-blue-700">{selectedDeal.nextAction}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
                                    <textarea
                                        value={editingNotes}
                                        onChange={e => setEditingNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                                        placeholder="Add notes about this deal..."
                                    />
                                    {editingNotes !== (selectedDeal.notes ?? '') && (
                                        <button
                                            onClick={saveNotes}
                                            disabled={saving}
                                            className="mt-2 text-xs font-medium text-inda-teal hover:underline disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save notes'}
                                        </button>
                                    )}
                                </div>

                                {/* Activity log */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-gray-700">Activity Log</h3>
                                        <button
                                            onClick={() => setLogActivity({ type: 'note', text: '' })}
                                            className="text-xs text-inda-teal font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Log activity
                                        </button>
                                    </div>

                                    {logActivity && (
                                        <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                                            <select
                                                value={logActivity.type}
                                                onChange={e => setLogActivity({ ...logActivity, type: e.target.value })}
                                                className="border border-gray-200 rounded text-xs px-2 py-1.5 bg-white"
                                            >
                                                <option value="note">Note</option>
                                                <option value="call">Call</option>
                                                <option value="message">Message</option>
                                                <option value="report-view">Report View</option>
                                                <option value="status-change">Status Change</option>
                                            </select>
                                            <textarea
                                                value={logActivity.text}
                                                onChange={e => setLogActivity({ ...logActivity, text: e.target.value })}
                                                rows={2}
                                                placeholder="Describe the activity..."
                                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={handleAddActivity} className="px-3 py-1.5 bg-inda-teal text-white text-xs font-medium rounded hover:bg-teal-700 transition-colors">Add</button>
                                                <button onClick={() => setLogActivity(null)} className="px-3 py-1.5 text-gray-500 text-xs hover:text-gray-700">Cancel</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {selectedDeal.activities.map(act => {
                                            const ai = getActivityIcon(act.type);
                                            const Icon = ai.icon;
                                            return (
                                                <div key={act.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', ai.bg)}>
                                                        <Icon className={cn('w-4 h-4', ai.color)} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-900 font-medium">{act.description}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{relativeTime(act.createdAt)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ADD DEAL MODAL ── */}
                {showAddDeal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-lg font-bold text-gray-900">Add New Deal</h2>
                                <button onClick={() => setShowAddDeal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleAddDeal} className="flex-1 overflow-y-auto p-6 space-y-5">
                                {/* Buyer info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Buyer Information</h3>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input required type="text" value={form.buyerName} onChange={e => setForm({ ...form, buyerName: e.target.value })} placeholder="Full Name" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="email" value={form.buyerEmail} onChange={e => setForm({ ...form, buyerEmail: e.target.value })} placeholder="Email Address" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="tel" value={form.buyerPhone} onChange={e => setForm({ ...form, buyerPhone: e.target.value })} placeholder="Phone Number" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                        </div>
                                    </div>
                                </div>

                                {/* Property */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Property Details</h3>
                                    <div className="space-y-3">
                                        <input required type="text" value={form.propertyName} onChange={e => setForm({ ...form, propertyName: e.target.value })} placeholder="Property Name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                        <input type="text" value={form.propertyLocation} onChange={e => setForm({ ...form, propertyLocation: e.target.value })} placeholder="Location (e.g. Lekki, Lagos)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="Budget (e.g. ₦50M)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                            <input type="text" value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })} placeholder="Timeline (e.g. 3 months)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stage */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Initial Stage</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(stageConfig) as LocalStage[]).filter(s => s !== 'closing' && s !== 'lost').map(s => {
                                            const Icon = stageConfig[s].icon;
                                            return (
                                                <button key={s} type="button" onClick={() => setForm({ ...form, stage: s })}
                                                    className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left',
                                                        form.stage === s ? 'border-inda-teal bg-inda-teal/5 text-inda-teal' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    )}>
                                                    <Icon className="w-4 h-4 flex-shrink-0" />{stageConfig[s].label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
                                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Add notes about this deal..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowAddDeal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-inda-teal text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60">
                                        {saving ? 'Saving...' : 'Add Deal'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
