import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  FiCamera,
  FiAward,
  FiZap,
  FiTag,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiLoader,
} from 'react-icons/fi';
import { getUserStats, updateProfile } from '@/services/api/users.api';
import { uploadImage } from '@/services/api/upload.api';
import { toast } from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatar || '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Update form data if user changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatarUrl: user.avatar || '',
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (saveStatus !== 'idle') setSaveStatus('idle');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('Avatar size must be less than 1MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'avatars');
      setFormData({ ...formData, avatarUrl: result.url });
      toast.success('Avatar uploaded! Save changes to apply.');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const response = await updateProfile(formData);
      if (response) {
        updateUser({
          ...user,
          username: formData.username,
          bio: formData.bio,
          avatar: formData.avatarUrl,
        } as any);
        setSaveStatus('success');
        toast.success('Profile updated successfully');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaveStatus('error');
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatarUrl: user.avatar || '',
      });
      setSaveStatus('idle');
    }
  };

  const userDisplayName = user?.username || 'Guest';

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-[3px] border-[#49b99f] p-1 shadow-2xl shadow-[#49b99f]/10">
              <Avatar className="w-full h-full border-none">
                <AvatarImage src={formData.avatarUrl} alt={userDisplayName} />
                <AvatarFallback className="bg-transparent text-[#49b99f] text-4xl font-bold tracking-tight">
                  {(userDisplayName || '').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`absolute bottom-1 right-1 bg-[#49b99f] p-3 rounded-full text-white cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl z-20 border-[3px] border-[#222] ${
                isUploading ? 'opacity-50' : ''
              }`}>
              {isUploading ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                <FiCamera className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight">
              {userDisplayName}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-500/20">
                <FiZap className="w-3 h-3" />
                {isLoading ? '...' : (stats?.karma || 0).toLocaleString()} Karma
              </div>
              <div className="flex items-center gap-2 bg-green/10 text-green px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green/20">
                <FiAward className="w-3 h-3" />
                <span className="capitalize">
                  {isLoading ? '...' : stats?.level || 'Bronze'}
                </span>{' '}
                Member
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid (Inputs) */}
        <div className="w-full space-y-8 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#666] ml-4">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Your username"
              className="w-full bg-[#333]/50 border border-white/5 text-[#ddd] py-5 px-8 rounded-2xl text-lg focus:ring-2 focus:ring-[#49b99f]/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#666] ml-4">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full bg-[#333]/10 border border-white/5 text-[#666] py-5 px-8 rounded-2xl text-lg outline-none cursor-not-allowed"
              readOnly
              disabled
            />
            <p className="text-[10px] text-[#666] ml-4 italic px-2">
              Email cannot be changed for security reasons.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#666] ml-4">
              Bio
            </label>
            <div className="relative group">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full bg-[#333]/50 border border-white/5 text-[#ddd] py-5 px-8 rounded-2xl text-lg focus:ring-2 focus:ring-[#49b99f]/50 outline-none transition-all resize-none"
              />
              <div className="absolute right-4 bottom-[-24px] text-[#555] text-xs font-bold">
                {(formData.bio || '').length}/500
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="bg-[#333]/30 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center group hover:bg-[#333]/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="text-blue-500 w-6 h-6" />
            </div>
            <p className="text-white font-bold text-xl">
              {isLoading ? '...' : stats?.impactScore || 0}
            </p>
            <p className="text-[10px] text-light-grey uppercase font-black tracking-widest opacity-50">
              Impact Score
            </p>
          </div>
          <div className="bg-[#333]/30 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center group hover:bg-[#333]/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiTag className="text-purple-500 w-6 h-6" />
            </div>
            <p className="text-white font-bold text-xl">
              {isLoading ? '...' : stats?.dealsCount || 0}
            </p>
            <p className="text-[10px] text-light-grey uppercase font-black tracking-widest opacity-50">
              Deals Shared
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full max-w-2xl gap-5 pt-4">
          <Button
            onClick={handleCancel}
            disabled={isSaving || isUploading}
            className="flex-1 h-16 bg-[#333] hover:bg-[#444] text-white text-xl font-bold rounded-2xl transition-all border-none cursor-pointer">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className={`flex-1 h-16 text-white text-xl font-bold rounded-2xl transition-all border-none shadow-lg cursor-pointer ${
              saveStatus === 'success'
                ? 'bg-green'
                : saveStatus === 'error'
                ? 'bg-red-500'
                : 'bg-[#49b99f] hover:bg-[#3ea58c] shadow-[#49b99f]/20'
            }`}>
            {isSaving ? (
              'Saving...'
            ) : saveStatus === 'success' ? (
              <>
                <FiCheck className="mr-2" /> Saved!
              </>
            ) : saveStatus === 'error' ? (
              <>
                <FiX className="mr-2" /> Failed
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
