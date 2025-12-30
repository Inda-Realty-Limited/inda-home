import React, { useState, useEffect } from 'react';
import {
    FaCheckCircle,
    FaCamera,
    FaChevronDown,
    FaBell,
    FaShieldAlt,
    FaExclamationCircle,
    FaCheck,
    FaBan,
    FaTrashAlt
} from 'react-icons/fa';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardButton from '@/components/dashboard/DashboardButton';
import { BillingService } from '@/services/pro-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type TabType = 'Profile' | 'Subscription' | 'Billing' | 'Contributions' | 'Preferences';

export interface UserData {
    initials: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    profileType: string;
    bio: string;
    investmentFocus: string;
    experienceLevel: string;
}

const MOCK_USER: UserData = {
    initials: 'OW',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    profileType: 'Buyer',
    bio: '',
    investmentFocus: '',
    experienceLevel: ''
};

const DROPDOWN_OPTIONS = {
    profileTypes: ['Agent', 'Developer', 'Investor', 'Buyer', 'Company'],
    locations: [
        'Lagos, Nigeria',
        'Abuja, Nigeria',
        'Diaspora - United States',
        'Diaspora - United Kingdom',
        'Diaspora - Canada',
        'Others'
    ],
    focusTypes: ['Residential', 'Commercial', 'Land', 'Mixed Portfolio'],
    experienceLevels: [
        'Beginner ( 0 - 2 Years)',
        'Intermediate ( 3 - 7 Years)',
        'Experienced ( 8+ Years)',
        'Professional Investor'
    ]
};

export interface Contribution {
    title: string;
    type: string;
    status: 'Verified' | 'Pending';
    credit: string;
    date: string;
}

const CONTRIBUTIONS: Contribution[] = [
    { title: '4-bed duplex, Lekki', type: 'Sale Transaction', status: 'Verified', credit: '+5', date: 'Nov 15, 2025' },
    { title: '3-bed apartment, VI', type: 'Rental Data', status: 'Pending', credit: '+2', date: 'Nov 2, 2025' },
    { title: 'Commercial land, Ikoyi', type: 'Market Intel', status: 'Verified', credit: '+3', date: 'Sep 8, 2025' },
];

const SectionHeader = ({ title, icon: Icon }: { title: string, icon?: React.ElementType }) => (
    <h3 className="text-lg font-bold text-inda-dark mb-4 flex items-center gap-2">
        {Icon && <Icon className="text-inda-teal" />}
        {title}
    </h3>
);

const TealToggleRow = ({
    label,
    desc,
    checked,
    onChange
}: {
    label: string,
    desc?: string,
    checked: boolean,
    onChange: (val: boolean) => void
}) => (
    <div
        onClick={() => onChange(!checked)}
        className="flex items-center justify-between p-4 bg-inda-teal rounded-lg mb-3 text-white shadow-sm transition-all hover:brightness-105 cursor-pointer select-none group"
    >
        <div>
            <p className="font-bold text-sm">{label}</p>
            {desc && <p className="text-[10px] text-white/80 mt-0.5 group-hover:text-white transition-colors">{desc}</p>}
        </div>
        <div className="w-10 h-5 bg-white/30 rounded-full p-1 relative">
            <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
    </div>
);

