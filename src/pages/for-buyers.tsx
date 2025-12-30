import { Button } from '../views/index/sections/ui/button';
import { ArrowRight, Shield, TrendingUp, FileCheck, Search, CheckCircle2, AlertCircle} from 'lucide-react';
import { FooterCTA } from '../views/index/sections/FooterCTA';
import { Navbar } from '@/components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export function ForBuyers() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"link" | "ai">("link");
  const [searchPending, setSearchPending] = useState(false);

  const isValidUrl = useMemo(
    () =>
      (value: string) => {
        try {
          const url = new URL(value.trim());
          return ["http:", "https:"].includes(url.protocol);
        } catch {
          return false;
        }
      },
    [],
  );

  const handleSearch = useCallback(() => {
    if (searchMode === "ai") return;
    if (!isValidUrl(search)) return;

    const encoded = encodeURIComponent(search.trim());

    if (isLoading) {
      setSearchPending(true);
      return;
    }

    if (!isAuthenticated) {
      router.push(`/auth/signup?q=${encoded}&type=link`);
      return;
    }

    router.push(`/result?q=${encoded}&type=link`);
  }, [isAuthenticated, isLoading, router, search, isValidUrl, searchMode]);

  const handleAiSearch = useCallback(() => {
    if (searchMode !== "ai") return;
    const query = search.trim();
    if (!query) return;
    const encoded = encodeURIComponent(query);

    if (isLoading) {
      setSearchPending(true);
      return;
    }

    if (!isAuthenticated) {
      router.push(`/auth/signup?q=${encoded}&type=ai`);
      return;
    }

    router.push(`/search-results?q=${encoded}&type=ai`);
  }, [isAuthenticated, isLoading, router, search, searchMode]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && searchPending) {
      handleSearch();
      setSearchPending(false);
    }
  }, [handleSearch, isAuthenticated, isLoading, searchPending]);

  const scrollToSearch = useCallback(() => {
    const el = document.getElementById('buyer-search-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLInputElement).focus();
    }
  }, []);

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#4ea8a1] rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-600 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl mb-6 leading-tight text-gray-900">
                Buy with certainty. Get the truth about{' '}
                <span className="bg-gradient-to-r from-[#4ea8a1] to-teal-600 bg-clip-text text-transparent">
                  any property.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Verified pricing, documents, risk score & ROI - instantly.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-xl p-3 flex flex-col gap-3 mb-8">
                <div className="flex gap-2">
                  <Button
                    variant={searchMode === "link" ? "default" : "outline"}
                    onClick={() => setSearchMode("link")}
                    className={`px-4 py-2 text-sm ${searchMode === "link" ? "bg-[#4ea8a1] text-white hover:bg-[#3d8680]" : "border border-gray-300 text-gray-700"}`}
                  >
                    Scan Link
                  </Button>
                  <Button
                    variant={searchMode === "ai" ? "default" : "outline"}
                    onClick={() => setSearchMode("ai")}
                    className={`px-4 py-2 text-sm ${searchMode === "ai" ? "bg-[#4ea8a1] text-white hover:bg-[#3d8680]" : "border border-gray-300 text-gray-700"}`}
                  >
                    Search Listings
                  </Button>
                </div>

                <div className="flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input 
                    id="buyer-search-input"
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchMode === "link" ? handleSearch() : handleAiSearch();
                      }
                    }}
                    placeholder={
                      searchMode === "link"
                        ? "Paste property link..."
                        : "e.g. 3 bedroom flat in Ikoyi"
                    }
                    className="w-full outline-none text-gray-900"
                  />
                  {searchMode === "link" ? (
                    <Button
                      onClick={handleSearch}
                      disabled={!isValidUrl(search)}
                      className={`bg-[#4ea8a1] hover:bg-[#3d8680] px-6 ${!isValidUrl(search) ? "opacity-60 cursor-not-allowed hover:bg-[#4ea8a1]" : ""}`}
                    >
                      Scan
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAiSearch}
                      disabled={!search.trim()}
                      className={`bg-[#4ea8a1] hover:bg-[#3d8680] px-6 ${!search.trim() ? "opacity-60 cursor-not-allowed hover:bg-[#4ea8a1]" : ""}`}
                    >
                      Search
                    </Button>
                  )}
                </div>
              </div>

              {/* <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={!isValidUrl(search)}
                  className={`bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] hover:from-[#3d8680] hover:to-[#2d7670] group shadow-lg ${!isValidUrl(search) ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  Run Free Scan
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div> */}
            </div>

            {/* Mock Report Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Property Scan Report</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Verified</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <span className="text-gray-700">Fair Market Value</span>
                    <span className="text-[#4ea8a1]">₦45.2M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <span className="text-gray-700">Annual ROI</span>
                    <span className="text-blue-600">12.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                    <span className="text-gray-700">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">Low Risk</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>All documents verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buyers Love Inda */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center mb-16 text-gray-900">
            Why Buyers Love <span className="text-[#4ea8a1]">Inda</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50/50 to-white">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-4 text-gray-900">Fair Market Value</h3>
              <p className="text-gray-600 leading-relaxed">
                Know the real price before negotiating. Our AI analyzes verified data from thousands of properties to give you the true market value.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50/50 to-white">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-4 text-gray-900">Document Safety</h3>
              <p className="text-gray-600 leading-relaxed">
                Spot fraud, missing papers, or conflicting titles. We verify ownership chains and flag potential legal issues before you commit.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50/50 to-white">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl mb-4 text-gray-900">Risk Score</h3>
              <p className="text-gray-600 leading-relaxed">
                Understand hidden issues before you pay. We analyze legal, structural, and market risks to give you a complete picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">How it works?</h2>
            <p className="text-xl text-gray-600">
              It's like ChatGPT - for property decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <Search className="w-10 h-10 text-white" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#4ea8a1] shadow-lg">1</span>
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Paste or search any property</h3>
              <p className="text-gray-600">
                Link, address, or describe what you're looking for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <FileCheck className="w-10 h-10 text-white" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg">2</span>
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Inda analyzes verified data & risks</h3>
              <p className="text-gray-600">
                We cross-reference thousands of data points.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <CheckCircle2 className="w-10 h-10 text-white" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-lg">3</span>
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Get instant insights</h3>
              <p className="text-gray-600">
                Fair market value, ROI & confidence score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* See What You Get */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center mb-16 text-gray-900">See What You Get</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Overpriced */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">3-Bed Duplex</span>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 text-sm">Overpriced 17%</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Asking Price</div>
                <div className="text-2xl text-gray-900">₦52M</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Fair Market Value</div>
                <div className="text-2xl text-[#4ea8a1]">₦44.5M</div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Annual ROI</span>
                  <span className="text-gray-900">7%</span>
                </div>
              </div>
            </div>

            {/* Fair Deal */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-300 p-6 hover:shadow-xl transition-shadow ring-4 ring-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">2-Bed Apartment</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 text-sm">Fair Deal</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Asking Price</div>
                <div className="text-2xl text-gray-900">₦28M</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Fair Market Value</div>
                <div className="text-2xl text-[#4ea8a1]">₦27.8M</div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Annual ROI</span>
                  <span className="text-emerald-600">9.5%</span>
                </div>
              </div>
            </div>

            {/* High Yield */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Service Plot</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600 text-sm">High Yield</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Asking Price</div>
                <div className="text-2xl text-gray-900">₦18M</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Fair Market Value</div>
                <div className="text-2xl text-[#4ea8a1]">₦19.2M</div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Annual ROI</span>
                  <span className="text-blue-600">14%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-[#4ea8a1] hover:bg-[#3d8680] px-8 py-6 text-lg">
              See Your First Report
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center mb-4 text-gray-900">Buyer Plans</h2>
          <p className="text-xl text-center text-gray-600 mb-16">Choose the right level of insight for your decision</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Scan */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl mb-2 text-gray-900">Free Scan</h3>
              <div className="text-4xl mb-6 text-gray-900">
                ₦0
                <span className="text-lg text-gray-500">/scan</span>
              </div>
              <p className="text-gray-600 mb-8">Instant Report</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Instant Fair Market Value (FMV)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">ROI snapshot based on current market signals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Microlocation insights (pricing ranges, demand patterns)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Nearby amenities overview</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">High-level red-flag summary</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Confidence Score</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">One-page shareable report</span>
                </li>
              </ul>

              <Button
                variant="outline"
                onClick={scrollToSearch}
                className="w-full border-2 border-[#4ea8a1] text-[#4ea8a1] hover:bg-[#4ea8a1] hover:text-white"
              >
                Start Free Scan
              </Button>
            </div>

            {/* Deep Dive */}
            <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-3xl shadow-2xl p-8 border-2 border-[#4ea8a1] relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-6 py-2 rounded-full text-sm shadow-lg">
                Most Popular
              </div>
              <h3 className="text-2xl mb-2 text-white">Deep Dive</h3>
              <div className="text-4xl mb-6 text-white">
                ₦75,000
                <span className="text-lg text-emerald-100">/property</span>
              </div>
              <p className="text-emerald-100 mb-8">24–48 hours turnaround</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Everything in Free Scan, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Document quality check</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Ownership risk check</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Key risk flags</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Detailed shareable report</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-white text-[#4ea8a1] hover:bg-emerald-50">
                <Link href="/plans/deep-dive">Get Started</Link>
              </Button>
            </div>

            {/* Deeper Dive */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl mb-2 text-gray-900">Deeper Dive</h3>
              <div className="text-4xl mb-6 text-gray-900">
                ₦100,000
                <span className="text-lg text-gray-500">/property</span>
              </div>
              <p className="text-gray-600 mb-8">48–72 hours turnaround</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Deep Dive, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">On-site visit</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Seller legitimacy check</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Projected timelines for each deal stage</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Investment viability score (Buy / Negotiate / Avoid)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated support line</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-[#4ea8a1] hover:text-[#4ea8a1]">
              <Link href="/plans/deeper-dive">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-center mb-16 text-gray-900">What Buyers Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-200 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-full flex items-center justify-center text-white">
                  AO
                </div>
                <div>
                  <div className="text-gray-900">Adebayo Ogunlesi</div>
                  <div className="text-sm text-gray-600">Property Investor</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "Inda saved me ₦120M by showing the true value of a duplex in Lekki. The seller was asking ₦220M but Inda's report showed it was only worth ₦100M. Armed with that data, I negotiated down to ₦105M."
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                  CN
                </div>
                <div>
                  <div className="text-gray-900">Chioma Nwosu</div>
                  <div className="text-sm text-gray-600">First-time Buyer</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "Finally, a platform I can trust. Inda helped me avoid a ₦100M mistake by catching fraudulent documents on a property in VI. That verification saved my entire down payment."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Footer CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#4ea8a1] to-[#3d8680]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">
            Don't buy blind. Scan before you buy.
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" onClick={scrollToSearch} className="bg-white text-[#4ea8a1] hover:bg-emerald-50 px-8 py-6 text-lg">
              Run Free Scan Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Explore with Data
            </Button>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}

export default ForBuyers;