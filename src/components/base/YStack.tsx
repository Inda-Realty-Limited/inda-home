import React from "react";

type YStackProps = {
  children: React.ReactNode;
  gap?: number | string;
  className?: string;
};

const YStack: React.FC<YStackProps> = ({
  children,
  gap = 16,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-[${gap}px] ${className}`}>
      {children}
    </div>
  );
};

export default YStack;
