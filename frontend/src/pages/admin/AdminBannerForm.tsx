import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiSave,
  FiImage,
  FiType,
  FiLink,
  FiTarget,
  FiCalendar,
  FiToggleLeft,
  FiToggleRight,
  FiUpload,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAdminBanner,
  createBanner,
  updateBanner,
} from '@/services/api/admin.api';
import { uploadImage } from '@/services/api/upload.api';
import { toast } from 'react-hot-toast';

const AdminBannerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    subtitle: '',
    targetUrl: '',
    placement: 'home_top',
    status: 'active',
    startDate: '',
    endDate: '',
    sortOrder: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAdminBanner(id)
        .then((data) => {
          setFormData({
            title: data.title,
            imageUrl: data.imageUrl,
            subtitle: data.subtitle || '',
            targetUrl: data.targetUrl || '',
            placement: data.placement,
            status: data.status,
            startDate: data.startDate?.split('T')[0] || '',
            endDate: data.endDate?.split('T')[0] || '',
            sortOrder: data.sortOrder,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (id) {
        await updateBanner(id, formData);
        toast.success('Banner updated successfully');
      } else {
        await createBanner(formData);
        toast.success('Banner created successfully');
      }
      navigate('/admin/content');
    } catch (error) {
      toast.error('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'banners');
      setFormData({ ...formData, imageUrl: result.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/admin/content')}
            className="p-3 bg-[#333333] hover:bg-[#404040] text-white rounded-2xl border border-white/5 transition-all hover:-translate-x-1">
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
              {id ? 'Edit Banner' : 'New Banner'}
            </h1>
            <p className="text-light-grey text-lg font-medium opacity-60">
              Create and schedule visual assets
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading || isUploading}
          className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl px-10 h-14 shadow-xl shadow-[#49b99f]/20 gap-3 border-0 transition-all hover:-translate-y-1">
          <FiSave className="w-6 h-6" />
          {loading ? 'Saving...' : 'Save Banner'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Main Details */}
          <div className="bg-[#2c2c2c] rounded-[2rem] border border-white/5 shadow-xl overflow-hidden p-8 space-y-8">
            <h3 className="text-xl font-bold text-white tracking-tight uppercase flex items-center gap-3 mb-6">
              <FiImage className="text-[#49b99f]" /> Banner Details
            </h3>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                Banner Title
              </label>
              <Input
                placeholder="e.g. Winter Sale Warning"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                <FiImage className="w-3" /> Banner Image
              </label>
              <div className="flex gap-4">
                <Input
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium flex-1"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="h-14 bg-white/5 hover:bg-white/10 text-white border-white/5 px-6 rounded-2xl gap-2 font-bold uppercase tracking-wider text-xs">
                  <FiUpload
                    className={cn('w-4 h-4', isUploading && 'animate-bounce')}
                  />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                <FiType className="w-3" /> Overlay Text
              </label>
              <Input
                placeholder="Text to display on top of image"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                  <FiLink className="w-3" /> Target Link
                </label>
                <Input
                  placeholder="/offers/..."
                  value={formData.targetUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, targetUrl: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                  <FiTarget className="w-3" /> Placement
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) =>
                    setFormData({ ...formData, placement: e.target.value })
                  }
                  className="w-full h-14 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-white focus:ring-1 focus:ring-[#49b99f]/30 font-bold outline-none appearance-none cursor-pointer">
                  <option value="home_top">Home Top</option>
                  <option value="deals_top">Deals Top</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="category_page">Category Page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule & Status */}
          <div className="bg-[#2c2c2c] rounded-[2rem] border border-white/5 shadow-xl overflow-hidden p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white tracking-tight uppercase flex items-center gap-3">
                <FiCalendar className="text-[#49b99f]" /> Schedule & Status
              </h3>
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    status: formData.status === 'active' ? 'draft' : 'active',
                  })
                }
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer',
                  formData.status === 'active'
                    ? 'bg-[#49b99f]/10 text-[#49b99f] border-[#49b99f]/20'
                    : 'bg-white/5 text-light-grey border-white/5'
                )}>
                {formData.status === 'active' ? (
                  <FiToggleRight className="w-4 h-4" />
                ) : (
                  <FiToggleLeft className="w-4 h-4" />
                )}
                {formData.status}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#a0a0a0] flex items-center gap-2 opacity-60">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sticky top-8">
            <h3 className="text-sm font-black text-light-grey uppercase tracking-widest mb-6 px-2">
              Live Preview
            </h3>

            <div className="bg-[#1a1a1a] border-4 border-[#333] rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden min-h-[300px] flex items-center justify-center">
              {formData.imageUrl ? (
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg group">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-auto object-cover min-h-[200px]"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
                      {formData.subtitle || 'Your Text Here'}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-30">
                  <FiImage className="w-24 h-24 mx-auto" />
                  <p className="font-bold uppercase tracking-widest">
                    Image Preview
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 p-6 bg-[#49b99f]/5 rounded-3xl border border-[#49b99f]/10">
              <p className="text-xs text-[#49b99f] font-medium leading-relaxed">
                <span className="font-bold uppercase tracking-widest block mb-2">
                  Note:
                </span>
                The text overlay allows you to add dynamic messaging to your
                banners without embedding it in the image file itself. This
                improves SEO and accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBannerForm;
