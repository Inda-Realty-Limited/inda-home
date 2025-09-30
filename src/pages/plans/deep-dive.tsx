import { Container, Footer, Input, Navbar } from "@/components";
import React, { useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

const steps = [
  {
    key: "property-basics",
    title: "Step 1/3 - Property Basics",
    highlightWidthPct: 35,
    render: () => <PropertyBasicsStep />,
  },
  {
    key: "legal-documents",
    title: "Step 2/3 - Legal Documents Upload",
    highlightWidthPct: 65,
    render: () => <LegalDocumentsStep />,
  },
  {
    key: "buyer-information",
    title: "Step 3/3 - Buyer Information",
    highlightWidthPct: 100,
    render: () => <BuyerInformationStep />,
  },
];

const DeepDiveWizardPage: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = steps.length;
  const activeStep = useMemo(() => steps[stepIndex], [stepIndex]);

  const goNext = () =>
    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <Container noPadding className="min-h-screen bg-white text-inda-dark">
      <Navbar />
      <main className="max-w-5xl mx-auto w-full px-6 sm:px-10 py-10">
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
            onNext={goNext}
            isFirst={isFirst}
            isLast={isLast}
          />
        </section>
      </main>
      <Footer />
    </Container>
  );
};

const ControlPill: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <button
    type="button"
    className="flex items-center gap-2 rounded-full bg-[#111F27] px-4 py-2 text-sm font-medium hover:bg-[#1a2b35] transition"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StepHeading: React.FC<{ title: string; highlightPct: number }> = ({
  title,
  highlightPct,
}) => (
  <div className="space-y-3">
    <h1 className="text-2xl sm:text-3xl font-semibold text-[#111F27] tracking-tight">
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

const PropertyBasicsStep: React.FC = () => {
  const residentialTypes = ["House", "Duplex", "Flat", "Land", "Others"];
  const commercialTypes = ["Office", "Retail", "Warehouse", "Others"];
  const residentialStatus = ["Off-plan", "Under Construction", "Completed"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#111F27]">Add a property</h2>
        <p className="text-sm text-[#5E7572]">
          Provide core property details so we can begin your verification.
        </p>
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-[#0B1D27] mb-2">
            Property address
          </span>
          <Input placeholder="Enter address" className="w-3/5" />
        </label>
      </div>
      <div className="rounded-2xl border border-[#DCEAE8] bg-[#F7FCFB] overflow-hidden">
        <iframe
          title="Property map"
          className="w-full h-64 border-0"
          loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31512.31113673268!2d3.3993997!3d6.453055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b267a7b0c19%3A0x9d5d7d0d7f4d7ab0!2sLekki%20Phase%201%2C%20Eti-Osa!5e0!3m2!1sen!2sng!4v1700000000000"
          allowFullScreen
        />
      </div>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Listing Link
        </span>
        <Input
          placeholder="Paste link from Nigeria Property Centre"
          className="w-3/5"
        />
      </label>
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <FieldGroup title="Property Type" description="Select property type">
          <SectionedOptions title="Residential" options={residentialTypes} />
          <SectionedOptions title="Commercial" options={commercialTypes} />
        </FieldGroup>
        <FieldGroup
          title="Property Status"
          description="Select property status"
        >
          <SectionedOptions title="Residential" options={residentialStatus} />
        </FieldGroup>
      </div>
    </div>
  );
};

const FieldGroup: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="w-full rounded-[28px] border border-[#D7EBE7] bg-white/95 px-5 py-5 sm:px-7 sm:py-6 shadow-[0_6px_24px_rgba(17,31,39,0.06)] space-y-5">
    <div className="space-y-2">
      <h3 className="text-lg sm:text-xl font-semibold text-[#0B1D27]">
        {title}
      </h3>
      <p className="text-sm text-[#5E7572]">{description}</p>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const SectionedOptions: React.FC<{ title: string; options: string[] }> = ({
  title,
  options,
}) => (
  <div className="space-y-3">
    <p className="text-xs uppercase tracking-wide text-[#6B8C8A] font-semibold">
      {title}
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center justify-between rounded-xl border border-[#4EA8A1]/40 bg-white px-3 py-2 text-sm font-medium text-[#0B1D27] hover:border-[#4EA8A1] cursor-pointer select-none"
        >
          <span>{option}</span>
          <input type="checkbox" className="h-4 w-4 accent-[#4EA8A1]" />
        </label>
      ))}
    </div>
  </div>
);

const LegalDocumentsStep: React.FC = () => {
  const uploads = [
    {
      title: "Upload Certificate of Occupancy (C of O) OR Deed of Assignment",
      optional: false,
    },
    {
      title: "Upload Survey Plan",
      optional: false,
    },
    {
      title: "Upload Governor's Consent",
      optional: true,
    },
    {
      title: "Upload Any Zoning/Building Permit documents",
      optional: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#111F27]">
          Upload Documents
        </h2>
        <p className="text-sm text-[#5E7572]">
          Provide the necessary legal documents to expedite verification. PDF,
          JPG, PNG (max 5MB).
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {uploads.map((item) => (
          <UploadCard
            key={item.title}
            title={item.title}
            optional={item.optional}
          />
        ))}
      </div>
    </div>
  );
};

const UploadCard: React.FC<{ title: string; optional: boolean }> = ({
  title,
  optional,
}) => (
  <div className="flex items-center gap-4">
    <label className="flex-shrink-0 w-48 h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#DCEAE8] bg-[#4EA8A11F] hover:border-[#4EA8A1] transition cursor-pointer">
      <div className="flex flex-col items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#4EA8A1]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="text-center">
          <p className="text-xs font-medium text-[#4EA8A1]">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-[#5E7572] mt-1">
            PDF, JPG, PNG (max. 5MB)
          </p>
        </div>
      </div>
      <input type="file" className="sr-only" />
    </label>
    <div className="flex-1">
      <p className="text-sm font-medium text-[#0B1D27]">{title}</p>
      {optional && (
        <p className="text-xs text-[#5E7572] mt-1">(if applicable)</p>
      )}
    </div>
  </div>
);

const BuyerInformationStep: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-[#111F27]">Full Details</h2>
      <p className="text-sm text-[#5E7572]">
        This section is optional but recommended for verification communication.
      </p>
    </div>
    <div className="grid gap-4 sm:max-w-md">
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Full Name
        </span>
        <Input placeholder="Enter name" className="w-full" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Contact Email
        </span>
        <Input placeholder="Enter email" className="w-full" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-[#0B1D27] mb-2">
          Phone number
        </span>
        <Input placeholder="Enter phone" className="w-full" />
      </label>
    </div>
    <p className="text-xs italic text-[#5E7572]">
      Note: This section is optional but recommended for verification
      communication.
    </p>
  </div>
);

const WizardControls: React.FC<{
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}> = ({ onBack, onNext, isFirst, isLast }) => (
  <div className="flex items-center justify-end gap-3">
    <button
      type="button"
      onClick={onBack}
      disabled={isFirst}
      className="flex items-center gap-2 rounded-lg bg-[#111F27] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiArrowLeft className="text-base" />
      <span>{isFirst ? "Back" : "Back"}</span>
    </button>
    <button
      type="button"
      onClick={onNext}
      className={`rounded-lg px-6 py-3 text-sm font-semibold transition ${
        isLast
          ? "bg-[#4EA8A1] text-white hover:bg-[#3d9691]"
          : "bg-[#4EA8A1] text-white hover:bg-[#3d9691]"
      }`}
    >
      {isLast ? "Save" : "Next"}
    </button>
  </div>
);

export default DeepDiveWizardPage;
