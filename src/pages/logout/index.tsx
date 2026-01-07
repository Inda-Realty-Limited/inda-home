import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaSignOutAlt } from 'react-icons/fa';
import DashboardButton from '@/components/dashboard/DashboardButton';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user) {
            router.replace('/auth/signin');
        } else {
            setShowModal(true);
        }
    }, [router, user]);

    const handleLogout = async () => {
        await logout();
    };

    const handleCancel = () => {
        router.back();
    };

    if (!showModal) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-inda-light/50 backdrop-blur-sm fixed inset-0 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
                        <FaSignOutAlt className="h-8 w-8 text-red-500 ml-1" />
                    </div>
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">
                        Sign Out?
                    </h3>
                    <p className="text-sm text-gray-500 mb-8">
                        Are you sure you want to sign out of your account? You will need to log in again to access your dashboard.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleCancel}
                        className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:text-sm transition-colors"
                    >
                        Cancel
                    </button>

                    <DashboardButton
                        variant="primary"
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 border-transparent text-white w-full justify-center py-2.5"
                    >
                        Sign Out
                    </DashboardButton>
                </div>
            </div>
        </div>
    );
}
