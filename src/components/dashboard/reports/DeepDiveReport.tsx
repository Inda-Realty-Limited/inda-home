import React from "react";
import { PropertyReport, PropertyReportData } from "@/components/reports/PropertyReport";

interface DeepDiveReportProps {
  data: any;
  reportRef?: React.RefObject<HTMLDivElement | null>;
}

const DeepDiveReport: React.FC<DeepDiveReportProps> = ({ data }) => {
  if (!data) return null;

  const property: PropertyReportData = data.property ?? {
    name: data.propertyOverview?.title || data.propertyOverview?.propertyType || "Property",
    location: data.propertyOverview?.location || "",
    price: 0,
    bed: undefined,
    bath: undefined,
    size: data.propertyOverview?.landSize,
    type: data.propertyOverview?.propertyType,
    yearBuilt: data.propertyOverview?.yearBuilt
      ? Number(data.propertyOverview.yearBuilt)
      : undefined,
  };

  return <PropertyReport property={property} />;
};

export default DeepDiveReport;
export type { DeepDiveReportProps as ReportProps };
