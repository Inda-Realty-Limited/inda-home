import React from "react";

export interface SvgIconProps {
  SvgComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  width?: number | string;
  height?: number | string;
  className?: string;
  alt?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  SvgComponent,
  width = 24,
  height = 24,
  className = "",
  alt = "SVG Icon",
}) => {
  return <SvgComponent className={className} aria-label={alt} />;
};

export default SvgIcon;
