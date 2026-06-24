import {
  MapPin,
  Bed,
  Bath,
  ChevronRight,
  Building,
  Home,
} from "lucide-react";
import { KeyboardEvent } from "react";
import { SimpleDocumentUpload } from "./SimpleDocumentUpload";
import { SimplePhotoUpload } from "./SimplePhotoUpload";
import {
  DeclaredDocument,
  UploadedPhoto,
  DocumentType,
  PhotoLabel,
  PropertyFlowType,
} from "./types";
import { AddressAutocompleteSuggestion } from "@/api/pro-listings";

const LAGOS_LOCATIONS_BY_LGA: Record<string, string[]> = {
  "Ajeromi-Ifelodun": ["Ajegunle"],
  Alimosho: ["Abaranje", "Abesan", "Akesan", "Akowonjo", "Arida", "Ayobo", "Baruwa", "Boys Town", "College", "Council", "Dopemu", "Egbeda", "Egan", "Egbe / Ikotun/Igando", "Governors Road", "Idimu", "Igando / Ikotun/Igando", "Ijegun", "Ikotun / Ikotun/Igando", "Ipaja / Ipaja", "Ipaja Road", "Iseri Olofin", "Isheri / Egbe Idimu", "Iyana Ipaja", "Orisunbare", "Pap", "Pipeline", "Shasha"],
  Kosofe: ["Agboyi/Ketu", "GRA Phase 1", "GRA Phase 2 Shangisha", "Ketu-Alapere", "Ketu-Ikosi", "Kosofe / Kosofe", "Magodo Isheri", "Ogudu GRA"],
  Mushin: ["Challenge / Mushin", "Papa Ajao / Mushin"],
  "Oshodi-Isolo": ["Ago Palace", "Ajao Estate", "Bucknor", "Cele", "Ejigbo / Ejigbo", "Ife-Odan", "Ilawo", "Ire Akari", "Iyana Isolo", "Kogberegbe Street", "Mile 2", "Oke-Afa", "Okota", "Olla", "Orilowo", "Osolo Way"],
  Ojo: ["Ajangbadi", "Alaba", "Iba / Ojo", "Okokomaiko"],
  Ikorodu: ["Adamo", "Agbowa", "Agric", "Akute Ajuwon", "Apeka", "Ebute", "Erunwe", "Gberigbe", "Ibeshe / Ikorodu", "Igbogbo", "Ijede / Ikorodu", "Ikorodu Garage", "Ipakodo", "Isawo", "Isiu", "Ita Oluwo", "Jumofak"],
  Surulere: ["Abraham Adesanya", "Adelabu", "Adeniran Ogunsanya", "Aguda / Surulere", "Alaka Estate", "Alaka/Iponri", "Barracks", "Bode Thomas", "Coker", "Eric Moore", "Gbaja", "Idi Araba", "Ijesha", "Ijeshatedo", "Iponri", "Itire", "Kilo", "Lawanson", "Masha", "Ogunlana", "Ojuelegba", "Orile-Iganmu", "Papa Ajao / Surulere"],
  Agege: ["Agbotikuyo", "Capitol", "Cement", "Fagba", "Ifako", "Iju", "Iju-Ishaga", "LSDPC Estate", "Magbon", "Meiran", "Mulero", "New Oko Oba", "Oke-Odo", "Oko-Oba", "Pen Cinema"],
  "Ifako-Ijaiye": ["Agbado", "Alagbado", "Alakuko"],
  Somolu: ["Atunrase Medina", "Bariga / Shomolu", "Ifako-Gbagada", "Ikorodu Road / Shomolu", "Medina", "Millennium/UPS", "New Garage / Gbagada", "Oworonshoki / Gbagada", "Oworonshoki / Shomolu", "Pedro", "Phase 1 / Gbagada", "Phase 2 / Gbagada", "Soluyi"],
  "Amuwo-Odofin": ["Abule Ado", "Agboju", "Alakija", "Apple Junction", "Festac", "Green Estate", "Ibeshe / Amuwo-Odofin", "Satellite Town"],
  "Lagos Mainland": ["Sabo / Yaba", "Town Planning Way"],
  Ikeja: ["Adeniyi Jones", "Agidingbi", "Airport Road / Ikeja", "Alausa", "Allen Avenue", "Awolowo Way", "Balogun", "Computer Village", "Ikeja GRA", "Mangoro", "Mobolaji Bank Anthony Way", "Oba Akran", "Obafemi Awolowo Way", "Omole Phase 1", "Omole Phase 2", "Opebi", "Oregun", "Toyin Street", "Unity Road"],
  "Eti-Osa": ["1004", "2nd Avenue Extension", "Abacha Estate", "Abraham Adesanya Estate", "Ado / Ajah", "Ademola Adetokunbo", "Adeola Hopewell", "Adeola Odeku", "Ahmadu Bello Way", "Ajiwe", "Akin Adesola", "Akin Olugbade", "Awolowo Road", "Badore", "Banana Island", "Bonny Camp", "Bourdillon", "Canaan Estate", "Crown Estate", "Dolphin Estate", "Eden Garden Estate", "Gerard Road", "Graceland Estate", "Idowu Taylor", "Ikoyi S.W", "Ilaje / Lekki", "Karimu Kotun", "Kofo Abayomi", "Lekki Expressway", "Lekki Gardens Estate", "Lekki Phase 1", "Lekki Phase 2", "Ligali Ayorinde", "MacPherson", "Mosley Road", "Off Lekki-Epe Expressway", "Ogombo", "Oke Ira / Ajah", "Old Ikoyi", "Olokonla", "Osborne Foreshore Estate", "Parkview Estate", "Peninsula Estate", "Saka Tinubu", "Sanusi Fafunwa", "Sangotedo", "Thomas Estate", "Tiamiyu Savage", "Victoria Island Extension"],
  Badagry: ["Age Mowo", "Ajido", "Aradagun", "Badagry / Badagry", "Ilogbo Eremi", "Mafo", "Oko Afo"],
  Apapa: ["Apapa G.R.A", "Apapa Road", "Ijora", "Kirikiri", "Liverpool", "Olodi Apapa", "Snake Island", "Tin Can", "Trade Fair"],
  "Lagos Island": ["Eko Atlantic", "Lagos Island / Lagos Island"],
  Epe: ["Epe", "Epe Road"],
  "Ibeju-Lekki": ["Abijo", "Aiyeteju", "Akodo", "Awoyaya", "Bogije", "Eleko", "Elemoro", "Elerangbe", "Ibeju-Agbe", "Iberikodo", "Idi-Orogbo", "Igando-Oloja", "Lakowe", "Lekki Free Trade Zone", "Magbon-Alade", "Mopo-Ijebu Eputu", "Orimedu"],
};