const FilledInput = ({
    label,
    value,
    disabled = false,
    placeholder,
    onChange
}: {
    label: string,
    value?: string,
    disabled?: boolean,
    placeholder?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
    <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full bg-[#F3F4F6] rounded-md px-4 py-3 text-sm text-gray-700 font-medium border-none focus:ring-1 focus:ring-inda-teal focus:outline-none transition-all ${disabled ? 'opacity-70 cursor-not-allowed text-gray-500' : ''}`}
        />
    </div>
);

const FilledDropdown = ({ label, options, value, placeholder = "Select type", onChange }: {
    label: string,
    options: string[],
    value: string,
    placeholder?: string,
    onChange: (val: string) => void
}) => (
    <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>
        <div className="relative">
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#F3F4F6] rounded-md px-4 py-3 text-sm text-gray-700 font-medium appearance-none border-none focus:ring-1 focus:ring-inda-teal focus:outline-none cursor-pointer"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <FaChevronDown size={12} />
            </div>
        </div>
    </div>
);

const NotificationBanner = ({ type, message, onClose }: { type: 'success' | 'error', message: string, onClose: () => void }) => (
    <div className={`mb-6 p-4 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 ${type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
        <div className="flex items-center gap-3">
            {type === 'success' ? <FaCheck className="text-green-600" /> : <FaExclamationCircle className="text-red-600" />}
            <span className="text-sm font-medium">{message}</span>
        </div>
        <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100 font-bold">
            Dismiss
        </button>
    </div>
);

const ProfileTab = () => {
    const [formData, setFormData] = useState<UserData>(MOCK_USER);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        let localUser: any = null;

        const getInitials = (nameStr: string) => {
            if (!nameStr) return 'OW';
            return nameStr.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        };

        if (storedUser) {
            try {
                localUser = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    firstName: localUser.firstName || (localUser.name ? localUser.name.split(' ')[0] : prev.firstName),
                    lastName: localUser.lastName || (localUser.name ? localUser.name.split(' ').slice(1).join(' ') : prev.lastName),
                    email: localUser.email || prev.email,
                    phone: localUser.phone || prev.phone,
                    profileType: localUser.role || prev.profileType,
                    initials: getInitials(localUser.firstName || localUser.name),
                    location: localUser.location || prev.location,
                    bio: localUser.bio || prev.bio
                }));
            } catch (e) { console.error(e); }
        }

        const fetchFreshData = async () => {
            if (!localUser) return;
            const userId = localUser.id || localUser._id;

            if (userId) {
                if (!localUser.email) setLoading(true);
                try {
                    const response = await fetch(`${API_URL}/auth/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(localUser.token ? { 'Authorization': `Bearer ${localUser.token}` } : {})
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const remoteUser = result.data || result.user || result;

                        setFormData(prev => ({
                            ...prev,
                            firstName: remoteUser.firstName || prev.firstName,
                            lastName: remoteUser.lastName || prev.lastName,
                            email: remoteUser.email || prev.email,
                            phone: remoteUser.phone || remoteUser.phoneNumber || prev.phone,
                            location: remoteUser.location || prev.location,
                            bio: remoteUser.bio || prev.bio,
                            profileType: remoteUser.role || prev.profileType,
                            initials: getInitials(remoteUser.firstName || remoteUser.name),
                        }));
                    }
                } catch (err) { console.warn(err); } finally { setLoading(false); }
            }
        };
        fetchFreshData();
    }, []);

    const handleChange = (field: keyof UserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (status) setStatus(null);
    };

    const handleSaveChanges = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setStatus({ type: 'error', message: 'No active session found. Please log in again.' });
            return;
        }

        setSaving(true);
        setStatus(null);

        try {
            const localUser = JSON.parse(storedUser);
            const userId = localUser.id || localUser._id;

            if (!userId) throw new Error("User ID is missing.");

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                location: formData.location,
                bio: formData.bio,
                role: formData.profileType
            };

            const response = await fetch(`${API_URL}/auth/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localUser.token ? { 'Authorization': `Bearer ${localUser.token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server responded with ${response.status}`);
            }

            const result = await response.json();
            const updatedUser = result.data || result.user || payload;
            const newSessionData = { ...localUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newSessionData));

            setStatus({ type: 'success', message: 'Profile updated successfully!' });

        } catch (error: any) {
            console.error("Save Error:", error);
            setStatus({
                type: 'error',
                message: error.message || 'An unexpected error occurred while saving.'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion request submitted. Support will contact you shortly.");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative pb-10">
            {loading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-start justify-center pt-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inda-teal"></div>
                </div>
            )}

            {status && (
                <NotificationBanner
                    type={status.type}
                    message={status.message}
                    onClose={() => setStatus(null)}
                />
            )}

            <div className="flex flex-col gap-8 items-start">
                <div className="w-full md:w-48 flex-shrink-0">
                    <div className="bg-[#EBF5F5] rounded-lg p-6 flex flex-col items-center justify-center text-center border border-gray-100">
                        <div className="w-20 h-20 rounded-full bg-inda-teal flex items-center justify-center text-white text-xl font-medium mb-3 relative group">
                            {formData.initials}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs text-white font-medium">
                                <FaCamera className="mr-1" /> Edit
                            </div>
                        </div>
                        <button className="text-inda-teal text-xs font-bold mb-1 hover:underline">Change Photo</button>
                        <p className="text-[10px] text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                </div>

                <div className="w-full space-y-6">
                    <SectionHeader title="Profile Information" />

                    <FilledDropdown
                        label="Profile Type"
                        options={DROPDOWN_OPTIONS.profileTypes}
                        value={formData.profileType}
                        onChange={(val) => handleChange('profileType', val)}
                    />

                    <div className="flex flex-col md:flex-row gap-4">
                        <FilledInput
                            label="First Name"
                            value={formData.firstName}
                            placeholder="First Name"
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                        <FilledInput
                            label="Last Name"
                            value={formData.lastName}
                            placeholder="Last Name"
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <FilledInput label="Email" value={formData.email} disabled />
                        <FilledInput
                            label="Phone"
                            value={formData.phone}
                            placeholder="080..."
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    <div>
                        <FilledDropdown
                            label="Location"
                            placeholder="Select location"
                            options={DROPDOWN_OPTIONS.locations}
                            value={formData.location}
                            onChange={(val) => handleChange('location', val)}
                        />

                        {formData.location === 'Others' && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                                <input
                                    type="text"
                                    placeholder="Type current location"
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-inda-teal focus:outline-none transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Bio / Company Description</label>
                        <textarea
                            className="w-full bg-[#F3F4F6] rounded-md px-4 py-3 text-sm text-gray-700 font-medium min-h-[100px] border-none resize-none focus:ring-1 focus:ring-inda-teal focus:outline-none transition-all"
                            placeholder="Tell us about yourself or your company"
                            defaultValue={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <FilledDropdown
                            label="Investment Focus"
                            placeholder="Select Focus"
                            options={DROPDOWN_OPTIONS.focusTypes}
                            value={formData.investmentFocus}
                            onChange={(val) => handleChange('investmentFocus', val)}
                        />
                        <FilledDropdown
                            label="Experience Level"
                            placeholder="Select Level"
                            options={DROPDOWN_OPTIONS.experienceLevels}
                            value={formData.experienceLevel}
                            onChange={(val) => handleChange('experienceLevel', val)}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <DashboardButton
                            variant="primary"
                            onClick={handleSaveChanges}
                            disabled={saving}
                            className="min-w-[140px]"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </DashboardButton>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="bg-[#EFF8F7] border border-[#E0EFED] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-inda-dark flex items-center gap-2">
                                    <FaExclamationCircle className="text-inda-teal" /> Danger Zone
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 max-w-md">
                                    Deleting your account is permanent. All your data, subscriptions, and listings will be permanently removed.
                                </p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2.5 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm flex items-center gap-2"
                            >
                                <FaTrashAlt /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SubscriptionTab = () => {
    const [subData, setSubData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSub = async () => {
            const stored = localStorage.getItem('user');
            if (!stored) return;
            try {
                const user = JSON.parse(stored);
                const userId = user.id || user._id;
                if (userId) {
                    try {
                        const response = await BillingService.getSubscription(userId);
                        const data = response.data || response;
                        setSubData(data);
                    } catch (e) {
                        setSubData({
                            planName: 'Pro Annual', status: 'Active', renewalDate: 'Jan 15, 2026',
                            price: '₦180,000', credits: { used: 24, total: 50 }
                        });
                    }
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchSub();
    }, []);

    const handleCancelSubscription = () => {
        if (confirm("Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.")) {
            alert("Subscription cancellation scheduled.");
        }
    };

    if (loading || !subData) return <div className="p-10 text-center text-gray-400">Loading subscription data...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8 pb-10">
            <div>
                <SectionHeader title="Subscription Details" />
                <div className="bg-[#EFF8F7] rounded-xl p-8 border border-gray-100/50">
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <span className="font-semibold text-gray-700 text-sm">Current Plan: {subData.planName}</span>
                            <div className="hidden md:block w-32 bg-gray-200 rounded-full h-1.5 ml-auto mr-4">
                                <div className="bg-inda-teal h-1.5 rounded-full" style={{ width: `${(subData.credits.used / subData.credits.total) * 100}%` }} />
                            </div>
                            <span className="text-xs text-inda-teal font-bold bg-white px-2 py-1 rounded shadow-sm">{subData.status}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <span className="font-semibold text-gray-700 text-sm">Next Renewal: {subData.renewalDate}</span>
                            <span className="font-bold text-gray-900">{subData.price || '₦0'}<span className="text-xs font-normal text-gray-500">/year</span></span>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-700 text-sm">Credits Remaining</span>
                                <span className="text-xs font-bold text-inda-teal">{subData.credits.used} of {subData.credits.total}</span>
                            </div>
                            <div className="w-full bg-[#D1E8E6] rounded-full h-2.5">
                                <div className="bg-inda-teal h-2.5 rounded-full" style={{ width: `${(subData.credits.used / subData.credits.total) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCancelSubscription}
                        className="text-xs font-bold text-gray-500 hover:text-inda-teal hover:bg-inda-teal/10 hover:border-inda-teal/20 px-4 py-2 rounded transition-colors flex items-center gap-2 border border-transparent"
                    >
                        <FaBan size={10} /> Cancel Subscription
                    </button>
                </div>
            </div>
        </div>
    );
};

