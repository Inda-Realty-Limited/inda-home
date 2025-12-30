import React from 'react';
import {
    FaCalculator,
    FaLaptopCode,
    FaTools,
    FaCamera,
    FaPlaneDeparture,
    FaClock,
    FaShieldAlt,
    FaChevronRight
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export interface PerkItem {
    id: string;
    name: string;
    category: string;
    description: string;
    logoColor: string;
    discount: string;
    validUntil?: string;
    buttonText: string;
}

export interface PerkCategory {
    id: string;
    title: string;
    icon: IconType;
    items: PerkItem[];
}

const PERK_CATEGORIES: PerkCategory[] = [
    {
        id: 'finance',
        title: 'Finance & Operational',
        icon: FaCalculator,
        items: [
            {
                id: 'f1',
                name: 'QuickBooks',
                category: 'Finance',
                description: 'Accounting software for small business.',
                logoColor: '#2CA01C',
                discount: '15% Off',
                validUntil: 'Valid until Dec 31',
                buttonText: 'View Offer'
            },
            {
                id: 'f2',
                name: 'FreshBooks',
                category: 'Finance',
                description: 'Invoicing and accounting software.',
                logoColor: '#0075DD',
                discount: '20% Off',
                validUntil: 'Valid until Dec 31',
                buttonText: 'View Offer'
            },
            {
                id: 'f3',
                name: 'HoneyBook',
                category: 'Finance',
                description: 'Client management software.',
                logoColor: '#FF5A5F',
                discount: '10% Off',
                validUntil: 'Valid until Dec 31',
                buttonText: 'View Offer'
            }
        ]
    },
    {
        id: 'software',
        title: 'Software & Tools',
        icon: FaLaptopCode,
        items: [
            {
                id: 's1',
                name: 'Slack',
                category: 'Communication',
                description: 'Team communication platform.',
                logoColor: '#4A154B',
                discount: '25% Off',
                validUntil: 'First 6 Months',
                buttonText: 'View Offer'
            },
            {
                id: 's2',
                name: 'Trello',
                category: 'Productivity',
                description: 'Project management tool.',
                logoColor: '#0079BF',
                discount: '20% Off',
                validUntil: 'Annual Plan',
                buttonText: 'View Offer'
            },
            {
                id: 's3',
                name: 'Asana',
                category: 'Productivity',
                description: 'Work management platform.',
                logoColor: '#F06A6A',
                discount: '30% Off',
                validUntil: 'First Year',
                buttonText: 'View Offer'
            },
            {
                id: 's4',
                name: 'Canva Pro',
                category: 'Design',
                description: 'Graphic design platform.',
                logoColor: '#00C4CC',
                discount: '50% Off',
                validUntil: 'First 3 Months',
                buttonText: 'View Offer'
            }
        ]
    },
    {
        id: 'construction',
        title: 'Construction Materials',
        icon: FaTools,
        items: [
            {
                id: 'c1',
                name: 'Dangote Cement',
                category: 'Materials',
                description: 'High quality cement products.',
                logoColor: '#E31837',
                discount: 'Bulk Discount',
                validUntil: 'Orders > 100 bags',
                buttonText: 'View Offer'
            },
            {
                id: 'c2',
                name: 'Berger Paints',
                category: 'Materials',
                description: 'Premium paint solutions.',
                logoColor: '#005596',
                discount: '15% Off',
                validUntil: 'Orders > ₦500k',
                buttonText: 'View Offer'
            }
        ]
    },
    {
        id: 'photography',
        title: 'Photography & Videography',
        icon: FaCamera,
        items: [
            {
                id: 'p1',
                name: 'Adobe Creative Cloud',
                category: 'Software',
                description: 'Creative apps and services.',
                logoColor: '#FF0000',
                discount: '40% Off',
                validUntil: 'First Year',
                buttonText: 'View Offer'
            },
            {
                id: 'p2',
                name: 'Nikon Pro',
                category: 'Gear',
                description: 'Professional camera equipment.',
                logoColor: '#FFE100',
                discount: '10% Off',
                validUntil: 'Selected Items',
                buttonText: 'View Offer'
            },
            {
                id: 'p3',
                name: 'DJI Drones',
                category: 'Gear',
                description: 'Aerial photography drones.',
                logoColor: '#000000',
                discount: '5% Off',
                validUntil: 'New Models',
                buttonText: 'View Offer'
            }
        ]
    },
    {
        id: 'lifestyle',
        title: 'Lifestyle & Experience',
        icon: FaPlaneDeparture,
        items: [
            {
                id: 'l1',
                name: 'The Wheatbaker',
                category: 'Hospitality',
                description: 'Luxury boutique hotel.',
                logoColor: '#8B4513',
                discount: '15% Off',
                validUntil: 'Weekend Stays',
                buttonText: 'View Offer'
            },
            {
                id: 'l2',
                name: 'Ibom Air',
                category: 'Travel',
                description: 'Scheduled airline services.',
                logoColor: '#008000',
                discount: '5% Off',
                validUntil: 'Business Class',
                buttonText: 'View Offer'
            }
        ]
    }
];

const COMING_SOON_PERKS = [
    { name: 'Legal Services', icon: FaClock },
    { name: 'Insurance', icon: FaShieldAlt }
];

export default function PerksPage() {
    return (
        <DashboardLayout title="Perks Hub">
            <div className="max-w-6xl mx-auto pb-20">

                <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-[#1F5F5B] to-[#E8F5E9] h-64 flex items-center shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#113835] via-[#1F5F5B]/80 to-transparent z-10" />

                    <div className="relative z-20 px-10 py-8 text-white w-full md:w-2/3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                            <span className="bg-white/20 px-2 py-1 rounded">Inda Pro Exclusive</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Member Perks</h1>
                        <p className="text-sm md:text-base opacity-90 leading-relaxed mb-6 max-w-lg">
                            Enjoy exclusive discounts and benefits curated specifically for real estate professionals to help grow your business.
                        </p>
                        <div className="flex gap-8 text-xs font-medium">
                            <div>
                                <span className="block text-2xl font-bold">₦1.2M+</span>
                                <span className="opacity-70">Value Saved</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-bold">50+</span>
                                <span className="opacity-70">Partner Brands</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-bold">100%</span>
                                <span className="opacity-70">Free for Pros</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {PERK_CATEGORIES.map((category) => (
                        <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-inda-dark rounded-full text-white">
                                    <category.icon size={14} />
                                </div>
                                <h2 className="text-lg font-bold text-inda-dark">{category.title}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((perk) => (
                                    <div key={perk.id} className="bg-white border border-[#EAEAEA] rounded-xl p-5 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div
                                                className="w-10 h-10 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                                                style={{ backgroundColor: perk.logoColor }}
                                            >
                                                {perk.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-inda-teal transition-colors">
                                                    {perk.name}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">
                                                    {perk.category}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 mb-6 line-clamp-2 min-h-[2.5em]">
                                            {perk.description}
                                        </p>

                                        <div className="bg-[#54A6A6] text-white rounded-lg p-3 mt-auto flex justify-between items-center relative overflow-hidden">
                                            <div className="relative z-10">
                                                <span className="block text-xs opacity-90 font-medium">Exclusive</span>
                                                <span className="block text-lg font-bold">{perk.discount}</span>
                                            </div>
                                            <div className="text-right relative z-10">
                                                <span className="block text-[9px] opacity-80 uppercase">Valid Until</span>
                                                <span className="block text-[10px] font-semibold">{perk.validUntil}</span>
                                            </div>
                                            <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 transform translate-x-4" />
                                        </div>

                                        <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
                                            <button className="text-[10px] font-bold text-inda-teal hover:underline flex items-center gap-1">
                                                {perk.buttonText}
                                            </button>
                                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                                                <FaChevronRight size={8} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4 border border-gray-100">
                        <span className="text-xl">🚀</span>
                    </div>
                    <h3 className="text-lg font-bold text-inda-dark mb-2">More Perks Coming Soon</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-8">
                        We are constantly negotiating with new partners to bring you the best deals for your business.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {COMING_SOON_PERKS.map((item, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-[#1F5F5B] to-[#113835] text-white p-4 rounded-lg flex flex-col items-center justify-center h-24 opacity-90">
                                <item.icon size={20} className="mb-2 opacity-80" />
                                <span className="text-xs font-bold">{item.name}</span>
                                <span className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">Coming Soon</span>
                            </div>
                        ))}
                        <div className="bg-[#EAEAEA] p-4 rounded-lg flex flex-col items-center justify-center h-24">
                            <span className="text-2xl opacity-30">🎁</span>
                            <span className="text-[10px] text-gray-400 font-bold mt-1">Surprise Perk</span>
                        </div>
                        <div className="bg-[#EAEAEA] p-4 rounded-lg flex flex-col items-center justify-center h-24">
                            <span className="text-2xl opacity-30">✨</span>
                            <span className="text-[10px] text-gray-400 font-bold mt-1">Surprise Perk</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
