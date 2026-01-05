import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  FiActivity,
  FiThumbsUp,
  FiLock,
  FiSave,
  FiAlertCircle,
  FiInfo,
  FiUpload,
  FiShare2,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  getAdminSettings,
  updateSetting,
  resetSettings,
  clearCache,
} from '@/services/api/admin.api';
import { uploadImage } from '@/services/api/settings.api';
import { toast } from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

interface SettingSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SettingSection = ({
  title,
  description,
  icon: Icon,
  children,
}: SettingSectionProps) => (
  <div className="bg-[#2c2c2c] rounded-[2rem] border border-white/5 shadow-xl overflow-hidden mb-8">
    <div className="p-8 border-b border-white/5 bg-[#252525]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#49b99f]/10 rounded-xl">
          <Icon className="w-6 h-6 text-[#49b99f]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight uppercase">
            {title}
          </h3>
          <p className="text-sm text-light-grey opacity-60 font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
    <div className="p-8 space-y-8">{children}</div>
  </div>
);

const ToggleField = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-center justify-between group">
    <div className="flex-1">
      <h4 className="text-white font-bold tracking-tight mb-1 group-hover:text-[#49b99f] transition-colors">
        {label}
      </h4>
      <p className="text-xs text-light-grey opacity-60 leading-relaxed max-w-md">
        {description}
      </p>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      type="button"
      className={cn(
        'w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner p-0 border-0',
        enabled ? 'bg-[#49b99f]' : 'bg-[#1a1a1a] border border-white/10'
      )}>
      <div
        className={cn(
          'absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-md',
          enabled ? 'left-7' : 'left-1'
        )}
      />
    </button>
  </div>
);

