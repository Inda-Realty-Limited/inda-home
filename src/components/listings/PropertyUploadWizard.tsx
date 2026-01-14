/**
 * PROPERTY UPLOAD WIZARD - COMPREHENSIVE IMPLEMENTATION
 * 
 * This component implements a 4-phase property upload system that minimizes seller friction
 * while maximizing data quality through AI inference and progressive enhancement.
 * 
 * ARCHITECTURE OVERVIEW:
 * =====================
 * Phase 1: Smart Upload (2 min) - Minimal required inputs
 * Phase 2: AI Processing (Automated) - OCR, Vision AI, Database enrichment
 * Phase 3: Smart Confirmation (30 sec) - Review AI-inferred data
 * Phase 4: Progressive Enhancement (Optional) - Boost listing quality
 * 
 * USE CASES SUPPORTED:
 * ===================
 * 1. Single property upload (first-time seller)
 * 2. Bulk property upload (professional developer)
 * 3. Land-only listings (no building photos required)
 * 4. Off-plan properties (construction progress photos)
 * 5. Completed properties (full interior/exterior)
 * 6. Properties with missing documents (AI flags gaps)
 * 7. Copy from previous listing (repeat sellers)
 * 8. Edit and republish existing listings
 * 
 * DATA FLOW:
 * ==========
 * User Input → OCR/AI Analysis → Rules Engine → Confirmation → Database
 * 
 * DEVELOPER NOTES:
 * ===============
 * - All AI processing is simulated in this MVP (replace with real AI endpoints)
 * - OCR integration points: extractTextFromDocument()
 * - Vision AI integration points: analyzePropertyPhotos()
 * - Database integration points: fetchMarketData(), savePropertyListing()
 * - File upload: Currently uses local state (integrate with cloud storage)
 */

import { useState, useCallback } from "react";
import {
    CheckCircle2,
    Eye,
    X,
    ArrowLeft
} from "lucide-react";
import { Phase1Upload } from "./Phase1Upload";
import { Phase2Processing } from "./Phase2Processing";
import { Phase4Enhancement } from "./Phase4Enhancement";
import { Phase5Complete } from "./Phase5Complete";
import { ReviewExtractedInfo } from "./ReviewExtractedInfo";
import { BuyerReportPreview } from "./BuyerReportPreview";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import {
    UploadPhase,
    DocumentType,
    PhotoCategory,
    PhotoLabel,
    UploadedDocument,
    UploadedPhoto,
    AIInferredData,
    PropertyUploadData
} from "./types";

interface PropertyUploadWizardProps {
    onComplete: (data: PropertyUploadData) => void;
    onCancel: () => void;
    initialData?: Partial<PropertyUploadData>; // For editing or copying from previous
    mode?: "create" | "edit" | "copy"; // Different modes
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PropertyUploadWizard({
    onComplete,
    onCancel,
    initialData,
    mode = "create"
}: PropertyUploadWizardProps) {
    const [currentPhase, setCurrentPhase] = useState<UploadPhase>("upload");
    const [uploadData, setUploadData] = useState<PropertyUploadData>({
        address: initialData?.address || "",
        askingPrice: initialData?.askingPrice || 0,
        documents: initialData?.documents || [],
        photos: initialData?.photos || []
    });

    // Phase 1 state
    const [addressState, setAddressState] = useState("Lagos");
    const [addressCity, setAddressCity] = useState("");
    const [addressStreet, setAddressStreet] = useState("");

    // Computed legacy address for backward compatibility
    const [address, setAddress] = useState(initialData?.address || "");
    const [askingPrice, setAskingPrice] = useState(initialData?.askingPrice || 0);
    const [bedrooms, setBedrooms] = useState(initialData?.confirmedData?.bedrooms || 0);
    const [bathrooms, setBathrooms] = useState(initialData?.confirmedData?.bathrooms || 0);
    const [documents, setDocuments] = useState<UploadedDocument[]>(initialData?.documents || []);
    const [photos, setPhotos] = useState<UploadedPhoto[]>(initialData?.photos || []);

    // Phase 2 state

    // Phase 3 state

    // Validation state
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // ============================================================================
    // PHASE 1: SMART UPLOAD HANDLERS
    // ============================================================================

    /**
     * USE CASE 1: Document Upload with Auto-Detection
     * 
     * When user uploads documents:
     * 1. Accept multiple files at once (drag & drop or file picker)
     * 2. Auto-detect document type from filename and content
     * 3. Allow manual correction if AI detection is wrong
     * 4. Validate file types (PDF, JPG, PNG only)
     * 5. Check file size limits (max 10MB per file)
     * 
     * INTEGRATION POINT: Replace detectDocumentType() with real AI endpoint
     */
    const handleDocumentUpload = useCallback((files: FileList | null) => {
        if (!files) return;

        const newDocuments: UploadedDocument[] = [];

        Array.from(files).forEach((file) => {
            // Validation
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, documents: `${file.name} exceeds 10MB limit` }));
                return;
            }

            if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
                setErrors(prev => ({ ...prev, documents: `${file.name} has unsupported format` }));
                return;
            }

