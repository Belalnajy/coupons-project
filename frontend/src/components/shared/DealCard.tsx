import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiClock, FiMessageSquare } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";

export interface DealProps {
  id: number;
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
  storeIcon?: React.ReactNode;
}

interface DealCardProps {
  deal: DealProps;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Card className="overflow-hidden bg-grey border-0 hover:shadow-lg transition-shadow p-0">
      {/* Deal Image */}
      <div className="relative bg-darker-grey aspect-video flex items-center justify-center">
        <div className="absolute top-2 flex flex-row justify-between w-full h-8 px-2">
          <Badge className="bg-red-600 text-white text-sm rounded-md h-full">
            {deal.discount}
          </Badge>
          {deal.verified && (
            <Badge className="bg-blue-600 text-white text-sm rounded-md h-full flex items-center px-4">
              Verified
            </Badge>
          )}
        </div>
        {deal.trending && (
          <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white py-1 px-2 flex flex-row justify-center items-center gap-1">
            <FaFire className="w-3 h-3" />
            Trending now
          </div>
        )}
        {/* Placeholder for product image */}
        <span className="text-6xl opacity-50">📱</span>
      </div>

      {/* Deal Content */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <FaFire className="w-4 h-4 text-red-500" />
          <span className="text-red-500 font-semibold text-sm">{deal.timeLeft}</span>
        </div>

        <Link to={`/deals/${deal.id}`}>
          <h3 className="text-white font-medium mb-1 line-clamp-2 hover:text-green cursor-pointer">
            {deal.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          {deal.storeIcon}
          <span className="text-light-grey text-sm">{deal.store}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-green text-2xl font-bold">{deal.price}</span>
          <span className="text-light-grey text-sm line-through">{deal.originalPrice}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-light-grey mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FiMessageSquare className="w-3 h-3" />
              {deal.comments} comments
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {deal.timePosted}
            </span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
             <IoTimerOutline className="w-3 h-3" />
             <span>Expires in 5h</span>
          </div>
        </div>

        <div className="flex gap-2 mb-1">
          <Link to={`/deals/${deal.id}`} className="flex-1">
            <Button className="w-full bg-green hover:bg-green/90 cursor-pointer">
              Get Deal
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
