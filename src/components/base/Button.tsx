import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base = "px-4 py-2 rounded font-semibold transition cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-inda-teal text-inda-white hover:bg-inda-dark"
      : "bg-inda-gray text-inda-dark hover:bg-inda-teal";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
