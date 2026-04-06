import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Users, Send, Calendar, Eye, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketingService, ContactList, CreateEmailCampaignPayload } from '@/api/marketing';

interface Props { onBack: () => void; }

const emailTemplates = [
  { id: 't1', name: 'Just Listed', category: 'listing' },
  { id: 't2', name: 'Open House', category: 'event' },
  { id: 't3', name: 'Market Update', category: 'newsletter' },
  { id: 't4', name: 'Price Reduction', category: 'listing' },
  { id: 't5', name: 'Sold Success', category: 'listing' },
  { id: 't6', name: 'Monthly Newsletter', category: 'newsletter' },
];

export function EmailCampaignFlow({ onBack }: Props) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Contact lists
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [listsLoading, setListsLoading] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setListsLoading(true);
      MarketingService.getContactLists()
        .then(setContactLists)
        .catch(() => setContactLists([]))
        .finally(() => setListsLoading(false));
    }
  }, [step]);

  const toggleList = (id: string) =>
    setSelectedLists(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const totalRecipients = contactLists
    .filter(l => selectedLists.includes(l.id))
    .reduce((s, l) => s + l.count, 0);

  const generateAI = () => {
    setSubject('🏡 New Listing Alert: Stunning Property Now Available');
    setPreheader("Don't miss out on this incredible property opportunity");
  };

  const handleSend = async () => {
    setSubmitting(true);
    try {
      const payload: CreateEmailCampaignPayload = {
        templateId: selectedTemplate!,
        recipientListIds: selectedLists,
        subject,
        preheader,
        body: emailBody,
        scheduleDate: scheduleDate || undefined,
        scheduleTime: scheduleTime || undefined,
      };
      await MarketingService.createEmailCampaign(payload);
      setSuccess(true);
    } catch {
      alert('Failed to send campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {scheduleDate ? 'Campaign Scheduled!' : 'Campaign Sent!'}
          </h2>
          <p className="text-gray-500 mb-6">
            {scheduleDate
              ? `Your campaign is scheduled to send to ${totalRecipients.toLocaleString()} recipients.`
              : `Your campaign has been sent to ${totalRecipients.toLocaleString()} recipients.`}
          </p>
          <button onClick={onBack} className="bg-inda-teal text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700">
            Back to Marketing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => step === 1 ? onBack() : setStep(s => s - 1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Back to Marketing' : 'Previous Step'}
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn('h-2 w-12 rounded-full transition-all', s <= step ? 'bg-inda-teal' : 'bg-gray-200')} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">

        {/* Step 1 – Template */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose Email Template</h2>
              <p className="text-gray-500">Select a pre-designed template to get started</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {emailTemplates.map(t => (
                <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
                  className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', selectedTemplate === t.id ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                  <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Mail className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{t.category}</p>
                  {selectedTemplate === t.id && <CheckCircle2 className="w-5 h-5 text-inda-teal mt-2" />}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} disabled={!selectedTemplate}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700 transition-colors">
                Continue to Recipients <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 – Recipients */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Select Recipients</h2>
              <p className="text-gray-500">Choose which contact lists to send to</p>
            </div>
            {listsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : contactLists.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No contact lists found.</p>
                <p className="text-xs mt-1">Add contacts to your CRM to create email lists.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactLists.map(list => (
                  <div key={list.id} onClick={() => toggleList(list.id)}
                    className={cn('border-2 rounded-xl p-4 cursor-pointer transition-all', selectedLists.includes(list.id) ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-inda-teal/10 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-inda-teal" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{list.name}</h3>
                          <p className="text-sm text-gray-500">{list.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{list.count.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">contacts</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedLists.length > 0 && (
              <div className="bg-inda-teal/10 border border-inda-teal/30 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-inda-teal text-lg">{totalRecipients.toLocaleString()}</span> total recipients selected
                </p>
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={selectedLists.length === 0}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                Continue to Content <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Content */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Customize Email Content</h2>
              <p className="text-gray-500">Write your subject line and email body</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-900">Subject Line</label>
                  <button onClick={generateAI} className="flex items-center gap-1 text-xs text-inda-teal border border-inda-teal/40 px-3 py-1.5 rounded-lg hover:bg-inda-teal/5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Generate
                  </button>
                </div>
                <input value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="Enter email subject line..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                <p className="text-xs text-gray-400 mt-1">{subject.length}/100 characters</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Preview Text</label>
                <input value={preheader} onChange={e => setPreheader(e.target.value)}
                  placeholder="This appears after the subject line..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Body</label>
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={12}
                  placeholder="Write your email content here..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">Template Includes</p>
                    <ul className="text-xs text-green-700 space-y-0.5">
                      <li>• Your logo and branding</li>
                      <li>• Property images and details</li>
                      <li>• Contact information</li>
                      <li>• Unsubscribe link (required)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(4)} disabled={!subject}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                Continue to Schedule <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 – Review & Send */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Review & Send</h2>
              <p className="text-gray-500">Review your campaign and choose when to send</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Send Date (Optional)</label>
                  <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Send Time</label>
                  <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div className="bg-inda-teal/10 border border-inda-teal/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1">📊 Best Send Times</p>
                  <p className="text-xs text-gray-600">Tuesday–Thursday, 9–11 AM or 6–8 PM get highest open rates</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Recipients:</p>
                    <p className="font-bold text-2xl text-inda-teal">{totalRecipients.toLocaleString()}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Subject Line:</p>
                    <p className="text-sm font-medium text-gray-900">{subject || 'No subject'}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Lists:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLists.map(id => {
                        const list = contactLists.find(l => l.id === id);
                        return <span key={id} className="px-2 py-0.5 bg-inda-teal/10 text-inda-teal text-xs rounded-full">{list?.name}</span>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:border-gray-300">
                  <Eye className="w-4 h-4" /> Preview Email
                </button>
                <button onClick={handleSend} disabled={submitting}
                  className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                  {scheduleDate
                    ? <><Calendar className="w-4 h-4" />{submitting ? 'Scheduling...' : 'Schedule Campaign'}</>
                    : <><Send className="w-4 h-4" />{submitting ? 'Sending...' : 'Send Now'}</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
