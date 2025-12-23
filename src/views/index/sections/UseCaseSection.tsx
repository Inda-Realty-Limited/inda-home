import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function UseCaseSection() {
  const useCases = [
    {
      icon: '🔍',
      title: 'Investors & Buyers',
      description: 'Find high-potential properties, compare options, simulate ROI, and track cash flow to maximize your returns.',
      cta: null,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      featured: false,
    },
    {
      icon: '🏗️',
      title: 'Developers',
      description: 'Showcase projects, analyze demand, optimize pricing, and track engagement to accelerate funding with confidence.',
      cta: { text: 'Showcase Your Project', link: '/for-professionals' },
      gradient: 'from-[#4ea8a1]/10 to-emerald-500/10',
      featured: true,
    },
    {
      icon: '🤝',
      title: 'Agents & Brokers',
      description: 'Manage listings, understand clients, track preferences, and close deals faster to grow your business.',
      cta: null,
      gradient: 'from-purple-500/10 to-pink-500/10',
      featured: false,
    },
    {
      icon: '🏦',
      title: 'Banks & Financial Institutions',
      description: 'Access verified property data, assess risk, and streamline financing to expand lending opportunities.',
      cta: null,
      gradient: 'from-orange-500/10 to-red-500/10',
      featured: false,
    },
    {
      icon: '📊',
      title: 'Market Analysts & Institutions',
      description: 'Track trends, generate insights, and compare neighborhoods to make smarter investment decisions.',
      cta: null,
      gradient: 'from-indigo-500/10 to-purple-500/10',
      featured: false,
    },
    {
      icon: '🛡️',
      title: 'Insurance Companies',
      description: 'Assess property risk, offer accurate premiums, and monitor market trends to reduce exposure.',
      cta: null,
      gradient: 'from-teal-500/10 to-cyan-500/10',
      featured: false,
    },
    {
      icon: '💻',
      title: 'Fintech & Proptech Platforms',
      description: 'Integrate property data, embed ROI tools, and enable co-investment to enhance your platform offerings.',
      cta: null,
      gradient: 'from-violet-500/10 to-fuchsia-500/10',
      featured: false,
    },
  ];

  return (
    <section id="usecases" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-0 w-80 h-80 bg-[#4ea8a1]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-gray-900 mb-6 text-5xl md:text-6xl">
            Built for{' '}
            <span className="bg-gradient-to-r from-[#4ea8a1] via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everyone
            </span>
            {' '}in Real Estate
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Investors, developers, agents, banks, and more. Inda verifies pricing, documents, and risk so transactions move faster. 
          </p>
        </div>

        {/* Use Case Cards - Asymmetric Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden p-10 bg-white rounded-3xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-transparent hover:-translate-y-2 ${
                useCase.featured ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {useCase.icon}
                </div>

                {/* Title */}
                <h3 className="text-gray-900 mb-4 text-2xl">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {useCase.description}
                </p>

                {/* CTA (if exists) */}
                {useCase.cta && (
                  <Button
                    variant="ghost"
                    className="group/btn text-[#4ea8a1] hover:text-[#3d8680] p-0"
                    asChild
                  >
                    <a href={useCase.cta.link}>
                      {useCase.cta.text}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}