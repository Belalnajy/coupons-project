import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Flame, 
  TrendingUp, 
  Grid3x3,
  Filter,
} from "lucide-react";
import { DealCard, CouponCard } from "@/components/shared";

// Mock data for deals
const deals = [
  {
    id: 1,
    title: "Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal",
    store: "Amazon",
    price: "£599",
    originalPrice: "£1199",
    discount: "-50%",
    comments: 42,
    timePosted: "2h ago",
    timeLeft: "2d 4h",
    verified: true,
    trending: true
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal",
    store: "Amazon",
    price: "£599",
    originalPrice: "£1199",
    discount: "-50%",
    comments: 12,
    timePosted: "5h ago",
    timeLeft: "1d 19h",
    verified: true,
    trending: false
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal",
    store: "Amazon",
    price: "£599",
    originalPrice: "£1199",
    discount: "-50%",
    comments: 8,
    timePosted: "1d ago",
    timeLeft: "3d 7h",
    verified: false,
    trending: false
  }
];

// Mock data for coupons
const coupons = [
  {
    id: 1,
    title: "Extra 20% Off Electronics",
    store: "Amazon",
    code: "SAVE20",
    badge: "20% OFF",
    expiresIn: "3 days",
    usedTimes: "156 times"
  },
  {
    id: 2,
    title: "Free Delivery on Orders Over £25",
    store: "Amazon",
    code: "FREESHIP",
    badge: "Free shipping",
    expiresIn: "7 days",
    usedTimes: "98 times"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("latest");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner Alert */}
      <div className="bg-darker-grey text-white py-2 px-4 text-center text-sm">
        <span className="inline-flex items-center gap-2 text-lg font-semibold">
          <Flame className="w-4 h-4 text-orange-500" />
          Today's Top Deals–Top voted offers right now
        </span>
      </div>

      {/* Christmas Sale Banner */}
      <div className="container mx-auto px-4 mt-6">
        <div className="relative bg-linear-to-r from-green-900 to-green-800 overflow-hidden">
          {/* Decorative elements would go here - using simplified version */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-10 text-6xl">🎄</div>
            <div className="absolute top-8 right-20 text-4xl">⭐</div>
            <div className="absolute bottom-6 left-1/4 text-3xl">🔴</div>
            <div className="absolute bottom-4 right-1/3 text-5xl">🎄</div>
          </div>
          
          <div className="relative z-10 px-8 py-16 text-center text-white">
            <div className="inline-block mb-4">
              
            </div>
            <h1 className="text-5xl font-bold mb-4">🎄 Christmas Sale</h1>
            <Badge className="bg-grey text-white hover:bg-red-700 mb-4 p-1 rounded-md">
                LIMITED TIME
              </Badge>
            <p className="text-xl opacity-90">Save up to 70% on electronics, fashion & more</p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="text-white py-3 px-4">
        <div className="container mx-auto flex items-center gap-2 bg-grey rounded-md p-2 text-lg">
          <Clock className="w-4 h-4 text-green" />
          Latest: 50+ new deals added today • Popular coupons refreshed hourly
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className=" bg-grey">
              <TabsTrigger value="latest" className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="hottest" className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <Flame className="w-4 h-4" />
                Hottest
              </TabsTrigger>
              <TabsTrigger value="ending" className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <Clock className="w-4 h-4" />
                Ending Soon
              </TabsTrigger>
              <TabsTrigger value="category" className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <Grid3x3 className="w-4 h-4" />
                By Category
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" className="gap-2 text-light-grey bg-grey">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Deals Count */}
        <p className="text-light-grey font-semibold text-lg mb-6">Showing {deals.length} deals</p>

        {/* Deal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mb-12">
          <Button variant="link" className="text-green cursor-pointer text-md">
            Load more deals →
          </Button>
        </div>

        <Separator className="my-12" />

        {/* Popular Coupons Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Popular Coupons</h2>
            <Link to="/coupons" className="text-green hover:underline text-sm cursor-pointer">
              View all coupons →
            </Link>
          </div>

          <div className="space-y-4">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
