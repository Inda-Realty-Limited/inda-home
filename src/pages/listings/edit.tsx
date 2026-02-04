import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProListingsService } from '@/api/pro-listings';
import {
    ArrowLeft,
    Save,
    X,
    ChevronDown,
    MapPin,
    Home,
    Bed,
    Bath,
    Maximize,
    Calendar,
    DollarSign,
    FileText,
    Camera,
    Plus,
    Trash2,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Building2,
    Zap,
    Droplets,
    Car,
    Shield,
    Loader2,
    Upload,
    Eye
} from 'lucide-react';

interface ListingData {
    _id: string;
    title: string;
    propertyType: string;
    microlocation: string;
    fullAddress: string;
    purchasePrice: string;
    bedrooms: string;
    bathrooms: string;
    size: string;
    buildYear: string;
    constructionStatus: string;
    features: string;
    amenities: string;
    listingStatus: string;
    imageUrls: string[];
    propertyImages: string[];
    amenityImages: string[];
    legalDocs: string[];
    titleDocs: string[];
    documentsWithMeta?: Array<{ url: string; type: string; originalName?: string }>;
    photosWithMeta?: Array<{ url: string; label: string; category?: string }>;
    locationIntelligenceStatus?: string;
    // Additional fields
    titleType?: string;
    serviceCharge?: string;
    furnishing?: string;
    parking?: string;
    power?: string;
    water?: string;
    encumbrances?: string;
    estateName?: string;
    description?: string;
}

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Land', 'Industrial', 'Mixed-Use'];
const CONSTRUCTION_STATUS = ['Completed', 'Under Construction', 'Off Plan'];
const LISTING_STATUS = ['active', 'pending', 'draft', 'sold'];
const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
const TITLE_TYPES = ['C of O', 'Governor\'s Consent', 'Deed of Assignment', 'Deed of Sublease', 'Excision', 'R of O', 'Other'];
const POWER_OPTIONS = ['24 Hours', '18-23 Hours', '12-17 Hours', 'Less than 12 Hours', 'Generator Only'];
const WATER_OPTIONS = ['Borehole', 'Municipal/Public', 'Private Well', 'Water Tanker'];

const DOCUMENT_TYPES = ['Title Document', 'Survey Plan', 'Building Permit', 'Tax Clearance', 'Deed of Assignment', 'Other'];
const PHOTO_LABELS = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Exterior', 'Garden', 'Pool', 'Garage', 'Other'];

interface NewPhotoItem {
    file: File;
    label: string;
}

interface NewDocumentItem {
    file: File;
    type: string;
}

