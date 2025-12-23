import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiClock, FiCopy, FiTag } from "react-icons/fi";

export interface CouponProps {
  id: number;
  title: string;
  store: string;
  code: string;
  badge: string;
  expiresIn: string;
  usedTimes: string;
  storeIcon?: React.ReactNode;
}

interface CouponCardProps {
  coupon: CouponProps;
}

export function CouponCard({ coupon }: CouponCardProps) {
  return (
    <Card className="bg-grey border-0 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col gap-4">
          <Badge className="w-fit bg-green/20 text-green hover:bg-green/30 rounded-md p-2 border border-green-500">
          <FiTag/>
            {coupon.badge}
          </Badge>
          
          <h3 className="text-white font-medium text-lg">{coupon.title}</h3>
          
          <div className="flex items-center gap-2 text-sm text-light-grey">
            {coupon.storeIcon}
            <span>{coupon.store}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-light-grey">
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              Expires in {coupon.expiresIn}
            </span>
            <span>Used {coupon.usedTimes}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-right">
            <div className="text-green bg-darker-grey font-mono font-bold mb-1 border border-light-grey rounded-md py-2 px-6">
              {coupon.code}
            </div>
          </div>
          <Button className="bg-green hover:bg-green/90 gap-2 cursor-pointer">
            <FiCopy className="w-4 h-4" />
            Copy code
          </Button>
        </div>
      </div>
    </Card>
  );
}