const LAGOS_LGAS = [
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Kosofe",
  "Mushin",
  "Oshodi-Isolo",
  "Ojo",
  "Ikorodu",
  "Surulere",
  "Agege",
  "Ifako-Ijaiye",
  "Somolu",
  "Amuwo-Odofin",
  "Lagos Mainland",
  "Ikeja",
  "Eti-Osa",
  "Badagry",
  "Apapa",
  "Lagos Island",
  "Epe",
  "Ibeju-Lekki",
];

interface Phase1UploadProps {
  addressState: string;
  addressLga: string;
  addressCity: string;
  addressStreet: string;
  onAddressStateChange: (value: string) => void;
  onAddressLgaChange: (value: string) => void;
  onAddressCityChange: (value: string) => void;
  onAddressStreetChange: (value: string) => void;
  addressSuggestions: AddressAutocompleteSuggestion[];
  addressSuggestionsLoading: boolean;
  onAddressSuggestionSelect: (suggestion: AddressAutocompleteSuggestion) => void;
  onAddressSuggestionsDismiss: () => void;
  askingPrice: number;
  priceNegotiable: boolean;
  declaredDocuments: DeclaredDocument[];
  photos: UploadedPhoto[];
  errors: { [key: string]: string };
  propertyFlowType: PropertyFlowType;
  onPropertyFlowTypeChange: (type: PropertyFlowType) => void;

  onPriceChange: (value: number) => void;
  onPriceNegotiableChange: (value: boolean) => void;
  onDeclareDocument: (type: DocumentType) => void;
  onRemoveDeclaredDocument: (id: string) => void;
  onDocumentFileUpload: (declaredDocId: string, file: File) => void;
  onRemoveDocumentFile: (declaredDocId: string) => void;
  onPhotoUpload: (files: FileList | null) => void;
  onPhotoLabelChange: (photoId: string, label: PhotoLabel) => void;
  onPhotoRemove: (id: string) => void;
  bedrooms: number;
  bathrooms: number;
  amenities: string;
  onBedroomsChange: (value: number) => void;
  onBathroomsChange: (value: number) => void;
  onAmenitiesChange: (value: string) => void;
  onSubmit: () => void;
}

