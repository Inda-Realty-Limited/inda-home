import { useState } from 'react';
import { X, Phone, MessageCircle, User, MapPin, Eye, Clock, Calendar, ChevronDown, Send, TrendingUp, CheckCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import leadsApi, { Lead, LeadStatus, LeadPriority, ActivityType } from '@/api/leads';

interface LeadDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead;
}

const LEAD_STATUSES: { key: LeadStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'new_lead', label: 'New Lead', icon: <User size={16} /> },
    { key: 'contacted', label: 'Contacted', icon: <Phone size={16} /> },
    { key: 'viewing_scheduled', label: 'Viewing Scheduled', icon: <Calendar size={16} /> },
    { key: 'offer_made', label: 'Offer Made', icon: <span className="text-sm">₦</span> },
    { key: 'closed_won', label: 'Closed Won', icon: <CheckCircle size={16} /> },
    { key: 'closed_lost', label: 'Closed Lost', icon: <X size={16} /> },
];

const QUICK_REPLIES = [
    "Hi! Thank you for your interest. The property is still available. When would you like to schedule a viewing?",
    "Hello! I'd be happy to answer any questions about the property. What would you like to know?",
    "Great! I can arrange a viewing this weekend. Saturday or Sunday works better for you?",
    "The price is negotiable. What's your budget range?",
    "I'll send you additional photos and the property documents via WhatsApp.",
];

