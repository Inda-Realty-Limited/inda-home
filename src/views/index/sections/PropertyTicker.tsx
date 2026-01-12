"use client";

import { useState, useEffect, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

export function PropertyTicker() {
  const [relativeTime, setRelativeTime] = useState<{ [key: number]: string }>({});

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const properties = useMemo(() => [
    { location: 'Lekki Phase 1', type: '2BR', price: '₦180M', change: '↑3.4%', trend: 'up', updatedAt: new Date(Date.now() - 2 * 60 * 1000) },
    { location: 'Oniru', type: '1BR', price: '₦120M', change: '↑1.1%', trend: 'up', updatedAt: new Date(Date.now() - 5 * 60 * 1000) },
    { location: 'Victoria Island', type: 'Office', price: '₦85k/sqm/yr', change: '↑4.1%', trend: 'up', updatedAt: new Date(Date.now() - 15 * 60 * 1000) },
    { location: 'Epe', type: 'Land', price: '₦18k/sqm', change: '↑4.1%', trend: 'up', updatedAt: new Date(Date.now() - 2 * 3600 * 1000) },
    { location: 'Ikoyi', type: '3BR', price: '₦250M', change: '↑2.8%', trend: 'up', updatedAt: new Date(Date.now() - 1 * 3600 * 1000) },
    { location: 'Ajah', type: '2BR', price: '₦45M', change: '↑5.2%', trend: 'up', updatedAt: new Date(Date.now() - 30 * 1000) },
    { location: 'Yaba', type: 'Office', price: '₦55k/sqm/yr', change: '↑3.1%', trend: 'up', updatedAt: new Date(Date.now() - 3 * 86400 * 1000) },
    { location: 'Banana Island', type: '4BR', price: '₦500M', change: '↑1.9%', trend: 'up', updatedAt: new Date(Date.now() - 1 * 604800 * 1000) },
  ], []);

  useEffect(() => {
    const updateTimes = () => {
      const newRelativeTime: { [key: number]: string } = {};
      properties.forEach((prop, index) => {
        newRelativeTime[index] = formatRelativeTime(prop.updatedAt);
      });
      setRelativeTime(newRelativeTime);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [properties]);

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
                <div className="text-gray-500 text-xs">
                  {relativeTime[index % properties.length] || 'updating...'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
