import { useState } from 'react';
import {
  GraduationCap, FileText, Video, Award, BookOpen, CheckCircle2,
  Play, Download, Clock, Star, TrendingUp, Search,
  ChevronRight, ArrowLeft, ExternalLink, Youtube,
} from 'lucide-react';
import Input from '@/components/base/Input';
import { cn } from '@/lib/utils';

type TrainingCategory = 'scripts' | 'sales-guides' | 'product-guides' | 'certifications';
type ContentType = 'script' | 'guide' | 'video' | 'certification';

interface TrainingItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  duration: string;
  completed: boolean;
  modules?: number;
  progress?: number;
  youtubeUrl?: string;
  content?: string;
}

const trainingContent = {
  scripts: [
    {
      id: 's1',
      title: '🎯 First Contact Script - WhatsApp',
      description: 'Your perfect opening message that gets responses (82% reply rate!)',
      type: 'script' as ContentType,
      duration: '5 min read',
      completed: true,
      content: `**THE OPENING MESSAGE THAT WORKS** 🔥

Hi [Name]! 👋

Saw your inquiry about [property type] in [area]. Quick question - are you looking for:
A) Ready-to-move property 🏠
B) Off-plan investment 📈
C) Just exploring options 👀

*Why this works:*
- Friendly but professional
- Multiple choice = easy to respond
- Emoji make it feel warm, not salesy

**NEXT STEPS:**
Based on their answer, follow up with:
→ A: "Great! I have 3 perfect options. When can you view?"
→ B: "Smart move! Developers are offering 10% discounts this month"
→ C: "No pressure! Mind if I send you our market update?"

**PRO TIP:** Send between 10am-12pm or 6pm-8pm for best response rates!`,
    },
    {
      id: 's2',
      title: '💰 Price Objection Handling',
      description: "Turn 'too expensive' into 'where do I sign?' (works like magic)",
      type: 'script' as ContentType,
      duration: '8 min read',
      completed: false,
      content: `**WHEN THEY SAY "IT'S TOO EXPENSIVE"** 💸

❌ DON'T SAY: "Actually it's quite reasonable for the area..."
✅ DO SAY: "I totally understand. Can I ask what price range works for you?"

**THE 3-STEP FLIP:**

**1. VALIDATE**
"I hear you - it's a big decision!"

**2. REFRAME**
"Quick question - are we comparing monthly payment or total price?"
(Most people haven't calculated actual monthly costs!)

**3. ANCHOR VALUE**
"This property is ₦85M. The one next door just sold for ₦92M last month. With our payment plan, you're actually paying ₦7M LESS than market. Does that change things?"

**POWER PHRASES:**
→ "What if I could show you the payment breakdown?"
→ "Let's focus on ROI instead of price"
→ "This area appreciates 15% yearly - you're not buying, you're banking"

**THE KICKER:**
"Even if you sell in 2 years, you'll make back the 'extra' cost plus 30%. That's not expensive, that's smart money! 😉"`,
    },
    {
      id: 's3',
      title: '🔄 Follow-up Script (7-Day Ghost)',
      description: 'Re-engage cold leads without being annoying',
      type: 'script' as ContentType,
      duration: '4 min read',
      completed: true,
      content: `**WHEN THEY'VE GONE SILENT FOR 7 DAYS** 👻

**SUBJECT: "Still available, but..."**

Hey [Name]!

Remember that [property details]?

Not gonna lie - 2 other people viewed it this week and one asked for the payment terms.

I'm holding off showing anyone else until Friday because I remember you were genuinely interested.

Still on your radar? 🎯

**Or if you've moved on, no worries! Just let me know so I can help the next person.**

Quick yes or no?

[Your Name]

---

**WHY THIS WORKS:**
✅ Creates urgency (other buyers)
✅ Shows respect (asking permission)
✅ Easy exit (no pressure)
✅ Makes them feel special (holding it)

**RESULTS:** 40% re-engagement rate vs 8% with "just checking in"

**FOLLOW-UP SEQUENCE:**
Day 7: Send above
Day 10: Voice note - "Hey! Voice notes feel more personal..."
Day 14: New listing - "This just came in and I thought of you"
Day 30: Market update - Value-add, not sales pitch`,
    },
    {
      id: 's4',
      title: '🎯 Closing Script - Final Push',
      description: "Move from 'interested' to 'signed' (close rate: 67%)",
      type: 'script' as ContentType,
      duration: '6 min read',
      completed: false,
      content: `**THE CLOSING SEQUENCE THAT SEALS DEALS** 🔐

**STEP 1: TRIAL CLOSE**
"On a scale of 1-10, how excited are you about this property?"

If 7+: "Awesome! What's keeping it from being a 10?"
If <7: "What would make it a 10 for you?"

**STEP 2: ASSUMPTION CLOSE**
"Great! So when we move forward, will you be paying the initial deposit this week or next?"

(Notice: Not IF, but WHEN)

**STEP 3: TAKEAWAY CLOSE**
"Listen, I want to be straight with you. This property won't last beyond this weekend. I'd hate for you to miss out. What's holding you back?"

**OBJECTION KILLER:**
Them: "I need to think about it"
You: "Of course! What specifically do you need to think about? Location? Price? Payment plan? Let's talk through it now while I'm here."

**THE FINAL NUDGE:**
"[Name], in my experience, people who wait usually regret it. The ones who move fast are the ones thanking me 6 months later. Which group do you want to be in?"

**CLOSE WITH CHOICE:**
"So should we start with the reservation form or the payment schedule first?"

**GOLDEN RULE:** Whoever speaks first after asking for the sale, LOSES. Ask, then SHUT UP. 🤐`,
    },
    {
      id: 's5',
      title: '📱 Social Media DM Script',
      description: 'Convert Instagram/Facebook inquiries into viewings',
      type: 'script' as ContentType,
      duration: '5 min read',
      completed: false,
      content: `**SOCIAL MEDIA TO SITE VISIT SCRIPT** 📲

**WHEN THEY COMMENT "Price?" or "Available?"**

"Hey! 👋 Yes still available! Can I send you the details on WhatsApp? It's easier to share photos and payment options there 😊

My WhatsApp: [Your Number]"

*Why WhatsApp?* Better engagement, can track conversations, send voice notes!

**FIRST WHATSAPP MESSAGE:**
"Hi [Name]! Thanks for asking about [property] on Instagram!

Quick intro: I'm [Your Name], Inda Pro certified agent 🏆

Here's what you asked about: [Send 3-5 photos]

💰 Price: ₦XX
📍 Location: [Area]
🏠 Details: [Beds/baths/sqm]

When can you view? I'm free:
📅 Tomorrow 2pm
📅 Friday 11am
📅 Saturday anytime

Which works?"

**PRO TIP:** Add story polls!
"Which property should I post next? A) Luxury Villa B) Affordable Apartment"

Gets engagement + shows you're active!`,
    },
  ],
  salesGuides: [
    {
      id: 'sg1',
      title: '🎯 BANT Framework - Qualify Leads Fast',
      description: 'Stop wasting time on tire kickers (save 10+ hours/week)',
      type: 'guide' as ContentType,
      duration: '12 min read',
      completed: false,
      content: `**THE BANT QUALIFICATION METHOD** ⚡

In first conversation, discover these 4 things:

**B - BUDGET** 💰
Ask: "What price range are you exploring?"
❌ "What's your budget?" (too direct)
✅ "Most clients I work with are between ₦30-50M, does that sound about right?"

**A - AUTHORITY** 👥
Ask: "Will anyone else be involved in this decision?"
Red flag: "I need to ask my uncle/pastor/cousin"
Green flag: "It's just me and my spouse"

**N - NEED** 🎯
Ask: "What's prompting the move now?"
Best answers: Job relocation, growing family, investment deadline
Bad answers: "Just looking around" (time waster alert!)

**T - TIMELINE** ⏰
Ask: "When do you need to move in / make this investment?"
A+ Lead: "Within 3 months"
C Lead: "Maybe next year sometime"

**SCORING SYSTEM:**
✅ All 4 checked = HOT LEAD (drop everything!)
✅ 3 out of 4 = WARM (nurture weekly)
❌ 2 or less = COLD (newsletter only)

**TIME SAVER:** Use this in first 5 minutes. Don't waste hour-long calls on unqualified leads!`,
    },
    {
      id: 'sg2',
      title: '📹 Virtual Tour Masterclass',
      description: 'Conduct tours that sell (even better than in-person!)',
      type: 'video' as ContentType,
      duration: '18 min',
      completed: true,
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**VIRTUAL TOUR BEST PRACTICES** 🎥

**BEFORE THE TOUR:**
✅ Test internet connection
✅ Charge phone to 100%
✅ Arrive 15 mins early
✅ Check lighting
✅ Script your walkthrough

**DURING THE TOUR:**

**1. THE OPENING (30 seconds)**
"Hi [Name]! Welcome to your virtual tour of [property]! I'm going to walk you through like you're right here with me. Feel free to interrupt anytime with questions!"

**2. OUTSIDE FIRST**
Show street, parking, building facade
"This is what you see when you come home every day"

**3. ENTER LIKE A BUYER**
Open door, pause at entrance
"That first impression though! 😍"

**4. ROOM BY ROOM**
- Living room: "Picture your sofa HERE, TV THERE"
- Kitchen: "Imagine Sunday breakfast here"
- Bedrooms: "This could be your home office"
- Bathroom: "Look at these fixtures!"

**5. THE CLOSE**
"So [Name], can you see yourself here?"
(Works 70% of the time!)

**PRO TIPS:**
→ Use phone horizontal mode
→ Walk SLOWLY
→ Natural light is KING
→ Narrate everything
→ Record it and send after!

**Watch full masterclass on our YouTube!** 📺`,
    },
    {
      id: 'sg3',
      title: '🤝 Negotiation Tactics That Win',
      description: "Get to YES faster (without leaving money on the table)",
      type: 'guide' as ContentType,
      duration: '15 min read',
      completed: false,
      content: `**WIN-WIN NEGOTIATION SECRETS** 🏆

**RULE #1: NEVER GIVE WITHOUT GETTING**

Buyer: "Can you do ₦80M instead of ₦85M?"
❌ BAD: "Let me ask the seller"
✅ GOOD: "If we can get to ₦80M, would you pay the initial deposit today?"

**THE FLINCH TECHNIQUE** 😮
When they counter with a low offer, physically flinch
"₦70M? For THIS property? Wow, that's quite a stretch from the ₦85M asking price"
(Wait. Let silence work for you)

**ANCHORING** ⚓
Buyer: "What's the lowest you'll go?"
You: "Well, similar properties sold for ₦95M last month, so ₦85M is already a great deal. But I hear you - what's your best offer?"

**THE NIBBLE** 🍪
After they agree to price...
You: "Fantastic! So that includes the AC units and water heater, right?"
(Add value without reducing price)

**THE GOLDEN PHRASE:**
"Let's work together to make this happen"
(You're partners, not opponents)`,
    },
    {
      id: 'sg4',
      title: '💼 Building Investor Relationships',
      description: 'Turn one client into lifetime commissions',
      type: 'guide' as ContentType,
      duration: '10 min read',
      completed: false,
      content: `**THE INVESTOR RETENTION PLAYBOOK** 📈

**WHY INVESTORS MATTER:**
- One investor = 5-10 properties over 5 years
- They refer other investors
- Less emotional = easier sales
- Bulk purchases possible

**THE FIRST DEAL:**

**1. EDUCATION FIRST**
Don't just sell, TEACH
"Here's why Lekki appreciates faster than Ajah"
"This developer has 100% delivery record"
"ROI calculator: You'll make ₦X in 3 years"

**2. TRANSPARENCY**
Show them:
✅ Market comparisons
✅ Resale potential
✅ Rental yields
✅ Developer track record

"I want you to make money so you come back to me!"

**RESULT:** Average Inda Pro agent earns 40% of commission from repeat investors. Build relationships, not transactions!`,
    },
    {
      id: 'sg5',
      title: '📊 Understanding Market Cycles',
      description: 'Sell in any market condition (boom or recession)',
      type: 'video' as ContentType,
      duration: '22 min',
      completed: false,
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**MARKET CYCLES & HOW TO WIN IN EACH** 📉📈

**4 PHASES OF REAL ESTATE:**

**PHASE 1: RECOVERY** 🌱
- Prices starting to rise
- Few buyers, lots of inventory
**Your Strategy:** Build buyer list, lock in low prices for investors

**PHASE 2: EXPANSION** 🚀
- Prices rising fast
- More buyers entering
**Your Strategy:** SELL FAST, create urgency, max commissions!

**PHASE 3: HYPER SUPPLY** ⚠️
- Peak prices
- Developers flooding market
**Your Strategy:** Focus on best locations, warn buyers against overpaying

**PHASE 4: RECESSION** 📉
- Prices dropping
- Fear in market
**Your Strategy:** Help distressed sellers, find bargains for cash buyers

**RIGHT NOW IN NIGERIA:** We're in Phase 2 in Lekki/Ikoyi, Phase 1 in Epe/Ibeju-Lekki

**NEVER SAY:** "It's a bad time to buy"
**ALWAYS SAY:** "Here's the smart move in this market"

**Full breakdown on YouTube!** 🎥`,
    },
  ],
  productGuides: [
    {
      id: 'pg1',
      title: '📊 Property Report Generation 101',
      description: 'Create verification reports that close deals',
      type: 'video' as ContentType,
      duration: '12 min',
      completed: true,
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**HOW TO USE INDA VERIFICATION REPORTS** ✅

**WHY BUYERS LOVE THEM:**
✓ Shows you're professional
✓ Builds trust instantly
✓ Answers objections before they ask
✓ 3x higher close rate!

**WHEN TO SEND:**
→ After first viewing
→ With pricing proposals
→ To overcome objections
→ To impress investor clients

**SECTIONS TO HIGHLIGHT:**

1. **VERIFICATION STATUS** ✅
   "See this green checkmark? Title is 100% clean"

2. **MARKET ANALYSIS** 📊
   "You're paying ₦85M but market value is ₦88M - instant equity!"

3. **PRICE BENCHMARKING** 💰
   "Compared to 10 similar properties, this is actually underpriced"

4. **RISK ASSESSMENT** 🛡️
   "Low risk investment - here's why..."

**PRO TIP:** Brand it with YOUR info at the bottom. This report becomes YOUR marketing tool!

**Full tutorial on YouTube!** 🎬`,
    },
    {
      id: 'pg2',
      title: '📱 Marketing Center Power User Guide',
      description: 'Use all marketing tools like a pro (10X your leads!)',
      type: 'video' as ContentType,
      duration: '16 min',
      completed: false,
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**MARKETING CENTER WALKTHROUGH** 🚀

**YOUR MARKETING ARSENAL:**

**1. EMAIL CAMPAIGNS** 📧
Best for: Investor lists, past clients
Send: Monthly market updates, new listings
Open Rate: 35% average!

**2. SOCIAL MEDIA POSTS** 📱
Platforms: Instagram, Facebook, TikTok, YouTube
Post frequency: 3x week minimum
Use: AI captions + custom designs

**3. DIGITAL ADS** 🎯
Meta Ads: ₦50k budget = 10,000-50,000 people
Google Ads: Target "properties in Lekki"
ROI: 1 deal pays for 6 months of ads!

**Watch full walkthrough on YouTube!**`,
    },
    {
      id: 'pg3',
      title: '💼 CRM Mastery - Never Lose a Lead',
      description: 'Track deals like a machine, close like a human',
      type: 'guide' as ContentType,
      duration: '14 min read',
      completed: false,
      content: `**CRM PIPELINE MANAGEMENT** 🎯

**THE 7 STAGES (Your Money Pipeline):**

**1. NEW LEAD** 🆕
- Added to CRM within 1 hour
- First response within 15 minutes
- Qualify with BANT questions

**2. QUALIFIED** ✅
- Budget confirmed
- Timeline set
- Decision maker identified

**3. OFFER SENT** 📄
- Sent pricing + payment terms
- Inda verification report attached
- Follow up in 24-48 hours

**4. NEGOTIATING** 🤝
- Active back-and-forth
- Price discussions

**5. PAYMENT** 💳
- Reservation form signed
- Initial deposit paid

**6. CLOSING** 🔐
- Legal documentation
- Final payment processing

**7. CLOSED/WON** 🏆🎉
- Deal complete!
- Commission earned!
- Request referral!

**RESULT:** Our top agents close 30% more deals just by using CRM properly!`,
    },
    {
      id: 'pg4',
      title: '📈 Channel Performance Optimization',
      description: "Find your best lead sources (stop wasting money!)",
      type: 'guide' as ContentType,
      duration: '11 min read',
      completed: false,
      content: `**TRACK & OPTIMIZE YOUR CHANNELS** 📊

When lead comes in, ask:
"By the way, how did you hear about this property?"

Then TAG in CRM: #Instagram or #Referral etc.

**AFTER 30 DAYS, ANALYZE:**

Referrals = highest quality (40% close rate!)
Facebook Ads = good ROI (8 deals for ₦30k)
Instagram = volume but lower quality

**OPTIMIZATION MOVES:**

**1. DOUBLE DOWN** 📈
Put MORE effort into what works

**2. FIX OR CUT** ✂️
Low performance? Either improve or stop

**3. TEST NEW CHANNELS** 🧪
TikTok, LinkedIn, Google Ads

**SUCCESS FORMULA:**
Best Channel × Consistent Activity = Predictable Income`,
    },
    {
      id: 'pg5',
      title: '🎨 Creating Scroll-Stopping Content',
      description: 'Social media posts that get views & leads',
      type: 'video' as ContentType,
      duration: '19 min',
      completed: false,
      youtubeUrl: 'https://youtube.com/@indahq',
      content: `**CONTENT THAT CONVERTS** 📲💰

**WHAT TO POST:**

**70% - VALUE** 🎓
- Market updates, buyer tips, area guides

**20% - LISTINGS** 🏠
- Property showcases, virtual tours

**10% - PERSONAL** 🙋
- Behind the scenes, client testimonials

**POST IDEAS THAT POP:**
✨ "3 Mistakes First-Time Buyers Make"
✨ "Lekki vs Ikoyi: Where Should You Invest?"
✨ "This ₦45M Property Could Be Worth ₦65M in 2 Years"

**BEST TIMES TO POST:**
📱 Instagram: 7-9am, 12-1pm, 7-9pm
📘 Facebook: 12-3pm
🎵 TikTok: 6-9pm, 9-11pm

**Full content strategy on YouTube!** 👀`,
    },
  ],
  certifications: [
    {
      id: 'c1',
      title: '🏆 Inda Pro Certified Agent',
      description: 'Master the fundamentals & earn your official badge',
      type: 'certification' as ContentType,
      duration: '2.5 hours',
      completed: false,
      modules: 8,
      progress: 25,
      content: `**BECOME A CERTIFIED INDA PRO AGENT** 🎓

**Module 1:** Platform Overview (15 min)
**Module 2:** Property Verification (20 min)
**Module 3:** CRM Fundamentals (25 min)
**Module 4:** Marketing Tools (30 min)
**Module 5:** Professional Communication (20 min)
**Module 6:** Compliance & Ethics (15 min)
**Module 7:** Client Management (25 min)
**Module 8:** Final Exam (30 min) — 50 questions, 80% to pass

**CERTIFICATION BENEFITS:**
✅ Official badge for your profile
✅ Listed in Inda Pro directory
✅ Access to exclusive leads
✅ Priority support
✅ Credential to share on social media`,
    },
    {
      id: 'c2',
      title: '💎 Advanced Sales Strategist',
      description: 'Close high-ticket deals like the top 1% (₦100M+ properties)',
      type: 'certification' as ContentType,
      duration: '4 hours',
      completed: false,
      modules: 12,
      progress: 0,
      content: `**HIGH-TICKET SALES CERTIFICATION** 💰

FOR EXPERIENCED AGENTS ONLY
(Must complete Inda Pro Certified Agent first)

**Advanced Modules:**
1. Psychology of Wealthy Buyers
2. Luxury Market Dynamics
3. Developer Relationships
4. International Clients
5. Complex Negotiations
6. Investment Analysis
7. Portfolio Building
8. Tax Implications
9. Legal Structures
10. Closing Big Deals
11. VIP Client Retention
12. Final Project: Close a ₦50M+ Deal

**AVERAGE GRADUATE INCOME:** ₦15M/year in commissions`,
    },
    {
      id: 'c3',
      title: '📱 Digital Marketing Expert',
      description: 'Generate leads online like a boss (50+ leads/month guaranteed)',
      type: 'certification' as ContentType,
      duration: '3 hours',
      completed: false,
      modules: 10,
      progress: 60,
      content: `**DIGITAL MARKETING MASTERY** 📲

**Section 1:** Social Media (90 min) — Instagram, Facebook, TikTok, YouTube
**Section 2:** Paid Advertising (60 min) — Facebook/Instagram ads, Google, retargeting
**Section 3:** Content Creation (45 min) — Video, photo, copywriting, storytelling
**Section 4:** Analytics & Optimization (45 min)

**CERTIFICATION PROJECT:**
Create and run a 30-day marketing campaign generating 20+ qualified leads.

**Our grads average 50-100 leads/month!** 🚀`,
    },
    {
      id: 'c4',
      title: '🌍 International Real Estate Specialist',
      description: 'Work with diaspora & global investors (tap into $$ market!)',
      type: 'certification' as ContentType,
      duration: '3.5 hours',
      completed: false,
      modules: 11,
      progress: 0,
      content: `**GLOBAL INVESTOR CERTIFICATION** 🌎

THE DIASPORA MARKET IS HUGE 💵
Nigerians abroad invest BILLIONS in Lagos real estate annually!

**Module 1:** Understanding the Diaspora Buyer
**Module 2:** Virtual Sales Excellence
**Module 3:** International Payments
**Module 4:** Legal Framework
**Module 5:** Property Management
**Module 6-11:** Advanced topics including tax, inheritance, market timing, networking, and case studies

**EARNINGS POTENTIAL:**
Diaspora deals average ₦60-150M = ₦3-7.5M per deal! 🤑

**GET CERTIFIED. GO GLOBAL!** ✈️`,
    },
  ],
};

const CATEGORIES = [
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'sales-guides', label: 'Sales Guides', icon: BookOpen },
  { id: 'product-guides', label: 'Product Guides', icon: Video },
  { id: 'certifications', label: 'Certifications', icon: Award },
] as const;

const STATS = [
  { label: 'Scripts', value: trainingContent.scripts.length, icon: FileText, color: 'from-green-500 to-emerald-600' },
  { label: 'Sales Guides', value: trainingContent.salesGuides.length, icon: BookOpen, color: 'from-blue-500 to-cyan-600' },
  { label: 'Product Guides', value: trainingContent.productGuides.length, icon: Video, color: 'from-purple-500 to-pink-600' },
  { label: 'Certifications', value: trainingContent.certifications.length, icon: Award, color: 'from-amber-500 to-orange-600' },
];

function getCategoryData(category: TrainingCategory): TrainingItem[] {
  switch (category) {
    case 'scripts': return trainingContent.scripts;
    case 'sales-guides': return trainingContent.salesGuides;
    case 'product-guides': return trainingContent.productGuides;
    case 'certifications': return trainingContent.certifications;
  }
}

// ── Detail View ───────────────────────────────────────────────────────────────

function DetailView({ item, onBack }: { item: TrainingItem; onBack: () => void }) {
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
          {/* Header */}
          <div className="bg-gradient-to-r from-inda-teal to-[#3d8780] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-white/90 mb-4">{item.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{item.duration}</span>
              </div>
              {item.completed && (
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {item.youtubeUrl && (
              <div className="mb-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Watch Full Video Tutorial</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get the complete step-by-step walkthrough on our YouTube channel
                    </p>
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Watch on YouTube
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

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors',
                  item.completed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white'
                )}
              >
                {item.completed ? 'Review Again' : 'Mark as Complete'}
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

// ── Main Component ────────────────────────────────────────────────────────────

export function TrainingHub() {
  const [activeCategory, setActiveCategory] = useState<TrainingCategory>('scripts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<TrainingItem | null>(null);

  if (selectedItem) {
    return <DetailView item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  const currentContent = getCategoryData(activeCategory);
  const filtered = searchQuery
    ? currentContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentContent;

  const completedCount = currentContent.filter((item) => item.completed).length;
  const totalCount = currentContent.length;
  const completionPct = Math.round((completedCount / totalCount) * 100);
  const activeCategoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label ?? '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
          Training Hub
        </h1>
        <p className="text-gray-600 mt-1">
          Real scripts, guides &amp; certifications to level up your game 🚀
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat) => {
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

      {/* Category Tabs */}
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

      {/* Search */}
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

      {/* Progress Banner */}
      <div className="bg-gradient-to-br from-inda-teal to-[#3d8780] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold mb-1">{activeCategoryLabel} Progress</h3>
            <p className="text-white/80 text-sm">
              {completedCount} of {totalCount} completed
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isCertification = 'modules' in item;
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-inda-gray p-6 hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  {item.type === 'video' && (
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
                {item.completed && (
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
                    <span>Video</span>
                  </div>
                )}
                {isCertification && item.modules && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{item.modules} modules</span>
                  </div>
                )}
              </div>

              {/* Cert progress bar */}
              {isCertification && item.progress !== undefined && item.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-inda-teal">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-inda-teal to-[#3d8780] h-full rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors',
                  item.completed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white'
                )}
              >
                {item.completed ? 'Review' : isCertification && item.progress ? 'Continue' : 'Start'}
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

      {/* YouTube CTA */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center gap-3 mb-3">
              <Youtube className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Watch Video Tutorials on YouTube!</h3>
            </div>
            <p className="text-white/90 mb-4 text-lg">
              Full walkthroughs, screen recordings, and pro tips from our top agents. New videos every week! 🎬
            </p>
            <a
              href="https://youtube.com/@indahq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              Subscribe to Inda HQ
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="hidden md:flex w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center">
            <Play className="w-16 h-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
