import { startPayment } from "@/api/payments";
import PricingPlans from "@/components/inc/PricingPlans";
import { motion } from "framer-motion";
import React, { useState } from "react";
// Close icon removed per design; click outside to close instead

export type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  listingUrl: string | null | undefined;
  onPaid?: () => void;
  freeAvailable?: boolean;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  listingUrl,
  onPaid,
  freeAvailable,
}) => {
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaidPlans, setShowPaidPlans] = useState(false);

  const reset = () => {
    setIsStartingPayment(false);
    setPaymentError(null);
    setShowPaidPlans(false);
  };

  const handleClose = () => {
    // Prevent closing while payment is starting
    if (isStartingPayment) return;
    reset();
    onClose?.();
  };

  const handleChoosePlan = async (plan: string) => {
    try {
      setIsStartingPayment(true);
      setPaymentError(null);

      if (!listingUrl) {
        setPaymentError("Listing URL is missing.");
        return;
      }

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const cacheBust = `cb=${Date.now()}`;
      // For Deep Dive and Deeper Dive, redirect to the order received page.
      // Instant should continue to return to the results page.
      const isDeep = plan === "deepDive" || plan === "deeperDive";
      const callbackPath = isDeep
        ? `/order/received?plan=${encodeURIComponent(
            plan
          )}&q=${encodeURIComponent(listingUrl)}&${cacheBust}`
        : `/result?q=${encodeURIComponent(listingUrl)}&type=link&${cacheBust}`;
      const callbackUrl = origin ? `${origin}${callbackPath}` : callbackPath;

      // Free plan: backend will auto-complete and return success without redirect
      const payload =
        plan === "free"
          ? { listingUrl, plan }
          : { listingUrl, plan, callbackUrl };
      const data = await startPayment(payload as any);
      const url = data?.authorizationUrl || data?.initResponse?.data?.link;

      if (plan === "free") {
        // Success path for free plan
        if (data?.status === "success" || data?.status === "CREATED") {
          onPaid?.();
          handleClose();
          return;
        } else {
          setPaymentError("Free view failed. Please try a paid plan.");
        }
      } else {
        if (url) {
          // Redirect the whole window to provider checkout; callback returns to our app.
          window.location.href = url;
        } else {
          setPaymentError("Couldn't start payment. Please try again.");
        }
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

          {!showPaidPlans ? (
            // Step 1: Free vs Pay choice
            <div className="w-full">
              <div className="max-w-[1314px] mx-auto bg-white rounded-[16px] sm:rounded-[24px]">
                <div className="bg-[rgba(105,217,188,0.35)] rounded-[16px] sm:rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
                  {/* Cancel Button */}
                  <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8">
                    <div className="text-left flex-1 pr-2">
                      <h2 className="text-inda-dark font-bold text-lg sm:text-2xl md:text-3xl mb-1 sm:mb-2">
                        Choose Your Option
                      </h2>
                      <p className="font-normal text-xs sm:text-sm md:text-md text-[#556457]">
                        Get property analysis instantly
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-white/50 transition-colors flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
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

                  <div className="bg-[#F9F9F980] rounded-[16px] sm:rounded-[24px] p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Free Option */}
                    <div className="w-full">
                      <div className="p-4 sm:p-6 h-full flex flex-col bg-white rounded-lg border-2 border-transparent hover:border-[#4ea8a1] transition-all duration-300">
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="font-bold text-3xl sm:text-4xl mb-2 text-[#4ea8a1]">
                            ₦0
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            Free View
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            One-time trial per user
                          </p>
                        </div>
                        <div className="flex-1 mb-6">
                          <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-center gap-3">
                              <span className="text-[#4ea8a1] text-lg">✓</span>
                              Basic property analysis
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="text-[#4ea8a1] text-lg">✓</span>
                              Market value estimate
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="text-[#4ea8a1] text-lg">✓</span>
                              Location insights
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="text-[#eab308] text-lg">⚠</span>
                              One-time use only
                            </li>
                          </ul>
                        </div>
                        <button
                          onClick={() =>
                            freeAvailable && handleChoosePlan("free")
                          }
                          disabled={!freeAvailable}
                          className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                            freeAvailable
                              ? "bg-[#4ea8a1] text-white hover:bg-[#3d8a84] hover:scale-105"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {freeAvailable ? "View for Free" : "Free View Used"}
                        </button>
                      </div>
                    </div>

                    {/* Pay Option */}
                    <div className="w-full">
                      <div className="p-4 sm:p-6 h-full flex flex-col bg-gradient-to-br from-[#2A2A2A] to-[#1a1a1a] rounded-lg border-2 border-transparent hover:border-[#4ea8a1] transition-all duration-300">
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="font-bold text-2xl sm:text-3xl md:text-4xl mb-2 text-white">
                            Starting ₦7,500
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            Premium Reports
                          </h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Professional analysis & verification
                          </p>
                        </div>
                        <div className="flex-1 mb-6">
                          <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3">
                              <span className="text-white text-lg">✓</span>
                              Complete property analysis
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="text-white text-lg">✓</span>
                              Detailed market data
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="text-white text-lg">✓</span>
                              Legal document verification
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="text-white text-lg">✓</span>
                              Multiple plan options
                            </li>
                          </ul>
                        </div>
                        <button
                          onClick={() => setShowPaidPlans(true)}
                          className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-semibold hover:bg-[#3d8a84] hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                        >
                          Choose Paid Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Show paid plans with back button
            <div className="w-full">
              <div className="max-w-[1314px] mx-auto bg-white rounded-[16px] sm:rounded-[24px]">
                <div className="bg-[rgba(105,217,188,0.35)] rounded-[16px] sm:rounded-[24px] md:rounded-[32px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
                  {/* Header with Back and Cancel */}
                  <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <button
                      onClick={() => setShowPaidPlans(false)}
                      className="flex items-center gap-1 sm:gap-2 text-[#556457] hover:text-[#4ea8a1] transition-colors text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
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
                    onChoosePlan={handleChoosePlan}
                    showOnlyPaid={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default PaymentModal;
