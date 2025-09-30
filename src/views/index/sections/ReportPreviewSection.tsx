import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const ReportPreviewSection: React.FC = () => {
  const router = useRouter();

  const handleSeeSample = useCallback(() => {
    router.push("/result/sample");
  }, [router]);

  return (
    <motion.section
      className="w-[90%] max-sm:w-full flex flex-col px-4 sm:px-6 md:px-8 lg:mx-auto items-center pt-6 sm:pt-8 justify-center min-h-[400px] sm:min-h-[465px] bg-[#F9F9F9]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.p
        className="text-[#101820F2] text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-4 leading-tight max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        See an Inda Report in Action
      </motion.p>
      <div
        className="flex flex-col lg:flex-row items-center lg:items-start w-full max-w-[1100px] 2xl:max-w-[1100px] mx-auto gap-6 sm:gap-8 bg-[#4EA8A129] rounded-2xl p-5 sm:p-[57px] overflow-hidden"
        style={{ boxShadow: "0px 2px 2px 0px #00000026" }}
      >
        <motion.div
          className="flex flex-col items-center justify-center w-full lg:w-auto lg:min-w-[540px]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Image
            src="/assets/images/home.png"
            width={540}
            height={238}
            alt="Modern house preview"
            className="rounded-lg object-cover w-full max-w-[540px] h-auto aspect-[540/238]"
          />
        </motion.div>
        <motion.div
          className="flex flex-col space-y-3 items-center lg:items-start justify-between text-center lg:text-left lg:pl-8 xl:pl-12 w-full lg:flex-1"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-inda-dark font-bold text-xl sm:text-2xl md:text-[28px] mb-1">
            Property Report Preview
          </h3>
          <p className="text-[#101820BD] text-base sm:text-lg md:text-xl max-w-md">
            Get a detailed report on any property, agent or development
            company—including verification status, legal risks, ROI projections,
            and agent trust ratings.
          </p>
          <button
            onClick={handleSeeSample}
            className="w-full sm:w-auto bg-[#0A1A22] text-white text-lg sm:text-xl px-8 sm:px-10 h-[56px] sm:h-[67px] flex items-center justify-center rounded-full hover:bg-[#11242e] transition-all duration-300 hover:scale-105"
          >
            See full report sample
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ReportPreviewSection;
