import React from "react";
import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiHome,
  FiLink,
  FiMapPin,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { GiBrain } from "react-icons/gi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export type SampleItem = {
  id: number;
  name: string;
  type: "listing" | "agent" | "developer";
};

export type SearchType = {
  id: string;
  label: string;
  icon: IconType;
  placeholder: string;
  description: string;
};

export type FAQItem = {
  q: string;
  a: React.ReactNode;
};

export const sampleData: SampleItem[] = [
  { id: 1, name: "Lagos Luxury Villa", type: "listing" },
  { id: 2, name: "John Doe", type: "agent" },
  { id: 3, name: "Prime Developers", type: "developer" },
  { id: 4, name: "Abuja Smart Home", type: "listing" },
  { id: 5, name: "Jane Smith", type: "agent" },
];

export const searchTypes: SearchType[] = [
  {
    id: "address",
    label: "Address",
    icon: FiMapPin,
    placeholder: "15 Lekki Phase 1, Lagos",
    description: "Search by property address",
  },
  {
    id: "agent",
    label: "Agent Name",
    icon: FiUsers,
    placeholder: "John Smith Real Estate",
    description: "Find agents and reviews",
  },
  {
    id: "developer",
    label: "Developer Name",
    icon: HiOutlineBuildingOffice2,
    placeholder: "Dangote Properties Ltd",
    description: "Check developer projects",
  },
  {
    id: "smart",
    label: "Smart Search",
    icon: GiBrain,
    placeholder: "luxury apartment Victoria Island",
    description: "AI-powered property search",
  },
  {
    id: "link",
    label: "Paste Link",
    icon: FiLink,
    placeholder: "https://propertypro.ng/property/...",
    description: "Analyze any listing URL",
  },
  {
    id: "property",
    label: "Property Name",
    icon: FiHome,
    placeholder: "Eko Pearl Towers",
    description: "Search specific properties",
  },
];

export const featureCards = [
  {
    icon: FiMapPin,
    title: "Verify Any Listing",
  },
  {
    icon: GiBrain,
    title: "AI Insights You Can Trust",
  },
  {
    icon: FiUsers,
    title: "Detect Scam Agents",
  },
  {
    icon: FiBarChart2,
    title: "Project ROI Like a Pro",
  },
  {
    icon: FiUsers,
    title: "Community-Sourced Reviews",
  },
  {
    icon: FiTrendingUp,
    title: "Find Underpriced Deals",
  },
] as const;

export const faqData: FAQItem[] = [
  {
    q: "What is Inda and how does it help me?",
    a: (
      <>
        Inda is your property truth checker. In just seconds, it verifies if a
        listing is real, priced fairly, and free from hidden risks like fake
        documents, flooding, or disputes so you don’t waste money or fall for
        scams.
      </>
    ),
  },
  {
    q: "How does Inda get its data?",
    a: (
      <>
        We pull data from multiple trusted sources property platforms,
        government registries, rental markets, sellers, and verified agents. Our
        system cleans and cross-checks everything, then uses AI to give you a
        clear, easy-to-read report.
      </>
    ),
  },
  {
    q: "What’s the difference between Instant, Deep Dive, and Deeper Dive reports?",
    a: (
      <>
        <span className="block font-medium">Free Preview (₦0):</span>
        <span className="block mb-2 text-[13.5px] sm:text-sm">
          Basic snapshot with limited Inda Score visibility so you can confirm
          the link works before paying.
        </span>
        <span className="block font-medium">Instant Report (₦7,500):</span>
        <span className="block mb-2 text-[13.5px] sm:text-sm">
          30–60s automated analysis – Fair Value (FMV) range, pricing flags, ROI
          projection seed, Inda Trust Score, agent signals & red flag scan.
        </span>
        <span className="block font-medium">Deep Dive (₦75,000):</span>
        <span className="block mb-2 text-[13.5px] sm:text-sm">
          Everything in Instant + title & document verification (registry
          lookups), government approval checks, micro‑location &
          flood/encroachment risk profiling (24–48 hrs).
        </span>
        <span className="block font-medium">Deeper Dive (₦100,000):</span>
        <span className="block text-[13.5px] sm:text-sm">
          Adds seller / ownership vetting, on‑site inspection with media
          evidence, utility & build quality assessment, enhanced fraud screening
          (2–4 days).
        </span>
      </>
    ),
  },
  {
    q: "Who should use Inda?",
    a: (
      <>
        Anyone buying or investing in property - first-time buyers, diaspora
        buyers sending money home, or everyday investors. If you’re about to put
        millions into a property, Inda helps you buy with confidence.
      </>
    ),
  },
  {
    q: "Is my information safe with Inda?",
    a: (
      <>
        Yes. We don’t share your personal or property checks publicly. All data
        is secured and only you get access to your reports.
      </>
    ),
  },
  {
    q: "Why should I pay for Inda when agents or lawyers can check for me?",
    a: (
      <>
        Agents and lawyers often take weeks and still miss risks. Inda gives you
        instant, unbiased, data-backed insights, at a fraction of the cost so
        you can decide faster and safer.
      </>
    ),
  },
];
