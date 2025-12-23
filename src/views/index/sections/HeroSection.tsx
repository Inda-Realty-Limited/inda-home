import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      router.push('/auth/signup');
    } else {
      const element = document.querySelector('[data-product-section]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const openWhatsAppDemo = () => {
    const phone = process.env.NEXT_PUBLIC_INDA_WHATSAPP || "2347084960775";
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      "Hi, I would like to book a demo with Inda"
    )}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  return (
    <section className="relative pt-32 pb-32 px-6 overflow-hidden">
      {/* Animated gradient background with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4ea8a1]/5 via-purple-50/30 to-orange-50/30" />
      
      {/* Dot pattern overlzay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, #4ea8a1 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#4ea8a1 1px, transparent 1px), linear-gradient(90deg, #4ea8a1 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#4ea8a1]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#4ea8a1]/20 rounded-full mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-[#4ea8a1]" />
            <span className="text-sm text-gray-700">Trusted by 200+ real estate professionals</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-5xl lg:text-6xl text-gray-900 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
            Verified Real Estate Intelligence - {' '}
            <span className="bg-gradient-to-r from-[#4ea8a1] to-[#3d8680] bg-clip-text text-transparent">
               So Deals Close Faster
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
            Inda verifies pricing, documents, and risk before listings go live, giving buyers, banks, and developers decision-ready deals.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
            {/* <Button onClick={handleGetStarted} size="lg" className="bg-[#4ea8a1] hover:bg-[#3d8680] group shadow-lg shadow-[#4ea8a1]/25 hover:shadow-xl hover:shadow-[#4ea8a1]/40 transition-all text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button> */}
            <Button
              size="lg"
              variant="outline"
              onClick={openWhatsAppDemo}
              className="text-lg px-8 py-6 border-2 hover:border-[#4ea8a1] hover:text-[#4ea8a1]"
            >
              Book Demo
            </Button>
          </div>

          {/* Trust Indicators with better design */}
          <div className="flex items-center justify-center gap-12 text-sm animate-in fade-in duration-700" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Real-time data
            </div>
            <div className="text-gray-600">Enterprise-grade security</div>
            <div className="text-gray-600">99.9% uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}