import React from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-inda-dark/90 flex flex-col items-center justify-center pt-12 pb-8 px-4">
      <div className="w-full max-w-6xl flex flex-row items-center justify-between mb-8">
        <a
          href="#"
          className="text-white text-xl font-normal opacity-80 hover:opacity-100 transition"
        >
          Terms of Service
        </a>
        <a
          href="#"
          className="text-white text-xl font-normal opacity-80 hover:opacity-100 transition"
        >
          Privacy Policy
        </a>
      </div>
      <div className="flex flex-row items-center justify-center gap-8 mb-8">
        <a
          href="#"
          aria-label="TikTok"
          className="text-white text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaTiktok />
        </a>
        <a
          href="#"
          aria-label="YouTube"
          className="text-white text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaYoutube />
        </a>
        <a
          href="#"
          aria-label="Twitter"
          className="text-white text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaTwitter />
        </a>
        <a
          href="#"
          aria-label="Instagram"
          className="text-white text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaInstagram />
        </a>
        <a
          href="#"
          aria-label="LinkedIn"
          className="text-white text-3xl opacity-80 hover:opacity-100 transition"
        >
          <FaLinkedin />
        </a>
      </div>
      <div className="text-white text-lg text-center opacity-80">
        © 2025 Inda, Inc. All rights reserved. Inda provides market insights,
        not legal advice or licensed valuation.
      </div>
    </footer>
  );
};

export default Footer;
