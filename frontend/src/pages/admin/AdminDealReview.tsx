import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiUser,
  FiCalendar,
  FiTag,
  FiThumbsUp,
  FiThumbsDown,
  FiExternalLink,
  FiCopy,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DealDetail {
  id: string;
  title: string;
  store: string;
  submittedBy: string;
  date: string;
  category: string;
  description: string;
  image: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  upvotes: number;
  downvotes: number;
  expiryDate: string;
  couponCode: string;
  link: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const MOCK_DEAL: DealDetail = {
  id: '1',
  title: 'Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal',
  store: 'Amazon',
  submittedBy: 'DealsHunter123',
  date: '2023-12-16 14:30',
  category: 'Electronics',
  description: `Amazing deal on the latest Samsung Galaxy S24 Ultra. This is the 256GB model in Titanium Gray. The deal includes free delivery and a 2-year warranty. Stock is limited, so act fast! This is one of the best prices we've seen for this flagship device.

Features:
- 6.8" Dynamic AMOLED display
- Snapdragon 8 Gen 3 processor
- 200MP main camera
- 5000mAh battery
- S Pen included`,
  image:
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2070&auto=format&fit=crop',
  currentPrice: '£599',
  originalPrice: '£1,199',
  discount: '50%',
  upvotes: 142,
  downvotes: 8,
  expiryDate: '2023-12-25',
  couponCode: 'SAVE50',
  link: 'https://amazon.co.uk/deal/samsung-s24-ultra',
  status: 'Pending',
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
      <Icon className="w-4 h-4 text-light-grey" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-light-grey opacity-50 mb-0.5">
        {label}
      </p>
      <p className="text-white text-sm font-bold tracking-tight">{value}</p>
    </div>
  </div>
);

const AdminDealReview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // In a real app, you'd fetch the deal by ID here
  const deal = MOCK_DEAL;

  const handleCopy = () => {
    navigator.clipboard.writeText(deal.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header Bar */}
      <div className="flex items-center gap-6 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-[#2c2c2c] rounded-2xl border border-white/5 text-white hover:bg-[#333] transition-colors cursor-pointer group">
          <FiArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
            Deal Review
          </h1>
          <p className="text-light-grey font-medium opacity-60">
            Review and moderate deal submission {id && `#${id}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>

          <div className="bg-[#2c2c2c] rounded-3xl p-8 border border-white/5 shadow-xl">
            <h2 className="text-2xl font-black text-white tracking-tight mb-8">
              {deal.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <DetailItem
                icon={FiShoppingCart}
                label="Store"
                value={deal.store}
              />
              <DetailItem
                icon={FiUser}
                label="Submitted By"
                value={deal.submittedBy}
              />
              <DetailItem
                icon={FiCalendar}
                label="Submitted Date"
                value={deal.date}
              />
              <DetailItem icon={FiTag} label="Category" value={deal.category} />
            </div>

            <div className="h-px bg-white/5 w-full mb-8" />

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#49b99f]">
                Description
              </h3>
              <p className="text-light-grey leading-relaxed whitespace-pre-line text-[15px] opacity-80">
                {deal.description}
              </p>
            </div>
          </div>

          <div className="bg-[#2c2c2c] rounded-3xl p-8 border border-white/5 shadow-xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#49b99f]">
              Coupon Code
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 font-mono text-xl font-bold text-[#49b99f] flex items-center justify-between">
                {deal.couponCode}
                <button
                  onClick={handleCopy}
                  className={cn(
                    'px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2',
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-[#49b99f] text-white hover:bg-[#49b99f]/90'
                  )}>
                  {copied ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#2c2c2c] rounded-3xl p-8 border border-white/5 shadow-xl space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#49b99f]">
              Deal Link
            </h3>
            <a
              href={deal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl px-6 py-4 hover:border-[#49b99f]/30 transition-all">
              <span className="text-[#49b99f] font-bold underline truncate mr-4">
                {deal.link}
              </span>
              <FiExternalLink className="text-light-grey group-hover:text-[#49b99f] transition-colors" />
            </a>
          </div>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-[#2c2c2c] rounded-3xl p-6 border border-white/5 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-light-grey opacity-60">
              Price Details
            </h3>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-light-grey mb-1">
                Current Price
              </p>
              <p className="text-4xl font-black text-[#49b99f] tracking-tighter">
                {deal.currentPrice}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-light-grey mb-1">
                  Original Price
                </p>
                <p className="text-xl font-bold text-white opacity-60 line-through tracking-tight">
                  {deal.originalPrice}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-light-grey mb-1">
                  Discount
                </p>
                <p className="text-xl font-bold text-[#49b99f] tracking-tight">
                  {deal.discount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2c2c2c] rounded-3xl p-6 border border-white/5 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-light-grey opacity-60">
              Community Votes
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-[#49b99f]">
                  <FiThumbsUp className="w-5 h-5" />
                  <span className="font-bold">Upvotes</span>
                </div>
                <span className="text-white font-black">{deal.upvotes}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl text-red-500">
                <div className="flex items-center gap-2">
                  <FiThumbsDown className="w-5 h-5" />
                  <span className="font-bold">Downvotes</span>
                </div>
                <span className="text-white font-black">{deal.downvotes}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2c2c2c] rounded-3xl p-6 border border-white/5 shadow-xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-light-grey opacity-60">
              Expiry Date
            </h3>
            <p className="text-xl font-bold text-white tracking-tight">
              {deal.expiryDate}
            </p>
          </div>

          {/* Conditional Moderation Actions */}
          {deal.status === 'Pending' && (
            <div className="bg-[#2c2c2c] rounded-3xl p-6 border border-white/5 shadow-xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-light-grey opacity-60">
                Moderation Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full h-14 bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl gap-3 text-sm cursor-pointer border-0">
                  <FiCheckCircle className="w-5 h-5" />
                  Approve deal
                </Button>
                <Button
                  variant="destructive"
                  className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl gap-3 text-sm cursor-pointer border-0">
                  <FiXCircle className="w-5 h-5" />
                  Reject deal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDealReview;
