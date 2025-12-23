"use client";

import { Container, Footer, Navbar } from "@/components";
import React from "react";
// import CTABanner from "./index/sections/CTABanner";
// import FAQSection from "./index/sections/FAQSection";
// import FeaturesSection from "./index/sections/FeaturesSection";
// import HeadlineRibbon from "./index/sections/HeadlineRibbon";
// import HeroSection from "./index/sections/HeroSection";
// import PlansPricingSection from "./index/sections/PlansPricingSection";
// import ReportPreviewSection from "./index/sections/ReportPreviewSection";
// import RiskOpportunitySection from "./index/sections/RiskOpportunitySection";
import { HeroSection } from "./index/sections/HeroSection";
import { PropertyTicker } from "./index/sections/PropertyTicker";
import { PartnerShowcase } from "./index/sections/PartnerShowcase";
import { UseCaseSection } from "./index/sections/UseCaseSection";
import { ProductSection } from "./index/sections/ProductSection";
import { NewsSection } from "./index/sections/NewsSection";
import { CustomerStories } from "./index/sections/CustomerStories";
import { FooterCTA } from "./index/sections/FooterCTA";


const Landing: React.FC = () => {
  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      {/* 
      <HeroSection />
      <HeadlineRibbon />
      <RiskOpportunitySection />
      <ReportPreviewSection />
      <FeaturesSection />
      <PlansPricingSection />
      <FAQSection />
      <CTABanner />
      <Footer /> */}
      <>
      <Navbar />
      <HeroSection />
      <PropertyTicker />
      <PartnerShowcase />
      <UseCaseSection />
      <ProductSection />
      <NewsSection />
      <CustomerStories />
      <FooterCTA />
    </>
    </Container>
  );
};

export default Landing;
