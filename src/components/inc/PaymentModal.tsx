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
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  listingUrl,
  onPaid,
}) => {
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const reset = () => {
    setIsStartingPayment(false);
    setPaymentError(null);
  };

  const handleClose = () => {
    // Prevent closing while payment is starting
    if (isStartingPayment) return;
    reset();
    onClose?.();
  };

  const handleChoosePlan = async (plan: string) => {
    if (plan === "free") {
      handleClose();
      return;
    }

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
      const callbackUrl = origin
        ? `${origin}/result?q=${encodeURIComponent(
            listingUrl
          )}&type=link&${cacheBust}`
        : `/result?q=${encodeURIComponent(listingUrl)}&type=link&${cacheBust}`;

      const data = await startPayment({ listingUrl, plan, callbackUrl });
      const url = data?.authorizationUrl || data?.initResponse?.data?.link;

      if (url) {
        // Redirect the whole window to provider checkout; callback returns to our app.
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
        className="w-full max-w-[80%] max-md:w-3/4 max-h-[90vh] overflow-y-auto py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-transparent"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {
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
            <PricingPlans onChoosePlan={handleChoosePlan} />
          </div>
        }
      </motion.section>
    </div>
  );
};

export default PaymentModal;
