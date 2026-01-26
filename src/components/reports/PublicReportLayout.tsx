import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface PublicReportLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PublicReportLayout({ children, title = 'Sample Report' }: PublicReportLayoutProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <header className="bg-[#12181F] text-white h-16 flex items-center justify-between shadow-lg z-20 px-4 md:px-8 border-b border-white/5">
                <Link href="/" className="font-bold text-xl flex items-center gap-3 group cursor-pointer">
                    <div className="bg-inda-teal/20 p-1.5 rounded-lg group-hover:bg-inda-teal/30 transition-colors">
                        <div className="bg-inda-teal w-1.5 h-5 block rounded-full"></div>
                    </div>
                    <span className="tracking-tight font-black text-white/90">Inda</span>
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 hidden md:block">
                        Sample Verification Report
                    </span>
                    <Link
                        href="/for-professionals"
                        className="px-4 py-2 bg-inda-teal text-inda-dark text-sm font-bold rounded-lg hover:bg-inda-teal/90 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            <main className="pb-20">
                <div className="max-w-7xl mx-auto mb-6 pt-6 px-4 md:px-0">
                    <button
                        onClick={() => router.push('/for-professionals')}
                        className="text-xs text-gray-500 hover:text-inda-teal font-medium flex items-center gap-2 transition-colors mb-4"
                    >
                        <FaArrowLeft /> Back to For Professionals
                    </button>
                </div>
                {children}
            </main>

            <footer className="bg-[#12181F] text-white py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        This is a sample verification report demonstrating Inda&apos;s due diligence process.
                    </p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link href="/for-professionals" className="text-inda-teal hover:underline">
                            Learn More
                        </Link>
                        <Link href="/auth/login" className="text-inda-teal hover:underline">
                            Sign In
                        </Link>
                        <Link href="/auth/signup" className="text-inda-teal hover:underline">
                            Get Started
                        </Link>
                    </div>
                    <p className="text-gray-500 text-xs mt-6">
                        &copy; {new Date().getFullYear()} Inda Realty Limited. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
