import React, { useState, useEffect } from 'react';
import {
    FaCheck,
    FaExclamationCircle
} from 'react-icons/fa';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardButton from '@/components/dashboard/DashboardButton';
import { useAuth } from '@/contexts/AuthContext';
import { PricingModal } from '@/components/dashboard/PricingModal';

import { getProfile, updateProfile } from '@/api/profile';

export interface UserData {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    role: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
}

const MOCK_USER: UserData = {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    role: '',
    subscriptionPlan: 'free',
    subscriptionStatus: 'none'
};

const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-lg font-bold text-inda-dark mb-4">
        {title}
    </h3>
);

const TealToggleRow = ({
    label,
    checked,
    onChange
}: {
    label: string,
    checked: boolean,
    onChange: (val: boolean) => void
}) => (
    <div
        onClick={() => onChange(!checked)}
        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-3 shadow-sm transition-all hover:shadow-md cursor-pointer select-none group"
    >
        <div>
            <p className="font-medium text-sm text-gray-700">{label}</p>
        </div>
        <div className={`w-10 h-5 rounded-full p-1 relative transition-colors ${checked ? 'bg-inda-teal' : 'bg-gray-300'}`}>
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
    <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-inda-teal focus:border-inda-teal focus:outline-none transition-all ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-50' : ''}`}
        />
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

const SettingsContent = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState<UserData>(MOCK_USER);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    // Notification preferences state
    const [prefs, setPrefs] = useState({
        whatsapp: true,
        emailReports: true,
        smsAlerts: true
    });

    useEffect(() => {
        const localUser: any = user;

        if (localUser) {
            try {
                setFormData(prev => ({
                    ...prev,
                    firstName: localUser.firstName || prev.firstName,
                    lastName: localUser.lastName || prev.lastName,
                    company: localUser.company || localUser.companyName || prev.company,
                    email: localUser.email || prev.email,
                    role: localUser.role || prev.role,
                    subscriptionPlan: localUser.subscriptionPlan || prev.subscriptionPlan,
                    subscriptionStatus: localUser.subscriptionStatus || prev.subscriptionStatus
                }));
            } catch (e) { console.error(e); }
        }

        const fetchFreshData = async () => {
            if (!localUser) return;
            const userId = localUser.id || localUser._id;

            if (userId) {
                if (!localUser.email) setLoading(true);
                try {
                    const result = await getProfile();
                    const remoteUser = result.data || result.user || result;

                    setFormData(prev => ({
                        ...prev,
                        firstName: remoteUser.firstName || prev.firstName,
                        lastName: remoteUser.lastName || prev.lastName,
                        company: remoteUser.company || remoteUser.companyName || prev.company,
                        email: remoteUser.email || prev.email,
                        role: remoteUser.role || prev.role,
                        subscriptionPlan: remoteUser.subscriptionPlan || prev.subscriptionPlan,
                        subscriptionStatus: remoteUser.subscriptionStatus || prev.subscriptionStatus
                    }));
                } catch (err) { console.warn(err); } finally { setLoading(false); }
            }
        };
        fetchFreshData();
    }, [user]);

    const handleChange = (field: keyof UserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (status) setStatus(null);
    };

    const handleSaveChanges = async () => {
        const localUser: any = user;
        if (!localUser) {
            setStatus({ type: 'error', message: 'No active session found. Please log in again.' });
            return;
        }

        setSaving(true);
        setStatus(null);

        try {
            const userId = localUser.id || localUser._id;

            if (!userId) throw new Error("User ID is missing.");

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                company: formData.company
            };

            const result = await updateProfile(payload);
            const updatedUser = result.data || result.user || payload;

            setUser(updatedUser, localUser.token);
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

    const togglePref = (key: keyof typeof prefs) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
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

            <div className="max-w-3xl space-y-10">
                {/* Account Information Section */}
                <div>
                    <SectionHeader title="Account Information" />
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FilledInput
                                label="First Name"
                                value={formData.firstName}
                                placeholder="Olu"
                                onChange={(e) => handleChange('firstName', e.target.value)}
                            />
                            <FilledInput
                                label="Last Name"
                                value={formData.lastName}
                                placeholder="Adeyemi"
                                onChange={(e) => handleChange('lastName', e.target.value)}
                            />
                        </div>
                        <FilledInput
                            label="Role"
                            value={formData.role}
                            disabled
                        />
                        <FilledInput
                            label="Company"
                            value={formData.company}
                            placeholder="Adeyemi Properties Ltd"
                            onChange={(e) => handleChange('company', e.target.value)}
                        />
                        <FilledInput
                            label="Email"
                            value={formData.email}
                            disabled
                        />

                        <div className="flex justify-end mt-6">
                            <DashboardButton
                                variant="primary"
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="min-w-[140px]"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </DashboardButton>
                        </div>
                    </div>
                </div>

                {/* Subscription Section */}
                <div>
                    <SectionHeader title="Subscription" />
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <div>
                                <h4 className="font-bold text-gray-900">
                                    {formData.subscriptionPlan === 'pro' ? 'Pro Plan' :
                                        formData.subscriptionPlan === 'enterprise' ? 'Enterprise Plan' : 'Starter Plan (Free)'}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.subscriptionPlan === 'pro' ? '₦50,000/month' :
                                        formData.subscriptionPlan === 'enterprise' ? '₦75,000/month' : 'No recurring charge'}
                                </p>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${formData.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                                formData.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {formData.subscriptionStatus || 'none'}
                            </span>
                        </div>

                        {formData.subscriptionStatus === 'active' && (
                            <div className="pt-2">
                                <h5 className="font-semibold text-gray-900 mb-2">Need to cancel your subscription?</h5>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    We&apos;re sorry to see you go. To cancel your subscription, please email our customer service team at{' '}
                                    <a href="mailto:customerservice@investinda.com" className="text-inda-teal font-medium hover:underline">
                                        customerservice@investinda.com
                                    </a>
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                    Include your account email and reason for cancellation. We&apos;ll process your request within 24 hours.
                                </p>
                            </div>
                        )}

                        {formData.subscriptionStatus !== 'active' && (
                            <div className="pt-2">
                                <h5 className="font-semibold text-gray-900 mb-2">Upgrade your plan</h5>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Get access to premium features, listed properties, and deeper insights by upgrading your account.
                                </p>
                                <div className="mt-4">
                                    <DashboardButton
                                        variant="secondary"
                                        onClick={() => setIsPricingModalOpen(true)}
                                    >
                                        View Pricing Plans
                                    </DashboardButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notification Preferences Section */}
                <div>
                    <SectionHeader title="Notification Preferences" />
                    <div className="space-y-3">
                        <TealToggleRow
                            label="WhatsApp notifications for new leads"
                            checked={prefs.whatsapp}
                            onChange={() => togglePref('whatsapp')}
                        />
                        <TealToggleRow
                            label="Email reports (weekly)"
                            checked={prefs.emailReports}
                            onChange={() => togglePref('emailReports')}
                        />
                        <TealToggleRow
                            label="SMS alerts for hot leads"
                            checked={prefs.smsAlerts}
                            onChange={() => togglePref('smsAlerts')}
                        />
                    </div>
                </div>
            </div>

            <PricingModal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
            />
        </div>
    );
};


export default function SettingsPage() {
    return (
        <DashboardLayout title="Profile & Settings">
            <div className="max-w-5xl mx-auto pb-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-inda-dark">Profile & Settings</h1>
                </div>

                <SettingsContent />
            </div>
        </DashboardLayout>
    );
}
