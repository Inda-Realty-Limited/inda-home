import { useState } from 'react';
import { ArrowLeft, Megaphone, Target, DollarSign, TrendingUp, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketingService } from '@/api/marketing';
import { initiatePayment } from '@/api/payments';
import { computeAdCredits, DIGITAL_ADS_MINIMUM, MarketingPaymentMethod } from './pricing';

interface Props { onBack: () => void; }

const adPlatforms = [
  { id: 'google', name: 'Google Ads', description: 'Search & Display Network', minBudget: DIGITAL_ADS_MINIMUM.price, reach: '2M+ Lagos users', icon: '🔍' },
  { id: 'facebook', name: 'Facebook Ads', description: 'News Feed & Stories', minBudget: DIGITAL_ADS_MINIMUM.price, reach: '8M+ Nigerian users', icon: '📘' },
  { id: 'instagram', name: 'Instagram Ads', description: 'Feed, Stories & Reels', minBudget: DIGITAL_ADS_MINIMUM.price, reach: '5M+ Nigerian users', icon: '📸' },
  { id: 'youtube', name: 'YouTube Ads', description: 'Video & Discovery Ads', minBudget: 30000, reach: '10M+ viewers', icon: '▶️' },
];

const targetingOptions = [
  { id: 'location', name: 'Location', icon: MapPin, options: ['Lagos Island', 'Lekki', 'Ikoyi', 'Victoria Island', 'Ajah'] },
  { id: 'age', name: 'Age Range', icon: Users, options: ['25-34', '35-44', '45-54', '55+'] },
  { id: 'income', name: 'Income Level', icon: DollarSign, options: ['₦200k-500k', '₦500k-1M', '₦1M-3M', '₦3M+'] },
  { id: 'interest', name: 'Interests', icon: Briefcase, options: ['Real Estate', 'Luxury Lifestyle', 'Investment', 'Home Improvement'] },
];

