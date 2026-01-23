import { Button, Container, Footer, Input, Navbar } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { updateProfile } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const getSafeReturnTo = (value?: string | string[]) => {
  if (!value || Array.isArray(value)) {
    return "/";
  }
  try {
    const decoded = decodeURIComponent(value);
    return decoded.startsWith("/") ? decoded : "/";
  } catch {
    return "/";
  }
};

// Enum options matching backend
const howDidYouHearAboutUsOptions = [
  { value: "Search Engines – Google, Bing, Yahoo, etc.", label: "Search Engines – Google, Bing, Yahoo, etc." },
  { value: "Social Media (Organic) – Facebook, Instagram, Twitter/X, YouTube, TikTok", label: "Social Media (Organic)" },
  { value: "Social Media (Paid Ads) – Facebook Ads, Instagram Ads, Twitter Ads, YouTube Ads", label: "Social Media (Paid Ads)" },
  { value: "Referrals – Direct mentions, backlinks, influencer shares", label: "Referrals" },
  { value: "Community Groups & Forums – WhatsApp groups, Telegram, niche online forums", label: "Community Groups & Forums" },
  { value: "Email / Newsletters – Campaigns, drip sequences, updates", label: "Email / Newsletters" },
  { value: "Other", label: "Other" },
];

const todoOptions = [
  { value: "Buy a home to live in", label: "Buy a home to live in" },
  { value: "Invest in Property", label: "Invest in Property" },
  { value: "I am an agent or developer", label: "I am an agent or developer" },
  { value: "I work with a bank or mortgage company", label: "I work with a bank or mortgage company" },
  { value: "Just Browsing", label: "Just Browsing" },
];

const CompleteProfilePage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, setUser } = useAuth();

  const [selectedRole, setSelectedRole] = useState<
    "Buyer" | "Agent" | "Investor" | "Developer"
  >("Buyer");
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState("");
  const [todo, setTodo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (
      user.role === "Buyer" ||
      user.role === "Agent" ||
      user.role === "Investor" ||
      user.role === "Developer"
    ) {
      setSelectedRole(user.role);
    }
    setCompanyName(user.companyName || "");
    setCompanyType(user.companyType || "");
    setRegistrationNumber(user.registrationNumber || "");
    setPhoneNumber(user.phoneNumber || "");
    setHowDidYouHearAboutUs(user.howDidYouHearAboutUs || "");
    setTodo(user.todo || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        role: selectedRole,
      };

      // Only include these if they have values
      if (howDidYouHearAboutUs) {
        payload.howDidYouHearAboutUs = howDidYouHearAboutUs;
      }
      if (todo) {
        payload.todo = todo;
      }

      if (selectedRole !== "Buyer") {
        if (!companyName.trim()) {
          toast.showToast("Company name is required", 2500, "error");
          setSubmitting(false);
          return;
        }
        if (!phoneNumber.trim()) {
          toast.showToast("Phone number is required", 2500, "error");
          setSubmitting(false);
          return;
        }
        payload.companyName = companyName;
        payload.companyType = companyType;
        payload.registrationNumber = registrationNumber;
        payload.phoneNumber = phoneNumber;
      }

      await updateProfile(payload);

      if (user) {
        const updatedUser = {
          ...user,
          ...payload,
        };
        setUser(updatedUser);
      }
      toast.showToast("Profile updated", 2000, "success");

      const { returnTo } = router.query;
      const destination = getSafeReturnTo(returnTo);

      const isProRole =
        selectedRole === "Agent" || selectedRole === "Developer";

      if (isProRole) {
        router.push("/dashboard");
        return;
      }

      if (destination && destination !== "/") {
        router.push(destination);
        return;
      }

      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile";
      toast.showToast(message, 2500, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      noPadding
      className="min-h-screen bg-white overflow-hidden text-inda-dark flex flex-col"
    >
      <Navbar variant="signUp" />
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[50%] mx-auto py-8 sm:py-12 px-4 sm:px-6">
          <h1 className="text-center font-bold text-2xl sm:text-3xl mb-4">
            Complete your profile
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm sm:text-base px-4 max-w-xl">
            Choose the account type that fits you best. This helps us tailor
            your Inda experience.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[520px] mx-auto space-y-8"
          >
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                Account type <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    role: "Buyer" as const,
                    title: "Buyer",
                    desc: "I want to buy a home",
                  },
                  {
                    role: "Agent" as const,
                    title: "Agent",
                    desc: "I sell and list homes",
                  },
                  {
                    role: "Investor" as const,
                    title: "Investor",
                    desc: "I invest in real estate",
                  },
                  {
                    role: "Developer" as const,
                    title: "Developer",
                    desc: "I build properties",
                  },
                ].map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => setSelectedRole(option.role)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selectedRole === option.role
                        ? "border-[#4EA8A1] bg-[#4EA8A1]/10 shadow-md scale-[1.02]"
                        : "border-gray-200 hover:border-[#4EA8A1]/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-bold text-base mb-1">
                      {option.title}
                    </div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedRole !== "Buyer" && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Professional details
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="text-red-500">*</span> Required
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-700">
                    Company name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    className="bg-[#F9F9F9] border border-[#e0e0e0] rounded-xl"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-700">Company type</label>
                  <div className="relative">
                    <select
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-[#4EA8A1] focus:border-[#4EA8A1]"
                    >
                      <option value="">Select company type</option>
                      <option value="Real Estate Agency">Real Estate Agency</option>
                      <option value="Property Developer">Property Developer</option>
                      <option value="Investment Firm">Investment Firm</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-700">
                    Registration number
                  </label>
                  <Input
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="RC or registration number (optional)"
                    className="bg-[#F9F9F9] border border-[#e0e0e0] rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-700">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    className="bg-[#F9F9F9] border border-[#e0e0e0] rounded-xl"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">
                  What are you looking to do?
                </label>
                <div className="relative">
                  <select
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-[#4EA8A1] focus:border-[#4EA8A1]"
                  >
                    <option value="">Select an option</option>
                    {todoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">
                  How did you hear about Inda?
                </label>
                <div className="relative">
                  <select
                    value={howDidYouHearAboutUs}
                    onChange={(e) => setHowDidYouHearAboutUs(e.target.value)}
                    className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-[#4EA8A1] focus:border-[#4EA8A1]"
                  >
                    <option value="">Select an option</option>
                    {howDidYouHearAboutUsOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4EA8A1] text-white py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#39948b] transition-all duration-200"
            >
              {submitting ? "Saving..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default CompleteProfilePage;
