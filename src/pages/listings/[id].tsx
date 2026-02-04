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

                console.log('Raw listing data:', rawData); // Debug log

                // Calculate days on market
                const createdDate = rawData.createdAt || rawData.snapshot?.createdAt;
                const dom = createdDate
                    ? Math.floor((new Date().getTime() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                setDaysOnMarket(dom);

                // Get address from multiple possible fields
                const address = rawData.fullAddress || rawData.microlocation || rawData.microlocationStd ||
                               rawData.address || rawData.location || 'Unknown Location';

                // Combine all document types into a single array with labels
                const allDocuments: Array<{ url?: string; label: string }> = [];

                // First, use documentsWithMeta if available (new structured format)
                if (rawData.documentsWithMeta?.length) {
                    rawData.documentsWithMeta.forEach((doc: { url: string; type: string }) => {
                        allDocuments.push({ url: doc.url, label: doc.type });
                    });
                } else {
                    // Fallback to legacy format

                    // Add title docs
                    if (rawData.titleDocs?.length) {
                        rawData.titleDocs.forEach((url: string) => {
                            allDocuments.push({ url, label: 'Title Document' });
                        });
                    }

                    // Add legal docs (may include survey)
                    if (rawData.legalDocs?.length) {
                        rawData.legalDocs.forEach((url: string, index: number) => {
                            // Try to determine if it's a survey based on filename or just label generically
                            const isSurvey = url.toLowerCase().includes('survey');
                            allDocuments.push({
                                url,
                                label: isSurvey ? 'Survey Plan' : `Legal Document ${index + 1}`
                            });
                        });
                    }

                    // Add general documents
                    if (rawData.documents?.length) {
                        rawData.documents.forEach((doc: any, index: number) => {
                            if (typeof doc === 'string') {
                                allDocuments.push({ url: doc, label: `Document ${index + 1}` });
                            } else if (doc.url) {
                                allDocuments.push({ url: doc.url, label: doc.label || `Document ${index + 1}` });
                            }
                        });
                    }
                }

                // Combine all photo types
                const allPhotos: Array<{ url: string; label: string; category: string }> = [];

                // First, use photosWithMeta if available (new structured format)
                if (rawData.photosWithMeta?.length) {
                    rawData.photosWithMeta.forEach((photo: { url: string; label: string; category?: string }) => {
                        allPhotos.push({
                            url: photo.url,
                            label: photo.label,
                            category: photo.category || 'general'
                        });
                    });
                } else {
                    // Fallback to legacy format

                    // Add property images
                    if (rawData.propertyImages?.length) {
                        rawData.propertyImages.forEach((url: string) => {
                            allPhotos.push({ url, label: 'Property Photo', category: 'property' });
                        });
                    }

                    // Add amenity images
                    if (rawData.amenityImages?.length) {
                        rawData.amenityImages.forEach((url: string) => {
                            allPhotos.push({ url, label: 'Amenity Photo', category: 'amenity' });
                        });
                    }

                    // Add general images
                    if (rawData.imageUrls?.length) {
                        rawData.imageUrls.forEach((url: string) => {
                            allPhotos.push({ url, label: 'Photo', category: 'general' });
                        });
                    }

                    // Fallback to images array
                    if (allPhotos.length === 0 && rawData.images?.length) {
                        rawData.images.forEach((img: any) => {
                            const url = typeof img === 'string' ? img : img.url;
                            if (url) {
                                allPhotos.push({ url, label: 'Photo', category: 'general' });
                            }
                        });
                    }
                }

                // Map API response to ViewHub PropertyData interface
                const mappedProperty: PropertyData = {
                    id: rawData._id || rawData.id,
                    propertyType: rawData.propertyType || rawData.propertyTypeStd || rawData.type || 'Property',
                    address,
                    price: (rawData.purchasePrice || rawData.priceNGN || rawData.price || 0).toString(),
                    bedrooms: (rawData.bedrooms || rawData.specs?.bed || '').toString(),
                    bathrooms: (rawData.bathrooms || rawData.specs?.bath || '').toString(),
                    documents: allDocuments,
                    photos: allPhotos,
                    views: rawData.views || 0,
                    questions: rawData.leads || 0,
                    offers: rawData.offers || 0,
                    engaged: rawData.engaged || 0,
                    createdAt: createdDate
                };

                console.log('Mapped property:', mappedProperty); // Debug log
                
                // Use intelligenceData directly if available from the analysis API
                if (rawData.intelligenceData) {
                    setIntelligenceData(rawData.intelligenceData);
                }
                // Fallback: Map Intelligence Data from legacy analytics if available
                else if (rawData.analytics || rawData.snapshot?.analytics) {
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
                        },
                        cash_flow_forecast: {}
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
