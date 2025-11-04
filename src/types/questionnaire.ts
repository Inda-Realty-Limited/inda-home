export type QuestionnairePlan = "deepDive" | "deeperDive";
export type PaymentPlan = "instant" | "free" | "deepDive" | "deeperDive";

export type QuestionnaireStatus = "submitted" | "paid" | "cancelled";

export interface QuestionnaireFileRef {
  url: string;
  key: string;
  bucket?: string;
  name?: string;
  contentType?: string;
  sizeBytes?: number;
}

export interface PropertyBasicsPayload {
  propertyAddress: string;
  propertyDescription: string;
  propertyCategory: string;
  propertyCategoryOther?: string;
  propertyType: string;
  propertyTypeOther?: string;
  propertyStatus: string;
  propertyStatusOther?: string;
  listingUrl?: string;
}

export interface LegalDocumentsPayload {
  certificateOfOccupancyOrDeed?: QuestionnaireFileRef[];
  surveyPlan?: QuestionnaireFileRef[];
  governorsConsent?: QuestionnaireFileRef[];
  zoningOrBuildingPermits?: QuestionnaireFileRef[];
}

export interface BuyerInformationPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
}

export interface SellerInformationPayload {
  sellerType: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerTypeOther?: string;
}

export interface SiteAccessPayload {
  contactName: string;
  contactPhone: string;
  specialInstructions?: string;
}

export interface DueDiligenceQuestionnairePayload {
  propertyBasics: PropertyBasicsPayload;
  legalDocuments: LegalDocumentsPayload;
  buyerInformation: BuyerInformationPayload;
  sellerInformation?: SellerInformationPayload;
  siteAccess?: SiteAccessPayload;
  metadata?: Record<string, unknown>;
}

export interface StartListingPaymentPayload {
  listingId?: string;
  listingUrl?: string;
  plan: PaymentPlan;
  callbackUrl?: string;
  questionnaire?: DueDiligenceQuestionnairePayload;
}

export interface StartListingPaymentResponse {
  authorizationUrl?: string;
  alreadyPaid?: boolean;
  reference?: string;
  questionnaireId?: string;
  payment?: {
    reference?: string;
    authorizationUrl?: string;
    status?: string;
    initResponse?: {
      data?: {
        link?: string;
      };
    };
  };
  status?: string;
  message?: string;
}
