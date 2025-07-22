import React from "react";

type XStackProps = {
  children: React.ReactNode;
  gap?: number | string;
  className?: string;
};

const XStack: React.FC<XStackProps> = ({
  children,
  gap = 16,
  className = "",
}) => {
  return (
    <div className={`flex flex-row gap-[${gap}px] ${className}`}>
      {children}
    </div>
  );
};

export default XStack;
