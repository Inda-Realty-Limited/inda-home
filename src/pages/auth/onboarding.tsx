import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
    FiBriefcase,
    FiChevronDown,
    FiGlobe,
    FiHome,
    FiMail,
    FiSearch,
    FiTag,
    FiUser,
    FiUsers,
} from "react-icons/fi";
import { Button, Container, Footer, Input, Navbar } from "@/components";
import apiClient from "@/api";

export enum HowDidYouHearAboutUs {
    SearchEngines = "Search Engines – Google, Bing, Yahoo, etc.",
    SocialMediaOrganic = "Social Media (Organic) – Facebook, Instagram, Twitter/X, YouTube, TikTok",
    SocialMediaPaidAds = "Social Media (Paid Ads) – Facebook Ads, Instagram Ads, Twitter Ads, YouTube Ads",
    Referrals = "Referrals – Direct mentions, backlinks, influencer shares",
    CommunityGroupsForums = "Community Groups & Forums – WhatsApp groups, Telegram, niche online forums",
    EmailNewsletters = "Email / Newsletters – Campaigns, drip sequences, updates",
    Other = "Other",
}

const Onboarding: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<'Buyer' | 'Agent' | 'Investor' | 'Developer'>('Buyer');
    const [lookingToDo, setLookingToDo] = useState("");
    const [hearAboutUs, setHearAboutUs] = useState<HowDidYouHearAboutUs | "">("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();
    const { setUser } = useAuth();
    const toast = useToast();
    const { returnTo } = router.query;

    const lookingToDoOptions = [
        { value: "Buy a home to live in", label: "Buy a home to live in", icon: <FiHome /> },
        { value: "Invest in Property", label: "Invest in Property", icon: <FiBriefcase /> },
        { value: "I am an agent or developer", label: "I am an agent or developer", icon: <FiUser /> },
        { value: "I work with a bank or mortgage company", label: "I work with a bank or mortgage company", icon: <FiTag /> },
        { value: "Just Browsing", label: "Just Browsing", icon: <FiGlobe /> },
    ];

    const hearAboutUsOptions: {
        value: HowDidYouHearAboutUs;
        label: string;
        icon: React.ReactNode;
    }[] = [
            { value: HowDidYouHearAboutUs.SearchEngines, label: "Search Engines – Google, Bing, Yahoo, etc.", icon: <FiSearch /> },
            { value: HowDidYouHearAboutUs.SocialMediaOrganic, label: "Social Media (Organic) – Facebook, Instagram, Twitter/X, YouTube, TikTok", icon: <FiUsers /> },
            { value: HowDidYouHearAboutUs.SocialMediaPaidAds, label: "Social Media (Paid Ads) – Facebook Ads, Instagram Ads, Twitter Ads, YouTube Ads", icon: <FiTag /> },
            { value: HowDidYouHearAboutUs.Referrals, label: "Referrals – Direct mentions, backlinks, influencer shares", icon: <FiUser /> },
            { value: HowDidYouHearAboutUs.CommunityGroupsForums, label: "Community Groups & Forums – WhatsApp groups, Telegram, niche online forums", icon: <FiGlobe /> },
            { value: HowDidYouHearAboutUs.EmailNewsletters, label: "Email / Newsletters – Campaigns, drip sequences, updates", icon: <FiMail /> },
            { value: HowDidYouHearAboutUs.Other, label: "Other", icon: <FiTag /> },
        ];

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);

        // Validate required fields
        if (!lookingToDo) {
            setErrors({ lookingToDo: 'Please select what you\'re looking to do' });
            toast.showToast("Please select what you're looking to do", 2500, "error");
            setLoading(false);
            return;
        }

        if (!hearAboutUs) {
            setErrors({ hearAboutUs: 'Please tell us how you heard about us' });
            toast.showToast("Please tell us how you heard about us", 2500, "error");
            setLoading(false);
            return;
        }

        // Validate Pro fields
        if (selectedRole !== 'Buyer' && !phoneNumber.trim()) {
            setErrors({ phoneNumber: 'Phone number is required for Agents, Developers, and Investors' });
            toast.showToast("Phone number is required", 2500, "error");
            setLoading(false);
            return;
        }

        const payload: any = {
            role: selectedRole,
            howDidYouHearAboutUs: hearAboutUs,
            todo: lookingToDo,
        };

        // Add Pro fields if applicable
        if (selectedRole !== 'Buyer') {
            payload.companyName = companyName;
            payload.companyType = companyType;
            payload.registrationNumber = registrationNumber;
            payload.phoneNumber = phoneNumber;
        }

        try {
            const response = await apiClient.post('/auth/complete-profile', payload);

            if (response.data.user) {
                // Update auth context with new user data
                setUser(response.data.user, localStorage.getItem('inda_token') || '');
                toast.showToast("Profile completed successfully!", 2000, "success");

                // Role-based redirect
                const isProRole = selectedRole === 'Agent' || selectedRole === 'Developer' || selectedRole === 'Investor';

                setTimeout(() => {
                    if (isProRole) {
                        router.push('/dashboard');
                    } else if (returnTo && typeof returnTo === 'string') {
                        router.push(decodeURIComponent(returnTo));
                    } else {
                        router.push('/');
                    }
                }, 800);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to complete profile";
            toast.showToast(errorMessage, 3000, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container noPadding className="min-h-screen bg-white overflow-hidden text-inda-dark flex flex-col">
            <Navbar variant="signUp" />
            <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
                <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[50%] mx-auto py-8 sm:py-12 px-4 sm:px-6">

                    {/* STEP 1: Role Selection */}
                    {step === 1 && (
                        <>
                            <h1 className="text-center font-bold text-2xl sm:text-3xl mb-4">
                                Complete Your Profile
                            </h1>
                            <p className="text-center text-gray-600 mb-8 text-sm sm:text-base px-4">
                                Select the option that best describes you
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-[500px] mx-auto mb-8">
                                {[
                                    { role: 'Buyer' as const, icon: '🏠', title: 'Buyer', desc: 'I want to buy a home' },
                                    { role: 'Agent' as const, icon: '👔', title: 'Agent', desc: 'I sell & list homes' },
                                    { role: 'Investor' as const, icon: '💼', title: 'Investor', desc: 'I invest in real estate' },
                                    { role: 'Developer' as const, icon: '🏗️', title: 'Developer', desc: 'I build properties' },
                                ].map((option) => (
                                    <button
                                        key={option.role}
                                        type="button"
                                        onClick={() => setSelectedRole(option.role)}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center ${selectedRole === option.role
                                            ? 'border-[#4EA8A1] bg-[#4EA8A1]/10 shadow-md scale-105'
                                            : 'border-gray-200 hover:border-[#4EA8A1]/50 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-4xl mb-2">{option.icon}</div>
                                        <div className="font-bold text-base mb-1">{option.title}</div>
                                        <div className="text-xs text-gray-600">{option.desc}</div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full max-w-[400px] bg-[#4EA8A1] text-white py-3 rounded-full font-semibold hover:bg-[#45968f] transition-all"
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {/* STEP 2: Profile Details */}
                    {step === 2 && (
                        <>
                            <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] mx-auto">
                                <h1 className="text-center font-bold text-xl sm:text-2xl mb-6 sm:mb-8">
                                    Tell us more about yourself
                                </h1>

                                <form className="w-full flex flex-col gap-4 sm:gap-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                                    {/* What are you looking to do? */}
                                    <div className="flex flex-col gap-1 sm:gap-2">
                                        <label htmlFor="lookingToDo" className="text-gray-700 font-medium text-sm sm:text-base">
                                            What are you looking to do? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="w-full flex items-center justify-between rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 focus:ring-2 focus:ring-[#4EA8A1] text-left text-sm sm:text-base"
                                                onClick={() => setOpenDropdown(openDropdown === "lookingToDo" ? null : "lookingToDo")}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {lookingToDoOptions.find((opt) => opt.value === lookingToDo)?.icon}
                                                    {lookingToDo ? (
                                                        <span className="truncate">{lookingToDoOptions.find((opt) => opt.value === lookingToDo)?.label}</span>
                                                    ) : (
                                                        <span className="text-gray-400">Select an option</span>
                                                    )}
                                                </span>
                                                <FiChevronDown className="flex-shrink-0" />
                                            </button>
                                            {openDropdown === "lookingToDo" && (
                                                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-[#e0e0e0] max-h-48 overflow-y-auto">
                                                    {lookingToDoOptions.map((opt) => (
                                                        <div
                                                            key={opt.value}
                                                            className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 cursor-pointer hover:bg-[#F9F9F9] transition text-sm sm:text-base"
                                                            onClick={() => {
                                                                setLookingToDo(opt.value);
                                                                setOpenDropdown(null);
                                                            }}
                                                        >
                                                            {opt.icon}
                                                            <span className="truncate">{opt.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* How did you hear about us? */}
                                    <div className="flex flex-col gap-1 sm:gap-2">
                                        <label htmlFor="hearAboutUs" className="text-gray-700 font-medium text-sm sm:text-base">
                                            How did you hear about us? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="w-full flex items-center justify-between rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 focus:ring-2 focus:ring-[#4EA8A1] text-left text-sm sm:text-base"
                                                onClick={() => setOpenDropdown(openDropdown === "hearAboutUs" ? null : "hearAboutUs")}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {hearAboutUsOptions.find((opt) => opt.value === hearAboutUs)?.icon}
                                                    {hearAboutUs ? (
                                                        <span className="truncate">{hearAboutUsOptions.find((opt) => opt.value === hearAboutUs)?.label}</span>
                                                    ) : (
                                                        <span className="text-gray-400">Select an option</span>
                                                    )}
                                                </span>
                                                <FiChevronDown className="flex-shrink-0" />
                                            </button>
                                            {openDropdown === "hearAboutUs" && (
                                                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-[#e0e0e0] max-h-48 overflow-y-auto">
                                                    {hearAboutUsOptions.map((opt) => (
                                                        <div
                                                            key={opt.value}
                                                            className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 cursor-pointer hover:bg-[#F9F9F9] transition text-sm sm:text-base"
                                                            onClick={() => {
                                                                setHearAboutUs(opt.value);
                                                                setOpenDropdown(null);
                                                            }}
                                                        >
                                                            {opt.icon}
                                                            <span className="truncate">{opt.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CONDITIONAL PRO FIELDS */}
                                    {selectedRole !== 'Buyer' && (
                                        <>
                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">
                                                    Company Information
                                                </h3>

                                                {/* Company Name */}
                                                <div className="flex flex-col gap-1 sm:gap-2 mb-4">
                                                    <label htmlFor="companyName" className="text-gray-700 font-medium text-sm sm:text-base">
                                                        Company Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        id="companyName"
                                                        type="text"
                                                        placeholder="Your Company Name"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                                                    />
                                                </div>

                                                {/* Company Type */}
                                                <div className="flex flex-col gap-1 sm:gap-2 mb-4">
                                                    <label htmlFor="companyType" className="text-gray-700 font-medium text-sm sm:text-base">
                                                        Company Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="companyType"
                                                            value={companyType}
                                                            onChange={(e) => setCompanyType(e.target.value)}
                                                            className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base appearance-none"
                                                        >
                                                            <option value="">Select Company Type</option>
                                                            <option value="Real Estate Agency">Real Estate Agency</option>
                                                            <option value="Property Developer">Property Developer</option>
                                                            <option value="Investment Firm">Investment Firm</option>
                                                        </select>
                                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                                    </div>
                                                </div>

                                                {/* Registration Number */}
                                                <div className="flex flex-col gap-1 sm:gap-2 mb-4">
                                                    <label htmlFor="registrationNumber" className="text-gray-700 font-medium text-sm sm:text-base">
                                                        Registration Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        id="registrationNumber"
                                                        type="text"
                                                        placeholder="RC Number"
                                                        value={registrationNumber}
                                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                                        className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                                                    />
                                                </div>

                                                {/* Phone Number */}
                                                <div className="flex flex-col gap-1 sm:gap-2">
                                                    <label htmlFor="phoneNumber" className="text-gray-700 font-medium text-sm sm:text-base">
                                                        Phone Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        id="phoneNumber"
                                                        type="tel"
                                                        placeholder="+234..."
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className={`w-full rounded-xl bg-[#F9F9F9] border ${errors.phoneNumber ? 'border-red-500' : 'border-[#e0e0e0]'} focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base`}
                                                    />
                                                    {errors.phoneNumber && (
                                                        <p className="text-red-500 text-xs sm:text-sm">{errors.phoneNumber}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-4 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all"
                                        >
                                            Back
                                        </button>
                                        <Button
                                            className="flex-1 bg-[#4EA8A1] text-white py-3 rounded-full font-semibold hover:bg-[#39948b] transition-all duration-200"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? "Completing..." : "Complete Profile"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </Container>
    );
};

export default Onboarding;
