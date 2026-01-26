import { PropertyUploadWizard } from "./PropertyUploadWizard";


interface PropertyUploadModalProps {
    onClose: () => void;
    onPropertyAdded: (property: any) => void;
}


export function PropertyUploadModal({ onClose, onPropertyAdded }: PropertyUploadModalProps) {
    const handleComplete = (data: any) => {
        // Transform wizard data to property format
        const property = {
            id: `prop-${Date.now()}`,
            name: `${data.confirmedData?.bedrooms || ""}BR ${data.confirmedData?.propertyType || "Property"}`,
            location: data.address,
            price: `₦${data.askingPrice.toLocaleString()}`,
            priceValue: data.askingPrice,
            bedrooms: data.confirmedData?.bedrooms || 0,
            images: data.photos.map((p: any) => p.preview),
            developerRating: 4.5,
            listingType: "developer" as const,
            listedBy: {
                name: "Your Name", // From user account
                company: "Your Company",
                phone: "+234 XXX XXX XXXX",
                email: "your@email.com",
                verified: true
            },
            socialProof: {
                views: 0,
                interestedBuyers: 0,
                recentActivity: "Just listed",
                lastUpdated: new Date().toLocaleDateString()
            },
            dataQuality: {
                completeness: 85,
                lastVerified: new Date().toLocaleDateString(),
                missingFields: data.aiInferredData?.flags
                    .filter((f: any) => f.requiresVerification)
                    .map((f: any) => f.field) || []
            }
        };


        onPropertyAdded(property);
        onClose();
    };


    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <PropertyUploadWizard
                    onComplete={handleComplete}
                    onCancel={onClose}
                    mode="create"
                />
            </div>
        </div>
    );
}
