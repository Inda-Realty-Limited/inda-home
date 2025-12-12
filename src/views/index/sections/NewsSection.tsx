import { ArrowRight, TrendingUp, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function NewsSection() {
  const newsArticles = [
    {
      category: 'Market Insights',
      title: 'Lagos Real Estate Market Shows Strong Growth in Q4',
      snippet: 'Property values in prime Lagos locations increased by an average of 2.8% this quarter, signaling continued investor confidence.',
      date: 'Dec 2, 2024',
      readTime: '5 min read',
      gradient: 'from-[#4ea8a1] to-teal-600',
    },
    {
      category: 'Investment',
      title: 'Investment Opportunities in Emerging Nigerian Markets',
      snippet: 'New development projects in secondary cities offer attractive ROI for forward-thinking investors.',
      date: 'Nov 28, 2024',
      readTime: '4 min read',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      category: 'Technology',
      title: 'How Technology is Transforming Property Development',
      snippet: 'Data-driven insights are revolutionizing how developers approach new projects and market analysis.',
      date: 'Nov 25, 2024',
      readTime: '6 min read',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      category: 'Company News',
      title: 'Inda Partners with Major Financial Institutions',
      snippet: 'Strategic partnerships aim to streamline property financing and verification processes across Nigeria.',
      date: 'Nov 20, 2024',
      readTime: '3 min read',
      gradient: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <section id="newsroom" className="py-32 px-6 bg-gray-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4ea8a1]/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ea8a1]/10 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-[#4ea8a1]" />
            <span className="text-sm text-[#4ea8a1]">Latest Updates</span>
          </div>
          <h2 className="text-white mb-6 text-5xl md:text-6xl">
            Newsroom
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest insights, trends, and developments in real estate.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {newsArticles.map((article, index) => (
            <article
              key={index}
              className="group relative overflow-hidden bg-white rounded-3xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              style={{
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Gradient header */}
              <div className={`h-2 bg-gradient-to-r ${article.gradient}`} />
              
              <div className="p-10">
                {/* Category badge */}
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 mb-4">
                  {article.category}
                </div>

                {/* Title */}
                <h3 className="text-gray-900 mb-4 text-2xl group-hover:text-[#4ea8a1] transition-colors">
                  {article.title}
                </h3>

                {/* Snippet */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {article.snippet}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>

                {/* Read More */}
                <Link href="/newsroom">
                  <Button
                    variant="ghost"
                    className="group/btn text-[#4ea8a1] hover:text-[#3d8680] p-0"
                  >
                    Read Full Article
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/newsroom">
            <Button variant="outline" size="lg" className="group border-2 bg-transparent border-gray-700 text-white hover:border-[#4ea8a1] hover:text-[#4ea8a1] hover:bg-[#4ea8a1]/10 text-base px-8 py-6">
              View All News
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}