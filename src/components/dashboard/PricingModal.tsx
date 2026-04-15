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

type ProfessionalPlan = 'starter' | 'growth' | 'elite' | 'partner';

const PLAN_ORDER: Record<ProfessionalPlan, number> = {
    starter: 0,
    growth: 1,
    elite: 2,
    partner: 3,
};

const PLAN_CONFIG: Array<{
    id: ProfessionalPlan;
    label: string;
    price: string;
    cadence: string;
    credits: string;
    features: string[];
    featured?: boolean;
}> = [
    {
        id: 'starter',
        label: 'Starter',
        price: 'Free',
        cadence: 'Default plan',
        credits: '0 monthly credits',
        features: ['1 property listing', 'Shareable property link', 'Basic analytics'],
    },
    {
        id: 'growth',
        label: 'Growth',
        price: '₦300K',
        cadence: 'per month',
        credits: '300 monthly credits',
        features: ['Up to 300 credits monthly', 'WhatsApp and channel distribution', 'Lead and CRM tracking', 'Marketing service checkout with credits'],
        featured: true,
    },
    {
        id: 'elite',
        label: 'Elite',
        price: '₦750K',
        cadence: 'per month',
        credits: '750 monthly credits',
        features: ['Up to 750 credits monthly', 'Priority marketing operations', 'Advanced reporting and white-label assets', 'Higher team throughput'],
    },
    {
        id: 'partner',
        label: 'Partner',
        price: '₦2.5M',
        cadence: 'per month',
        credits: '2,500 monthly credits',
        features: ['Up to 2,500 credits monthly', 'Highest servicing priority', 'Partner-level support', 'Best fit for large-volume agencies'],
    },
];

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const toast = useToast();
    const [isSubscribing, setIsSubscribing] = useState<ProfessionalPlan | null>(null);

    const handleSubscription = async (plan: ProfessionalPlan) => {
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

        const allowedRoles = ['AGENT', 'DEVELOPER'];
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

    const getButtonText = (plan: ProfessionalPlan) => {
        if (!user) return 'Get Started';
        if (user.subscriptionPlan === plan && user.subscriptionStatus === 'active') return 'Current Plan';
        const currentPlan = (user.subscriptionPlan || 'starter') as ProfessionalPlan;
        if (plan === 'starter') return 'Starter is the default plan';
        if ((PLAN_ORDER[currentPlan] ?? 0) < PLAN_ORDER[plan]) return `Upgrade to ${PLAN_CONFIG.find((item) => item.id === plan)?.label}`;
        return `Switch to ${PLAN_CONFIG.find((item) => item.id === plan)?.label}`;
    };

    const isCurrentPlan = (plan: ProfessionalPlan) => {
        return user?.subscriptionPlan === plan && (user?.subscriptionStatus === 'active' || plan === 'starter');
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
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
                    {PLAN_CONFIG.map((plan) => {
                        const current = isCurrentPlan(plan.id);
                        const highlighted = plan.featured;
                        return (
                            <div
                                key={plan.id}
                                className={`${highlighted ? 'bg-gray-900 border-2 border-[#50b8b1]' : 'bg-white border'} rounded-xl p-6 relative hover:shadow-md transition-shadow ${current ? 'ring-1 ring-[#50b8b1]' : 'border-gray-200'}`}
                            >
                                {(current || highlighted) && (
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#50b8b1] text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                                        {current ? 'Current' : 'Popular'}
                                    </div>
                                )}
                                <div className="mb-5">
                                    <div className={`text-xs mb-1 uppercase tracking-wide font-medium ${highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.label}</div>
                                    <div className={`text-3xl font-bold mb-0.5 ${highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</div>
                                    <div className={`text-xs ${highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.cadence}</div>
                                    <div className={`text-xs mt-2 font-medium ${highlighted ? 'text-[#7dd2cb]' : 'text-[#50b8b1]'}`}>{plan.credits}</div>
                                </div>
                                <ul className={`space-y-2.5 mb-6 text-sm ${highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <span className="text-[#50b8b1] mt-0.5">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSubscription(plan.id)}
                                    disabled={isSubscribing !== null || current || plan.id === 'starter'}
                                    className={`w-full py-2.5 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${highlighted ? 'bg-[#50b8b1] text-white hover:bg-[#3a9892]' : 'border border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                    {isSubscribing === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {getButtonText(plan.id)}
                                </button>
                            </div>
                        );
                    })}
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
