import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { IconType } from 'react-icons';
import {
    FaHome, FaListAlt, FaLightbulb, FaBullhorn, FaBriefcase,
    FaFileAlt, FaSearch, FaChartBar, FaUsers, FaSuitcase, FaDoorOpen,
    FaGift, FaCog, FaBars, FaTimes
} from 'react-icons/fa';

// --- Types & Interfaces ---

interface MenuItem {
    name: string;
    icon: IconType;
    href: string;
}

// --- Configuration ---

const MENU_ITEMS: MenuItem[] = [
    { name: 'Home', icon: FaHome, href: '/dashboard' },
    { name: 'Listings Manager', icon: FaListAlt, href: '/listings' },
    // { name: 'Insights', icon: FaLightbulb, href: '/insights' },
    // { name: 'Advertisement', icon: FaBullhorn, href: '/advertisement' },
    // { name: 'Portfolio Manager', icon: FaBriefcase, href: '/portfolio' },
    { name: 'Reports Hub', icon: FaFileAlt, href: '/reports' },
    // { name: 'Source', icon: FaSearch, href: '/source' },
    { name: 'Data Contribution', icon: FaUsers, href: '/contribute' },
    { name: 'Perks Hub', icon: FaGift, href: '/perks' },
    { name: 'Profile & Settings', icon: FaCog, href: '/settings' },
    { name: 'Logout', icon: FaDoorOpen, href: '/logout' },
];

// --- Component ---

export default function AppSidebar() {
    const router = useRouter();
    const { logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Auto-close sidebar on mobile when route changes
    useEffect(() => {
        const handleRouteChange = () => setIsMobileOpen(false);
        router.events.on('routeChangeStart', handleRouteChange);
        return () => router.events.off('routeChangeStart', handleRouteChange);
    }, [router]);

    return (
        <>
            {/* ========================================================= */}
            {/* MOBILE TRIGGER BUTTON (Visible only on small screens)     */}
            {/* ========================================================= */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-inda-dark border border-gray-200 hover:bg-gray-50 focus:outline-none"
                aria-label="Toggle Menu"
            >
                {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* ========================================================= */}
            {/* MOBILE OVERLAY (Backdrop)                                 */}
            {/* ========================================================= */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ========================================================= */}
            {/* SIDEBAR CONTAINER                                         */}
            {/* ========================================================= */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 h-screen bg-[#F8F9FA] border-r border-gray-200 
          flex flex-col overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-none'}
        `}
            >

                {/* Brand / Logo Placeholder */}
                <div className="p-6 h-16 flex items-center justify-between">
                    {/* TODO: Insert <Image /> here */}
                    <span className="font-bold text-lg text-inda-dark md:hidden">Menu</span>

                    {/* Close Button inside Drawer (Mobile Only) */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 space-y-1 pb-4">
                    {MENU_ITEMS.map((item) => {
                        // Skip Logout in the map (handled separately or removed from const)
                        if (item.name === 'Logout') return null;
                        
                        const isActive = router.asPath === item.href || router.asPath.startsWith(`${item.href}/`);

                        return (
                            <Link
                                href={item.href}
                                key={item.name}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-white text-inda-teal border border-gray-200 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-inda-dark'
                                    }`}
                            >
                                <item.icon className={`text-lg ${isActive ? "text-inda-teal" : "text-gray-400"}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 mt-2"
                    >
                        <FaDoorOpen className="text-lg text-gray-400 group-hover:text-red-500" />
                        Logout
                    </button>
                </nav>
            </aside>
        </>
    );
}
