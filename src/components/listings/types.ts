export type UploadPhase = "upload" | "processing" | "confirmation" | "enhancement" | "preview" | "complete";

export type PropertyCategory = "land" | "detached" | "semi-detached" | "apartment" | "commercial" | "mixed-use";

export type PropertyFlowType = "completed" | "off-plan" | "land-only";

export type DocumentType =
    | "Title Document (C of O, Deed, etc.)"
    | "Survey Plan"
    | "Deed of Assignment"
    | "Deed of Sublease"
    | "Building Approval"
    | "Tax Receipt"
    | "Ground Rent Receipt"
    | "Utility Bill"
    | "Purchase Receipt"
    | "Governor's Consent"
    | "Power of Attorney"
    | "Other";

export type PhotoCategory = "exterior" | "interior" | "amenities" | "construction";

export type PhotoLabel =
    | "Bedroom"
    | "Master Bedroom"
    | "Bathroom"
    | "Living Room"
    | "Kitchen"
    | "Dining Room"
    | "Exterior Front"
    | "Exterior Back"
    | "Exterior Side"
    | "Street View"
    | "Estate/Development View"
    | "Neighborhood"
    | "Access Road"
    | "Compound Entrance"
    | "Swimming Pool"
    | "Generator"
    | "Gym"
    | "Parking"
    | "Garden"
    | "Balcony"
    | "Construction Progress"
    | "Architectural Rendering"
    | "Floor Plan"
    | "Site Plan"
    | "Land/Plot"
    | "Other";

export interface UploadedDocument {
    id: string;
    file: File;
    type?: DocumentType;
    ocrStatus?: "pending" | "processing" | "complete" | "failed";
    extractedData?: DocumentOCRData;
}

export interface DocumentOCRData {
    ownerName?: string;
    registrationNumber?: string;
    issueDate?: string;
    plotNumber?: string;
    landSize?: string;
    coordinates?: string;
    propertyType?: string;
    previousOwner?: string;
    acquisitionType?: "purchase" | "allocation" | "inheritance" | "gift";
    surveyNumber?: string;
    surveyDate?: string;
    boundaries?: string;
    confidence: {
        ownerName: number;
        registrationNumber: number;
        landSize: number;
        overall: number;
    };
}

export interface UploadedPhoto {
    id: string;
    file: File;
    category?: PhotoCategory;
    label?: PhotoLabel;
    customLabel?: string;
    preview: string;
    aiAnalysis?: PhotoAIAnalysis;
}

export interface PhotoAIAnalysis {
    detectedRooms?: Array<{
        type: "bedroom" | "bathroom" | "living" | "kitchen" | "dining";
        confidence: number;
    }>;
    detectedAmenities?: Array<{
        name: string;
        confidence: number;
    }>;
    constructionStage?: {
        stage: "foundation" | "structure" | "roofing" | "finishing" | "complete";
        completionPercentage: number;
        confidence: number;
    };
    propertyCondition?: {
        rating: "excellent" | "good" | "fair" | "poor";
        finishQuality: "luxury" | "standard" | "basic";
        confidence: number;
    };
    occupancyStatus?: {
        status: "vacant" | "furnished" | "occupied";
        confidence: number;
    };
}

export interface AIInferredData {
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    landSize?: string;
    ownerName?: string;
    yearAcquired?: number;
    acquisitionMethod?: string;
    previousOwners?: string[];
    amenities?: string[];
    constructionStatus?: string;
    completionPercentage?: number;
    currentUse?: "owner-occupied" | "rented" | "vacant" | "commercial";
    hasEncumbrances?: boolean;
    hasDisputes?: boolean;
    suggestedPriceRange?: { min: number; max: number };
    marketComparables?: Array<{ address: string; price: number; }>;
    location?: string;
    documentAnalysis?: {
        titleType?: string;
        state?: string;
        lga?: string;
        registrationNumber?: string;
        titleNumber?: string;
        transferDate?: string;
        governorsConsent?: { status?: string; number?: string; date?: string };
        powerOfAttorney?: { exists?: boolean; details?: string };
        landSizeSource?: string;
        surveyNumber?: string;
        surveyDate?: string;
        surveyorName?: string;
        surveyorLicense?: string;
        gpsCoordinates?: string;
        boundaryDescriptions?: string;
        leaseType?: string;
        leaseStartDate?: string;
        leaseExpiryDate?: string;
        remainingYears?: string;
        groundRent?: string;
        groundRentStatus?: string;
        paymentTerms?: string;
        outstandingBalance?: string;
        propertyTax?: { year?: string; amount?: string; status?: string; assessedValue?: string };
        buildingApproval?: { approvalNumber?: string; floors?: string; zoningCompliance?: string; approvalDate?: string };
        utilities?: {
            electricity?: { provider?: string; meterNumber?: string; connectionStatus?: string };
            water?: { provider?: string; connectionStatus?: string };
        };
    };
    photoAnalysis?: {
        roofType?: string;
        propertyCondition?: string;
        finishingQuality?: string;
    };
    confidence: {
        [key: string]: number;
    };
    flags: Array<{
        type: "warning" | "error" | "info";
        field: string;
        message: string;
        requiresVerification: boolean;
    }>;
}

export interface PropertyUploadData {
    address: string;
    askingPrice: number;
    documents: UploadedDocument[];
    photos: UploadedPhoto[];
    aiInferredData?: AIInferredData;
    confirmedData?: {
        propertyType: string;
        bedrooms?: number;
        bathrooms?: number;
        yearBuilt?: number;
        landSize?: string;
        currentUse?: string;
        amenities?: string[];
        acquisitionMethod?: string;
        yearAcquired?: number;
        hasEncumbrances: boolean;
        hasDisputes: boolean;
        additionalNotes?: string;
        titleType?: string;
    };
    enhancedData?: {
        virtualTourUrl?: string;
        paymentPlans?: string;
        developerInfo?: string;
        expectedCompletion?: string;
        constructionMilestones?: Array<{
            name: string;
            expectedDate: string;
            status: "complete" | "in-progress" | "pending";
        }>;
        lastConstructionUpdate?: string;
    };
}
