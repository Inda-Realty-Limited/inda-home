import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User, Bell, Shield, Mail, Link2, Palette,
  Image, Upload, Eye, CheckCircle2,
  Instagram, Facebook, Youtube, Globe, Check,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, getNotificationPreferences, updateNotificationPreferences } from '@/api/profile';
import { UploadService } from '@/api/upload';
import apiClient from '@/api';
import Input from '@/components/base/Input';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfileForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  company: string;
  role: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-inda-gray p-6', className)}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-inda-teal" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-gray-700 mb-2">{children}</label>;
}

function SaveButton({
  onClick,
  loading,
  children = 'Save Changes',
}: {
  onClick: () => void;
  loading?: boolean;
  children?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 px-6 py-2.5 bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? 'Saving…' : children}
    </button>
  );
}

function Toast({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        'mb-6 p-4 rounded-lg flex items-center justify-between shadow-sm',
        type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200',
      )}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Shield className="w-4 h-4 text-red-600" />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100 font-bold ml-4">
        Dismiss
      </button>
    </div>
  );
}

// ── Watermark position state ──────────────────────────────────────────────────

const POSITIONS = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'] as const;

// ── Social platforms config ───────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Connect to post stories and feed content',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: Instagram,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect to run ads and post to your page',
    iconBg: 'bg-blue-600',
    icon: Facebook,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Connect to post videos and shorts',
    iconBg: 'bg-gray-900',
    icon: null,
    label: 'TT',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Connect to upload property video tours',
    iconBg: 'bg-red-600',
    icon: Youtube,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    description: 'Connect to post tweets and threads',
    iconBg: 'bg-gray-900',
    icon: Globe,
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Connect to run search and display ads',
    iconBg: 'bg-gradient-to-br from-blue-500 to-green-500',
    icon: null,
    label: 'G',
  },
];

