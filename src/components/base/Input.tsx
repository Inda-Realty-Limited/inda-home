import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`px-4 py-3 rounded-xl border border-[#D7EBE7] bg-white text-[#0B1D27] shadow-[0_2px_10px_rgba(15,61,65,0.04)] placeholder:text-[#6B8C8A] focus:outline-none focus:border-[#4EA8A1] focus:ring-2 focus:ring-[#4EA8A1]/30 transition ${className}`}
      {...props}
    />
  );
};

export default Input;
