import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiSave,
  FiShoppingCart,
  FiLink,
  FiInfo,
  FiImage,
  FiCheckCircle,
  FiPlus,
  FiX,
  FiUpload,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAdminStore,
  createStore,
  updateStore,
} from '@/services/api/admin.api';
import { uploadImage } from '@/services/api/upload.api';
import { toast } from 'react-hot-toast';

const AdminStoreEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    status: 'active' as 'active' | 'disabled',
    description: '',
    logoUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getAdminStore(id)
        .then((data) => {
          setFormData({
            name: data.name,
            websiteUrl: data.websiteUrl || '',
            status: data.status,
            description: data.description || '',
            logoUrl: data.logoUrl || '',
          });
          setLogoPreview(data.logoUrl || null);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit && id) {
        await updateStore(id, formData);
        toast.success('Store updated successfully');
      } else {
        await createStore(formData);
        toast.success('Store created successfully');
      }
      navigate('/admin/stores');
    } catch (error) {
      toast.error('Failed to save store');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('Image size must be less than 1MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'stores');
      setFormData({ ...formData, logoUrl: result.url });
      setLogoPreview(result.url);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-[#2c2c2c] rounded-2xl border border-white/5 text-white hover:bg-[#333] transition-all cursor-pointer group shadow-lg">
            <FiArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
              {isEdit ? 'Refine Store' : 'Onboard Store'}
            </h1>
            <p className="text-light-grey font-medium opacity-60">
              {isEdit
                ? `Modifying portal configuration for Store ID: ${id}`
                : 'Create a new entry in the dealer ecosystem'}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/stores')}
            className="border-white/10 text-light-grey hover:bg-white/5 h-12 rounded-xl px-6 font-bold uppercase tracking-widest text-xs">
            Discard Changes
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || isUploading}
            className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white h-12 rounded-xl px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-[#49b99f]/20">
            {loading ? 'Processing...' : 'Finalize Store'}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {/* Left Column: Visuals & Branding */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#2c2c2c] rounded-3xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#49b99f] mb-6 flex items-center gap-2">
              <FiImage className="w-4" /> Visual Identity
            </h3>

            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'aspect-square bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-4 relative group overflow-hidden cursor-pointer hover:border-[#49b99f]/50 transition-colors',
                  isUploading && 'opacity-50 pointer-events-none'
                )}>
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiUpload className="text-white w-8 h-8" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogoPreview(null);
                        setFormData((f) => ({ ...f, logoUrl: '' }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                      <FiX />
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiPlus
                        className={cn(
                          'text-[#49b99f] w-6 h-6',
                          isUploading && 'animate-bounce'
                        )}
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-light-grey">
                      {isUploading ? 'Uploading...' : 'Upload Logo'}
                    </p>
                    <p className="text-[8px] text-light-grey/40">
                      PNG, SVG up to 1MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-light-grey opacity-60">
                  Direct Logo URL
                </label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, logoUrl: e.target.value });
                    setLogoPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  className="bg-[#1a1a1a] border-white/5 rounded-xl h-11 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#49b99f]/10 rounded-3xl p-8 border border-[#49b99f]/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle className="text-[#49b99f] w-5 h-5" />
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                Best Practice
              </h4>
            </div>
            <p className="text-xs text-light-grey/80 leading-relaxed font-medium">
              Ensure the store URL starts with <strong>https://</strong> for
              user safety. Stores with verified logos see 40% higher engagement
              on deals.
            </p>
          </div>
        </div>

        {/* Right Column: Information & Controls */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#2c2c2c] rounded-3xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#49b99f] mb-8">
              Store Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-light-grey flex items-center gap-2">
                  <FiShoppingCart className="w-3" /> Partner Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Amazon UK"
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                  required
                />
              </div>

              {/* Website URL */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-light-grey flex items-center gap-2">
                  <FiLink className="w-3" /> Official URL
                </label>
                <Input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  placeholder="https://www.store.com"
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-bold"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-light-grey flex items-center gap-2">
                  <FiInfo className="w-3" /> Operational Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter detailed store background..."
                  className="w-full h-40 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-[#49b99f]/50 transition-colors resize-none"
                />
              </div>

              {/* Status Toggle */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-light-grey">
                  Market Visibility
                </label>
                <div className="flex bg-[#1a1a1a] p-1.5 rounded-2xl border border-white/5">
                  {['active', 'disabled'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: status as any })
                      }
                      className={cn(
                        'flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer',
                        formData.status === status
                          ? status === 'active'
                            ? 'bg-[#49b99f] text-white shadow-lg'
                            : 'bg-red-500 text-white shadow-lg'
                          : 'text-light-grey hover:text-white'
                      )}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 h-16 bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl gap-3 text-sm cursor-pointer border-0 shadow-2xl shadow-[#49b99f]/30">
              <FiSave className="w-5 h-5" />
              {loading
                ? 'Processing...'
                : isEdit
                ? 'Sync Changes to Cloud'
                : 'Initiate Store Launch'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/stores')}
              className="h-16 border-white/5 bg-[#2c2c2c] text-light-grey hover:bg-[#333] hover:text-white px-10 rounded-2xl uppercase tracking-widest font-black text-xs cursor-pointer">
              Abort
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminStoreEdit;
