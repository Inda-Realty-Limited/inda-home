import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FaCloudUploadAlt, FaChevronDown, FaTimes, FaFileContract } from 'react-icons/fa';
import { ListingsService, ListingPayload } from '@/services/pro-api';

interface ListingFormData {
    title: string;
    type: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    size: string;
    status: string;
    constructionStatus: string;
    features: string;
    year: string;
    images: File[];
    titleType: string;
    serviceCharge: string;
    furnishing: string;
    buildingPlan: string;
    parking: string;
    power: string;
    water: string;
    encumbrances: string;
    estateName: string;
    documents: File[];
}

const INITIAL_STATE: ListingFormData = {
    title: '', type: '', price: '', bedrooms: '', bathrooms: '', size: '', status: 'Active',
    constructionStatus: '', features: '', year: '', images: [],
    titleType: '', serviceCharge: '', furnishing: '', buildingPlan: '', parking: '',
    power: '', water: '', encumbrances: '', estateName: '', documents: []
};

export default function AddListingPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ListingFormData>(INITIAL_STATE);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
    }, [imagePreviews]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const processFiles = (newFiles: File[]) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newDocs = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
        }
    };

    const removeDoc = (index: number) => {
        setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) processFiles(Array.from(e.dataTransfer.files));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const combinedLocation = `${street}, ${city}`;
            const payload: ListingPayload = {
                title: formData.title,
                type: formData.type,
                location: combinedLocation,
                price: Number(formData.price),
                specs: {
                    bed: formData.bedrooms,
                    bath: formData.bathrooms,
                    size: formData.size,
                    year: formData.year
                },
                status: formData.status,
                constructionStatus: formData.constructionStatus,
                features: formData.features,
                images: formData.images
            };

            await ListingsService.create(payload);
            router.push('/listings');
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Failed to create listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const NIGERIAN_CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Others'];

    return (
        <DashboardLayout title="Listings Manager">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-inda-dark">Listings Manager</h1>
                <p className="text-gray-500 mt-1">Manage your property listings and track performance</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-5xl">
                <h2 className="text-2xl font-bold text-inda-teal mb-8">Add New Listing</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Property Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <InputGroup label="Property Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Luxury 4-Bedroom Duplex" required />
                            <SelectGroup label="Property Type" name="type" value={formData.type} onChange={handleInputChange} placeholder="Select type" options={['Residential', 'Commercial', 'Land', 'Industrial']} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <InputGroup label="Street Address" name="street" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="e.g., Adeola Odeku" required />
                                </div>
                                <div className="w-1/2">
                                    <SelectGroup label="City" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Select City" options={NIGERIAN_CITIES} required />
                                </div>
                            </div>
                            <InputGroup label="Estate / Community Name" name="estateName" value={formData.estateName} onChange={handleInputChange} placeholder="e.g., Nicon Town" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputGroup label="Listing Price (₦)" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., 85000000" type="number" required />
                            <SelectGroup label="Furnishing" name="furnishing" value={formData.furnishing} onChange={handleInputChange} placeholder="Select status" options={['Unfurnished', 'Semi-Furnished', 'Furnished']} required />
                            <InputGroup label="Parking Spaces" name="parking" value={formData.parking} onChange={handleInputChange} placeholder="e.g., 2" type="number" required />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Specs & Utilities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <SelectGroup label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="Beds" options={['1', '2', '3', '4', '5', '6+']} required />
                            <SelectGroup label="Bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="Baths" options={['1', '2', '3', '4', '5', '6+']} required />
                            <InputGroup label="Size (sqm)" name="size" value={formData.size} onChange={handleInputChange} placeholder="450" type="number" required />
                            <InputGroup label="Build Year" name="year" value={formData.year} onChange={handleInputChange} placeholder="2020" type="number" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SelectGroup label="Power Supply" name="power" value={formData.power} onChange={handleInputChange} placeholder="Availability" options={['24 Hours', '18-23 Hours', '12-17 Hours', 'Less than 12 Hours']} />
                            <SelectGroup label="Water Source" name="water" value={formData.water} onChange={handleInputChange} placeholder="Select source" options={['Borehole', 'Municipal', 'Private Utility', 'Tanker']} required />
                            <InputGroup label="Service Charge (₦/Year)" name="serviceCharge" value={formData.serviceCharge} onChange={handleInputChange} placeholder="e.g., 500000" type="number" required />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Legal & Compliance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <SelectGroup label="Title Type" name="titleType" value={formData.titleType} onChange={handleInputChange} placeholder="Select Title" options={['C of O', 'Deed of Assignment', 'Governor\'s Consent', 'Excision', 'Gazette']} required />
                            <SelectGroup label="Approved Building Plan" name="buildingPlan" value={formData.buildingPlan} onChange={handleInputChange} placeholder="Status" options={['Yes', 'No', 'In Progress']} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <InputGroup label="Legal Encumbrances" name="encumbrances" value={formData.encumbrances} onChange={handleInputChange} placeholder="Mortgages, caveats, or disputes (Type 'None' if clear)" required />
                            <div className="grid grid-cols-2 gap-4">
                                <SelectGroup label="Status" name="status" value={formData.status} onChange={handleInputChange} placeholder="Status" options={['Active', 'Pending', 'Sold']} required />
                                <SelectGroup label="Construction" name="constructionStatus" value={formData.constructionStatus} onChange={handleInputChange} placeholder="Phase" options={['Completed', 'Under Construction', 'Off Plan']} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Key Documents (C of O, Survey)</label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => docInputRef.current?.click()}
                                    className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition"
                                >
                                    <FaFileContract /> Select Documents
                                </button>
                                <input type="file" hidden ref={docInputRef} onChange={handleDocChange} multiple accept=".pdf,.jpg,.png" />
                                <span className="text-xs text-gray-500">
                                    {formData.documents.length > 0 ? `${formData.documents.length} files selected` : "No documents selected"}
                                </span>
                            </div>
                            {formData.documents.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {formData.documents.map((doc, i) => (
                                        <li key={i} className="text-xs text-inda-teal flex items-center gap-2">
                                            {doc.name}
                                            <button type="button" onClick={() => removeDoc(i)} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-4 border-b pb-2">Media & Features</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Amenities</label>
                            <textarea
                                name="features"
                                value={formData.features}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Describe key features..."
                                className="w-full bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-3 text-gray-700 focus:bg-white focus:border-inda-teal focus:outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Property Images</label>
                            <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" />
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? 'border-inda-teal bg-teal-50' : 'border-gray-200 bg-[#FAFAFA]'}`}
                            >
                                <FaCloudUploadAlt className="text-4xl text-inda-teal mb-3" />
                                <p className="text-gray-500 text-sm mb-3">Drag images here or click to browse</p>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-inda-teal text-white px-6 py-2 rounded text-sm font-bold">Choose Files</button>
                            </div>
                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><FaTimes size={10} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4 border-t mt-8">
                        <button type="submit" disabled={isSubmitting} className="bg-inda-teal text-white px-8 py-3 rounded hover:bg-teal-700 font-bold disabled:opacity-50">
                            {isSubmitting ? 'Creating...' : 'Create Listing'}
                        </button>
                        <button type="button" onClick={() => router.back()} className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded hover:bg-gray-50 font-bold">
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
            <label className="block text-sm font-bold text-gray-700 mb-2">{label} {props.required && <span className="text-red-500">*</span>}</label>
            <input {...props} className={`w-full bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-3 text-gray-700 focus:bg-white focus:border-inda-teal focus:outline-none transition-all ${className}`} />
        </div>
    );
}

interface SelectGroupProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label: string; options: string[]; placeholder?: string; }
function SelectGroup({ label, options, placeholder, className = '', ...props }: SelectGroupProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label} {props.required && <span className="text-red-500">*</span>}</label>
            <div className="relative">
                <select {...props} className={`w-full bg-[#F3F4F6] border border-transparent rounded-lg px-4 py-3 text-gray-700 appearance-none focus:bg-white focus:border-inda-teal focus:outline-none cursor-pointer ${className}`}>
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <FaChevronDown className="absolute right-4 top-4 pointer-events-none text-gray-400" size={12} />
            </div>
        </div>
    );
}
