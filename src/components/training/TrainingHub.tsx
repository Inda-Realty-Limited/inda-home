import { useEffect, useMemo, useState } from 'react';
import {
  GraduationCap, FileText, Award, BookOpen, CheckCircle2,
  Play, Download, Clock, Search,
  ChevronRight, ArrowLeft, ExternalLink, Youtube,
} from 'lucide-react';
import Input from '@/components/base/Input';
import { cn } from '@/lib/utils';
import { getTrainingProgress, updateTrainingProgress } from '@/api/training';

type TrainingCategory = 'scripts' | 'guides' | 'courses' | 'certifications';
type ContentType = 'script' | 'guide' | 'course' | 'certification';

interface TrainingItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  duration: string;
  modules?: number;
  youtubeUrl?: string;
  content?: string;
}

const trainingContent: Record<TrainingCategory, TrainingItem[]> = {
  scripts: [
    {
      id: 's1',
      title: '🎯 First Contact Script - WhatsApp',
      description: 'Your perfect opening message that gets responses',
      type: 'script',
      duration: '5 min read',
      content: `**THE OPENING MESSAGE THAT WORKS** 🔥

Hi [Name]! 👋

Saw your inquiry about [property type] in [area]. Quick question - are you looking for:
A) Ready-to-move property 🏠
B) Off-plan investment 📈
C) Just exploring options 👀

*Why this works:*
- Friendly but professional
- Multiple choice = easy to respond
- Emoji make it feel warm, not salesy`,
    },
    {
      id: 's2',
      title: '💰 Price Objection Handling',
      description: "Turn 'too expensive' into 'where do I sign?'",
      type: 'script',
      duration: '8 min read',
      content: `**WHEN THEY SAY "IT'S TOO EXPENSIVE"** 💸

❌ DON'T SAY: "Actually it's quite reasonable for the area..."
✅ DO SAY: "I totally understand. Can I ask what price range works for you?"

**THE 3-STEP FLIP:**
1. Validate
2. Reframe
3. Anchor value`,
    },
    {
      id: 's3',
      title: '🔄 Follow-up Script (7-Day Ghost)',
      description: 'Re-engage cold leads without being annoying',
      type: 'script',
      duration: '4 min read',
      content: `**WHEN THEY'VE GONE SILENT FOR 7 DAYS** 👻

Hey [Name]!

Remember that [property details]?

Not gonna lie - 2 other people viewed it this week and one asked for the payment terms.

Still on your radar? 🎯`,
    },
    {
      id: 's4',
      title: '🎯 Closing Script - Final Push',
      description: "Move from 'interested' to 'signed'",
      type: 'script',
      duration: '6 min read',
      content: `**THE CLOSING SEQUENCE THAT SEALS DEALS** 🔐

**STEP 1: TRIAL CLOSE**
"On a scale of 1-10, how excited are you about this property?"

**STEP 2: ASSUMPTION CLOSE**
"Great! So when we move forward, will you be paying the initial deposit this week or next?"`,
    },
    {
      id: 's5',
      title: '📱 Social Media DM Script',
      description: 'Convert Instagram and Facebook inquiries into viewings',
      type: 'script',
      duration: '5 min read',
      content: `**SOCIAL MEDIA TO SITE VISIT SCRIPT** 📲

"Hey! 👋 Yes still available! Can I send you the details on WhatsApp?"

**FIRST WHATSAPP MESSAGE:**
"Hi [Name]! Thanks for asking about [property] on Instagram!"`,
    },
  ],
  guides: [
    {
      id: 'g1',
      title: '🎯 BANT Framework - Qualify Leads Fast',
      description: 'Stop wasting time on tire kickers',
      type: 'guide',
      duration: '12 min read',
      content: `**THE BANT QUALIFICATION METHOD** ⚡

In first conversation, discover these 4 things:
- Budget
- Authority
- Need
- Timeline`,
    },
    {
      id: 'g2',
      title: '🤝 Negotiation Tactics That Win',
      description: 'Get to YES faster without leaving money on the table',
      type: 'guide',
      duration: '15 min read',
      content: `**WIN-WIN NEGOTIATION SECRETS** 🏆

**RULE #1: NEVER GIVE WITHOUT GETTING**

Buyer: "Can you do ₦80M instead of ₦85M?"
✅ GOOD: "If we can get to ₦80M, would you pay the initial deposit today?"`,
    },
    {
      id: 'g3',
      title: '💼 Building Investor Relationships',
      description: 'Turn one client into lifetime commissions',
      type: 'guide',
      duration: '10 min read',
      content: `**THE INVESTOR RETENTION PLAYBOOK** 📈

Why investors matter:
- repeat purchases
- referrals
- easier decision making`,
    },
    {
      id: 'g4',
      title: '💼 CRM Mastery - Never Lose a Lead',
      description: 'Track deals like a machine, close like a human',
      type: 'guide',
      duration: '14 min read',
      content: `**CRM PIPELINE MANAGEMENT** 🎯

Use your CRM stages consistently and update the lead after every meaningful interaction.`,
    },
    {
      id: 'g5',
      title: '📈 Channel Performance Optimization',
      description: 'Find your best lead sources and stop wasting money',
      type: 'guide',
      duration: '11 min read',
      content: `**TRACK & OPTIMIZE YOUR CHANNELS** 📊

Double down on channels that convert. Fix or cut channels that do not.`,
    },
  ],
  courses: [
    {
      id: 'c-course-1',
      title: '📹 Virtual Tour Masterclass',
      description: 'Conduct tours that sell, even remotely',
      type: 'course',
      duration: '18 min',
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**VIRTUAL TOUR BEST PRACTICES** 🎥

Before the tour:
- test internet
- charge phone
- arrive early
- script your walkthrough`,
    },
    {
      id: 'c-course-2',
      title: '📊 Understanding Market Cycles',
      description: 'Sell in any market condition',
      type: 'course',
      duration: '22 min',
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**MARKET CYCLES & HOW TO WIN IN EACH** 📉📈

Understand recovery, expansion, hyper supply, and recession, then adapt your sales motion accordingly.`,
    },
    {
      id: 'c-course-3',
      title: '📊 Property Report Generation 101',
      description: 'Create verification reports that close deals',
      type: 'course',
      duration: '12 min',
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**HOW TO USE INDA VERIFICATION REPORTS** ✅

Use reports to build trust, answer objections early, and improve close rate.`,
    },
    {
      id: 'c-course-4',
      title: '📱 Marketing Center Power User Guide',
      description: 'Use all marketing tools like a pro',
      type: 'course',
      duration: '16 min',
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**MARKETING CENTER WALKTHROUGH** 🚀

Use campaigns, posts, and digital ads deliberately rather than randomly.`,
    },
    {
      id: 'c-course-5',
      title: '🎨 Creating Scroll-Stopping Content',
      description: 'Social media content that gets views and leads',
      type: 'course',
      duration: '19 min',
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**CONTENT THAT CONVERTS** 📲💰

Post value first, listings second, and personal proof selectively.`,
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: '🏆 Inda Pro Certified Agent',
      description: 'Master the fundamentals and earn your official badge',
      type: 'certification',
      duration: '2.5 hours',
      modules: 8,
      content: `**BECOME A CERTIFIED INDA PRO AGENT** 🎓

This certification covers platform fundamentals, verification, CRM, marketing, ethics, and a final exam.`,
    },
    {
      id: 'cert-2',
      title: '💎 Advanced Sales Strategist',
      description: 'Close high-ticket deals like the top 1%',
      type: 'certification',
      duration: '4 hours',
      modules: 12,
      content: `**HIGH-TICKET SALES CERTIFICATION** 💰

Advanced modules for complex deals, portfolio sales, investor psychology, and luxury negotiations.`,
    },
    {
      id: 'cert-3',
      title: '📱 Digital Marketing Expert',
      description: 'Generate leads online like a pro',
      type: 'certification',
      duration: '3 hours',
      modules: 10,
      content: `**DIGITAL MARKETING MASTERY** 📲

Social, paid ads, content systems, and campaign optimization.`,
    },
    {
      id: 'cert-4',
      title: '🌍 International Real Estate Specialist',
      description: 'Work with diaspora and global investors',
      type: 'certification',
      duration: '3.5 hours',
      modules: 11,
      content: `**GLOBAL INVESTOR CERTIFICATION** 🌎

Learn diaspora buyer expectations, virtual selling, payments, and investor workflows.`,
    },
  ],
};

const CATEGORIES = [
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'guides', label: 'Guides', icon: BookOpen },
  { id: 'courses', label: 'Courses', icon: Play },
  { id: 'certifications', label: 'Certifications', icon: Award },
] as const;

function getCategoryData(category: TrainingCategory): TrainingItem[] {
  return trainingContent[category];
}

const ALL_ITEMS = Object.values(trainingContent).flat();

function DetailView({
  item,
  completed,
  saving,
  onBack,
  onToggleComplete,
}: {
  item: TrainingItem;
  completed: boolean;
  saving: boolean;
  onBack: () => void;
  onToggleComplete: (itemId: string) => Promise<void>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Training Hub</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-inda-gray overflow-hidden">
          <div className="bg-gradient-to-r from-inda-teal to-[#3d8780] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-white/90 mb-4">{item.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{item.duration}</span>
              </div>
              {completed && (
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {item.youtubeUrl && (
              <div className="mb-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Watch Course Material</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Open the full lesson for this training item.
                    </p>
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Open lesson
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {item.content && (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm md:text-base">
                {item.content}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => void onToggleComplete(item.id)}
                disabled={saving}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-60',
                  completed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white'
                )}
              >
                {completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button className="p-3 border border-inda-gray rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrainingHub() {
  const [activeCategory, setActiveCategory] = useState<TrainingCategory>('scripts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      try {
        const progress = await getTrainingProgress();
        if (isMounted) {
          setCompletedItemIds(progress.completedItemIds ?? []);
        }
      } catch (error) {
        console.error('Failed to load training progress:', error);
      } finally {
        if (isMounted) {
          setLoadingProgress(false);
        }
      }
    };

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedSet = useMemo(() => new Set(completedItemIds), [completedItemIds]);
  const selectedItem = selectedItemId ? ALL_ITEMS.find((item) => item.id === selectedItemId) ?? null : null;

  const toggleComplete = async (itemId: string) => {
    const isCompleted = completedSet.has(itemId);
    const nextCompleted = isCompleted
      ? completedItemIds.filter((id) => id !== itemId)
      : [...completedItemIds, itemId];

    setSavingItemId(itemId);
    try {
      setCompletedItemIds(nextCompleted);
      const saved = await updateTrainingProgress({ completedItemIds: nextCompleted });
      setCompletedItemIds(saved.completedItemIds ?? nextCompleted);
    } catch (error) {
      console.error('Failed to update training progress:', error);
      setCompletedItemIds(completedItemIds);
    } finally {
      setSavingItemId(null);
    }
  };

  if (selectedItem) {
    return (
      <DetailView
        item={selectedItem}
        completed={completedSet.has(selectedItem.id)}
        saving={savingItemId === selectedItem.id}
        onBack={() => setSelectedItemId(null)}
        onToggleComplete={toggleComplete}
      />
    );
  }

  const currentContent = getCategoryData(activeCategory);
  const filtered = searchQuery
    ? currentContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentContent;

  const completedCount = currentContent.filter((item) => completedSet.has(item.id)).length;
  const totalCount = currentContent.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const activeCategoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label ?? '';
  const stats = CATEGORIES.map((category) => ({
    label: category.label,
    value: trainingContent[category.id].length,
    icon: category.icon,
    color:
      category.id === 'scripts'
        ? 'from-green-500 to-emerald-600'
        : category.id === 'guides'
          ? 'from-blue-500 to-cyan-600'
          : category.id === 'courses'
            ? 'from-purple-500 to-pink-600'
            : 'from-amber-500 to-orange-600',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
          Training Hub
        </h1>
        <p className="text-gray-600 mt-1">
          Scripts, guides, courses, and certifications with tracked completion.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-inda-gray hover:shadow-md transition-shadow"
            >
              <div className={cn('p-2.5 bg-gradient-to-br rounded-lg w-fit mb-3', stat.color)}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-inda-gray p-2 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as TrainingCategory)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-inda-teal to-[#3d8780] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-inda-gray p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search training materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-inda-teal to-[#3d8780] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold mb-1">{activeCategoryLabel} Progress</h3>
            <p className="text-white/80 text-sm">
              {loadingProgress ? 'Loading progress...' : `${completedCount} of ${totalCount} completed`}
            </p>
          </div>
          <div className="text-3xl font-bold">{completionPct}%</div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const completed = completedSet.has(item.id);
          const isCertification = item.type === 'certification';

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-inda-gray p-6 hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelectedItemId(item.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {item.type === 'course' && (
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex-shrink-0">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {item.type === 'guide' && (
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {item.type === 'script' && (
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {item.type === 'certification' && (
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-inda-teal transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>
                </div>
                {completed && (
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{item.duration}</span>
                </div>
                {item.youtubeUrl && (
                  <div className="flex items-center gap-1.5 text-red-600">
                    <Youtube className="w-4 h-4" />
                    <span>Course</span>
                  </div>
                )}
                {isCertification && item.modules && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{item.modules} modules</span>
                  </div>
                )}
              </div>

              <button
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors',
                  completed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white'
                )}
              >
                {completed ? 'Review' : 'Start'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No results found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
