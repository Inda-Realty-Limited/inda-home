import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppSidebar from './AppSidebar';
import { FaBell } from 'react-icons/fa';

interface UserProfile {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    token?: string;
    [key: string]: any;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({ children, title = 'Inda Pro' }: DashboardLayoutProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            const stored = localStorage.getItem('user');

            if (!stored) {
                console.warn('Unauthorized access attempt. Redirecting to login.');
            }

            try {
                if (stored) {
                    const parsedUser = JSON.parse(stored);
                    if (!parsedUser.firstName && parsedUser.name) {
                        parsedUser.firstName = parsedUser.name.split(' ')[0];
                    }
                    setUser(parsedUser);
                }
                setIsAuthorized(true);
            } catch (error) {
                console.error('Failed to parse user session:', error);
                localStorage.removeItem('user');
                setIsAuthorized(true);
            }
        };

        loadUser();

        const handleUserUpdate = () => {
            loadUser();
        };

        window.addEventListener('user-updated', handleUserUpdate);
        return () => window.removeEventListener('user-updated', handleUserUpdate);
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-inda-light">
                <div className="w-8 h-8 border-2 border-inda-teal border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const getInitials = () => {
        if (!user) return 'U';
        if (user.firstName) return user.firstName[0].toUpperCase();
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
                                3
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
