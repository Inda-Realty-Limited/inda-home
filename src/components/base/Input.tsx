import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`px-3 py-2 rounded border border-[#4EA8A1] bg-inda-light text-inda-dark focus:outline-none focus:border-inda-teal ${className}`}
      {...props}
    />
  );
};

export default Input;
