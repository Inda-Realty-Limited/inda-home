import React from "react";

export interface ResultHeaderProps {
  title: string;
  address?: string;
  sample?: boolean;
  rightActions?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({
  title,
  address,
  sample,
  rightActions,
  subtitle,
  className,
}) => {
  return (
    <header className={`w-full px-6 ${className || ""}`}>
      <div className="bg-gradient-to-br from-white via-white to-[#4EA8A1]/5 rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-1 h-12 bg-gradient-to-b from-[#4EA8A1] to-[#0A655E] rounded-full flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1A22] leading-tight mb-2">
                  {title}
                </h1>
                {address && (
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <svg
                      className="w-4 h-4 text-[#4EA8A1] flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm sm:text-base font-medium">
                      {address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {subtitle && <div className="mt-4 pl-5">{subtitle}</div>}

            {sample && (
              <div className="mt-4 pl-5">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4EA8A1]/10 to-[#4EA8A1]/5 text-[#0A655E] text-sm font-semibold border border-[#4EA8A1]/20 shadow-sm">
                  <div className="relative">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#4EA8A1]" />
                    <span className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-[#4EA8A1] animate-ping opacity-75" />
                  </div>
                  Sample data
                </div>
              </div>
            )}
          </div>

          {rightActions && <div className="flex-shrink-0">{rightActions}</div>}
        </div>
      </div>
    </header>
  );
};

export default ResultHeader;