export default function EditListingPage() {
    const router = useRouter();
    const { id } = router.query;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [listing, setListing] = useState<ListingData | null>(null);
    const [activeSection, setActiveSection] = useState('basic');
    const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        propertyType: 'Residential',
        microlocation: '',
        fullAddress: '',
        purchasePrice: '',
        bedrooms: '',
        bathrooms: '',
        size: '',
        buildYear: '',
        constructionStatus: 'Completed',
        features: '',
        amenities: '',
        listingStatus: 'active',
        description: '',
        titleType: '',
        serviceCharge: '',
        furnishing: 'Unfurnished',
        parking: '',
        power: '',
        water: '',
        encumbrances: '',
        estateName: ''
    });

    // New files to upload with metadata
    const [newPhotos, setNewPhotos] = useState<NewPhotoItem[]>([]);
    const [newDocuments, setNewDocuments] = useState<NewDocumentItem[]>([]);

    useEffect(() => {
        if (!id) return;
        fetchListing();
    }, [id]);

    const fetchListing = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await ProListingsService.getListing(id as string);
            const data = response.data || response;

            setListing(data);
            setFormData({
                title: data.title || '',
                propertyType: data.propertyType || 'Residential',
                microlocation: data.microlocation || '',
                fullAddress: data.fullAddress || data.address || '',
                purchasePrice: data.purchasePrice?.toString() || data.priceNGN?.toString() || '',
                bedrooms: data.bedrooms?.toString() || '',
                bathrooms: data.bathrooms?.toString() || '',
                size: data.size?.toString() || data.sizeSqm?.toString() || '',
                buildYear: data.buildYear?.toString() || '',
                constructionStatus: data.constructionStatus || 'Completed',
                features: Array.isArray(data.features) ? data.features.join(', ') : (data.features || ''),
                amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : (data.amenities || ''),
                listingStatus: data.listingStatus || 'active',
                description: data.description || '',
                titleType: data.titleType || '',
                serviceCharge: data.serviceCharge?.toString() || '',
                furnishing: data.furnishing || 'Unfurnished',
                parking: data.parking?.toString() || '',
                power: data.power || '',
                water: data.water || '',
                encumbrances: data.encumbrances || '',
                estateName: data.estateName || ''
            });
        } catch (err) {
            console.error('Failed to fetch listing:', err);
            setError('Failed to load listing. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newItems = files.map(file => ({ file, label: 'Other' }));
        setNewPhotos(prev => [...prev, ...newItems]);
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newItems = files.map(file => ({ file, type: 'Other' }));
        setNewDocuments(prev => [...prev, ...newItems]);
    };

    const removeNewPhoto = (index: number) => {
        setNewPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewDocument = (index: number) => {
        setNewDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const updateNewPhotoLabel = (index: number, label: string) => {
        setNewPhotos(prev => prev.map((item, i) => i === index ? { ...item, label } : item));
    };

    const updateNewDocumentType = (index: number, type: string) => {
        setNewDocuments(prev => prev.map((item, i) => i === index ? { ...item, type } : item));
    };

    const handleRefreshLocation = async () => {
        if (!id || isRefreshingLocation) return;
        setIsRefreshingLocation(true);
        try {
            await ProListingsService.refreshLocationIntelligence(id as string);
            await fetchListing();
        } catch (err) {
            console.error('Failed to refresh location:', err);
        } finally {
            setIsRefreshingLocation(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSaveSuccess(false);

        try {
            const payload = new FormData();

            // Add all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    payload.append(key, value);
                }
            });

            // Add new photos with metadata
            if (newPhotos.length > 0) {
                newPhotos.forEach(item => {
                    payload.append('images', item.file);
                });
                const photosMeta = newPhotos.map(item => ({
                    label: item.label,
                    category: 'general',
                    originalName: item.file.name
                }));
                payload.append('photosMeta', JSON.stringify(photosMeta));
            }

            // Add new documents with metadata
            if (newDocuments.length > 0) {
                newDocuments.forEach(item => {
                    payload.append('legalDocs', item.file);
                });
                const documentsMeta = newDocuments.map(item => ({
                    type: item.type,
                    originalName: item.file.name
                }));
                payload.append('documentsMeta', JSON.stringify(documentsMeta));
            }

            await ProListingsService.updateListing(id as string, payload);
            setSaveSuccess(true);
            setNewPhotos([]);
            setNewDocuments([]);

            // Refresh listing data
            await fetchListing();

            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update listing:', err);
            setError('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Get all photos from listing
    const getAllPhotos = () => {
        if (!listing) return [];

        if (listing.photosWithMeta?.length) {
            return listing.photosWithMeta.map(p => ({ url: p.url, label: p.label }));
        }

        const photos: { url: string; label: string }[] = [];
        listing.propertyImages?.forEach(url => photos.push({ url, label: 'Property' }));
        listing.amenityImages?.forEach(url => photos.push({ url, label: 'Amenity' }));
        listing.imageUrls?.forEach(url => photos.push({ url, label: 'Photo' }));
        return photos;
    };

    // Get all documents from listing
    const getAllDocuments = () => {
        if (!listing) return [];

        if (listing.documentsWithMeta?.length) {
            return listing.documentsWithMeta.map(d => ({ url: d.url, type: d.type, name: d.originalName }));
        }

        const docs: { url: string; type: string; name?: string }[] = [];
        listing.titleDocs?.forEach(url => docs.push({ url, type: 'Title Document' }));
        listing.legalDocs?.forEach((url, i) => docs.push({ url, type: `Legal Document ${i + 1}` }));
        return docs;
    };

    const photos = getAllPhotos();
    const documents = getAllDocuments();

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout title="Edit Listing" showHeader={false}>
                    <div className="flex items-center justify-center h-[60vh]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#4ea8a1]" />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (error && !listing) {
        return (
            <ProtectedRoute>
                <DashboardLayout title="Edit Listing" showHeader={false}>
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-500 mb-4">{error}</p>
                        <button onClick={() => router.back()} className="text-[#4ea8a1] hover:underline">
                            Go Back
                        </button>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: Home },
        { id: 'specs', label: 'Specifications', icon: Maximize },
        { id: 'location', label: 'Location', icon: MapPin },
        { id: 'legal', label: 'Legal & Title', icon: Shield },
        { id: 'utilities', label: 'Utilities', icon: Zap },
        { id: 'photos', label: 'Photos', icon: Camera },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];

    return (
        <ProtectedRoute>
            <DashboardLayout title="Edit Listing" showHeader={false}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20 -mx-6 -mt-6 px-6 py-4 mb-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Edit Listing</h1>
                            <p className="text-sm text-gray-500">{formData.title || 'Untitled Property'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {saveSuccess && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Saved!</span>
                            </div>
                        )}
                        <a
                            href={`/property/${id}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </a>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8580] transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-56 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-2 sticky top-24">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-[#4ea8a1]/10 text-[#4ea8a1]'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <section.icon className="w-4 h-4" />
                                    <span className="font-medium text-sm">{section.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Basic Info */}
                        {activeSection === 'basic' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Home className="w-5 h-5 text-[#4ea8a1]" />
                                    Basic Information
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent transition-all"
                                            placeholder="e.g., 4 Bedroom Duplex in Lekki"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                            <select
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                            >
                                                {PROPERTY_TYPES.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Status</label>
                                            <select
                                                name="listingStatus"
                                                value={formData.listingStatus}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                            >
                                                {LISTING_STATUS.map(status => (
                                                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            Asking Price (₦)
                                        </label>
                                        <input
                                            type="number"
                                            name="purchasePrice"
                                            value={formData.purchasePrice}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent transition-all"
                                            placeholder="e.g., 150000000"
                                        />
                                        {formData.purchasePrice && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                ₦{Number(formData.purchasePrice).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent transition-all resize-none"
                                            placeholder="Describe the property..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        {activeSection === 'specs' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Maximize className="w-5 h-5 text-[#4ea8a1]" />
                                    Property Specifications
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Bed className="w-4 h-4 inline mr-1" />
                                            Bedrooms
                                        </label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Bath className="w-4 h-4 inline mr-1" />
                                            Bathrooms
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Maximize className="w-4 h-4 inline mr-1" />
                                            Size (sqm)
                                        </label>
                                        <input
                                            type="number"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Year Built
                                        </label>
                                        <input
                                            type="number"
                                            name="buildYear"
                                            value={formData.buildYear}
                                            onChange={handleInputChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Construction Status</label>
                                        <select
                                            name="constructionStatus"
                                            value={formData.constructionStatus}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                        >
                                            {CONSTRUCTION_STATUS.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                                        <select
                                            name="furnishing"
                                            value={formData.furnishing}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                        >
                                            {FURNISHING_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Car className="w-4 h-4 inline mr-1" />
                                            Parking Spaces
                                        </label>
                                        <input
                                            type="number"
                                            name="parking"
                                            value={formData.parking}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Features & Amenities</label>
                                    <textarea
                                        name="features"
                                        value={formData.features}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent resize-none"
                                        placeholder="Swimming pool, gym, 24hr security, etc."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {activeSection === 'location' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#4ea8a1]" />
                                    Location Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Area / Neighborhood</label>
                                        <input
                                            type="text"
                                            name="microlocation"
                                            value={formData.microlocation}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                            placeholder="e.g., Lekki Phase 1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                                        <input
                                            type="text"
                                            name="fullAddress"
                                            value={formData.fullAddress}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                            placeholder="e.g., 15 Admiralty Way, Lekki Phase 1, Lagos"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estate / Community Name</label>
                                        <input
                                            type="text"
                                            name="estateName"
                                            value={formData.estateName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                            placeholder="e.g., Nicon Town Estate"
                                        />
                                    </div>
                                </div>

                                {/* Location Intelligence Status */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${
                                                listing?.locationIntelligenceStatus === 'success' ? 'bg-green-100' :
                                                listing?.locationIntelligenceStatus === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                                            }`}>
                                                {listing?.locationIntelligenceStatus === 'success' ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                ) : listing?.locationIntelligenceStatus === 'failed' ? (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                ) : (
                                                    <MapPin className="w-5 h-5 text-yellow-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {listing?.locationIntelligenceStatus === 'success' ? 'Location Intelligence Active' :
                                                     listing?.locationIntelligenceStatus === 'failed' ? 'Location Data Unavailable' :
                                                     'Processing Location Data...'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {listing?.locationIntelligenceStatus === 'success'
                                                        ? 'Market insights and area analytics are available'
                                                        : 'Click refresh to fetch location data'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRefreshLocation}
                                            disabled={isRefreshingLocation}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8580] transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isRefreshingLocation ? 'animate-spin' : ''}`} />
                                            {isRefreshingLocation ? 'Refreshing...' : 'Refresh'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Legal & Title */}
                        {activeSection === 'legal' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-[#4ea8a1]" />
                                    Legal & Title Information
                                </h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title Type</label>
                                        <select
                                            name="titleType"
                                            value={formData.titleType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                        >
                                            <option value="">Select title type</option>
                                            {TITLE_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (₦/year)</label>
                                        <input
                                            type="number"
                                            name="serviceCharge"
                                            value={formData.serviceCharge}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                            placeholder="Annual service charge"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Encumbrances / Legal Issues</label>
                                    <textarea
                                        name="encumbrances"
                                        value={formData.encumbrances}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent resize-none"
                                        placeholder="Type 'None' if there are no encumbrances or describe any legal issues"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Utilities */}
                        {activeSection === 'utilities' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#4ea8a1]" />
                                    Utilities & Infrastructure
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Zap className="w-4 h-4 inline mr-1" />
                                            Power Supply
                                        </label>
                                        <select
                                            name="power"
                                            value={formData.power}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                        >
                                            <option value="">Select power availability</option>
                                            {POWER_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Droplets className="w-4 h-4 inline mr-1" />
                                            Water Source
                                        </label>
                                        <select
                                            name="water"
                                            value={formData.water}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent appearance-none bg-white"
                                        >
                                            <option value="">Select water source</option>
                                            {WATER_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Photos */}
                        {activeSection === 'photos' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Camera className="w-5 h-5 text-[#4ea8a1]" />
                                        Property Photos ({photos.length + newPhotos.length})
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8580] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Photos
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </div>

                                {/* Photo Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {photos.map((photo, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={photo.url}
                                                alt={photo.label}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                <span className="text-xs text-white font-medium">{photo.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {newPhotos.map((item, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-[#4ea8a1]">
                                            <Image
                                                src={URL.createObjectURL(item.file)}
                                                alt={`New photo ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewPhoto(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-[#4ea8a1] p-2">
                                                <select
                                                    value={item.label}
                                                    onChange={(e) => updateNewPhotoLabel(index, e.target.value)}
                                                    className="w-full text-xs text-white font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {PHOTO_LABELS.map(label => (
                                                        <option key={label} value={label} className="text-gray-900">{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {photos.length === 0 && newPhotos.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                                            <Camera className="w-12 h-12 mb-3" />
                                            <p>No photos uploaded yet</p>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="mt-2 text-[#4ea8a1] hover:underline"
                                            >
                                                Upload photos
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        {activeSection === 'documents' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-[#4ea8a1]" />
                                        Documents ({documents.length + newDocuments.length})
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => docInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d8580] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Documents
                                    </button>
                                    <input
                                        ref={docInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        multiple
                                        onChange={handleDocumentUpload}
                                        className="hidden"
                                    />
                                </div>

                                {/* Document List */}
                                <div className="space-y-3">
                                    {documents.map((doc, index) => (
                                        <div
                                            key={`existing-${index}`}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                    <FileText className="w-5 h-5 text-[#4ea8a1]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doc.type}</p>
                                                    {doc.name && <p className="text-sm text-gray-500">{doc.name}</p>}
                                                </div>
                                            </div>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#4ea8a1] hover:underline text-sm"
                                            >
                                                View
                                            </a>
                                        </div>
                                    ))}
                                    {newDocuments.map((item, index) => (
                                        <div
                                            key={`new-${index}`}
                                            className="flex items-center justify-between p-4 bg-[#4ea8a1]/5 rounded-lg border-2 border-dashed border-[#4ea8a1]"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="p-2 bg-[#4ea8a1] rounded-lg">
                                                    <Upload className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.file.name}</p>
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => updateNewDocumentType(index, e.target.value)}
                                                        className="mt-1 text-sm text-[#4ea8a1] bg-transparent border border-[#4ea8a1]/30 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4ea8a1]"
                                                    >
                                                        {DOCUMENT_TYPES.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewDocument(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {documents.length === 0 && newDocuments.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <FileText className="w-12 h-12 mb-3" />
                                            <p>No documents uploaded yet</p>
                                            <button
                                                type="button"
                                                onClick={() => docInputRef.current?.click()}
                                                className="mt-2 text-[#4ea8a1] hover:underline"
                                            >
                                                Upload documents
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
