import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PublicReportLayout from '@/components/reports/PublicReportLayout';
import { FaSpinner, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

import DeepDiveReport from '@/components/dashboard/reports/DeepDiveReport';
import DeeperDiveReport from '@/components/dashboard/reports/DeeperDiveReport';
import { ProReportsService } from '@/api/pro-reports';

const SAMPLE_REPORT_ID = 'IND-8827';

export default function ReportDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchReport = async () => {
            if (id === SAMPLE_REPORT_ID) {
                setLoading(true);
                // Simulate network delay for realism
                await new Promise(resolve => setTimeout(resolve, 800));

                const sampleData = {
                    reportId: "IND-8827",
                    client: "Premium Global Real Estate",
                    analyst: "Chidiebere Nwankwo",
                    reportDate: new Date().toLocaleDateString(),
                    confidenceLevel: "Extreme",
                    confidenceScore: 98,
                    propertyOverview: {
                        propertyType: "Luxury 5-Bedroom Detached Villa",
                        location: "Zone A, Banana Island, Ikoyi, Lagos",
                        landSize: "1,200 SQM",
                        yearBuilt: "2023",
                        siteVisitDate: "Jan 12, 2024",
                        inspector: "Engr. Tayo Balogun"
                    },
                    keyFindings: [
                        "Title documents (Certificate of Occupancy) are verified and authentic.",
                        "Building structure shows 0% signs of subsidence or distress.",
                        "Microlocation is premium with guaranteed 24/7 power and security.",
                        "Current market pricing is 5.2% below fair market value for this specific street."
                    ],
                    legalVerification: [
                        { id: 1, title: "Certificate of Occupancy", description: "Verified via Lagos State Land Registry. No encumbrances found.", status: "verified", icon: "shield" },
                        { id: 2, title: "Governor's Consent", description: "Authenticated and up to date.", status: "verified", icon: "shield" },
                        { id: 3, title: "Approved Building Plan", description: "Laser-vetted against LASBCA records. 100% compliant.", status: "verified", icon: "shield" }
                    ],
                    surveyVerification: [
                        { id: 1, title: "Survey Plan", description: "Charting confirmed: Coordinates fall perfectly within the private estate boundary.", status: "verified", icon: "map" },
                        { id: 2, title: "Beacon Verification", description: "Beacons are physically present and in correct positions.", status: "verified", icon: "map" }
                    ],
                    propertyCoordinates: { latitude: 6.4529, longitude: 3.4439 },
                    finalVerdict: {
                        status: "proceed",
                        statusLabel: "Proceed with Confidence",
                        message: "This property is a 'Blue Chip' asset. Title is immaculate, the structure is premium, and the location guarantees high capital appreciation.",
                        investmentGrade: "AAA",
                        stars: 5,
                        metrics: [
                            { label: "Title Safety", value: 100 },
                            { label: "Market Value Score", value: 95 },
                            { label: "Structural Integrity", value: 98 }
                        ]
                    },
                    plan: "deeperDive",
                    sellerVerification: {
                        developerProfile: {
                            company: "Emerald Luxury Homes Ltd",
                            yearsInBusiness: "15 Years",
                            cacRegistration: "RC-1283944 (Verified)",
                            redanMembership: "Active - Gold Member"
                        },
                        riskAssessment: {
                            financialStability: 95,
                            deliveryTrackRecord: 98,
                            customerSatisfaction: 94
                        },
                        confidenceScore: 96,
                        confidenceLabel: "Exceptional",
                        recentProjects: [
                            { title: "The Zenith Heights", deliveryDate: "December 2022", feedback: "Delivered 2 months ahead of schedule. All 24 units sold within 6 months.", rating: 5 },
                            { title: "Banana Island Villas Phase 1", deliveryDate: "August 2021", feedback: "Premium quality finishes. Buyers reported 40% appreciation within first year.", rating: 5 },
                            { title: "Lekki Pearl Residences", deliveryDate: "March 2020", feedback: "Excellent build quality. Minor delays due to COVID but handled professionally.", rating: 4 }
                        ]
                    },
                    onSiteInspection: [
                        { id: 1, title: "Foundation & Structure", description: "Reinforced concrete frame with no visible defects.", status: "verified", icon: "structure" },
                        { id: 2, title: "Finishing & ME", description: "Premium Italian marble and high-end electrical fittings throughout.", status: "verified", icon: "finishes" },
                        { id: 3, title: "Electrical Systems", description: "Full backup generator system, smart home wiring, and surge protection installed.", status: "verified", icon: "electrical" },
                        { id: 4, title: "Plumbing & Water", description: "Borehole with treatment plant, overhead and underground tanks. No leaks detected.", status: "verified", icon: "plumbing" },
                        { id: 5, title: "Security Features", description: "CCTV, electric fence, bulletproof doors, and 24/7 estate security.", status: "verified", icon: "security" }
                    ],
                    photoDocumentation: {
                        exterior: [
                            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                        ],
                        interior: [
                            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                        ],
                        electrical: [
                            "https://images.unsplash.com/photo-1558054665-fbe00cd7d920?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80"
                        ],
                        neighbourhood: [
                            "https://images.unsplash.com/photo-1579678929710-862f8e01c0b2?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1499310392581-322cec0355a6?auto=format&fit=crop&w=800&q=80"
                        ]
                    },
                    environmentalAssessment: {
                        airQuality: 92,
                        noiseLevel: 18,
                        floodRisk: 5
                    },
                    inspectorNotes: [
                        "Property is in excellent condition with premium finishes throughout.",
                        "All utility connections verified and functional.",
                        "Estate management is professional with well-maintained common areas.",
                        "Recommended for immediate acquisition - no red flags identified."
                    ],
                    confidenceScoreBreakdown: {
                        overallScore: 98,
                        sections: [
                            { label: "Legal Documentation", score: 100, note: "All title documents verified. C of O authenticated via Lagos State Land Registry." },
                            { label: "Survey & Boundaries", score: 100, note: "Survey plan charting confirmed. All beacons physically verified on site." },
                            { label: "Seller Verification", score: 96, note: "Developer has 15-year track record with verified CAC registration and REDAN membership." },
                            { label: "Physical Inspection", score: 95, note: "Premium construction quality. Minor cosmetic items noted but no structural concerns." },
                            { label: "Environmental Factors", score: 94, note: "Excellent air quality, low noise levels, minimal flood risk in elevated location." }
                        ],
                        weightedCalculation: [
                            { label: "Legal Documentation", weight: "30%", calculation: "100 × 0.30 = 30.0" },
                            { label: "Survey & Boundaries", weight: "20%", calculation: "100 × 0.20 = 20.0" },
                            { label: "Seller Verification", weight: "20%", calculation: "96 × 0.20 = 19.2" },
                            { label: "Physical Inspection", weight: "20%", calculation: "95 × 0.20 = 19.0" },
                            { label: "Environmental Factors", weight: "10%", calculation: "94 × 0.10 = 9.4" }
                        ],
                        analystNote: "This property represents an exceptional investment opportunity. The combination of immaculate legal documentation, verified developer credentials, and premium construction quality positions this asset in the top tier of Lagos real estate. Recommended for immediate acquisition."
                    }
                };

                setReport(sampleData);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await ProReportsService.getReport(id as string);
                if (response.success && response.data) {
                    // Map the data to expected format if it's from DueDiligenceReport
                    if (response.source === 'DueDiligenceReport') {
                        const raw = response.data;
                        const mapped: any = {
                            reportId: raw.reportId,
                            client: raw.clientName || raw.propertyOverview?.location || "Valued Client",
                            analyst: raw.analystName || "Inda Analyst",
                            reportDate: raw.reportDate ? new Date(raw.reportDate).toLocaleDateString() : new Date(raw.createdAt).toLocaleDateString(),
                            confidenceLevel: raw.confidenceVerdict?.label || "Medium",
                            confidenceScore: raw.confidenceScorePercent || 75,
                            propertyOverview: {
                                propertyType: raw.propertyOverview?.propertyTypeStd || "Residential",
                                location: raw.propertyOverview?.location || "Lagos, Nigeria",
                                landSize: raw.propertyOverview?.landSize || "N/A",
                                yearBuilt: raw.propertyOverview?.yearBuilt || "N/A",
                                siteVisitDate: raw.siteInspection?.visitDate || "N/A",
                                inspector: raw.siteInspection?.inspectorName || "N/A"
                            },
                            keyFindings: raw.propertyOverview?.keyFindings || [],
                            legalVerification: (raw.legalVerification || []).map((v: any) => ({
                                id: v.title,
                                title: v.title,
                                description: v.note || "",
                                status: v.status === 'verified' ? 'verified' : (v.status === 'issue' ? 'failed' : 'pending'),
                                icon: "shield"
                            })),
                            surveyVerification: (raw.surveyVerification || []).map((v: any) => ({
                                id: v.title,
                                title: v.title,
                                description: v.note || "",
                                status: v.status === 'verified' ? 'verified' : (v.status === 'issue' ? 'failed' : 'pending'),
                                icon: "map"
                            })),
                            propertyCoordinates: {
                                latitude: raw.propertyOverview?.coordinates?.latitude || raw.propertyOverview?.coordinates?.lat || 6.45,
                                longitude: raw.propertyOverview?.coordinates?.longitude || raw.propertyOverview?.coordinates?.lng || 3.6
                            },
                            finalVerdict: {
                                status: raw.finalVerdict?.verdict === 'proceed' ? 'proceed' : (raw.finalVerdict?.verdict === 'decline' ? 'decline' : 'caution'),
                                message: raw.finalVerdict?.summary || "Report is currently being compiled.",
                                metrics: raw.finalVerdict?.metrics || []
                            },
                            plan: raw.plan
                        };

                        if (raw.plan === 'deeperDive') {
                            mapped.sellerVerification = {
                                developerProfile: {
                                    company: raw.sellerVerification?.developerProfile?.company || raw.sellerVerification?.developerProfile || "N/A",
                                    yearsInBusiness: raw.sellerVerification?.developerProfile?.yearsInBusiness || "N/A",
                                    cacRegistration: raw.sellerVerification?.developerProfile?.cacRegistration || "Verified",
                                    redanMembership: raw.sellerVerification?.developerProfile?.redanMembership || "Active"
                                },
                                riskAssessment: {
                                    financialStability: raw.sellerVerification?.riskAssessment?.financialStability || 85,
                                    deliveryTrackRecord: raw.sellerVerification?.riskAssessment?.deliveryTrackRecord || 90,
                                    customerSatisfaction: raw.sellerVerification?.riskAssessment?.customerSatisfaction || 88
                                },
                                confidenceScore: raw.sellerVerification?.confidenceScorePercent || raw.confidenceScorePercent || 80,
                                confidenceLabel: raw.sellerVerification?.riskLabel || raw.confidenceVerdict?.label || "Strong",
                                recentProjects: raw.sellerVerification?.recentProjects || []
                            };
                            mapped.onSiteInspection = (raw.siteInspection?.checklist || []).map((c: any) => ({
                                id: c.title,
                                title: c.title,
                                description: c.note || "",
                                status: c.status === 'verified' ? 'verified' : (c.status === 'issue' ? 'failed' : 'pending'),
                                icon: "check"
                            }));
                            mapped.photoDocumentation = raw.siteInspection?.photos || {
                                exterior: [],
                                interior: [],
                                electrical: [],
                                neighbourhood: []
                            };
                            if (Array.isArray(mapped.photoDocumentation)) {
                                mapped.photoDocumentation = {
                                    exterior: mapped.photoDocumentation,
                                    interior: [],
                                    electrical: [],
                                    neighbourhood: []
                                };
                            }
                            mapped.environmentalAssessment = raw.environmentalAssessment;
                            mapped.inspectorNotes = raw.siteInspection?.notes;
                            mapped.confidenceScoreBreakdown = raw.confidenceScoreBreakdown;
                        }
                        setReport(mapped);
                    } else if (response.source === 'Payment') {
                        // For raw payments, provide a skeleton matched to high-fidelity format
                        setReport({
                            reportId: response.data.id,
                            client: "Property Analysis",
                            analyst: "Pending Assignment",
                            reportDate: new Date(response.data.date).toLocaleDateString(),
                            confidenceLevel: "TBD",
                            confidenceScore: 0,
                            propertyOverview: { propertyType: "TBD", location: "TBD", landSize: "TBD", yearBuilt: "TBD" },
                            keyFindings: ["Your payment has been received.", "An analyst is being assigned to visit the property."],
                            legalVerification: [],
                            surveyVerification: [],
                            propertyCoordinates: { latitude: 6.45, longitude: 3.6 },
                            finalVerdict: { status: 'caution', message: 'Report is currently in progress.' },
                            sellerVerification: {
                                developerProfile: { company: "TBD", yearsInBusiness: "TBD", cacRegistration: "Pending", redanMembership: "Pending" },
                                riskAssessment: { financialStability: 0, deliveryTrackRecord: 0, customerSatisfaction: 0 },
                                confidenceScore: 0,
                                confidenceLabel: "Pending Assignment",
                                recentProjects: []
                            },
                            onSiteInspection: [],
                            photoDocumentation: { exterior: [], interior: [], electrical: [], neighbourhood: [] },
                            plan: response.data.type === 'deepDive' ? 'deepDive' : 'deeperDive'
                        });
                    } else {
                        setReport(response.data);
                    }
                } else {
                    setError("Failed to load report data");
                }
            } catch (err: any) {
                console.error("Error fetching report:", err);
                setError(err.message || "An error occurred while fetching report");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const isSampleReport = id === SAMPLE_REPORT_ID;
    const Layout = isSampleReport ? PublicReportLayout : DashboardLayout;

    if (!router.isReady || loading) {
        return (
            <Layout>
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin text-inda-teal text-3xl" />
                        <p className="text-gray-500 text-sm">Loading Report Data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !report) {
        return (
            <Layout title="Report Error">
                <div className="h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
                    <FaExclamationTriangle className="text-red-500 text-5xl mb-2" />
                    <h2 className="text-2xl font-bold text-inda-dark">Report Not Found</h2>
                    <p className="text-gray-500 max-w-md">
                        {error || "We couldn't find the report you're looking for. It might still be in progress or doesn't exist."}
                    </p>
                    <button
                        onClick={() => isSampleReport ? router.push('/for-professionals') : router.push('/reports')}
                        className="mt-4 px-6 py-2 bg-inda-teal text-white rounded-lg font-bold hover:bg-inda-dark transition-colors"
                    >
                        {isSampleReport ? 'Back to For Professionals' : 'Back to Reports Library'}
                    </button>
                </div>
            </Layout>
        );
    }

    // Determine template based on report type
    const isDeeperDive = report.plan === 'deeperDive' || report.type === 'Deeper Dive' || (report.metadata && report.metadata.type === 'Deeper Dive');

    return (
        <Layout title={`Report: ${report.reportId}`}>
            <div className="bg-[#F8FAFC] min-h-screen pb-20">
                {!isSampleReport && (
                    <div className="max-w-7xl mx-auto mb-6 pt-6 px-4 md:px-0">
                        <button
                            onClick={() => router.back()}
                            className="text-xs text-gray-500 hover:text-inda-teal font-medium flex items-center gap-2 transition-colors mb-4"
                        >
                            <FaArrowLeft /> Back to Reports Library
                        </button>
                    </div>
                )}

                {isDeeperDive ? (
                    <DeeperDiveReport data={report} />
                ) : (
                    <DeepDiveReport data={report} />
                )}
            </div>
        </Layout>
    );
}
