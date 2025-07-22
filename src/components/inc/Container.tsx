import React, { JSX } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "max-w-full",
  as = "div",
}) => {
  const Tag = as;
  return (
    <Tag className={`w-full mx-auto px-4 sm:px-8 ${maxWidth} ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
