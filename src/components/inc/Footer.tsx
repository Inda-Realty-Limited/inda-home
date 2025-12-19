import React from "react";
import {
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const links = {
    instagram:
      "https://www.instagram.com/inda_insights/",
    linkedin:
    "https://ng.linkedin.com/company/investinda",
  } as const;
  return (
    <footer className="w-full bg-inda-dark/90 flex flex-col items-center justify-center pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <a
          href="#"
          className="text-white text-base sm:text-lg md:text-xl font-normal opacity-80 hover:opacity-100 transition"
        >
          Terms of Service
        </a>
        <a
          href="#"
          className="text-white text-base sm:text-lg md:text-xl font-normal opacity-80 hover:opacity-100 transition"
        >
          Privacy Policy
        </a>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
    

        <a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-white text-2xl sm:text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaInstagram />
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-white text-2xl sm:text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaLinkedin />
        </a>
      </div>
      <div className="text-white text-sm sm:text-base md:text-lg text-center opacity-80 max-w-4xl px-4">
        © 2025 Inda, Inc. All rights reserved. Inda provides market insights,
        not legal advice or licensed valuation.
      </div>
    </footer>
  );
};

export default Footer;
