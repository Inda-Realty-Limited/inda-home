import {
  register,
  RegisterPayload,
  verifyOtp,
  requestResetPassword as requestResetApi,
} from "@/api/auth";
import { Button, Container, Footer, Input, Navbar } from "@/components";
import GoogleButton from "@/components/OAuth/GoogleButton";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, validateAndSanitize } from "@/utils/validation";
import { createFormSubmitLimiter } from "@/utils/rateLimiter";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiChevronDown,
  FiGlobe,
  FiHome,
  FiLock,
  FiMail,
  FiSearch,
  FiTag,
  FiUser,
  FiUsers,
} from "react-icons/fi";

export enum HowDidYouHearAboutUs {
  SearchEngines = "Search Engines – Google, Bing, Yahoo, etc.",
  SocialMediaOrganic = "Social Media (Organic) – Facebook, Instagram, Twitter/X, YouTube, TikTok",
  SocialMediaPaidAds = "Social Media (Paid Ads) – Facebook Ads, Instagram Ads, Twitter Ads, YouTube Ads",
  Referrals = "Referrals – Direct mentions, backlinks, influencer shares",
  CommunityGroupsForums = "Community Groups & Forums – WhatsApp groups, Telegram, niche online forums",
  EmailNewsletters = "Email / Newsletters – Campaigns, drip sequences, updates",
  Other = "Other",
}

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [lookingToDo, setLookingToDo] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState<HowDidYouHearAboutUs | "">("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [returnTo, setReturnTo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Role selection and Pro fields
  const [selectedRole, setSelectedRole] = useState<
    "Buyer" | "Agent" | "Investor" | "Developer"
  >("Buyer");
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();
  const toast = useToast();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = Array.from({ length: 6 }, (_, _i) =>
    React.createRef<HTMLInputElement>(),
  );
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { q, type, returnTo: rt } = router.query as Record<string, string>;
      setSearchQuery((q as string) || "");
      setSearchType((type as string) || "");
      setReturnTo((rt as string) || "");
    }
  }, [router.isReady, router.query]);

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => await register(payload),
    onSuccess: () => {
      toast.showToast(
        "Sign up successful! Please verify your email.",
        2500,
        "success",
      );
      setTimeout(() => setStep(4), 800);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Sign up failed. Please try again.";
      toast.showToast(errorMessage, 3000, "error");
    },
  });

  const lookingToDoOptions = [
    {
      value: "Buy a home to live in",
      label: "Buy a home to live in",
      icon: <FiHome />,
    },
    {
      value: "Invest in Property",
      label: "Invest in Property",
      icon: <FiBriefcase />,
    },
    {
      value: "I am an agent or developer",
      label: "I am an agent or developer",
      icon: <FiUser />,
    },
    {
      value: "I work with a bank or mortgage company",
      label: "I work with a bank or mortgage company",
      icon: <FiTag />,
    },
    { value: "Just Browsing", label: "Just Browsing", icon: <FiGlobe /> },
  ];

  const hearAboutUsOptions: {
    value: HowDidYouHearAboutUs;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: HowDidYouHearAboutUs.SearchEngines,
      label: "Search Engines – Google, Bing, Yahoo, etc.",
      icon: <FiSearch />,
    },
    {
      value: HowDidYouHearAboutUs.SocialMediaOrganic,
      label:
        "Social Media (Organic) – Facebook, Instagram, Twitter/X, YouTube, TikTok",
      icon: <FiUsers />,
    },
    {
      value: HowDidYouHearAboutUs.SocialMediaPaidAds,
      label:
        "Social Media (Paid Ads) – Facebook Ads, Instagram Ads, Twitter Ads, YouTube Ads",
      icon: <FiTag />,
    },
    {
      value: HowDidYouHearAboutUs.Referrals,
      label: "Referrals – Direct mentions, backlinks, influencer shares",
      icon: <FiUser />,
    },
    {
      value: HowDidYouHearAboutUs.CommunityGroupsForums,
      label:
        "Community Groups & Forums – WhatsApp groups, Telegram, niche online forums",
      icon: <FiGlobe />,
    },
    {
      value: HowDidYouHearAboutUs.EmailNewsletters,
      label: "Email / Newsletters – Campaigns, drip sequences, updates",
      icon: <FiMail />,
    },
    { value: HowDidYouHearAboutUs.Other, label: "Other", icon: <FiTag /> },
  ];

  return (
    <Container
      noPadding
      className="min-h-screen bg-white overflow-hidden text-inda-dark flex flex-col"
    >
      <Navbar variant="signUp" />
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div
          className={`flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[50%] mx-auto py-8 sm:py-12 px-4 sm:px-6 ${
            step === 2 ? "overflow-y-auto max-h-fit" : ""
          }`}
        >
          {step === 1 && (
            <>
              <h1 className="text-inda-dark text-center font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 leading-tight max-w-4xl">
                See the truth behind that listing today!
              </h1>
              <p className="text-inda-dark font-medium text-center text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl px-2">
                No noise. No spam. Just clarity where it matters most.
              </p>
              <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] mx-auto justify-center">
                <GoogleButton
                  returnTo={
                    returnTo ||
                    (searchQuery
                      ? `/${searchType === "ai" ? "search-results" : "result"}?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
                      : undefined)
                  }
                />
                <button
                  onClick={() => {
                    setStep(2);
                  }}
                  className="bg-[#4EA8A1] text-white font-medium text-lg sm:text-xl rounded-full w-full h-[56px] sm:h-[64px] transition-all duration-200 ease-in-out hover:bg-[#45968f] hover:scale-[0.98] active:scale-[0.96]"
                >
                  Use Email Instead
                </button>
              </div>
            </>
          )}

          {/* NEW STEP 2: Role Selection */}
          {step === 2 && (
            <>
              <h1 className="text-center font-bold text-2xl sm:text-3xl mb-4">
                Choose Your Account Type
              </h1>
              <p className="text-center text-gray-600 mb-8 text-sm sm:text-base px-4">
                Select the option that best describes you
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-[500px] mx-auto mb-8">
                {[
                  {
                    role: "Buyer" as const,
                    icon: "🏠",
                    title: "Buyer",
                    desc: "I want to buy a home",
                  },
                  {
                    role: "Agent" as const,
                    icon: "👔",
                    title: "Agent",
                    desc: "I sell & list homes",
                  },
                  {
                    role: "Investor" as const,
                    icon: "💼",
                    title: "Investor",
                    desc: "I invest in real estate",
                  },
                  {
                    role: "Developer" as const,
                    icon: "🏗️",
                    title: "Developer",
                    desc: "I build properties",
                  },
                ].map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => setSelectedRole(option.role)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center ${
                      selectedRole === option.role
                        ? "border-[#4EA8A1] bg-[#4EA8A1]/10 shadow-md scale-105"
                        : "border-gray-200 hover:border-[#4EA8A1]/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.icon}</div>
                    <div className="font-bold text-base mb-1">
                      {option.title}
                    </div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 w-full max-w-[400px] mx-auto">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#4EA8A1] text-white py-3 rounded-full font-semibold hover:bg-[#45968f] transition-all"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Email Form (previously step 2) */}
          {step === 3 && (
            <>
              <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[400px] py-8 sm:py-12 md:max-w-[480px] mx-auto">
                <h1 className="text-center font-bold text-xl sm:text-2xl mb-6 sm:mb-8">
                  Sign up with email
                </h1>
                <form
                  className="w-full flex flex-col gap-4 sm:gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setErrors({});

                    // Validate required fields
                    if (!lookingToDo) {
                      setErrors({
                        lookingToDo: "Please select what you're looking to do",
                      });
                      toast.showToast(
                        "Please select what you're looking to do",
                        2500,
                        "error",
                      );
                      return;
                    }

                    if (!hearAboutUs) {
                      setErrors({
                        hearAboutUs: "Please tell us how you heard about us",
                      });
                      toast.showToast(
                        "Please tell us how you heard about us",
                        2500,
                        "error",
                      );
                      return;
                    }

                    // Build payload with role and conditional Pro fields
                    const referralSource =
                      typeof window !== "undefined"
                        ? localStorage.getItem("inda_ref")
                        : null;
                    const payload: any = {
                      email,
                      firstName,
                      lastName,
                      password,
                      howDidYouHearAboutUs: hearAboutUs,
                      todo: lookingToDo,
                      role: selectedRole,
                      ...(referralSource ? { referralSource } : {}),
                    };

                    // Add Pro fields if not a Buyer
                    if (selectedRole !== "Buyer") {
                      // Validate required pro fields
                      if (!phoneNumber.trim()) {
                        setErrors({
                          phoneNumber:
                            "Phone number is required for Agents and Developers",
                        });
                        toast.showToast(
                          "Phone number is required",
                          2500,
                          "error",
                        );
                        return;
                      }
                      payload.companyName = companyName;
                      payload.companyType = companyType;
                      payload.registrationNumber = registrationNumber;
                      payload.phoneNumber = phoneNumber;
                    }

                    const validation = validateAndSanitize(
                      registerSchema,
                      payload,
                    );

                    if (!validation.success) {
                      setErrors(validation.errors);
                      toast.showToast(
                        "Please fix the errors in the form",
                        2500,
                        "error",
                      );
                      return;
                    }

                    const limiter = createFormSubmitLimiter("signup");
                    const limitCheck = limiter.checkLimit();

                    if (!limitCheck.allowed) {
                      toast.showToast(
                        "Please wait a moment before submitting again",
                        2000,
                        "error",
                      );
                      return;
                    }

                    registerMutation.mutate(validation.data);
                  }}
                >
                  {/* Email Field */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label
                      htmlFor="email"
                      className="text-gray-700 font-medium text-sm sm:text-base"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                        <FiMail />
                      </span>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`w-full rounded-xl bg-[#F9F9F9] border ${
                          errors.email ? "border-red-500" : "border-[#e0e0e0]"
                        } focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm -mt-3">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="relative flex items-center"></div>
                  </div>
                  {/* First Name Field */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label
                      htmlFor="firstName"
                      className="text-gray-700 font-medium text-sm sm:text-base"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                        <FiUser />
                      </span>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  {/* Last Name Field */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label
                      htmlFor="lastName"
                      className="text-gray-700 font-medium text-sm sm:text-base"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                        <FiUser />
                      </span>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label
                      htmlFor="password"
                      className="text-gray-700 font-medium text-sm sm:text-base"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                        <FiLock />
                      </span>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  {/* What are you looking to do dropdown */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label
                      htmlFor="lookingToDo"
                      className="text-gray-700 font-medium text-sm sm:text-base"
                    >
                      What are you looking to do?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 focus:ring-2 focus:ring-[#4EA8A1] text-left text-sm sm:text-base"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "lookingToDo"
                              ? null
                              : "lookingToDo",
                          )
                        }
                      >
                        <span className="flex items-center gap-2">
                          {
                            lookingToDoOptions.find(
                              (opt) => opt.value === lookingToDo,
                            )?.icon
                          }
                          {lookingToDo ? (
                            <span className="truncate">
                              {
                                lookingToDoOptions.find(
                                  (opt) => opt.value === lookingToDo,
                                )?.label
                              }
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Select an option
                            </span>
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
                  {/* How did you hear about us dropdown */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label
                      htmlFor="hearAboutUs"
                      className="text-gray-700 font-medium text-sm sm:text-base"
                    >
                      How did you hear about us?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 focus:ring-2 focus:ring-[#4EA8A1] text-left text-sm sm:text-base"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "hearAboutUs"
                              ? null
                              : "hearAboutUs",
                          )
                        }
                      >
                        <span className="flex items-center gap-2">
                          {
                            hearAboutUsOptions.find(
                              (opt) => opt.value === hearAboutUs,
                            )?.icon
                          }
                          {hearAboutUs ? (
                            <span className="truncate">
                              {
                                hearAboutUsOptions.find(
                                  (opt) => opt.value === hearAboutUs,
                                )?.label
                              }
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Select an option
                            </span>
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

                  {/* CONDITIONAL PRO FIELDS - Only for Agent, Investor, Developer */}
                  {selectedRole !== "Buyer" && (
                    <>
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">
                          Company Information
                        </h3>

                        {/* Company Name */}
                        <div className="flex flex-col gap-1 sm:gap-2 mb-4">
                          <label
                            htmlFor="companyName"
                            className="text-gray-700 font-medium text-sm sm:text-base"
                          >
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
                          <label
                            htmlFor="companyType"
                            className="text-gray-700 font-medium text-sm sm:text-base"
                          >
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
                              <option value="Real Estate Agency">
                                Real Estate Agency
                              </option>
                              <option value="Property Developer">
                                Property Developer
                              </option>
                              <option value="Investment Firm">
                                Investment Firm
                              </option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                          </div>
                        </div>

                        {/* Registration Number */}
                        <div className="flex flex-col gap-1 sm:gap-2 mb-4">
                          <label
                            htmlFor="registrationNumber"
                            className="text-gray-700 font-medium text-sm sm:text-base"
                          >
                            Registration Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="registrationNumber"
                            type="text"
                            placeholder="RC Number"
                            value={registrationNumber}
                            onChange={(e) =>
                              setRegistrationNumber(e.target.value)
                            }
                            className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <label
                            htmlFor="phoneNumber"
                            className="text-gray-700 font-medium text-sm sm:text-base"
                          >
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="+234..."
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full bg-[#4EA8A1] text-white py-2.5 sm:py-3 rounded-full font-semibold mt-3 sm:mt-4 text-sm sm:text-base hover:bg-[#39948b] transition-all duration-200"
                    type="submit"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Signing up..." : "Continue"}
                  </Button>
                </form>
                <span className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 text-center">
                  Already have an account?{" "}
                  <a
                    href={`/auth/signin${
                      returnTo
                        ? `?returnTo=${encodeURIComponent(returnTo)}`
                        : searchQuery
                          ? `?q=${encodeURIComponent(
                              searchQuery,
                            )}&type=${searchType}`
                          : ""
                    }`}
                    className="text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
                  >
                    Log in
                  </a>
                </span>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[480px] mx-auto animate-fade-in">
              <div className="w-full rounded-3xl px-0 py-0 flex flex-col items-center">
                <h1 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl mb-3 text-inda-dark tracking-tight">
                  Verify your email
                </h1>
                <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-4 sm:px-0">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-[#4EA8A1] break-all">
                    {email}
                  </span>
                </p>

                {/* Aesthetic spam check info */}
                <div className="w-full mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 mt-0.5">
                      <svg
                        className="w-full h-full text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 text-sm sm:text-base mb-1">
                        Don&apos;t see the code?
                      </h4>
                      <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
                        Check your{" "}
                        <span className="font-medium">spam or junk folder</span>
                        . Sometimes verification emails end up there. The email
                        is from <span className="font-medium">Inda</span>.
                      </p>
                    </div>
                  </div>
                </div>
                <form
                  className="w-full flex flex-col gap-5 sm:gap-7"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setOtpLoading(true);
                    const code = otp.join("");
                    if (code.length !== 6) {
                      toast.showToast(
                        "Please enter the 6-digit code.",
                        2500,
                        "error",
                      );
                      setOtpLoading(false);
                      return;
                    }
                    if (!verifyOtp) {
                      toast.showToast("Please wait, loading...", 2000, "error");
                      setOtpLoading(false);
                      return;
                    }
                    try {
                      const response = await verifyOtp({ email, code });
                      setOtpLoading(false);
                      toast.showToast("Email verified!", 2000, "success");

                      // If response includes user and token, store them and redirect
                      if (response?.token && response?.user) {
                        setUser(response.user, response.token);
                        setTimeout(() => {
                          // Role-based redirect
                          const userRole = response.user.role || selectedRole;
                          const isProRole =
                            userRole === "Agent" ||
                            userRole === "Developer" ||
                            userRole === "Admin";

                          if (isProRole) {
                            // Pro users go to dashboard
                            router.push("/dashboard");
                          } else if (returnTo) {
                            // Buyers with returnTo
                            try {
                              router.push(decodeURIComponent(returnTo));
                            } catch {
                              router.push(returnTo);
                            }
                          } else if (searchQuery) {
                            // Buyers with search query
                            const page =
                              searchType === "ai" ? "search-results" : "result";
                            router.push(
                              `/${page}?q=${encodeURIComponent(
                                searchQuery,
                              )}&type=${searchType}`,
                            );
                          } else {
                            // Default: Buyers go to home
                            router.push("/");
                          }
                        }, 800);
                      }
                    } catch (err: any) {
                      setOtpLoading(false);
                      toast.showToast(
                        err?.response?.data?.message ||
                          err?.message ||
                          "Invalid code. Please try again.",
                        2500,
                        "error",
                      );
                    }
                  }}
                >
                  <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          if (!val) return;
                          const newOtp = [...otp];
                          newOtp[idx] = val;
                          setOtp(newOtp);
                          if (idx < 5 && val)
                            otpInputs[idx + 1].current?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            if (otp[idx]) {
                              const newOtp = [...otp];
                              newOtp[idx] = "";
                              setOtp(newOtp);
                            } else if (idx > 0) {
                              otpInputs[idx - 1].current?.focus();
                            }
                          }
                        }}
                        className={`w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-xl sm:text-2xl md:text-3xl text-center rounded-xl border-2 transition-all duration-200 outline-none bg-[#F9F9F9] focus:ring-2 focus:ring-[#4EA8A1] border-[#e0e0e0] focus:border-[#4EA8A1] ${
                          digit ? "border-[#4EA8A1] bg-white" : ""
                        }`}
                        style={{
                          letterSpacing: "2px",
                        }}
                      />
                    ))}
                  </div>
                  {/* All error/success handled by toast, no inline text */}
                  <Button
                    className="w-full bg-[#4EA8A1] text-white py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#39948b] transition-all duration-200 mt-2"
                    type="submit"
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Verifying..." : "Verify"}
                  </Button>
                </form>
                <button
                  className="mt-4 sm:mt-6 text-[#4EA8A1] font-semibold hover:underline text-xs sm:text-sm disabled:opacity-60"
                  type="button"
                  disabled={resendLoading}
                  onClick={async () => {
                    if (!requestResetApi) return;
                    setResendLoading(true);
                    try {
                      await requestResetApi({ email });
                      toast.showToast(
                        "Verification code resent!",
                        2000,
                        "info",
                      );
                    } catch (err: any) {
                      toast.showToast(
                        err?.response?.data?.message ||
                          err?.message ||
                          "Failed to resend code.",
                        2500,
                        "error",
                      );
                    }
                    setResendLoading(false);
                  }}
                >
                  {resendLoading ? "Resending..." : "Resend code"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default Signup;
