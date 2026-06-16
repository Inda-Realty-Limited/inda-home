import { Navbar } from "@/components";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  TrendingUp,
  Shield,
  Brain,
  Building2,
  Lock,
  Headphones,
  Send,
  ChevronRight,
  BarChart2,
  FileText,
} from "lucide-react";

interface LandingPageBuyersProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
  onViewProfessionals?: () => void;
}

function Sparkline() {
  const points = [0, 12, 5, 18, 10, 24, 16, 20, 22, 30, 26, 28, 32, 38];
  const max = Math.max(...points);
  const w = 120;
  const h = 40;
  const pts = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const fill = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ea8a1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4ea8a1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${fill} ${w},${h}`} fill="url(#sparkGrad)" />
      <polyline
        points={pts}
        fill="none"
        stroke="#4ea8a1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BarRow({
  label,
  value,
  color = "#4ea8a1",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400">{label}</span>
        <span className="font-mono text-xs" style={{ color }}>
          {value}/10
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value * 10}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function LandingPageBuyers({
  onGetStarted,
  onSignIn,
}: LandingPageBuyersProps) {
  const [aiInput, setAiInput] = useState("");

  const pillars = [
    {
      icon: BarChart2,
      title: "Live Property Intelligence",
      body: "Real-time yield data, price growth trends, and neighbourhood scores updated daily.",
      tag: "Data Layer",
    },
    {
      icon: Brain,
      title: "AI Property Assistant",
      body: "Ask any question about a Lagos property. Get answers backed by verified data, not guesses.",
      tag: "AI Engine",
    },
    {
      icon: Shield,
      title: "Verified Listings",
      body: "Every listing passes a 47-point legal and physical verification before it reaches you.",
      tag: "Trust Layer",
    },
    {
      icon: Lock,
      title: "Live Escrow",
      body: "Your funds held in regulated escrow until every condition is met. No wire-and-pray.",
      tag: "Finance",
    },
    {
      icon: Headphones,
      title: "Property Concierge",
      body: "A dedicated advisor guides you from first search to keys-in-hand, from any timezone.",
      tag: "Service",
    },
  ];

  const nearbars = [
    { label: "Security", value: 8.2 },
    { label: "Infrastructure", value: 7.4 },
    { label: "Flood Risk", value: 8.8 },
    { label: "Rental Demand", value: 9.1 },
    { label: "Resale Liquidity", value: 7.6 },
  ];

  const chatMessages = [
    {
      role: "user",
      text: "What's the rental yield on a 3-bed in Lekki Phase 1 right now?",
    },
    {
      role: "ai",
      text: "Based on 247 comparable transactions in the last 90 days:",
      code: `yield_range:   6.8% - 8.2%\nmedian_yield:  7.4%\navg_rent_pcm:  N850,000\ncapital_value: N138M - N165M`,
    },
    {
      role: "user",
      text: "Is the title typically clean for properties in that area?",
    },
    {
      role: "ai",
      text: "Title risk in Lekki Phase 1 is low but worth verifying:",
      code: `title_type:      C of O (80%), Deed (20%)\nencumbrance_rate: 4.1%\nverif_time:      28-48 hrs\nrecommended:     Full title search`,
    },
  ];

  const escrowSteps = [
    {
      title: "Buyer commits funds",
      desc: "You transfer USD/GBP into your Inda escrow wallet from anywhere in the world.",
    },
    {
      title: "Conditions locked in",
      desc: "Payment terms, verification milestones, and release triggers written into the escrow agreement.",
    },
    {
      title: "Independent verification",
      desc: "Inda's legal partners run title, physical, and planning checks before any release.",
    },
    {
      title: "Release on completion",
      desc: "Funds released to seller only when every condition is satisfied - never before.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <section
        className="relative overflow-hidden bg-[#071412] px-6 pb-24 pt-28"
        style={{
          backgroundImage:
            "radial-gradient(circle at 60% 40%, rgba(78,168,161,0.07) 0%, transparent 60%), linear-gradient(0deg, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
          backgroundSize: "auto, 40px 40px, 40px 40px",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#4ea8a1]/25 bg-[#4ea8a1]/15 px-4 py-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ea8a1]" />
                <span className="font-mono text-xs uppercase tracking-wide text-[#4ea8a1]">
                  Live Intelligence Platform
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
                Know everything about a Nigerian property{" "}
                <span className="italic text-[#4ea8a1]">before you spend a penny.</span>
              </h1>

              <p className="mb-10 max-w-lg text-lg leading-relaxed text-white/55">
                Live insights. ROI projections. Verified listings. AI that answers any question.
                Escrow that protects every dollar you send.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={onGetStarted}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#4ea8a1] to-[#3d8780] px-7 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#4ea8a1]/25"
                >
                  Explore properties
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={onSignIn || onGetStarted}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-4 text-base font-medium text-white/70 transition-all hover:border-white/30 hover:text-white"
                >
                  Sign in
                </button>
              </div>

              <div className="mt-10 flex items-center gap-6">
                {[
                  { val: "N400B+", label: "Verified inventory" },
                  { val: "48hrs", label: "Title verification" },
                  { val: "100%", label: "Escrow protected" },
                ].map((stat) => (
                  <div key={stat.val}>
                    <div className="font-mono text-xl font-bold text-white">{stat.val}</div>
                    <div className="mt-0.5 text-xs text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d201e] shadow-2xl shadow-black/60">
                <div className="border-b border-white/8 px-5 pb-4 pt-5">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-white/40">
                        Property Intelligence
                      </p>
                      <h3 className="text-base font-semibold text-white">
                        4-Bed Duplex, Lekki Phase 1
                      </h3>
                      <p className="mt-0.5 text-xs text-white/40">
                        Lagos Island · Off-plan · N145,000,000
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-[#4ea8a1]/20 bg-[#4ea8a1]/15 px-3 py-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ea8a1]" />
                      <span className="font-mono text-[10px] text-[#4ea8a1]">LIVE</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                  {[
                    { label: "Rental Yield", value: "7.4%", delta: "+0.3% YoY", up: true },
                    { label: "Price Growth", value: "14.2%", delta: "24-month", up: true },
                    { label: "Payback", value: "13.5 yrs", delta: "at market rent", up: null },
                  ].map((m) => (
                    <div key={m.label} className="px-4 py-3">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
                        {m.label}
                      </p>
                      <p className="font-mono text-lg font-bold text-white">{m.value}</p>
                      <p
                        className={`mt-0.5 font-mono text-[10px] ${
                          m.up === true ? "text-[#4ea8a1]" : "text-white/40"
                        }`}
                      >
                        {m.delta}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-b border-white/8 px-5 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                      Price history · 24 months
                    </p>
                    <p className="font-mono text-[10px] text-[#4ea8a1]">+14.2%</p>
                  </div>
                  <Sparkline />
                </div>

                <div className="space-y-3 border-b border-white/8 px-5 py-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
                    Neighbourhood Scores
                  </p>
                  {nearbars.map((b) => (
                    <BarRow key={b.label} label={b.label} value={b.value} />
                  ))}
                </div>

                <div className="px-5 py-4">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
                    Ask anything about this property
                  </p>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3">
                    <input
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="e.g. What's the flood risk in this area?"
                      className="flex-1 bg-transparent text-sm text-white/70 outline-none placeholder:text-white/25"
                    />
                    <button
                      onClick={onGetStarted}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4ea8a1] transition-colors hover:bg-[#3d9a93]"
                    >
                      <Send className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#4ea8a1]">
              Platform
            </p>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Everything you need to buy with confidence.
            </h2>
          </motion.div>

          <div className="grid gap-0 overflow-hidden rounded-2xl border border-gray-100 md:grid-cols-5">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex flex-col gap-4 p-6 transition-colors hover:bg-gray-50 ${
                    i < pillars.length - 1 ? "border-r border-gray-100" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4ea8a1]/10">
                    <Icon className="h-5 w-5 text-[#4ea8a1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-sm font-bold leading-snug text-gray-900">
                      {p.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-500">{p.body}</p>
                  </div>
                  <div className="inline-block">
                    <span className="rounded-full border border-[#4ea8a1]/15 bg-[#4ea8a1]/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-[#4ea8a1]">
                      {p.tag}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#071412] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#4ea8a1]">
              Intelligence
            </p>
            <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              More data on a single Lagos property than three site visits.
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d201e] lg:col-span-3"
            >
              <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                {[
                  { label: "Rental Yield", value: "7.4%" },
                  { label: "Capital Growth", value: "14.2%" },
                  { label: "Payback Period", value: "13.5 yrs" },
                ].map((s) => (
                  <div key={s.label} className="px-5 py-4">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
                      {s.label}
                    </p>
                    <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/35">
                  Neighbourhood Scores · Lekki Phase 1
                </p>
                {[
                  { label: "Security", value: 8.2, color: "#4ea8a1" },
                  { label: "Infrastructure", value: 7.4, color: "#4ea8a1" },
                  { label: "Flood Risk", value: 8.8, color: "#34d399" },
                  { label: "Rental Demand", value: 9.1, color: "#4ea8a1" },
                  { label: "Resale Liquidity", value: 7.6, color: "#4ea8a1" },
                ].map((b) => (
                  <div key={b.label} className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-white/60">{b.label}</span>
                      <span className="font-mono text-sm font-bold" style={{ color: b.color }}>
                        {b.value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.value * 10}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-5 lg:col-span-2"
            >
              <div className="flex-1 rounded-2xl border border-white/10 bg-[#0d201e] p-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/35">
                  10-Year ROI Projection
                </p>
                <div className="mb-3 flex items-end gap-2">
                  <span className="font-mono text-5xl font-bold text-white">186</span>
                  <span className="mb-1 font-mono text-2xl text-[#4ea8a1]">%</span>
                </div>
                <p className="text-xs text-white/40">
                  Total return over 10 years at current trajectory, assuming 7.2% rental
                  yield and 14% annual appreciation.
                </p>
              </div>

              <div className="flex-1 rounded-2xl border border-white/10 bg-[#0d201e] p-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Comparable Sales · 90 days
                </p>
                <ul className="space-y-2">
                  {[
                    { addr: "3-bed, Admiralty Rd", price: "N132M", date: "Apr 2026" },
                    { addr: "4-bed, Fola Osibo", price: "N148M", date: "Mar 2026" },
                    { addr: "4-bed, Ologolo", price: "N155M", date: "Feb 2026" },
                  ].map((c) => (
                    <li
                      key={c.addr}
                      className="flex items-center justify-between border-b border-white/6 py-1.5 last:border-0"
                    >
                      <div>
                        <p className="text-xs text-white/70">{c.addr}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-white/30">{c.date}</p>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{c.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 rounded-2xl border border-white/10 bg-[#0d201e] p-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Infrastructure Pipeline
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Lekki-Epe Expressway expansion (2026)",
                    "Blue Rail extension to Lekki (2027)",
                    "Lekki Free Zone Phase 3 completion",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4ea8a1]" />
                      <span className="text-xs leading-relaxed text-white/55">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d2e2b] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#4ea8a1]">
                AI Engine
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                Every answer you need,
                <br />
                backed by real data.
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-white/50">
                Our AI doesn't guess. It answers questions about any Lagos property using live
                data from 247 neighbourhood data points, 5,000+ verified sales, and real-time
                market feeds.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: TrendingUp, text: "Rental yield projections with seasonal adjustment" },
                  { icon: Shield, text: "Title risk analysis and legal history summary" },
                  { icon: Building2, text: "Developer track record and completion scores" },
                  { icon: FileText, text: "Full due diligence checklist, auto-generated" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4ea8a1]/15">
                      <Icon className="h-3.5 w-3.5 text-[#4ea8a1]" />
                    </div>
                    <span className="text-sm leading-relaxed text-white/60">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071a17] shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4ea8a1] to-[#3d8780]">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Inda AI</p>
                    <p className="font-mono text-[10px] text-white/35">
                      Property Intelligence Engine
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ea8a1]" />
                    <span className="font-mono text-[10px] text-white/35">Online</span>
                  </div>
                </div>

                <div className="min-h-[320px] space-y-4 p-5">
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={`${msg.role}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[85%]">
                        {msg.role === "user" ? (
                          <div className="rounded-xl rounded-tr-sm border border-[#4ea8a1]/20 bg-[#4ea8a1]/20 px-4 py-2.5">
                            <p className="text-sm text-white/80">{msg.text}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="rounded-xl rounded-tl-sm border border-white/8 bg-white/6 px-4 py-2.5">
                              <p className="text-sm text-white/70">{msg.text}</p>
                            </div>
                            {msg.code && (
                              <div className="rounded-lg border border-[#4ea8a1]/15 bg-[#061210] px-4 py-3">
                                <pre className="whitespace-pre font-mono text-[11px] leading-relaxed text-[#4ea8a1]">
                                  {msg.code}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-white/8 px-5 py-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3">
                    <input
                      placeholder="Ask anything about this property..."
                      className="flex-1 bg-transparent text-sm text-white/60 outline-none placeholder:text-white/20"
                    />
                    <button
                      onClick={onGetStarted}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4ea8a1] transition-colors hover:bg-[#3d9a93]"
                    >
                      <Send className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#071412] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#4ea8a1]">
                Live Escrow
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                Your money moves only when everything checks out.
              </h2>
              <p className="mb-10 max-w-md text-base leading-relaxed text-white/50">
                Every transaction is protected by independent escrow. Funds are held, conditions
                verified, and release authorised only when every milestone is met - protecting
                buyers and sellers alike.
              </p>

              <ol className="space-y-6">
                {escrowSteps.map((step, i) => (
                  <motion.li
                    key={step.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4ea8a1]/40 bg-[#4ea8a1]/20">
                        <span className="font-mono text-[10px] font-bold text-[#4ea8a1]">
                          {i + 1}
                        </span>
                      </div>
                      {i < escrowSteps.length - 1 && (
                        <div className="mb-0 mt-2 w-px flex-1 bg-white/8" style={{ minHeight: "24px" }} />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="mb-1 text-sm font-semibold text-white">{step.title}</p>
                      <p className="text-sm leading-relaxed text-white/40">{step.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-xs">
                {[
                  { label: "Buyer", sub: "USD / GBP transfer", highlight: false, icon: "👤" },
                  { label: "INDA Escrow", sub: "$42,000 USD held", highlight: true, icon: "🔒" },
                  { label: "Verification", sub: "Legal + physical checks", highlight: false, icon: "✓" },
                  {
                    label: "Agent / Developer",
                    sub: "Funds released on completion",
                    highlight: false,
                    icon: "🏠",
                  },
                ].map((node, i, arr) => (
                  <div key={node.label} className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 ${
                        node.highlight
                          ? "border-[#4ea8a1]/40 bg-[#4ea8a1]/15 shadow-lg shadow-[#4ea8a1]/10"
                          : "border-white/10 bg-[#0d201e]"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${
                          node.highlight ? "bg-[#4ea8a1]/20" : "bg-white/6"
                        }`}
                      >
                        {node.icon}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            node.highlight ? "text-[#4ea8a1]" : "text-white"
                          }`}
                        >
                          {node.label}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-white/35">{node.sub}</p>
                      </div>
                      {node.highlight && (
                        <div className="ml-auto">
                          <Lock className="h-4 w-4 text-[#4ea8a1]" />
                        </div>
                      )}
                    </motion.div>
                    {i < arr.length - 1 && (
                      <div className="flex flex-col items-center py-1.5">
                        <div className="h-4 w-px bg-white/15" />
                        <div className="h-1.5 w-1.5 rounded-full bg-[#4ea8a1]/50" />
                        <div className="h-4 w-px bg-white/15" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d2e2b] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#4ea8a1]">
              Get started
            </p>
            <h2 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Search smarter.
              <br />
              Invest with certainty.
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-white/50">
              Start with any Lagos property. Get live intelligence, verified data, and escrow
              protection - all in one place.
            </p>
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#4ea8a1] to-[#3d8780] px-8 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#4ea8a1]/30"
            >
              Explore properties
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <p className="mt-4 font-mono text-xs text-white/25">No account required to explore</p>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4ea8a1] to-[#3d8780]">
                  <span className="text-xs font-bold text-white">I</span>
                </div>
                <span className="font-semibold text-gray-900">inda</span>
              </div>
              <p className="mb-6 max-w-xs text-sm text-gray-500">
                Property intelligence for the Nigerian diaspora. Know before you buy.
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 transition-colors hover:text-[#4ea8a1]">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#4ea8a1]">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#4ea8a1]">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={onGetStarted}
                    className="text-gray-500 transition-colors hover:text-gray-900"
                  >
                    Property Intelligence
                  </button>
                </li>
                <li>
                  <button className="text-gray-500 transition-colors hover:text-gray-900">
                    AI Assistant
                  </button>
                </li>
                <li>
                  <button className="text-gray-500 transition-colors hover:text-gray-900">
                    Verified Listings
                  </button>
                </li>
                <li>
                  <button className="text-gray-500 transition-colors hover:text-gray-900">
                    Escrow
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>hello@investinda.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Inda. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-gray-900">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