const UploadBox = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadImage(file, 'branding');
      onChange(url);
      toast.success(`${label} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${label}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 flex-1">
      <label className="text-sm font-bold text-white group-hover:text-[#49b99f] transition-colors block">
        {label}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#49b99f]/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group hover:border-[#49b99f] transition-all cursor-pointer bg-[#49b99f]/5 overflow-hidden relative min-h-[140px]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {value ? (
          <img
            src={value}
            alt={label}
            className="max-h-20 w-auto object-contain"
          />
        ) : (
          <>
            <FiUpload className="w-6 h-6 text-[#49b99f] opacity-60 group-hover:opacity-100" />
            <span className="text-xs font-black uppercase tracking-widest text-[#49b99f]">
              {uploading ? 'Uploading...' : 'Upload'}
            </span>
          </>
        )}
      </div>
      <Input
        placeholder="Or enter the link directly"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 text-xs font-medium italic"
      />
    </div>
  );
};

const AdminSettings: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [settings, setSettings] = useState<any>({
    deals_enabled: 'true',
    coupons_enabled: 'true',
    maintenance_mode: 'false',
    hot_deal_threshold: '100',
    vote_cooldown: '24',
    who_can_vote: 'all',
    auto_approve_verified: 'true',
    public_registration: 'true',
    platform_name: 'Waferlee',
    contact_email: 'admin@waferlee.com',
    comment_moderation: 'false',
    support_email: 'support@waferlee.com',
    moderation_email: 'moderation@waferlee.com',
    logo_url: '/waferlee-logo.png',
    favicon_url: '/waferlee-logo.png',
    facebook_url: 'https://facebook.com',
    twitter_url: 'https://twitter.com',
    youtube_url: 'https://youtube.com',
    linkedin_url: 'https://linkedin.com',
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminSettings();
      const mapped = { ...settings };
      data.forEach((s: any) => {
        mapped[s.key] = s.value;
      });
      setSettings(mapped);
    } catch (error) {
      console.error('Failed to fetch admin settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const promises = Object.entries(settings).map(([key, value]) =>
        updateSetting(key, value)
      );
      await Promise.all(promises);
      toast.success('Settings saved successfully');
      await refreshSettings();
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetSettings();
      toast.success('Settings reset to factory defaults');
      await fetchSettings();
      await refreshSettings();
    } catch (error) {
      toast.error('Failed to reset settings');
    } finally {
      setLoading(false);
      setShowResetModal(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setLoading(true);
      await clearCache();
      toast.success('System cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear system cache');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            System Settings
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            Configure platform core behaviors and global rules
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl px-10 h-14 shadow-xl shadow-[#49b99f]/20 gap-3 border-0 transition-all hover:-translate-y-1">
          <FiSave className="w-6 h-6" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Areas */}
        <div className="lg:col-span-8 space-y-8">
          {/* Site Sections Configuration */}
          <SettingSection
            title="General Configuration"
            description="Control the visibility and status of major platform sections"
            icon={FiActivity}>
            <ToggleField
              label="Deals Section"
              description="Enable or disable the entire Deals catalog. If disabled, navigation links will be hidden from the public."
              enabled={settings.deals_enabled === 'true'}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  deals_enabled: val ? 'true' : 'false',
                })
              }
            />
            <div className="h-px bg-white/5" />
            <ToggleField
              label="Coupons Section"
              description="Toggle the visibility of the Coupons tab and individual coupon codes across the site."
              enabled={settings.coupons_enabled === 'true'}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  coupons_enabled: val ? 'true' : 'false',
                })
              }
            />
            <div className="h-px bg-white/5" />
            <ToggleField
              label="Maintenance Mode"
              description="Restrict site access to administrators only. Visitors will see a maintenance message."
              enabled={settings.maintenance_mode === 'true'}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  maintenance_mode: val ? 'true' : 'false',
                })
              }
            />
          </SettingSection>

          {/* Voting Behavior */}
          <SettingSection
            title="Voting & Community Rules"
            description="Define how users interact with shared content"
            icon={FiThumbsUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#49b99f] flex items-center gap-2">
                  <FiAlertCircle className="w-3" /> Hot Deal Threshold
                </label>
                <Input
                  type="number"
                  value={settings.hot_deal_threshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hot_deal_threshold: e.target.value,
                    })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
                <p className="text-[10px] text-light-grey opacity-40 italic">
                  Required points to highlight a deal with a 'HOT' badge.
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#49b99f] flex items-center gap-2">
                  <FiInfo className="w-3" /> Vote Cooldown (Hours)
                </label>
                <Input
                  type="number"
                  value={settings.vote_cooldown}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      vote_cooldown: e.target.value,
                    })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
                <p className="text-[10px] text-light-grey opacity-40 italic">
                  Time limit between subsequent votes on same item.
                </p>
              </div>
            </div>

            <div className="h-px bg-white/5 my-6" />

            <ToggleField
              label="Comment Moderation"
              description="Require admin approval for all new comments before they are visible to the public."
              enabled={settings.comment_moderation === 'true'}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  comment_moderation: val ? 'true' : 'false',
                })
              }
            />

            <div className="h-px bg-white/5 my-6" />

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#49b99f]">
                Who can vote?
              </label>
              <div className="flex bg-[#1a1a1a] p-1.5 rounded-2xl border border-white/5 max-w-md">
                {[
                  { id: 'all', label: 'Everyone' },
                  { id: 'verified', label: 'Verified Only' },
                  { id: 'elder', label: 'Elder Members' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, who_can_vote: opt.id })
                    }
                    className={cn(
                      'flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all p-0 border-0',
                      settings.who_can_vote === opt.id
                        ? 'bg-[#49b99f] text-white shadow-lg'
                        : 'text-light-grey hover:text-white'
                    )}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </SettingSection>

          {/* Registration Section */}
          <SettingSection
            title="Registration & Permissions"
            description="Manage user onboarding and initial privileges"
            icon={FiLock}>
            <ToggleField
              label="Public Registration"
              description="Allow new users to sign up without an invite code or manual approval."
              enabled={settings.public_registration === 'true'}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  public_registration: val ? 'true' : 'false',
                })
              }
            />
            <div className="h-px bg-white/5" />
            <ToggleField
              label="Auto-approve Verified Posts"
              description="Deals posted by level 2+ users bypass the moderation queue."
              enabled={settings.auto_approve_verified === 'true'}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  auto_approve_verified: val ? 'true' : 'false',
                })
              }
            />
          </SettingSection>

          {/* Platform Information */}
          <SettingSection
            title="Platform Information"
            description="General identity and branding settings"
            icon={FiInfo}>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-white block">
                  Platform Name
                </label>
                <Input
                  value={settings.platform_name}
                  onChange={(e) =>
                    setSettings({ ...settings, platform_name: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
                <p className="text-xs text-light-grey opacity-40">
                  The name of your deals platform
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-white block">
                  Contact Email
                </label>
                <Input
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
                <p className="text-xs text-light-grey opacity-40">
                  General contact email for users
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <UploadBox
                  label="Logo"
                  value={settings.logo_url}
                  onChange={(val) =>
                    setSettings({ ...settings, logo_url: val })
                  }
                />
                <UploadBox
                  label="Favicon"
                  value={settings.favicon_url}
                  onChange={(val) =>
                    setSettings({ ...settings, favicon_url: val })
                  }
                />
              </div>
            </div>
          </SettingSection>

          {/* Social Media Links */}
          <SettingSection
            title="Social Media Links"
            description="Configure links for social platform icons in the footer"
            icon={FiShare2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-white block">
                  Facebook URL
                </label>
                <Input
                  value={settings.facebook_url}
                  onChange={(e) =>
                    setSettings({ ...settings, facebook_url: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-white block">
                  Twitter URL
                </label>
                <Input
                  value={settings.twitter_url}
                  onChange={(e) =>
                    setSettings({ ...settings, twitter_url: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-white block">
                  YouTube URL
                </label>
                <Input
                  value={settings.youtube_url}
                  onChange={(e) =>
                    setSettings({ ...settings, youtube_url: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-white block">
                  LinkedIn URL
                </label>
                <Input
                  value={settings.linkedin_url}
                  onChange={(e) =>
                    setSettings({ ...settings, linkedin_url: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                />
              </div>
            </div>
          </SettingSection>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#49b99f]/5 rounded-[2rem] border border-[#49b99f]/20 p-8 space-y-6">
            <div className="flex items-center gap-3 text-[#49b99f]">
              <FiInfo className="w-6 h-6" />
              <h4 className="font-black uppercase tracking-widest">
                Configuration Note
              </h4>
            </div>
            <p className="text-sm text-light-grey leading-relaxed">
              Settings changed here are applied{' '}
              <span className="text-[#49b99f] font-bold">globally</span> across
              the entire platform. Changes to Deals and Coupons sections may
              take up to 2 minutes to propagate to cached mobile views.
            </p>
            <div className="bg-[#111] rounded-2xl p-4 border border-white/5">
              <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 opacity-40">
                Last Updated
              </h5>
              <p className="text-xs text-[#49b99f] font-medium">
                {new Date().toLocaleString()}
              </p>
              <p className="text-[10px] text-light-grey opacity-40 mt-1">
                by Admin: System
              </p>
            </div>
          </div>

          <div className="bg-red-500/5 rounded-[2rem] border border-red-500/10 p-8 space-y-6">
            <div className="flex items-center gap-3 text-red-500">
              <FiAlertCircle className="w-6 h-6" />
              <h4 className="font-black uppercase tracking-widest text-[#9CA3AF]">
                Advanced Actions
              </h4>
            </div>

            <AlertDialog open={showResetModal} onOpenChange={setShowResetModal}>
              <Button
                variant="outline"
                onClick={() => setShowResetModal(true)}
                disabled={loading}
                className="w-full h-12 border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Reset to Factory Defaults
              </Button>
              <AlertDialogContent className="bg-[#1a1a1a] border-white/10 text-white rounded-[2rem] p-8">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-light-grey text-base font-medium opacity-70">
                    This action will reset ALL platform settings to their
                    original factory defaults. This includes branding, voting
                    rules, and general configurations. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8 gap-4">
                  <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12 font-bold px-8">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-xl h-12 font-black uppercase tracking-widest px-8 shadow-lg shadow-red-500/20">
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={loading}
              className="w-full h-12 border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Clear System Cache
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
