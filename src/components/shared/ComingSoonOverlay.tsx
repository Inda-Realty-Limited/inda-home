import React from 'react';

interface ComingSoonOverlayProps {
    children: React.ReactNode;
    title?: string;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
    children,
    title = "Coming Soon"
}) => {
    return (
        <div className="relative w-full h-full min-h-[400px]">
            {/* Blurred Content */}
            <div className="blur-[6px] pointer-events-none select-none">
                {children}
            </div>

            {/* Overlay Message */}
            <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
                <div className="bg-white/90 backdrop-blur-lg px-10 py-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center animate-in zoom-in slide-in-from-bottom-8 duration-700 pointer-events-auto max-w-[90vw]">
                    <div className="w-16 h-16 bg-inda-teal/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h2 className="text-2xl font-bold text-inda-dark">{title}</h2>
                    <p className="text-sm text-gray-500 mt-2 text-center max-w-[250px]">
                        We&apos;re currently building this feature to give you the best experience. Stay tuned!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonOverlay;
