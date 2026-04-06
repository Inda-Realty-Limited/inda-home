import { useState } from 'react';
import { ArrowLeft, Camera, Video, Calendar, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Home, CreditCard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketingService } from '@/api/marketing';

type ServiceType = 'photography' | 'videography' | '3d-tour';

interface Props {
  onBack: () => void;
  serviceType: ServiceType;
}

const serviceDetails: Record<ServiceType, { title: string; icon: any; credits: number; packages: { id: string; name: string; price: number; features: string[] }[] }> = {
  photography: {
    title: 'Professional Photography', icon: Camera, credits: 10,
    packages: [
      { id: 'basic', name: 'Basic Package', price: 10000, features: ['10–15 HDR photos', 'Same-day editing', 'Digital delivery'] },
      { id: 'standard', name: 'Standard Package', price: 18000, features: ['20–25 HDR photos', 'Twilight shots', 'Same-day editing', 'Digital delivery'] },
      { id: 'premium', name: 'Premium Package', price: 30000, features: ['30–40 HDR photos', 'Aerial drone shots', 'Twilight shots', 'Rush delivery', 'Print-ready files'] },
    ],
  },
  videography: {
    title: 'Professional Videography', icon: Video, credits: 20,
    packages: [
      { id: 'basic', name: 'Basic Video', price: 20000, features: ['1–2 min property tour', '4K quality', 'Background music', '2-day delivery'] },
      { id: 'standard', name: 'Cinematic Tour', price: 35000, features: ['2–3 min cinematic tour', '4K quality', 'Drone footage', 'Professional editing', 'Next-day delivery'] },
      { id: 'premium', name: 'Premium Package', price: 55000, features: ['3–5 min feature video', '4K quality', 'Aerial cinematography', 'Agent intro', 'Same-day delivery'] },
    ],
  },
  '3d-tour': {
    title: '3D Virtual Tour', icon: Video, credits: 15,
    packages: [
      { id: 'basic', name: 'Basic 3D Tour', price: 15000, features: ['Up to 1500 sqft', '360° walkthrough', 'Floor plan', '2-day delivery'] },
      { id: 'standard', name: 'Standard 3D Tour', price: 25000, features: ['Up to 3000 sqft', '360° walkthrough', 'Floor plan', 'Branded intro', 'Next-day delivery'] },
      { id: 'premium', name: 'Premium 3D Tour', price: 40000, features: ['Unlimited size', '360° walkthrough', '4K quality', 'Floor plan', 'Measurement tools', 'Same-day delivery'] },
    ],
  },
};

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const propertyTypes = ['Apartment/Flat', 'Detached House', 'Duplex', 'Penthouse', 'Commercial Property', 'Land/Plot'];

