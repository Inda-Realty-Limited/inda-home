import { Text } from "@/components";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const RiskOpportunitySection: React.FC = () => (
  <motion.section
    className="w-full flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col items-center"
    >
      <Text className="text-[#101820F2] text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-2 leading-tight max-w-5xl mx-auto px-4">
        See Every Risk. <br /> Spot Every Opportunity.
      </Text>
      <Text className="text-[#101820E5] text-center font-normal w-full max-w-[700px] lg:text-[22px] mb-4 sm:mb-6">
        Whether it’s valuation, due diligence, or investment potential, Inda
        delivers a clear, data-backed answer you can trust.
      </Text>
      <Image
        src="/assets/images/risk.png"
        width={800}
        height={400}
        alt="Risk & opportunity visual"
        className="mt-4 w-full max-w-4xl h-auto"
      />
    </motion.div>
  </motion.section>
);

export default RiskOpportunitySection;
