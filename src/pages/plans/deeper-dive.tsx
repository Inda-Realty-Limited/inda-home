import { startListingPayment, uploadQuestionnaireFiles } from "@/api/payments";
import { Container, Footer, Input, Navbar } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { getUser, StoredUser } from "@/helpers";
import {
  DueDiligenceQuestionnairePayload,
  QuestionnaireFileRef,
} from "@/types/questionnaire";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLoader,
  FiUploadCloud,
} from "react-icons/fi";

const residentialTypes = ["House", "Duplex", "Flat", "Land", "Others"];
const commercialTypes = ["Office", "Retail", "Warehouse", "Others"];
const propertyStatusOptions = [
  "Off-plan",
  "Under Construction",
  "Completed",
  "Others",
];
const propertyCategoryOptions = [
  "Residential",
  "Commercial",
  "Mixed Use",
  "Other",
] as const;
const sellerTypeOptions = [
  "Individual",
  "Company",
  "Developer",
  "Family Estate",
  "Other",
] as const;

const QUESTIONNAIRE_FILE_MAX_COUNT = 10;
const QUESTIONNAIRE_FILE_MAX_BYTES = 25 * 1024 * 1024;

const resolveErrorMessage = (error: unknown): string => {
  if (!error) return "Something went wrong. Please try again.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  const maybeAxios = error as {
    response?: {
      data?: { message?: string; errors?: unknown };
      status?: number;
    };
    message?: string;
  };
  const apiMessage = maybeAxios?.response?.data?.message;
  if (apiMessage && typeof apiMessage === "string") return apiMessage;
  if (maybeAxios?.message) return maybeAxios.message;
  return "We couldn't complete that action. Please try again.";
};

