import {
  Gift, Star, Check, ExternalLink,
  Camera, FileText, TrendingUp, Zap, Crown,
  Users,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { cn } from '@/lib/utils';

// ── Active platform perks ─────────────────────────────────────────────────────

const ACTIVE_PERKS = [
  {
    title: 'Unlimited Property Reports',
    description: 'Generate detailed verification reports for any property',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    status: 'Active',
  },
  {
    title: 'Professional Photography',
    description: '2 free professional photo shoots per month',
    icon: Camera,
    iconBg: 'bg-inda-teal/10',
    iconColor: 'text-inda-teal',
    status: '2/2 Available',
  },
  {
    title: 'Priority Support',
    description: '24/7 dedicated support via WhatsApp',
    icon: Zap,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    status: 'Active',
  },
  {
    title: 'Market Intelligence',
    description: 'Weekly market reports and trend analysis',
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    status: 'Active',
  },
  {
    title: 'Premium Listings',
    description: 'Featured placement on marketplace',
    icon: Star,
    iconBg: 'bg-inda-teal/10',
    iconColor: 'text-inda-teal',
    status: 'Active',
  },
  {
    title: 'CRM & Deal Tracking',
    description: 'Advanced lead management tools',
    icon: Users,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    status: 'Active',
  },
];

// ── Partner discounts ─────────────────────────────────────────────────────────

const PARTNER_DISCOUNTS = [
  {
    partner: 'LegalHub Nigeria',
    offer: '20% off all property documentation services',
    code: 'INDAPRO20',
    value: 'Save up to ₦50,000',
    logoColor: '#1F5F5B',
  },
  {
    partner: 'PropTech Innovations',
    offer: 'Free 3D virtual tour creation',
    code: 'INDA3DFREE',
    value: 'Worth ₦35,000',
    logoColor: '#4A154B',
  },
  {
    partner: 'Dangote Cement',
    offer: 'Bulk discount on cement orders above 100 bags',
    code: 'INDACEMENT',
    value: 'Bulk savings',
    logoColor: '#E31837',
  },
  {
    partner: 'Berger Paints',
    offer: '15% off on orders above ₦500k',
    code: 'INDAPAINT15',
    value: 'Save ₦75,000+',
    logoColor: '#005596',
  },
  {
    partner: 'Adobe Creative Cloud',
    offer: '40% off your first year',
    code: 'INDAADOBE40',
    value: 'Worth ₦120,000',
    logoColor: '#FF0000',
  },
  {
    partner: 'Canva Pro',
    offer: '50% off for first 3 months',
    code: 'INDACANVA50',
    value: 'Save ₦15,000',
    logoColor: '#00C4CC',
  },
  {
    partner: 'The Wheatbaker',
    offer: '15% off weekend stays',
    code: 'INDAHOTEL15',
    value: 'Save ₦25,000+',
    logoColor: '#8B4513',
  },
  {
    partner: 'Marketing Pro Nigeria',
    offer: 'Professional video editing services',
    code: 'INDAVIDEO',
    value: 'Worth ₦30,000',
    logoColor: '#F06A6A',
  },
];

// ── Coming soon ───────────────────────────────────────────────────────────────

const COMING_SOON = [
  'Exclusive access to off-market properties',
  'Higher commission tiers for top performers',
  'Monthly networking events with developers',
  'Advanced training and certification programs',
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PerksPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
              Perks Hub
            </h1>
            <p className="text-gray-600 mt-1">Exclusive benefits and rewards for Inda Pro agents</p>
          </div>

          {/* Membership Status Banner */}
          <div className="bg-gradient-to-r from-inda-teal to-[#3d8780] rounded-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Inda Pro Membership</h3>
              </div>
              <p className="text-white/80 text-sm mb-6">Active — Full access to all perks</p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-bold">₦1.2M+</p>
                  <p className="text-white/80 text-sm">Value Unlocked</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-white/80 text-sm">Perks Used</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">∞</p>
                  <p className="text-white/80 text-sm">Available Perks</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Gift className="w-64 h-64" />
            </div>
          </div>

          {/* Active Perks */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Your Active Perks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIVE_PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div key={perk.title} className="bg-white rounded-xl p-6 shadow-sm border border-inda-gray">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('p-3 rounded-lg', perk.iconBg)}>
                        <Icon className={cn('w-6 h-6', perk.iconColor)} />
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        {perk.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{perk.title}</h4>
                    <p className="text-sm text-gray-600">{perk.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Partner Discounts */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Partner Discounts &amp; Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PARTNER_DISCOUNTS.map((d) => (
                <div key={d.partner} className="bg-white rounded-xl p-6 shadow-sm border border-inda-gray">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: d.logoColor }}
                      >
                        {d.partner.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{d.partner}</h4>
                        <p className="text-sm text-gray-600">{d.offer}</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-semibold whitespace-nowrap ml-2">{d.value}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Promo Code</p>
                      <p className="font-mono font-semibold text-inda-teal">{d.code}</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-inda-gray rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-inda-teal/10 border border-inda-teal/30 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-inda-teal" />
              Coming Soon
            </h3>
            <ul className="space-y-2">
              {COMING_SOON.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-inda-teal flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
