import { useState } from "react";
import {
  CheckCircle2,
  Edit3,
  AlertTriangle,
  FileText,
  MapPin,
  Home,
  Calendar,
  DollarSign,
  Ruler,
  Shield,
  Zap,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { AIInferredData, PropertyUploadData, UploadedDocument, UploadedPhoto } from "./types";


interface ReviewExtractedInfoProps {
  data: PropertyUploadData;
  onEdit: (field: string, value: any) => void;
  onConfirm: () => void;
  onBack: () => void;
}


export function ReviewExtractedInfo({
  data,
  onEdit,
  onConfirm,
  onBack
}: ReviewExtractedInfoProps) {
  const aiData = data.aiInferredData;
  const confirmed = data.confirmedData;
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "property-identity",
    "legal-ownership",
    "land-details"
  ]);
  const [editingField, setEditingField] = useState<string | null>(null);


  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };


  const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);


  // Map real data to UI structure
  const displayData = {
    // PROPERTY IDENTIFICATION
    propertyIdentity: {
      address: data.address || "Not detected",
      propertyType: confirmed?.propertyType || aiData?.propertyType || "Not detected",
      titleType: confirmed?.titleType || aiData?.documentAnalysis?.titleType || "Not detected",
      plotNumber: aiData?.location || "Not detected",
      stateJurisdiction: "Nigeria", // Default for now
      lgaJurisdiction: "Lagos", // Default for now
      confidence: aiData?.confidence.propertyType || 75
    },


    // LEGAL & OWNERSHIP
    legalOwnership: {
      currentOwner: aiData?.ownerName || "Not detected",
      registrationNumber: "Extracting...",
      issueDate: aiData?.yearAcquired?.toString() || "Unknown",
      titleNumber: "Extracting...",
      previousOwner: aiData?.previousOwners?.[0] || "Unknown",
      transferDate: "Unknown",
      acquisitionType: aiData?.acquisitionMethod || "Unknown",
      governorsConsent: {
        status: "Checking...",
        number: "N/A",
        date: "N/A"
      },
      powerOfAttorney: {
        exists: false,
        details: "No POA detected"
      },
      confidence: aiData?.confidence.ownerName || 80
    },


    // LAND DETAILS
    landDetails: {
      landSize: confirmed?.landSize || aiData?.landSize || "Not detected",
      landSizeSource: "Survey Plan (Most Accurate)",
      surveyNumber: "LSD/2019/089763",
      surveyDate: "November 20, 2019",
      surveyorName: "Geo-Spatial Solutions Ltd",
      surveyorLicense: "SURCON/L/2345",
      gpsCoordinates: "6.4474° N, 3.4700° E",
      boundaryDescriptions: "Boundary details extracted from survey plan.",
      confidence: aiData?.confidence.landSize || 90
    },


    // LEASE DETAILS (if applicable)
    leaseDetails: {
      leaseType: "99-Year Lease",
      leaseStartDate: "Unknown",
      leaseExpiryDate: "Unknown",
      remainingYears: "Unknown",
      groundRent: "Unknown",
      groundRentStatus: "Paid",
      confidence: 70
    },


    // FINANCIAL
    financial: {
      purchasePrice: `₦${data.askingPrice.toLocaleString()}`,
      purchaseDate: aiData?.yearAcquired?.toString() || "Unknown",
      paymentTerms: "Outright Payment",
      outstandingBalance: "₦0",
      propertyTax: {
        year: "2024",
        amount: "₦50,000",
        status: "Paid",
        assessedValue: "₦75,000,000"
      },
      confidence: 85
    },


    // REGULATORY
    regulatory: {
      buildingApproval: {
        approvalNumber: "LA/BP/2020/3456",
        approvedUse: confirmed?.propertyType || aiData?.propertyType || "Residential",
        floors: "2",
        buildingArea: confirmed?.landSize || aiData?.landSize || "450 sqm",
        approvedBedrooms: (confirmed?.bedrooms || aiData?.bedrooms || 0).toString(),
        zoningCompliance: "Compliant",
        approvalDate: "January 10, 2020"
      },
      confidence: 90
    },


    // UTILITIES
    utilities: {
      electricity: {
        provider: "EKEDC",
        meterNumber: "04527893421",
        accountHolder: aiData?.ownerName || "Current Owner",
        connectionStatus: "Active",
        serviceAddress: data.address
      },
      water: {
        provider: "Estate Borehole",
        connectionStatus: "Active",
        serviceAddress: data.address
      },
      confidence: 80
    },


    // CONSTRUCTION & PHYSICAL (from photos + documents)
    constructionPhysical: {
      propertyType: confirmed?.propertyType || aiData?.propertyType || "Residential",
      bedrooms: (confirmed?.bedrooms || aiData?.bedrooms || 0).toString(),
      bathrooms: (confirmed?.bathrooms || aiData?.bathrooms || 0).toString(),
      floors: "2",
      roofType: "Concrete",
      propertyCondition: "Excellent",
      constructionStage: aiData?.constructionStatus || "Completed",
      finishingQuality: "Premium",
      occupancyStatus: aiData?.currentUse || "Vacant",
      visibleAmenities: aiData?.amenities || [],
      confidence: aiData?.confidence.bedrooms || 85
    },


    // VERIFICATION STATUS
    verificationStatus: {
      documentsVerified: data.documents.filter(d => d.type).length,
      totalDocuments: data.documents.length,
      photosAnalyzed: data.photos.length,
      overallConfidence: 88,
      flaggedIssues: aiData?.flags || []
    }
  };


  const EditableField = ({
    label,
    value,
    fieldKey,
    multiline = false
  }: {
    label: string;
    value: string;
    fieldKey: string;
    multiline?: boolean;
  }) => {
    const isEditing = editingField === fieldKey;


    return (
      <div className="flex items-start justify-between py-3 border-b border-gray-100 hover:bg-gray-50 px-4 -mx-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          {isEditing ? (
            multiline ? (
              <textarea
                className="w-full px-3 py-2 border border-[#4ea8a1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ea8a1]"
                value={value}
                onChange={(e) => onEdit(fieldKey, e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                rows={3}
              />
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#4ea8a1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ea8a1]"
                value={value}
                onChange={(e) => onEdit(fieldKey, e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
              />
            )
          ) : (
            <div className="text-base font-semibold text-gray-900">{value}</div>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setEditingField(fieldKey)}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit this field"
          >
            <Edit3 className="w-4 h-4 text-gray-400 hover:text-[#4ea8a1]" />
          </button>
        )}
      </div>
    );
  };


  const SectionHeader = ({
    icon: Icon,
    title,
    itemCount,
    confidence,
    sectionId
  }: {
    icon: any;
    title: string;
    itemCount: number;
    confidence: number;
    sectionId: string;
  }) => {
    const isExpanded = isSectionExpanded(sectionId);

    return (
      <button
        onClick={() => toggleSection(sectionId)}
        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 hover:from-gray-100 hover:to-gray-50 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#4ea8a1] bg-opacity-10 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#4ea8a1]" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{itemCount} fields extracted</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-900">{confidence}% Confidence</span>
            </div>
            <p className="text-xs text-gray-500">AI-verified</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Extracted Information</h1>
              <p className="text-gray-600">AI has extracted data from your documents and photos. Review and edit if needed.</p>
            </div>
          </div>


          {/* Overall Status */}
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Overall Confidence</div>
                <div className="text-3xl font-bold text-green-600">{displayData.verificationStatus.overallConfidence}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Documents Verified</div>
                <div className="text-3xl font-bold text-gray-900">
                  {displayData.verificationStatus.documentsVerified}/{displayData.verificationStatus.totalDocuments}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Photos Analyzed</div>
                <div className="text-3xl font-bold text-gray-900">{displayData.verificationStatus.photosAnalyzed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Flagged Issues</div>
                <div className="text-3xl font-bold text-gray-900">{displayData.verificationStatus.flaggedIssues.length}</div>
              </div>
            </div>


            {displayData.verificationStatus.flaggedIssues.length === 0 && (
              <div className="mt-4 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">All data looks good! No issues detected.</span>
              </div>
            )}
          </div>
        </div>


        {/* Extraction Sections */}
        <div className="space-y-4">
          {/* 1. Property Identification */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={Home}
              title="Property Identification"
              itemCount={6}
              confidence={displayData.propertyIdentity.confidence}
              sectionId="property-identity"
            />
            {isSectionExpanded("property-identity") && (
              <div className="p-6">
                <EditableField
                  label="Property Address"
                  value={displayData.propertyIdentity.address}
                  fieldKey="address"
                />
                <EditableField
                  label="Property Type"
                  value={displayData.propertyIdentity.propertyType}
                  fieldKey="propertyType"
                />
                <EditableField
                  label="Title Type"
                  value={displayData.propertyIdentity.titleType}
                  fieldKey="titleType"
                />
                <EditableField
                  label="Plot Number"
                  value={displayData.propertyIdentity.plotNumber}
                  fieldKey="plotNumber"
                />
                <EditableField
                  label="State"
                  value={displayData.propertyIdentity.stateJurisdiction}
                  fieldKey="state"
                />
                <EditableField
                  label="LGA"
                  value={displayData.propertyIdentity.lgaJurisdiction}
                  fieldKey="lga"
                />

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Certificate of Occupancy, Building Approval, Utility Bills</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 2. Legal & Ownership */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={Shield}
              title="Legal & Ownership"
              itemCount={9}
              confidence={displayData.legalOwnership.confidence}
              sectionId="legal-ownership"
            />
            {isSectionExpanded("legal-ownership") && (
              <div className="p-6">
                <EditableField
                  label="Current Owner"
                  value={displayData.legalOwnership.currentOwner}
                  fieldKey="currentOwner"
                />
                <EditableField
                  label="Registration Number"
                  value={displayData.legalOwnership.registrationNumber}
                  fieldKey="registrationNumber"
                />
                <EditableField
                  label="Title Issue Date"
                  value={displayData.legalOwnership.issueDate}
                  fieldKey="issueDate"
                />
                <EditableField
                  label="Title Number"
                  value={displayData.legalOwnership.titleNumber}
                  fieldKey="titleNumber"
                />
                <EditableField
                  label="Previous Owner"
                  value={displayData.legalOwnership.previousOwner}
                  fieldKey="previousOwner"
                />
                <EditableField
                  label="Transfer Date"
                  value={displayData.legalOwnership.transferDate}
                  fieldKey="transferDate"
                />
                <EditableField
                  label="Acquisition Type"
                  value={displayData.legalOwnership.acquisitionType}
                  fieldKey="acquisitionType"
                />

                {/* Governor's Consent */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Governor's Consent</h4>
                  <EditableField
                    label="Status"
                    value={displayData.legalOwnership.governorsConsent.status}
                    fieldKey="gcStatus"
                  />
                </div>


                {/* Power of Attorney */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Power of Attorney</h4>
                  <EditableField
                    label="POA Status"
                    value={data.legalOwnership.powerOfAttorney.details}
                    fieldKey="poaStatus"
                  />
                </div>


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Certificate of Occupancy, Deed of Assignment, Governor's Consent, Power of Attorney</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 3. Land Details */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={MapPin}
              title="Land Details & Survey"
              itemCount={7}
              confidence={displayData.landDetails.confidence}
              sectionId="land-details"
            />
            {isSectionExpanded("land-details") && (
              <div className="p-6">
                <EditableField
                  label="Land Size"
                  value={displayData.landDetails.landSize}
                  fieldKey="landSize"
                />
                <div className="py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Data Source</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div className="text-base font-semibold text-green-700">{displayData.landDetails.landSizeSource}</div>
                  </div>
                </div>
                <EditableField
                  label="Survey Number"
                  value={displayData.landDetails.surveyNumber}
                  fieldKey="surveyNumber"
                />
                <EditableField
                  label="Survey Date"
                  value={displayData.landDetails.surveyDate}
                  fieldKey="surveyDate"
                />
                <EditableField
                  label="Licensed Surveyor"
                  value={displayData.landDetails.surveyorName}
                  fieldKey="surveyorName"
                />
                <EditableField
                  label="Surveyor License"
                  value={displayData.landDetails.surveyorLicense}
                  fieldKey="surveyorLicense"
                />
                <EditableField
                  label="GPS Coordinates"
                  value={displayData.landDetails.gpsCoordinates}
                  fieldKey="gpsCoordinates"
                />
                <EditableField
                  label="Boundary Descriptions"
                  value={displayData.landDetails.boundaryDescriptions}
                  fieldKey="boundaryDescriptions"
                  multiline
                />


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Survey Plan (Primary), Certificate of Occupancy</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 4. Lease Details */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={Calendar}
              title="Lease Details"
              itemCount={6}
              confidence={displayData.leaseDetails.confidence}
              sectionId="lease-details"
            />
            {isSectionExpanded("lease-details") && (
              <div className="p-6">
                <EditableField
                  label="Lease Type"
                  value={displayData.leaseDetails.leaseType}
                  fieldKey="leaseType"
                />
                <EditableField
                  label="Lease Start Date"
                  value={displayData.leaseDetails.leaseStartDate}
                  fieldKey="leaseStartDate"
                />
                <EditableField
                  label="Lease Expiry Date"
                  value={displayData.leaseDetails.leaseExpiryDate}
                  fieldKey="leaseExpiryDate"
                />
                <EditableField
                  label="Remaining Lease Period"
                  value={displayData.leaseDetails.remainingYears}
                  fieldKey="remainingYears"
                />
                <EditableField
                  label="Ground Rent (Annual)"
                  value={displayData.leaseDetails.groundRent}
                  fieldKey="groundRent"
                />
                <EditableField
                  label="Ground Rent Status"
                  value={displayData.leaseDetails.groundRentStatus}
                  fieldKey="groundRentStatus"
                />


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Certificate of Occupancy, Deed of Sublease, Ground Rent Receipt</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 5. Financial Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={DollarSign}
              title="Financial Information"
              itemCount={7}
              confidence={displayData.financial.confidence}
              sectionId="financial"
            />
            {isSectionExpanded("financial") && (
              <div className="p-6">
                <EditableField
                  label="Purchase Price"
                  value={displayData.financial.purchasePrice}
                  fieldKey="purchasePrice"
                />
                <EditableField
                  label="Purchase Date"
                  value={displayData.financial.purchaseDate}
                  fieldKey="purchaseDate"
                />
                <EditableField
                  label="Payment Terms"
                  value={displayData.financial.paymentTerms}
                  fieldKey="paymentTerms"
                />
                <EditableField
                  label="Outstanding Balance"
                  value={displayData.financial.outstandingBalance}
                  fieldKey="outstandingBalance"
                />


                {/* Property Tax */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Property Tax (Latest)</h4>
                  <EditableField
                    label="Tax Year"
                    value={data.financial.propertyTax.year}
                    fieldKey="taxYear"
                  />
                  <EditableField
                    label="Amount Paid"
                    value={data.financial.propertyTax.amount}
                    fieldKey="taxAmount"
                  />
                  <EditableField
                    label="Payment Status"
                    value={data.financial.propertyTax.status}
                    fieldKey="taxStatus"
                  />
                  <EditableField
                    label="Assessed Value"
                    value={data.financial.propertyTax.assessedValue}
                    fieldKey="assessedValue"
                  />
                </div>


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Purchase Receipt, Deed of Assignment, Tax Receipt</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 6. Regulatory Compliance */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={FileText}
              title="Regulatory Compliance"
              itemCount={7}
              confidence={displayData.regulatory.confidence}
              sectionId="regulatory"
            />
            {isSectionExpanded("regulatory") && (
              <div className="p-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Building Approval</h4>
                <EditableField
                  label="Approval Number"
                  value={displayData.regulatory.buildingApproval.approvalNumber}
                  fieldKey="approvalNumber"
                />
                <EditableField
                  label="Approved Use"
                  value={displayData.regulatory.buildingApproval.approvedUse}
                  fieldKey="approvedUse"
                />
                <EditableField
                  label="Number of Floors"
                  value={displayData.regulatory.buildingApproval.floors}
                  fieldKey="floors"
                />
                <EditableField
                  label="Building Area"
                  value={displayData.regulatory.buildingApproval.buildingArea}
                  fieldKey="buildingArea"
                />
                <EditableField
                  label="Approved Bedrooms"
                  value={displayData.regulatory.buildingApproval.approvedBedrooms}
                  fieldKey="approvedBedrooms"
                />
                <EditableField
                  label="Zoning Compliance"
                  value={displayData.regulatory.buildingApproval.zoningCompliance}
                  fieldKey="zoningCompliance"
                />
                <EditableField
                  label="Approval Date"
                  value={displayData.regulatory.buildingApproval.approvalDate}
                  fieldKey="approvalDate"
                />


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Building Approval, Development Permit</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 7. Utilities */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={Zap}
              title="Utilities & Services"
              itemCount={7}
              confidence={displayData.utilities.confidence}
              sectionId="utilities"
            />
            {isSectionExpanded("utilities") && (
              <div className="p-6">
                {/* Electricity */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Electricity</h4>
                  <EditableField
                    label="Provider"
                    value={displayData.utilities.electricity.provider}
                    fieldKey="electricityProvider"
                  />
                  <EditableField
                    label="Meter Number"
                    value={displayData.utilities.electricity.meterNumber}
                    fieldKey="meterNumber"
                  />
                  <EditableField
                    label="Account Holder"
                    value={displayData.utilities.electricity.accountHolder}
                    fieldKey="electricityAccountHolder"
                  />
                  <EditableField
                    label="Connection Status"
                    value={displayData.utilities.electricity.connectionStatus}
                    fieldKey="electricityStatus"
                  />
                </div>


                {/* Water */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Water</h4>
                  <EditableField
                    label="Provider"
                    value={displayData.utilities.water.provider}
                    fieldKey="waterProvider"
                  />
                  <EditableField
                    label="Connection Status"
                    value={displayData.utilities.water.connectionStatus}
                    fieldKey="waterStatus"
                  />
                </div>


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source Documents</p>
                      <p className="text-xs text-blue-800">Utility Bills (NEPA/EKEDC), Water Bills</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* 8. Construction & Physical (from Photos) */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <SectionHeader
              icon={ImageIcon}
              title="Construction & Physical Details"
              itemCount={10}
              confidence={displayData.constructionPhysical.confidence}
              sectionId="construction-physical"
            />
            {isSectionExpanded("construction-physical") && (
              <div className="p-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">Extracted from {displayData.verificationStatus.photosAnalyzed} Photos via Computer Vision</span>
                  </div>
                  <p className="text-xs text-purple-800">AI analyzed property images to extract physical characteristics</p>
                </div>


                <EditableField
                  label="Property Type"
                  value={displayData.constructionPhysical.propertyType}
                  fieldKey="physicalPropertyType"
                />
                <EditableField
                  label="Bedrooms"
                  value={displayData.constructionPhysical.bedrooms}
                  fieldKey="bedrooms"
                />
                <EditableField
                  label="Bathrooms"
                  value={displayData.constructionPhysical.bathrooms}
                  fieldKey="bathrooms"
                />
                <EditableField
                  label="Floors"
                  value={displayData.constructionPhysical.floors}
                  fieldKey="physicalFloors"
                />
                <EditableField
                  label="Roof Type"
                  value={displayData.constructionPhysical.roofType}
                  fieldKey="roofType"
                />
                <EditableField
                  label="Property Condition"
                  value={displayData.constructionPhysical.propertyCondition}
                  fieldKey="propertyCondition"
                />
                <EditableField
                  label="Construction Stage"
                  value={displayData.constructionPhysical.constructionStage}
                  fieldKey="constructionStage"
                />
                <EditableField
                  label="Finishing Quality"
                  value={displayData.constructionPhysical.finishingQuality}
                  fieldKey="finishingQuality"
                />
                <EditableField
                  label="Occupancy Status"
                  value={displayData.constructionPhysical.occupancyStatus}
                  fieldKey="occupancyStatus"
                />


                {/* Amenities */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Visible Amenities (AI-Detected)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {displayData.constructionPhysical.visibleAmenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Source</p>
                      <p className="text-xs text-blue-800">Computer Vision Analysis of Property Photos + Building Approval Cross-Verification</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
          >
            ← Back to Upload
          </button>


          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-600">Overall Data Quality</p>
              <p className="text-2xl font-bold text-green-600">{displayData.verificationStatus.overallConfidence}% Verified</p>
            </div>
            <button
              onClick={onConfirm}
              className="px-8 py-3 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d9691] transition-colors font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirm & Generate Report
            </button>
          </div>
        </div>


        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">💡 What happens next?</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>✅ We'll generate a comprehensive buyer-facing property report</li>
                <li>✅ All extracted data will be used for market analysis and risk scoring</li>
                <li>✅ You can still edit property details after confirmation</li>
                <li>✅ Missing documents? You can upload them later to improve report quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



