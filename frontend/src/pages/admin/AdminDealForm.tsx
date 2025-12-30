import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FiUpload, FiLink, FiArrowLeft, FiX } from 'react-icons/fi';
import { createDeal } from '@/services/api/deals.api';
import { uploadImage } from '@/services/api/upload.api';
import { getStores } from '@/services/api/stores.api';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const submitDealSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    store: z.string().min(1, 'Please select a store'),
    storeName: z.string().optional(),
    originalPrice: z.string().optional(),
    dealPrice: z.string().min(1, 'Deal price is required'),
    dealUrl: z.string().url('Please enter a valid URL'),
    category: z.string().min(1, 'Please select a category'),
    couponCode: z.string().optional(),
    expiryDate: z.string().optional(),
    deliveryAvailable: z.boolean().default(false),
    type: z.enum(['online', 'instore', 'both']).default('online'),
    images: z.array(z.string()).default([]),
    whatsIncluded: z.string().optional(),
    howToGet: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.store === 'other' &&
        (!data.storeName || data.storeName.length < 2)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Store name is required when 'Other' is selected",
      path: ['storeName'],
    }
  );

type SubmitDealValues = z.infer<typeof submitDealSchema>;

const AdminDealForm: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik<SubmitDealValues>({
    initialValues: {
      title: '',
      description: '',
      store: '',
      storeName: '',
      originalPrice: '',
      dealPrice: '',
      dealUrl: '',
      category: '',
      couponCode: '',
      expiryDate: '',
      deliveryAvailable: false,
      type: 'online',
      images: [],
      whatsIncluded: '',
      howToGet: '',
    },
    validate: (values) => {
      const result = submitDealSchema.safeParse(values);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (path) {
            errors[path] = issue.message;
          }
        });
        return errors;
      }
    },
    onSubmit: async (values) => {
      try {
        const payload = { ...values };

        // Handle "Other" store
        if (payload.store === 'other') {
          // Send storeName, remove store ID
          delete (payload as any).store;
        } else {
          // Send store ID, remove storeName
          delete (payload as any).storeName;
        }

        await createDeal({
          ...payload,
          originalPrice: values.originalPrice
            ? Number(values.originalPrice)
            : undefined,
          dealPrice: Number(values.dealPrice),
          whatsIncluded: values.whatsIncluded
            ? values.whatsIncluded
                .split('\n')
                .filter((line) => line.trim() !== '')
            : [],
        });
        toast.success('Deal created successfully!');
        navigate('/admin/deals');
      } catch (error) {
        console.error('Failed to submit deal:', error);
        toast.error('Failed to submit deal. Please try again.');
      }
    },
  });

  const [stores, setStores] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  useState(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('Image size must be less than 1MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'deals');
      formik.setFieldValue('images', [...formik.values.images, result.url]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formik.values.images];
    newImages.splice(index, 1);
    formik.setFieldValue('images', newImages);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={() => navigate('/admin/deals')}
          className="p-3 bg-[#333333] hover:bg-[#404040] text-white rounded-2xl border border-white/5 transition-all hover:-translate-x-1 cursor-pointer">
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
            Add New Deal
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            Create a new deal manually
          </p>
        </div>
      </div>

      <div className="bg-[#2c2c2c] rounded-[2rem] border border-white/5 shadow-xl p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Deal Title */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
              Deal Title
            </label>
            <Input
              name="title"
              placeholder="Enter deal title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
            />
            {formik.touched.title && formik.errors.title && (
              <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
                {formik.errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the deal, terms, and how to get it..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full h-32 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 text-white focus:ring-2 focus:ring-[#49b99f]/20 outline-none resize-none font-medium"
            />
            {formik.touched.description && formik.errors.description && (
              <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
                {formik.errors.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What's Included */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                What's Included? (One per line)
              </label>
              <textarea
                name="whatsIncluded"
                placeholder="Example:&#10;Samsung Galaxy S24 Ultra&#10;Original Charger&#10;USB-C Cable"
                value={formik.values.whatsIncluded}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-32 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 text-white focus:ring-2 focus:ring-[#49b99f]/20 outline-none resize-none font-medium"
              />
            </div>

            {/* How to Get */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                How to Get This Deal?
              </label>
              <textarea
                name="howToGet"
                placeholder="Enter instructions on how to redeem this deal..."
                value={formik.values.howToGet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-32 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 text-white focus:ring-2 focus:ring-[#49b99f]/20 outline-none resize-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Store
              </label>
              <select
                name="store"
                value={formik.values.store}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-14 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-[#49b99f]/20 outline-none appearance-none font-medium cursor-pointer">
                <option value="" disabled>
                  {loadingStores ? 'Loading stores...' : 'Select Store'}
                </option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              {formik.touched.store && formik.errors.store && (
                <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
                  {formik.errors.store}
                </span>
              )}
            </div>

            {/* Store Name (if Other) */}
            {formik.values.store === 'other' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                  Store Name
                </label>
                <Input
                  name="storeName"
                  placeholder="Enter store name"
                  value={formik.values.storeName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
                {formik.touched.storeName && formik.errors.storeName && (
                  <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
                    {formik.errors.storeName}
                  </span>
                )}
              </div>
            )}

            {/* Original Price */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Original price
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-light-grey font-bold">
                  $
                </span>
                <Input
                  name="originalPrice"
                  placeholder="299"
                  value={formik.values.originalPrice}
                  onChange={formik.handleChange}
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl pl-10 pr-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
              </div>
            </div>

            {/* Deal Price */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Deal price
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-light-grey font-bold">
                  $
                </span>
                <Input
                  name="dealPrice"
                  placeholder="199"
                  value={formik.values.dealPrice}
                  onChange={formik.handleChange}
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl pl-10 pr-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deal URL */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Deal URL
              </label>
              <div className="relative">
                <FiLink className="absolute left-6 top-1/2 -translate-y-1/2 text-light-grey" />
                <Input
                  name="dealUrl"
                  placeholder="https://..."
                  value={formik.values.dealUrl}
                  onChange={formik.handleChange}
                  className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl pl-12 pr-6 text-white focus:ring-[#49b99f]/20 font-medium"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Category
              </label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-14 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-[#49b99f]/20 outline-none appearance-none font-medium cursor-pointer">
                <option value="" disabled>
                  Select category
                </option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coupon Code */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Coupon code (Optional)
              </label>
              <Input
                name="couponCode"
                placeholder="SAVE20"
                value={formik.values.couponCode}
                onChange={formik.handleChange}
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Expiry Date
              </label>
              <Input
                name="expiryDate"
                type="date"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 font-medium"
              />
            </div>
          </div>

          {/* Product Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
              Product Images
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed border-[#49b99f]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#49b99f] transition-all bg-[#49b99f]/5 group',
                isUploading && 'opacity-50 pointer-events-none'
              )}>
              <FiUpload
                className={cn(
                  'w-10 h-10 text-[#49b99f]/60 group-hover:text-[#49b99f] mb-4 transition-colors',
                  isUploading && 'animate-bounce'
                )}
              />
              <p className="text-white font-bold mb-1">
                {isUploading
                  ? 'Uploading...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-light-grey text-xs uppercase tracking-wider">
                PNG, JPG, up to 1MB
              </p>
            </div>

            {/* Image Preview Grid */}
            {formik.values.images.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {formik.values.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                    <img
                      src={url}
                      alt={`Deal ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery & Type */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-white/5 gap-6">
            <div className="flex items-center gap-3">
              <Checkbox
                id="deliveryAvailable"
                checked={formik.values.deliveryAvailable}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('deliveryAvailable', checked)
                }
                className="border-white/20 data-[state=checked]:bg-[#49b99f] data-[state=checked]:border-[#49b99f]"
              />
              <label
                htmlFor="deliveryAvailable"
                className="text-sm font-bold text-white uppercase tracking-wider opacity-80 cursor-pointer">
                Delivery Available
              </label>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-white uppercase tracking-wider opacity-80">
                Type:
              </span>
              <div className="flex items-center gap-4">
                {['online', 'instore', 'both'].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formik.values.type === type}
                        onChange={formik.handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          formik.values.type === type
                            ? 'border-[#49b99f]'
                            : 'border-white/20 group-hover:border-white/40'
                        }`}>
                        {formik.values.type === type && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#49b99f]" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-light-grey capitalize group-hover:text-white transition-colors">
                      {type === 'instore' ? 'in-Store' : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#49b99f] hover:bg-[#3ea08a] text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-[#49b99f]/20 transition-all hover:-translate-y-1 mt-4 cursor-pointer"
            disabled={formik.isSubmitting || isUploading}>
            {formik.isSubmitting ? 'Creating Deal...' : 'Create Deal'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminDealForm;
