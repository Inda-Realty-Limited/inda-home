import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import { FaBell } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({ children, title = 'Inda Pro' }: DashboardLayoutProps) {
    const { user } = useAuth();

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

                <header className="bg-inda-dark text-white h-16 flex items-center justify-between shadow-md z-20 flex-shrink-0 
          px-4 pl-14 md:px-8"
                >

                    <div className="font-bold text-xl flex items-center gap-2">
                        <span className="bg-inda-teal w-1 h-6 block rounded-full"></span>
                        <span className="truncate max-w-[150px] md:max-w-none">{title}</span>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            className="relative text-gray-400 hover:text-white transition-colors"
                            aria-label="Notifications"
                        >
                            <FaBell size={20} />
                            <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                                0
                            </span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block leading-tight">
                                <p className="text-sm font-bold text-gray-200">
                                    {user?.firstName || user?.name || user?.email || 'User'}
                                </p>
                                <p className="text-[10px] text-inda-teal uppercase tracking-wider font-bold">
                                    {user?.role || 'Member'}
                                </p>
                            </div>
                            <div className="h-8 w-8 bg-gray-600 rounded-full border-2 border-gray-500 flex items-center justify-center text-xs font-bold overflow-hidden cursor-pointer hover:border-inda-teal transition-colors">
                                {getInitials()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-20 md:pb-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
