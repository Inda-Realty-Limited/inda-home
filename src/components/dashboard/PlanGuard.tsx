import React from 'react';
import Link from 'next/link';
import { FaLock, FaRocket } from 'react-icons/fa';

interface PlanGuardProps {
    children: React.ReactNode;
    plan: string;
    requiredPlan?: 'pro' | 'enterprise';
    message?: string;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({
    children,
    plan,
    requiredPlan = 'pro',
    message = "Upgrade to Pro to unlock advanced analytics and lead tracking."
}) => {
    const isLocked = plan === 'free' || (plan === 'pro' && requiredPlan === 'enterprise');

    if (!isLocked) return <>{children}</>;

    return (
        <div className="relative group">
            <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-white/40 flex items-center justify-center rounded-3xl transition-all group-hover:bg-white/60">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-inda-teal/20 text-center max-w-sm mx-4 transform transition-all group-hover:scale-105">
                    <div className="w-16 h-16 bg-inda-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-inda-teal text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-inda-dark mb-2">Premium Feature</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {message}
                    </p>
                    <Link
                        href="/for-professionals#pricing"
                        className="inline-flex items-center gap-2 bg-inda-teal text-white px-8 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg"
                    >
                        <FaRocket /> Upgrade Now
                    </Link>
                </div>
            </div>
            <div className="opacity-40 grayscale pointer-events-none select-none">
                {children}
            </div>
        </div>
    );
};