// Simple inline payment modal
function PaymentModal({ price, serviceTitle, packageName, credits, onClose, onSuccess }: {
  price: number; serviceTitle: string; packageName: string; credits: number;
  onClose: () => void; onSuccess: (method: 'credits' | 'bank' | 'card') => void;
}) {
  const [method, setMethod] = useState<'credits' | 'bank' | 'card'>('credits');
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Confirm Booking</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="font-semibold text-gray-900">{serviceTitle}</p>
          <p className="text-sm text-gray-500">{packageName}</p>
          <p className="text-2xl font-bold text-inda-teal mt-1">₦{price.toLocaleString()}</p>
        </div>
        <div className="space-y-2 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
          {[
            { id: 'credits', label: `Use Marketing Credits (${credits} credits)`, sub: 'Deducted from your monthly allocation' },
            { id: 'bank', label: 'Bank Transfer', sub: 'Pay via verified Inda payment channel' },
            { id: 'card', label: 'Card Payment (Paystack)', sub: 'Pay instantly with debit/credit card' },
          ].map(m => (
            <label key={m.id} className={cn('flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all',
              method === m.id ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
              <input type="radio" name="payment" checked={method === m.id} onChange={() => setMethod(m.id as any)} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-500">{m.sub}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300">Cancel</button>
          <button onClick={() => onSuccess(method)} className="flex-1 bg-inda-teal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700">
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

export function ServiceBookingFlow({ onBack, serviceType }: Props) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const service = serviceDetails[serviceType];
  const ServiceIcon = service.icon;
  const selectedPkg = service.packages.find(p => p.id === selectedPackage);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-2">{service.title} — {selectedPkg?.name}</p>
          <p className="text-gray-500 mb-6">
            Scheduled for {new Date(bookingDate).toLocaleDateString('en-NG', { dateStyle: 'long' })} at {bookingTime}
          </p>
          <p className="text-sm text-gray-400 mb-6">You'll receive a confirmation via SMS and email. The professional will call 24 hours before.</p>
          <button onClick={onBack} className="bg-inda-teal text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700">
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
          {[1, 2, 3].map(s => (
            <div key={s} className={cn('h-2 w-12 rounded-full transition-all', s <= step ? 'bg-inda-teal' : 'bg-gray-200')} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">

        {/* Step 1 – Package */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                <ServiceIcon className="w-6 h-6 text-inda-teal" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                <p className="text-gray-500">Select a package that fits your needs</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {service.packages.map(pkg => (
                <div key={pkg.id} onClick={() => setSelectedPackage(pkg.id)}
                  className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selectedPackage === pkg.id ? 'border-inda-teal bg-inda-teal/5 ring-2 ring-inda-teal/20' : 'border-gray-200 hover:border-gray-300')}>
                  <h3 className="font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-inda-teal mb-4">₦{pkg.price.toLocaleString()}</p>
                  <ul className="space-y-2">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-inda-teal mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-1">📋 What to Expect</p>
              <ul className="text-xs text-blue-700 space-y-0.5">
                <li>• Professional arrives on time</li>
                <li>• Session typically lasts 45–90 minutes</li>
                <li>• Property should be clean and well-lit</li>
                <li>• Final files delivered via secure link</li>
              </ul>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} disabled={!selectedPackage}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                Continue to Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 – Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Property & Contact Details</h2>
              <p className="text-gray-500">Tell us about the property and how to reach you</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Property Address *</label>
                  <input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)}
                    placeholder="Enter full property address..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Property Type *</label>
                  <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30 bg-white">
                    <option value="">Select property type...</option>
                    {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Name *</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your full name..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Phone *</label>
                  <input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                    placeholder="+234 xxx xxx xxxx"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Date *</label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Time *</label>
                  <select value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30 bg-white">
                    {timeSlots.map(t => <option key={t} value={t}>{parseInt(t) > 12 ? `${parseInt(t) - 12}:00 PM` : `${parseInt(t)}:00 ${parseInt(t) === 12 ? 'PM' : 'AM'}`}{t === '18:00' ? ' (Twilight)' : ''}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Best lighting: 10 AM – 2 PM or 6 PM (twilight)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Special Requests (Optional)</label>
                  <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} rows={5}
                    placeholder="Any specific shots or requirements..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={!propertyAddress || !propertyType || !contactName || !contactPhone || !bookingDate}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                Continue to Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Confirm Booking</h2>
              <p className="text-gray-500">Review your booking details before confirming</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-inda-teal/5 border border-inda-teal/30 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Package Details</h3>
                {selectedPkg && (
                  <>
                    <p className="font-semibold text-lg text-gray-900 mb-1">{selectedPkg.name}</p>
                    <p className="text-3xl font-bold text-inda-teal mb-4">₦{selectedPkg.price.toLocaleString()}</p>
                    <ul className="space-y-2">
                      {selectedPkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-inda-teal mt-0.5" />{f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Property</p>
                        <p className="font-medium text-gray-900">{propertyAddress}</p>
                        <p className="text-sm text-gray-500">{propertyType}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Date & Time</p>
                        <p className="font-medium text-gray-900">{new Date(bookingDate).toLocaleDateString('en-NG', { dateStyle: 'long' })}</p>
                        <p className="text-sm text-gray-500">{bookingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="font-medium text-gray-900">{contactName}</p>
                        <p className="text-sm text-gray-500">{contactPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 mb-1">Next Steps</p>
                      <ul className="text-xs text-green-700 space-y-0.5">
                        <li>• Confirmation via SMS/Email</li>
                        <li>• Professional will call 24 hours before</li>
                        <li>• Payment due after delivery</li>
                        <li>• Can reschedule up to 24 hours before</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setPaymentOpen(true)}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700">
                <CreditCard className="w-4 h-4" /> Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {paymentOpen && selectedPkg && (
        <PaymentModal
          serviceTitle={service.title}
          packageName={selectedPkg.name}
          price={selectedPkg.price}
          credits={service.credits}
          onClose={() => setPaymentOpen(false)}
          onSuccess={async (method) => {
            setPaymentOpen(false);
            setSubmitting(true);
            try {
              await MarketingService.createBooking({
                serviceType,
                packageId: selectedPackage!,
                propertyAddress,
                propertyType,
                contactName,
                contactPhone,
                date: bookingDate,
                time: bookingTime,
                specialRequests: specialRequests || undefined,
                paymentMethod: method,
              });
              setSuccess(true);
            } catch {
              alert('Booking failed. Please try again.');
            } finally {
              setSubmitting(false);
            }
          }}
        />
      )}
      {submitting && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-8 h-8 border-2 border-inda-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Confirming your booking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
