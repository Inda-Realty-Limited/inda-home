import { useState, useEffect } from "react";
import {
    Loader,
    CheckCircle2,
    FileText,
    Eye,
    TrendingUp
} from "lucide-react";
import apiClient from "@/api";
import { UploadedDocument, UploadedPhoto, AIInferredData } from "./types";

interface Phase2ProcessingProps {
    documents: UploadedDocument[];
    photos: UploadedPhoto[];
    onComplete: (data: AIInferredData) => void;
    onError: (message: string) => void;
}

export function Phase2Processing({ documents, photos, onComplete, onError }: Phase2ProcessingProps) {
    const [progress, setProgress] = useState(10);
    const [step, setStep] = useState("Preparing files for analysis...");

    useEffect(() => {
        const analyze = async () => {
            try {
                const formData = new FormData();

                // Add documents
                documents.forEach(doc => {
                    formData.append("legalDocs", doc.file);
                });

                // Add photos
                photos.forEach(photo => {
                    formData.append("images", photo.file);
                });

                setProgress(30);
                setStep("Sending to AI for processing...");

                const response = await apiClient.post("/api/listings/analyze", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const total = progressEvent.total || progressEvent.loaded;
                        const percent = Math.round((progressEvent.loaded * 40) / total);
                        setProgress(30 + percent); // 30% to 70% range for upload
                    }
                });

                setProgress(90);
                setStep("Processing results...");

                if (response.data.success) {
                    setProgress(100);
                    setStep("Analysis complete!");
                    setTimeout(() => {
                        onComplete(response.data.data);
                    }, 500);
                } else {
                    throw new Error(response.data.message || "Analysis failed");
                }
            } catch (error: any) {
                console.error("AI Analysis Error:", error);
                onError(error.response?.data?.message || error.message || "Failed to analyze property");
            }
        };

        analyze();
    }, [documents, photos, onComplete, onError]);

    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-[#e8f5f4] rounded-full flex items-center justify-center mb-6">
                <Loader className="w-12 h-12 text-[#4ea8a1] animate-spin" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">AI is analyzing your property</h3>
            <p className="text-gray-600 mb-8">{step}</p>

            <div className="w-full max-w-md">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#4ea8a1] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">{progress}% complete</p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl">
                <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${progress >= 30 ? "bg-green-100" : "bg-gray-100"}`}>
                        {progress >= 30 ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                            <FileText className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">OCR Extraction</p>
                    <p className="text-xs text-gray-500">Reading documents</p>
                </div>

                <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${progress >= 60 ? "bg-green-100" : "bg-gray-100"}`}>
                        {progress >= 60 ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                            <Eye className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">Photo Analysis</p>
                    <p className="text-xs text-gray-500">Detecting features</p>
                </div>

                <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${progress >= 90 ? "bg-green-100" : "bg-gray-100"}`}>
                        {progress >= 90 ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                            <TrendingUp className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">Market Data</p>
                    <p className="text-xs text-gray-500">Fetching comparables</p>
                </div>
            </div>
        </div>
    );
}
