import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FiUpload, FiLink, FiX } from 'react-icons/fi';
import { createDeal } from '@/services/api/deals.api';
import { uploadImage } from '@/services/api/upload.api';
import { getStores } from '@/services/api/stores.api';
import { toast } from 'react-hot-toast';
import { useState, useRef } from 'react';

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

export default function SubmitDeal() {
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
        toast.success('Deal submitted successfully!');
        navigate('/deals');
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

    // Validate file size (1MB)
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
      console.error('Upload failed:', error);
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
    <div className="min-h-screen bg-background text-white p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Submit a New Deal
          </h1>
          <p className="text-light-grey">
            Share great deals with the community
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="bg-[#2a2a2a] rounded-xl p-6 md:p-8 space-y-6">
          {/* Deal Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Deal Title</label>
            <Input
              name="title"
              placeholder="Enter deal title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-[#1e1e1e] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-green"
            />
            {formik.touched.title && formik.errors.title && (
              <span className="text-destructive text-xs">
                {formik.errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the deal, terms, and how to get it..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#1e1e1e] border-none rounded-md p-3 text-white min-h-[120px] focus:ring-1 focus:ring-green outline-none"
            />
            {formik.touched.description && formik.errors.description && (
              <span className="text-destructive text-xs">
                {formik.errors.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What's Included */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                What's Included? (One per line)
              </label>
              <textarea
                name="whatsIncluded"
                placeholder="Example:&#10;Samsung Galaxy S24 Ultra&#10;Original Charger&#10;USB-C Cable"
                value={formik.values.whatsIncluded}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#1e1e1e] border-none rounded-md p-3 text-white min-h-[120px] focus:ring-1 focus:ring-green outline-none"
              />
            </div>

            {/* How to Get */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                How to Get This Deal?
              </label>
              <textarea
                name="howToGet"
                placeholder="Enter instructions on how to redeem this deal..."
                value={formik.values.howToGet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#1e1e1e] border-none rounded-md p-3 text-white min-h-[120px] focus:ring-1 focus:ring-green outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Store */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Store</label>
              <select
                name="store"
                value={formik.values.store}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#1e1e1e] border-none rounded-md h-12 px-3 text-white focus:ring-1 focus:ring-green outline-none appearance-none">
                <option value="" disabled>
                  {loadingStores ? 'Loading stores...' : 'Select a store'}
                </option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              {formik.touched.store && formik.errors.store && (
                <span className="text-destructive text-xs">
                  {formik.errors.store}
                </span>
              )}
            </div>

            {/* Store Name (if Other) */}
            {formik.values.store === 'other' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-white">
                  Store Name
                </label>
                <Input
                  name="storeName"
                  placeholder="Enter store name"
                  value={formik.values.storeName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-[#1e1e1e] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-green"
                />
                {formik.touched.storeName && formik.errors.storeName && (
                  <span className="text-destructive text-xs">
                    {formik.errors.storeName}
                  </span>
                )}
              </div>
            )}

            {/* Original Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Original price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-grey">
                  $
                </span>
                <Input
                  name="originalPrice"
                  placeholder="299"
                  value={formik.values.originalPrice}
                  onChange={formik.handleChange}
                  className="bg-[#1e1e1e] border-none text-white h-12 pl-8 focus-visible:ring-1 focus-visible:ring-green"
                />
              </div>
            </div>

            {/* Deal Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Deal price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-grey">
                  $
                </span>
                <Input
                  name="dealPrice"
                  placeholder="199"
                  value={formik.values.dealPrice}
                  onChange={formik.handleChange}
                  className="bg-[#1e1e1e] border-none text-white h-12 pl-8 focus-visible:ring-1 focus-visible:ring-green"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deal URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Deal URL</label>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-light-grey" />
                <Input
                  name="dealUrl"
                  placeholder="https://..."
                  value={formik.values.dealUrl}
                  onChange={formik.handleChange}
                  className="bg-[#1e1e1e] border-none text-white h-12 pl-10 focus-visible:ring-1 focus-visible:ring-green"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Category</label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#1e1e1e] border-none rounded-md h-12 px-3 text-white focus:ring-1 focus:ring-green outline-none appearance-none">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coupon Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Coupon code (Optional)
              </label>
              <Input
                name="couponCode"
                placeholder="SAVE20"
                value={formik.values.couponCode}
                onChange={formik.handleChange}
                className="bg-[#1e1e1e] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-green"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Expiry Date
              </label>
              <Input
                name="expiryDate"
                type="date"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                className="bg-[#1e1e1e] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-green"
              />
            </div>
          </div>

          {/* Product Image Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-white">
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
              className={`border-2 border-dashed border-[#3e3e3e] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green transition-colors bg-[#1e1e1e]/50 ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}>
              <FiUpload
                className={`w-10 h-10 text-light-grey mb-4 ${
                  isUploading ? 'animate-bounce' : ''
                }`}
              />
              <p className="text-white font-medium mb-1">
                {isUploading
                  ? 'Uploading...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-light-grey text-xs">PNG, JPG, up to 1MB</p>
            </div>

            {/* Image Preview Grid */}
            {formik.values.images.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {formik.values.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden group border border-[#3e3e3e]">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-[#3e3e3e] gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="deliveryAvailable"
                checked={formik.values.deliveryAvailable}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('deliveryAvailable', checked)
                }
              />
              <label
                htmlFor="deliveryAvailable"
                className="text-sm font-medium text-white">
                Delivery Available
              </label>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-white">Type:</span>
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
                        className={`w-5 h-5 rounded-full border-2 border-[#3e3e3e] flex items-center justify-center transition-colors ${
                          formik.values.type === type
                            ? 'border-green'
                            : 'group-hover:border-light-grey'
                        }`}>
                        {formik.values.type === type && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-light-grey capitalize">
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
            className="w-full bg-[#49b99f] hover:bg-[#3ea08a] text-white font-bold h-14 rounded-lg cursor-pointer text-lg mt-4"
            disabled={formik.isSubmitting || isUploading}>
            {formik.isSubmitting ? 'Submitting...' : 'Submit Deal'}
          </Button>
        </form>
      </div>
    </div>
  );
}
