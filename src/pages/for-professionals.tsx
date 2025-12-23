import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../views/index/sections/ui/button';
import { ArrowRight, Clock, FileCheck, TrendingUp, CheckCircle2, Award, Zap, Shield } from 'lucide-react';
import { FooterCTA } from '../views/index/sections/FooterCTA';
import { motion } from 'framer-motion';
import { Navbar } from '@/components';

export function ForProfessionals() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetVerified = () => {
    if (!isAuthenticated) {
      router.push('/auth/signup');
    } else {
      const element = document.querySelector('[data-verification-section]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const openWhatsAppDemo = (text?: string) => {
    const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2347084960775";
    const message = text || "Hi, I would like to book a demo with Inda";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#4ea8a1]/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl mb-6 leading-tight text-black lg:whitespace-nowrap"
            >
              Unverified Listings Cost You{' '}
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                60–140 Days
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-black mb-12 max-w-3xl mx-auto"
            >
              Turn skeptical buyers into confident closers in half the time.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Button onClick={handleGetVerified} size="lg" className="bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] hover:from-[#3d8680] hover:to-[#2d7670] group shadow-xl text-lg px-8 py-6">
                Get Verified
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => openWhatsAppDemo()} size="lg" variant="outline" className="border-2 bg-transparent border-teal-500 text-black hover:bg-black/10 hover:border-black/10 text-lg px-8 py-6">
                Book Demo
              </Button>
            </motion.div>
          </div>

          {/* Visual: Chaos visualization */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-red-400" />
                <span className="text-red-400">Unverified</span>
              </div>
              <div className="text-4xl text-white mb-2">60–140 days</div>
              <p className="text-white text-sm">Average time to close</p>
            </div>

            <div className="bg-emerald-900/20 border-2 border-emerald-500/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-900" />
                <span className="text-emerald-900">Verified by Inda</span>
              </div>
              <div className="text-4xl text-white mb-2">7–14 days</div>
              <p className="text-white text-sm">Average time to close</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Demo Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">
              From <span className="text-red-500">Chaos</span> → <span className="text-[#4ea8a1]">Clarity</span> in Days
            </h2>
            <p className="text-xl text-gray-600">
              Transform unverified listings into bank-ready, buyer-trusted properties
            </p>
          </div>

          {/* Before/After Split */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Before: Messy Listing */}
            <div className="relative">
              <div className="absolute -top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm z-10">
                Unverified Listing
              </div>
              <div className="bg-gray-50 border-2 border-red-200 rounded-2xl p-6 pt-10">
                <div className="bg-white rounded-xl p-6 mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Property Listing</h3>
                    <span className="text-red-500 text-sm">⚠ Conflicting Data</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price (Platform A)</span>
                      <span className="text-gray-900">₦45M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price (Platform B)</span>
                      <span className="text-gray-900 line-through">₦52M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documents</span>
                      <span className="text-red-500">3 missing</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Verification Status</span>
                      <span className="text-red-500">Pending</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bank Approval</span>
                      <span className="text-gray-500">Not started</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Average time to close: <span className="text-red-600">40–120 days</span>
                </div>
              </div>
            </div>

            {/* After: Verified Listing */}
            <div className="relative">
              <div className="absolute -top-4 left-4 bg-[#4ea8a1] text-white px-4 py-2 rounded-full text-sm z-10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Verified by Inda
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 rounded-2xl p-6 pt-10 shadow-xl">
                <div className="bg-white rounded-xl p-6 mb-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Verified Property</h3>
                    <span className="text-emerald-600 text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      All Clear
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fair Market Value</span>
                      <span className="text-[#4ea8a1]">₦45.2M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Confidence Score</span>
                      <span className="text-emerald-600">96%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documents</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">ROI Projection</span>
                      <span className="text-blue-600">11.5%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bank Ready</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Yes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  <Zap className="w-4 h-4 inline mr-2 text-[#4ea8a1]" />
                  Average time to close: <span className="text-[#4ea8a1]">7–14 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl text-white mb-2">Your Professional Dashboard</h3>
              <p className="text-gray-400">Manage all your verified listings in one place</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-xl p-4 text-white">
                  <div className="text-sm mb-1">Active Listings</div>
                  <div className="text-3xl">24</div>
                </div>
                <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-xl p-4 text-white">
                  <div className="text-sm mb-1">Verified</div>
                  <div className="text-3xl">18</div>
                </div>
                <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-xl p-4 text-white">
                  <div className="text-sm mb-1">Avg. Close Time</div>
                  <div className="text-3xl">9d</div>
                </div>
                <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-xl p-4 text-white">
                  <div className="text-sm mb-1">This Month</div>
                  <div className="text-3xl">₦2.1B</div>
                </div>
              </div>

              <div className="text-center">
                <Button className="bg-[#4ea8a1] hover:bg-[#3d8680]">
                  View Live Dashboard Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section data-verification-section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">Choose Your Level of Verification</h2>
            <p className="text-xl text-gray-600">Scale your business with verified listings that close faster</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Starter */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl mb-2 text-gray-900">Starter</h3>
              <div className="text-4xl mb-6 text-gray-900">
                ₦15,000
                <span className="text-lg text-gray-500">/month</span>
              </div>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Included:</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Up to 10 listings</span>
                  <span className="text-[#4ea8a1]">50 credits</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">FMV verification for all listings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Basic document checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Shareable verification badges</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>

              <div className="text-sm text-gray-600 mb-4 italic">Perfect for solo agents & first-time users</div>

              <Button onClick={handleGetVerified} variant="outline" className="w-full border-2 border-[#4ea8a1] text-[#4ea8a1] hover:bg-[#4ea8a1] hover:text-white">
                Get Started
              </Button>
            </div>

            {/* Pro - Most Popular */}
            <div className="bg-gradient-to-br from-[#4ea8a1] to-[#3d8680] rounded-3xl shadow-2xl p-8 border-2 border-[#4ea8a1] relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-6 py-2 rounded-full text-sm shadow-lg">
                Most Recommended
              </div>
              <h3 className="text-2xl mb-2 text-white">Pro</h3>
              <div className="text-4xl mb-6 text-white">
                ₦50,000
                <span className="text-lg text-emerald-100">/month</span>
              </div>
              
              <div className="mb-6 pb-6 border-b border-white/20">
                <div className="text-sm text-emerald-100 mb-2">Included:</div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Up to 50 listings</span>
                  <span className="text-white">300 credits</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Everything in Starter, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Advanced document verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Priority verification queue</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <span className="text-white">Phone & email support</span>
                </li>
              </ul>

              <div className="text-sm text-emerald-100 mb-4 italic">Perfect for active agents & small agencies</div>

              <Button onClick={handleGetVerified} className="w-full bg-white text-[#4ea8a1] hover:bg-emerald-50">
                Get Started
              </Button>
            </div>

            {/* Agency */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl mb-2 text-gray-900">Agency</h3>
              <div className="text-4xl mb-6 text-gray-900">
                ₦100,000
                <span className="text-lg text-gray-500">/month</span>
              </div>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Included:</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Unlimited listings</span>
                  <span className="text-[#4ea8a1]">Unlimited credits</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Pro, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">White-label verification reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ea8a1] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">24/7 priority support</span>
                </li>
              </ul>

              <div className="text-sm text-gray-600 mb-4 italic">Perfect for agencies & developers</div>

              <Button onClick={handleGetVerified} variant="outline" className="w-full border-2 border-gray-300 hover:border-[#4ea8a1] hover:text-[#4ea8a1]">
                Get Started
              </Button>
            </div>
          </div>

          {/* Early Partner Incentive */}
          <div className="bg-inda-teal  border-2 border-teal-500 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl mb-2 text-gray-900">Founding Partner Program</h3>
                <p className="text-gray-900 mb-4">
                  Join the first 100 verified professionals and get priority verification, faster closings, and exclusive partner benefits.
                </p>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">Slots Remaining</span>
                    <span className="text-sm text-white">37/100</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[63%] h-full bg-gradient-to-r from-teal-400 to-teal-500" />
                  </div>
                </div>

                <Button onClick={() => openWhatsAppDemo("Hi, I would like to become a founding partner")} className="bg-white hover:from-teal-500 hover:to-teal-600 text-inda-teal">
                  Become a Founding Partner
                  <Award className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-[#4ea8a1]/50 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl mb-6 text-white leading-tight">
            Become a <span className="text-[#4ea8a1]">Verified Professional</span>.{' '}
            <br />
            Close Deals Faster.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the growing network of trusted real estate professionals using Inda to build credibility and close deals in record time.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button onClick={handleGetVerified} size="lg" className="bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] hover:from-[#3d8680] hover:to-[#2d7670] group shadow-xl text-lg px-8 py-6">
              Onboard to Inda → Start Verifying Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}

export default ForProfessionals;