const BillingTab = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const stored = localStorage.getItem('user');
            if (!stored) return;
            try {
                const userId = JSON.parse(stored).id || JSON.parse(stored)._id;
                const res = await BillingService.getHistory(userId);
                setHistory(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                setHistory([
                    { desc: 'Pro Annual Subscription', date: 'Nov 15, 2025', amount: '₦180,000', status: 'Paid' }
                ]);
            } finally { setLoading(false); }
        };
        fetchHistory();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionHeader title="Billing History" />
            <div className="space-y-4">
                {history.map((item, i) => (
                    <div key={i} className="bg-[#EFF8F7] p-4 rounded-lg flex justify-between items-center border border-[#E0EFED] hover:bg-[#E0F2F1] transition-colors">
                        <div>
                            <div className="font-bold text-sm text-gray-800">{item.desc || item.description}</div>
                            <div className="text-xs text-gray-500">{item.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-sm text-inda-dark">{item.amount}</span>
                            <span className="bg-inda-teal text-white text-[10px] font-bold px-3 py-1 rounded">{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContributionsTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <SectionHeader title="Data Contribution History" />
        <div className="space-y-4">
            {CONTRIBUTIONS.map((item, i) => (
                <div key={i} className="border border-inda-teal/30 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                        <div className="font-bold text-sm text-gray-800">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-1">Type: {item.type}</div>
                    </div>

                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                        <div className="text-xs font-semibold text-gray-500 mb-1">Status</div>
                        <div className={`text-xs font-bold flex items-center gap-1 ${item.status === 'Verified' ? 'text-inda-teal' : 'text-yellow-600'}`}>
                            {item.status} {item.status === 'Verified' && <FaCheckCircle size={10} />}
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                        <div className="text-xs font-semibold text-gray-500 mb-1">Credit</div>
                        <div className="text-xs font-bold text-inda-teal">{item.credit} Credit</div>
                    </div>

                    <div className="w-full md:w-1/4 text-left md:text-right">
                        <div className="text-xs font-semibold text-gray-500 mb-1">Date</div>
                        <div className="text-xs font-bold text-gray-800">{item.date}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PreferencesTab = () => {
    const [prefs, setPrefs] = useState({
        marketAlerts: true,
        portfolioUpdates: true,
        reportCompletion: true,
        weeklyDigest: true,
        newPerks: true,
        promos: false,
        publicProfile: true,
        shareData: true
    });

    const toggle = (key: keyof typeof prefs) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8 pb-12">
            <div>
                <SectionHeader title="Notification Preferences" icon={FaBell} />
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Market Alerts</h4>
                    <TealToggleRow
                        label="Market Alerts"
                        desc="Get notified about market changes in your areas of interest"
                        checked={prefs.marketAlerts}
                        onChange={() => toggle('marketAlerts')}
                    />
                </div>
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Portfolio Activities</h4>
                    <TealToggleRow
                        label="Portfolio Updates"
                        desc="Receive updates on your portfolio's performance"
                        checked={prefs.portfolioUpdates}
                        onChange={() => toggle('portfolioUpdates')}
                    />
                    <TealToggleRow
                        label="Report Completion"
                        desc="Email when your reports are ready"
                        checked={prefs.reportCompletion}
                        onChange={() => toggle('reportCompletion')}
                    />
                </div>
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">General Notifications</h4>
                    <TealToggleRow
                        label="Weekly Digest"
                        desc="Weekly summary of market activity"
                        checked={prefs.weeklyDigest}
                        onChange={() => toggle('weeklyDigest')}
                    />
                    <TealToggleRow
                        label="New Perks & Discounts"
                        desc="Notifications about new partner discounts"
                        checked={prefs.newPerks}
                        onChange={() => toggle('newPerks')}
                    />
                    <TealToggleRow
                        label="Promotional Emails"
                        desc="Marketing emails about new features"
                        checked={prefs.promos}
                        onChange={() => toggle('promos')}
                    />
                </div>
            </div>

            <div>
                <SectionHeader title="Privacy & Security" icon={FaShieldAlt} />
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Profile Visibility</h4>
                    <TealToggleRow
                        label="Public Profile"
                        desc="Allow other users to see your profile in the community"
                        checked={prefs.publicProfile}
                        onChange={() => toggle('publicProfile')}
                    />
                </div>
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Data Analytics</h4>
                    <TealToggleRow
                        label="Share Usage Data"
                        desc="Help improve Inda Pro by sharing usage analytics"
                        checked={prefs.shareData}
                        onChange={() => toggle('shareData')}
                    />
                </div>
            </div>
        </div>
    );
};

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('Profile');
    const tabs: TabType[] = ['Profile', 'Subscription', 'Billing', 'Contributions', 'Preferences'];

    return (
        <DashboardLayout title="Profile & Settings">
            <div className="max-w-5xl mx-auto pb-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-inda-dark">Profile & Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your account preferences and subscription</p>
                </div>

                <div className="bg-inda-teal rounded-lg p-1.5 flex overflow-x-auto mb-8 shadow-sm no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap relative rounded-md
                ${activeTab === tab
                                    ? 'text-white bg-white/10 shadow-inner font-bold'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full mt-1"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'Profile' && <ProfileTab />}
                    {activeTab === 'Subscription' && <SubscriptionTab />}
                    {activeTab === 'Billing' && <BillingTab />}
                    {activeTab === 'Contributions' && <ContributionsTab />}
                    {activeTab === 'Preferences' && <PreferencesTab />}
                </div>
            </div>
        </DashboardLayout>
    );
}
