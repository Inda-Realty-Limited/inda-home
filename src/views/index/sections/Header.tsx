"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl text-gray-900">Inda</span>
          </Link>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                Products
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {productsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link
                    href="/for-buyers"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <div>For Buyers</div>
                    <div className="text-sm text-gray-500">Invest smarter</div>
                  </Link>
                  <Link
                    href="/for-professionals"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <div>For Professionals</div>
                    <div className="text-sm text-gray-500">Grow your business</div>
                  </Link>
                </div>
              )}
            </div>

            <a href="#usecases" className="text-gray-700 hover:text-gray-900 transition-colors">
              Use Cases
            </a>
            
            <button className="text-gray-700 hover:text-gray-900 transition-colors cursor-not-allowed opacity-60">
              APIs <span className="text-xs text-gray-500 ml-1">Coming Soon</span>
            </button>
            
            <Link href="/newsroom" className="text-gray-700 hover:text-gray-900 transition-colors">
              Newsroom
            </Link>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}