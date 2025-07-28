import React from "react";

type ButtonVariant = "primary" | "secondary" | "raw";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  if (variant === "raw") {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  }
  const base = "px-4 py-2 rounded font-semibold transition cursor-pointer";
  const styleClass =
    variant === "primary"
      ? "bg-inda-teal text-inda-white hover:bg-inda-teal/80 ease-in-out duration-200"
      : "bg-inda-gray text-inda-dark hover:bg-inda-teal";
  return (
    <button className={`${base} ${styleClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