export default function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status || 'new_lead');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [note, setNote] = useState('');
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [priority, setPriority] = useState<LeadPriority>(lead.priority || 'medium');
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const activities = lead.activities || [];

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case 'inquiry':
                return <div className="w-6 h-6 rounded-full border-2 border-inda-teal flex items-center justify-center"><MessageCircle size={12} className="text-inda-teal" /></div>;
            case 'status_change':
                return <div className="w-6 h-6 rounded-full bg-inda-teal/10 flex items-center justify-center"><TrendingUp size={12} className="text-inda-teal" /></div>;
            case 'view':
                return <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle size={12} className="text-green-600" /></div>;
            case 'note':
                return <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"><MessageCircle size={12} className="text-gray-600" /></div>;
            case 'call':
                return <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"><Phone size={12} className="text-blue-600" /></div>;
            case 'whatsapp':
                return <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><FaWhatsapp size={12} className="text-green-600" /></div>;
            case 'reminder':
                return <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center"><Calendar size={12} className="text-amber-600" /></div>;
            default:
                return <div className="w-6 h-6 rounded-full bg-gray-100" />;
        }
    };

    const getPriorityLabel = () => {
        switch (priority) {
            case 'high': return { label: 'Hot', icon: '🔥', color: 'text-orange-600' };
            case 'medium': return { label: 'Warm', icon: '☀️', color: 'text-yellow-600' };
            case 'low': return { label: 'Cold', icon: '❄️', color: 'text-blue-600' };
        }
    };

    const priorityInfo = getPriorityLabel();

    const handleStatusChange = async (newStatus: LeadStatus) => {
        try {
            setSaving(true);
            await leadsApi.updateLead(lead._id, { status: newStatus });
            setSelectedStatus(newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePriorityChange = async (newPriority: LeadPriority) => {
        try {
            setSaving(true);
            await leadsApi.updateLead(lead._id, { priority: newPriority });
            setPriority(newPriority);
            setPriorityOpen(false);
        } catch (error) {
            console.error('Failed to update priority:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleSetReminder = async () => {
        if (!reminderDate || !reminderTime) return;
        try {
            setSaving(true);
            const dateTime = new Date(`${reminderDate}T${reminderTime}`);
            await leadsApi.setReminder(lead._id, dateTime.toISOString());
            setReminderDate('');
            setReminderTime('');
        } catch (error) {
            console.error('Failed to set reminder:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        try {
            setSaving(true);
            await leadsApi.addNote(lead._id, note);
            setNote('');
        } catch (error) {
            console.error('Failed to add note:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleQuickReply = (reply: string) => {
        if (lead.phone) {
            const encodedMessage = encodeURIComponent(reply);
            const phone = lead.phone.replace(/\D/g, '');
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
            // Log activity
            leadsApi.addActivity(lead._id, 'whatsapp', `Sent WhatsApp: ${reply.substring(0, 50)}...`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const propertyTitle = lead.propertyTitle || (typeof lead.listingId === 'object' ? lead.listingId.title : 'Property');
    const propertyLocation = lead.propertyLocation || (typeof lead.listingId === 'object' ? `${lead.listingId.microlocationStd || lead.listingId.lga}, Lagos` : '');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-inda-teal flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="font-semibold text-gray-900">{lead.name}</span>
                            <span className="text-gray-400 mx-1">·</span>
                            <span className="text-gray-500">{formatDate(lead.createdAt)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="space-y-3">
                                    {lead.phone && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-gray-400" />
                                                <div>
                                                    <span className="text-sm text-gray-600">{lead.phone}</span>
                                                </div>
                                            </div>
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
                                            >
                                                <Phone size={14} className="text-white" />
                                            </a>
                                        </div>
                                    )}
                                    {lead.phone && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MessageCircle size={16} className="text-gray-400" />
                                                <div>
                                                    <span className="text-sm text-gray-600">WhatsApp</span>
                                                    <div className="text-xs text-inda-teal font-medium">Send WhatsApp</div>
                                                </div>
                                            </div>
                                            <a
                                                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#20BD5A] transition-colors"
                                            >
                                                <FaWhatsapp size={16} className="text-white" />
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="text-gray-400">Email:</span>
                                        <a href={`mailto:${lead.email}`} className="text-inda-teal hover:underline">{lead.email}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Interested Property */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Interested Property</h3>
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-inda-teal mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{propertyTitle}</div>
                                        <div className="text-xs text-gray-500">{propertyLocation}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Score */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Score</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Priority</span>
                                        <div className="relative">
                                            <button
                                                onClick={() => setPriorityOpen(!priorityOpen)}
                                                disabled={saving}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm ${priorityInfo.color} disabled:opacity-50`}
                                            >
                                                <span>{priorityInfo.icon}</span>
                                                <span className="font-medium">{priorityInfo.label}</span>
                                                <ChevronDown size={14} />
                                            </button>
                                            {priorityOpen && (
                                                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                                                    {(['high', 'medium', 'low'] as const).map((p) => (
                                                        <button
                                                            key={p}
                                                            onClick={() => handlePriorityChange(p)}
                                                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            {p === 'high' && <><span>🔥</span> Hot</>}
                                                            {p === 'medium' && <><span>☀️</span> Warm</>}
                                                            {p === 'low' && <><span>❄️</span> Cold</>}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Page Views</span>
                                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                            <Eye size={16} className="text-gray-400" />
                                            {lead.pageViews || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Source</span>
                                        <span className="text-sm font-medium text-gray-900">{lead.channel}</span>
                                    </div>
                                    {lead.lastActivityAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Last Activity</span>
                                            <span className="text-sm text-gray-500">{formatDate(lead.lastActivityAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">Budget</h3>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-inda-teal font-bold text-lg">₦</span>
                                    <span className="text-sm text-gray-500">
                                        {lead.budget?.min || lead.budget?.max
                                            ? `${lead.budget.min?.toLocaleString() || '0'} - ${lead.budget.max?.toLocaleString() || 'N/A'}`
                                            : 'Not set'}
                                    </span>
                                </div>
                                {lead.offerAmount && lead.offerAmount > 0 && (
                                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                        <span className="text-xs text-green-700">Offer: ₦{lead.offerAmount.toLocaleString()}</span>
                                        {lead.offerPercent && (
                                            <span className="text-xs text-green-600 ml-1">({lead.offerPercent})</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Initial Message */}
                            {lead.message && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Initial Message</h3>
                                    <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700 italic">
                                        "{lead.message}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Lead Status */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Status</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {LEAD_STATUSES.map((status) => (
                                        <button
                                            key={status.key}
                                            onClick={() => handleStatusChange(status.key)}
                                            disabled={saving}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all disabled:opacity-50 ${selectedStatus === status.key
                                                ? 'border-inda-teal bg-inda-teal/5 text-inda-teal'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {status.icon}
                                            <span className="text-xs font-medium text-center leading-tight">{status.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Replies */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Replies</h3>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {QUICK_REPLIES.map((reply, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuickReply(reply)}
                                            disabled={!lead.phone}
                                            className="w-full text-left p-3 rounded-xl bg-inda-teal text-white text-sm hover:bg-inda-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Schedule Follow-up Reminder */}
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                                        <span className="text-white text-xs">!</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">Schedule Follow-up Reminder</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="date"
                                        value={reminderDate}
                                        onChange={(e) => setReminderDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-inda-teal/40 focus:border-inda-teal outline-none"
                                    />
                                    <input
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-inda-teal/40 focus:border-inda-teal outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleSetReminder}
                                    disabled={!reminderDate || !reminderTime || saving}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Calendar size={16} />
                                    Set Reminder
                                </button>
                            </div>

                            {/* Activity Timeline */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Timeline</h3>
                                {activities.length === 0 ? (
                                    <div className="text-sm text-gray-500 text-center py-4">No activities yet</div>
                                ) : (
                                    <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                        {activities.slice().reverse().map((activity, idx) => (
                                            <div key={activity._id || idx} className="flex gap-3">
                                                {getActivityIcon(activity.type)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-gray-400 mb-0.5">{formatDate(activity.createdAt)}</div>
                                                    <div className="text-sm text-gray-700">{activity.content}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Note */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Note</h3>
                                <div className="relative">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add internal notes about this lead (buyer preferences, budget discussions, viewing feedback, etc.)"
                                        className="w-full px-3 py-3 pr-12 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-inda-teal/40 focus:border-inda-teal outline-none"
                                        rows={3}
                                    />
                                    <button
                                        onClick={handleAddNote}
                                        disabled={!note.trim() || saving}
                                        className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-inda-teal flex items-center justify-center hover:bg-inda-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={14} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
