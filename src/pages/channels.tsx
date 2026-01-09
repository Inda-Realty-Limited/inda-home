import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FaWhatsapp,
    FaInstagram,
    FaFacebook,
    FaRegEnvelope,
    FaCopy,
    FaCheckCircle,
    FaChevronDown,
    FaMagic,
} from 'react-icons/fa';
import { useToast } from '@/components/ToastProvider';

interface ChannelCardProps {
    platform: string;
    icon: React.ReactNode;
    leads: number;
    conversion: string;
    instructions: string[];
    trackingLink: string;
    stats: {
        clicks: number;
        leads: number;
        conversion: string;
    };
    borderColor: string;
    iconColor: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
    platform,
    icon,
    leads,
    conversion,
    instructions,
    trackingLink,
    stats,
    borderColor,
    iconColor
}) => {
    const toast = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingLink);
        setCopied(true);
        toast.showToast('Link copied to clipboard!', 2000, 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`bg-white rounded-[32px] border-2 ${borderColor} p-6 md:p-8 flex flex-col gap-6 shadow-sm transition-all hover:shadow-md h-full`}>
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center text-white text-2xl`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{platform}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {leads} leads <span className="mx-1">•</span> {conversion} conversion
                    </p>
                </div>
            </div>

            {/* Promotion Selector */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Choose what to promote:</label>
                <div className="relative">
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <span className="text-lg">🏘️</span> All Properties (Portfolio Page)
                        </span>
                        <FaChevronDown className="text-gray-400" />
                    </button>
                    <p className="mt-1.5 text-xs text-gray-400">Link shows all your properties in one page</p>
                </div>
            </div>

            {/* Tracking Link */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Your Tracking Link:</label>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 truncate">
                        {trackingLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="w-12 h-12 rounded-xl bg-[#4EA8A1]/10 text-[#4EA8A1] flex items-center justify-center hover:bg-[#4EA8A1]/20 transition-colors shrink-0"
                    >
                        {copied ? <FaCheckCircle /> : <FaCopy />}
                    </button>
                </div>
            </div>

            {/* How to use */}
            <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">How to use:</h4>
                <ol className="space-y-2">
                    {instructions.map((step, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="font-bold text-gray-400">{i + 1}.</span>
                            {step}
                        </li>
                    ))}
                </ol>
            </div>

            {/* Stats Footer */}
            <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Clicks:</p>
                    <p className="text-xl font-bold text-gray-900">{stats.clicks.toLocaleString()}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Leads:</p>
                    <p className="text-xl font-bold text-gray-900">{stats.leads.toLocaleString()}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Conversion:</p>
                    <p className="text-xl font-bold text-[#4EA8A1]">{stats.conversion}</p>
                </div>
            </div>
        </div>
    );
};

export default function ChannelSetup() {
    const steps = [
        { title: 'Choose Property', desc: 'Select which property (or all) to promote', number: 1 },
        { title: 'Copy Link', desc: 'Get your unique tracking link for that channel', number: 2 },
        { title: 'Share Anywhere', desc: 'Post on WhatsApp, Instagram, Jiji, anywhere', number: 3 },
        { title: 'Track Results', desc: 'See which channel brings the most leads', number: 4 },
    ];

    return (
        <DashboardLayout title="Channel Setup">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Channel Integration Setup</h1>
                    <p className="text-gray-500 font-medium">Connect your marketing channels to track leads and measure ROI automatically</p>
                </div>

                {/* How it works banner */}
                <div className="bg-[#4EA8A1] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FaMagic className="text-8xl transform rotate-12" />
                    </div>

                    <div className="flex items-center gap-3 mb-10">
                        <FaMagic className="text-2xl" />
                        <h2 className="text-2xl font-bold">How Channel Tracking Works</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step) => (
                            <div key={step.number} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 relative group hover:bg-white/20 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg mb-4">
                                    {step.number}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                <p className="text-white/80 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Channels Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                    <ChannelCard
                        platform="WhatsApp"
                        icon={<FaWhatsapp />}
                        leads={127}
                        conversion="6%"
                        instructions={[
                            'Copy the tracking link above',
                            'Share in WhatsApp groups or DMs',
                            'When someone clicks, we track it automatically',
                            'View all WhatsApp leads in your Leads Inbox'
                        ]}
                        trackingLink="investinda.com/portfolio?c=whatsapp"
                        stats={{ clicks: 2103, leads: 127, conversion: '6%' }}
                        borderColor="border-[#25D366]/20"
                        iconColor="bg-[#25D366]"
                    />

                    <ChannelCard
                        platform="Instagram"
                        icon={<FaInstagram />}
                        leads={89}
                        conversion="6%"
                        instructions={[
                            'Copy the tracking link above',
                            'Add to your Instagram bio or link in bio tool',
                            'Use in post captions and Stories',
                            'Track which posts drive the most leads'
                        ]}
                        trackingLink="investinda.com/portfolio?c=instagram"
                        stats={{ clicks: 1450, leads: 89, conversion: '6%' }}
                        borderColor="border-[#E1306C]/20"
                        iconColor="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
                    />

                    <ChannelCard
                        platform="Facebook"
                        icon={<FaFacebook />}
                        leads={56}
                        conversion="5%"
                        instructions={[
                            'Copy the tracking link above',
                            'Share in Facebook groups or your timeline',
                            'Use in Facebook Marketplace listings',
                            'Track which posts get the most engagement'
                        ]}
                        trackingLink="investinda.com/portfolio?c=facebook"
                        stats={{ clicks: 1123, leads: 56, conversion: '5%' }}
                        borderColor="border-[#1877F2]/20"
                        iconColor="bg-[#1877F2]"
                    />

                    <ChannelCard
                        platform="Email Signature"
                        icon={<FaRegEnvelope />}
                        leads={23}
                        conversion="5%"
                        instructions={[
                            'Copy the tracking link above',
                            'Add to your email signature',
                            'Include in property inquiry responses',
                            'Track leads from email outreach'
                        ]}
                        trackingLink="investinda.com/portfolio?c=email"
                        stats={{ clicks: 445, leads: 23, conversion: '5%' }}
                        borderColor="border-red-500/20"
                        iconColor="bg-red-500"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
