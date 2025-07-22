import React, { JSX } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  as?: keyof JSX.IntrinsicElements;
  noPadding?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "max-w-full",
  noPadding = false,
  as = "div",
}) => {
  const Tag = as;
  const paddingClass = noPadding ? "" : "px-4 sm:px-8";
  return (
    <Tag className={`w-full mx-auto ${paddingClass} ${maxWidth} ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