export function DigitalAdsFlow({ onBack }: Props) {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [budget, setBudget] = useState('50000');
  const [duration, setDuration] = useState('7');
  const [adObjective, setAdObjective] = useState('');
  const [startDate, setStartDate] = useState('');
  const [targeting, setTargeting] = useState<Record<string, string[]>>({});
  const [paymentMethod, setPaymentMethod] = useState<MarketingPaymentMethod>('credits');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePlatform = (id: string) =>
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleTargeting = (cat: string, opt: string) =>
    setTargeting(prev => ({
      ...prev,
      [cat]: prev[cat]?.includes(opt) ? prev[cat].filter(o => o !== opt) : [...(prev[cat] || []), opt],
    }));

  const handleLaunch = async () => {
    setSubmitting(true);
    try {
      const payload = {
        platforms: selectedPlatforms,
        objective: adObjective,
        budget: parseInt(budget),
        durationDays: parseInt(duration),
        startDate: startDate || undefined,
        targeting: {
          locations: targeting.location,
          ageRanges: targeting.age,
          incomeLevel: targeting.income,
          interests: targeting.interest,
        },
      };

      if (paymentMethod === 'credits') {
        await MarketingService.createAdCampaign({
          ...payload,
          paymentMethod: 'CREDITS',
        });
        setSuccess(true);
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'inda_marketing_checkout',
            JSON.stringify({
              type: 'ad-campaign',
              payload,
            }),
          );
        }

        const payment = await initiatePayment({
          amount: (parseInt(budget) || DIGITAL_ADS_MINIMUM.price).toFixed(2),
          provider: 'FLUTTERWAVE',
          currency: 'NGN',
          paymentType: 'MARKETING_AD_CAMPAIGN',
          callbackUrl: `${window.location.origin}/marketing/checkout`,
        });

        if (!payment?.authorizationUrl) {
          throw new Error('Failed to initiate Flutterwave payment');
        }

        window.location.href = payment.authorizationUrl;
      }
    } catch {
      alert('Failed to launch campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalBudget = parseInt(budget) || DIGITAL_ADS_MINIMUM.price;
  const days = parseInt(duration) || 1;
  const estimatedReach = Math.floor(totalBudget * 15);
  const requiredCredits = computeAdCredits(totalBudget);

  if (success) {
    return (
      <div className="space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300">
          <ArrowLeft className="w-4 h-4" /> Back to Marketing
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Launched!</h2>
          <p className="text-gray-500 mb-2">
            Your ad campaign on {selectedPlatforms.join(', ')} is now being set up.
          </p>
          <p className="text-gray-500 mb-6">
            Total budget: ₦{parseInt(budget).toLocaleString()} over {duration} days.
          </p>
          <button onClick={onBack} className="bg-amber-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600">
            Back to Marketing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => step === 1 ? onBack() : setStep(s => s - 1)}
          className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300">
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Back to Marketing' : 'Previous Step'}
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn('h-2 w-12 rounded-full transition-all', s <= step ? 'bg-amber-500' : 'bg-gray-200')} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">

        {/* Step 1 – Platforms */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Select Ad Platform(s)</h2>
              <p className="text-gray-500">Choose where you want to run your ads</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {adPlatforms.map(p => (
                <div key={p.id} onClick={() => togglePlatform(p.id)}
                  className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selectedPlatforms.includes(p.id) ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300')}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{p.icon}</span>
                    {selectedPlatforms.includes(p.id) && <CheckCircle2 className="w-6 h-6 text-amber-500" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.description}</p>
                  <p className="text-xs text-gray-400">Min. Budget: ₦{p.minBudget.toLocaleString()} • {p.reach}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} disabled={selectedPlatforms.length === 0}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-amber-600">
                Continue to Budget <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 – Budget */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Set Budget & Duration</h2>
              <p className="text-gray-500">Define your advertising budget and campaign length</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Objective</label>
                  <div className="space-y-2">
                    {[
                      { val: 'Awareness', desc: 'Maximize reach and impressions' },
                      { val: 'Consideration', desc: 'Drive engagement and traffic' },
                      { val: 'Conversions', desc: 'Generate leads and inquiries' },
                    ].map(o => (
                      <label key={o.val} className={cn('flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all', adObjective === o.val ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300')}>
                        <input type="radio" name="objective" checked={adObjective === o.val} onChange={() => setAdObjective(o.val)} className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="font-medium text-gray-900">{o.val}</p>
                          <p className="text-xs text-gray-500">{o.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Total Budget (₦)</label>
                  <input type="number" value={budget} onChange={e => setBudget(e.target.value)} min="30000" step="5000"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                  <p className="text-xs text-gray-400 mt-1">Minimum: ₦30,000 or 30 credits</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Duration (days)</label>
                  <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" max="90"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                  <p className="text-xs text-gray-400 mt-1">Daily budget: ₦{Math.floor(totalBudget / days).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Estimated Results</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Reach</p>
                      <p className="text-3xl font-bold text-amber-600">{estimatedReach.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">people</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Clicks</p>
                      <p className="text-2xl font-bold text-gray-900">{Math.floor(estimatedReach * 0.05).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">at 5% CTR</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expected Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{Math.floor(estimatedReach * 0.05 * 0.1)}</p>
                      <p className="text-xs text-gray-500">at 10% conversion</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">💡 Pro Tip</p>
                  <p className="text-xs text-blue-700">Campaigns running 7–14 days typically see the best performance as the algorithm optimizes delivery.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={!adObjective || !budget || !duration}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-amber-600">
                Continue to Targeting <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Targeting */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Target Audience</h2>
              <p className="text-gray-500">Define who should see your ads</p>
            </div>
            <div className="space-y-6">
              {targetingOptions.map(cat => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id}>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-amber-500" />{cat.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.options.map(opt => (
                        <button key={opt} onClick={() => toggleTargeting(cat.id, opt)}
                          className={cn('px-4 py-2 rounded-lg border-2 text-sm transition-all',
                            targeting[cat.id]?.includes(opt) ? 'border-amber-500 bg-amber-50 text-amber-700 font-medium' : 'border-gray-200 text-gray-700 hover:border-gray-300')}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Audience Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Selected Criteria:</p>
                  <div className="space-y-1">
                    {Object.entries(targeting).map(([key, vals]) =>
                      vals.length > 0 && (
                        <div key={key}>
                          <p className="text-sm font-medium text-gray-900 capitalize">{key}:</p>
                          <p className="text-sm text-gray-600">{vals.join(', ')}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Estimated Audience Size</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {Object.values(targeting).flat().length > 0
                      ? `${Math.floor(estimatedReach * 0.6).toLocaleString()} – ${estimatedReach.toLocaleString()}`
                      : estimatedReach.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">people in your target audience</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(4)}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600">
                Continue to Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 – Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Review & Launch Campaign</h2>
              <p className="text-gray-500">Review your ad campaign details before launching</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Campaign Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Platforms:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPlatforms.map(id => {
                        const p = adPlatforms.find(x => x.id === id);
                        return <span key={id} className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">{p?.name}</span>;
                      })}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">Objective:</p>
                    <p className="font-medium text-gray-900">{adObjective}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">Budget & Duration:</p>
                    <p className="text-2xl font-bold text-amber-600">₦{totalBudget.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{duration} days • ₦{Math.floor(totalBudget / days).toLocaleString()}/day</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">Start Date:</p>
                    <p className="font-medium text-gray-900">{startDate ? new Date(startDate).toLocaleDateString('en-NG', { dateStyle: 'long' }) : 'Immediately'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Expected Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm text-gray-500">Estimated Reach</p><p className="text-2xl font-bold text-gray-900">{estimatedReach.toLocaleString()}</p></div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm text-gray-500">Expected Clicks</p><p className="text-2xl font-bold text-gray-900">{Math.floor(estimatedReach * 0.05).toLocaleString()}</p></div>
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm text-gray-500">Potential Leads</p><p className="text-2xl font-bold text-gray-900">{Math.floor(estimatedReach * 0.05 * 0.1)}</p></div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Next Steps</p>
                      <ul className="text-xs text-blue-700 space-y-0.5">
                        <li>• Ad creative auto-generated from your property</li>
                        <li>• Daily performance reports via email</li>
                        <li>• Campaign can be paused anytime</li>
                        <li>• Unused budget will be refunded</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Payment Method</p>
                  <div className="space-y-2">
                    <label className={cn('flex items-start gap-3 p-3 border rounded-lg cursor-pointer', paymentMethod === 'credits' ? 'border-amber-500 bg-amber-50' : 'border-gray-200')}>
                      <input type="radio" checked={paymentMethod === 'credits'} onChange={() => setPaymentMethod('credits')} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Use Credits</p>
                        <p className="text-xs text-gray-500">{requiredCredits} credits required</p>
                      </div>
                    </label>
                    <label className={cn('flex items-start gap-3 p-3 border rounded-lg cursor-pointer', paymentMethod === 'flutterwave' ? 'border-amber-500 bg-amber-50' : 'border-gray-200')}>
                      <input type="radio" checked={paymentMethod === 'flutterwave'} onChange={() => setPaymentMethod('flutterwave')} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pay via Flutterwave</p>
                        <p className="text-xs text-gray-500">₦{totalBudget.toLocaleString()} checkout</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleLaunch} disabled={submitting}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
                <Megaphone className="w-4 h-4" /> {submitting ? 'Launching...' : 'Launch Campaign'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
