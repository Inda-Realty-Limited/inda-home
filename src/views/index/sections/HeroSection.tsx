import { motion } from "framer-motion";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <motion.section
      className="relative overflow-hidden bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#dce7ed_1px,transparent_0)] [background-size:36px_36px] opacity-60" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-[0_15px_50px_-25px_rgba(0,0,0,0.25)] border border-[#e3edf2]"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-inda-teal/10 text-inda-teal font-semibold text-sm">
            ✓
          </div>
          <p className="text-sm sm:text-base font-medium text-[#101820]">
            Trusted by 2000+ real estate professionals
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-extrabold text-[#0f1624] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
          >
            Built for Every Real Estate{" "}
            <span className="text-inda-teal">Decision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-[#4a5568] max-w-3xl mx-auto"
          >
            Turn property insights into action – whether you&apos;re investing,
            developing, or financing real estate.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button className="px-7 py-3.5 rounded-xl bg-inda-teal text-white font-semibold text-lg shadow-lg shadow-inda-teal/25 hover:shadow-xl hover:shadow-inda-teal/30 transition-transform duration-200 hover:-translate-y-0.5">
            Get Started
                  </button>
          <button className="px-7 py-3.5 rounded-xl bg-white text-[#0f1624] font-semibold text-lg border border-[#d8e3ea] hover:border-inda-teal hover:text-inda-teal transition-colors duration-200">
            Book Demo
                        </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