// ── Main page component ───────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Profile form
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    company: '',
    role: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password form
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordToast, setPasswordToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Branding URLs (from profile)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [logoLightUrl, setLogoLightUrl] = useState<string | null>(null);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLogoLight, setUploadingLogoLight] = useState(false);
  const [uploadingLogoDark, setUploadingLogoDark] = useState(false);
  const [uploadingWatermark, setUploadingWatermark] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Branding preferences
  const [wmPosition, setWmPosition] = useState<string>('Bottom Right');
  const [wmSize, setWmSize] = useState(15);
  const [wmOpacity, setWmOpacity] = useState(80);
  const [contactOverlay, setContactOverlay] = useState({
    phone: true,
    whatsapp: true,
    email: false,
    company: true,
  });

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState({
    whatsapp: true,
    emailReports: true,
    sms: false,
    marketing: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [notifToast, setNotifToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Social connected state (UI-only)
  const [connected, setConnected] = useState<Record<string, boolean>>({ facebook: true });

  // ── Load profile ────────────────────────────────────────────────────────────

  useEffect(() => {
    const localUser: any = user;
    if (localUser) {
      setForm((prev) => ({
        ...prev,
        firstName: localUser.firstName || '',
        lastName: localUser.lastName || '',
        phoneNumber: localUser.phoneNumber || '',
        email: localUser.email || '',
        company: localUser.company || localUser.companyName || '',
        role: localUser.role || '',
      }));
    }

    (async () => {
      if (!localUser) return;
      setLoading(true);
      try {
        const [result, prefs] = await Promise.all([
          getProfile(),
          getNotificationPreferences(),
        ]);
        const u = result.data || result.user || result;
        setForm((prev) => ({
          ...prev,
          firstName: u.firstName || prev.firstName,
          lastName: u.lastName || prev.lastName,
          phoneNumber: u.phoneNumber || prev.phoneNumber,
          email: u.email || prev.email,
          company: u.company || u.companyName || prev.company,
          role: u.role || prev.role,
        }));
        if (prefs && Object.keys(prefs).length > 0) {
          setNotifPrefs((prev) => ({ ...prev, ...prefs }));
        }
        if (u.avatarUrl) setAvatarUrl(u.avatarUrl);
        if (u.logoLightUrl) setLogoLightUrl(u.logoLightUrl);
        if (u.logoDarkUrl) setLogoDarkUrl(u.logoDarkUrl);
        if (u.watermarkUrl) setWatermarkUrl(u.watermarkUrl);
      } catch {
        // leave form as-is
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    const localUser: any = user;
    if (!localUser) return;
    setSavingProfile(true);
    setProfileToast(null);
    try {
      const result = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        company: form.company,
      });
      const updated = result.data || result.user || {};
      setUser(updated, localUser.token);
      setProfileToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileToast({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to save. Please try again.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.next || !passwords.confirm || !passwords.current) {
      setPasswordToast({ type: 'error', message: 'Please fill in all password fields.' });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setSavingPassword(true);
    setPasswordToast(null);
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: '', next: '', confirm: '' });
      setPasswordToast({ type: 'success', message: 'Password updated successfully!' });
    } catch (err: any) {
      setPasswordToast({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const result = await UploadService.avatar(file);
      setAvatarUrl(result?.avatarUrl ?? result);
    } catch (err: any) {
      setProfileToast({ type: 'error', message: err?.response?.data?.message || 'Avatar upload failed.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUploadLogoLight = async (file: File) => {
    setUploadingLogoLight(true);
    try {
      const result = await UploadService.logoLight(file);
      setLogoLightUrl(result?.logoLightUrl ?? result);
    } catch { /* silently fail, UI can retry */ }
    finally { setUploadingLogoLight(false); }
  };

  const handleUploadLogoDark = async (file: File) => {
    setUploadingLogoDark(true);
    try {
      const result = await UploadService.logoDark(file);
      setLogoDarkUrl(result?.logoDarkUrl ?? result);
    } catch { /* silently fail */ }
    finally { setUploadingLogoDark(false); }
  };

  const handleUploadWatermark = async (file: File) => {
    setUploadingWatermark(true);
    try {
      const result = await UploadService.watermark(file);
      setWatermarkUrl(result?.watermarkUrl ?? result);
    } catch { /* silently fail */ }
    finally { setUploadingWatermark(false); }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifs(true);
    setNotifToast(null);
    try {
      await updateNotificationPreferences(notifPrefs);
      setNotifToast({ type: 'success', message: 'Notification preferences saved!' });
    } catch (err: any) {
      setNotifToast({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to save preferences.',
      });
    } finally {
      setSavingNotifs(false);
    }
  };

  const initials =
    (form.firstName?.[0] || '') + (form.lastName?.[0] || '') || 'U';

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-inda-teal to-[#3d8780] bg-clip-text text-transparent">
              Profile &amp; Settings
            </h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-inda-teal" />
            </div>
          )}

          {/* Profile Picture */}
          <SectionCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-inda-teal to-[#3d8780] flex items-center justify-center">
                    <span className="text-white text-2xl font-bold uppercase">{initials}</span>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 border border-inda-gray rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {uploadingAvatar ? 'Uploading…' : 'Change Photo'}
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 5MB</p>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => e.target.files?.[0] && handleUploadAvatar(e.target.files[0])}
                />
              </div>
            </div>
          </SectionCard>

          {/* Account Information */}
          <SectionCard>
            {profileToast && (
              <Toast type={profileToast.type} message={profileToast.message} onClose={() => setProfileToast(null)} />
            )}
            <SectionTitle icon={User} title="Account Information" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="Olu"
                    className="w-full"
                  />
                </div>
                <div>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Adeyemi"
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                  placeholder="+234 803 123 4567"
                  className="w-full"
                />
              </div>
              <div>
                <FieldLabel>Email Address</FieldLabel>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <FieldLabel>Company Name</FieldLabel>
                <Input
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Adeyemi Properties Ltd"
                  className="w-full"
                />
              </div>
            </div>
            <SaveButton onClick={handleSaveProfile} loading={savingProfile} />
          </SectionCard>

          {/* Branding & Marketing Assets */}
          <SectionCard>
            <SectionTitle icon={Palette} title="Branding & Marketing Assets" />
            <p className="text-sm text-gray-600 mb-6">
              Upload your logo and watermark to automatically brand all your marketing materials, social posts, emails, and ads.
            </p>

            {/* Primary Logo */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Primary Logo</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <LogoUploadBox
                  label="Logo (Light Backgrounds)"
                  description="Use dark/colored logo for white backgrounds"
                  bg="bg-gray-100"
                  iconColor="text-gray-400"
                  currentUrl={logoLightUrl}
                  uploading={uploadingLogoLight}
                  onFile={handleUploadLogoLight}
                />
                <LogoUploadBox
                  label="Logo (Dark Backgrounds)"
                  description="Use white/light logo for dark backgrounds"
                  bg="bg-gray-900"
                  iconColor="text-white"
                  currentUrl={logoDarkUrl}
                  uploading={uploadingLogoDark}
                  onFile={handleUploadLogoDark}
                />
              </div>
            </div>

            {/* Social Media Watermark */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Social Media Watermark</h4>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-inda-teal/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0 overflow-hidden">
                    {watermarkUrl ? (
                      <img src={watermarkUrl} alt="Watermark" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Image className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">Watermark Logo</p>
                    <p className="text-xs text-gray-500 mb-3">
                      This will appear on all your Instagram posts, reels, stories, Facebook content, and other social media.
                      Recommended size: 500×500px minimum
                    </p>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 border border-inda-teal text-inda-teal rounded-lg text-xs font-semibold hover:bg-inda-teal/5 transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingWatermark ? 'Uploading…' : watermarkUrl ? 'Replace' : 'Upload Watermark'}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={uploadingWatermark}
                          onChange={(e) => e.target.files?.[0] && handleUploadWatermark(e.target.files[0])}
                        />
                      </label>
                      {watermarkUrl && (
                        <a
                          href={watermarkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-inda-gray text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark Preferences */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-900">Watermark Preferences</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {POSITIONS.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setWmPosition(pos)}
                      className={cn(
                        'px-3 py-2 text-xs font-medium rounded-lg border transition-all',
                        wmPosition === pos
                          ? 'bg-inda-teal text-white border-inda-teal'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-inda-teal/50',
                      )}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={30}
                    value={wmSize}
                    onChange={(e) => setWmSize(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-inda-teal"
                  />
                  <span className="text-sm font-medium text-gray-700 w-10 text-right">{wmSize}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Percentage of image width</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={wmOpacity}
                    onChange={(e) => setWmOpacity(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-inda-teal"
                  />
                  <span className="text-sm font-medium text-gray-700 w-10 text-right">{wmOpacity}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Watermark transparency level</p>
              </div>
            </div>

            {/* Contact Info Overlay */}
            <div className="bg-gray-50 rounded-lg p-5 mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Contact Information Overlay</h4>
              <p className="text-xs text-gray-600 mb-4">
                Add your contact details to the bottom of social media posts (optional)
              </p>
              <div className="space-y-3">
                {(
                  [
                    { key: 'phone', label: 'Include phone number on posts' },
                    { key: 'whatsapp', label: 'Include WhatsApp number on posts' },
                    { key: 'email', label: 'Include email address on posts' },
                    { key: 'company', label: 'Include company name on posts' },
                  ] as { key: keyof typeof contactOverlay; label: string }[]
                ).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactOverlay[key]}
                      onChange={() =>
                        setContactOverlay((p) => ({ ...p, [key]: !p[key] }))
                      }
                      className="w-4 h-4 rounded border-gray-300 accent-inda-teal"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-inda-teal/5 border border-inda-teal/20 rounded-lg p-5 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Eye className="w-5 h-5 text-inda-teal mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Preview Your Branding</h4>
                  <p className="text-xs text-gray-600">
                    Your watermark and contact info will automatically appear on all marketing materials created in the Marketing Center
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    Property Image Preview
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    {logoLightUrl ? (
                      <img src={logoLightUrl} alt="Logo" className="h-6 object-contain" />
                    ) : (
                      <p className="text-xs font-bold text-gray-900">YOUR LOGO</p>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-xs text-white font-medium">
                      {form.firstName} {form.lastName}
                    </p>
                    <p className="text-xs text-white/80">{form.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="px-6 py-2.5 bg-gradient-to-r from-inda-teal to-[#3d8780] hover:from-[#3d8780] hover:to-[#2d6760] text-white text-sm font-semibold rounded-lg transition-colors">
              Save Branding Settings
            </button>
          </SectionCard>

          {/* Connected Social Platforms */}
          <SectionCard>
            <SectionTitle icon={Link2} title="Connected Social Platforms" />
            <p className="text-sm text-gray-600 mb-6">
              Connect your social media accounts to easily push content and ads directly from the Marketing Center.
            </p>

            <div className="space-y-3">
              {SOCIAL_PLATFORMS.map((platform) => {
                const isConnected = !!connected[platform.id];
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 border border-inda-gray rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          platform.iconBg,
                        )}
                      >
                        {platform.icon ? (
                          <platform.icon className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-bold text-sm">{platform.label}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{platform.name}</p>
                        <p className="text-xs text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {isConnected ? (
                        <>
                          <span className="text-xs text-green-600 font-medium hidden sm:flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected
                          </span>
                          <button
                            onClick={() => setConnected((p) => ({ ...p, [platform.id]: false }))}
                            className="px-3 py-1.5 border border-red-400 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-gray-500 hidden sm:block">Not connected</span>
                          <button
                            onClick={() => setConnected((p) => ({ ...p, [platform.id]: true }))}
                            className="px-3 py-1.5 border border-inda-teal text-inda-teal rounded-lg text-xs font-semibold hover:bg-inda-teal/5 transition-colors"
                          >
                            Connect
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-inda-teal/5 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-inda-teal mt-0.5 flex-shrink-0" />
                <span>
                  Your credentials are encrypted and secure. We only request the minimum permissions needed to post content on your behalf.
                </span>
              </p>
            </div>
          </SectionCard>

          {/* Notification Preferences */}
          <SectionCard>
            {notifToast && (
              <Toast type={notifToast.type} message={notifToast.message} onClose={() => setNotifToast(null)} />
            )}
            <SectionTitle icon={Bell} title="Notification Preferences" />
            <div className="space-y-4">
              {(
                [
                  { key: 'whatsapp', label: 'WhatsApp Notifications', desc: 'Get instant alerts for new leads and messages' },
                  { key: 'emailReports', label: 'Email Reports', desc: 'Weekly performance summaries and insights' },
                  { key: 'sms', label: 'SMS Alerts', desc: 'Critical notifications for hot leads and urgent actions' },
                  { key: 'marketing', label: 'Marketing Updates', desc: 'Tips, best practices, and new feature announcements' },
                ] as { key: keyof typeof notifPrefs; label: string; desc: string }[]
              ).map(({ key, label, desc }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPrefs[key]}
                    onChange={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    className="mt-1 w-4 h-4 rounded border-gray-300 accent-inda-teal"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <SaveButton onClick={handleSaveNotifications} loading={savingNotifs}>Save Preferences</SaveButton>
          </SectionCard>

          {/* Security */}
          <SectionCard>
            {passwordToast && (
              <Toast type={passwordToast.type} message={passwordToast.message} onClose={() => setPasswordToast(null)} />
            )}
            <SectionTitle icon={Shield} title="Security" />
            <div className="space-y-4">
              <div>
                <FieldLabel>Current Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <FieldLabel>New Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <FieldLabel>Confirm New Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
            <SaveButton onClick={handleChangePassword} loading={savingPassword}>Update Password</SaveButton>
          </SectionCard>

          {/* Need Help */}
          <div className="bg-inda-teal/10 border border-inda-teal/30 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Our support team is here to help. Contact us via WhatsApp, email, or visit the Support Hub.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:support@investinda.com"
                className="flex items-center gap-2 px-4 py-2 border border-inda-gray rounded-lg text-sm font-semibold text-gray-700 hover:bg-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <Link
                href="/support"
                className="px-4 py-2 border border-inda-gray rounded-lg text-sm font-semibold text-gray-700 hover:bg-white transition-colors"
              >
                Visit Support Hub
              </Link>
            </div>
          </div>
        </div>

      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ── Logo upload box ───────────────────────────────────────────────────────────

function LogoUploadBox({
  label,
  description,
  bg,
  iconColor,
  currentUrl,
  uploading,
  onFile,
}: {
  label: string;
  description: string;
  bg: string;
  iconColor: string;
  currentUrl?: string | null;
  uploading?: boolean;
  onFile: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-inda-teal/50 transition-colors">
      <div className="text-center">
        <div className={cn('w-16 h-16 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden', bg)}>
          {currentUrl ? (
            <img src={currentUrl} alt={label} className="w-full h-full object-contain p-1" />
          ) : (
            <Image className={cn('w-8 h-8', iconColor)} />
          )}
        </div>
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        <button
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-inda-teal text-inda-teal rounded-lg text-xs font-semibold hover:bg-inda-teal/5 transition-colors mx-auto disabled:opacity-60"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? 'Uploading…' : currentUrl ? 'Replace Logo' : 'Upload Logo'}
        </button>
        <p className="text-xs text-gray-500 mt-2">PNG with transparent background recommended</p>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
