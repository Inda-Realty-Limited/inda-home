"use client";

import { Container, Navbar } from "@/components";
import React from "react";
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
