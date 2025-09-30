import { Text } from "@/components";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const PlansPricingSection: React.FC = () => {
  const router = useRouter();

  const handlePlanSelect = useCallback(
    (plan: "free" | "instant" | "deep-dive" | "deeper-dive") => {
      if (typeof window !== "undefined") {
        if (plan === "free" || plan === "instant") {
          window.dispatchEvent(new Event("openLandingSearch"));
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (plan === "deep-dive") {
          router.push("/plans/deep-dive");
          return;
        }
        const params = new URLSearchParams();
        params.set("plan", plan);
        router.push(`/auth?${params.toString()}`);
      }
    },
    [router]
  );

  return (
    <motion.section
      className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-full max-w-full sm:max-w-[80%] mx-auto">
        <motion.div
          className="bg-[rgba(105,217,188,0.35)] rounded-[48px] p-8 sm:p-12 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left mb-12"
          >
            <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-2">
              Plans & Pricing
            </Text>
            <p className="font-normal text-md text-[#556457]">
              Inda Pricing Guide (Lagos Listings Only)
            </p>
          </motion.div>
          <div className="bg-[#F9F9F980] rounded-[24px] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0">
            {/* Free Report */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="w-full"
            >
              <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 rounded-lg sm:rounded-none">
                <div className="text-left mb-4 sm:mb-6">
                  <motion.div
                    className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    ₦0
                  </motion.div>
                  <motion.h3
                    className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Free Report
                  </motion.h3>
                  <motion.p
                    className="text-xs sm:text-sm text-gray-600 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    Delivery Time: &lt;20 seconds
                  </motion.p>
                </div>

                <motion.div
                  className="flex-1 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                    What You Get:
                  </h4>
                  <ul className="space-y-2">
                    <motion.li
                      className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <span className="text-[#4ea8a1] text-base sm:text-lg">
                        ✓
                      </span>
                      Inda Score
                    </motion.li>
                  </ul>
                </motion.div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect("free")}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-[#4EA8A1] text-white text-sm sm:text-base font-semibold px-6 py-3 transition-all duration-300 hover:bg-[#3d9691] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/30"
                >
                  Choose plan
                </button>
              </div>
            </motion.div>

            {/* Instant Report */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="w-full"
            >
              <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 rounded-lg sm:rounded-none">
                <div className="text-left mb-4 sm:mb-6">
                  <motion.div
                    className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    ₦7,500
                  </motion.div>
                  <motion.h3
                    className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Inda Instant Report
                  </motion.h3>
                  <motion.p
                    className="text-xs sm:text-sm text-gray-600 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    Delivery Time: &lt;30 seconds (Instant)
                  </motion.p>
                </div>

                <motion.div
                  className="flex-1 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                    What You Get:
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Inda Score",
                      "Micro-location market data",
                      "AI market valuation",
                      "Overpricing check",
                    ].map((feature, idx) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect("instant")}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-[#4EA8A1] text-white text-sm sm:text-base font-semibold px-6 py-3 transition-all duration-300 hover:bg-[#3d9691] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/30"
                >
                  Choose plan
                </button>
              </div>
            </motion.div>

            {/* Deep Dive Report */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.3 } }}
              className="relative -mt-4 sm:-mt-8 lg:-mt-12 w-full"
            >
              <div className="bg-[#2A2A2A] rounded-[20px] sm:rounded-[32px] p-4 sm:p-6 h-full flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="text-left mb-4 sm:mb-6">
                  <motion.div
                    className="font-bold text-3xl sm:text-4xl mb-2 text-white"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    ₦75,000
                  </motion.div>
                  <motion.h3
                    className="text-lg sm:text-xl font-bold text-white mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    Deep Dive Report
                  </motion.h3>
                  <motion.p
                    className="text-xs sm:text-sm text-gray-300 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    Delivery Time: 24-48 hours (via email PDF)
                  </motion.p>
                </div>

                <motion.div
                  className="flex-1 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <h4 className="text-white mb-2 text-xs sm:text-sm font-semibold">
                    What You Get:
                    <span className="font-normal text-gray-300">
                      {" "}
                      Everything in Instant Report
                    </span>
                    <span className="text-white font-semibold"> Plus:</span>
                  </h4>
                  <h5 className="text-white text-xs sm:text-sm font-semibold mb-3">
                    Title & Legal Verification:
                  </h5>
                  <ul className="space-y-2">
                    {[
                      "Certificate of Occupancy (C of O) or Deed check",
                      "Governor's consent check",
                      "Zoning compliance check",
                      "Litigation search (court registry)",
                      "Survey plan verification (boundaries & location)",
                    ].map((feature, idx) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.0 + idx * 0.1 }}
                      >
                        <span className="text-white text-base sm:text-lg">
                          ✓
                        </span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect("deep-dive")}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-white text-[#2A2A2A] text-sm sm:text-base font-semibold px-6 py-3 transition-all duration-300 hover:bg-[#3a3a3a] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#ffffff]/30"
                >
                  Choose plan
                </button>
              </div>
            </motion.div>

            {/* Deeper Dive */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="w-full"
            >
              <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300 rounded-lg sm:rounded-none">
                <div className="text-left mb-4 sm:mb-6">
                  <motion.div
                    className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    ₦100,000
                  </motion.div>
                  <motion.h3
                    className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    Deeper Dive
                  </motion.h3>
                  <motion.p
                    className="text-xs sm:text-sm text-gray-600 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    Delivery Time: 2-4 Days
                  </motion.p>
                </div>

                <motion.div
                  className="flex-1 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                    What You Get:
                    <span className="font-normal text-gray-600">
                      {" "}
                      Everything in Instant Report
                    </span>
                    <span className="text-[#4ea8a1] font-semibold"> Plus:</span>
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Seller identity verification",
                      "On-site property visit",
                      "Photo evidence",
                    ].map((feature, idx) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 + idx * 0.1 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect("deeper-dive")}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-[#4EA8A1] text-white text-sm sm:text-base font-semibold px-6 py-3 transition-all duration-300 hover:bg-[#3d9691] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/30"
                >
                  Choose plan
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PlansPricingSection;
