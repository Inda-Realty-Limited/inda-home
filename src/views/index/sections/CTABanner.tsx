import { motion } from "framer-motion";
import React, { useCallback } from "react";

const CTABanner: React.FC = () => {
  const INDA_WHATSAPP =
    process.env.NEXT_PUBLIC_INDA_WHATSAPP

  const handleCTA = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("openLandingSearch"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const openWhatsApp = useCallback(
    (text: string, phone: string = INDA_WHATSAPP || "") => {
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      if (typeof window !== "undefined") window.open(url, "_blank");
    },
    [INDA_WHATSAPP]
  );

  return (
    <motion.section
      className="w-full flex justify-center items-center py-14 sm:py-20 md:py-24 bg-transparent px-4 sm:px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-full max-w-6xl mx-auto rounded-[40px] sm:rounded-[56px] border border-[#4EA8A1]/60 flex flex-col items-center justify-center px-4 sm:px-8"
        style={{ boxSizing: "border-box" }}
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="hidden sm:block absolute inset-0 pointer-events-none rounded-[56px] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_30%_30%,#4EA8A1_0%,transparent_60%)]" />
        </div>
        <div className="relative z-10 flex flex-col items-center w-full py-10 sm:py-14 md:py-16">
          <motion.h2
            className="text-[#101820F2] text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight max-w-4xl mx-auto px-2 sm:px-4 mb-6 sm:mb-10"
            style={{ letterSpacing: 0 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            See the truth behind that listing today!
          </motion.h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center">
            <motion.button
              className="w-full sm:w-auto bg-[#4EA8A1] text-white text-base sm:text-lg md:text-xl font-medium rounded-full px-8 sm:px-10 md:px-12 py-4 sm:py-5 shadow-lg hover:bg-[#1a2a33] transition-all duration-300 hover:scale-[1.04] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.55 }}
              onClick={handleCTA}
            >
              Try your first search now
            </motion.button>
            <motion.button
              className="w-full sm:w-auto bg-white text-[#0F5E57] border border-[#4EA8A1] text-base sm:text-lg font-medium rounded-full px-8 sm:px-10 py-4 sm:py-5 shadow-sm hover:bg-[#F2FCFB] transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65 }}
              onClick={() =>
                openWhatsApp(
                  "Hello Inda team, I have a question about verifying a property."
                )
              }
            >
              Chat with Us
            </motion.button>
          </div>
          <motion.p
            className="mt-6 text-center text-sm sm:text-base text-[#101820B2] max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            Paste a listing link to see risks, fair value and red flags in
            seconds.
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CTABanner;
