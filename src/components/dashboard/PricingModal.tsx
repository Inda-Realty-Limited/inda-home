import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastProvider';
import { startSubscription, verifySubscription } from '@/api/subscription';
import { FaTimes } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const toast = useToast();
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

    const handleSubscription = async (plan: string) => {
        if (!user) {
            onClose();
            const rt = encodeURIComponent(router.asPath);
            router.push(`/auth/signup?returnTo=${rt}`);
            return;
        }

        if (user.subscriptionPlan === plan && user.subscriptionStatus === 'active') {
            onClose();
            router.push('/dashboard');
            return;
        }

        const allowedRoles = ['Agent', 'Developer'];
        if (!user.role || !allowedRoles.includes(user.role)) {
            toast.showToast('Only Agents and Developers can subscribe to professional plans.', 3000, 'error');
            return;
        }

        try {
            setIsSubscribing(plan);
            const callbackUrl = `${window.location.origin}${router.asPath}?verify=true&plan=${plan}`;
            const response = await startSubscription(plan, callbackUrl);

            if (response.data?.authorizationUrl) {
                window.location.href = response.data.authorizationUrl;
            } else if (response.message?.includes('successfully')) {
                toast.showToast(response.message, 2000, 'success');
                onClose();
                router.reload();
            }
        } catch (error: any) {
            toast.showToast(error?.response?.data?.message || 'Failed to start subscription', 3000, 'error');
        } finally {
            setIsSubscribing(null);
        }
    };

    // Handle payment verification on return
    useEffect(() => {
        const { verify, reference, tx_ref, plan } = router.query;
        const finalReference = (reference || tx_ref) as string;

        if (verify === 'true' && finalReference) {
            const verifyPayment = async () => {
                try {
                    const response = await verifySubscription(finalReference);
                    if (response.status === 'OK') {
                        toast.showToast(`Welcome to the ${plan} plan!`, 2000, 'success');
                        if (response.data) {
                            setUser(response.data);
                        }
                        // Clear query params
                        router.replace(router.pathname, undefined, { shallow: true });
                    }
                } catch (_error) {
                    toast.showToast('Subscription verification failed', 3000, 'error');
                }
            };
            verifyPayment();
        }
    }, [router.query, setUser, toast, router]);

    if (!isOpen) return null;

    const getButtonText = (plan: string) => {
        if (!user) return 'Get Started';
        if (user.subscriptionPlan === plan && user.subscriptionStatus === 'active') return 'Current Plan';
        if (plan === 'free') return user.subscriptionPlan === 'free' ? 'Current Plan' : 'Switch to Starter';
        if (plan === 'pro') return user.subscriptionPlan === 'free' ? 'Upgrade to Pro' : user.subscriptionPlan === 'pro' ? 'Current Plan' : 'Switch to Pro';
        if (plan === 'enterprise') return user.subscriptionPlan === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise';
        return 'Get Started';
    };

    const isCurrentPlan = (plan: string) => {
        return user?.subscriptionPlan === plan && (user?.subscriptionStatus === 'active' || plan === 'free');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-colors"
                >
                    <FaTimes />
                </button>

                {/* Header */}
                <div className="text-center pt-8 pb-4 px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Choose Your Plan
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Start free. Scale when ready.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-4 p-6">
                    {/* Starter */}
                    <div className={`bg-white rounded-xl border p-6 hover:shadow-md transition-shadow relative ${isCurrentPlan('free') ? 'border-[#50b8b1] ring-1 ring-[#50b8b1]' : 'border-gray-200'}`}>
                        {isCurrentPlan('free') && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#50b8b1] text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                                Current
                            </div>
                        )}
                        <div className="mb-5">
                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Starter</div>
                            <div className="text-3xl font-bold text-gray-900 mb-0.5">Free</div>
                            <div className="text-xs text-gray-500">Forever</div>
                        </div>
                        <ul className="space-y-2.5 mb-6 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>1 property listing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Shareable property link</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Basic analytics</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSubscription('free')}
                            disabled={isSubscribing !== null || isCurrentPlan('free')}
                            className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubscribing === 'free' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {getButtonText('free')}
                        </button>
                    </div>

                    {/* Pro - Featured */}
                    <div className="bg-gray-900 rounded-xl border-2 border-[#50b8b1] p-6 relative hover:shadow-xl transition-shadow">
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                            {isCurrentPlan('pro') ? (
                                <div className="bg-[#50b8b1] text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    Current
                                </div>
                            ) : (
                                <div className="bg-[#50b8b1] text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    Popular
                                </div>
                            )}
                        </div>
                        <div className="mb-5">
                            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Pro</div>
                            <div className="text-3xl font-bold text-white mb-0.5">₦50K</div>
                            <div className="text-xs text-gray-400">per month</div>
                        </div>
                        <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>20 properties</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>WhatsApp integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Full lead tracking</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Channel analytics</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>AI recommendations</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSubscription('pro')}
                            disabled={isSubscribing !== null || isCurrentPlan('pro')}
                            className="w-full py-2.5 bg-[#50b8b1] rounded-lg text-white hover:bg-[#3a9892] transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubscribing === 'pro' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {getButtonText('pro')}
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className={`bg-white rounded-xl border p-6 hover:shadow-md transition-shadow relative ${isCurrentPlan('enterprise') ? 'border-[#50b8b1] ring-1 ring-[#50b8b1]' : 'border-gray-200'}`}>
                        {isCurrentPlan('enterprise') && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#50b8b1] text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                                Current
                            </div>
                        )}
                        <div className="mb-5">
                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Enterprise</div>
                            <div className="text-3xl font-bold text-gray-900 mb-0.5">₦75K</div>
                            <div className="text-xs text-gray-500">per month</div>
                        </div>
                        <ul className="space-y-2.5 mb-6 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Unlimited properties</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>API access</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>White label reports</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Priority verification</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#50b8b1] mt-0.5">✓</span>
                                <span>Dedicated support</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSubscription('enterprise')}
                            disabled={isSubscribing !== null || isCurrentPlan('enterprise')}
                            className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubscribing === 'enterprise' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {getButtonText('enterprise')}
                        </button>
                    </div>
                </div>

                {/* Footer note */}
                <div className="text-center pb-6 px-6">
                    <p className="text-xs text-gray-400">
                        Questions? Contact us at{' '}
                        <a href="mailto:customerservice@investinda.com" className="text-[#50b8b1] hover:underline">
                            customerservice@investinda.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingModal;
