import { useState } from 'react';
import {
  Headphones, MessageCircle, Mail, Phone, HelpCircle,
  DollarSign, Megaphone, Wrench, Send, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Search, ArrowLeft,
  FileText, BookOpen, TrendingUp,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Input from '@/components/base/Input';
import { cn } from '@/lib/utils';

// ── Data ──────────────────────────────────────────────────────────────────────

type SupportType = 'sales' | 'marketing' | 'ops' | 'tech';

const SUPPORT_CATEGORIES = [
  {
    id: 'sales' as SupportType,
    label: 'Sales Support',
    icon: DollarSign,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: 'Get help with deals, negotiations, and closing',
    whatsapp: '+2348031234567',
    email: 'sales@investinda.com',
  },
  {
    id: 'marketing' as SupportType,
    label: 'Marketing Support',
    icon: Megaphone,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description: 'Assistance with campaigns, content, and promotion',
    whatsapp: '+2348059876543',
    email: 'marketing@investinda.com',
  },
  {
    id: 'ops' as SupportType,
    label: 'Ops Support',
    icon: Headphones,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    description: 'Property listings, documentation, and processes',
    whatsapp: '+2348075551234',
    email: 'ops@investinda.com',
  },
  {
    id: 'tech' as SupportType,
    label: 'Tech Support',
    icon: Wrench,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    description: 'Platform issues, bugs, and technical assistance',
    whatsapp: '+2348092223333',
    email: 'tech@investinda.com',
  },
];

const FAQS = [
  {
    category: 'sales',
    question: 'How do I track my commission?',
    answer: "Commission tracking is available in your CRM dashboard under the 'Deals' section. Each closed deal shows the commission amount and payment status.",
  },
  {
    category: 'sales',
    question: "What's the best way to follow up with cold leads?",
    answer: 'Use our pre-written follow-up scripts in the Training Hub. We recommend waiting 3–5 days before the first follow-up, then weekly touchpoints.',
  },
  {
    category: 'marketing',
    question: 'How many marketing credits do I get per month?',
    answer: 'Each agent receives 50 marketing credits monthly. You can earn additional credits by contributing sales data (50 credits per approved contribution).',
  },
  {
    category: 'marketing',
    question: 'Can I schedule social media posts?',
    answer: 'Yes! In the Marketing Center, select your platform, choose your listing, and use the scheduling feature to plan posts in advance.',
  },
  {
    category: 'ops',
    question: 'What documents do I need to list a property?',
    answer: 'At minimum: property title, survey plan, and building plan (for completed properties). For land: title and survey. For off-plan: approved plans and construction timeline.',
  },
  {
    category: 'tech',
    question: 'The platform is running slow. What should I do?',
    answer: 'Try clearing your browser cache or switching to Chrome/Safari. If issues persist, contact tech support via WhatsApp for immediate assistance.',
  },
];

const DOCS = [
  {
    id: 'crm-deal-flow',
    title: 'CRM Deal Flow Documentation',
    category: 'CRM & Sales',
    icon: TrendingUp,
    sections: [
      { title: 'Overview', content: "The CRM system tracks deals through 5 stages: New Lead → Contacted → Viewing → Negotiating → Closing. Each stage has specific actions and automated features to help you close more deals." },
      { title: 'Adding a New Deal', content: "Click 'Add Deal' in the CRM Hub. Fill in client details (name, email, phone, budget). Select the property they're interested in. The system automatically creates a new lead in the 'New Lead' stage with a follow-up task scheduled for 24 hours." },
      { title: 'Stage 1 — New Lead', content: "Fresh inquiries. Action items: Send welcome message, Schedule initial call, Qualify budget. The system shows days since lead creation and prompts you to move to 'Contacted' after first touchpoint." },
      { title: 'Stage 2 — Contacted', content: "You've had first conversation. Action items: Schedule property viewing, Send property details, Answer questions. Move to 'Viewing' when site visit is scheduled." },
      { title: 'Stage 3 — Viewing', content: "Scheduled/completed viewings. Action items: Confirm viewing date/time, Prepare property tour, Follow up after viewing. Move to 'Negotiating' when client shows serious interest." },
      { title: 'Stage 4 — Negotiating', content: "Active price/terms discussion. Action items: Record offer amount, Track counter-offers, Set decision deadline. The system shows negotiation timeline and reminds you of pending responses." },
      { title: 'Stage 5 — Closing', content: "Finalizing the deal. Action items: Set closing date, Upload signed documents (offer letter, MOU, payment receipt), Calculate commission. Once all documents are uploaded and closing date is set, click 'Mark as Closed' to complete the deal." },
      { title: 'Commission Tracking', content: "Your commission is calculated automatically based on deal value and your commission rate (default 5%). Track total commissions in the CRM dashboard. Filter by status: Pending (in negotiation), Due (closed, awaiting payment), Paid (received)." },
      { title: 'Best Practices', content: "1) Update lead stage within 24 hours of status change.\n2) Add notes after every client interaction.\n3) Set reminders for follow-ups — don't let leads go cold.\n4) Upload documents immediately to avoid delays.\n5) Move deals to 'Lost' if client goes cold after 30 days (you can reactivate later)." },
    ],
  },
  {
    id: 'marketing-payment',
    title: 'Marketing Services Payment Guide',
    category: 'Marketing',
    icon: DollarSign,
    sections: [
      { title: 'Credit System Overview', content: "You receive 50 marketing credits monthly (renewed on the 1st of each month). Credits don't roll over — use them or lose them at month-end." },
      { title: 'How to Pay for Marketing Services', content: "When booking a paid service (3D Tour, Photography, Videography, Digital Ads), you'll see two payment options on the final step:\n\nOPTION 1: Use Credits — Deducts from monthly allocation.\nOPTION 2: Pay Now — Direct payment via Paystack." },
      { title: 'Service Costs', content: "3D Virtual Tour: 15 credits or ₦15,000\nPhotography: 10 credits or ₦10,000\nVideography: 20 credits or ₦20,000\nDigital Ads: Contact team for pricing" },
      { title: 'Earning Bonus Credits', content: "Contribute sales data in the Data Contribution Hub. Earn 50 credits per verified and approved contribution. This is the only way to earn additional credits beyond your monthly allocation." },
    ],
  },
  {
    id: 'platform-overview',
    title: 'Inda Pro Platform Overview',
    category: 'Getting Started',
    icon: BookOpen,
    sections: [
      { title: '10 Core Sections', content: "Home Dashboard — Performance metrics & quick actions\nListings Hub — Manage your property inventory\nCRM — Track deals & leads\nMarketing Center — Professional marketing services\nTraining Hub — Sales scripts & best practices\nSupport Hub — Get help (you're here!)\nChannel Setup — Connect WhatsApp, Instagram, etc.\nData Contribution — Share sales data, earn credits\nPerks Hub — Exclusive agent benefits\nProfile & Settings — Manage your account" },
      { title: 'Navigation', content: "Use the sidebar to switch between sections. Your current section is highlighted in Inda teal. Every section is accessible from any page via the sidebar." },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const [selectedType, setSelectedType] = useState<SupportType | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSubject('');
      setMessage('');
      setSelectedType(null);
    }, 3000);
  };

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedType || faq.category === selectedType;
    return matchesSearch && matchesCategory;
  });

  const activeGuide = DOCS.find((g) => g.id === selectedGuide);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
              Support Hub
            </h1>
            <p className="text-gray-600 mt-1">Get help from our team — we&apos;re here for you</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, iconBg: 'bg-green-100', iconColor: 'text-green-600', value: '~5 min', label: 'Avg Response Time' },
              { icon: CheckCircle2, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', value: '98%', label: 'Resolution Rate' },
              { icon: Headphones, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', value: '24/7', label: 'Available' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-inda-gray flex items-center gap-4">
                  <div className={cn('p-3 rounded-lg flex-shrink-0', stat.iconBg)}>
                    <Icon className={cn('w-5 h-5', stat.iconColor)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support Categories */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Support Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUPPORT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedType === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedType(isSelected ? null : cat.id)}
                    className={cn(
                      'bg-white rounded-2xl p-6 shadow-sm border-2 transition-all cursor-pointer hover:shadow-lg',
                      isSelected
                        ? 'border-inda-teal ring-2 ring-inda-teal/20'
                        : 'border-inda-gray hover:border-inda-teal/40'
                    )}
                  >
                    <div className={cn('p-3 rounded-xl w-fit mb-4 transition-transform', cat.iconBg, isSelected && 'scale-110')}>
                      <Icon className={cn('w-6 h-6', cat.iconColor)} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{cat.label}</h3>
                    <p className="text-sm text-gray-600 mb-4">{cat.description}</p>

                    {isSelected && (
                      <div className="space-y-2 pt-4 border-t border-gray-100">
                        <a
                          href={`https://wa.me/${cat.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center gap-2 px-3 py-2 border border-inda-gray rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          WhatsApp
                        </a>
                        <a
                          href={`mailto:${cat.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center gap-2 px-3 py-2 border border-inda-gray rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-blue-600" />
                          Email
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          {selectedType && (
            <div className="bg-white rounded-2xl shadow-sm border border-inda-gray p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-inda-teal/10 rounded-lg">
                  <Send className="w-5 h-5 text-inda-teal" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Support Request</h2>
                  <p className="text-sm text-gray-600">
                    {SUPPORT_CATEGORIES.find((c) => c.id === selectedType)?.label}
                  </p>
                </div>
              </div>

              {showSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Request Sent!</h3>
                  <p className="text-gray-600">Our team will respond within 5 minutes via WhatsApp</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      placeholder="Provide details about your issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-inda-teal text-sm resize-none min-h-[120px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white font-semibold rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Submit Request
                    </button>
                    <a
                      href={`https://wa.me/${SUPPORT_CATEGORIES.find((c) => c.id === selectedType)?.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 border border-inda-gray rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* FAQ Section */}
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredFAQs.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl shadow-sm border border-inda-gray p-5 group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-inda-teal/10 rounded-lg mt-0.5 flex-shrink-0">
                          <HelpCircle className="w-4 h-4 text-inda-teal" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                          <span className="text-xs text-gray-500">
                            {SUPPORT_CATEGORIES.find((c) => c.id === faq.category)?.label}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-90 transition-transform mt-1" />
                    </div>
                  </summary>
                  <div className="mt-4 pl-12 pr-4">
                    <p className="text-gray-700 leading-relaxed text-sm">{faq.answer}</p>
                  </div>
                </details>
              ))}

              {filteredFAQs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-inda-gray">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No FAQs found matching your search</p>
                </div>
              )}
            </div>
          </div>

          {/* Documentation Guides */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-inda-teal" />
              Documentation &amp; Guides
            </h2>

            {!selectedGuide ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DOCS.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <div
                      key={guide.id}
                      onClick={() => { setSelectedGuide(guide.id); setExpandedSection(null); }}
                      className="bg-white rounded-2xl p-6 shadow-sm border-2 border-inda-gray hover:border-inda-teal hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="p-4 bg-gradient-to-br from-inda-teal to-[#3d8780] rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{guide.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{guide.category}</p>
                      <div className="flex items-center gap-1 text-inda-teal font-semibold text-sm">
                        Read Guide
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-inda-gray overflow-hidden">
                {/* Guide Header */}
                <div className="bg-gradient-to-r from-inda-teal to-[#3d8780] p-6 text-white">
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Guides
                  </button>
                  {activeGuide && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
                        <activeGuide.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{activeGuide.title}</h2>
                        <p className="text-white/80 mt-1">{activeGuide.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guide Sections */}
                <div className="p-6 space-y-3">
                  {activeGuide?.sections.map((section, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                        className="w-full text-left p-5 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-inda-teal/10 rounded-lg flex-shrink-0">
                              <FileText className="w-4 h-4 text-inda-teal" />
                            </div>
                            <h3 className="font-bold text-gray-900">{section.title}</h3>
                          </div>
                          <ChevronRight className={cn('w-5 h-5 text-gray-400 transition-transform flex-shrink-0', expandedSection === i && 'rotate-90')} />
                        </div>
                      </button>
                      {expandedSection === i && (
                        <div className="px-5 pb-5">
                          <div className="pl-12 bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{section.content}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Urgent Contact Banner */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Urgent Issue?</h3>
                  <p className="text-white/90 text-sm">Call our hotline for immediate assistance</p>
                </div>
              </div>
              <a
                href="tel:+2348001234567"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
