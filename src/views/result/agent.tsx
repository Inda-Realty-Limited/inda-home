import { Button, Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import {
  FiChevronRight,
  FiClock,
  FiLayers,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const ProgressBar = ({
  value,
  tone = "ok",
}: {
  value: number;
  tone?: "ok" | "warn" | "bad";
}) => {
  const color =
    tone === "warn"
      ? "bg-yellow-500"
      : tone === "bad"
      ? "bg-red-500"
      : "bg-[#4EA8A1]";
  return (
    <div className="w-full">
      <div className="h-2.5 w-full bg-gray-200 rounded-full">
        <div
          className={`h-2.5 ${color} rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

const StatPill = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-[#4EA8A1]/10 rounded-xl px-4 py-3">
    <p className="text-lg font-bold text-[#101820] mb-2">{title}</p>
    <p className="text-sm font-normal text-[#101820]/80">{value}</p>
  </div>
);

const KeyRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
    <div className="inline-flex items-center gap-2 text-[#4EA8A1]">
      <span className="text-base">{icon}</span>
      <span className="text-sm font-medium text-[#101820]/80">{label}</span>
    </div>
    <div className="text-sm font-semibold text-[#101820]">{value}</div>
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center bg-[#4EA8A1]/10 text-[#4EA8A1] border border-[#4EA8A1]/20 rounded-full px-3 py-1 text-xs font-medium">
    {children}
  </span>
);

const RatingStars = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <FaStar
            key={i}
            className={`text-sm ${
              filled ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
};

const AgentResult: React.FC = () => {
  const router = useRouter();
  const agentName = (router.query.q as string) || "Mr. Seyi Ajayi";
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(true);

  return (
    <Container
      noPadding
      className="min-h-screen bg-[#F9F9F9] text-inda-dark flex flex-col"
    >
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Card */}
          <section className="bg-[#E5E5E566]  rounded-2xl p-6">
            {/* Avatar and basic info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#B8E6E1] flex items-center justify-center mb-3">
                <FiUser className="text-3xl text-[#4EA8A1]" />
              </div>
              <p className="text-xs text-gray-500">
                Not yet claimed by the agent
              </p>
            </div>

            {/* Profile details in two columns */}
            <div className="space-y-4 mb-6">
              <KeyRow
                icon={<FiUser />}
                label="Agent Name"
                value={<span>{agentName}</span>}
              />
              <KeyRow
                icon={<FiShield />}
                label="Profile Status"
                value={<span>Unverified</span>}
              />
              <KeyRow
                icon={<FiMapPin />}
                label="Microlocations"
                value={<span>Lekki Phase 1, Chevron, Ajah</span>}
              />
              <KeyRow
                icon={<FiLayers />}
                label="Listings Tracked"
                value={<span>34 properties</span>}
              />
              <KeyRow
                icon={<FiClock />}
                label="First Seen Active"
                value={<span>2019</span>}
              />
              <KeyRow
                icon={<FiPhone />}
                label="Contact info"
                value={<span>+234 803 XXX XXXX</span>}
              />
            </div>

            {/* Trust score section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#101820]">
                    Inda Trust Score
                  </span>
                  <FaInfoCircle className="text-[#4EA8A1] text-sm" />
                </div>
                <span className="text-sm font-bold text-[#101820]">64%</span>
              </div>
              <ProgressBar value={64} tone="ok" />
              <div className="flex items-center justify-end mt-2">
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <FaExclamationTriangle />
                  <span>(Room for caution)</span>
                </div>
              </div>
            </div>

            {/* Verification prompt with dropdown */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => setIsVerificationOpen(!isVerificationOpen)}
              >
                <p className="text-sm text-[#101820]">
                  Want to verify this profile?
                </p>
                <div className="text-[#4EA8A1]">
                  <FiChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isVerificationOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
              {isVerificationOpen && (
                <div className="mt-3 pl-4">
                  <Button className="rounded-full px-6 py-2 text-sm bg-[#4EA8A1] text-white hover:bg-[#3d8a84]">
                    Claim as Agent
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Agent Activity Summary */}
          <section className="bg-[#F9F9F9] rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#101820] mb-4">
              Agent Activity Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatPill
                title="📋 Listings History"
                value="34 properties tracked over 5 years"
              />
              <StatPill
                title="🎯 Focus Areas"
                value="Most active in Lekki Phase 1, Chevron Drive, Osapa London"
              />
              <StatPill
                title="💰 Pricing Issues"
                value="8 listings were ≥ 25% overpriced"
              />
              <StatPill
                title="📸 Image Quality"
                value="22% of listings reused stock or blurry images"
              />
              <StatPill title="⏰ Active Timeline" value="Active since 2019" />
              <StatPill
                title="⚡ Response Time"
                value="Typically responds within 24-48h"
              />
            </div>
          </section>

          {/* Feedback & Complaints */}
          <section className="bg-[#E5E5E566] rounded-2xl p-5 sm:p-6">
            <div className=" flex-col items-start gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#101820]">
                Feedback & Complaints
              </h2>
              <span className="text-[#4EA8A1] inline-flex items-center gap-1 text-sm">
                <FaInfoCircle /> What buyers have reported
              </span>
            </div>
            <div className="w-full lg:w-[70%]">
              {/* Types & counts */}
              <div className="lg:col-span-1">
                <div className="overflow-hidden rounded-xl">
                  <div className="grid grid-cols-3 px-2 sm:px-4 py-2 text-sm font-semibold text-[#101820]">
                    <div>Type</div>
                    <div className="text-center">Count</div>
                    <div>Notes</div>
                  </div>
                  {[
                    {
                      t: "Misleading price changes",
                      c: 3,
                      n: "Buyer said price changed after initial inquiry",
                      icon: "❌",
                    },
                    {
                      t: "Ghosted after inspection",
                      c: 2,
                      n: "No follow-up after site visit",
                      icon: "⏳",
                    },
                    {
                      t: "Fake survey doc",
                      c: 1,
                      n: "Resolved by platform",
                      icon: "📄",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 px-2 sm:px-4 py-3 text-sm"
                    >
                      <div className="pr-2">{row.t}</div>
                      <div className="text-center font-semibold flex items-center justify-center gap-1">
                        {row.icon === "❌" && (
                          <span className="text-red-500">❌</span>
                        )}
                        {row.icon === "⏳" && (
                          <span className="text-orange-500">⏳</span>
                        )}
                        {row.icon === "📄" && (
                          <span className="text-gray-500">📄</span>
                        )}
                        {row.c}
                      </div>
                      <div className="text-[#101820]/70 text-xs sm:text-sm">
                        {row.n}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Rating */}
                <div className="mt-6 space-y-1">
                  <div className="text-4xl font-bold text-[#101820]">3.2</div>
                  <RatingStars value={3.2} />
                  <div className="text-xs text-[#101820]/60">7 reviews</div>
                </div>
                {/* Histogram */}
                <div className="mt-4 space-y-2">
                  {[
                    { stars: 4, percentage: 30 },
                    { stars: 3, percentage: 30 },
                    { stars: 4, percentage: 20 },
                    { stars: 2, percentage: 10 },
                    { stars: 1, percentage: 10 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-6 text-xs font-medium">{5 - idx}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-gray-400 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Testimonials */}
            <div className="lg:col-span-2 mt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Quadri Ibrahim",
                    timeAgo: "2 months ago",
                    rating: 2,
                    note: "He has great properties but delayed sending proper docs.",
                  },
                  {
                    name: "Julia Bello",
                    note: "We didn’t eventually buy; there was a 6-month delay. Customer service was helpful more as friends. I wouldn’t recommend for first-time buyers who need speed of mind.",
                  },
                  {
                    name: "Chukwudi",
                    timeAgo: "4 months ago",
                    rating: 1,
                    note: "Asked for inspection.",
                  },
                ].map((t, i) => (
                  <div key={i} className="bg-[#4EA8A114] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FiUser className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#101820]">
                          {t.name}
                        </div>
                        <div className="text-xs text-[#101820]/60">
                          {t.timeAgo}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <RatingStars value={t.rating ?? 0} />
                    </div>
                    <p className="text-sm text-[#101820]/80 leading-relaxed">
                      {t.note}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button className="rounded-full  font-semibold px-6 py-2 text-sm bg-[#4EA8A11A] border border-[#E2E4E8] hover:bg-gray-50 inline-flex items-center gap-2 text-[#101820]">
                  Report Your Experience here <MdKeyboardDoubleArrowLeft />
                </button>
              </div>
            </div>
          </section>

          {/* Similar Trusted Agents */}
          <section className="bg-[#E5E5E566] rounded-2xl p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#101820]">
                Similar Trusted Agents
              </h2>
              <div className="text-[#4EA8A1] text-base sm:text-lg">
                Agents in Lekki with Trust Score 85+
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                {
                  name: "Tolu Adedayo",
                  info: "Verified, REDAN member",
                  rating: 4.7,
                },
                {
                  name: "Mary Ezeh",
                  info: "Verified docs on 12 listings",
                  rating: 4.8,
                },
                {
                  name: "Adewale Homes",
                  info: "Known developer partner",
                  rating: 4.5,
                },
                {
                  name: "Olu Phillips",
                  info: "Verified, REDAN member",
                  rating: 4.4,
                },
                {
                  name: "Tolu Adedayo",
                  info: "Verified, REDAN member",
                  rating: 4.7,
                },
              ].map((a, i) => (
                <div
                  key={i}
                  className="min-w-[220px] sm:min-w-[240px] bg-[#E5E5E599] rounded-3xl p-6 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#4EA8A138] flex items-center justify-center mb-3">
                    <FiUser className="text-3xl text-[#2F7F79]" />
                  </div>
                  <div className="text-sm font-semibold text-[#101820]">
                    {a.name}
                  </div>
                  <div className="text-xs text-[#101820]/70 mt-1">{a.info}</div>
                  <div className="text-xs text-[#101820]/80 mt-1 inline-flex items-center gap-1">
                    <span>Rating - {a.rating.toFixed(1)}</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Improve trust score CTA */}
          <section className="bg-[#f9f9f9] rounded-3xl p-6 md:p-10 shadow-sm border border-[#F0F0F0]">
            <div className="max-w-3xl">
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[#101820]">
                Want to improve your
                <br className="hidden sm:block" /> trust score?
              </h3>
              <p className="mt-2 text-lg sm:text-xl text-[#4EA8A1]">
                Fix your profile, or respond to buyers!
              </p>
              <div className="mt-6">
                <button className="rounded-xl px-6 py-3 text-sm sm:text-base bg-[#0A1A22] text-white hover:bg-[#11242e]">
                  Claim profile as Agent
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#101820]/60">
                <FaShieldAlt className="text-rose-500" />
                <span>Verification improves trust and visibility.</span>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-[#E5E5E566] rounded-3xl p-6 md:p-8">
            <p className="text-base sm:text-lg font-semibold text-[#101820]">
              Legal Disclaimer
            </p>
            <div className="mt-2 text-sm sm:text-base text-[#101820]/80 leading-relaxed space-y-1.5">
              <p>
                This profile is generated from publicly available data (e.g.,
                listings, buyer reports, third-party platforms).
              </p>
              <p>It has not been manually verified by the agent.</p>
              <p>
                All insights are based on Inda’s Trust Framework and do not
                constitute legal judgment or endorsement.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default AgentResult;
