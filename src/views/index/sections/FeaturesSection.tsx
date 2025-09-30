import { Text } from "@/components";
import { motion } from "framer-motion";
import React from "react";
import { featureCards } from "../landingData";

const FeaturesSection: React.FC = () => (
  <motion.section
    className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-[10%]"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-6 sm:mb-8">
        Features
      </Text>
    </motion.div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {featureCards.map((card, index) => (
        <motion.div
          key={card.title}
          className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
        >
          <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
            <card.icon />
          </span>
          <span className="text-white text-xl sm:text-2xl font-medium">
            {card.title}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default FeaturesSection;
