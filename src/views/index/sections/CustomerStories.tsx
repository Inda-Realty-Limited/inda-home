import { Star, Quote } from 'lucide-react';

export function CustomerStories() {
  const stories = [
    {
      name: 'Adebayo Okonkwo',
      role: 'Real Estate Investor',
      company: 'Private Portfolio',
      story: 'Inda helped me identify undervalued properties in emerging neighborhoods. I\'ve increased my ROI by 40% in just 6 months.',
      rating: 5,
      avatar: 'AO',
      gradient: 'from-[#4ea8a1] to-teal-600',
    },
    {
      name: 'Chioma Nwosu',
      role: 'Property Developer',
      company: 'Skyline Developments',
      story: 'The developer dashboard is a game-changer. We can track engagement, optimize pricing, and close deals faster than ever before.',
      rating: 5,
      avatar: 'CN',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Michael Thompson',
      role: 'Investment Manager',
      company: 'Landmark Financial',
      story: 'Access to verified data and market insights has transformed our lending process. Inda is now integral to our operations.',
      rating: 5,
      avatar: 'MT',
      gradient: 'from-blue-600 to-cyan-600',
    },
  ];

  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#4ea8a1]/10 to-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-gray-900 mb-6 text-5xl md:text-6xl">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-[#4ea8a1] to-purple-600 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how professionals across the real estate industry are transforming their business with Inda.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-transparent hover:-translate-y-2"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-8 right-8 w-12 h-12 text-gray-200 group-hover:text-[#4ea8a1]/20 transition-colors" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Story */}
              <p className="text-gray-700 mb-8 leading-relaxed text-lg relative z-10">
                &quot;{story.story}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${story.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <span className="text-lg">{story.avatar}</span>
                </div>
                <div>
                  <div className="text-gray-900">{story.name}</div>
                  <div className="text-sm text-gray-500">
                    {story.role}
                  </div>
                  <div className="text-xs text-gray-400">
                    {story.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats - More dynamic */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {[
            { value: '2,000+', label: 'Active Users', gradient: 'from-[#4ea8a1] to-teal-600' },
            { value: '₦50B+', label: 'Properties Analyzed', gradient: 'from-purple-600 to-pink-600' },
            { value: '98%', label: 'Satisfaction Rate', gradient: 'from-blue-600 to-cyan-600' },
            { value: '24/7', label: 'Support Available', gradient: 'from-orange-600 to-red-600' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 sm:p-8 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`text-xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-bold`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-[10px] sm:text-base font-medium leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}