const toCamelCaseKey = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((segment, index) =>
      index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)
    )
    .join("");
};

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${
    units[exponent]
  }`;
};

const uploadRequirements = [
  {
    key: "primary-title-doc",
    title: "Upload Certificate of Occupancy (C of O) OR Deed of Assignment",
    optional: false,
  },
  {
    key: "survey-plan",
    title: "Upload Survey Plan",
    optional: false,
  },
  {
    key: "governors-consent",
    title: "Upload Governor's Consent",
    optional: true,
  },
  {
    key: "zoning-permits",
    title: "Upload Any Zoning/Building Permit documents",
    optional: true,
  },
] as const;

type UploadRequirementKey = (typeof uploadRequirements)[number]["key"];
type PropertyCategoryOption = (typeof propertyCategoryOptions)[number];
type SellerTypeOption = (typeof sellerTypeOptions)[number];

type PropertyDetails = {
  address: string;
  description: string;
  listingLink: string;
  category: PropertyCategoryOption | "";
  categoryOther: string;
  propertyTypes: string[];
  propertyTypeOther: string;
  propertyStatus: string[];
  propertyStatusOther: string;
};

type SellerInformation = {
  sellerType: SellerTypeOption | "";
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerTypeOther: string;
};

type SiteAccessDetails = {
  contactName: string;
  contactPhone: string;
  specialInstructions: string;
};

type BuyerInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type UploadEntry = {
  files: File[];
  refs: QuestionnaireFileRef[];
  uploading: boolean;
  error?: string | null;
};

type UploadState = Partial<Record<UploadRequirementKey, UploadEntry>>;

type TextInputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const DeeperDiveWizardPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    address: "",
    description: "",
    listingLink: "",
    category: "",
    categoryOther: "",
    propertyTypes: [],
    propertyTypeOther: "",
    propertyStatus: [],
    propertyStatusOther: "",
  });
  const [sellerInfo, setSellerInfo] = useState<SellerInformation>({
    sellerType: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
    sellerTypeOther: "",
  });
  const [siteAccess, setSiteAccess] = useState<SiteAccessDetails>({
    contactName: "",
    contactPhone: "",
    specialInstructions: "",
  });
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [documentUploads, setDocumentUploads] = useState<UploadState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listingContext, setListingContext] = useState<{
    listingId?: string;
    listingUrl?: string;
  }>({});

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    if (currentUser) {
      setBuyerInfo((prev) => ({
        fullName:
          prev.fullName && prev.fullName.trim().length > 0
            ? prev.fullName
            : [currentUser.firstName, currentUser.lastName]
                .filter(Boolean)
                .join(" ")
                .trim(),
        email:
          prev.email && prev.email.trim().length > 0
            ? prev.email
            : currentUser.email ?? "",
        phone:
          prev.phone && prev.phone.trim().length > 0
            ? prev.phone
            : currentUser.phoneNumber ?? currentUser.phone ?? "",
      }));
    }
  }, []);

  const listingIdParam =
    typeof router.query?.listingId === "string"
      ? router.query.listingId
      : undefined;
  const listingUrlParam =
    typeof router.query?.listingUrl === "string"
      ? router.query.listingUrl
      : undefined;

  useEffect(() => {
    if (!router.isReady) return;

    setListingContext((prev) => ({
      listingId: listingIdParam ?? prev.listingId,
      listingUrl: listingUrlParam ?? prev.listingUrl,
    }));

    if (listingUrlParam && !propertyDetails.listingLink) {
      setPropertyDetails((prev) => ({
        ...prev,
        listingLink: prev.listingLink || listingUrlParam,
      }));
    }
  }, [
    router.isReady,
    listingIdParam,
    listingUrlParam,
    propertyDetails.listingLink,
  ]);

  const handleDocumentUpload = useCallback(
    async (key: UploadRequirementKey, fileList: FileList | null) => {
      const files = fileList ? Array.from(fileList) : [];

      if (files.length === 0) {
        setDocumentUploads((prev) => {
          if (!(key in prev)) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }

      if (files.length > QUESTIONNAIRE_FILE_MAX_COUNT) {
        showToast(
          `You can upload up to ${QUESTIONNAIRE_FILE_MAX_COUNT} files per field.`,
          5000,
          "warning"
        );
        return;
      }

      const oversizeFile = files.find(
        (file) => file.size > QUESTIONNAIRE_FILE_MAX_BYTES
      );
      if (oversizeFile) {
        showToast(
          `${oversizeFile.name} is larger than 25MB. Please upload a smaller file.`,
          5000,
          "error"
        );
        return;
      }

      setDocumentUploads((prev) => ({
        ...prev,
        [key]: {
          files,
          refs: prev[key]?.refs ?? [],
          uploading: true,
          error: null,
        },
      }));

      try {
        const refs = await uploadQuestionnaireFiles(files);
        setDocumentUploads((prev) => ({
          ...prev,
          [key]: { files, refs, uploading: false, error: null },
        }));
        showToast(
          `${files.length} file${files.length > 1 ? "s" : ""} uploaded`,
          2400,
          "success"
        );
      } catch (error) {
        const message = resolveErrorMessage(error);
        setDocumentUploads((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        showToast(message, 5200, "error");
      }
    },
    [showToast]
  );

  const handleDocumentClear = useCallback(
    (key: UploadRequirementKey) => {
      setDocumentUploads((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      showToast("Upload cleared", 1800, "info");
    },
    [showToast]
  );

  const handlePropertyFieldChange = useCallback(
    (field: keyof PropertyDetails) => (event: TextInputEvent) => {
      const { value } = event.target;
      setPropertyDetails((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCategorySelect = useCallback(
    (category: PropertyDetails["category"]) => {
      setPropertyDetails((prev) => ({
        ...prev,
        category,
        categoryOther: category === "Other" ? prev.categoryOther : "",
      }));
    },
    []
  );

  const handleTogglePropertyType = useCallback((option: string) => {
    setPropertyDetails((prev) => {
      const isAlreadySelected =
        prev.propertyTypes.length === 1 && prev.propertyTypes[0] === option;
      const next = isAlreadySelected ? [] : [option];
      return {
        ...prev,
        propertyTypes: next,
        propertyTypeOther: next.includes("Others")
          ? prev.propertyTypeOther
          : "",
      };
    });
  }, []);

  const handleTogglePropertyStatus = useCallback((option: string) => {
    setPropertyDetails((prev) => {
      const isAlreadySelected =
        prev.propertyStatus.length === 1 && prev.propertyStatus[0] === option;
      const next = isAlreadySelected ? [] : [option];
      return {
        ...prev,
        propertyStatus: next,
        propertyStatusOther: next.includes("Others")
          ? prev.propertyStatusOther
          : "",
      };
    });
  }, []);

  const handleSellerFieldChange = useCallback(
    (field: keyof SellerInformation) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSellerInfo((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const handleSellerTypeSelect = useCallback(
    (sellerType: SellerInformation["sellerType"]) => {
      setSellerInfo((prev) => ({
        ...prev,
        sellerType,
        sellerTypeOther: sellerType === "Other" ? prev.sellerTypeOther : "",
      }));
    },
    []
  );

  const handleSiteFieldChange = useCallback(
    (field: keyof SiteAccessDetails) => (event: TextInputEvent) => {
      const { value } = event.target;
      setSiteAccess((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleBuyerFieldChange = useCallback(
    (field: keyof BuyerInfo) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBuyerInfo((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const validatePropertyBasics = useCallback(() => {
    if (!propertyDetails.address.trim()) {
      showToast("Please enter the property address.", 4200, "warning");
      return false;
    }
    if (!propertyDetails.description.trim()) {
      showToast("Add a short property description.", 4200, "warning");
      return false;
    }
    if (!propertyDetails.category) {
      showToast("Select the property category.", 4200, "warning");
      return false;
    }
    if (
      propertyDetails.category === "Other" &&
      !propertyDetails.categoryOther.trim()
    ) {
      showToast(
        "Describe the category when Other is selected.",
        4200,
        "warning"
      );
      return false;
    }
    if (propertyDetails.propertyTypes.length === 0) {
      showToast("Choose a property type.", 4200, "warning");
      return false;
    }
    if (
      propertyDetails.propertyTypes.includes("Others") &&
      !propertyDetails.propertyTypeOther.trim()
    ) {
      showToast("Describe the property type for Others.", 4200, "warning");
      return false;
    }
    if (propertyDetails.propertyStatus.length === 0) {
      showToast("Select the property status.", 4200, "warning");
      return false;
    }
    if (
      propertyDetails.propertyStatus.includes("Others") &&
      !propertyDetails.propertyStatusOther.trim()
    ) {
      showToast("Provide the custom property status.", 4200, "warning");
      return false;
    }
    if (!propertyDetails.listingLink.trim()) {
      showToast("Include the listing link.", 4200, "warning");
      return false;
    }
    return true;
  }, [propertyDetails, showToast]);

  const validateDocuments = useCallback(() => {
    const requiredKeys: UploadRequirementKey[] = [
      "primary-title-doc",
      "survey-plan",
    ];
    for (const key of requiredKeys) {
      const entry = documentUploads[key];
      if (!entry) {
        showToast("Upload the required legal documents.", 4500, "warning");
        return false;
      }
      if (entry.uploading) {
        showToast(
          "Wait for uploads to finish before continuing.",
          4500,
          "info"
        );
        return false;
      }
      if (!entry.refs || entry.refs.length === 0) {
        showToast(
          "Upload at least one file for each required slot.",
          4500,
          "warning"
        );
        return false;
      }
    }
    return true;
  }, [documentUploads, showToast]);

  const validateSeller = useCallback(() => {
    if (!sellerInfo.sellerType) {
      showToast("Select the seller type.", 4200, "warning");
      return false;
    }
    if (
      sellerInfo.sellerType === "Other" &&
      !sellerInfo.sellerTypeOther.trim()
    ) {
      showToast("Describe the seller type.", 4200, "warning");
      return false;
    }
    if (!sellerInfo.sellerName.trim()) {
      showToast("Enter the seller's name.", 4200, "warning");
      return false;
    }
    if (!sellerInfo.sellerPhone.trim()) {
      showToast("Add the seller's phone number.", 4200, "warning");
      return false;
    }
    if (!sellerInfo.sellerEmail.trim()) {
      showToast("Provide the seller's email.", 4200, "warning");
      return false;
    }
    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(sellerInfo.sellerEmail.trim())) {
      showToast("That seller email looks invalid.", 4200, "warning");
      return false;
    }
    return true;
  }, [sellerInfo, showToast]);

  const validateSiteAccess = useCallback(() => {
    if (!siteAccess.contactName.trim()) {
      showToast("Enter the site contact name.", 4200, "warning");
      return false;
    }
    if (!siteAccess.contactPhone.trim()) {
      showToast("Provide the site contact phone number.", 4200, "warning");
      return false;
    }
    return true;
  }, [siteAccess, showToast]);

  const validateBuyer = useCallback(() => {
    if (!buyerInfo.fullName.trim()) {
      showToast("Enter the buyer's full name.", 4200, "warning");
      return false;
    }
    if (!buyerInfo.email.trim()) {
      showToast("Provide a contact email.", 4200, "warning");
      return false;
    }
    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(buyerInfo.email.trim())) {
      showToast("That email doesn't look right.", 4200, "warning");
      return false;
    }
    if (!buyerInfo.phone.trim()) {
      showToast("Add a contact phone number.", 4200, "warning");
      return false;
    }
    return true;
  }, [buyerInfo, showToast]);

  const buildQuestionnairePayload =
    useCallback((): DueDiligenceQuestionnairePayload => {
      const certificateRefs = documentUploads["primary-title-doc"]?.refs ?? [];
      const surveyRefs = documentUploads["survey-plan"]?.refs ?? [];
      const governorsRefs = documentUploads["governors-consent"]?.refs ?? [];
      const zoningRefs = documentUploads["zoning-permits"]?.refs ?? [];

      const meta: Record<string, unknown> = {
        formVersion: "deeper-dive-2025-09",
        uiPath: "plans/deeper-dive",
      };
      if (listingContext.listingId) {
        meta.listingId = listingContext.listingId;
      }
      if (listingContext.listingUrl) {
        meta.listingUrl = listingContext.listingUrl;
      }

      const primaryType = propertyDetails.propertyTypes[0] ?? "";
      const primaryStatus = propertyDetails.propertyStatus[0] ?? "";

      return {
        propertyBasics: {
          propertyAddress: propertyDetails.address.trim(),
          propertyDescription: propertyDetails.description.trim(),
          propertyCategory: toCamelCaseKey(propertyDetails.category),
          propertyCategoryOther:
            propertyDetails.category === "Other"
              ? propertyDetails.categoryOther.trim() || undefined
              : undefined,
          propertyType: primaryType ? toCamelCaseKey(primaryType) : "",
          propertyTypeOther:
            primaryType === "Others"
              ? propertyDetails.propertyTypeOther.trim() || undefined
              : undefined,
          propertyStatus: primaryStatus ? toCamelCaseKey(primaryStatus) : "",
          propertyStatusOther:
            primaryStatus === "Others"
              ? propertyDetails.propertyStatusOther.trim() || undefined
              : undefined,
          listingUrl: propertyDetails.listingLink.trim() || undefined,
        },
        legalDocuments: {
          certificateOfOccupancyOrDeed: certificateRefs,
          surveyPlan: surveyRefs,
          ...(governorsRefs.length ? { governorsConsent: governorsRefs } : {}),
          ...(zoningRefs.length ? { zoningOrBuildingPermits: zoningRefs } : {}),
        },
        buyerInformation: {
          fullName: buyerInfo.fullName.trim(),
          email: buyerInfo.email.trim(),
          phoneNumber: buyerInfo.phone.trim(),
        },
        sellerInformation: {
          sellerType: toCamelCaseKey(sellerInfo.sellerType || ""),
          sellerName: sellerInfo.sellerName.trim(),
          sellerEmail: sellerInfo.sellerEmail.trim(),
          sellerPhone: sellerInfo.sellerPhone.trim(),
          ...(sellerInfo.sellerType === "Other"
            ? {
                sellerTypeOther: sellerInfo.sellerTypeOther.trim() || undefined,
              }
            : {}),
        },
        siteAccess: {
          contactName: siteAccess.contactName.trim(),
          contactPhone: siteAccess.contactPhone.trim(),
          ...(siteAccess.specialInstructions.trim()
            ? { specialInstructions: siteAccess.specialInstructions.trim() }
            : {}),
        },
        metadata: meta,
      };
    }, [
      buyerInfo.email,
      buyerInfo.fullName,
      buyerInfo.phone,
      documentUploads,
      listingContext.listingId,
      listingContext.listingUrl,
      propertyDetails.address,
      propertyDetails.category,
      propertyDetails.categoryOther,
      propertyDetails.description,
      propertyDetails.listingLink,
      propertyDetails.propertyStatus,
      propertyDetails.propertyStatusOther,
      propertyDetails.propertyTypes,
      propertyDetails.propertyTypeOther,
      sellerInfo.sellerEmail,
      sellerInfo.sellerName,
      sellerInfo.sellerPhone,
      sellerInfo.sellerType,
      sellerInfo.sellerTypeOther,
      siteAccess.contactName,
      siteAccess.contactPhone,
      siteAccess.specialInstructions,
    ]);

  const handleSubmit = useCallback(async () => {
    if (!user) {
      showToast("Please sign in to submit the questionnaire.", 4800, "warning");
      router.push("/auth/signin");
      return;
    }

    const questionnaire = buildQuestionnairePayload();
    const listingId = listingContext.listingId?.trim();
    const primaryListingUrl =
      propertyDetails.listingLink.trim() || listingContext.listingUrl || "";

    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const callbackPath = `/order/received?plan=deeperDive&q=${encodeURIComponent(
      primaryListingUrl
    )}`;
    const callbackUrl = origin ? `${origin}${callbackPath}` : undefined;

    const payload = {
      plan: "deeperDive" as const,
      questionnaire,
      ...(listingId ? { listingId } : {}),
      ...(primaryListingUrl ? { listingUrl: primaryListingUrl } : {}),
      ...(callbackUrl ? { callbackUrl } : {}),
    };

    setIsSubmitting(true);
    try {
      const response = await startListingPayment(payload);

      if (response.alreadyPaid) {
        showToast(
          "You already paid for this property. Taking you to the receipt…",
          4800,
          "info"
        );
        const reference =
          response.reference || response.payment?.reference || "";
        if (origin) {
          const params = new URLSearchParams({
            plan: "deeperDive",
            q: primaryListingUrl,
          });
          if (reference) {
            params.set("reference", reference);
          }
          router.push(`/order/received?${params.toString()}`);
        }
        return;
      }

      const redirectUrl =
        response.authorizationUrl ||
        response.payment?.authorizationUrl ||
        response.payment?.initResponse?.data?.link;

      if (redirectUrl) {
        showToast("Redirecting to payment…", 2600, "success");
        window.location.href = redirectUrl;
        return;
      }

      showToast(
        "Questionnaire submitted. We'll reach out with payment details.",
        5200,
        "info"
      );
    } catch (error) {
      const message = resolveErrorMessage(error);
      showToast(message, 5200, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    buildQuestionnairePayload,
    listingContext.listingId,
    listingContext.listingUrl,
    propertyDetails.listingLink,
    router,
    showToast,
    user,
  ]);

  const steps = useMemo(
    () => [
      {
        key: "property-basics",
        title: "Step 1/5 - Property Basics",
        highlightWidthPct: 20,
        render: () => (
          <PropertyBasicsStep
            values={propertyDetails}
            onChange={handlePropertyFieldChange}
            onSelectCategory={handleCategorySelect}
            onToggleType={handleTogglePropertyType}
            onToggleStatus={handleTogglePropertyStatus}
          />
        ),
      },
      {
        key: "legal-documents",
        title: "Step 2/5 - Legal Documents Upload",
        highlightWidthPct: 40,
        render: () => (
          <LegalDocumentsStep
            uploads={uploadRequirements}
            selectedFiles={documentUploads}
            onFileSelect={handleDocumentUpload}
            onClear={handleDocumentClear}
          />
        ),
      },
      {
        key: "seller-information",
        title: "Step 3/5 - Seller Information",
        highlightWidthPct: 60,
        render: () => (
          <SellerInformationStep
            values={sellerInfo}
            onChange={handleSellerFieldChange}
            onSelectSellerType={handleSellerTypeSelect}
          />
        ),
      },
      {
        key: "site-access",
        title: "Step 4/5 - Site Access Details",
        highlightWidthPct: 80,
        render: () => (
          <SiteAccessStep
            values={siteAccess}
            onChange={handleSiteFieldChange}
          />
        ),
      },
      {
        key: "buyer-information",
        title: "Step 5/5 - Buyer Information",
        highlightWidthPct: 100,
        render: () => (
          <BuyerInformationStep
            values={buyerInfo}
            onChange={handleBuyerFieldChange}
            hasUserContext={Boolean(user)}
          />
        ),
      },
    ],
    [
      buyerInfo,
      documentUploads,
      handleBuyerFieldChange,
      handleDocumentClear,
      handleDocumentUpload,
      handleCategorySelect,
      handlePropertyFieldChange,
      handleSellerFieldChange,
      handleSellerTypeSelect,
      handleSiteFieldChange,
      handleTogglePropertyStatus,
      handleTogglePropertyType,
      propertyDetails,
      sellerInfo,
      siteAccess,
      user,
    ]
  );

  const totalSteps = steps.length;
  const activeStep = useMemo(() => steps[stepIndex], [stepIndex, steps]);

  const goNext = () =>
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const anyUploadsInProgress = useMemo(
    () =>
      Object.values(documentUploads).some((entry) => entry && entry.uploading),
    [documentUploads]
  );

  const handlePrimaryAction = useCallback(async () => {
    if (isSubmitting) return;
    const checklist = [
      validatePropertyBasics,
      validateDocuments,
      validateSeller,
      validateSiteAccess,
      validateBuyer,
    ];
    const validator = checklist[stepIndex];
    const isValid = validator ? validator() : true;
    if (!isValid) return;

    if (isLast) {
      await handleSubmit();
    } else {
      goNext();
    }
  }, [
    handleSubmit,
    isLast,
    stepIndex,
    goNext,
    isSubmitting,
    validateBuyer,
    validateDocuments,
    validatePropertyBasics,
    validateSeller,
    validateSiteAccess,
  ]);

  const disableNext =
    (activeStep.key === "legal-documents" && anyUploadsInProgress) ||
    isSubmitting;

  return (
    <>
      <Head>
        <title>Deeper Dive • Inda</title>
      </Head>
      <Container noPadding className="min-h-screen bg-white text-[#0B1D27]">
        <Navbar />
        <main className="max-w-5xl mx-auto w-full min-h-[80vh] px-6 sm:px-10 py-10">
          <section className="space-y-8">
            <StepHeading
              title={activeStep.title}
              highlightPct={activeStep.highlightWidthPct}
            />
            <div className="bg-white rounded-3xl shadow-md border border-[#E4EEEC] p-6 sm:p-8">
              {activeStep.render()}
            </div>
            <WizardControls
              onBack={goBack}
              onNext={handlePrimaryAction}
              isFirst={isFirst}
              isLast={isLast}
              disableNext={disableNext}
              isBusy={isSubmitting && isLast}
            />
          </section>
        </main>
        <Footer />
      </Container>
    </>
  );
};

const StepHeading: React.FC<{ title: string; highlightPct: number }> = ({
  title,
  highlightPct,
}) => (
  <div className="space-y-3">
    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
      {title}
    </h1>
    <div className="h-1.5 rounded-full bg-[#D6EDEB]">
      <div
        className="h-full rounded-full bg-[#4EA8A1] transition-all duration-500"
        style={{ width: `${highlightPct}%` }}
      />
    </div>
  </div>
);

const FieldGroup: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="w-full rounded-[28px] border border-[#D7EBE7] bg-white/95 px-5 py-5 sm:px-7 sm:py-6 shadow-[0_6px_24px_rgba(17,31,39,0.06)] space-y-5">
    <div className="space-y-2">
      <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
      {description && <p className="text-sm text-[#5E7572]">{description}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const OptionPill: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`rounded-xl border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#4EA8A1]/40 focus:ring-offset-1 ${
      selected
        ? "bg-[#4EA8A1] text-white border-transparent"
        : "bg-white text-[#0B1D27] border-[#4EA8A1]/40 hover:border-[#4EA8A1]"
    }`}
  >
    {label}
  </button>
);

const SectionedOptionGroup: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}> = ({ title, options, selected, onToggle }) => (
  <div className="space-y-3">
    <p className="text-xs uppercase tracking-wide text-[#6B8C8A] font-semibold">
      {title}
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <OptionPill
            key={option}
            label={option}
            selected={isSelected}
            onClick={() => onToggle(option)}
          />
        );
      })}
    </div>
  </div>
);

type PropertyBasicsStepProps = {
  values: PropertyDetails;
  onChange: (field: keyof PropertyDetails) => (event: TextInputEvent) => void;
  onSelectCategory: (category: PropertyDetails["category"]) => void;
  onToggleType: (option: string) => void;
  onToggleStatus: (option: string) => void;
};

const PropertyBasicsStep: React.FC<PropertyBasicsStepProps> = ({
  values,
  onChange,
  onSelectCategory,
  onToggleStatus,
  onToggleType,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Add a property</h2>
      <p className="text-sm text-[#5E7572]">
        Provide core property details so we can begin your verification.
      </p>
    </div>
    <div className="space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Property address
        </span>
        <Input
          placeholder="Enter address"
          className="w-full sm:w-4/5"
          value={values.address}
          onChange={onChange("address")}
          autoComplete="street-address"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Property description
        </span>
        <textarea
          placeholder="Summarize the property"
          className="h-28 w-full sm:w-4/5 rounded-xl border border-[#D7EBE7] bg-white px-3 py-2 text-sm text-[#0B1D27] shadow-[0_2px_10px_rgba(15,61,65,0.04)] placeholder:text-[#6B8C8A] focus:outline-none focus:border-[#4EA8A1] focus:ring-2 focus:ring-[#4EA8A1]/30"
          value={values.description}
          onChange={onChange("description")}
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Listing Link
        </span>
        <Input
          placeholder="Paste link from Nigeria Property Centre"
          className="w-full sm:w-4/5"
          value={values.listingLink}
          onChange={onChange("listingLink")}
        />
      </label>
    </div>
    <div className="overflow-hidden rounded-2xl border border-[#DCEAE8] bg-[#F7FCFB]">
      <iframe
        title="Property map"
        className="h-64 w-full border-0"
        loading="lazy"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31512.31113673268!2d3.3993997!3d6.453055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b267a7b0c19%3A0x9d5d7d0d7f4d7ab0!2sLekki%20Phase%201%2C%20Eti-Osa!5e0!3m2!1sen!2sng!4v1700000000000"
        allowFullScreen
      />
    </div>
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <FieldGroup
        title="Property Category"
        description="Choose the primary category"
      >
        <div className="flex flex-wrap gap-2">
          {propertyCategoryOptions.map((option) => (
            <OptionPill
              key={option}
              label={option}
              selected={values.category === option}
              onClick={() => onSelectCategory(option)}
            />
          ))}
        </div>
        {values.category === "Other" && (
          <label className="block">
            <span className="text-xs font-medium text-[#5E7572]">
              If "Other", describe the category
            </span>
            <Input
              placeholder="Describe category"
              className="mt-2 w-full sm:w-3/4"
              value={values.categoryOther}
              onChange={onChange("categoryOther")}
            />
          </label>
        )}
      </FieldGroup>
      <FieldGroup title="Property Type" description="Select property type">
        <SectionedOptionGroup
          title="Residential"
          options={residentialTypes}
          selected={values.propertyTypes}
          onToggle={onToggleType}
        />
        <SectionedOptionGroup
          title="Commercial"
          options={commercialTypes}
          selected={values.propertyTypes}
          onToggle={onToggleType}
        />
        {values.propertyTypes.includes("Others") && (
          <label className="block">
            <span className="text-xs font-medium text-[#5E7572]">
              If "Others", describe the property type
            </span>
            <Input
              placeholder="Describe property type"
              className="mt-2 w-full sm:w-3/4"
              value={values.propertyTypeOther}
              onChange={onChange("propertyTypeOther")}
            />
          </label>
        )}
      </FieldGroup>
      <FieldGroup title="Property Status" description="Select property status">
        <SectionedOptionGroup
          title="Status"
          options={propertyStatusOptions}
          selected={values.propertyStatus}
          onToggle={onToggleStatus}
        />
        {values.propertyStatus.includes("Others") && (
          <label className="block">
            <span className="text-xs font-medium text-[#5E7572]">
              If "Others", describe the current status
            </span>
            <Input
              placeholder="Describe property status"
              className="mt-2 w-full sm:w-3/4"
              value={values.propertyStatusOther}
              onChange={onChange("propertyStatusOther")}
            />
          </label>
        )}
      </FieldGroup>
    </div>
  </div>
);

type LegalDocumentsStepProps = {
  uploads: typeof uploadRequirements;
  selectedFiles: UploadState;
  onFileSelect: (key: UploadRequirementKey, files: FileList | null) => void;
  onClear: (key: UploadRequirementKey) => void;
};

const LegalDocumentsStep: React.FC<LegalDocumentsStepProps> = ({
  uploads,
  selectedFiles,
  onFileSelect,
  onClear,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Upload Documents</h2>
      <p className="text-sm text-[#5E7572]">
        Provide the necessary legal documents to expedite verification. PDF,
        JPG, PNG (max 5MB).
      </p>
    </div>
    <div className="flex flex-col gap-6">
      {uploads.map((item) => (
        <UploadCard
          key={item.key}
          inputId={`deeper-${item.key}`}
          title={item.title}
          optional={item.optional}
          files={selectedFiles[item.key]?.files ?? []}
          isUploading={Boolean(selectedFiles[item.key]?.uploading)}
          error={selectedFiles[item.key]?.error}
          onSelect={(files) => onFileSelect(item.key, files)}
          onClear={() => onClear(item.key)}
        />
      ))}
    </div>
  </div>
);

type SellerInformationStepProps = {
  values: SellerInformation;
  onChange: (
    field: keyof SellerInformation
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSellerType: (sellerType: SellerInformation["sellerType"]) => void;
};

const SellerInformationStep: React.FC<SellerInformationStepProps> = ({
  values,
  onChange,
  onSelectSellerType,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Full Details</h2>
      <p className="text-sm text-[#5E7572]">Tell us about the seller.</p>
    </div>
    <FieldGroup title="Seller Type" description="Select seller type">
      <div className="flex flex-wrap gap-2">
        {sellerTypeOptions.map((option) => (
          <OptionPill
            key={option}
            label={option}
            selected={values.sellerType === option}
            onClick={() => onSelectSellerType(option)}
          />
        ))}
      </div>
      {values.sellerType === "Other" && (
        <label className="block">
          <span className="text-xs font-medium text-[#5E7572]">
            Describe the seller type
          </span>
          <Input
            placeholder="e.g. Family Trust"
            className="mt-2 w-full sm:w-3/4"
            value={values.sellerTypeOther}
            onChange={onChange("sellerTypeOther")}
          />
        </label>
      )}
    </FieldGroup>
    <div className="grid gap-4 sm:max-w-md">
      <label className="block">
        <span className="block text-sm font-medium mb-2">
          Full Name of Seller / Company
        </span>
        <Input
          placeholder="Enter Name"
          className="w-full"
          value={values.sellerName}
          onChange={onChange("sellerName")}
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Contact Phone</span>
        <Input
          placeholder="Enter No."
          className="w-full"
          value={values.sellerPhone}
          onChange={onChange("sellerPhone")}
          autoComplete="tel"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Email</span>
        <Input
          type="email"
          placeholder="Enter Email"
          className="w-full"
          value={values.sellerEmail}
          onChange={onChange("sellerEmail")}
          autoComplete="email"
        />
      </label>
    </div>
  </div>
);

type SiteAccessStepProps = {
  values: SiteAccessDetails;
  onChange: (field: keyof SiteAccessDetails) => (event: TextInputEvent) => void;
};

const SiteAccessStep: React.FC<SiteAccessStepProps> = ({
  values,
  onChange,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Site Access Details</h2>
      <p className="text-sm text-[#5E7572]">
        Help our field team plan the site visit.
      </p>
    </div>
    <div className="grid gap-4 sm:max-w-md">
      <label className="block">
        <span className="block text-sm font-medium mb-2">
          Site Contact Full Name
        </span>
        <Input
          placeholder="Enter Name"
          className="w-full"
          value={values.contactName}
          onChange={onChange("contactName")}
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Phone Number</span>
        <Input
          placeholder="Enter No."
          className="w-full"
          value={values.contactPhone}
          onChange={onChange("contactPhone")}
          autoComplete="tel"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">
          Any Special Instructions for Access?
        </span>
        <textarea
          placeholder="Enter instructions"
          className="w-full h-32 rounded-lg border border-[#4EA8A1]/60 bg-white px-3 py-2 text-sm text-[#0B1D27] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4EA8A1]/40"
          value={values.specialInstructions}
          onChange={onChange("specialInstructions")}
        />
      </label>
    </div>
  </div>
);

type BuyerInformationStepProps = {
  values: BuyerInfo;
  onChange: (
    field: keyof BuyerInfo
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasUserContext?: boolean;
};

const BuyerInformationStep: React.FC<BuyerInformationStepProps> = ({
  values,
  onChange,
  hasUserContext = false,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Full Details</h2>
      <p className="text-sm text-[#5E7572]">
        {hasUserContext
          ? "We pre-filled this with your Inda profile—update anything that looks off."
          : "This section is optional but recommended for verification communication."}
      </p>
    </div>
    <div className="grid gap-4 sm:max-w-md">
      <label className="block">
        <span className="block text-sm font-medium mb-2">Full Name</span>
        <Input
          placeholder="Enter address"
          className="w-full"
          value={values.fullName}
          onChange={onChange("fullName")}
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Contact Email</span>
        <Input
          type="email"
          placeholder="Enter Email"
          className="w-full"
          value={values.email}
          onChange={onChange("email")}
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-2">Phone number</span>
        <Input
          placeholder="Enter No."
          className="w-full"
          value={values.phone}
          onChange={onChange("phone")}
          autoComplete="tel"
        />
      </label>
    </div>
    <p className="text-xs italic text-[#5E7572]">
      Note: This section is optional but recommended for verification
      communication.
    </p>
  </div>
);

type UploadCardProps = {
  inputId: string;
  title: string;
  optional: boolean;
  files: File[];
  isUploading: boolean;
  error?: string | null;
  onSelect: (files: FileList | null) => void;
  onClear: () => void;
};

const UploadCard: React.FC<UploadCardProps> = ({
  inputId,
  title,
  optional,
  files,
  isUploading,
  error,
  onSelect,
  onClear,
}) => {
  const hasFiles = files.length > 0;
  const primaryFile = files[0];
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <label
        htmlFor={inputId}
        className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#DCEAE8] bg-[#4EA8A11F] transition sm:w-48 ${
          isUploading
            ? "pointer-events-none opacity-60"
            : "hover:border-[#4EA8A1]"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-1 text-[#4EA8A1]">
            <FiLoader className="h-7 w-7 animate-spin" />
            <span className="text-xs font-medium">Uploading…</span>
          </div>
        ) : (
          <FiUploadCloud className="h-8 w-8 text-[#4EA8A1]" />
        )}
        <div className="text-center">
          <p className="text-xs font-medium text-[#4EA8A1]">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-[#5E7572]">
            PDF, JPG, PNG (max. 5MB)
          </p>
        </div>
        <input
          id={inputId}
          type="file"
          multiple
          className="sr-only"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => onSelect(event.target.files)}
          disabled={isUploading}
        />
      </label>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#0B1D27]">{title}</p>
        {optional && (
          <p className="mt-1 text-xs text-[#5E7572]">(if applicable)</p>
        )}
        {error && <p className="mt-2 text-xs text-[#D45454]">{error}</p>}
        {hasFiles ? (
          <div className="mt-2 flex items-start justify-between gap-3 rounded-lg bg-[#F2FBFA] px-3 py-2">
            <div className="flex flex-1 items-start gap-2">
              <FiCheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-[#4EA8A1]" />
              <div className="space-y-1 text-sm text-[#0B1D27]">
                <p className="font-medium break-all">{primaryFile?.name}</p>
                {files.length > 1 && (
                  <p className="text-xs text-[#5E7572]">
                    +{files.length - 1} more file(s)
                  </p>
                )}
                <p className="text-xs text-[#5E7572]">
                  {formatBytes(totalSize)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-[#D45454] transition hover:text-[#b34141]"
              disabled={isUploading}
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#5E7572]">No file selected yet.</p>
        )}
      </div>
    </div>
  );
};

type WizardControlsProps = {
  onBack: () => void;
  onNext: () => Promise<void> | void;
  isFirst: boolean;
  isLast: boolean;
  disableNext?: boolean;
  isBusy?: boolean;
};

const WizardControls: React.FC<WizardControlsProps> = ({
  onBack,
  onNext,
  isFirst,
  isLast,
  disableNext,
  isBusy,
}) => {
  const backDisabled = isFirst || Boolean(isBusy);
  const nextDisabled = Boolean(disableNext || isBusy);
  const label = isLast
    ? isBusy
      ? "Saving…"
      : "Save"
    : isBusy
    ? "Working…"
    : "Next";

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        className="flex items-center gap-2 rounded-lg bg-[#111F27] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiArrowLeft className="text-base" />
        <span>Back</span>
      </button>
      <button
        type="button"
        onClick={() => void onNext()}
        disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-lg bg-[#4EA8A1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3d9691] disabled:cursor-not-allowed disabled:opacity-50"
        aria-busy={isBusy}
      >
        {isBusy && <FiLoader className="h-4 w-4 animate-spin" />}
        <span>{label}</span>
      </button>
    </div>
  );
};

export default DeeperDiveWizardPage;
