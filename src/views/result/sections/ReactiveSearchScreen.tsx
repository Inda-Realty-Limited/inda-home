import { Button, Container, Footer, Navbar } from "@/components";
import PropertyMap from "@/components/PropertyMap";
import { ReactiveSearchResult } from "@/api/listings";
import { useRouter } from "next/router";
import React from "react";
import { ArrowRight, MapPin, Home, DollarSign, Share2 } from "lucide-react";

type Props = {
    reactiveData: ReactiveSearchResult;
    searchQuery: string;
};

const ReactiveSearchScreen: React.FC<Props> = ({
    reactiveData,
    searchQuery,
}) => {
    const router = useRouter();
    const data = reactiveData?.merged_data;

    if (!data) {
        return (
            <Container noPadding className="min-h-screen bg-[#F9F9F9]">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <p className="text-gray-600">Unable to load property data</p>
                    </div>
                </main>
                <Footer />
            </Container>
        );
    }

    const formatNaira = (nairaStr: string | number) => {
        const num = typeof nairaStr === "string" ? parseInt(nairaStr, 10) : nairaStr;
        if (isNaN(num)) return "₦—";
        const millions = num / 1000000;
        return millions >= 1 ? `₦${millions.toFixed(1)}M` : `₦${num.toLocaleString()}`;
    };

    const handleNewSearch = () => {
        router.push("/for-buyers");
    };

    const handleShareProperty = () => {
        const text = `Check out this property: ${data.title} in ${data.address}. ${data.description_raw}`;
        if (navigator.share) {
            navigator.share({
                title: data.title,
                text: text,
                url: data.detail_url,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(data.detail_url);
            alert("Property link copied to clipboard!");
        }
    };

    return (
        <Container
            noPadding
            className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
        >
            <Navbar />
            <main className="flex-1 py-12 px-6 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                Property Found via Reactive Search
                            </h1>
                            <button
                                onClick={handleNewSearch}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Search Again
                            </button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Left: Property Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Property Title & Location */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {data.title}
                                </h2>
                                <div className="flex items-start gap-3 text-gray-700">
                                    <MapPin className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">{data.address}</p>
                                        <p className="text-sm text-gray-600">
                                            Source: {data.source_site}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Property Specs */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="text-gray-600 text-sm font-medium mb-2">
                                        Bedrooms
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {data.detail_beds}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="text-gray-600 text-sm font-medium mb-2">
                                        Bathrooms
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {data.detail_baths}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="text-gray-600 text-sm font-medium mb-2">
                                        Toilets
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {data.detail_toilets}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="text-gray-600 text-sm font-medium mb-2">
                                        Price
                                    </div>
                                    <div className="text-xl font-bold text-[#4ea8a1]">
                                        {formatNaira(data.price_naira)}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed line-clamp-6">
                                    {data.description_raw}
                                </p>
                            </div>

                            {/* Amenities */}
                            {data.amenities && (
                                <div className="bg-white rounded-3xl p-8 shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Amenities
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {data.amenities.split("|").map((amenity, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 bg-[#4ea8a1]/10 rounded-lg px-3 py-2"
                                            >
                                                <div className="w-2 h-2 bg-[#4ea8a1] rounded-full" />
                                                <span className="text-sm text-gray-700">
                                                    {amenity.trim()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location & Amenities Info */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  School
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.school_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  Hospital
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.hospital_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  Clinic
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.clinic_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  Shopping Mall
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.mall_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  Pharmacy
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.pharmacy_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  Police Station
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.police_station_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md">
                                <div className="text-gray-600 text-xs font-medium mb-2">
                                  Aerodrome
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {(data.aerodrome_distance_meters / 1000).toFixed(2)} km
                                </div>
                              </div>
                            </div>

                            {/* Property Location Map */}
                            {data.latitude && data.longitude && (
                                <div className="bg-white rounded-3xl p-8 shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Location Map
                                    </h3>
                                    <PropertyMap
                                        latitude={data.latitude}
                                        longitude={data.longitude}
                                        zoom={16}
                                        height="h-96"
                                        title={`${data.title} Location Map`}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right: CTA Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-3xl p-8 shadow-2xl sticky top-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Next Steps
                                    </h3>
                                    <p className="text-emerald-100 text-sm">
                                        This property was found via our reactive search. Verify details
                                        before proceeding.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                  

                                    <button
                                        onClick={handleShareProperty}
                                        className="w-full flex items-center justify-center gap-2 bg-white/20 text-white hover:bg-white/30 border border-white/40 px-6 py-3 rounded-xl font-semibold transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Property
                                    </button>
                                </div>

                                <div className="border-t border-white/20 pt-6">
                                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                                        <p className="text-xs text-white/80 mb-2">
                                            Listing added on:
                                        </p>
                                        <p className="text-sm font-semibold text-white">
                                            {new Date(data.added_on).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-xs text-white/80 mb-2">Last updated:</p>
                                        <p className="text-sm font-semibold text-white">
                                            {new Date(data.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNewSearch}
                                    className="w-full bg-emerald-100 text-[#4ea8a1] hover:bg-white px-6 py-3 rounded-xl font-semibold transition-colors"
                                >
                                    Search Something Else
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Info */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Property ID: {data.pid}
                        </p>
                        <p className="text-xs text-gray-500">
                            This property was dynamically scraped and analyzed. For verified
                            reports with detailed analytics, upgrade to a paid plan.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </Container>
    );
};

export default ReactiveSearchScreen;
