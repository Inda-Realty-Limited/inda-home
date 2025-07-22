import React from "react";

type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

type TextProps = {
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
  size?: TextSize;
};

const Text: React.FC<TextProps> = ({
  as = "p",
  children,
  className = "",
  size = "base",
}) => {
  const Tag = as;
  const sizeClass = `text-${size}`;
  return <Tag className={`${sizeClass} ${className}`}>{children}</Tag>;
};

export default Text;
