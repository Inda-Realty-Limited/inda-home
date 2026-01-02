// Utility function to map API listing data to PropertyDetail format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapListingToPropertyDetail = (listing: any) => {
  const images = listing.imageUrls || listing.images || listing.propertyImages || [];
  const priceValue = Number(listing.purchasePrice) || listing.priceNGN || 0;
  
  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    }
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(0)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  return {
    id: listing._id || listing.id || String(Math.random()),
    name: listing.title || `${listing.bedrooms || 0}-Bed ${listing.propertyType || listing.propertyTypeStd || 'Property'}`,
    location: listing.microlocation || listing.microlocationStd || listing.lga || listing.state || 'Lagos',
    price: formatPrice(priceValue),
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1662454419736-de132ff75638?w=800'],
    bedrooms: listing.bedrooms || 0,
    developerRating: listing.indaScore?.finalScore ? `${listing.indaScore.finalScore}/100` : 'N/A',
    isScanned: !!listing.listingUrl && !listing._id,
    scannedFrom: listing.listingUrl || null,
    dataQuality: {
      completeness: listing.analytics ? 85 : 60,
      lastVerified: new Date(listing.updatedAt || listing.createdAt || Date.now()).toLocaleDateString(),
      missingFields: listing.analytics ? [] : ['Title verification', 'Developer credentials']
    },
    socialProof: {
      views: Math.floor(Math.random() * 500) + 100,
      interestedBuyers: Math.floor(Math.random() * 50) + 10,
      lastUpdated: new Date(listing.updatedAt || listing.createdAt || Date.now()).toLocaleDateString()
    },
    scannedData: {
      bathrooms: listing.bathrooms || null,
      parkingSpaces: listing.parkingSpaces || null,
      propertyType: listing.propertyType || listing.propertyTypeStd || null,
      description: listing.description || null,
      features: listing.amenities ? (Array.isArray(listing.amenities) ? listing.amenities : [listing.amenities]) : [],
      landSize: listing.landSize || listing.sizeSqm ? `${listing.sizeSqm || listing.landSize} m²` : null,
      builtUpArea: listing.builtUpArea || null,
      listedDate: listing.addedOnDate ? new Date(listing.addedOnDate).toLocaleDateString() : null
    },
    listedBy: listing.agentName || listing.agentCompanyName ? {
      name: listing.agentName || listing.agentCompanyName || 'Agent',
      company: listing.agentCompanyName || listing.agentName || 'Real Estate',
      verified: listing.verified || false
    } : null,
    isOffPlan: listing.propertyStatus === 'Off-Plan' || listing.status === 'Off-Plan'
  };
};

