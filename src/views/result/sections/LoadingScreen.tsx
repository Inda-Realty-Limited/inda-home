import { Container, Footer, Navbar } from "@/components";
import React from "react";

type Props = {
  currentStep: number;
};

const LoadingScreen: React.FC<Props> = ({ currentStep }) => {
  return (
    <Container
      noPadding
      className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
    >
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F9F9F9] via-[#FAFAFA] to-[#F5F5F5] min-h-0 relative">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]"></div>

        <div className="max-w-4xl w-full text-center relative z-10">
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-4 border-[#4EA8A1]/20 rounded-full animate-spin border-t-[#4EA8A1]"></div>
              <div className="absolute inset-4 sm:inset-6 lg:inset-8 bg-gradient-to-br from-[#4EA8A1] to-[#66B3AD] rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#101820] mb-4 sm:mb-6 leading-tight">
            Analyzing Your Property...
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#101820]/70 max-w-2xl mx-auto leading-relaxed mb-8">
            We're verifying documents, checking market data, and running our AI
            analysis to give you the most accurate insights.
          </p>

          <div className="max-w-md mx-auto space-y-4">
            {[
              "Fetching property data...",
              "Verifying documents...",
              "Running market analysis...",
              "Generating insights...",
            ].map((label, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <span
                  className={`font-medium ${
                    currentStep >= idx ? "text-[#4EA8A1]" : "text-[#101820]/60"
                  }`}
                >
                  {label}
                </span>
                <div className="flex space-x-1">
                  {currentStep === idx ? (
                    <>
                      <div className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#4EA8A1] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </>
                  ) : currentStep > idx ? (
                    <div className="w-4 h-4 bg-[#4EA8A1] rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 inline-flex items-center bg-white/80 backdrop-blur-sm border border-[#E5E5E5] rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-sm">
            <div className="w-2 h-2 bg-[#4EA8A1] rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm sm:text-base text-[#101820]/60 font-medium">
              This usually takes 5-10 seconds...
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default LoadingScreen;
