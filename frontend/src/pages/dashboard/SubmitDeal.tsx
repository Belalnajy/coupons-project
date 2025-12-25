import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FiUpload, FiLink } from 'react-icons/fi';
import { createDeal } from '@/services/api/deals.api';

const submitDealSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  store: z.string().min(2, 'Please select or type a store name'),
  originalPrice: z.string().optional(),
  dealPrice: z.string().min(1, 'Deal price is required'),
  dealUrl: z.string().url('Please enter a valid URL'),
  category: z.string().min(1, 'Please select a category'),
  couponCode: z.string().optional(),
  expiryDate: z.string().optional(),
  deliveryAvailable: z.boolean().default(false),
  type: z.enum(['online', 'instore', 'both']).default('online'),
});

type SubmitDealValues = z.infer<typeof submitDealSchema>;

export default function SubmitDeal() {
  const navigate = useNavigate();

  const formik = useFormik<SubmitDealValues>({
    initialValues: {
      title: '',
      description: '',
      store: '',
      originalPrice: '',
      dealPrice: '',
      dealUrl: '',
      category: '',
      couponCode: '',
      expiryDate: '',
      deliveryAvailable: false,
      type: 'online',
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
        await createDeal(values);
        alert('Deal submitted successfully!');
        navigate('/deals');
      } catch (error) {
        console.error('Failed to submit deal:', error);
        alert('Failed to submit deal. Please try again.');
      }
    },
  });

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
                  Select or type store name
                </option>
                <option value="amazon">Amazon</option>
                <option value="ebay">eBay</option>
                <option value="noon">Noon</option>
                <option value="other">Other</option>
              </select>
            </div>

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
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Product Image
            </label>
            <div className="border-2 border-dashed border-[#3e3e3e] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green transition-colors bg-[#1e1e1e]/50">
              <FiUpload className="w-10 h-10 text-light-grey mb-4" />
              <p className="text-white font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-light-grey text-xs">PNG, JPG, up to 1MB</p>
            </div>
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
            disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Submitting...' : 'Submit Deal'}
          </Button>
        </form>
      </div>
    </div>
  );
}