export function Phase1Upload({
  addressState,
  addressLga,
  addressCity,
  addressStreet,
  onAddressStateChange,
  onAddressLgaChange,
  onAddressCityChange,
  onAddressStreetChange,
  addressSuggestions,
  addressSuggestionsLoading,
  onAddressSuggestionSelect,
  onAddressSuggestionsDismiss,
  askingPrice,
  priceNegotiable,
  declaredDocuments,
  photos,
  errors,
  propertyFlowType,
  onPropertyFlowTypeChange,
  onPriceChange,
  onPriceNegotiableChange,
  onDeclareDocument,
  onRemoveDeclaredDocument,
  onDocumentFileUpload,
  onRemoveDocumentFile,
  onPhotoUpload,
  onPhotoLabelChange,
  onPhotoRemove,
  bedrooms,
  bathrooms,
  amenities,
  onBedroomsChange,
  onBathroomsChange,
  onAmenitiesChange,
  onSubmit,
}: Phase1UploadProps) {
  const availableAreas = addressLga
    ? (LAGOS_LOCATIONS_BY_LGA[addressLga] ?? []).slice().sort()
    : [];

  const handleStreetKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      onAddressSuggestionsDismiss();
      event.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-6">
      {/* Documents Upload - Simplified */}
      <SimpleDocumentUpload
        declaredDocuments={declaredDocuments}
        onDeclareDocument={onDeclareDocument}
        onRemoveDeclaredDocument={onRemoveDeclaredDocument}
        onDocumentFileUpload={onDocumentFileUpload}
        onRemoveDocumentFile={onRemoveDocumentFile}
        error={errors.documents}
      />

      {/* Photos Upload - Simplified */}
      <SimplePhotoUpload
        photos={photos}
        onPhotoUpload={onPhotoUpload}
        onPhotoLabelChange={onPhotoLabelChange}
        onPhotoRemove={onPhotoRemove}
        error={errors.photos}
        propertyType={propertyFlowType}
        onPropertyTypeChange={onPropertyFlowTypeChange}
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
              <option value="Abuja" disabled>
                Abuja (Coming Soon)
              </option>
              <option value="Port Harcourt" disabled>
                Port Harcourt (Coming Soon)
              </option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-gray-500">
              &#9660;
            </div>
          </div>

          {/* LGA Selection */}
          <div className="relative">
            <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={addressLga}
              onChange={(e) => onAddressLgaChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select LGA</option>
              {LAGOS_LGAS.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-gray-500">
              &#9660;
            </div>
          </div>

          {/* Area/Neighborhood Selection */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={addressCity}
              onChange={(e) => onAddressCityChange(e.target.value)}
              disabled={!addressLga}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">
                {addressLga ? "Select Area / Neighborhood" : "Select LGA first"}
              </option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-xs text-gray-500">
              &#9660;
            </div>
          </div>

          {/* Street Address */}
          <div className="relative">
            <Home className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={addressStreet}
              onChange={(e) => onAddressStreetChange(e.target.value)}
              onBlur={() => {
                window.setTimeout(() => onAddressSuggestionsDismiss(), 100);
              }}
              onKeyDown={handleStreetKeyDown}
              placeholder="Street Address (e.g., 123 Admiralty Way)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
            />
            {addressSuggestionsLoading && (
              <div className="mt-2 text-xs text-gray-500">Searching addresses...</div>
            )}
            {!addressSuggestionsLoading && addressSuggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {addressSuggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.resultId ?? suggestion.formatted}-${suggestion.street}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onAddressSuggestionSelect(suggestion);
                    }}
                    className="block w-full border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">{suggestion.street}</div>
                    <div className="mt-1 text-xs text-gray-500">{suggestion.formatted}</div>
                  </button>
                ))}
              </div>
            )}
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sans font-medium text-lg">
            &#8358;
          </span>
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
            &#8358;{askingPrice.toLocaleString()}
          </p>
        )}
        <label className="flex items-center gap-3 mt-3 cursor-pointer select-none w-fit">
          <div
            onClick={() => onPriceNegotiableChange(!priceNegotiable)}
            className={`relative w-10 h-5 rounded-full transition-colors ${priceNegotiable ? 'bg-[#4ea8a1]' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${priceNegotiable ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm text-gray-700">Price is negotiable</span>
        </label>
      </div>

      {/* Number of Bedrooms */}
      {propertyFlowType !== "land-only" && (
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
        </div>
      )}

      {/* Number of Bathrooms */}
      {propertyFlowType !== "land-only" && (
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
        </div>
      )}

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {propertyFlowType === "land-only" ? "5" : "7"}. Amenities & Features
        </label>
        <textarea
          value={amenities}
          onChange={(e) => onAmenitiesChange(e.target.value)}
          placeholder="e.g., Swimming pool, gated community, 24/7 security, fitted kitchen, near beach"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate items with commas. Used in the property report's amenities list
          and helps Inda decide what makes this property special.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Next:</strong> AI will analyze your uploads (takes ~60
          seconds)
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
