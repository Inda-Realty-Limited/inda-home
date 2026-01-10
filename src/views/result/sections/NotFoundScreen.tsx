import { Button, Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  searchQuery: string;
  searchType?: string;
};

const NotFoundScreen: React.FC<Props> = ({ searchQuery, searchType }) => {
  const router = useRouter();
  return (
    <Container
      noPadding
      className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
    >
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 min-h-0">
        <div className="max-w-5xl w-full text-center">
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="mb-8 sm:mb-12 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#4EA8A1]/20 to-[#66B3AD]/20 rounded-full blur-xl"></div>
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-[#4EA8A1] to-[#66B3AD] rounded-full flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#101820] mb-6 sm:mb-8 leading-tight">
              Property Not Found
            </h1>

            {searchQuery && (
              <div className="mb-6 sm:mb-8">
                <div className="inline-block bg-white rounded-2xl shadow-lg px-6 py-4 mb-4">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4EA8A1] mb-2">
                    &quot;{searchQuery}&quot;
                  </p>
                  {searchType && (
                    <span className="inline-flex items-center bg-[#4EA8A1]/10 border border-[#4EA8A1]/20 rounded-full px-4 py-2 text-sm font-medium text-[#4EA8A1] capitalize">
                      {searchType.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  )}
                </div>
              </div>
            )}

            <p className="text-lg sm:text-xl lg:text-2xl text-[#101820]/70 max-w-3xl mx-auto leading-relaxed mb-8">
              We couldn&apos;t find any verified property, agent, or developer
              matching your search.
              <br className="hidden sm:block" />
              Our database is constantly growing—try searching for something
              else!
            </p>
          </div>

          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <Button
                variant="primary"
                onClick={() => router.push("/")}
                className="text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-4 sm:py-5 bg-gradient-to-r from-[#4EA8A1] to-[#66B3AD] hover:from-[#3a8a84] hover:to-[#4EA8A1] text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold min-w-[240px] sm:min-w-[280px]"
              >
                Try a Different Search
              </Button>
              <Button
                variant="secondary"
                className="text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-4 sm:py-5 border-2 border-[#4EA8A1] text-[#4EA8A1] hover:bg-[#4EA8A1] hover:text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-bold min-w-[240px] sm:min-w-[280px]"
              >
                Request a Review
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-[#4EA8A1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#4EA8A1]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#101820] mb-2">
                Add Property
              </h3>
              <p className="text-sm text-[#101820]/70">
                Know a property that should be listed? Help us grow our
                database.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-[#4EA8A1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#4EA8A1]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#101820] mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-[#101820]/70">
                Contact our support team for assistance with your search.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-[#4EA8A1]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#4EA8A1]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#101820] mb-2">
                Search Tips
              </h3>
              <p className="text-sm text-[#101820]/70">
                Try using property names, addresses, or agent names for better
                results.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center bg-white rounded-2xl border border-[#E5E5E5] px-6 py-4 shadow-lg">
            <div className="w-3 h-3 bg-[#4EA8A1] rounded-full mr-4 animate-pulse"></div>
            <span className="text-base text-[#101820]/60 font-medium">
              Search ID: #404 — No matching records found
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default NotFoundScreen;
