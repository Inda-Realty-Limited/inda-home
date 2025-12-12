"use client";

import { TrendingUp } from 'lucide-react';

export function PropertyTicker() {
  const properties = [
    { location: 'Lekki Phase 1', type: '2BR', price: '₦180M', change: '↑3.4%', trend: 'up' },
    { location: 'Oniru', type: '1BR', price: '₦120M', change: '↑1.1%', trend: 'up' },
    { location: 'Victoria Island', type: 'Office', price: '₦85k/sqm/yr', change: '↑4.1%', trend: 'up' },
    { location: 'Epe', type: 'Land', price: '₦18k/sqm', change: '↑4.1%', trend: 'up' },
    { location: 'Ikoyi', type: '3BR', price: '₦250M', change: '↑2.8%', trend: 'up' },
    { location: 'Ajah', type: '2BR', price: '₦45M', change: '↑5.2%', trend: 'up' },
    { location: 'Yaba', type: 'Office', price: '₦55k/sqm/yr', change: '↑3.1%', trend: 'up' },
    { location: 'Banana Island', type: '4BR', price: '₦500M', change: '↑1.9%', trend: 'up' },
  ];

  // Duplicate the array multiple times for seamless loop
  const tickerItems = [...properties, ...properties, ...properties];

  return (
    <section className="py-6 bg-gray-900 border-y border-gray-800 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 px-6">
        <TrendingUp className="w-4 h-4 text-[#4ea8a1]" />
        <span className="text-xs uppercase tracking-wider text-gray-400">Live Market Data</span>
      </div>
      
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling ticker container */}
        <div className="overflow-hidden">
          <div className="flex gap-8 animate-scroll-slow w-max">
          {tickerItems.map((property, index) => (
            <div
              key={index}
                className="flex items-center gap-4 px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 whitespace-nowrap flex-shrink-0"
            >
              <div>
                <div className="text-white text-sm font-medium">{property.location}</div>
                <div className="text-gray-400 text-xs">{property.type}: {property.price}</div>
              </div>
              <div className="text-green-400 text-sm font-medium">
                {property.change}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
