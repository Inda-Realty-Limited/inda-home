import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import {
    Home, Briefcase, Users, Megaphone, GraduationCap,
    MessageCircle, Database, Gift, Headphones, Settings, LogOut, X
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Home', icon: Home, href: '/dashboard' },
    { label: 'Listings', icon: Briefcase, href: '/listings' },
    { label: 'CRM', icon: Users, href: '/crm' },
    { label: 'Marketing Center', icon: Megaphone, href: '/marketing' },
    { label: 'Training', icon: GraduationCap, href: '/training' },
    { label: 'Channel Setup', icon: MessageCircle, href: '/channels' },
    { label: 'Data Contribution', icon: Database, href: '/contribute' },
    { label: 'Perks Hub', icon: Gift, href: '/perks' },
    { label: 'Support', icon: Headphones, href: '/support' },
    { label: 'Profile & Settings', icon: Settings, href: '/settings' },
];

interface AppSidebarProps {
    headerVisible?: boolean;
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export default function AppSidebar({
    headerVisible = true,
    isMobileOpen = false,
    onCloseMobile,
}: AppSidebarProps) {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <aside
            className={`fixed left-0 bottom-0 z-50 flex w-[277px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:z-30 ${
                headerVisible ? 'top-16 lg:top-16' : 'top-0'
            } ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
        >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 lg:hidden">
                <span className="text-sm font-semibold text-gray-900">Menu</span>
                <button
                    onClick={onCloseMobile}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <nav className="flex-1 py-6 overflow-y-auto">
                <div className="space-y-1 px-4">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = router.asPath === item.href || router.asPath.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onCloseMobile}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-[#4ea8a1] text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        onCloseMobile?.();
                        logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
