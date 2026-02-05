// Utility function to map API listing data to PropertyDetail format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapListingToPropertyDetail = (listing: any) => {
  const snapshot = listing.snapshot || {};
  const analytics = listing.analytics || {};
  // Use photosWithMeta (new structure) with fallback to legacy fields
  const photosWithMeta =
    listing.photosWithMeta || snapshot.photosWithMeta || [];
  const images =
    photosWithMeta.length > 0
      ? photosWithMeta.map((p: any) => p.url)
      : snapshot.imageUrls ||
        listing.imageUrls ||
        listing.images ||
        listing.propertyImages ||
        [];
  const priceValue = Number(
    snapshot.priceNGN || listing.purchasePrice || listing.priceNGN || 0,
  );

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    }
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(0)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  // Extract amenities/features
  const amenities = snapshot.amenities || listing.amenities || [];
  const features = Array.isArray(amenities)
    ? amenities
    : amenities
      ? [amenities]
      : [];

  // Check if it's a scanned listing (has listingUrl but might not have _id)
  const isScanned =
    !!(listing.listingUrl || snapshot.listingUrl) && !listing._id;

  // Extract property type
  const propertyType =
    snapshot.propertyTypeStd ||
    listing.propertyTypeStd ||
    snapshot.propertyType ||
    listing.propertyType ||
    null;

  // Extract size information
  const sizeSqm = snapshot.sizeSqm || listing.sizeSqm || null;
  const landSize = snapshot.landSize || listing.landSize || null;
  const sizeDisplay = sizeSqm
    ? `${sizeSqm} m²`
    : landSize
      ? `${landSize} m²`
      : null;

  // Extract date information
  const listedDate =
    snapshot.addedOnDate ||
    listing.addedOnDate ||
    snapshot.createdAt ||
    listing.createdAt;
  const listedDateDisplay = listedDate
    ? new Date(listedDate).toLocaleDateString()
    : null;

  // Extract agent/developer information
  const agentName = snapshot.agentName || listing.agentName || null;
  const agentCompany =
    snapshot.agentCompanyName || listing.agentCompanyName || null;

  // Check if off-plan
  const isOffPlan =
    snapshot.propertyStatus === "Off-Plan" ||
    listing.propertyStatus === "Off-Plan" ||
    snapshot.status === "Off-Plan" ||
    listing.status === "Off-Plan";

  // Developer rating from indaScore
  const indaScore =
    listing.indaScore?.finalScore || analytics.indaScore?.finalScore || null;
  const developerRating = indaScore ? `${Math.round(indaScore)}/100` : "N/A";

  // Calculate data quality completeness based on actual fields
  const calculateCompleteness = () => {
    let score = 0;
    let total = 0;

    // Basic info (40%)
    total += 40;
    if (priceValue > 0) score += 10;
    if (snapshot.bedrooms || listing.bedrooms) score += 10;
    if (snapshot.bathrooms || listing.bathrooms) score += 10;
    if (
      snapshot.microlocationStd ||
      listing.microlocationStd ||
      snapshot.microlocation ||
      listing.microlocation
    )
      score += 10;

    // Documents (30%)
    total += 30;
    const docs =
      listing.documentsWithMeta || listing.legalDocs || listing.titleDocs || [];
    const hasTitle =
      Array.isArray(docs) &&
      docs.some(
        (d: any) =>
          (d.type || d.label || d || "")
            .toString()
            .toLowerCase()
            .includes("title") ||
          (d.type || d.label || d || "")
            .toString()
            .toLowerCase()
            .includes("c of o") ||
          (d.type || d.label || d || "")
            .toString()
            .toLowerCase()
            .includes("deed"),
      );
    const hasSurvey =
      Array.isArray(docs) &&
      docs.some((d: any) =>
        (d.type || d.label || d || "")
          .toString()
          .toLowerCase()
          .includes("survey"),
      );
    if (hasTitle) score += 15;
    if (hasSurvey) score += 15;

    // Photos (20%)
    total += 20;
    const photoCount = images.length;
    if (photoCount >= 10) score += 20;
    else if (photoCount >= 5) score += 15;
    else if (photoCount >= 3) score += 10;
    else if (photoCount >= 1) score += 5;

    // Intelligence data (10%)
    total += 10;
    if (listing.intelligenceData || snapshot.intelligenceData) score += 10;

    return Math.round((score / total) * 100);
  };

  const completeness = calculateCompleteness();
  const missingFields: string[] = [];
  if (completeness < 80) {
    if (
      !listing.documentsWithMeta?.length &&
      !listing.legalDocs?.length &&
      !listing.titleDocs?.length
    ) {
      missingFields.push("Legal documents");
    }
    if (images.length < 5) {
      missingFields.push("More photos");
    }
    if (!listing.intelligenceData && !snapshot.intelligenceData) {
      missingFields.push("Location intelligence");
    }
  }

  // Social proof - use real data from listing
  const socialProof = {
    views: listing.views || snapshot.views || 0,
    interestedBuyers: listing.leads || listing.engaged || snapshot.leads || 0,
    lastUpdated: new Date(
      listing.updatedAt ||
        listing.createdAt ||
        snapshot.updatedAt ||
        Date.now(),
    ).toLocaleDateString(),
  };

  // Off-plan data - use real data from backend if available
  const backendOffPlanData = listing.offPlanData || snapshot.offPlanData;
  const constructionMilestones =
    listing.constructionMilestones || snapshot.constructionMilestones;

  const offPlanData = isOffPlan
    ? backendOffPlanData
      ? {
          developerClaimedCompletion:
            backendOffPlanData.developerClaimedCompletion || 0,
          indaVerifiedCompletion:
            backendOffPlanData.indaVerifiedCompletion || 0,
          lastVerificationDate:
            backendOffPlanData.lastVerificationDate || "Not verified",
          expectedHandoverDate:
            listing.expectedCompletion ||
            snapshot.expectedCompletion ||
            backendOffPlanData.expectedHandoverDate ||
            "TBD",
          milestones:
            backendOffPlanData.milestones ||
            constructionMilestones?.map((m: any, i: number) => ({
              number: i + 1,
              name: m.name,
              status:
                m.status === "complete"
                  ? "Complete"
                  : m.status === "in-progress"
                    ? "In Progress"
                    : "Not Started",
              developerClaimed: 0,
              indaVerified: 0,
              paymentPercentage: 0,
              paymentReleased: false,
              verificationDate: m.expectedDate,
            })) ||
            [],
        }
      : {
          // Minimal off-plan info when no detailed data available
          developerClaimedCompletion: 0,
          indaVerifiedCompletion: 0,
          lastVerificationDate: "Not verified",
          expectedHandoverDate:
            listing.expectedCompletion || snapshot.expectedCompletion || "TBD",
          milestones:
            constructionMilestones?.map((m: any, i: number) => ({
              number: i + 1,
              name: m.name,
              status:
                m.status === "complete"
                  ? "Complete"
                  : m.status === "in-progress"
                    ? "In Progress"
                    : "Not Started",
              developerClaimed: 0,
              indaVerified: 0,
              paymentPercentage: 0,
              paymentReleased: false,
              verificationDate: m.expectedDate,
            })) || [],
        }
    : undefined;

  return {
    id: listing._id || listing.id || String(Math.random()),
    name:
      snapshot.title ||
      listing.title ||
      `${snapshot.bedrooms || listing.bedrooms || 0}-Bed ${propertyType || "Property"}`,
    location:
      snapshot.microlocationStd ||
      listing.microlocationStd ||
      snapshot.microlocation ||
      listing.microlocation ||
      snapshot.lga ||
      listing.lga ||
      snapshot.state ||
      listing.state ||
      "Lagos",
    price: formatPrice(priceValue),
    priceNumeric: priceValue,
    images: images.length > 0 ? images : [], // Empty array - UI should handle "no images" state
    bedrooms: snapshot.bedrooms || listing.bedrooms || 0,
    developerRating,
    isScanned,
    scannedFrom: listing.listingUrl || snapshot.listingUrl || null,
    // For offer/inquiry submission
    listingId: listing._id || listing.id || null,
    agentUserId: listing.userId || snapshot.userId || null,
    dataQuality: {
      completeness,
      lastVerified: new Date(
        listing.updatedAt ||
          listing.createdAt ||
          snapshot.updatedAt ||
          Date.now(),
      ).toLocaleDateString(),
      missingFields,
    },
    socialProof,
    scannedData: {
      bathrooms: snapshot.bathrooms || listing.bathrooms || null,
      parkingSpaces: snapshot.parkingSpaces || listing.parkingSpaces || null,
      propertyType,
      description: snapshot.description || listing.description || null,
      features,
      landSize: sizeDisplay,
      builtUpArea: snapshot.builtUpArea || listing.builtUpArea || null,
      listedDate: listedDateDisplay,
    },
    listedBy:
      agentName || agentCompany
        ? {
            name: agentName || agentCompany || "Agent",
            company: agentCompany || agentName || "Real Estate",
            verified: listing.verified || snapshot.verified || false,
          }
        : null,
    isOffPlan,
    offPlanData,
    // Include intelligence data if available
    intelligenceData:
      listing.intelligenceData || snapshot.intelligenceData || null,
  };
};

// Export type for the mapped property
export interface MappedProperty {
  id: string;
  name: string;
  location: string;
  price: string;
  priceNumeric: number;
  images: string[];
  bedrooms: number;
  developerRating: string;
  isScanned: boolean;
  scannedFrom: string | null;
  listingId: string | null;
  agentUserId: string | null;
  dataQuality: {
    completeness: number;
    lastVerified: string;
    missingFields: string[];
  };
  socialProof: {
    views: number;
    interestedBuyers: number;
    lastUpdated: string;
    recentActivity?: string;
  };
  scannedData: {
    bathrooms: number | null;
    parkingSpaces: number | null;
    propertyType: string | null;
    description: string | null;
    features: string[];
    landSize: string | null;
    builtUpArea: string | null;
    listedDate: string | null;
  };
  listedBy: {
    name: string;
    company: string;
    verified: boolean;
  } | null;
  isOffPlan: boolean;
  offPlanData?: any;
  intelligenceData?: any;
}
