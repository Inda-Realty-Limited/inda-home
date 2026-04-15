import { Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Target,
  Image as ImageIcon,
  Search,
  PhoneOff,
  BarChart3,
  FileQuestion,
  Palette,
  Camera,
  Award,
  MapPin,
  Star,
  FileText,
  Clock,
  DollarSign,
  Send,
  Sparkles,
  Video,
} from "lucide-react";

// ─── Preview Components ────────────────────────────────────────────────────────

function ListingPreview() {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="aspect-video bg-gradient-to-br from-inda-teal/20 to-inda-teal/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400')] bg-cover bg-center opacity-70" />
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Verified
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            12.5% ROI
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Luxury 4BR Apartment</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                Lekki Phase 1, Lagos
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-inda-teal">₦85M</div>
              <div className="text-xs text-green-600">Fair Value</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <FileCheck className="w-3 h-3 text-green-600" />
              <span>Title • Survey • C of O</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Strong ROI", value: "12.5%", bg: "bg-blue-50", text: "text-blue-600", val: "text-blue-900" },
          { label: "Market", value: "Fair", bg: "bg-green-50", text: "text-green-600", val: "text-green-900" },
          { label: "Rating", value: "4.8", bg: "bg-purple-50", text: "text-purple-600", val: "text-purple-900", star: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`${stat.bg} rounded-lg p-2 text-center`}
          >
            <div className={`text-xs ${stat.text} font-semibold`}>{stat.label}</div>
            {stat.star ? (
              <div className="flex items-center justify-center gap-1">
                <Star className={`w-4 h-4 ${stat.val} fill-current`} />
                <span className={`text-lg font-bold ${stat.val}`}>{stat.value}</span>
              </div>
            ) : (
              <div className={`text-lg font-bold ${stat.val}`}>{stat.value}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VerifiedDataPreview() {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">Title Verified</h4>
            <p className="text-sm text-green-700">Clean history • No encumbrances • Ready for transfer</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Verified 2 days ago
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: FileCheck, label: "Legal Docs", value: "5/5", sub: "Complete", ic: "text-blue-600", sv: "text-green-600" },
          { icon: MapPin, label: "Location", value: "9.2", sub: "High Score", ic: "text-purple-600", sv: "text-purple-600" },
          { icon: TrendingUp, label: "Market", value: "+15%", sub: "Growth/yr", ic: "text-orange-600", sv: "text-orange-600" },
          { icon: Shield, label: "Trust", value: "98%", sub: "Score", ic: "text-green-600", sv: "text-green-600" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${item.ic}`} />
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{item.value}</div>
              <div className={`text-xs ${item.sv}`}>{item.sub}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-inda-teal to-[#3d8780] rounded-lg p-3 text-white text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield className="w-4 h-4" />
          <span className="font-semibold text-sm">Inda Verified</span>
        </div>
        <p className="text-xs opacity-90">All data points authenticated</p>
      </motion.div>
    </div>
  );
}

function ReportPreview() {
  const verifications = [
    { label: "Title Verified", status: "Clean history", icon: Shield, colorBg: "bg-green-50", colorIcon: "text-green-600" },
    { label: "Market Analysis", status: "15% below avg", icon: TrendingUp, colorBg: "bg-blue-50", colorIcon: "text-blue-600" },
    { label: "Location Score", status: "High demand", icon: MapPin, colorBg: "bg-purple-50", colorIcon: "text-purple-600" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">Property Report</h4>
        <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </span>
      </div>

      <div className="space-y-2">
        {verifications.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className={`w-10 h-10 ${item.colorBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${item.colorIcon}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.status}</div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${item.colorIcon}`} />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-inda-teal/10 to-inda-teal/5 rounded-lg p-4 text-center border border-inda-teal/20"
      >
        <div className="text-3xl font-bold text-inda-teal mb-1">70+</div>
        <div className="text-xs text-gray-600">Data Points Verified</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full bg-inda-teal text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
      >
        <CheckCircle2 className="w-4 h-4" />
        Generate Report
      </motion.div>
    </div>
  );
}

function CRMPreview() {
  const leads = [
    { name: "Chioma A.", property: "4BR Lekki", stage: "negotiating", value: "₦85M", time: "2h ago", stageBg: "bg-amber-50", stageText: "text-amber-700", Icon: TrendingUp },
    { name: "Ibrahim Y.", property: "Land Ibeju", stage: "offer-sent", value: "₦15M", time: "1d ago", stageBg: "bg-teal-50", stageText: "text-teal-700", Icon: Send },
    { name: "Grace O.", property: "3BR Penthouse", stage: "payment", value: "₦180M", time: "3h ago", stageBg: "bg-green-50", stageText: "text-green-700", Icon: DollarSign },
    { name: "Tunde B.", property: "2BR Yaba", stage: "new", value: "₦35M", time: "10m ago", stageBg: "bg-blue-50", stageText: "text-blue-700", Icon: Clock },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">Active Pipeline</h4>
        <span className="text-xs bg-inda-teal/10 text-inda-teal px-2 py-1 rounded-full font-medium">12 Deals</span>
      </div>

      <div className="space-y-2">
        {leads.map((lead, idx) => {
          const Icon = lead.Icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3 border border-gray-200 hover:border-inda-teal transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-inda-teal to-[#3d8780] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {lead.name.split(" ")[0][0]}{lead.name.split(" ")[1][0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.property}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-inda-teal text-sm">{lead.value}</div>
                  <div className="text-xs text-gray-500">{lead.time}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs ${lead.stageBg} ${lead.stageText} px-2 py-1 rounded w-fit`}>
                <Icon className="w-3 h-3" />
                <span className="font-medium capitalize">{lead.stage.replace("-", " ")}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200"
      >
        <div className="text-center">
          <div className="text-xs text-gray-500">New</div>
          <div className="text-lg font-bold text-blue-600">3</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Active</div>
          <div className="text-lg font-bold text-amber-600">6</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Closing</div>
          <div className="text-lg font-bold text-green-600">3</div>
        </div>
      </motion.div>
    </div>
  );
}

function MarketingPreview() {
  const services = [
    { name: "Photography", icon: Camera, status: "completed" },
    { name: "Videography", icon: Video, status: "in-progress" },
    { name: "3D Walkthrough", icon: Sparkles, status: "scheduled" },
  ];

  const adTargets = [
    { region: "UK", leads: 124, flag: "🇬🇧" },
    { region: "US", leads: 89, flag: "🇺🇸" },
    { region: "Canada", leads: 56, flag: "🇨🇦" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">Marketing Suite</h4>
        <div className="w-2 h-2 bg-inda-teal rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Smart Ad Campaign</div>
              <div className="text-xs text-gray-500">Diaspora targeting active</div>
            </div>
          </div>
          <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {adTargets.map((target, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white rounded-lg p-2 text-center border border-gray-200"
            >
              <div className="text-lg mb-0.5">{target.flag}</div>
              <div className="text-xs font-semibold text-gray-900">{target.leads}</div>
              <div className="text-xs text-gray-500">leads</div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">Qualified leads</span>
          </div>
          <span className="text-sm font-bold text-green-600">+85%</span>
        </div>
      </motion.div>

      <div className="space-y-2">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isCompleted = service.status === "completed";
          const isInProgress = service.status === "in-progress";
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isCompleted ? "bg-green-50 border-green-200" : isInProgress ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? "bg-green-100" : isInProgress ? "bg-blue-100" : "bg-gray-200"}`}>
                <Icon className={`w-5 h-5 ${isCompleted ? "text-green-600" : isInProgress ? "text-blue-600" : "text-gray-600"}`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{service.name}</div>
                <div className="text-xs mt-0.5 flex items-center gap-1">
                  {isCompleted && <><CheckCircle2 className="w-3 h-3 text-green-600" /><span className="text-green-600">Completed</span></>}
                  {isInProgress && <><Clock className="w-3 h-3 text-blue-600" /><span className="text-blue-600">In Progress</span></>}
                  {!isCompleted && !isInProgress && <span className="text-gray-500">Scheduled</span>}
                </div>
              </div>
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionPreview() {
  const deals = [
    { name: "Lekki Apartment", stage: 75, status: "payment", barColor: "bg-green-500" },
    { name: "Ibeju Land", stage: 50, status: "negotiating", barColor: "bg-amber-500" },
    { name: "Yaba Flat", stage: 25, status: "viewing", barColor: "bg-blue-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">Deal Pipeline</h4>
        <span className="text-xs text-gray-500">₦315M Total</span>
      </div>

      <div className="space-y-3">
        {deals.map((deal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg p-3 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900 text-sm">{deal.name}</div>
              <span className="text-xs font-medium text-inda-teal">{deal.stage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${deal.stage}%` }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.8 }}
                className={`h-full ${deal.barColor} rounded-full`}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 capitalize">{deal.status}</span>
              <span className="text-gray-400">3 days left</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-4 gap-1 pt-3 border-t border-gray-200"
      >
        {[
          { label: "New", bg: "bg-blue-100", text: "text-blue-900" },
          { label: "Active", bg: "bg-amber-100", text: "text-amber-900" },
          { label: "Payment", bg: "bg-green-100", text: "text-green-900" },
        ].map((s, i) => (
          <div key={i} className={`h-10 ${s.bg} rounded flex items-center justify-center`}>
            <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
          </div>
        ))}
        <div className="h-10 bg-emerald-100 rounded flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-900" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 rounded-lg p-3 flex items-center gap-2"
      >
        <FileText className="w-4 h-4 text-gray-600" />
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-900">All Documents</div>
          <div className="text-xs text-gray-500">Contracts, Offers, Receipts</div>
        </div>
        <span className="text-xs text-inda-teal font-medium">View</span>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ForProfessionals: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const getButtonText = () => {
    if (!user) return "Apply to Join";
    if (user.subscriptionPlan !== "starter") return "Go to Dashboard";
    return "Apply to Join";
  };

  const onGetStarted = () => {
    if (user && user.subscriptionPlan !== "starter") {
      router.push("/dashboard");
      return;
    }
    router.push("/apply");
  };

  const frictions = [
    { icon: ImageIcon, title: "Weak Listings", description: "Blurry photos, missing details. Buyers scroll past in 3 seconds.", colorBg: "bg-red-500/20", colorIcon: "text-red-400" },
    { icon: AlertCircle, title: "Trust Issues", description: "\"Is the title clean?\" Buyers stall for weeks asking questions you can't answer.", colorBg: "bg-orange-500/20", colorIcon: "text-orange-400" },
    { icon: Clock, title: "Decision Delays", description: "52 days of back-and-forth because buyers need more info you don't have.", colorBg: "bg-yellow-500/20", colorIcon: "text-yellow-400" },
    { icon: PhoneOff, title: "Lost Leads", description: "Hot leads buried in 847 WhatsApp chats. You follow up 3 weeks too late.", colorBg: "bg-red-500/20", colorIcon: "text-red-400" },
    { icon: Search, title: "Poor Marketing", description: "₦50K spent on Instagram ads. Got 2 tire-kickers and 0 serious buyers.", colorBg: "bg-orange-500/20", colorIcon: "text-orange-400" },
    { icon: FileQuestion, title: "Deal Chaos", description: "5 deals at once. Zero tracking. Missed a ₦180M closing because it fell through the cracks.", colorBg: "bg-red-500/20", colorIcon: "text-red-400" },
  ];

  const solutions = [
    {
      problem: "Weak Listings",
      solution: "Listing Engine",
      icon: Palette,
      description: "Access to ₦400B+ verified inventory with strong ROI data, fair market valuations, and complete documentation—all in one platform.",
      features: ["₦400B+ verified property inventory", "Real ROI calculations & market data", "Fair market value assessments"],
      preview: <ListingPreview />,
    },
    {
      problem: "Trust Issues",
      solution: "Verified Data + Reports",
      icon: Shield,
      description: "Title verification, legal history, and neighborhood insights—all authenticated and ready to share with buyers instantly.",
      features: ["Title verification in 48hrs", "Complete legal history check", "Market data & location scores"],
      preview: <VerifiedDataPreview />,
    },
    {
      problem: "Decision Delays",
      solution: "Inda Reports",
      icon: FileCheck,
      description: "One-click property report with verified data. Answer 70+ buyer questions instantly and move from interest to commitment in minutes.",
      features: ["1-click report generation", "70+ data points covered", "Shareable via any channel"],
      preview: <ReportPreview />,
    },
    {
      problem: "Lost Leads",
      solution: "CRM System",
      icon: Target,
      description: "Every lead tracked from first message to final commission. Auto-capture from all channels, follow-up reminders, never lose another deal.",
      features: ["Auto-capture from all channels", "Smart follow-up reminders", "Complete pipeline visibility"],
      preview: <CRMPreview />,
    },
    {
      problem: "Poor Marketing",
      solution: "Marketing Engine",
      icon: Camera,
      description: "Professional photography, videography, 3D walkthroughs, and precision-targeted ads that reach qualified diaspora buyers—not tire-kickers.",
      features: ["Professional photography & video production", "Smart ad campaigns targeting UK, US, Canada buyers", "3D virtual tours & property staging"],
      preview: <MarketingPreview />,
    },
    {
      problem: "Deal Chaos",
      solution: "Transaction System",
      icon: BarChart3,
      description: "Track every deal stage, document, and deadline in one place. Know exactly where every commission stands at all times.",
      features: ["Visual pipeline tracking", "Centralized document management", "Automated deadline reminders"],
      preview: <TransactionPreview />,
    },
  ];

  return (
    <Container noPadding className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 text-gray-900 font-bold leading-tight"
            >
              The Operating System for Nigeria&apos;s{" "}
              <span className="bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
                Top 1% of Agents
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Stop managing your business on WhatsApp. Inda gives you the inventory, the global buyer pool,
              and the data-driven workflow to close ₦50M–₦500M+ deals in 30 days.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-gradient-to-br from-inda-teal to-[#3d8780] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-inda-teal/30 transition-all flex items-center gap-2 text-lg hover:scale-[1.02]"
                >
                  {getButtonText()}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-inda-teal" />
                  <span className="font-medium">No upfront cost</span> • Commission-based only
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {[
                { stat: "₦400B+", label: "Verified Inventory Pipeline" },
                { stat: "60%", label: "Faster Closing Rate" },
                { stat: "Direct", label: "Pipeline to Diaspora Capital" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-3xl font-bold text-inda-teal mb-1">{item.stat}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Frictions ── */}
      <section className="py-24 px-6 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight font-bold">
              These Are Costing You <span className="text-red-400">40%</span> of Your Commission
            </h2>
            <p className="text-xl text-gray-400">The daily struggles every agent faces</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frictions.map((friction, idx) => {
              const Icon = friction.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition-all"
                >
                  <div className={`w-12 h-12 ${friction.colorBg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${friction.colorIcon}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{friction.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{friction.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 tracking-tight font-bold">
              We Built a Solution for Each One
            </h2>
            <p className="text-xl text-gray-600">Every friction has a fix. Here&apos;s your complete toolkit.</p>
          </motion.div>

          <div className="space-y-24">
            {solutions.map((solution, idx) => {
              const Icon = solution.icon;
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? "md:grid-flow-dense" : ""}`}
                >
                  <div className={isEven ? "" : "md:col-start-2"}>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-2">
                        <span className="text-sm text-red-600 font-semibold line-through">{solution.problem}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-inda-teal/10 rounded-full px-4 py-2">
                        <Icon className="w-4 h-4 text-inda-teal" />
                        <span className="text-sm text-inda-teal font-semibold">{solution.solution}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{solution.solution}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{solution.description}</p>
                    <ul className="space-y-3">
                      {solution.features.map((feature, fIdx) => (
                        <motion.li
                          key={fIdx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * fIdx }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-inda-teal mt-0.5 shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className={isEven ? "" : "md:col-start-1 md:row-start-1"}
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-xl">
                      {solution.preview}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Transformation ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 tracking-tight font-bold">
              What&apos;s In It For You?
            </h2>
            <p className="text-xl text-gray-600">From &quot;Hustler&quot; to &quot;Advisor&quot;</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "From \"Hustling\" to \"Advising\"", body: "Use data-backed reports to win client trust instantly. Position yourself as a trusted advisor, not just another agent." },
              { icon: TrendingUp, title: "Predictable Wealth", body: "Move from \"Lucky breaks\" to a consistent, scalable monthly revenue model with systematic lead generation." },
              { icon: Award, title: "The \"Inda Verified\" Badge", body: "Stand out in a crowded market as a vetted, tech-enabled professional that buyers and sellers trust." },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-inda-teal/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-inda-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Invite Only CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-inda-teal/20 border border-inda-teal/30 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-inda-teal" />
              <span className="text-sm text-inda-teal font-semibold">Private Network</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight font-bold">
              We Are Not a Listing Site.
              <br />
              We Are a <span className="text-inda-teal">Private Network</span>.
            </h2>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              We are only onboarding Top-Tier Agents. We look for track records, not just talk.
            </p>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto italic">
              &quot;Inda is for the agents who know that the future of Real Estate isn&apos;t manual, it&apos;s systemic.&quot;
            </p>
            <button
              onClick={onGetStarted}
              className="group px-10 py-5 bg-gradient-to-br from-inda-teal to-[#3d8780] text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-inda-teal/40 transition-all inline-flex items-center gap-3 text-lg hover:scale-[1.02]"
            >
              {getButtonText()}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-6">Limited spots available • Invite only</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </Container>
  );
};

export default ForProfessionals;
