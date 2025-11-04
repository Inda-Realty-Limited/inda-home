import { Text } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { faqData } from "../landingData";

const FAQItemCard: React.FC<{
  item: (typeof faqData)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, index, isOpen, onToggle }) => (
  <motion.div
    className={`w-full bg-[#4EA8A129] rounded-xl sm:rounded-2xl border border-[#4EA8A129] shadow-sm transition-all duration-300 ${
      isOpen ? "shadow-md" : ""
    } cursor-pointer overflow-hidden`}
    style={{ minHeight: 56 }}
    onClick={onToggle}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-inda-dark text-base sm:text-md md:text-lg lg:text-xl font-medium select-none">
      <span className="flex-1 pr-4">{item.q}</span>
      <motion.svg
        width="28"
        height="28"
        fill="none"
        stroke="#101820"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 transition-transform duration-300"
        style={{ minWidth: 28 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <polyline points="8 12 16 20 24 12" />
      </motion.svg>
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 pt-0 text-inda-dark/90 text-sm sm:text-base md:text-lg font-normal"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="leading-relaxed"
          >
            {item.a}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQSection: React.FC = () => {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <motion.section
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-12 sm:py-16 md:py-20 flex flex-col items-start justify-center"
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
          Frequently Asked Questions
        </Text>
      </motion.div>
      <motion.div
        className="w-full max-w-full sm:max-w-[67%] flex flex-col gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {faqData.map((item, index) => {
          const isOpen = open === index;
          return (
            <FAQItemCard
              key={item.q}
              item={item}
              index={index}
              isOpen={isOpen}
              onToggle={() => setOpen(isOpen ? null : index)}
            />
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default FAQSection;
