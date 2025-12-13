"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Search, BarChart3, Users, Building2, TrendingUp, Zap, ArrowRight, Layers, FileText, Bell } from 'lucide-react';

export function ProductSection() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'professional'>('buyer');

  const buyerProducts = [
    {
      icon: Search,
      title: 'Property Discovery',
      description: 'Find your perfect property with advanced search filters and AI-powered recommendations.',
      link: '#',
      cta: 'Explore Properties',
      illustration: (
        <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-[#4ea8a1] to-blue-500 rounded-3xl rotate-12 blur-sm" />
          <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-[#4ea8a1]" />
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: 'Market Insights',
      description: 'Track property values, neighborhood trends, and market forecasts in real-time.',
      link: '#',
      cta: 'View Insights',
      illustration: (
        <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl -rotate-12 blur-sm" />
          <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-purple-600" />
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: 'ROI Calculator',
      description: 'Simulate returns, calculate mortgage payments, and project cash flow before you buy.',
      link: '#',
      cta: 'Calculate ROI',
      illustration: (
        <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl rotate-6 blur-sm" />
          <TrendingUp className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-orange-600" />
        </div>
      ),
    },
  ];

  const professionalProducts = [
    {
      icon: Building2,
      title: 'Developer Dashboard',
      description: 'Manage projects, track buyer interest, and optimize pricing with data-driven insights.',
      link: '#',
      cta: 'Launch Dashboard',
      illustration: (
        <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-[#4ea8a1] to-teal-600 rounded-3xl rotate-12 blur-sm" />
          <Building2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-[#4ea8a1]" />
        </div>
      ),
    },
    {
      icon: Layers,
      title: 'API & Integrations',
      description: 'Embed property data, market analytics, and ROI tools directly into your platform.',
      link: '#',
      cta: 'View API Docs',
      illustration: (
        <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl -rotate-12 blur-sm" />
          <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-blue-600" />
        </div>
      ),
    },
    {
      icon: Bell,
      title: 'Lead Management',
      description: 'Capture, qualify, and nurture leads with intelligent CRM and automated follow-ups.',
      link: '#',
      cta: 'Manage Leads',
      illustration: (
        <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl rotate-6 blur-sm" />
          <Bell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-purple-600" />
        </div>
      ),
    },
  ];

  const currentProducts = activeTab === 'buyer' ? buyerProducts : professionalProducts;

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#4ea8a1]/10 via-purple-100/20 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header with Toggle */}
        <div className="text-center mb-20">
          <h2 className="text-gray-900 mb-8 text-5xl md:text-6xl">
            Your Real Estate{' '}
            <span className="bg-gradient-to-r from-[#4ea8a1] to-purple-600 bg-clip-text text-transparent">
              Advantage
            </span>
          </h2>
          
          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-full mt-8">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-10 py-4 rounded-full transition-all duration-300 text-base ${
                activeTab === 'buyer'
                  ? 'bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] text-white shadow-xl shadow-[#4ea8a1]/30'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`px-10 py-4 rounded-full transition-all duration-300 text-base ${
                activeTab === 'professional'
                  ? 'bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] text-white shadow-xl shadow-[#4ea8a1]/30'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Professionals
            </button>
          </div>

          {/* Subheader */}
          <p className="text-xl text-gray-600 mt-8 max-w-2xl mx-auto">
            {activeTab === 'buyer'
              ? 'Discover properties, track trends, and calculate returns before anyone else.'
              : 'Dashboards, integrations, and insights to attract buyers, track engagement, and scale smarter.'}
          </p>
        </div>

        {/* Product Cards - with illustrations */}
        <div className="grid md:grid-cols-3 gap-8">
          {currentProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden p-10 bg-white rounded-3xl border-2 border-gray-200 hover:border-[#4ea8a1]/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                {/* Illustration */}
                {product.illustration}
                
                {/* Content */}
                <div className="relative">
                  {/* Icon circle */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4ea8a1]/10 to-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 border border-[#4ea8a1]/20">
                    <Icon className="w-8 h-8 text-[#4ea8a1]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-gray-900 mb-4 text-2xl">
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {product.description}
                  </p>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    className="group/btn text-[#4ea8a1] hover:text-[#3d8680] p-0 text-base"
                    asChild
                  >
                    <a href={product.link} className="inline-flex items-center">
                      {product.cta}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Tools */}
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="group border-2 hover:border-[#4ea8a1] hover:text-[#4ea8a1] text-base px-8 py-6">
            Discover Advanced Tools
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}