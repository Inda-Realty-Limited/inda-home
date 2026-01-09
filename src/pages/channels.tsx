import React, { useState, useEffect } from 'react';
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
    FaSpinner,
} from 'react-icons/fa';
import { useToast } from '@/components/ToastProvider';
import { useAuth } from '@/contexts/AuthContext';
import { getChannelStats, ChannelStatsItem, getPublicListings, PublicListing } from '@/api/channels';

interface PromotionOption {
    id: string;
    label: string;
    description: string;
    icon: string;
}

interface ChannelCardProps {
    platform: string;
    channelKey: string;
    icon: React.ReactNode;
    instructions: string[];
    stats: {
        clicks: number;
        leads: number;
    };
    borderColor: string;
    iconColor: string;
    userId: string;
    promotionOptions: PromotionOption[];
}

const ChannelCard: React.FC<ChannelCardProps> = ({
    platform,
    channelKey,
    icon,
    instructions,
    stats,
    borderColor,
    iconColor,
    userId,
    promotionOptions,
}) => {
    const toast = useToast();
    const [copied, setCopied] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<string>('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const conversion = stats.clicks > 0
        ? Math.round((stats.leads / stats.clicks) * 100)
        : 0;

    // Generate tracking link based on selection
    const getTrackingLink = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://investinda.com';
        if (selectedPromotion === 'all') {
            return `${baseUrl}/portfolio/${userId}?c=${channelKey}`;
        }
        return `${baseUrl}/portfolio/${userId}?c=${channelKey}&listing=${selectedPromotion}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getTrackingLink());
        setCopied(true);
        toast.showToast('Link copied to clipboard!', 2000, 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedOption = promotionOptions.find(opt => opt.id === selectedPromotion) || promotionOptions[0];

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
                        {stats.leads} leads <span className="mx-1">•</span> {conversion}% conversion
                    </p>
                </div>
            </div>

            {/* Promotion Selector */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Choose what to promote:</label>
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        <span className="flex items-center gap-2 truncate">
                            <span className="text-lg">{selectedOption?.icon}</span>
                            <span className="truncate">{selectedOption?.label}</span>
                        </span>
                        <FaChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {promotionOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        setSelectedPromotion(option.id);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${selectedPromotion === option.id ? 'bg-[#4EA8A1]/10' : ''
                                        }`}
                                >
                                    <span className="text-lg">{option.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{option.label}</p>
                                        <p className="text-xs text-gray-400 truncate">{option.description}</p>
                                    </div>
                                    {selectedPromotion === option.id && (
                                        <FaCheckCircle className="text-[#4EA8A1] shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="mt-1.5 text-xs text-gray-400">{selectedOption?.description}</p>
                </div>
            </div>

            {/* Tracking Link */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Your Tracking Link:</label>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 truncate">
                        {getTrackingLink()}
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
                    <p className="text-xl font-bold text-[#4EA8A1]">{conversion}%</p>
                </div>
            </div>
        </div>
    );
};

// Channel configurations
const CHANNEL_CONFIG = {
    whatsapp: {
        platform: 'WhatsApp',
        icon: <FaWhatsapp />,
        instructions: [
            'Copy the tracking link above',
            'Share in WhatsApp groups or DMs',
            'When someone clicks, we track it automatically',
            'View all WhatsApp leads in your Leads Inbox'
        ],
        borderColor: 'border-[#25D366]/20',
        iconColor: 'bg-[#25D366]',
    },
    instagram: {
        platform: 'Instagram',
        icon: <FaInstagram />,
        instructions: [
            'Copy the tracking link above',
            'Add to your Instagram bio or link in bio tool',
            'Use in post captions and Stories',
            'Track which posts drive the most leads'
        ],
        borderColor: 'border-[#E1306C]/20',
        iconColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    },
    facebook: {
        platform: 'Facebook',
        icon: <FaFacebook />,
        instructions: [
            'Copy the tracking link above',
            'Share in Facebook groups or your timeline',
            'Use in Facebook Marketplace listings',
            'Track which posts get the most engagement'
        ],
        borderColor: 'border-[#1877F2]/20',
        iconColor: 'bg-[#1877F2]',
    },
    email: {
        platform: 'Email Signature',
        icon: <FaRegEnvelope />,
        instructions: [
            'Copy the tracking link above',
            'Add to your email signature',
            'Include in property inquiry responses',
            'Track leads from email outreach'
        ],
        borderColor: 'border-red-500/20',
        iconColor: 'bg-red-500',
    },
};

export default function ChannelSetup() {
    const { user } = useAuth();
    const [channelStats, setChannelStats] = useState<ChannelStatsItem[]>([]);
    const [listings, setListings] = useState<PublicListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stats, userListings] = await Promise.all([
                    getChannelStats(),
                    user?._id ? getPublicListings(user._id) : Promise.resolve([]),
                ]);
                setChannelStats(stats);
                setListings(userListings);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?._id]);

    const steps = [
        { title: 'Choose Property', desc: 'Select which property (or all) to promote', number: 1 },
        { title: 'Copy Link', desc: 'Get your unique tracking link for that channel', number: 2 },
        { title: 'Share Anywhere', desc: 'Post on WhatsApp, Instagram, Jiji, anywhere', number: 3 },
        { title: 'Track Results', desc: 'See which channel brings the most leads', number: 4 },
    ];

    // Build promotion options from listings
    const promotionOptions: PromotionOption[] = [
        {
            id: 'all',
            label: 'All Properties (Portfolio Page)',
            description: 'Link shows all your properties in one page',
            icon: '🏘️',
        },
        ...listings.map((listing) => ({
            id: listing._id,
            label: listing.title || 'Untitled Property',
            description: `${listing.microlocationStd || listing.state || 'No location'} • ${listing.priceNGN ? `₦${listing.priceNGN.toLocaleString()}` : 'Price TBD'}`,
            icon: '🏠',
        })),
    ];

    // Get stats for a specific channel
    const getStatsForChannel = (channel: string) => {
        const stat = channelStats.find((s) => s.channel === channel);
        return {
            clicks: stat?.clicks || 0,
            leads: stat?.leads || 0,
        };
    };

    const channelOrder = ['whatsapp', 'instagram', 'facebook', 'email'];

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
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-4xl text-[#4EA8A1]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                        {channelOrder.map((channelKey) => {
                            const config = CHANNEL_CONFIG[channelKey as keyof typeof CHANNEL_CONFIG];
                            return (
                                <ChannelCard
                                    key={channelKey}
                                    platform={config.platform}
                                    channelKey={channelKey}
                                    icon={config.icon}
                                    instructions={config.instructions}
                                    stats={getStatsForChannel(channelKey)}
                                    borderColor={config.borderColor}
                                    iconColor={config.iconColor}
                                    userId={user?._id || 'demo'}
                                    promotionOptions={promotionOptions}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
