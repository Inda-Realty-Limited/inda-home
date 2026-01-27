import { useState, useEffect, useCallback } from "react";
import {
    Loader,
    CheckCircle2,
    FileText,
    Eye,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    ArrowLeft
} from "lucide-react";
import apiClient from "@/api";
import { UploadedDocument, UploadedPhoto, AIInferredData } from "./types";

interface Phase2ProcessingProps {
    documents: UploadedDocument[];
    photos: UploadedPhoto[];
    onComplete: (data: AIInferredData) => void;
    onError: (message: string) => void;
    onBack?: () => void;
}

type AnalysisStatus = "idle" | "analyzing" | "success" | "error";

interface AnalysisError {
    message: string;
    type: "network" | "timeout" | "server" | "refusal" | "unknown";
    retryable: boolean;
}

export function Phase2Processing({ documents, photos, onComplete, onError, onBack }: Phase2ProcessingProps) {
    const [progress, setProgress] = useState(10);
    const [step, setStep] = useState("Preparing files for analysis...");
    const [status, setStatus] = useState<AnalysisStatus>("idle");
    const [error, setError] = useState<AnalysisError | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    const analyzeFiles = useCallback(async () => {
        setStatus("analyzing");
        setError(null);
        setProgress(10);
        setStep("Preparing files for analysis...");

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
                timeout: 120000, // 2 minute timeout for AI processing
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
                setStatus("success");
                setTimeout(() => {
                    onComplete(response.data.data);
                }, 500);
            } else {
                throw new Error(response.data.message || "Analysis failed");
            }
        } catch (err: any) {
            console.error("AI Analysis Error:", err);
            setStatus("error");

            // Categorize the error
            let errorInfo: AnalysisError;

            if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
                errorInfo = {
                    message: "The analysis is taking longer than expected. This can happen with large files.",
                    type: "timeout",
                    retryable: true
                };
            } else if (err.code === "ERR_NETWORK" || !navigator.onLine) {
                errorInfo = {
                    message: "Connection lost. Please check your internet and try again.",
                    type: "network",
                    retryable: true
                };
            } else if (err.response?.status === 500) {
                const serverMessage = err.response?.data?.message || "";
                if (serverMessage.includes("refused") || serverMessage.includes("policy")) {
                    errorInfo = {
                        message: "Our AI couldn't process these documents. Please ensure no sensitive personal information is visible in photos.",
                        type: "refusal",
                        retryable: false
                    };
                } else {
                    errorInfo = {
                        message: "Our servers are experiencing high demand. Please try again.",
                        type: "server",
                        retryable: true
                    };
                }
            } else if (err.response?.status === 429) {
                errorInfo = {
                    message: "Too many requests. Please wait a moment and try again.",
                    type: "server",
                    retryable: true
                };
            } else {
                errorInfo = {
                    message: err.response?.data?.message || err.message || "Something went wrong during analysis.",
                    type: "unknown",
                    retryable: true
                };
            }

            setError(errorInfo);
        }
    }, [documents, photos, onComplete]);

    // Start analysis on mount
    useEffect(() => {
        analyzeFiles();
    }, []); // Only run once on mount

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        analyzeFiles();
    };

    const handleGoBack = () => {
        if (onBack) {
            onBack();
        } else {
            onError("Analysis cancelled");
        }
    };

    // Error state UI
    if (status === "error" && error) {
        const canRetry = error.retryable && retryCount < MAX_RETRIES;

        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h3>
                <p className="text-gray-600 mb-2 text-center max-w-md">{error.message}</p>

                {retryCount > 0 && (
                    <p className="text-sm text-gray-500 mb-6">
                        Attempt {retryCount} of {MAX_RETRIES}
                    </p>
                )}

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleGoBack}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>

                    {canRetry && (
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-[#4ea8a1] text-white rounded-lg hover:bg-[#3d9691] font-medium flex items-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                    )}
                </div>

                {!canRetry && retryCount >= MAX_RETRIES && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md">
                        <p className="text-sm text-amber-800">
                            <strong>Multiple attempts failed.</strong> This may be due to document quality or server load.
                            You can go back and try with different/fewer files, or contact support if the issue persists.
                        </p>
                    </div>
                )}

                {!error.retryable && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
                        <p className="text-sm text-blue-800">
                            <strong>Tip:</strong> Try removing any documents with visible personal information
                            (ID cards, signatures) and upload again.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // Loading state UI
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
