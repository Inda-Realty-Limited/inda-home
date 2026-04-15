import React, { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  User,
  TrendingUp,
  Home,
  Users,
  Target,
  Shield,
  CheckCircle2,
  X,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Input from "@/components/base/Input";
import { register } from "@/api/auth";

type FormData = {
  // Step 1: Basic Info
  fullName: string;
  phone: string;
  email: string;
  password: string;
  city: string;
  yearsExperience: string;
  licenseNumber: string;
  // Step 2: Sales Performance
  totalDeals12Months: string;
  totalSalesVolume12Months: string;
  averageDealSize: string;
  largestDeal: string;
  // Step 3: Active Deals
  activeListings: string;
  activeBuyers: string;
  dealTypes: string[];
  primaryAreas: string;
  // Step 4: Client Base
  totalClients: string;
  clientTypes: string[];
  averageBudget: string;
  repeatClientRate: string;
  // Step 5: Marketing
  leadChannels: string[];
  instagramHandle: string;
  websiteUrl: string;
  monthlyMarketingSpend: string;
  // Step 6: Commitment
  agreeToLogDeals: boolean;
  agreeTOS: boolean;
  agreePrivacy: boolean;
  idDocument: File | null;
  proofOfDeals: File | null;
};

const steps = [
  { icon: User, title: "Basic Info", description: "Your profile details" },
  { icon: TrendingUp, title: "Sales Performance", description: "Last 12 months data" },
  { icon: Home, title: "Active Deals", description: "Current listings & buyers" },
  { icon: Users, title: "Client Base", description: "Your client profile" },
  { icon: Target, title: "Marketing", description: "Distribution channels" },
  { icon: Shield, title: "Verification", description: "Legal & commitment" },
];

const TOTAL_STEPS = steps.length;

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showTOS, setShowTOS] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "", phone: "", email: "", password: "", city: "", yearsExperience: "", licenseNumber: "",
    totalDeals12Months: "", totalSalesVolume12Months: "", averageDealSize: "", largestDeal: "",
    activeListings: "", activeBuyers: "", dealTypes: [], primaryAreas: "",
    totalClients: "", clientTypes: [], averageBudget: "", repeatClientRate: "",
    leadChannels: [], instagramHandle: "", websiteUrl: "", monthlyMarketingSpend: "",
    agreeToLogDeals: false, agreeTOS: false, agreePrivacy: false,
    idDocument: null, proofOfDeals: null,
  });

  const update = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleArray = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Final step — submit
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "Agent";
    const lastName = nameParts.slice(1).join(" ") || undefined;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        role: "AGENT",
        todo: "I am an agent or developer",
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.push("/for-professionals");
  };

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const StepIcon = steps[currentStep].icon;
  const canSubmit = formData.agreeToLogDeals && formData.agreeTOS && formData.agreePrivacy;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-inda-teal/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-inda-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-inda-teal" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted</h1>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Thank you for applying! We'll review your application and send you an invite code via email within 24-48 hours.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gradient-to-br from-inda-teal to-[#3d8780] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-inda-teal/30 transition-all hover:scale-[1.02]"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-inda-teal/5 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="relative text-center mb-8">
            <button
              onClick={handleBack}
              className="absolute top-0 left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-inda-teal to-[#3d8780] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Join Inda Pro</h1>
            </div>
            <p className="text-gray-600">Trusted platform for verified agents</p>
          </div>

          {/* Step Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-inda-teal text-white"
                          : isActive
                          ? "bg-inda-teal text-white ring-4 ring-inda-teal/20"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <p className={`text-xs mt-2 text-center hidden sm:block ${isActive ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-inda-teal to-[#3d8780]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                  <StepIcon className="w-5 h-5 text-inda-teal" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
                  <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
                </div>
              </div>

              {/* ── Step 1: Basic Info ── */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                      <Input value={formData.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full legal name" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                      <Input value={formData.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234 XXX XXX XXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                    <Input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="your.email@example.com" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Primary City *</label>
                      <select
                        value={formData.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D7EBE7] bg-white text-inda-dark shadow-[0_2px_10px_rgba(15,61,65,0.04)] focus:outline-none focus:border-inda-teal focus:ring-2 focus:ring-inda-teal/30 transition"
                      >
                        <option value="">Select city</option>
                        <option>Lagos</option>
                        <option>Abuja</option>
                        <option>Port Harcourt</option>
                        <option>Ibadan</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Years of Experience *</label>
                      <Input type="number" value={formData.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} placeholder="e.g. 3" min="0" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Password *</label>
                    <div className="relative w-full">
                      <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 8 characters" className="w-full pr-10" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">You'll use this to sign in after your application is approved</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">License Number <span className="text-gray-400 font-normal">(optional)</span></label>
                    <Input value={formData.licenseNumber} onChange={(e) => update("licenseNumber", e.target.value)} placeholder="If you have a real estate license" />
                  </div>
                </div>
              )}

              {/* ── Step 2: Sales Performance ── */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      📊 <strong>Important:</strong> Only provide data from the last 12 months (nothing older).
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Total Deals Closed (12 months) *</label>
                      <Input type="number" value={formData.totalDeals12Months} onChange={(e) => update("totalDeals12Months", e.target.value)} placeholder="e.g. 8" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Total Sales Volume (₦) *</label>
                      <Input type="number" value={formData.totalSalesVolume12Months} onChange={(e) => update("totalSalesVolume12Months", e.target.value)} placeholder="e.g. 450000000" min="0" />
                      <p className="text-xs text-gray-500 mt-1">Total value of all deals closed</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Average Deal Size (₦)</label>
                      <Input type="number" value={formData.averageDealSize} onChange={(e) => update("averageDealSize", e.target.value)} placeholder="e.g. 56000000" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Largest Deal (₦)</label>
                      <Input type="number" value={formData.largestDeal} onChange={(e) => update("largestDeal", e.target.value)} placeholder="e.g. 120000000" min="0" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Active Deals ── */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Active Listings *</label>
                      <Input type="number" value={formData.activeListings} onChange={(e) => update("activeListings", e.target.value)} placeholder="e.g. 5" min="0" />
                      <p className="text-xs text-gray-500 mt-1">Properties you're currently marketing</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Active Buyers</label>
                      <Input type="number" value={formData.activeBuyers} onChange={(e) => update("activeBuyers", e.target.value)} placeholder="e.g. 12" min="0" />
                      <p className="text-xs text-gray-500 mt-1">Buyers you're currently working with</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Deal Types (Select all that apply) *</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {["Sale", "Rent", "Off-Plan", "Land", "Commercial", "Investment"].map((type) => (
                        <label
                          key={type}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.dealTypes.includes(type) ? "border-inda-teal bg-inda-teal/5" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input type="checkbox" checked={formData.dealTypes.includes(type)} onChange={() => toggleArray("dealTypes", type)} className="w-4 h-4 accent-inda-teal" />
                          <span className="text-sm font-medium text-gray-900">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Primary Areas</label>
                    <Input value={formData.primaryAreas} onChange={(e) => update("primaryAreas", e.target.value)} placeholder="e.g. Lekki, Ikoyi, Victoria Island" />
                  </div>
                </div>
              )}

              {/* ── Step 4: Client Base ── */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Total Client Database Size *</label>
                    <Input type="number" value={formData.totalClients} onChange={(e) => update("totalClients", e.target.value)} placeholder="e.g. 150" min="0" />
                    <p className="text-xs text-gray-500 mt-1">Past + current clients combined</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Client Types (Select all that apply) *</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {["First-Time Buyers", "Investors", "Luxury Buyers", "Corporate/Business", "Diaspora", "Families"].map((type) => (
                        <label
                          key={type}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.clientTypes.includes(type) ? "border-inda-teal bg-inda-teal/5" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input type="checkbox" checked={formData.clientTypes.includes(type)} onChange={() => toggleArray("clientTypes", type)} className="w-4 h-4 accent-inda-teal" />
                          <span className="text-sm font-medium text-gray-900">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Average Client Budget (₦)</label>
                      <select
                        value={formData.averageBudget}
                        onChange={(e) => update("averageBudget", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D7EBE7] bg-white text-inda-dark shadow-[0_2px_10px_rgba(15,61,65,0.04)] focus:outline-none focus:border-inda-teal focus:ring-2 focus:ring-inda-teal/30 transition"
                      >
                        <option value="">Select range</option>
                        <option value="under-20m">Under ₦20M</option>
                        <option value="20m-50m">₦20M – ₦50M</option>
                        <option value="50m-100m">₦50M – ₦100M</option>
                        <option value="100m-200m">₦100M – ₦200M</option>
                        <option value="over-200m">Over ₦200M</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Repeat Client Rate (%)</label>
                      <Input type="number" value={formData.repeatClientRate} onChange={(e) => update("repeatClientRate", e.target.value)} placeholder="e.g. 30" min="0" max="100" />
                      <p className="text-xs text-gray-500 mt-1">% of clients who return</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 5: Marketing ── */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Lead Generation Channels (Select all that apply) *</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {["Instagram", "Facebook", "LinkedIn", "WhatsApp", "Referrals", "Website", "Paid Ads", "Property Portals"].map((ch) => (
                        <label
                          key={ch}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.leadChannels.includes(ch) ? "border-inda-teal bg-inda-teal/5" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input type="checkbox" checked={formData.leadChannels.includes(ch)} onChange={() => toggleArray("leadChannels", ch)} className="w-4 h-4 accent-inda-teal" />
                          <span className="text-sm font-medium text-gray-900">{ch}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Instagram Handle <span className="text-gray-400 font-normal">(optional)</span></label>
                    <Input value={formData.instagramHandle} onChange={(e) => update("instagramHandle", e.target.value)} placeholder="@yourusername" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Website URL <span className="text-gray-400 font-normal">(optional)</span></label>
                    <Input value={formData.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} placeholder="https://yourwebsite.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Marketing Spend (₦)</label>
                    <select
                      value={formData.monthlyMarketingSpend}
                      onChange={(e) => update("monthlyMarketingSpend", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D7EBE7] bg-white text-inda-dark shadow-[0_2px_10px_rgba(15,61,65,0.04)] focus:outline-none focus:border-inda-teal focus:ring-2 focus:ring-inda-teal/30 transition"
                    >
                      <option value="">Select range</option>
                      <option value="under-50k">Under ₦50k</option>
                      <option value="50k-200k">₦50k – ₦200k</option>
                      <option value="200k-500k">₦200k – ₦500k</option>
                      <option value="over-500k">Over ₦500k</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── Step 6: Verification ── */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  {/* Platform Commitment */}
                  <div className="border-2 border-amber-300 bg-amber-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Platform Commitment Agreement</h3>
                        <p className="text-sm text-gray-700">By joining Inda Pro, you agree to maintain integrity and transparency in all transactions conducted through this platform.</p>
                      </div>
                    </div>
                    <label className={`flex items-start gap-3 p-4 bg-white border-2 rounded-lg cursor-pointer transition-all ${formData.agreeToLogDeals ? "border-inda-teal" : "border-gray-200 hover:border-inda-teal/50"}`}>
                      <input type="checkbox" checked={formData.agreeToLogDeals} onChange={(e) => update("agreeToLogDeals", e.target.checked)} className="w-5 h-5 accent-inda-teal mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-900">
                        <strong>I commit to logging all deals initiated on Inda</strong> and will not bypass the platform for transactions that originated here. I understand this protects buyers, ensures transparency, and maintains trust in the Inda ecosystem.
                      </span>
                    </label>
                  </div>

                  {/* Legal Agreements */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Legal Agreements</h3>
                    <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.agreeTOS ? "border-inda-teal" : "border-gray-200 hover:border-inda-teal/50"}`}>
                      <input type="checkbox" checked={formData.agreeTOS} onChange={(e) => update("agreeTOS", e.target.checked)} className="w-5 h-5 accent-inda-teal mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-900">
                        I have read and agree to the{" "}
                        <button type="button" onClick={() => setShowTOS(true)} className="text-inda-teal font-semibold underline hover:text-inda-teal/80">
                          Terms of Service
                        </button>
                      </span>
                    </label>
                    <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.agreePrivacy ? "border-inda-teal" : "border-gray-200 hover:border-inda-teal/50"}`}>
                      <input type="checkbox" checked={formData.agreePrivacy} onChange={(e) => update("agreePrivacy", e.target.checked)} className="w-5 h-5 accent-inda-teal mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-900">
                        I understand and agree to the{" "}
                        <button type="button" onClick={() => setShowPrivacy(true)} className="text-inda-teal font-semibold underline hover:text-inda-teal/80">
                          Privacy Policy
                        </button>
                        {" "}including collection of ID, contact information, and deal data
                      </span>
                    </label>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Verification Documents</h3>
                    {[
                      { id: "idUpload", field: "idDocument" as const, label: "Government-Issued ID *", hint: "Driver's License, Passport, etc." },
                      { id: "proofUpload", field: "proofOfDeals" as const, label: "Proof of Deals", hint: "Helps speed up approval (optional)" },
                    ].map(({ id, field, label, hint }) => (
                      <div key={id}>
                        <p className="block text-sm font-semibold text-gray-900 mb-2">{label}</p>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => update(field, e.target.files?.[0] || null)} className="hidden" id={id} />
                        <label htmlFor={id} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-inda-teal transition-all cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {formData[field] ? (formData[field] as File).name : `Upload ${hint}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF, max 5MB</p>
                        </label>
                      </div>
                    ))}
                  </div>

                  {currentStep === TOTAL_STEPS - 1 && !canSubmit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-900">⚠️ Please complete all required agreements to submit</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              {submitError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900">⚠️ {submitError}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {currentStep === 0 ? "Cancel" : "Back"}
                </button>

                <button
                  onClick={handleNext}
                  disabled={(currentStep === TOTAL_STEPS - 1 && !canSubmit) || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-inda-teal to-[#3d8780] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-inda-teal/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {currentStep === TOTAL_STEPS - 1 ? (
                    isSubmitting ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Submit Application</>
                    )
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ToS Modal */}
      {showTOS && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
              <button onClick={() => setShowTOS(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-gray-700">
              <div><h3 className="font-semibold text-gray-900 mb-1">1. Platform Usage</h3><p>By using Inda Pro, you agree to use the platform for legitimate real estate transactions and maintain professional standards.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">2. Deal Logging</h3><p>All transactions initiated through Inda must be logged and completed through the platform to ensure transparency and buyer protection.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">3. Commission Structure</h3><p>Inda charges a platform fee on successful transactions. Bypassing the platform for deals initiated here violates these terms.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">4. Professional Conduct</h3><p>Agents must maintain professional conduct, respond to inquiries promptly, and provide accurate property information.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">5. Account Suspension</h3><p>Violation of these terms may result in account suspension or permanent ban from the platform.</p></div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button onClick={() => setShowTOS(false)} className="w-full py-3 bg-inda-teal text-white rounded-xl font-semibold hover:bg-inda-teal/80 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Data We Collect</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Identity:</strong> Government-issued ID, name, contact details</li>
                  <li><strong>Professional:</strong> Sales history, active listings, client information</li>
                  <li><strong>Transactions:</strong> Deal details, property information, payment records</li>
                  <li><strong>Communication:</strong> Messages and interactions on the platform</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">How We Use Your Data</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Verify agent credentials and maintain platform trust</li>
                  <li>Facilitate transactions between agents and buyers</li>
                  <li>Generate performance analytics and insights</li>
                  <li>Improve platform features and user experience</li>
                </ul>
              </div>
              <div><h3 className="font-semibold text-gray-900 mb-1">Data Protection</h3><p>We use industry-standard encryption to protect your data. Your information is never sold to third parties.</p></div>
              <div><h3 className="font-semibold text-gray-900 mb-1">Data Retention</h3><p>We retain your data for as long as you maintain an active account, plus 7 years for legal compliance.</p></div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button onClick={() => setShowPrivacy(false)} className="w-full py-3 bg-inda-teal text-white rounded-xl font-semibold hover:bg-inda-teal/80 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
