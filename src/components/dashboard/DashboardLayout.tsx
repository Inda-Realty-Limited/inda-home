import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    showHeader?: boolean;
}

export default function DashboardLayout({ children, showHeader = true }: DashboardLayoutProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            const allowedRoles = ['AGENT', 'DEVELOPER', 'ADMIN', 'SUPER_ADMIN'];
            if (!allowedRoles.includes(user.role)) {
                router.replace('/');
            }
        }
    }, [user, isAuthenticated, router]);

    const getInitials = () => {
        if (!user) return 'U';
        const first = user.firstName?.[0] || '';
        const last = user.lastName?.[0] || '';
        return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Full-width top header */}
            {showHeader && (
                <header className="bg-white h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4ea8a1] rounded-lg px-3 py-2 flex items-center justify-center">
                            <span className="text-white font-bold text-base">I</span>
                        </div>
                        <span className="text-gray-900 font-bold text-lg">Inda Pro</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="relative group"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4ea8a1] rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                3
                            </span>
                        </button>
                        <button className="bg-[#4ea8a1] rounded-full w-9 h-9 flex items-center justify-center">
                            <span className="text-white font-semibold text-base">{getInitials()}</span>
                        </button>
                    </div>
                </header>
            )}

            <AppSidebar headerVisible={showHeader} />

            <div className={`ml-[277px] ${showHeader ? 'pt-16' : ''}`}>
                <main className="p-8 pb-20 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
