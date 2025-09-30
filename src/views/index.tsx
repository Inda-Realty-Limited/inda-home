import { Container, Footer, Navbar } from "@/components";
import React from "react";
import CTABanner from "./index/sections/CTABanner";
import FAQSection from "./index/sections/FAQSection";
import FeaturesSection from "./index/sections/FeaturesSection";
import HeadlineRibbon from "./index/sections/HeadlineRibbon";
import HeroSection from "./index/sections/HeroSection";
import PlansPricingSection from "./index/sections/PlansPricingSection";
import ReportPreviewSection from "./index/sections/ReportPreviewSection";
import RiskOpportunitySection from "./index/sections/RiskOpportunitySection";

const Landing: React.FC = () => {
  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      <Navbar />
      <HeroSection />
      <HeadlineRibbon />
      <RiskOpportunitySection />
      <ReportPreviewSection />
      <FeaturesSection />
      <PlansPricingSection />
      <FAQSection />
      <CTABanner />
      <Footer />
    </Container>
  );
};

export default Landing;
