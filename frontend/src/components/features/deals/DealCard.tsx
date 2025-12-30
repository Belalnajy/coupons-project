import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FiClock,
  FiMessageSquare,
  FiCheckCircle,
  FiFlag,
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { IoTimerOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ReportModal } from '../reports/ReportModal';

export interface DealProps {
  id: string | number;
  title: string;
  store: string;
  price: string;
  originalPrice: string;
  discount: string;
  comments: number;
  timePosted: string;
  timeLeft: string;
  verified: boolean;
  trending: boolean;
  postedBy?: string;
  heatScore?: number;
  storeIcon?: React.ReactNode;
  imageUrl?: string;
  expiryDateFormatted?: string | null;
}

interface DealCardProps {
  deal: DealProps;
}

export function DealCard({ deal }: DealCardProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <Card className="overflow-hidden bg-[#2a2a2a] border-0 hover:shadow-xl transition-all duration-300 p-0 rounded-2xl">
      {/* Deal Image */}
      <div className="relative bg-[#1a1a1a] aspect-video flex items-center justify-center overflow-hidden">
        {/* Discount Badge - Top Left */}
        <Badge className="absolute top-3 left-3 bg-red-600 text-white text-base font-bold rounded-lg px-3 py-1.5 z-10">
          {deal.discount}
        </Badge>

        {/* Verified Badge - Top Right */}
        {deal.verified && (
          <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-sm font-medium rounded-lg px-3 py-1.5 flex items-center gap-1.5 z-10">
            <FiCheckCircle className="w-4 h-4" />
            Verified
          </Badge>
        )}

        {/* Trending Banner - Bottom */}
        {deal.trending && (
          <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white py-2 px-4 flex flex-row justify-center items-center gap-2 font-semibold text-sm">
            <FaFire className="w-4 h-4" />
            Trending now
          </div>
        )}

        {/* Product Image or Placeholder */}
        <img
          src={deal.imageUrl || '/product-placeholder.png'}
          alt={deal.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Deal Content */}
      <div className="px-5 py-4">
        {/* Heat Score Badge */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-2 bg-transparent border-2 border-red-500 text-red-500 rounded-xl px-3 py-1.5">
            <FaFire className="w-4 h-4" />
            <span className="font-bold text-lg">{deal.heatScore || 245}°</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2 leading-tight">
          {deal.title}
        </h3>

        {/* Store */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden">
            {deal.storeIcon || <span className="text-sm">🏪</span>}
          </div>
          <span className="text-gray-400 text-sm">{deal.store}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-red-500 text-3xl font-bold">{deal.price}</span>
          <span className="text-gray-500 text-lg line-through">
            {deal.originalPrice}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <FiMessageSquare className="w-4 h-4" />
              {deal.comments} comments
            </span>
            <span
              className="flex items-center gap-1.5"
              title={deal.expiryDateFormatted ? 'Expiry Date' : 'Date Posted'}>
              <FiClock className="w-4 h-4" />
              {deal.expiryDateFormatted || deal.timePosted}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-400">
            <IoTimerOutline className="w-4 h-4" />
            <span>
              {deal.timeLeft === 'Expired' || deal.timeLeft === 'No expiry'
                ? deal.timeLeft
                : `Expires in ${deal.timeLeft}`}
            </span>
          </div>
        </div>

        {/* Posted By */}
        {deal.postedBy && (
          <div className="text-sm text-gray-400 mb-4 flex justify-between items-center">
            <div>
              Posted by{' '}
              <span className="text-white font-medium">{deal.postedBy}</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setReportModalOpen(true);
              }}
              className="text-xs text-light-grey hover:text-red-400 flex items-center gap-1 transition-colors"
              title="Report this deal">
              <FiFlag className="w-3 h-3" /> Report
            </button>
          </div>
        )}

        {/* Get Deal Button */}
        <Button
          asChild
          className="w-full bg-green hover:bg-green/90 text-white font-semibold py-6 rounded-xl text-lg transition-colors cursor-pointer">
          <Link to={`/deals/${deal.id}`}>Get Deal</Link>
        </Button>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        contentType="deal"
        contentId={String(deal.id)}
      />
    </Card>
  );
}
