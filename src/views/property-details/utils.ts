// Utility function to map API listing data to PropertyDetail format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapListingToPropertyDetail = (listing: any) => {
  const snapshot = listing.snapshot || {};
  const analytics = listing.analytics || {};
  const images = snapshot.imageUrls || listing.imageUrls || listing.images || listing.propertyImages || [];
  const priceValue = Number(snapshot.priceNGN || listing.purchasePrice || listing.priceNGN || 0);
  
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
  const features = Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []);

  // Check if it's a scanned listing (has listingUrl but might not have _id)
  const isScanned = !!(listing.listingUrl || snapshot.listingUrl) && !listing._id;

  // Extract property type
  const propertyType = snapshot.propertyTypeStd || listing.propertyTypeStd || snapshot.propertyType || listing.propertyType || null;

  // Extract size information
  const sizeSqm = snapshot.sizeSqm || listing.sizeSqm || null;
  const landSize = snapshot.landSize || listing.landSize || null;
  const sizeDisplay = sizeSqm ? `${sizeSqm} m²` : (landSize ? `${landSize} m²` : null);

  // Extract date information
  const listedDate = snapshot.addedOnDate || listing.addedOnDate || snapshot.createdAt || listing.createdAt;
  const listedDateDisplay = listedDate ? new Date(listedDate).toLocaleDateString() : null;

  // Extract agent/developer information
  const agentName = snapshot.agentName || listing.agentName || null;
  const agentCompany = snapshot.agentCompanyName || listing.agentCompanyName || null;

  // Check if off-plan
  const isOffPlan = snapshot.propertyStatus === 'Off-Plan' || listing.propertyStatus === 'Off-Plan' || 
                     snapshot.status === 'Off-Plan' || listing.status === 'Off-Plan';

  // Developer rating from indaScore
  const indaScore = listing.indaScore?.finalScore || analytics.indaScore?.finalScore || null;
  const developerRating = indaScore ? `${Math.round(indaScore)}/100` : 'N/A';

  // Data quality completeness (use analytics presence as indicator)
  const hasAnalytics = !!(listing.analytics || analytics);
  const completeness = hasAnalytics ? 85 : 60;
  const missingFields = hasAnalytics ? [] : ['Title verification', 'Developer credentials'];

  // Social proof (dummy data for now)
  const socialProof = {
    views: Math.floor(Math.random() * 500) + 100,
    interestedBuyers: Math.floor(Math.random() * 50) + 10,
    lastUpdated: new Date(listing.updatedAt || listing.createdAt || snapshot.updatedAt || Date.now()).toLocaleDateString()
  };

  // Off-plan data (dummy for now, will be supplied later)
  const offPlanData = isOffPlan ? {
    developerClaimedCompletion: 85, // Dummy - will come from backend
    indaVerifiedCompletion: 82, // Dummy - will come from backend
    lastVerificationDate: new Date().toLocaleDateString(), // Dummy
    expectedHandoverDate: 'Q2 2025', // Dummy - will come from backend
    milestones: [
      {
        number: 1,
        name: "Foundation Complete",
        status: "Complete" as const,
        developerClaimed: 100,
        indaVerified: 100,
        paymentPercentage: 20,
        paymentReleased: true,
        verificationDate: new Date().toLocaleDateString()
      },
      {
        number: 2,
        name: "Superstructure 50%",
        status: "Complete" as const,
        developerClaimed: 100,
        indaVerified: 100,
        paymentPercentage: 30,
        paymentReleased: true,
        verificationDate: new Date().toLocaleDateString()
      },
      {
        number: 3,
        name: "Superstructure 100%",
        status: "In Progress" as const,
        developerClaimed: 90,
        indaVerified: 85,
        paymentPercentage: 30,
        paymentReleased: false,
        discrepancy: true
      },
      {
        number: 4,
        name: "Finishing & Handover",
        status: "Not Started" as const,
        developerClaimed: 0,
        indaVerified: 0,
        paymentPercentage: 20,
        paymentReleased: false
      }
    ]
  } : undefined;

  return {
    id: listing._id || listing.id || String(Math.random()),
    name: snapshot.title || listing.title || `${snapshot.bedrooms || listing.bedrooms || 0}-Bed ${propertyType || 'Property'}`,
    location: snapshot.microlocationStd || listing.microlocationStd || snapshot.microlocation || listing.microlocation ||
              snapshot.lga || listing.lga || snapshot.state || listing.state || 'Lagos',
    price: formatPrice(priceValue),
    priceNumeric: priceValue,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1662454419736-de132ff75638?w=800'],
    bedrooms: snapshot.bedrooms || listing.bedrooms || 0,
    developerRating,
    isScanned,
    scannedFrom: listing.listingUrl || snapshot.listingUrl || null,
    // For offer/inquiry submission
    listingId: listing._id || listing.id || null,
    agentUserId: listing.userId || snapshot.userId || null,
    dataQuality: {
      completeness,
      lastVerified: new Date(listing.updatedAt || listing.createdAt || snapshot.updatedAt || Date.now()).toLocaleDateString(),
      missingFields
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
      listedDate: listedDateDisplay
    },
    listedBy: (agentName || agentCompany) ? {
      name: agentName || agentCompany || 'Agent',
      company: agentCompany || agentName || 'Real Estate',
      verified: listing.verified || snapshot.verified || false
    } : null,
    isOffPlan,
    offPlanData,
    // Include intelligence data if available
    intelligenceData: listing.intelligenceData || snapshot.intelligenceData || null
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

