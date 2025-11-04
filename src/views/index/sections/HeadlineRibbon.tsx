import { motion } from "framer-motion";
import React from "react";
import Marquee from "./Marquee";

const HeadlineRibbon: React.FC = () => (
  <motion.section
    className="w-full flex flex-col items-center justify-center min-h-[60vh] py-12 sm:py-16 md:py-20 rounded-t-[32px] sm:rounded-t-[48px] mt-[-32px] sm:mt-[-48px] relative z-0 overflow-x-hidden px-4 sm:px-6 lg:px-8"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <p className="text-[#101820F2] text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-12 sm:mb-16 md:mb-20 leading-tight max-w-5xl mx-auto px-4">
        Would you invest in an asset
        <br />
        without knowing its true worth?
      </p>
    </motion.div>
    <section className="relative flex flex-col items-center justify-center w-full px-0">
      <div className="relative w-full h-[140px] flex items-center justify-center">
        <div className="absolute left-1/2 top-0 w-[120vw] -translate-x-1/2 rotate-[-3deg] z-10 shadow-md overflow-x-hidden">
          <div className="bg-primary h-[106px] px-0 flex items-center text-lg font-semibold whitespace-nowrap border-0 rounded-xl overflow-hidden leading-none">
            <Marquee duration={22}>
              <>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">
                  THE WRONG PROPERTY CAN COST MILLIONS
                </span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
              </>
            </Marquee>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 w-[120vw] -translate-x-1/2 rotate-[3deg] z-20 overflow-x-hidden">
          <div className="bg-primary h-[106px] px-0 flex items-center text-lg font-semibold whitespace-nowrap shadow-md border-0 rounded-xl overflow-hidden leading-none">
            <Marquee duration={18} reverse>
              <>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
                <span className="mx-6">KNOW BEFORE YOU BUY</span>
                <span className="mx-2 text-inda-dark text-xl">✦</span>
              </>
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  </motion.section>
);

export default HeadlineRibbon;
