import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { DocumentType, UploadedDocument } from "./types";


interface SimpleDocumentUploadProps {
    documents: UploadedDocument[];
    onDocumentUpload: (files: FileList | null) => void;
    onDocumentTypeChange: (docId: string, type: DocumentType) => void;
    onDocumentRemove: (id: string) => void;
    error?: string;
}


export function SimpleDocumentUpload({
    documents,
    onDocumentUpload,
    onDocumentTypeChange,
    onDocumentRemove,
    error
}: SimpleDocumentUploadProps) {
    const documentTypes: DocumentType[] = [
        "Title Document (C of O, Deed, etc.)",
        "Survey Plan",
        "Deed of Assignment",
        "Deed of Sublease",
        "Building Approval",
        "Tax Receipt",
        "Ground Rent Receipt",
        "Utility Bill",
        "Purchase Receipt",
        "Governor's Consent",
        "Power of Attorney",
        "Other"
    ];


    const hasTitleDoc = documents.some(d => d.type === "Title Document (C of O, Deed, etc.)");
    const hasSurveyPlan = documents.some(d => d.type === "Survey Plan");


    return (
        <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
                1. Upload Property Documents <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
                Upload all available documents and tell us the document type using the dropdown
            </p>


            {/* Why This Matters */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-medium text-blue-900 mb-1">Why completeness matters:</p>
                        <p className="text-xs text-blue-700">
                            <strong>Complete documentation = Faster deals.</strong> Documents verify your property's legitimacy but are NOT shared with buyers. Missing docs trigger ₦50K verification and 3-5 day delays.
                        </p>
                    </div>
                </div>
            </div>


            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#4ea8a1] transition-colors mb-4">
                <input
                    type="file"
                    id="documents"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onDocumentUpload(e.target.files)}
                    className="hidden"
                />
                <label htmlFor="documents" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Click to upload documents</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
                    </div>
                </label>
            </div>


            {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
            )}


            {/* Document List with Dropdowns */}
            {documents.length > 0 && (
                <div className="space-y-3 mb-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3 flex-1">
                                    <FileText className="w-5 h-5 text-[#4ea8a1] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{doc.file.name}</p>
                                        <p className="text-xs text-gray-500">{(doc.file.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDocumentRemove(doc.id)}
                                    className="text-red-600 hover:text-red-800 flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Type Dropdown */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Document Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={doc.type || ""}
                                    onChange={(e) => onDocumentTypeChange(doc.id, e.target.value as DocumentType)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent"
                                >
                                    <option value="">-- Select Document Type --</option>
                                    {documentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Status Summary */}
            {documents.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900 mb-2">Document Checklist:</p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {hasTitleDoc ? (
                                        <span className="text-green-600 text-xs">✓ Title Document</span>
                                    ) : (
                                        <span className="text-orange-600 text-xs">○ Title Document (recommended)</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasSurveyPlan ? (
                                        <span className="text-green-600 text-xs">✓ Survey Plan</span>
                                    ) : (
                                        <span className="text-orange-600 text-xs">○ Survey Plan (recommended)</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
                                    {documents.filter(d => !d.type).length > 0 && (
                                        <span className="text-orange-600 font-medium">
                                            {" "}• {documents.filter(d => !d.type).length} unlabeled
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

