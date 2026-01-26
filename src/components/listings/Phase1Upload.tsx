import { MapPin, Bed, Bath, ChevronRight, Building, Home } from "lucide-react";
import { SimpleDocumentUpload } from "./SimpleDocumentUpload";
import { SimplePhotoUpload } from "./SimplePhotoUpload";
import {
    UploadedDocument,
    UploadedPhoto,
    DocumentType,
    PhotoLabel
} from "./types";

const LAGOS_CITIES = [
    "Abule Egba", "Agege", "Ajah", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry",
    "Bariga", "Egbe Idimu", "Ejigbo", "Epe", "Gbagada", "Ibeju Lekki", "Iju",
    "Ikeja", "Ikorodu", "Ikotun Igando", "Ikoyi", "Ilupeju", "Ipaja", "Isolo",
    "Ketu", "Kosofe Ikosi", "Lagos Island", "Lekki", "Maryland", "Mushin",
    "Ogba", "Ogudu", "Ojo", "Ojodu", "Ojota", "Okota", "Orile", "Oshodi",
    "Sangotedo", "Shomolu", "Surulere", "Victoria Island", "Yaba"
].sort();

interface Phase1UploadProps {
    addressState: string;
    addressCity: string;
    addressStreet: string;
    onAddressStateChange: (value: string) => void;
    onAddressCityChange: (value: string) => void;
    onAddressStreetChange: (value: string) => void;
    askingPrice: number;
    documents: UploadedDocument[];
    photos: UploadedPhoto[];
    errors: { [key: string]: string };

    onPriceChange: (value: number) => void;
    onDocumentUpload: (files: FileList | null) => void;
    onDocumentTypeChange: (docId: string, type: DocumentType) => void;
    onPhotoUpload: (files: FileList | null) => void;
    onPhotoLabelChange: (photoId: string, label: PhotoLabel) => void;
    onDocumentRemove: (id: string) => void;
    onPhotoRemove: (id: string) => void;
    bedrooms: number;
    bathrooms: number;
    onBedroomsChange: (value: number) => void;
    onBathroomsChange: (value: number) => void;
    onSubmit: () => void;
}

export function Phase1Upload({
    addressState,
    addressCity,
    addressStreet,
    onAddressStateChange,
    onAddressCityChange,
    onAddressStreetChange,
    askingPrice,
    documents,
    photos,
    errors,
    onPriceChange,
    onDocumentUpload,
    onDocumentTypeChange,
    onPhotoUpload,
    onPhotoLabelChange,
    onDocumentRemove,
    onPhotoRemove,
    bedrooms,
    bathrooms,
    onBedroomsChange,
    onBathroomsChange,
    onSubmit
}: Phase1UploadProps) {

    return (
        <div className="space-y-6">
            {/* Documents Upload - Simplified */}
            <SimpleDocumentUpload
                documents={documents}
                onDocumentUpload={onDocumentUpload}
                onDocumentTypeChange={onDocumentTypeChange}
                onDocumentRemove={onDocumentRemove}
                error={errors.documents}
            />

            {/* Photos Upload - Simplified */}
            <SimplePhotoUpload
                photos={photos}
                onPhotoUpload={onPhotoUpload}
                onPhotoLabelChange={onPhotoLabelChange}
                onPhotoRemove={onPhotoRemove}
                error={errors.photos}
            />

            {/* Property Address */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    3. Property Address <span className="text-red-500">*</span>
                </label>

                <div className="space-y-4">
                    {/* State Selection */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                            value={addressState}
                            onChange={(e) => onAddressStateChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                        >
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja" disabled>Abuja (Coming Soon)</option>
                            <option value="Port Harcourt" disabled>Port Harcourt (Coming Soon)</option>
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-gray-500">
                            ▼
                        </div>
                    </div>

                    {/* City/Area Selection */}
                    <div className="relative">
                        <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                            value={addressCity}
                            onChange={(e) => onAddressCityChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">Select City / Area</option>
                            {LAGOS_CITIES.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-gray-500">
                            ▼
                        </div>
                    </div>

                    {/* Street Address */}
                    <div className="relative">
                        <Home className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={addressStreet}
                            onChange={(e) => onAddressStreetChange(e.target.value)}
                            placeholder="Street Address (e.g., 123 Admiralty Way)"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                        />
                    </div>
                </div>

                {errors.address && (
                    <p className="text-sm text-red-600 mt-2">{errors.address}</p>
                )}
            </div>

            {/* Asking Price */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    4. Asking Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sans font-medium text-lg">₦</span>
                    <input
                        type="number"
                        value={askingPrice || ""}
                        onChange={(e) => onPriceChange(Number(e.target.value))}
                        placeholder="Enter price in Naira"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                    />
                </div>
                {errors.askingPrice && (
                    <p className="text-sm text-red-600 mt-2">{errors.askingPrice}</p>
                )}
                {askingPrice > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                        ₦{askingPrice.toLocaleString()}
                    </p>
                )}
            </div>

            {/* Number of Bedrooms */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    5. Number of Bedrooms <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="number"
                        min="0"
                        value={bedrooms || ""}
                        onChange={(e) => onBedroomsChange(Number(e.target.value))}
                        placeholder="e.g., 4"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter 0 for land only</p>
            </div>

            {/* Number of Bathrooms */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    6. Number of Bathrooms <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="number"
                        min="0"
                        value={bathrooms || ""}
                        onChange={(e) => onBathroomsChange(Number(e.target.value))}
                        placeholder="e.g., 5"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter 0 for land only</p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    <strong>Next:</strong> AI will analyze your uploads (takes ~60 seconds)
                </p>
                <button
                    onClick={onSubmit}
                    className="px-6 py-3 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d9691] font-medium flex items-center gap-2"
                >
                    Continue to AI Analysis
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
