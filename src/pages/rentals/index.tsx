import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const ShortTermRentalPage = () => {
    return (
        <DashboardLayout title="Short-Term Rental">
            <div className="max-w-5xl mx-auto h-[80vh]">
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h1 className="text-3xl font-bold text-inda-dark mb-2">Short-Term Rentals</h1>
                    <p className="text-sm text-gray-600 max-w-lg">
                        Analyze short-term rental performance and market opportunities
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <h2 className="text-xl font-medium text-inda-teal">Coming Soon...</h2>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ShortTermRentalPage;
