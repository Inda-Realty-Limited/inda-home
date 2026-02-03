import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import { FaBell } from 'react-icons/fa';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    showHeader?: boolean;
}

export default function DashboardLayout({ children, title = 'Inda Pro', showHeader = true }: DashboardLayoutProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            const allowedRoles = ['Agent', 'Developer', 'Admin'];
            if (!allowedRoles.includes(user.role)) {
                router.replace('/');
            }
        }
    }, [user, isAuthenticated, router]);

    // Safety check for user loaded
    // Note: Dashboard pages should be wrapped in ProtectedRoute, so user should exist here.
    // If not, we handle gracefully.

    const getInitials = () => {
        if (!user) return 'U';
        if (user.firstName) {
            const first = user.firstName[0];
            const last = user.lastName ? user.lastName[0] : '';
            return (first + last).toUpperCase();
        }
        if (user.name) return user.name[0].toUpperCase();
        if (user.email) return user.email[0].toUpperCase();
        return 'U';
    };

    return (
        <div className="flex h-screen bg-inda-light font-sans overflow-hidden">

            <AppSidebar />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {showHeader && (
                    <header className="bg-[#12181F] text-white h-16 flex items-center justify-between shadow-lg z-20 flex-shrink-0 
          px-4 pl-14 md:px-8 border-b border-white/5"
                    >

                        <div className="font-bold text-xl flex items-center gap-3 group cursor-pointer">
                            <div className="bg-inda-teal/20 p-1.5 rounded-lg group-hover:bg-inda-teal/30 transition-colors">
                                <div className="bg-inda-teal w-1.5 h-5 block rounded-full"></div>
                            </div>
                            <span className="truncate max-w-[150px] md:max-w-none tracking-tight font-black text-white/90">{title}</span>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                            <button
                                className="relative text-gray-400 hover:text-inda-teal transition-all hover:scale-110 active:scale-90"
                                aria-label="Notifications"
                            >
                                <FaBell size={18} />
                                <span className="absolute -top-1.5 -right-1.5 bg-inda-teal w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-inda-dark font-black shadow-lg">
                                    5
                                </span>
                            </button>

                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                                <div className="text-right hidden lg:block leading-tight">
                                    <p className="text-sm font-black text-white/90">
                                        {user?.firstName || user?.name || user?.email || 'User'}
                                    </p>
                                    <p className="text-[9px] text-inda-teal uppercase tracking-[0.1em] font-black opacity-80">
                                        {user?.role || 'Member'}
                                    </p>
                                </div>
                                <div className="h-9 w-9 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-white/10 flex items-center justify-center text-xs font-black overflow-hidden cursor-pointer hover:border-inda-teal transition-all hover:scale-105 shadow-inner">
                                    {getInitials()}
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-20 md:pb-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
