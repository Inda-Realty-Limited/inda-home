import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FaArrowLeft, FaChevronDown, FaFileContract, FaCheck, FaTimes } from 'react-icons/fa';
import { ProListingsService } from '@/api/pro-listings';

interface ListingFormData {
    title: string;
    type: string;
    location: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    size: string;
    status: string;
    constructionStatus: string;
    features: string;
    buildYear: string;
    titleType: string;
    serviceCharge: string;
    furnishing: string;
    buildingPlan: string;
    parking: string;
    power: string;
    water: string;
    encumbrances: string;
    estateName: string;
}

export default function EditListingPage() {
    const router = useRouter();
    const { id } = router.query;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<ListingFormData>({
        title: '', type: '', location: '', price: '',
        bedrooms: '', bathrooms: '', size: '', status: '',
        constructionStatus: '', features: '', buildYear: '',
        titleType: '', serviceCharge: '', furnishing: '', buildingPlan: '',
        parking: '', power: '', water: '', encumbrances: '', estateName: ''
    });

    useEffect(() => {
        if (!id) return;
        const fetchListingData = async () => {
            try {
                setIsLoading(true);
                const response = await ProListingsService.getListing(id as string);
                const listing = response.data || response;

                if (listing) {
                    setFormData({
                        title: listing.title || '',
                        type: listing.propertyType || listing.type || 'Residential',
                        location: listing.microlocation || listing.address || '',
                        price: listing.purchasePrice?.toString() || listing.price?.toString() || '',
                        bedrooms: (listing.bedrooms || listing.specs?.bed || 0).toString(),
                        bathrooms: (listing.bathrooms || listing.specs?.bath || 0).toString(),
                        size: (listing.size || listing.specs?.size || 0).toString(),
                        buildYear: (listing.buildYear || listing.specs?.year || '').toString(),
                        status: listing.status || 'Active',
                        constructionStatus: listing.constructionStatus || 'Completed',
                        features: listing.features || listing.amenities || '',
                        titleType: '', serviceCharge: '', furnishing: '', buildingPlan: '',
                        parking: '', power: '', water: '', encumbrances: '', estateName: ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch listing", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListingData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('propertyType', formData.type);
            payload.append('microlocation', formData.location);
            payload.append('purchasePrice', formData.price);
            payload.append('fmv', formData.price);
            payload.append('bedrooms', formData.bedrooms);
            payload.append('bathrooms', formData.bathrooms);
            payload.append('size', formData.size);
            payload.append('buildYear', formData.buildYear);
            payload.append('status', formData.status);
            payload.append('constructionStatus', formData.constructionStatus);
            payload.append('features', formData.features);

            await ProListingsService.updateListing(id as string, payload);
            router.push('/listings');
        } catch (error) {
            alert("Failed to update listing.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <DashboardLayout title="Edit Listing">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-inda-dark transition-colors">
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-inda-dark">Edit Listing</h1>
                    <p className="text-gray-500 mt-1">Update property details and status</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-5xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Property Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <InputGroup label="Property Title" name="title" value={formData.title} onChange={handleInputChange} required />
                            <SelectGroup label="Property Type" name="type" value={formData.type} onChange={handleInputChange} options={['Residential', 'Commercial', 'Land', 'Industrial']} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <InputGroup label="Location" name="location" value={formData.location} onChange={handleInputChange} required />
                            <InputGroup label="Estate / Community Name" name="estateName" value={formData.estateName} onChange={handleInputChange} placeholder="e.g. Nicon Town" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputGroup label="Listing Price (₦)" name="price" value={formData.price} onChange={handleInputChange} type="number" required />
                            <SelectGroup label="Furnishing" name="furnishing" value={formData.furnishing} onChange={handleInputChange} options={['Unfurnished', 'Semi-Furnished', 'Furnished']} />
                            <InputGroup label="Parking Spaces" name="parking" value={formData.parking} onChange={handleInputChange} type="number" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Specs & Utilities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <SelectGroup label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} options={['0', '1', '2', '3', '4', '5', '6+']} required />
                            <SelectGroup label="Bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} options={['0', '1', '2', '3', '4', '5', '6+']} required />
                            <InputGroup label="Size (sqm)" name="size" value={formData.size} onChange={handleInputChange} type="number" required />
                            <InputGroup label="Build Year" name="buildYear" value={formData.buildYear} onChange={handleInputChange} type="number" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SelectGroup label="Power Supply" name="power" value={formData.power} onChange={handleInputChange} options={['24 Hours', '18-23 Hours', '12-17 Hours', 'Less than 12 Hours']} />
                            <SelectGroup label="Water Source" name="water" value={formData.water} onChange={handleInputChange} options={['Borehole', 'Municipal', 'Private', 'Tanker']} />
                            <InputGroup label="Service Charge (₦)" name="serviceCharge" value={formData.serviceCharge} onChange={handleInputChange} type="number" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Legal & Compliance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <SelectGroup label="Title Type" name="titleType" value={formData.titleType} onChange={handleInputChange} options={['C of O', 'Deed', 'Consent', 'Excision']} />
                            <SelectGroup label="Building Plan Approved" name="buildingPlan" value={formData.buildingPlan} onChange={handleInputChange} options={['Yes', 'No', 'In Progress']} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <InputGroup label="Legal Encumbrances" name="encumbrances" value={formData.encumbrances} onChange={handleInputChange} placeholder="Type 'None' if clear" />
                            <div className="grid grid-cols-2 gap-4">
                                <SelectGroup label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'Pending', 'Sold']} required />
                                <SelectGroup label="Construction" name="constructionStatus" value={formData.constructionStatus} onChange={handleInputChange} options={['Completed', 'Under Construction', 'Off Plan']} required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Features</h3>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-3 text-gray-700 focus:bg-white focus:border-inda-teal focus:outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="submit" disabled={isSubmitting} className="bg-inda-teal text-white px-8 py-3 rounded hover:bg-teal-700 font-medium disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={() => router.back()} className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded hover:bg-gray-50 font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; }
function InputGroup({ label, className = '', ...props }: InputGroupProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <input {...props} className={`w-full bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-3 text-gray-700 focus:bg-white focus:border-inda-teal focus:outline-none transition-all ${className}`} />
        </div>
    );
}

interface SelectGroupProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label: string; options: string[]; }
function SelectGroup({ label, options, className = '', ...props }: SelectGroupProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <select {...props} className={`w-full bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-3 text-gray-700 appearance-none focus:bg-white focus:border-inda-teal focus:outline-none cursor-pointer ${className}`}>
                    {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <FaChevronDown className="absolute right-4 top-4 pointer-events-none text-gray-400" size={12} />
            </div>
        </div>
    );
}
