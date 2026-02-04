import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProListingsService } from "@/api/pro-listings";
import { ViewHub, type PropertyData } from "@/components/dashboard/hub/ViewHub";

// ============================================================================
// PAGE COMPONENT (Data Fetching Wrapper)
// ============================================================================

export default function PropertyHubPage() {
    const router = useRouter();
    const { id } = router.query;
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [intelligenceData, setIntelligenceData] = useState<any | null>(null);
    const [daysOnMarket, setDaysOnMarket] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchProperty = async () => {
            try {
                const res = await ProListingsService.getListing(id as string);
                const rawData = res.data || res;
                
                // Calculate days on market
                const createdDate = rawData.createdAt || rawData.snapshot?.createdAt;
                const dom = createdDate 
                    ? Math.floor((new Date().getTime() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                setDaysOnMarket(dom);
                
                // Map API response to ViewHub PropertyData interface
                const mappedProperty: PropertyData = {
                    id: rawData._id || rawData.id,
                    propertyType: rawData.propertyType || rawData.type || 'Property',
                    address: rawData.microlocationStd || rawData.address || rawData.location || 'Unknown Location',
                    price: (rawData.purchasePrice || rawData.price || 0).toString(),
                    bedrooms: (rawData.bedrooms || rawData.specs?.bed || 0).toString(),
                    bathrooms: (rawData.bathrooms || rawData.specs?.bath || 0).toString(),
                    documents: rawData.documents || [],
                    photos: (rawData.images || []).map((img: any) => ({
                        url: typeof img === 'string' ? img : img.url,
                        label: 'Photo',
                        category: 'general'
                    })),
                    views: rawData.views || 0,
                    questions: rawData.leads || 0,
                    offers: rawData.offers || 0,
                    engaged: rawData.engaged || 0,
                    createdAt: createdDate
                };
                
                // Map Intelligence Data from analytics if available
                if (rawData.analytics || rawData.snapshot?.analytics) {
                    const analytics = rawData.analytics || rawData.snapshot?.analytics;
                    const mappedIntelligence = {
                        property_details: {
                            price: parseInt(mappedProperty.price.replace(/[^\d]/g, '')) || 0,
                            location: mappedProperty.address,
                            specs: {
                                bed: parseInt(mappedProperty.bedrooms || '0'),
                                bath: parseInt(mappedProperty.bathrooms || '0'),
                                size: "N/A"
                            },
                            userId: rawData.userId || "unknown",
                            title: mappedProperty.propertyType,
                            features: rawData.features || ""
                        },
                        location_intelligence: {
                            coordinates: {
                                lat: 6.5, // Default or extract
                                lng: 3.3
                            },
                            district: analytics.microlocation?.label || "Unknown",
                            accessibility: {
                                to_victoria_island_minutes: 30, // Default
                                to_airport_minutes: 30
                            },
                            nearby_schools: { count: 5, distance_km: 5, names: [] },
                            nearby_hospitals: { count: 3, distance_km: 5, names: [] },
                            nearby_shopping: { count: 2, distance_km: 5, names: [] },
                            infrastructure_projects: {}
                        },
                        investment_analysis: {
                            total_investment_breakdown: {
                                purchase_price: parseInt(mappedProperty.price.replace(/[^\d]/g, '')) || 0,
                                // ... other calculations can be done here or in component
                                total_investment: (parseInt(mappedProperty.price.replace(/[^\d]/g, '')) || 0) * 1.15
                            },
                            annual_rental_income: {
                                net_rental_income: analytics.yields?.annualLongTermIncomeNGN || 0,
                                gross_yield_pct: analytics.yields?.longTermPct || 0,
                                net_yield_pct: analytics.yields?.longTermPct ? analytics.yields.longTermPct * 0.8 : 0,
                            },
                            meta: { rent_source: "analytics" }
                        },
                        value_projection: {
                            annual_appreciation_pct: analytics.appreciation?.nominalPct || 0,
                            // Map projection years if available
                        },
                        cash_flow_forecast: {
                            // Map forecast if available
                        }
                    };
                    setIntelligenceData(mappedIntelligence);
                }

                setProperty(mappedProperty);
            } catch (err) {
                console.error(err);
                setError('Failed to load property details');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <ProtectedRoute>
                <DashboardLayout title="Property Hub" showHeader={false}>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inda-teal"></div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (error || !property) {
        return (
            <ProtectedRoute>
                <DashboardLayout title="Property Hub" showHeader={false}>
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
                        <button onClick={() => router.push('/dashboard')} className="text-inda-teal hover:underline">
                            Return to Dashboard
                        </button>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout title="Property Hub" showHeader={false}>
                <ViewHub 
                    property={property} 
                    intelligenceData={intelligenceData}
                    daysOnMarket={daysOnMarket}
                    onEdit={() => router.push(`/listings/edit?id=${property.id}`)}
                    onBack={() => router.push('/dashboard')}
                />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
