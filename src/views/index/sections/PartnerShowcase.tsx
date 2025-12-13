export function PartnerShowcase() {
  const partners = [
    { 
      name: 'Access Bank', 
      logo: (
        <svg viewBox="0 0 120 40" className="w-full h-10">
          <rect x="2" y="8" width="8" height="24" fill="#FF6B00" rx="1"/>
          <rect x="12" y="4" width="8" height="28" fill="#FF6B00" rx="1"/>
          <rect x="22" y="10" width="8" height="22" fill="#FF6B00" rx="1"/>
          <text x="35" y="26" className="text-lg" fill="#FF6B00" fontWeight="600">ACCESS</text>
        </svg>
      )
    },
    { 
      name: 'PWC', 
      logo: (
        <svg viewBox="0 0 100 40" className="w-full h-10">
          <text x="10" y="28" className="text-2xl" fill="#D93F00" fontWeight="700">PwC</text>
        </svg>
      )
    },
    { 
      name: 'AXA Mansard', 
      logo: (
        <svg viewBox="0 0 120 40" className="w-full h-10">
          <rect x="5" y="8" width="20" height="24" fill="#00008F" rx="2"/>
          <text x="30" y="26" className="text-xl" fill="#00008F" fontWeight="700">AXA</text>
        </svg>
      )
    },
    { 
      name: 'LandWey', 
      logo: (
        <svg viewBox="0 0 120 40" className="w-full h-10">
          <circle cx="15" cy="20" r="12" fill="#0F9D58"/>
          <path d="M 15 10 L 20 20 L 15 30 L 10 20 Z" fill="white"/>
          <text x="30" y="26" className="text-lg" fill="#0F9D58" fontWeight="600">LandWey</text>
        </svg>
      )
    },
    { 
      name: 'Providus', 
      logo: (
        <svg viewBox="0 0 120 40" className="w-full h-10">
          <rect x="5" y="10" width="18" height="20" fill="#6B2D8F" rx="2"/>
          <rect x="8" y="13" width="12" height="3" fill="white"/>
          <rect x="8" y="18" width="12" height="3" fill="white"/>
          <rect x="8" y="23" width="12" height="3" fill="white"/>
          <text x="28" y="26" className="text-base" fill="#6B2D8F" fontWeight="600">PROVIDUS</text>
        </svg>
      )
    },
    { 
      name: 'CW Real Estate', 
      logo: (
        <svg viewBox="0 0 120 40" className="w-full h-10">
          <text x="5" y="28" className="text-3xl" fill="#4ea8a1" fontWeight="700">CW</text>
          <text x="45" y="20" className="text-xs" fill="#4ea8a1" fontWeight="500">REAL</text>
          <text x="45" y="30" className="text-xs" fill="#4ea8a1" fontWeight="500">ESTATE</text>
        </svg>
      )
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#4ea8a1]/5 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wider text-[#4ea8a1] mb-3">
            Better Together
          </p>
          <h2 className="text-gray-900 text-4xl md:text-5xl">
            Trusted by Industry{' '}
            <span className="bg-gradient-to-r from-[#4ea8a1] to-purple-600 bg-clip-text text-transparent">
              Leaders
            </span>
          </h2>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#4ea8a1]/30 cursor-pointer flex items-center justify-center"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Logo */}
              <div className="w-full group-hover:scale-105 transition-transform duration-300">
                {partner.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}