import Link from 'next/link';
import DashboardButton from './DashboardButton';

export default function DashboardHeader() {
    return (
        <header className="bg-inda-dark py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-50">

            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="h-8 w-8 bg-inda-teal rounded-sm" />
                <span className="text-white font-bold text-2xl tracking-tight">Inda</span>
            </Link>

            <nav className="flex items-center gap-6">
                <button className="text-gray-400 text-sm hover:text-white transition-colors font-medium">
                    Write a review
                </button>
                <button className="text-gray-400 text-sm hover:text-white transition-colors font-medium">
                    Inda Blog
                </button>

                <Link href="/auth/pro-login">
                    <DashboardButton variant="primary" className="ml-2 text-xs uppercase tracking-wider px-6 py-2.5">
                        Sign In
                    </DashboardButton>
                </Link>
            </nav>

        </header>
    );
}
