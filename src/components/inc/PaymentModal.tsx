import { startListingPayment } from "@/api/payments";
import PricingPlans from "@/components/inc/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
// Close icon removed per design; click outside to close instead

export type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  listingUrl: string | null | undefined;
  onPaid?: () => void;
  // If true, open directly on paid plans and use deep-only variant
  startOnPaid?: boolean;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  listingUrl,
  onPaid,
  startOnPaid,
}) => {
  const router = useRouter();
  const {isAuthenticated } = useAuth();
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaidPlans, setShowPaidPlans] = useState(!!startOnPaid);

  const reset = () => {
    setIsStartingPayment(false);
    setPaymentError(null);
    setShowPaidPlans(!!startOnPaid);
  };

  const handleClose = () => {
    // Prevent closing while payment is starting
    if (isStartingPayment) return;
    reset();
    onClose?.();
  };

  type Plan = "deepDive" | "deeperDive";
  const handleChoosePlan = async (plan: Plan) => {
    try {
      setIsStartingPayment(true);
      setPaymentError(null);

      if (!listingUrl) {
        setPaymentError("Listing URL is missing.");
        return;
      }

      // For Deep Dive and Deeper Dive, we no longer take payment directly.
      // Redirect user to the questionnaire flow (auth-aware with returnTo),
      // carrying over the listingUrl so the form can prefill context.
      if (plan === "deepDive" || plan === "deeperDive") {
        const target =
          plan === "deepDive" ? "/plans/deep-dive" : "/plans/deeper-dive";
        const withQuery = `${target}?listingUrl=${encodeURIComponent(
          listingUrl
        )}`;
        if (!isAuthenticated) {
          const rt = encodeURIComponent(withQuery);
          router.push(`/auth/signin?returnTo=${rt}`);
        } else {
          router.push(withQuery);
        }
        return;
      }

      // For paid non-questionnaire flows initiated here (if ever): prepare callback and start
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const cacheBust = `cb=${Date.now()}`;
      const callbackPath = `/result?q=${encodeURIComponent(
        listingUrl
      )}&type=link&${cacheBust}`;
      const callbackUrl = origin ? `${origin}${callbackPath}` : callbackPath;

      const data = await startListingPayment({ listingUrl, plan, callbackUrl });
      const url =
        data?.authorizationUrl ||
        (data as any)?.payment?.authorizationUrl ||
        (data as any)?.payment?.initResponse?.data?.link;
      if ((data as any)?.alreadyPaid) {
        // Treat as paid and close
        onPaid?.();
        handleClose();
        return;
      }
      if (url) {
        window.location.href = url;
      } else {
        setPaymentError("Couldn't start payment. Please try again.");
      }
    } catch (e: any) {
      setPaymentError(
        e?.response?.data?.message || e?.message || "Payment start failed."
      );
    } finally {
      setIsStartingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <motion.section
        className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] max-h-[95vh] overflow-y-auto py-4 sm:py-8 md:py-16 lg:py-20 xl:py-24 px-2 sm:px-4 md:px-6 lg:px-8 bg-transparent"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {isStartingPayment && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-[24px]">
              <div className="flex items-center gap-3 text-[#101820]">
                <div className="w-5 h-5 border-2 border-[#4EA8A1]/30 border-t-[#4EA8A1] rounded-full animate-spin" />
                <span className="text-sm font-medium">Starting payment…</span>
              </div>
            </div>
          )}
          {paymentError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              {paymentError}
            </div>
          )}

          {
            // Step 2: Show paid plans with back button
            <div className="w-full">
              <div className="max-w-[1314px] mx-auto bg-white rounded-[16px] sm:rounded-[24px]">
                <div className="bg-[rgba(105,217,188,0.35)] rounded-[16px] sm:rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
                  {/* Header with Back (hidden when startOnPaid) and Cancel */}
                  <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <div className="w-8 sm:w-10" aria-hidden="true" />
                    <div className="text-center flex-1 px-2">
                      <h2 className="text-inda-dark font-bold text-lg sm:text-2xl md:text-3xl mb-1 sm:mb-2">
                        Premium Plans
                      </h2>
                      <p className="font-normal text-xs sm:text-sm md:text-md text-[#556457]">
                        Choose your analysis depth
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-white/50 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <PricingPlans
                    onChoosePlan={(plan) => {
                      void handleChoosePlan(plan as any);
                    }}
                    showOnlyPaid={true}
                    onlyDeep={!!startOnPaid}
                  />
                </div>
              </div>
            </div>
          }
        </div>
      </motion.section>
    </div>
  );
};

export default PaymentModal;
