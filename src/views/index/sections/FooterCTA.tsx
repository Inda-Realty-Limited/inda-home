"use client";

import { Button } from './ui/button';
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export function FooterCTA() {
  const currentYear = new Date().getFullYear();

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      router.push('/auth/signup');
    } else {
      const element = document.querySelector('[data-product-section]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const openWhatsAppDemo = () => {
    const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP;
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      "Hi, I would like to book a demo with Inda"
    )}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  return (
    <footer className="bg-gray-900 relative overflow-hidden">
      {/* Final CTA Section */}
      <section className="px-6 py-32 border-b border-gray-800 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4ea8a1]/20 via-purple-900/10 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ea8a1]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-white mb-8 text-5xl md:text-6xl leading-tight">
            The Future of Real Estate Moves Fast.{' '}
            <span className="bg-gradient-to-r from-[#4ea8a1] to-purple-400 bg-clip-text text-transparent">
              {'Don\'t Get Left Behind.'}
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of investors, developers, and professionals making smarter decisions with Inda.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] hover:from-[#3d8680] hover:to-[#2d7670] group shadow-xl shadow-[#4ea8a1]/25 text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={openWhatsAppDemo} size="lg" variant="outline" className="border-2 bg-transparent border-gray-600 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-xl flex items-center justify-center shadow-lg shadow-[#4ea8a1]/25">
                  <span className="text-white text-xl">I</span>
                </div>
                <span className="text-2xl text-white">Inda</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
              Inda verifies pricing, documents, and risk before listings go live, giving buyers, banks, and developers decision-ready deals.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/inda_insights/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#4ea8a1] transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a
                  href="https://ng.linkedin.com/company/investinda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#4ea8a1] transition-colors group"
                >
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-white mb-4">Products</h3>
              <ul className="space-y-3">
                <li><Link href="/for-buyers" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">For Buyers</Link></li>
                <li><Link href="/for-professionals" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">For Professionals</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">Market Insights</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">ROI Calculator</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">About Us</a></li>
                <li><Link href="/newsroom" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">Newsroom</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">Careers</a></li>
                <li><button onClick={openWhatsAppDemo} className="text-gray-400 hover:text-[#4ea8a1] transition-colors cursor-pointer">Contact</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#4ea8a1] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-gray-400 hover:text-[#4ea8a1] transition-colors">
                <Mail className="w-5 h-5" />
                <span>hello@investinda.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-[#4ea8a1] transition-colors">
                <Phone className="w-5 h-5" />
                <span>+2347084960775</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-[#4ea8a1] transition-colors">
                <MapPin className="w-5 h-5" />
                <span>Nigeria</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>© {currentYear} Inda. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#4ea8a1] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#4ea8a1] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#4ea8a1] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}