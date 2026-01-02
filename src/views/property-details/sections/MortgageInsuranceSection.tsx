import { Building2, Shield, ExternalLink } from "lucide-react";

const mortgagePartners = [
  {
    name: "GTBank",
    type: "Mortgage",
    offer: "Up to 80% LTV • 20-year tenure",
    rate: "From 14% p.a.",
    link: "https://forms.gle/gtbank-mortgage"
  },
  {
    name: "Access Bank",
    type: "Mortgage",
    offer: "Up to 75% LTV • 25-year tenure",
    rate: "From 15% p.a.",
    link: "https://forms.gle/access-mortgage"
  },
  {
    name: "Stanbic IBTC",
    type: "Mortgage",
    offer: "Up to 70% LTV • 20-year tenure",
    rate: "From 14.5% p.a.",
    link: "https://forms.gle/stanbic-mortgage"
  }
];

const insurancePartners = [
  {
    name: "Leadway Assurance",
    type: "Title Insurance",
    coverage: "Up to ₦100M coverage",
    premium: "From 0.5% of value",
    link: "https://forms.gle/leadway-insurance"
  },
  {
    name: "AXA Mansard",
    type: "Property Insurance",
    coverage: "Comprehensive coverage",
    premium: "From ₦50K/year",
    link: "https://forms.gle/axa-insurance"
  },
  {
    name: "AIICO Insurance",
    type: "Bundle Package",
    coverage: "Title + Property + Life",
    premium: "Save up to 20%",
    link: "https://forms.gle/aiico-bundle"
  }
];

export function MortgageInsuranceSection() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-r from-[#e8f5f4] to-[#f0fdf4] rounded-lg p-4 border border-[#50b8b1]/20">
        <p className="text-sm text-gray-700">
          🤝 <strong>Pre-vetted partners</strong> offering competitive rates for this property. Click any partner to get a personalized quote.
        </p>
      </div>

      {/* Mortgage Partners */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Mortgage Partners</h4>
        </div>
        
        <div className="space-y-3">
          {mortgagePartners.map((partner, index) => (
            <button
              key={index}
              onClick={() => window.open(partner.link, '_blank')}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-[#50b8b1] hover:bg-[#e8f5f4] transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-gray-900">{partner.name}</h5>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#50b8b1]" />
                  </div>
                  <p className="text-sm text-gray-600">{partner.offer}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#50b8b1]">{partner.rate}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 group-hover:text-[#50b8b1]">
                Click to get pre-approval →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3 bg-[#fef3c7] rounded-lg p-3 text-sm text-gray-700">
          💡 <strong>Pre-approval in 48 hours.</strong> Get multiple quotes to compare and choose the best rate.
          <div className="mt-2">
            <button
              onClick={() => window.open('https://forms.gle/mortgage-preapproval', '_blank')}
              className="text-[#50b8b1] hover:underline flex items-center gap-1"
            >
              🏦 Apply for mortgage pre-approval →
            </button>
          </div>
        </div>
      </div>

      {/* Insurance Partners */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#50b8b1]" />
          <h4 className="text-gray-900">Insurance Partners</h4>
        </div>
        
        <div className="space-y-3">
          {insurancePartners.map((partner, index) => (
            <button
              key={index}
              onClick={() => window.open(partner.link, '_blank')}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-[#50b8b1] hover:bg-[#e8f5f4] transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-gray-900">{partner.name}</h5>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#50b8b1]" />
                  </div>
                  <p className="text-sm text-gray-600">{partner.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">{partner.coverage}</div>
                  <div className="text-sm font-semibold text-[#50b8b1]">{partner.premium}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 group-hover:text-[#50b8b1]">
                Click to get a quote →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3 bg-[#fef3c7] rounded-lg p-3 text-sm text-gray-700">
          💡 <strong>Bundle and save.</strong> Get title + property + life insurance in one package for up to 20% discount.
          <div className="mt-2">
            <button
              onClick={() => window.open('https://forms.gle/insurance-quote', '_blank')}
              className="text-[#50b8b1] hover:underline flex items-center gap-1"
            >
              🛡️ Get a quote for title insurance through our partners →
            </button>
          </div>
        </div>
      </div>

      {/* Why Use Partners */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h5 className="text-gray-900 mb-3">Why use our partners?</h5>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>Pre-negotiated rates</strong> — Better than walking in directly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>Faster processing</strong> — Priority queue for Inda buyers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>Seamless coordination</strong> — Partners work directly with our team</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#50b8b1] mt-1">✓</span>
            <span><strong>No hidden fees</strong> — Transparent pricing, no surprises</span>
          </li>
        </ul>
      </div>
    </div>
  );
}