import Image from 'next/image';

export function PartnerShowcase() {
  const partners = [
    { 
      name: 'Nedcomoaks', 
      logo: '/images/nedcomoaks.PNG'
    },
    { 
      name: 'APG', 
      logo: '/images/apg.PNG'
    },
    { 
      name: 'AlbertandWand', 
      logo: '/images/albert.JPG'
    },
    { 
      name: 'Caviar', 
      logo: '/images/cavier.JPG'
    },
    { 
      name: 'CW Real Estate', 
      logo: '/images/cw.PNG'
    },
    { 
      name: 'PV Real Estate', 
      logo: '/images/vp.WEBP'
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
              className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#4ea8a1]/30 cursor-pointer flex items-center justify-center h-32"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Logo */}
              <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}