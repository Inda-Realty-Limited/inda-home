import { startListingPayment, uploadQuestionnaireFiles } from "@/api/payments";
import { Container, Footer, Input, Navbar, PropertyMap } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  DueDiligenceQuestionnairePayload,
  QuestionnaireFileRef,
} from "@/types/questionnaire";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLoader,
  FiFileText,
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
    optional: true,
  },
  {
    key: "survey-plan",
    title: "Upload Survey Plan",
    optional: true,
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

type TextInputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type UploadEntry = {
  files: File[];
  refs: QuestionnaireFileRef[];
  uploading: boolean;
  error?: string | null;
};

type UploadState = Partial<Record<UploadRequirementKey, UploadEntry>>;

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

type BuyerInfo = {
  fullName: string;
  email: string;
  phone: string;
};

const DeepDiveWizardPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
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
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [documentUploads, setDocumentUploads] = useState<UploadState>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listingContext, setListingContext] = useState<{
    listingId?: string;
    listingUrl?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setBuyerInfo((prev) => ({
        fullName:
          prev.fullName && prev.fullName.trim().length > 0
            ? prev.fullName
            : [user.firstName, user.lastName]
                .filter(Boolean)
                .join(" ")
                .trim(),
        email:
          prev.email && prev.email.trim().length > 0
            ? prev.email
            : user.email ?? "",
        phone:
          prev.phone && prev.phone.trim().length > 0
            ? prev.phone
            : (user as any).phoneNumber ?? (user as any).phone ?? "",
      }));
    }
  }, [user]);

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

  const handleBuyerInfoChange = useCallback(
    (field: keyof BuyerInfo) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBuyerInfo((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

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
    (category: PropertyCategoryOption) => {
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

  const validatePropertyBasics = useCallback(() => {
    if (!propertyDetails.address.trim()) {
      showToast("Please enter the property address.", 4200, "warning");
      return false;
    }
    if (!propertyDetails.description.trim()) {
      showToast(
        "Add a short property description to continue.",
        4200,
        "warning"
      );
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
      showToast("Describe the category when selecting Other.", 4200, "warning");
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
      showToast(
        "Describe the property type when selecting Others.",
        4200,
        "warning"
      );
      return false;
    }
    if (propertyDetails.propertyStatus.length === 0) {
      showToast("Select the current property status.", 4200, "warning");
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
      showToast(
        "Include the listing link so we can match this property.",
        4200,
        "warning"
      );
      return false;
    }
    return true;
  }, [propertyDetails, showToast]);

  const validateDocuments = useCallback(() => {
    for (const entry of Object.values(documentUploads)) {
      if (!entry) continue;
      if (entry.uploading) {
        showToast(
          "Wait for the uploads to finish before continuing.",
          4500,
          "info"
        );
        return false;
      }
      if (!entry.refs || entry.refs.length === 0) {
        showToast(
          "Remove or complete any pending uploads before continuing.",
          4500,
          "warning"
        );
        return false;
      }
    }
    return true;
  }, [documentUploads, showToast]);

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
        formVersion: "deep-dive-2025-09",
        uiPath: "plans/deep-dive",
      };
      if (listingContext.listingId) {
        meta.listingId = listingContext.listingId;
      }
      if (listingContext.listingUrl) {
        meta.listingUrl = listingContext.listingUrl;
      }

      const primaryType = propertyDetails.propertyTypes[0] ?? "";
      const primaryStatus = propertyDetails.propertyStatus[0] ?? "";

      const legalDocuments = {
        ...(certificateRefs.length
          ? { certificateOfOccupancyOrDeed: certificateRefs }
          : {}),
        ...(surveyRefs.length ? { surveyPlan: surveyRefs } : {}),
        ...(governorsRefs.length ? { governorsConsent: governorsRefs } : {}),
        ...(zoningRefs.length ? { zoningOrBuildingPermits: zoningRefs } : {}),
      } as const;

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
        legalDocuments,
        buyerInformation: {
          fullName: buyerInfo.fullName.trim(),
          email: buyerInfo.email.trim(),
          phoneNumber: buyerInfo.phone.trim(),
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
    ]);

  const handleSubmit = useCallback(async () => {
    if (!user) {
      showToast("Please sign in to submit the questionnaire.", 4800, "warning");
      const rt = encodeURIComponent(router.asPath || "/plans/deep-dive");
      router.push(`/auth/signin?returnTo=${rt}`);
      return;
    }

    const questionnaire = buildQuestionnairePayload();
    const listingId = listingContext.listingId?.trim();
    const primaryListingUrl =
      propertyDetails.listingLink.trim() || listingContext.listingUrl || "";

    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const callbackPath = `/order/received?plan=deepDive&q=${encodeURIComponent(
      primaryListingUrl
    )}`;
    const callbackUrl = origin ? `${origin}${callbackPath}` : undefined;

    const payload = {
      plan: "deepDive" as const,
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
            plan: "deepDive",
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
        title: "Step 1/3 - Property Basics",
        highlightWidthPct: 35,
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
        title: "Step 2/3 - Legal Documents (Optional)",
        highlightWidthPct: 65,
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
        key: "buyer-information",
        title: "Step 3/3 - Buyer Information",
        highlightWidthPct: 100,
        render: () => (
          <BuyerInformationStep
            values={buyerInfo}
            onChange={handleBuyerInfoChange}
            hasUserContext={Boolean(user)}
          />
        ),
      },
    ],
    [
      buyerInfo,
      documentUploads,
      handleBuyerInfoChange,
      handleDocumentClear,
      handleDocumentUpload,
      handleCategorySelect,
      handlePropertyFieldChange,
      handleTogglePropertyStatus,
      handleTogglePropertyType,
      propertyDetails,
      user,
    ]
  );

  const totalSteps = steps.length;
  const activeStep = useMemo(() => steps[stepIndex], [steps, stepIndex]);

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
  const hasUploadedDocuments = useMemo(
    () =>
      Object.values(documentUploads).some(
        (entry) => entry?.refs && entry.refs.length > 0
      ),
    [documentUploads]
  );
  const isLegalDocumentStep = activeStep.key === "legal-documents";

  const handlePrimaryAction = useCallback(async () => {
    if (isSubmitting) return;
    const checklist = [
      validatePropertyBasics,
      validateDocuments,
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
  ]);

  const disableNext =
    (isLegalDocumentStep && anyUploadsInProgress) || (isLast && isSubmitting);

  return (
    <>
      <Head>
        <title>Deep Dive • Inda</title>
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
              isBusy={isLast && isSubmitting}
              nextLabelOverride={
                isLegalDocumentStep && !hasUploadedDocuments
                  ? "Skip for now"
                  : undefined
              }
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

type PropertyBasicsStepProps = {
  values: PropertyDetails;
  onChange: (field: keyof PropertyDetails) => (event: TextInputEvent) => void;
  onSelectCategory: (category: PropertyCategoryOption) => void;
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
    <PropertyMap
      latitude={6.453055}
      longitude={3.3993997}
      zoom={13}
      height="h-64"
      className="border-[#DCEAE8]"
    />
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

const FieldGroup: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="w-full rounded-[28px] border border-[#D7EBE7] bg-white/95 px-5 py-5 sm:px-7 sm:py-6 shadow-[0_6px_24px_rgba(17,31,39,0.06)] space-y-5">
    <div className="space-y-2">
      <h3 className="text-lg sm:text-xl font-semibold text-[#0B1D27]">
        {title}
      </h3>
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
        ? "border-transparent bg-[#4EA8A1] text-white"
        : "border-[#4EA8A1]/40 bg-white text-[#0B1D27] hover:border-[#4EA8A1]"
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
    <p className="text-xs font-semibold uppercase tracking-wide text-[#6B8C8A]">
      {title}
    </p>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
      <h2 className="text-xl font-semibold">Upload Documents (optional)</h2>
      <p className="text-sm text-[#5E7572]">
        Share any legal documents you already have to speed up verification. You
        can skip this for now and return later. PDF, JPG, PNG (max 25MB).
      </p>
    </div>
    <div className="flex flex-col gap-6">
      {uploads.map((item) => (
        <UploadCard
          key={item.key}
          inputId={`deep-dive-${item.key}`}
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImageFile = Boolean(
    primaryFile && primaryFile.type?.toLowerCase().startsWith("image/")
  );

  useEffect(() => {
    if (primaryFile && isImageFile) {
      const objectUrl = URL.createObjectURL(primaryFile);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
      };
    }

    setPreviewUrl(null);
    return () => undefined;
  }, [primaryFile, isImageFile]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <label
        htmlFor={inputId}
        className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#DCEAE8] bg-[#4EA8A11F] transition sm:w-48 ${
          isUploading
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-[#4EA8A1]"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-1 text-[#4EA8A1]">
            <FiLoader className="h-7 w-7 animate-spin" />
            <span className="text-xs font-medium">Uploading…</span>
          </div>
        ) : hasFiles ? (
          <div className="flex flex-col items-center gap-2 text-[#0B1D27]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={primaryFile?.name || "Uploaded document preview"}
                width={160}
                height={96}
                unoptimized
                className="h-16 w-24 rounded-lg object-cover shadow-sm"
              />
            ) : (
              <FiFileText className="h-8 w-8 text-[#4EA8A1]" />
            )}
            <div className="text-center">
              <p className="text-xs font-semibold truncate max-w-[140px]">
                {primaryFile?.name}
              </p>
              <p className="text-[11px] text-[#4EA8A1]">
                {formatBytes(primaryFile?.size ?? 0)}
              </p>
            </div>
          </div>
        ) : (
          <>
            <FiUploadCloud className="h-8 w-8 text-[#4EA8A1]" />
            <div className="text-center">
              <p className="text-xs font-medium text-[#4EA8A1]">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-[#5E7572]">
                PDF, JPG, PNG (max. 5MB)
              </p>
            </div>
          </>
        )}
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
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Full Name
        </span>
        <Input
          placeholder="Enter name"
          className="w-full"
          value={values.fullName}
          onChange={onChange("fullName")}
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Contact Email
        </span>
        <Input
          type="email"
          placeholder="Enter email"
          className="w-full"
          value={values.email}
          onChange={onChange("email")}
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Phone number
        </span>
        <Input
          type="tel"
          placeholder="Enter phone"
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

type WizardControlsProps = {
  onBack: () => void;
  onNext: () => Promise<void> | void;
  isFirst: boolean;
  isLast: boolean;
  disableNext?: boolean;
  isBusy?: boolean;
  nextLabelOverride?: string;
};

const WizardControls: React.FC<WizardControlsProps> = ({
  onBack,
  onNext,
  isFirst,
  isLast,
  disableNext,
  isBusy,
  nextLabelOverride,
}) => {
  const backDisabled = isFirst || Boolean(isBusy);
  const nextDisabled = Boolean(disableNext || isBusy);
  const baseLabel = isLast
    ? isBusy
      ? "Saving…"
      : "Save"
    : isBusy
    ? "Working…"
    : "Next";
  const label =
    !isLast && !isBusy && nextLabelOverride ? nextLabelOverride : baseLabel;

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

export default DeepDiveWizardPage;
