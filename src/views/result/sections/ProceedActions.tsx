import React from "react";

type Props = {
  onDeeperVerification: () => void;
  onBuyWithInda: () => void;
  onFinanceWithInda: () => void;
  legalDisclaimer?: string;
  disabled?: boolean;
};

const ProceedActions: React.FC<Props> = ({
  onDeeperVerification,
  onBuyWithInda,
  onFinanceWithInda,
  legalDisclaimer,
  disabled = false,
}) => {
  const baseBtn =
    "w-full min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl text-base sm:text-lg font-medium transition-colors";
  const enabledStyles = "bg-inda-teal text-[#F9F9F9] hover:bg-[#0A655E]";
  const disabledStyles =
    "bg-inda-teal text-[#F9F9F9] opacity-50 cursor-not-allowed pointer-events-none";
  return (
    <div className="w-full px-6">
      <div className="rounded-lg p-6 sm:p-8">
        <div className="rounded-xl py-8 sm:py-12 px-4 sm:px-8 bg-white/80 border border-gray-200 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 sm:mb-10 text-center text-inda-teal">
            How would you like to proceed?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <button
              disabled={disabled}
              onClick={onDeeperVerification}
              className={`${baseBtn} ${disabled ? disabledStyles : enabledStyles}`}
            >
              Run Deeper Verification
            </button>
            <button
              disabled={disabled}
              onClick={onBuyWithInda}
              className={`${baseBtn} ${disabled ? disabledStyles : enabledStyles}`}
            >
              Buy with Inda
            </button>
            <button
              disabled={disabled}
              onClick={onFinanceWithInda}
              className={`${baseBtn} ${disabled ? disabledStyles : enabledStyles}`}
            >
              Finance with Inda
            </button>
          </div>
        </div>
        {legalDisclaimer && (
          <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Legal Disclaimer
            </h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {legalDisclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProceedActions;
