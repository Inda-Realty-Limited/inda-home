import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Users,
  Send,
  Calendar,
  Eye,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Link as LinkIcon,
  Search,
  Loader2,
  Unlink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CanvaDesign,
  ContactList,
  CreateEmailCampaignPayload,
  MarketingService,
} from '@/api/marketing';
import Modal from '@/components/inc/Modal';
import { useToast } from '@/components/ToastProvider';

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
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [uploadedRecipients, setUploadedRecipients] = useState<string[]>([]);
  const [manualRecipients, setManualRecipients] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showCanvaModal, setShowCanvaModal] = useState(false);

  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [listsLoading, setListsLoading] = useState(false);

  const [canvaConnected, setCanvaConnected] = useState(false);
  const [canvaLoading, setCanvaLoading] = useState(false);
  const [canvaDesigns, setCanvaDesigns] = useState<CanvaDesign[]>([]);
  const [canvaQuery, setCanvaQuery] = useState('');
  const [canvaSearching, setCanvaSearching] = useState(false);
  const [importingDesignId, setImportingDesignId] = useState<string | null>(null);
  const [importedCanvaTemplateName, setImportedCanvaTemplateName] = useState('');

  useEffect(() => {
    setCanvaLoading(true);
    MarketingService.getCanvaStatus()
      .then((status) => setCanvaConnected(Boolean(status.connected)))
      .catch(() => setCanvaConnected(false))
      .finally(() => setCanvaLoading(false));
  }, []);

  useEffect(() => {
    if (step === 2) {
      setListsLoading(true);
      MarketingService.getContactLists()
        .then(setContactLists)
        .catch(() => setContactLists([]))
        .finally(() => setListsLoading(false));
    }
  }, [step]);

  const totalRecipients = useMemo(
    () => contactLists
      .filter((list) => selectedLists.includes(list.id))
      .reduce((sum, list) => sum + list.count, 0) + uploadedRecipients.length,
    [contactLists, selectedLists, uploadedRecipients],
  );

  const selectedTemplateLabel = importedCanvaTemplateName
    || emailTemplates.find((template) => template.id === selectedTemplate)?.name
    || 'No template selected';

  const bodyReady = Boolean(emailBody.trim() || htmlBody.trim());

  const toggleList = (id: string) =>
    setSelectedLists((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));

  const normalizeEmails = (values: string[]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter((value) => emailRegex.test(value))));
  };

  const loadCanvaDesigns = async (query?: string) => {
    setCanvaSearching(true);
    try {
      const designs = await MarketingService.listCanvaDesigns(query);
      setCanvaDesigns(designs);
    } catch {
      toast.showToast('Failed to load Canva designs.', 3000, 'error');
    } finally {
      setCanvaSearching(false);
    }
  };

  const openCanvaBrowser = async () => {
    setShowCanvaModal(true);
    if (canvaDesigns.length === 0) {
      await loadCanvaDesigns();
    }
  };

  const handleConnectCanva = async () => {
    try {
      const redirectUri = `${window.location.origin}/marketing/canva/callback`;
      const response = await MarketingService.getCanvaAuthUrl({ redirectUri });

      window.location.assign(response.url);
    } catch {
      toast.showToast('Failed to start Canva connection.', 3000, 'error');
    }
  };

  const handleDisconnectCanva = async () => {
    try {
      await MarketingService.disconnectCanva();
      setCanvaConnected(false);
      setCanvaDesigns([]);
      toast.showToast('Canva disconnected.', 2500, 'success');
    } catch {
      toast.showToast('Failed to disconnect Canva.', 3000, 'error');
    }
  };

  const handleImportCanvaDesign = async (designId: string) => {
    setImportingDesignId(designId);
    try {
      const imported = await MarketingService.importCanvaEmail(designId);
      setSubject(imported.subject);
      setPreheader(imported.preheader);
      setHtmlBody(imported.htmlBody);
      setEmailBody('');
      setImportedCanvaTemplateName(imported.templateName);
      setSelectedTemplate(`canva:${designId}`);
      setShowCanvaModal(false);
      toast.showToast('Canva template imported.', 2500, 'success');
    } catch {
      toast.showToast('Failed to import Canva template.', 3000, 'error');
    } finally {
      setImportingDesignId(null);
    }
  };

  const generateAI = async () => {
    if (!selectedTemplate) return;

    setGeneratingAI(true);
    try {
      const generated = await MarketingService.generateEmailCampaignCopy({
        templateId: selectedTemplate,
        recipientListIds: selectedLists,
        customRecipients: uploadedRecipients,
      });
      setSubject(generated.subject);
      setPreheader(generated.preheader);
      setEmailBody(generated.body);
      setHtmlBody('');
      setImportedCanvaTemplateName('');
    } catch {
      toast.showToast('Failed to generate email copy. Please try again.', 3000, 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSend = async () => {
    setSubmitting(true);
    try {
      const payload: CreateEmailCampaignPayload = {
        templateId: selectedTemplate!,
        recipientListIds: selectedLists,
        customRecipients: uploadedRecipients,
        subject,
        preheader,
        body: emailBody || 'Canva email template content',
        htmlBody: htmlBody || undefined,
        scheduleDate: scheduleDate || undefined,
        scheduleTime: scheduleTime || undefined,
      };
      await MarketingService.createEmailCampaign(payload);
      setSuccess(true);
    } catch {
      toast.showToast('Failed to send campaign. Please try again.', 3000, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendTest = async () => {
    if (!selectedTemplate || !subject || !bodyReady) return;

    setSendingTest(true);
    try {
      await MarketingService.sendTestEmailCampaign({
        templateId: selectedTemplate,
        subject,
        preheader,
        body: emailBody || 'Canva email template content',
        htmlBody: htmlBody || undefined,
      });
      toast.showToast('Test email sent to your account email address.', 3000, 'success');
    } catch {
      toast.showToast('Failed to send test email. Please try again.', 3000, 'error');
    } finally {
      setSendingTest(false);
    }
  };

  const handleContactFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = normalizeEmails(text.split(/[\n,\r;\t ]+/));
    setUploadedRecipients((prev) => Array.from(new Set([...prev, ...parsed])));
    event.target.value = '';
  };

  const handleAddManualRecipients = () => {
    const parsed = normalizeEmails(manualRecipients.split(/[\n,\r;\t ]+/));
    setUploadedRecipients((prev) => Array.from(new Set([...prev, ...parsed])));
    setManualRecipients('');
  };

  const removeUploadedRecipient = (email: string) => {
    setUploadedRecipients((prev) => prev.filter((item) => item !== email));
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
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} maxWidth="2xl">
        <div className="pr-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-inda-teal mb-2">Email Preview</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{subject || 'No subject'}</h2>
            <p className="text-sm text-gray-500">{preheader || 'No preview text added yet.'}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">From</p>
                  <p className="text-xs text-gray-500">Your brand via Inda</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{totalRecipients.toLocaleString()} recipients</p>
                  <p className="text-xs text-gray-500">
                    {scheduleDate ? `${scheduleDate} ${scheduleTime}` : 'Send immediately'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              {htmlBody ? (
                <div
                  className="min-h-60 overflow-auto rounded-xl border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: htmlBody }}
                />
              ) : (
                <>
                  {preheader ? (
                    <p className="text-xs text-gray-400 mb-4">{preheader}</p>
                  ) : null}
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {emailBody || 'Your email body preview will appear here once you add content.'}
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                You are receiving this email because you are a contact in this campaign.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCanvaModal} onClose={() => setShowCanvaModal(false)} maxWidth="4xl">
        <div className="pr-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-inda-teal mb-2">Canva Templates</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Import From Canva</h2>
              <p className="text-sm text-gray-500">Choose one of your Canva email designs and import the HTML into this campaign.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDisconnectCanva}
                className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:border-gray-300"
              >
                <Unlink className="w-4 h-4" /> Disconnect
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={canvaQuery}
                onChange={(event) => setCanvaQuery(event.target.value)}
                placeholder="Search your Canva designs"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
              />
            </div>
            <button
              type="button"
              onClick={() => loadCanvaDesigns(canvaQuery)}
              className="border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:border-gray-300"
            >
              Search
            </button>
          </div>

          {canvaSearching ? (
            <div className="py-16 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
              Loading Canva designs...
            </div>
          ) : canvaDesigns.length === 0 ? (
            <div className="py-16 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
              No Canva designs found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {canvaDesigns.map((design) => (
                <div key={design.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                    {design.thumbnailUrl ? (
                      <img src={design.thumbnailUrl} alt={design.title} className="w-full h-full object-cover" />
                    ) : (
                      <Mail className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{design.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Updated {new Date(design.updatedAt).toLocaleDateString()} {design.pageCount ? `• ${design.pageCount} page${design.pageCount > 1 ? 's' : ''}` : ''}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleImportCanvaDesign(design.id)}
                      disabled={importingDesignId === design.id}
                      className="w-full bg-inda-teal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50"
                    >
                      {importingDesignId === design.id ? 'Importing...' : 'Use This Design'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <div className="flex items-center justify-between">
        <button onClick={() => step === 1 ? onBack() : setStep((current) => current - 1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Back to Marketing' : 'Previous Step'}
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((value) => (
            <div key={value} className={cn('h-2 w-12 rounded-full transition-all', value <= step ? 'bg-inda-teal' : 'bg-gray-200')} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose Email Template</h2>
              <p className="text-gray-500">Select an Inda template or import one directly from Canva.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f5fbfa] p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Canva Email Templates</p>
                  <p className="text-sm text-gray-500">
                    Connect Canva, browse your designs, and import the email HTML directly into this campaign.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {canvaConnected ? (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-wide text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                        Connected
                      </span>
                      <button
                        type="button"
                        onClick={() => void openCanvaBrowser()}
                        className="flex items-center gap-2 bg-inda-teal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700"
                      >
                        <LinkIcon className="w-4 h-4" /> Browse Canva
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleConnectCanva()}
                      disabled={canvaLoading}
                      className="flex items-center gap-2 bg-inda-teal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50"
                    >
                      <LinkIcon className="w-4 h-4" /> {canvaLoading ? 'Checking...' : 'Connect Canva'}
                    </button>
                  )}
                </div>
              </div>

              {importedCanvaTemplateName ? (
                <div className="mt-4 border border-inda-teal/20 bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{importedCanvaTemplateName}</p>
                    <p className="text-xs text-gray-500">Imported from Canva and ready for preview, test send, and campaign send.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void openCanvaBrowser()}
                    className="text-sm font-medium text-inda-teal hover:text-teal-700"
                  >
                    Replace
                  </button>
                </div>
              ) : null}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {emailTemplates.map((template) => {
                const active = selectedTemplate === template.id;
                return (
                  <div key={template.id} onClick={() => {
                    setSelectedTemplate(template.id);
                    setImportedCanvaTemplateName('');
                    setHtmlBody('');
                  }}
                    className={cn('border-2 rounded-xl p-6 cursor-pointer transition-all', active ? 'border-inda-teal bg-inda-teal/5' : 'border-gray-200 hover:border-gray-300')}>
                    <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Mail className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                    {active && <CheckCircle2 className="w-5 h-5 text-inda-teal mt-2" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button onClick={() => setStep(2)} disabled={!selectedTemplate}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700 transition-colors">
                Continue to Recipients <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Select Recipients</h2>
              <p className="text-gray-500">Choose CRM lists or upload your own contact list.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="border border-dashed border-gray-300 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">Upload Contact List</p>
                <p className="text-xs text-gray-500 mb-3">Upload a CSV or TXT file containing email addresses.</p>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleContactFileUpload}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:border-0 file:rounded-lg file:bg-inda-teal/10 file:text-inda-teal"
                />
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">Paste Email Addresses</p>
                <p className="text-xs text-gray-500 mb-3">Separate with commas, spaces, or new lines.</p>
                <textarea
                  value={manualRecipients}
                  onChange={(event) => setManualRecipients(event.target.value)}
                  rows={4}
                  placeholder="name@example.com, another@example.com"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30"
                />
                <button
                  type="button"
                  onClick={handleAddManualRecipients}
                  className="mt-3 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:border-gray-300"
                >
                  Add Emails
                </button>
              </div>
            </div>

            {uploadedRecipients.length > 0 && (
              <div className="border border-inda-teal/20 bg-inda-teal/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Uploaded Contacts</p>
                  <p className="text-sm text-inda-teal font-semibold">{uploadedRecipients.length.toLocaleString()} emails</p>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {uploadedRecipients.map((email) => (
                    <button
                      key={email}
                      type="button"
                      onClick={() => removeUploadedRecipient(email)}
                      className="px-2 py-1 bg-white border border-gray-200 text-xs rounded-full hover:border-red-300 hover:text-red-600"
                    >
                      {email}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {listsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((value) => <div key={value} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : contactLists.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No contact lists found.</p>
                <p className="text-xs mt-1">Add contacts to your CRM to create email lists.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactLists.map((list) => (
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

            {(selectedLists.length > 0 || uploadedRecipients.length > 0) && (
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
              <button onClick={() => setStep(3)} disabled={selectedLists.length === 0 && uploadedRecipients.length === 0}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                Continue to Content <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Customize Email Content</h2>
              <p className="text-gray-500">Finalize the subject, preheader, and body your recipients will receive.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">{selectedTemplateLabel}</p>
              <p className="text-xs text-gray-500">
                {htmlBody
                  ? 'This campaign is using an imported Canva HTML email body.'
                  : 'This campaign is using an Inda template with editable body copy.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-900">Subject Line</label>
                  <button onClick={generateAI} disabled={generatingAI || !selectedTemplate} className="flex items-center gap-1 text-xs text-inda-teal border border-inda-teal/40 px-3 py-1.5 rounded-lg hover:bg-inda-teal/5 disabled:opacity-50">
                    <Sparkles className="w-3.5 h-3.5" /> {generatingAI ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <input value={subject} onChange={(event) => setSubject(event.target.value)}
                  placeholder="Enter email subject line..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                <p className="text-xs text-gray-400 mt-1">{subject.length}/100 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Preview Text</label>
                <input value={preheader} onChange={(event) => setPreheader(event.target.value)}
                  placeholder="This appears after the subject line..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
              </div>

              {htmlBody ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">Imported Canva Email Body</label>
                    <button
                      type="button"
                      onClick={() => void openCanvaBrowser()}
                      className="text-xs text-inda-teal font-medium hover:text-teal-700"
                    >
                      Re-import from Canva
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                      The design body is coming from Canva. You can still edit the subject line and preview text here.
                    </div>
                    <div
                      className="max-h-[28rem] overflow-auto"
                      dangerouslySetInnerHTML={{ __html: htmlBody }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Body</label>
                  <textarea value={emailBody} onChange={(event) => setEmailBody(event.target.value)} rows={12}
                    placeholder="Write your email content here..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
              )}

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
              <button onClick={() => setStep(4)} disabled={!subject || !bodyReady}
                className="flex items-center gap-2 bg-inda-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-teal-700">
                Continue to Schedule <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Review & Send</h2>
              <p className="text-gray-500">Review your campaign and choose when to send.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Send Date (Optional)</label>
                  <input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Send Time</label>
                  <input type="time" value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inda-teal/30" />
                </div>
                <div className="bg-inda-teal/10 border border-inda-teal/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Best Send Times</p>
                  <p className="text-xs text-gray-600">Tuesday to Thursday, 9–11 AM or 6–8 PM get the highest open rates.</p>
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
                    <p className="text-xs text-gray-500 mb-1">Template:</p>
                    <p className="text-sm font-medium text-gray-900">{selectedTemplateLabel}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Subject Line:</p>
                    <p className="text-sm font-medium text-gray-900">{subject || 'No subject'}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Lists:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLists.map((id) => {
                        const list = contactLists.find((item) => item.id === id);
                        return <span key={id} className="px-2 py-0.5 bg-inda-teal/10 text-inda-teal text-xs rounded-full">{list?.name}</span>;
                      })}
                      {uploadedRecipients.length > 0 && (
                        <span className="px-2 py-0.5 bg-inda-teal/10 text-inda-teal text-xs rounded-full">
                          Uploaded Contacts ({uploadedRecipients.length})
                        </span>
                      )}
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
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:border-gray-300"
                >
                  <Eye className="w-4 h-4" /> Preview Email
                </button>
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={sendingTest || !subject || !bodyReady}
                  className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:border-gray-300 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" /> {sendingTest ? 'Sending Test...' : 'Send Test Email'}
                </button>
                <button onClick={handleSend} disabled={submitting || !bodyReady}
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
