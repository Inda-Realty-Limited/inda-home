import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

import DeepDiveTemplate, { ReportData } from '@/components/dashboard/reports/DeepDiveReport';
import DeeperDiveTemplate, { DeeperReportData } from '@/components/dashboard/reports/DeeperDiveReport';

const DEEP_DIVE_MOCK: ReportData = {
    id: 'IND-8827',
    client: 'Invest Corp',
    analyst: 'Sarah J.',
    date: 'Oct 20, 2023',
    summary: {
        securityScore: '92/100',
        marketValue: '₦85,000,000',
        appreciation: '12% p.a',
        verdict: 'Safe to Buy'
    },
    keyFindings: [
        "Clean title (Certificate of Occupancy verified at Alausa).",
        "Zoning aligns with residential development plans.",
        "Access road is currently unpaved but motorable.",
        "No active litigation found on the property."
    ],
    legal: [
        { label: 'Certificate of Occupancy', status: 'Valid', subtext: 'Verified at Alausa Registry (Vol 44, Pg 22)' },
        { label: 'Deed of Assignment', status: 'Valid', subtext: 'Executed and Registered' },
        { label: 'Governor’s Consent', status: 'Pending', subtext: 'Application submitted, file no. 8821' },
        { label: 'Litigation Search', status: 'Valid', subtext: 'No active court cases found' },
    ],
    survey: [
        { label: 'Land Coordinates', status: 'Valid', subtext: 'Matches surveyor general plan' },
        { label: 'Boundary Verification', status: 'Valid', subtext: 'Beacons are intact and accurate' },
        { label: 'Flood Risk', status: 'Valid', subtext: 'Dry land, no history of flooding' },
        { label: 'Encroachment Check', status: 'Valid', subtext: 'No physical encroachment detected' }
    ],
    verdict: {
        status: 'PASSED',
        message: 'The property has passed all critical legal and survey checks. The pending Governor’s consent is procedural and does not pose a significant risk.'
    }
};

const DEEPER_DIVE_MOCK: DeeperReportData = {
    ...DEEP_DIVE_MOCK,
    id: 'IND-8829',
    client: 'Chinedu O.',
    sellerVerification: [
        { label: 'Identity Check', value: 'Confirmed (NIN & Passport Match)' },
        { label: 'Ownership History', value: 'First owner bought from Family in 2010' },
        { label: 'Litigation Check', value: 'Clear (No disputes on previous owners)' }
    ],
    physicalInspection: [
        { label: 'Property Condition', value: 'Excellent (New Construction)' },
        { label: 'Current Occupancy', value: 'Vacant' },
        { label: 'Local Infrastructure', value: 'Paved road, Power available' },
        { label: 'Neighborhood', value: 'Quiet Residential Zone' }
    ]
};

export default function ReportDetailsPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!router.isReady) {
        return (
            <DashboardLayout>
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin text-inda-teal text-3xl" />
                        <p className="text-gray-500 text-sm">Loading Report Data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const isDeeperDive = id === 'IND-8829';
    const reportData = isDeeperDive ? DEEPER_DIVE_MOCK : { ...DEEP_DIVE_MOCK, id: id as string };

    return (
        <DashboardLayout title={`Report: ${id}`}>
            <div className="bg-[#F8FAFC] min-h-screen pb-20">
                <div className="max-w-4xl mx-auto mb-6 pt-6 px-4 md:px-0">
                    <button
                        onClick={() => router.back()}
                        className="text-xs text-gray-500 hover:text-inda-teal font-medium flex items-center gap-2 transition-colors"
                    >
                        <FaArrowLeft /> Back to Reports Library
                    </button>
                </div>

                {isDeeperDive ? (
                    <DeeperDiveTemplate data={reportData as DeeperReportData} />
                ) : (
                    <DeepDiveTemplate data={reportData as ReportData} />
                )}
            </div>
        </DashboardLayout>
    );
}
