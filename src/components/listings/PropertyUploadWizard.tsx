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
import { useRouter } from "next/router";
import {
  CheckCircle2,
  Eye,
  X,
  ArrowLeft,
  AlertTriangle,
  Info,
  Save,
  Loader2,
} from "lucide-react";
import { Phase1Upload } from "./Phase1Upload";
import { Phase2Processing } from "./Phase2Processing";
import { Phase4Enhancement } from "./Phase4Enhancement";
import { Phase5Complete } from "./Phase5Complete";
import { ReviewExtractedInfo } from "./ReviewExtractedInfo";
import { BuyerReportPreview } from "./BuyerReportPreview";
import { ProListingsService } from "@/api/pro-listings";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import {
  UploadPhase,
  DocumentType,
  PhotoCategory,
  PhotoLabel,
  DeclaredDocument,
  UploadedDocument,
  UploadedPhoto,
  AIInferredData,
  PropertyUploadData,
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
  mode = "create",
}: PropertyUploadWizardProps) {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<UploadPhase>("upload");
  const [uploadData, setUploadData] = useState<PropertyUploadData>({
    address: initialData?.address || "",
    askingPrice: initialData?.askingPrice || 0,
    documents: initialData?.documents || [],
    declaredDocuments: initialData?.declaredDocuments || [],
    photos: initialData?.photos || [],
  });

  // Phase 1 state
  const [addressState, setAddressState] = useState("Lagos");
  const [addressCity, setAddressCity] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [propertyFlowType, setPropertyFlowType] = useState<
    "completed" | "off-plan" | "land-only"
  >("completed");

  // Computed legacy address for backward compatibility
  const [address, setAddress] = useState(initialData?.address || "");
  const [askingPrice, setAskingPrice] = useState(initialData?.askingPrice || 0);
  const [bedrooms, setBedrooms] = useState(
    initialData?.confirmedData?.bedrooms || 0,
  );
  const [bathrooms, setBathrooms] = useState(
    initialData?.confirmedData?.bathrooms || 0,
  );
  const [declaredDocuments, setDeclaredDocuments] = useState<
    DeclaredDocument[]
  >(initialData?.declaredDocuments || []);
  const [photos, setPhotos] = useState<UploadedPhoto[]>(
    initialData?.photos || [],
  );

  // Phase 2 state

  // Phase 3 state

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedListingId, setSavedListingId] = useState<string | null>(null);
  const [savedListing, setSavedListing] = useState<any>(null);

  // Listing limit state
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{
    limit: number;
    plan: string;
  } | null>(null);

  // Price warning state
  const [priceWarning, setPriceWarning] = useState<string | null>(null);

  // Location intelligence warning state
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  // ============================================================================
  // PHASE 1: SMART UPLOAD HANDLERS
  // ============================================================================

  /**
   * USE CASE 1: Declare Document Types & Optional File Upload
   *
   * User declares which document types the property has (required),
   * then optionally uploads the actual files for verification.
   */
  const handleDeclareDocument = useCallback((type: DocumentType) => {
    const newDoc: DeclaredDocument = {
      id: `doc-${Date.now()}-${Math.random()}`,
      type,
      uploaded: false,
    };
    setDeclaredDocuments((prev) => [...prev, newDoc]);
    setErrors((prev) => ({ ...prev, documents: "" }));
  }, []);

  const handleRemoveDeclaredDocument = useCallback((id: string) => {
    setDeclaredDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleDocumentFileUpload = useCallback(
    (declaredDocId: string, file: File) => {
      setDeclaredDocuments((prev) =>
        prev.map((doc) =>
          doc.id === declaredDocId ? { ...doc, uploaded: true, file } : doc,
        ),
      );
    },
    [],
  );

  const handleRemoveDocumentFile = useCallback((declaredDocId: string) => {
    setDeclaredDocuments((prev) =>
      prev.map((doc) =>
        doc.id === declaredDocId
          ? { ...doc, uploaded: false, file: undefined }
          : doc,
      ),
    );
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
        setErrors((prev) => ({
          ...prev,
          photos: `${file.name} exceeds 10MB limit`,
        }));
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photos: `${file.name} must be JPG or PNG`,
        }));
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      newPhotos.push({
        id: `photo-${Date.now()}-${Math.random()}`,
        file,
        category: "exterior", // Default, will be updated based on label
        preview,
      });
    });

    setPhotos((prev) => [...prev, ...newPhotos]);
    setErrors((prev) => ({ ...prev, photos: "" }));
  }, []);

  const handlePhotoLabelChange = useCallback(
    (photoId: string, label: PhotoLabel, customLabel?: string) => {
      setPhotos((prev) =>
        prev.map((photo) => {
          if (photo.id === photoId) {
            // Update category based on label
            let category: PhotoCategory = "exterior";
            if (
              [
                "Bedroom",
                "Master Bedroom",
                "Bathroom",
                "Living Room",
                "Kitchen",
                "Dining Room",
              ].includes(label)
            ) {
              category = "interior";
            } else if (
              [
                "Swimming Pool",
                "Generator",
                "Gym",
                "Parking",
                "Garden",
                "Balcony",
              ].includes(label)
            ) {
              category = "amenities";
            } else if (label === "Construction Progress") {
              category = "construction";
            }

            return { ...photo, label, category, customLabel };
          }
          return photo;
        }),
      );
    },
    [],
  );

  /**
   * USE CASE 3: Structured Address Input
   *
   * Updates individual address components and reconstructs the full address string.
   */
  const handleAddressStateChange = useCallback(
    (value: string) => {
      setAddressState(value);
      const newAddress = `${addressStreet}, ${addressCity}, ${value}`;
      setAddress(newAddress);
    },
    [addressCity, addressStreet],
  );

  const handleAddressCityChange = useCallback(
    (value: string) => {
      setAddressCity(value);
      const newAddress = `${addressStreet}, ${value}, ${addressState}`;
      setAddress(newAddress);
    },
    [addressState, addressStreet],
  );

  const handleAddressStreetChange = useCallback(
    (value: string) => {
      setAddressStreet(value);
      const newAddress = `${value}, ${addressCity}, ${addressState}`;
      setAddress(newAddress);
    },
    [addressState, addressCity],
  );

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

    // Check for suspiciously round prices (exact millions >= 10M)
    if (value >= 10_000_000 && value % 1_000_000 === 0) {
      setPriceWarning(
        "Round prices may seem less credible. Consider a specific price like ₦52,500,000 instead of ₦50,000,000",
      );
    } else {
      setPriceWarning(null);
    }

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

  const handlePropertyFlowTypeChange = useCallback(
    (type: "completed" | "off-plan" | "land-only") => {
      setPropertyFlowType(type);
      // Auto-set bedrooms/bathrooms to 0 for land-only
      if (type === "land-only") {
        setBedrooms(0);
        setBathrooms(0);
      }
    },
    [],
  );

  /**
   * Phase 1 Validation
   *
   * VALIDATION RULES:
   * - Address: Required, street min 5 characters, blacklist check
   * - Price: Required, ₦1M - ₦10B range
   * - Documents: At least 2 documents, Title Doc or Survey Plan required
   * - Photos: At least 3 photos, contextual validation by property type
   */
  const validatePhase1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // ADDRESS VALIDATION
    if (!addressStreet || !addressCity || !addressState) {
      newErrors.address = "Please complete all address fields";
    } else if (addressStreet.trim().length < 5) {
      newErrors.address = "Street address must be at least 5 characters";
    } else {
      // Blacklist check (excluding "123" as requested)
      const blacklistTerms = ["tbd", "n/a", "test", "xxx", "asdf", "sample"];
      const streetLower = addressStreet.toLowerCase().trim();
      if (
        blacklistTerms.some(
          (term) => streetLower === term || streetLower.includes(term),
        )
      ) {
        newErrors.address = "Please enter a valid street address";
      }
    }

    // PRICE VALIDATION
    const MIN_PRICE = 1_000_000; // ₦1M
    const MAX_PRICE = 10_000_000_000; // ₦10B
    if (!askingPrice || askingPrice <= 0) {
      newErrors.askingPrice = "Please enter a valid price";
    } else if (askingPrice < MIN_PRICE) {
      newErrors.askingPrice = `Minimum price is ₦${MIN_PRICE.toLocaleString()}`;
    } else if (askingPrice > MAX_PRICE) {
      newErrors.askingPrice = `Maximum price is ₦${MAX_PRICE.toLocaleString()}`;
    }

    // DOCUMENT TYPE DECLARATION VALIDATION (file upload is optional)
    if (declaredDocuments.length === 0) {
      newErrors.documents =
        "Please select at least one document type that this property has";
    } else {
      // Check for Title Document OR Survey Plan among declared types
      const hasTitleDoc = declaredDocuments.some(
        (d) => d.type === "Title Document (C of O, Deed, etc.)",
      );
      const hasSurveyPlan = declaredDocuments.some(
        (d) => d.type === "Survey Plan",
      );
      if (!hasTitleDoc && !hasSurveyPlan) {
        newErrors.documents =
          "Please declare at least a Title Document or Survey Plan";
      }
    }

    // PHOTO VALIDATION
    if (photos.length < 3) {
      newErrors.photos = "Please upload at least 3 photos";
    } else {
      // Check if all photos are labeled
      const unlabeledPhotos = photos.filter((p) => !p.label);
      if (unlabeledPhotos.length > 0) {
        newErrors.photos = `Please label all ${unlabeledPhotos.length} photo(s) using the dropdown below each image`;
      } else {
        // CONTEXTUAL VALIDATION BY PROPERTY TYPE
        const exteriorLabels = [
          "Exterior Front",
          "Exterior Back",
          "Exterior Side",
          "Street View",
          "Estate/Development View",
          "Neighborhood",
          "Access Road",
          "Compound Entrance",
        ];
        const interiorLabels = [
          "Bedroom",
          "Master Bedroom",
          "Bathroom",
          "Living Room",
          "Kitchen",
          "Dining Room",
        ];
        const constructionLabels = ["Construction Progress"];
        const landLabels = ["Land/Plot", "Site Plan"];

        const exteriorPhotos = photos.filter(
          (p) => p.label && exteriorLabels.includes(p.label),
        );
        const interiorPhotos = photos.filter(
          (p) => p.label && interiorLabels.includes(p.label),
        );
        const constructionPhotos = photos.filter(
          (p) => p.label && constructionLabels.includes(p.label),
        );
        const landPhotos = photos.filter(
          (p) => p.label && landLabels.includes(p.label),
        );

        if (propertyFlowType === "completed") {
          if (exteriorPhotos.length < 2) {
            newErrors.photos =
              "Completed properties require at least 2 exterior photos";
          } else if (interiorPhotos.length < 4) {
            newErrors.photos =
              "Completed properties require at least 4 interior photos (bedrooms, bathrooms, living areas)";
          }
        } else if (propertyFlowType === "off-plan") {
          if (constructionPhotos.length < 1) {
            newErrors.photos =
              "Off-plan properties require at least 1 construction progress photo";
          }
        } else if (propertyFlowType === "land-only") {
          if (landPhotos.length < 2 && exteriorPhotos.length < 2) {
            newErrors.photos =
              "Land listings require at least 2 photos of the land/plot";
          }
          // Warn about survey plan for land
          const hasSurveyPlan = declaredDocuments.some(
            (d) => d.type === "Survey Plan",
          );
          if (!hasSurveyPlan && !newErrors.documents) {
            newErrors.documents =
              "Survey Plan is strongly recommended for land listings";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhase1Submit = () => {
    if (validatePhase1()) {
      // Sync the entered address and price to uploadData before proceeding
      setUploadData((prev) => ({
        ...prev,
        address: address,
        askingPrice: askingPrice,
      }));
      setCurrentPhase("processing");
    }
  };

  const handleAnalysisComplete = (aiInferred: AIInferredData) => {
    setUploadData((prev) => ({
      ...prev,
      aiInferredData: aiInferred,
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
    setUploadData((prev) => ({
      ...prev,
      confirmedData: {
        ...prev.confirmedData,
        [fieldName]: value,
      } as any,
    }));
  };

  const handlePhase3Submit = async () => {
    const aiData = uploadData.aiInferredData;
    const propertyType =
      uploadData.confirmedData?.propertyType || aiData?.propertyType;

    if (!propertyType) {
      setErrors({
        confirmation: "Please confirm or correct the property type",
      });
      return;
    }

    // Update confirmed data if not already set
    const confirmedData = uploadData.confirmedData || {
      propertyType: propertyType as string,
      bedrooms: bedrooms || aiData?.bedrooms || 0,
      bathrooms: bathrooms || aiData?.bathrooms || 0,
      landSize: aiData?.landSize,
      titleType: aiData?.documentAnalysis?.titleType,
      hasEncumbrances: false,
      hasDisputes: false,
    };

    setUploadData((prev) => ({
      ...prev,
      confirmedData,
    }));

    // Save listing to backend
    setIsSaving(true);
    setErrors({});

    try {
      const formData = new FormData();

      // Add basic listing data
      formData.append(
        "title",
        `${confirmedData.bedrooms || ""}${propertyType} in ${addressCity}`,
      );
      formData.append("propertyType", propertyType);
      formData.append("microlocation", addressCity);
      formData.append("purchasePrice", askingPrice.toString());
      // Use state values directly - they are the source of truth from Phase 1
      formData.append("bedrooms", bedrooms.toString());
      formData.append("bathrooms", bathrooms.toString());
      formData.append("size", confirmedData.landSize || "");
      formData.append(
        "constructionStatus",
        aiData?.constructionStatus || "completed",
      );

      // Add AI-extracted data
      if (aiData) {
        formData.append("features", JSON.stringify(aiData.amenities || []));
        formData.append("amenities", JSON.stringify(aiData.amenities || []));
        if (aiData.yearBuilt)
          formData.append("buildYear", aiData.yearBuilt.toString());

        // Add document analysis data
        if (aiData.documentAnalysis) {
          const docAnalysis = aiData.documentAnalysis;
          // Location data
          if (docAnalysis.state) formData.append("docState", docAnalysis.state);
          if (docAnalysis.lga) formData.append("docLga", docAnalysis.lga);

          // Title/Registration info
          if (docAnalysis.titleType)
            formData.append("titleType", docAnalysis.titleType);
          if (docAnalysis.registrationNumber)
            formData.append(
              "registrationNumber",
              docAnalysis.registrationNumber,
            );
          if (docAnalysis.titleNumber)
            formData.append("titleNumber", docAnalysis.titleNumber);
          if (docAnalysis.transferDate)
            formData.append("transferDate", docAnalysis.transferDate);

          // Governor's Consent
          if (docAnalysis.governorsConsent) {
            formData.append(
              "governorsConsent",
              JSON.stringify(docAnalysis.governorsConsent),
            );
          }

          // Power of Attorney
          if (docAnalysis.powerOfAttorney) {
            formData.append(
              "powerOfAttorney",
              JSON.stringify(docAnalysis.powerOfAttorney),
            );
          }

          // Survey info
          if (docAnalysis.surveyNumber)
            formData.append("surveyNumber", docAnalysis.surveyNumber);
          if (docAnalysis.surveyDate)
            formData.append("surveyDate", docAnalysis.surveyDate);
          if (docAnalysis.surveyorName)
            formData.append("surveyorName", docAnalysis.surveyorName);
          if (docAnalysis.surveyorLicense)
            formData.append("surveyorLicense", docAnalysis.surveyorLicense);
          if (docAnalysis.gpsCoordinates)
            formData.append("gpsCoordinates", docAnalysis.gpsCoordinates);
          if (docAnalysis.boundaryDescriptions)
            formData.append(
              "boundaryDescriptions",
              docAnalysis.boundaryDescriptions,
            );
          if (docAnalysis.landSizeSource)
            formData.append("landSizeSource", docAnalysis.landSizeSource);

          // Lease info
          if (docAnalysis.leaseType)
            formData.append("leaseType", docAnalysis.leaseType);
          if (docAnalysis.leaseStartDate)
            formData.append("leaseStartDate", docAnalysis.leaseStartDate);
          if (docAnalysis.leaseExpiryDate)
            formData.append("leaseExpiryDate", docAnalysis.leaseExpiryDate);
          if (docAnalysis.remainingYears)
            formData.append("remainingYears", docAnalysis.remainingYears);

          // Ground rent
          if (docAnalysis.groundRent)
            formData.append("groundRent", docAnalysis.groundRent);
          if (docAnalysis.groundRentStatus)
            formData.append("groundRentStatus", docAnalysis.groundRentStatus);

          // Payment info
          if (docAnalysis.paymentTerms)
            formData.append("paymentTerms", docAnalysis.paymentTerms);
          if (docAnalysis.outstandingBalance)
            formData.append(
              "outstandingBalance",
              docAnalysis.outstandingBalance,
            );

          // Property tax
          if (docAnalysis.propertyTax) {
            formData.append(
              "propertyTax",
              JSON.stringify(docAnalysis.propertyTax),
            );
          }

          // Building approval
          if (docAnalysis.buildingApproval) {
            formData.append(
              "buildingApproval",
              JSON.stringify(docAnalysis.buildingApproval),
            );
          }

          // Utilities
          if (docAnalysis.utilities) {
            formData.append("utilities", JSON.stringify(docAnalysis.utilities));
          }
        }

        // Add photo analysis data
        if (aiData.photoAnalysis) {
          formData.append(
            "condition",
            aiData.photoAnalysis.propertyCondition || "",
          );
          formData.append(
            "finishingQuality",
            aiData.photoAnalysis.finishingQuality || "",
          );
        }

        // Add verification flags
        if (aiData.hasEncumbrances !== undefined) {
          formData.append("hasEncumbrances", aiData.hasEncumbrances.toString());
        }
        if (aiData.hasDisputes !== undefined) {
          formData.append("hasDisputes", aiData.hasDisputes.toString());
        }

        // Add owner info
        if (aiData.ownerName) formData.append("ownerName", aiData.ownerName);
        if (aiData.yearAcquired)
          formData.append("yearAcquired", aiData.yearAcquired.toString());
        if (aiData.acquisitionMethod)
          formData.append("acquisitionMethod", aiData.acquisitionMethod);

        // Store the full AI analysis for reference
        formData.append("aiAnalysisData", JSON.stringify(aiData));
      }

      // Add address
      formData.append("address", address);
      formData.append("state", addressState);
      if (addressCity) formData.append("lga", addressCity);

      // Add uploaded document files (only those with actual files)
      const uploadedDocs = declaredDocuments.filter(
        (doc) => doc.uploaded && doc.file,
      );
      uploadedDocs.forEach((doc) => {
        formData.append("legalDocs", doc.file!);
      });

      // Send metadata for uploaded documents
      const documentsMeta = uploadedDocs.map((doc) => ({
        type: doc.type || "Other",
        originalName: doc.file!.name,
      }));
      formData.append("documentsMeta", JSON.stringify(documentsMeta));

      // Send all declared document types (including those without uploaded files)
      const declaredDocumentTypes = declaredDocuments.map((doc) => ({
        type: doc.type,
        uploaded: doc.uploaded,
      }));
      formData.append(
        "declaredDocumentTypes",
        JSON.stringify(declaredDocumentTypes),
      );

      // Add photos with metadata
      photos.forEach((photo, index) => {
        formData.append("images", photo.file);
      });

      // Send photo metadata as JSON
      const photosMeta = photos.map((photo) => ({
        label: photo.label || photo.customLabel || "Other",
        category: photo.category || "general",
        originalName: photo.file.name,
      }));
      formData.append("photosMeta", JSON.stringify(photosMeta));

      const response = await ProListingsService.create(formData);

      if (response.success) {
        const listingId = response.data?.indaTag || response.data?._id;
        setSavedListingId(listingId);
        setSavedListing(response.data);

        // Check if location intelligence failed
        if (response.locationIntelligenceStatus === "failed") {
          setShowLocationWarning(true);
        }

        // Use intelligence data returned from the backend (already fetched during createListing)
        if (response.data?.intelligenceData) {
          setUploadData((prev) => ({
            ...prev,
            intelligenceData: response.data.intelligenceData,
          }));
        }

        setCurrentPhase("enhancement");
      } else {
        throw new Error(response.message || "Failed to save listing");
      }
    } catch (error: any) {
      console.error("Failed to save listing:", error);
      const errorData = error.response?.data;

      // Check for listing limit error
      if (errorData?.code === "LISTING_LIMIT_REACHED") {
        setLimitInfo({ limit: errorData.limit, plan: errorData.plan });
        setShowLimitModal(true);
      } else {
        setErrors({
          confirmation:
            errorData?.message ||
            error.message ||
            "Failed to save listing. Please try again.",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // PHASE 4: PROGRESSIVE ENHANCEMENT
  // ============================================================================

  const handleSkipEnhancement = () => {
    // Skip directly to preview without saving enhancements
    setCurrentPhase("preview");
  };

  const handleAddEnhancement = (field: string, value: any) => {
    setUploadData((prev) => ({
      ...prev,
      enhancedData: {
        ...prev.enhancedData,
        [field]: value,
      },
    }));
  };

  const handleSaveEnhancements = async () => {
    if (!savedListingId) {
      // No listing to update, just go to preview
      setCurrentPhase("preview");
      return;
    }

    const enhanced = uploadData.enhancedData;
    if (!enhanced || Object.keys(enhanced).length === 0) {
      // No enhancements to save
      setCurrentPhase("preview");
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await ProListingsService.updateListing(savedListingId, {
        virtualTourUrl: enhanced.virtualTourUrl,
        paymentPlans: enhanced.paymentPlans,
        developerInfo: enhanced.developerInfo,
        expectedCompletion: enhanced.expectedCompletion,
        constructionMilestones: enhanced.constructionMilestones,
      });
      if (response.data) {
        setSavedListing(response.data);
      }
      setCurrentPhase("preview");
    } catch (error: any) {
      console.error("Failed to save enhancements:", error);
      setErrors({
        enhancement: error.message || "Failed to save enhancements",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const finalizeListing = () => {
    setCurrentPhase("preview");
  };

  const handlePublishFromPreview = async () => {
    if (!savedListingId) {
      setCurrentPhase("complete");
      return;
    }

    setIsSaving(true);
    try {
      // Update listing status to active
      await ProListingsService.updateListing(savedListingId, {
        listingStatus: "active",
      });
      setCurrentPhase("complete");
    } catch (error: any) {
      console.error("Failed to publish listing:", error);
      setErrors({ preview: error.message || "Failed to publish listing" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!savedListingId) {
      // No listing saved yet, just close
      onComplete(uploadData);
      return;
    }

    setIsSaving(true);
    try {
      // Ensure listing status is draft
      await ProListingsService.updateListing(savedListingId, {
        listingStatus: "draft",
      });
      // Navigate to listings page or close
      router.push("/listings");
    } catch (error: any) {
      console.error("Failed to save as draft:", error);
      setErrors({ preview: error.message || "Failed to save draft" });
    } finally {
      setIsSaving(false);
    }
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
    <>
      {/* Listing Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Listing Limit Reached
            </h3>
            <p className="text-gray-600 text-center mb-6">
              You&apos;ve reached your{" "}
              {limitInfo?.plan
                ? limitInfo.plan.charAt(0).toUpperCase() +
                  limitInfo.plan.slice(1)
                : "current"}{" "}
              plan limit of {limitInfo?.limit || 1} property listing
              {limitInfo?.limit === 1 ? "" : "s"}. Upgrade your plan to add more
              properties and unlock additional features.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  router.push("/for-professionals#pricing");
                }}
                className="w-full py-3 bg-[#4ea8a1] text-white rounded-lg font-semibold hover:bg-[#3d9691] transition-colors"
              >
                View Upgrade Options
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Intelligence Warning Toast */}
      {showLocationWarning && (
        <div className="fixed top-4 right-4 z-[70] max-w-md animate-in slide-in-from-top-2 duration-300">
          <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-900 text-sm">
                  Location insights unavailable right now
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  Your listing was saved successfully. Location data will be
                  added automatically when available.
                </p>
              </div>
              <button
                onClick={() => setShowLocationWarning(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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
                {currentPhase === "upload" &&
                  "Step 1: Upload documents and photos"}
                {currentPhase === "processing" &&
                  "Step 2: AI is analyzing your uploads"}
                {currentPhase === "confirmation" &&
                  "Step 3: Review and confirm details"}
                {currentPhase === "enhancement" &&
                  "Step 4: Boost your listing (optional)"}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`flex items-center gap-2 ${currentPhase === "upload" ? "text-[#4ea8a1]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase === "upload" ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Upload</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div
                  className={`h-full bg-[#4ea8a1] transition-all ${["processing", "confirmation", "enhancement", "complete"].includes(currentPhase) ? "w-full" : "w-0"}`}
                />
              </div>
              <div
                className={`flex items-center gap-2 ${["processing", "confirmation", "enhancement", "complete"].includes(currentPhase) ? "text-[#4ea8a1]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${["processing", "confirmation", "enhancement", "complete"].includes(currentPhase) ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="text-sm font-medium">AI Analysis</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div
                  className={`h-full bg-[#4ea8a1] transition-all ${["confirmation", "enhancement", "complete"].includes(currentPhase) ? "w-full" : "w-0"}`}
                />
              </div>
              <div
                className={`flex items-center gap-2 ${["confirmation", "enhancement", "complete"].includes(currentPhase) ? "text-[#4ea8a1]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${["confirmation", "enhancement", "complete"].includes(currentPhase) ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}
                >
                  3
                </div>
                <span className="text-sm font-medium">Confirm</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div
                  className={`h-full bg-[#4ea8a1] transition-all ${["enhancement", "complete"].includes(currentPhase) ? "w-full" : "w-0"}`}
                />
              </div>
              <div
                className={`flex items-center gap-2 ${["enhancement", "complete"].includes(currentPhase) ? "text-[#4ea8a1]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${["enhancement", "complete"].includes(currentPhase) ? "bg-[#4ea8a1] text-white" : "bg-gray-200"}`}
                >
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
                declaredDocuments={declaredDocuments}
                photos={photos}
                errors={errors}
                priceWarning={priceWarning}
                propertyFlowType={propertyFlowType}
                onPropertyFlowTypeChange={handlePropertyFlowTypeChange}
                onPriceChange={handlePriceChange}
                onBedroomsChange={handleBedroomsChange}
                onBathroomsChange={handleBathroomsChange}
                onDeclareDocument={handleDeclareDocument}
                onRemoveDeclaredDocument={handleRemoveDeclaredDocument}
                onDocumentFileUpload={handleDocumentFileUpload}
                onRemoveDocumentFile={handleRemoveDocumentFile}
                onPhotoUpload={handlePhotoUpload}
                onPhotoLabelChange={handlePhotoLabelChange}
                onPhotoRemove={(id) =>
                  setPhotos((prev) => prev.filter((p) => p.id !== id))
                }
                onSubmit={handlePhase1Submit}
              />
            )}

            {currentPhase === "processing" && (
              <Phase2Processing
                documents={declaredDocuments
                  .filter(
                    (d): d is DeclaredDocument & { file: File } =>
                      d.uploaded && !!d.file,
                  )
                  .map((d) => ({ id: d.id, file: d.file, type: d.type }))}
                photos={photos}
                onComplete={handleAnalysisComplete}
                onError={handleAnalysisError}
                onBack={() => setCurrentPhase("upload")}
              />
            )}

            {currentPhase === "confirmation" && uploadData.aiInferredData && (
              <ReviewExtractedInfo
                data={{
                  ...uploadData,
                  documents: declaredDocuments
                    .filter(
                      (d): d is DeclaredDocument & { file: File } =>
                        d.uploaded && !!d.file,
                    )
                    .map((d) => ({ id: d.id, file: d.file, type: d.type })),
                  declaredDocuments, // All declared document types
                  photos, // Use actual uploaded photos from state
                }}
                onEdit={handleConfirmField}
                onConfirm={handlePhase3Submit}
                onBack={() => setCurrentPhase("upload")}
                isLoading={isSaving}
                error={errors.confirmation}
              />
            )}

            {currentPhase === "enhancement" && (
              <Phase4Enhancement
                enhancedData={uploadData.enhancedData}
                propertyType={uploadData.confirmedData?.propertyType}
                onAdd={handleAddEnhancement}
                onSkip={handleSkipEnhancement}
                onComplete={handleSaveEnhancements}
                isLoading={isSaving}
                error={errors.enhancement}
              />
            )}

            {currentPhase === "preview" && (
              <div className="space-y-4">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-[#4ea8a1]/10 to-[#f59e0b]/10 border border-[#4ea8a1] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="w-6 h-6 text-[#4ea8a1] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Preview Your Property Report
                      </h3>
                      <p className="text-sm text-gray-600">
                        This is exactly what buyers will see when they click
                        your shareable link. Review it carefully before
                        publishing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buyer Report Preview */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <BuyerReportPreview
                    data={uploadData}
                    savedListing={savedListing}
                    mode="preview"
                  />
                </div>

                {/* Error Message */}
                {errors.preview && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errors.preview}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleEditFromPreview}
                    disabled={isSaving}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Edit & Improve
                  </button>
                  <button
                    onClick={handleSaveAsDraft}
                    disabled={isSaving}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save as Draft
                  </button>
                  <button
                    onClick={handlePublishFromPreview}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d9691] font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    Publish Now
                  </button>
                </div>
              </div>
            )}

            {currentPhase === "complete" && (
              <Phase5Complete
                uploadData={uploadData}
                savedListing={savedListing}
                onViewProperty={handleViewProperty}
                onClose={handleCloseComplete}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
