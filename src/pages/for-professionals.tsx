import { Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  FileCheck,
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { startSubscription, verifySubscription } from "@/api/subscription";
import { useToast } from "@/components/ToastProvider";


function VerificationPreview() {
  const [verificationStage, setVerificationStage] = useState(0);
  const stages = [
    { label: "Title verified", icon: Shield, status: "complete", time: "2 days" },
    { label: "Survey complete", icon: FileCheck, status: "complete", time: "3 days" },
    { label: "Legal review", icon: CheckCircle2, status: "in-progress", time: "1 day left" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVerificationStage((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Property header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">4BR Duplex, Lekki Phase 1</h3>
            <p className="text-sm text-gray-500">₦85,000,000 • 450 sqm</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Verified
          </div>
        </div>
      </div>

      {/* Verification stages */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === verificationStage;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0.6 }}
              animate={{
                opacity: isActive ? 1 : 0.6,
                scale: isActive ? 1.02 : 1
              }}
              className={`flex items-center justify-between p-4 rounded-xl border ${stage.status === 'complete'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stage.status === 'complete' ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                  <Icon className={`w-5 h-5 ${stage.status === 'complete' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{stage.label}</div>
                  <div className="text-sm text-gray-500">{stage.time}</div>
                </div>
              </div>
              {stage.status === 'complete' && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Deal velocity metric */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Average closing time</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-[#4ea8a1]">11 days</span>
            <span className="text-sm text-green-600">↓ 61% faster</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ForProfessionals: React.FC = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const toast = useToast();

  const getButtonText = () => {
    if (!user) return "Start free";
    if (user.subscriptionPlan === "free") return "Upgrade Now";
    return "Go to Dashboard";
  };

  const onGetStarted = () => {
    if (user && user.subscriptionPlan !== "free") {
      router.push("/dashboard");
      return;
    }
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push("/for-professionals#pricing");
    }
  };
  const onViewVerificationReport = () => {
    router.push("/reports/IND-8827");
  };

  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  const handleSubscription = async (plan: string) => {
    if (!user) {
      const rt = encodeURIComponent("/for-professionals");
      router.push(`/auth/signup?returnTo=${rt}`);
      return;
    }

    if (user.subscriptionPlan === plan && user.subscriptionStatus === "active") {
      router.push("/dashboard");
      return;
    }

    const allowedRoles = ["Agent", "Developer"];
    if (!user.role || !allowedRoles.includes(user.role)) {
      toast.showToast("Only Agents and Developers can subscribe to professional plans.", 3000, "error");
      return;
    }

    try {
      setIsSubscribing(plan);
      const callbackUrl = `${window.location.origin}/for-professionals?verify=true&plan=${plan}`;
      const response = await startSubscription(plan, callbackUrl);

      if (response.data?.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else if (response.message.includes("successfully")) {
        // Free plan case
        toast.showToast(response.message, 2000, "success");
        router.reload();
      }
    } catch (error: any) {
      toast.showToast(error?.response?.data?.message || "Failed to start subscription", 3000, "error");
    } finally {
      setIsSubscribing(null);
    }
  };

  useEffect(() => {
    const { verify, reference, tx_ref, plan } = router.query;
    const finalReference = (reference || tx_ref) as string;

    if (verify === "true" && finalReference) {
      const verifyPayment = async () => {
        try {
          const response = await verifySubscription(finalReference);
          if (response.status === "OK") {
            toast.showToast(`Welcome to the ${plan} plan!`, 2000, "success");
            // Sync user state
            if (response.data) {
              setUser(response.data);
            }
            router.push("/dashboard");
          }
        } catch (_error) {
          toast.showToast("Subscription verification failed", 3000, "error");
        }
      };
      verifyPayment();
    }
  }, [router.query, setUser, toast, router]);

  return (
    <Container noPadding className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#50b8b1]/10 rounded-full px-3 py-1.5 mb-6"
            >
              <Shield className="w-3.5 h-3.5 text-[#50b8b1]" />
              <span className="text-xs text-gray-700">Verified Property Infrastructure</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 text-gray-900"
            >
              Answer questions
              <br />
              <span className="text-[#50b8b1]">you don&apos;t even know.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Buyers ask about flood risk, neighborhood growth, and legal history you don&apos;t have.
              Deals die in 52 days of back-and-forth. We verify everything upfront.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <button
                onClick={onGetStarted}
                className="group px-6 py-3 bg-[#50b8b1] text-white rounded-lg font-medium hover:bg-[#3a9892] transition-all flex items-center gap-2 shadow-sm"
              >
                {getButtonText()}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onViewVerificationReport}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                See verified report
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#50b8b1]" />
                <span>11 day avg close</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#50b8b1]" />
                <span>847 verified properties</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#50b8b1]" />
                <span>₦12B in deals</span>
              </div>
            </motion.div>
          </div>

          {/* Verification Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xl">
              <VerificationPreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-32 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight">
                  Questions you
                  <br />
                  <span className="text-red-400">can&apos;t answer.</span>
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed mb-6">
                  "What&apos;s the flood risk?" "How&apos;s the area growing?" "Any legal disputes?"
                  You don&apos;t know. Buyers spend weeks researching. Finding nothing. Getting frustrated.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  Meanwhile, you&apos;re scrambling for answers you don&apos;t have access to.
                  52 days wasted. Deals collapse.
                </p>
                <p className="text-lg text-white leading-relaxed">
                  Inda verifies everything—title, legal, microlocation insights, environmental
                  risks. Questions you can&apos;t answer become certainties buyers trust.
                  Both sides get complete transparency. Deals close in 11 days.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Before */}
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Before Inda</div>
                    <div className="text-sm text-gray-400">Information gap kills deals</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Researching answers you don&apos;t have</span>
                    <span className="text-red-400">21 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Buyer doing their own research</span>
                    <span className="text-red-400">18 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Back-and-forth on uncertainties</span>
                    <span className="text-red-400">13 days</span>
                  </div>
                  <div className="pt-2 border-t border-red-500/20 flex justify-between font-medium">
                    <span className="text-white">Total</span>
                    <span className="text-red-400">52 days</span>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="bg-[#50b8b1]/10 backdrop-blur-sm border border-[#50b8b1]/20 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#50b8b1]/20 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#50b8b1]" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">With Inda</div>
                    <div className="text-sm text-gray-400">Average deal timeline</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Questions answered</span>
                    <span className="text-[#50b8b1]">0 days (in report)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Document sharing</span>
                    <span className="text-[#50b8b1]">0 days (one link)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due diligence</span>
                    <span className="text-[#50b8b1]">11 days</span>
                  </div>
                  <div className="pt-2 border-t border-[#50b8b1]/20 flex justify-between font-medium">
                    <span className="text-white">Total</span>
                    <span className="text-[#50b8b1]">11 days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 tracking-tight"
            >
              Verify once. Share everywhere.
            </motion.h2>
            <p className="text-lg text-gray-600">Three steps to faster closings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#50b8b1]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#50b8b1]" />
              </div>
              <div className="text-5xl font-bold text-gray-200 mb-4">01</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enter 8-12 Details</h3>
              <p className="text-gray-600 leading-relaxed">
                Fill out basic listing info—location, price, features.
                Our AI instantly compiles <span className="font-semibold text-gray-900">70+ verified answers</span> buyers need.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#50b8b1]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Link2 className="w-8 h-8 text-[#50b8b1]" />
              </div>
              <div className="text-5xl font-bold text-gray-200 mb-4">02</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Your Link</h3>
              <p className="text-gray-600 leading-relaxed">
                Every property gets a shareable URL. Instagram, WhatsApp, email—
                one link answers everything.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[#50b8b1]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-[#50b8b1]" />
              </div>
              <div className="text-5xl font-bold text-gray-200 mb-4">03</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track & Close</h3>
              <p className="text-gray-600 leading-relaxed">
                See who viewed, which channels convert. Know which leads are serious.
                Close faster.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="text-6xl mb-6">"</div>
              <p className="text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-snug mb-8">
                We closed ₦340M in properties{" "}
                <span className="text-[#50b8b1]">17 days faster</span> than our usual timeline.
                Buyers trust the verified reports.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#50b8b1] to-[#3a9892] rounded-full" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Development Director</div>
                <div className="text-sm text-gray-500">Developer, Ajah</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 tracking-tight"
            >
              Start free. Scale when ready.
            </motion.h2>          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className={`bg-white rounded-2xl border p-8 hover:shadow-lg transition-shadow relative ${user?.subscriptionPlan === "free" ? "border-[#50b8b1] ring-1 ring-[#50b8b1]" : "border-gray-200"
                }`}
            >
              {user?.subscriptionPlan === "free" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#50b8b1] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Current Plan
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Starter</div>
                <div className="text-5xl font-semibold text-gray-900 mb-1">Free</div>
                <div className="text-sm text-gray-500">Forever</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>1 property</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Shareable property link</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Basic analytics</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscription("free")}
                disabled={isSubscribing !== null}
                className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {isSubscribing === "free" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {!user ? "Get started" : user.subscriptionPlan === "free" ? "Go to Dashboard" : "Switch to Starter"}
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-2xl border-2 border-[#50b8b1] p-8 relative hover:shadow-2xl transition-shadow"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
                {user?.subscriptionPlan === "pro" ? (
                  <div className="bg-[#50b8b1] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </div>
                ) : (
                  <div className="bg-[#50b8b1] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most popular
                  </div>
                )}
              </div>
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Pro</div>
                <div className="text-5xl font-semibold text-white mb-1">
                  ₦50K
                </div>
                <div className="text-sm text-gray-400">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>10 properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>WhatsApp integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Full lead tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Channel analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Verification discounts</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscription("pro")}
                disabled={isSubscribing !== null}
                className="w-full py-2.5 bg-[#50b8b1] rounded-lg text-white hover:bg-[#3a9892] transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {isSubscribing === "pro" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {!user ? "Start free" : user.subscriptionPlan === "pro" ? "Go to Dashboard" : user.subscriptionPlan === "free" ? "Upgrade to Pro" : "Switch to Pro"}
              </button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`bg-white rounded-2xl border p-8 hover:shadow-lg transition-shadow relative ${user?.subscriptionPlan === "enterprise" ? "border-[#50b8b1] ring-1 ring-[#50b8b1]" : "border-gray-200"
                }`}
            >
              {user?.subscriptionPlan === "enterprise" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#50b8b1] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Current Plan
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Enterprise</div>
                <div className="text-5xl font-semibold text-gray-900 mb-1">₦75K</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Unlimited properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>White-label reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Priority verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50b8b1] mt-1">✓</span>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscription("enterprise")}
                disabled={isSubscribing !== null}
                className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {isSubscribing === "enterprise" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {!user ? "Get Started" : user.subscriptionPlan === "enterprise" ? "Go to Dashboard" : "Upgrade to Enterprise"}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
              Transparency sells.
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              When buyers know more, deals close faster. Start verifying today.
            </p>
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-[#50b8b1] text-white rounded-lg font-medium hover:bg-[#3a9892] transition-all inline-flex items-center gap-2 shadow-lg text-lg"
            >
              {getButtonText()}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </Container>
  );
};

export default ForProfessionals;