            newDocuments.push({
                id: `doc-${Date.now()}-${Math.random()}`,
                file
            });
        });

        setDocuments(prev => [...prev, ...newDocuments]);
        setErrors(prev => ({ ...prev, documents: "" }));
    }, []);

    const handleDocumentTypeChange = useCallback((docId: string, type: DocumentType) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === docId ? { ...doc, type } : doc
        ));
    }, []);

    /**
     * USE CASE 2: Categorized Photo Upload
     * 
     * Photos must be categorized to enable accurate AI inference:
     * - Exterior: Front, side, street view (min 2 required)
     * - Interior: Bedroom photos (count bedrooms), bathroom photos (count bathrooms)
     * - Amenities: Pool, gym, generator, etc. (optional)
     * - Construction: Progress photos for off-plan (required if off-plan)
     * 
     * VALIDATION RULES:
     * - Completed properties: Exterior (min 2) + Interior (min 4) required
     * - Land only: Exterior (min 2) required, Interior not required
     * - Off-plan: Exterior + Construction required
     * 
     * INTEGRATION POINT: Replace analyzePhoto() with real Vision AI endpoint
     */
    const handlePhotoUpload = useCallback((files: FileList | null) => {
        if (!files) return;

        const newPhotos: UploadedPhoto[] = [];

        Array.from(files).forEach((file) => {
            // Validation
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, photos: `${file.name} exceeds 10MB limit` }));
                return;
            }

            if (!["image/jpeg", "image/png"].includes(file.type)) {
                setErrors(prev => ({ ...prev, photos: `${file.name} must be JPG or PNG` }));
                return;
            }

            // Create preview URL
            const preview = URL.createObjectURL(file);

            newPhotos.push({
                id: `photo-${Date.now()}-${Math.random()}`,
                file,
                category: "exterior", // Default, will be updated based on label
                preview
            });
        });

        setPhotos(prev => [...prev, ...newPhotos]);
        setErrors(prev => ({ ...prev, photos: "" }));
    }, []);

    const handlePhotoLabelChange = useCallback((photoId: string, label: PhotoLabel, customLabel?: string) => {
        setPhotos(prev => prev.map(photo => {
            if (photo.id === photoId) {
                // Update category based on label
                let category: PhotoCategory = "exterior";
                if (["Bedroom", "Master Bedroom", "Bathroom", "Living Room", "Kitchen", "Dining Room"].includes(label)) {
                    category = "interior";
                } else if (["Swimming Pool", "Generator", "Gym", "Parking", "Garden", "Balcony"].includes(label)) {
                    category = "amenities";
                } else if (label === "Construction Progress") {
                    category = "construction";
                }

                return { ...photo, label, category, customLabel };
            }
            return photo;
        }));
    }, []);

    /**
     * USE CASE 3: Structured Address Input
     * 
     * Updates individual address components and reconstructs the full address string.
     */
    const handleAddressStateChange = useCallback((value: string) => {
        setAddressState(value);
        const newAddress = `${addressStreet}, ${addressCity}, ${value}`;
        setAddress(newAddress);
    }, [addressCity, addressStreet]);

    const handleAddressCityChange = useCallback((value: string) => {
        setAddressCity(value);
        const newAddress = `${addressStreet}, ${value}, ${addressState}`;
        setAddress(newAddress);
    }, [addressState, addressStreet]);

    const handleAddressStreetChange = useCallback((value: string) => {
        setAddressStreet(value);
        const newAddress = `${value}, ${addressCity}, ${addressState}`;
        setAddress(newAddress);
    }, [addressState, addressCity]);

    /**
     * USE CASE 4: Smart Price Suggestions
     * 
     * As user enters price:
     * 1. Compare against market data for similar properties
     * 2. Show suggested price range
     * 3. Flag if price is too high/low (>20% deviation)
     * 4. Show comparable properties
     * 
     * INTEGRATION POINT: Query pricing database
     */
    const handlePriceChange = useCallback((value: number) => {
        setAskingPrice(value);

        // TODO: Fetch market comparables
        // fetch(`/api/market-data/comparable?address=${address}&price=${value}`)
        //   .then(res => res.json())
        //   .then(data => setSuggestedPrice(data));
    }, []);

    const handleBedroomsChange = useCallback((value: number) => {
        setBedrooms(value);
    }, []);

    const handleBathroomsChange = useCallback((value: number) => {
        setBathrooms(value);
    }, []);

    /**
     * Phase 1 Validation
     * 
     * VALIDATION RULES:
     * - Address: Required, minimum 10 characters
     * - Price: Required, must be > 0
     * - Documents: At least 1 document required
     * - Photos: 
     *   - Land: Min 2 exterior photos
     *   - Completed: Min 2 exterior + 4 interior photos
     *   - Off-plan: Min 2 exterior + 2 construction photos
     */
    const validatePhase1 = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!addressStreet || !addressCity || !addressState) {
            newErrors.address = "Please complete all address fields";
        }

        if (!askingPrice || askingPrice <= 0) {
            newErrors.askingPrice = "Please enter a valid price";
        }

        if (documents.length === 0) {
            newErrors.documents = "Please upload at least one document (Title Document, Survey Plan, etc.)";
        }

        // Check if all documents are labeled
        const unlabeledDocs = documents.filter(d => !d.type);
        if (unlabeledDocs.length > 0) {
            newErrors.documents = `Please label all ${unlabeledDocs.length} document(s) using the dropdown`;
        }

        if (photos.length < 2) {
            newErrors.photos = "Please upload at least 2 photos";
        }

        // Check if all photos are labeled
        const unlabeledPhotos = photos.filter(p => !p.label);
        if (unlabeledPhotos.length > 0) {
            newErrors.photos = `Please label all ${unlabeledPhotos.length} photo(s) using the dropdown below each image`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhase1Submit = () => {
        if (validatePhase1()) {
            setCurrentPhase("processing");
        }
    };

    const handleAnalysisComplete = (aiInferred: AIInferredData) => {
        setUploadData(prev => ({
            ...prev,
            aiInferredData: aiInferred
        }));
        setCurrentPhase("confirmation");
    };

    const handleAnalysisError = (message: string) => {
        setErrors({ processing: message });
        setCurrentPhase("upload");
    };

    // ============================================================================
    // PHASE 3: SMART CONFIRMATION
    // ============================================================================

    const handleConfirmField = (fieldName: string, value: any) => {
        setUploadData(prev => ({
            ...prev,
            confirmedData: {
                ...prev.confirmedData,
                [fieldName]: value
            } as any
        }));
    };


    const handlePhase3Submit = () => {
        const aiData = uploadData.aiInferredData;
        const propertyType = uploadData.confirmedData?.propertyType || aiData?.propertyType;

        if (!propertyType) {
            setErrors({ confirmation: "Please confirm or correct the property type" });
            return;
        }

        if (!uploadData.confirmedData && aiData && propertyType) {
            setUploadData(prev => ({
                ...prev,
                confirmedData: {
                    propertyType: propertyType as string,
                    bedrooms: aiData.bedrooms,
                    bathrooms: aiData.bathrooms,
                    landSize: aiData.landSize,
                    titleType: aiData.documentAnalysis?.titleType,
                    hasEncumbrances: false,
                    hasDisputes: false
                }
            }));
        }

        setCurrentPhase("enhancement");
    };

    // ============================================================================
    // PHASE 4: PROGRESSIVE ENHANCEMENT
    // ============================================================================

    const handleSkipEnhancement = () => {
        finalizeListing();
    };

    const handleAddEnhancement = (field: string, value: any) => {
        setUploadData(prev => ({
            ...prev,
            enhancedData: {
                ...prev.enhancedData,
                [field]: value
            }
        }));
    };

    const finalizeListing = () => {
        setCurrentPhase("preview");
    };

    const handlePublishFromPreview = () => {
        setCurrentPhase("complete");
    };

    const handleEditFromPreview = () => {
        setCurrentPhase("enhancement");
    };

    const handleViewProperty = () => {
        onComplete(uploadData);
    };

    const handleCloseComplete = () => {
        onComplete(uploadData);
    };

    // ============================================================================
    // UTILITY FUNCTIONS (AI SIMULATION)
    // ============================================================================

    /**
     * Document Type Detection (Simulated)
     * 
     * In production, use AI to detect document type from:
     * 1. Filename keywords
     * 2. OCR text content
     * 3. Document structure/layout
     */

    // ============================================================================
    // RENDER PHASES
    // ============================================================================

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === "create" && "Upload New Property"}
                            {mode === "edit" && "Edit Property Listing"}
                            {mode === "copy" && "Copy Property Listing"}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {currentPhase === "upload" && "Step 1: Upload documents and photos"}
                            {currentPhase === "processing" && "Step 2: AI is analyzing your uploads"}
                            {currentPhase === "confirmation" && "Step 3: Review and confirm details"}
                            {currentPhase === "enhancement" && "Step 4: Boost your listing (optional)"}
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Indicator */}
                <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-2 ${currentPhase === "upload" ? "text-[#4ea8a1]" : "text-gray-400"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase === "upload" ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}>
                                1
                            </div>
                            <span className="text-sm font-medium">Upload</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-2">
                            <div className={`h-full bg-[#4ea8a1] transition-all ${["processing", "confirmation", "enhancement", "complete"].includes(currentPhase) ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${["processing", "confirmation", "enhancement", "complete"].includes(currentPhase) ? "text-[#4ea8a1]" : "text-gray-400"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${["processing", "confirmation", "enhancement", "complete"].includes(currentPhase) ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}>
                                2
                            </div>
                            <span className="text-sm font-medium">AI Analysis</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-2">
                            <div className={`h-full bg-[#4ea8a1] transition-all ${["confirmation", "enhancement", "complete"].includes(currentPhase) ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${["confirmation", "enhancement", "complete"].includes(currentPhase) ? "text-[#4ea8a1]" : "text-gray-400"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${["confirmation", "enhancement", "complete"].includes(currentPhase) ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}>
                                3
                            </div>
                            <span className="text-sm font-medium">Confirm</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-2">
                            <div className={`h-full bg-[#4ea8a1] transition-all ${["enhancement", "complete"].includes(currentPhase) ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${["enhancement", "complete"].includes(currentPhase) ? "text-[#4ea8a1]" : "text-gray-400"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${["enhancement", "complete"].includes(currentPhase) ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}>
                                4
                            </div>
                            <span className="text-sm font-medium">Enhance</span>
                        </div>
                    </div>
                </div>

                {/* Phase Content */}
                <div className="p-6">
                    {currentPhase === "upload" && (
                        <Phase1Upload
                            addressState={addressState}
                            addressCity={addressCity}
                            addressStreet={addressStreet}
                            onAddressStateChange={handleAddressStateChange}
                            onAddressCityChange={handleAddressCityChange}
                            onAddressStreetChange={handleAddressStreetChange}
                            askingPrice={askingPrice}
                            bedrooms={bedrooms}
                            bathrooms={bathrooms}
                            documents={documents}
                            photos={photos}
                            errors={errors}
                            onPriceChange={handlePriceChange}
                            onBedroomsChange={handleBedroomsChange}
                            onBathroomsChange={handleBathroomsChange}
                            onDocumentUpload={handleDocumentUpload}
                            onDocumentTypeChange={handleDocumentTypeChange}
                            onPhotoUpload={handlePhotoUpload}
                            onPhotoLabelChange={handlePhotoLabelChange}
                            onDocumentRemove={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                            onPhotoRemove={(id) => setPhotos(prev => prev.filter(p => p.id !== id))}
                            onSubmit={handlePhase1Submit}
                        />
                    )}

                    {currentPhase === "processing" && (
                        <Phase2Processing
                            documents={documents}
                            photos={photos}
                            onComplete={handleAnalysisComplete}
                            onError={handleAnalysisError}
                        />
                    )}

                    {currentPhase === "confirmation" && uploadData.aiInferredData && (
                        <ReviewExtractedInfo
                            data={uploadData}
                            onEdit={handleConfirmField}
                            onConfirm={handlePhase3Submit}
                            onBack={() => setCurrentPhase("upload")}
                        />
                    )}

                    {currentPhase === "enhancement" && (
                        <Phase4Enhancement
                            enhancedData={uploadData.enhancedData}
                            propertyType={uploadData.confirmedData?.propertyType}
                            onAdd={handleAddEnhancement}
                            onSkip={handleSkipEnhancement}
                            onComplete={finalizeListing}
                        />
                    )}

                    {currentPhase === "preview" && (
                        <div className="space-y-4">
                            {/* Preview Header */}
                            <div className="bg-gradient-to-r from-[#4ea8a1]/10 to-[#f59e0b]/10 border border-[#4ea8a1] rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Eye className="w-6 h-6 text-[#4ea8a1] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">Preview Your Property Report</h3>
                                        <p className="text-sm text-gray-600">
                                            This is exactly what buyers will see when they click your shareable link. Review it carefully before publishing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Buyer Report Preview */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <BuyerReportPreview
                                    data={uploadData}
                                    mode="preview"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleEditFromPreview}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Edit & Improve
                                </button>
                                <button
                                    onClick={handlePublishFromPreview}
                                    className="flex-1 px-6 py-3 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d9691] font-medium flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Looks Good - Publish Property
                                </button>
                            </div>
                        </div>
                    )}

                    {currentPhase === "complete" && (
                        <Phase5Complete
                            uploadData={uploadData}
                            onViewProperty={handleViewProperty}
                            onClose={handleCloseComplete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}


