import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FiClock, 
  FiMessageSquare, 
  FiExternalLink, 
  FiThumbsUp,
  FiThumbsDown,
  FiCopy,
  FiFacebook,
  FiTwitter,
  FiLink,
  FiGrid
} from "react-icons/fi";
import { FaFire, FaAmazon } from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";
import { getDealById, getDeals } from "@/lib/api";
import type { Deal } from "@/lib/types";
import { DealCard } from "@/components/shared/DealCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";

// Helper to get store icon
function getStoreIcon(storeIcon?: string) {
  switch (storeIcon) {
    case 'amazon':
      return <FaAmazon className="w-5 h-5 text-white" />;
    default:
      return null;
  }
}

export default function DealsDetails() {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (id) {
          const dealData = await getDealById(parseInt(id));
          setDeal(dealData);
          
          const related = await getDeals({ limit: 4 });
          setRelatedDeals(related.data);
        }
      } catch (error) {
        console.error("Failed to fetch deal details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-grey rounded-full mb-4"></div>
          <p>Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Deal not found</h2>
        <Button variant="outline" className="bg-grey" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pb-12">
      <div className="container mx-auto px-4 pt-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-white hover:text-green transition-colors">
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-white hover:text-green transition-colors">
                <Link to="/deals">{deal.category || 'Deals'}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-green font-medium truncate max-w-[200px] md:max-w-none">
                {deal.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Deal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-4">
            <div className="bg-darker-grey aspect-video xl:aspect-4/3 max-h-[400px] rounded-lg flex items-center justify-center overflow-hidden border border-grey">
              <span className="text-7xl opacity-20">📱</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-darker-grey aspect-square rounded-md border border-grey flex items-center justify-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-xl">📱</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Deal Info */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            <div className="space-y-4">
              <Badge className="bg-red rounded-md text-lg py-3 px-3 hover:bg-red">
                {deal.discount} off!
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {deal.title}
              </h1>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-grey flex items-center justify-center">
                  {getStoreIcon(deal.storeIcon)}
                </div>
                <div className="text-sm">
                  <div className="text-light-grey">{deal.store}</div>
                  <Link to="#" className="text-green hover:underline text-xs">View all deals from this store →</Link>
                </div>
              </div>
            </div>

            {/* Voting Section */}
            <Separator />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-row items-center justify-between w-full">
                <button className="flex items-center justify-center gap-2 px-6 py-2 w-1/4 bg-red-500 text-white cursor-pointer rounded-md">
                  <FiThumbsUp /> Hot {deal.votes?.up}
                </button>
                <div className="flex flex-col items-center justify-center px-4 border-x border-background ">
                  <div className="text-red rounded-full h-20 w-20 border-4 border-red bg-red/30 flex flex-col items-center justify-center">
                    <FaFire className="w-4 h-4" />
                  <span className="font-bold">{deal.votes?.temperature}°</span>
                  </div>
                  <span className="text-[10px] text-light-grey">{deal.votes?.up! + deal.votes?.down!} votes</span>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2 w-1/4 bg-blue-600 text-white cursor-pointer rounded-md">
                  <FiThumbsDown /> Cold {deal.votes?.down}
                </button>
              </div>
            </div>

            {/* Pricing */}
            <Separator />
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green">{deal.price}</span>
                <span className="text-xl text-light-grey line-through">{deal.originalPrice}</span>
              </div>
              <Badge className="bg-green/10 text-green border-green rounded-md px-2">
                You save {deal.originalPrice.replace('£', '') === '1199' ? '£600' : '30%'} ({deal.discount})
              </Badge>
            </div>

            {/* Coupon Code */}
            <div className="p-4 border-2 border-dashed border-green bg-green/5 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm text-green font-medium">
                <FiClock className="w-4 h-4" /> Use Coupon Code
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-white text-green font-mono font-bold text-center py-2 rounded-md border border-light-grey">
                  SUMMER50
                </div>
                <Button className="bg-green hover:bg-green/90 gap-2 cursor-pointer h-auto py-2">
                  <FiCopy /> Copy
                </Button>
              </div>
              <p className="text-[11px] text-light-grey">
                📍 Copy this code and paste it at checkout to get your discount
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-col gap-4 text-sm text-light-grey">
              <div className="flex items-center gap-2">
                <FiClock /> Posted 2 hours ago by <span className="text-green cursor-pointer">{deal.user?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-red-500">
                <IoTimerOutline /> Expires in 5 hours
              </div>
              <div className="flex items-center gap-2">
                <FiExternalLink /> Free Delivery
              </div>
              <div className="flex items-center gap-2">
                <FiGrid /> Online Deal
              </div>
            </div>

            {/* Social */}
            <Separator />
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Share:</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-grey border-none cursor-pointer">
                    <FiFacebook className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-grey border-none cursor-pointer">
                    <FiTwitter className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-grey border-none cursor-pointer">
                    <FiLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button className="flex-1 bg-green hover:bg-green/90 py-6 text-lg font-bold gap-3 cursor-pointer">
                <FiExternalLink className="w-5 h-5" /> Get This Deal
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs (Simplified) */}
        <div className="mt-12 bg-grey rounded-lg p-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-green">Deal Description</h2>
            <div className="space-y-4 text-light-grey leading-relaxed">
              <p className="flex items-center gap-2 font-medium text-white">
                🔥 {deal.description?.split('\n')[0]}
              </p>
              <p>{deal.description?.split('\n\n')[1]}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-green">What's Included:</h3>
            <ul className="list-disc list-inside text-light-grey space-y-1 ml-2">
              {deal.whatsIncluded?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-light-grey leading-relaxed">
              <span className="font-bold text-green">How to Get This Deal:</span> {deal.howToGet}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">Comments ({deal.commentsList?.length})</h2>
          
          <div className="bg-grey rounded-lg p-4 space-y-4 border border-grey/50">
            <textarea 
              className="w-full bg-darker-grey border-none rounded-md p-4 min-h-[100px] text-white resize-none outline-none focus:ring-1 focus:ring-green"
              placeholder="Share your thoughts about this deal..."
            ></textarea>
            <div className="flex justify-end">
              <Button className="bg-green hover:bg-green/90 gap-2 cursor-pointer">
                <FiMessageSquare /> Post Comment
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {deal.commentsList?.map(comment => (
              <div key={comment.id} className="bg-grey rounded-lg p-4 border border-grey/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center font-bold text-lg">
                    {comment.user.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{comment.user.name}</span>
                      {comment.user.badge && (
                        <Badge className={`${comment.user.badge.toLowerCase() === 'gold' ? 'bg-gold' : 'bg-silver'} text-[10px] py-0 px-2 h-5 text-black`}>{comment.user.badge}</Badge>
                      )}
                      <span className="text-xs text-light-grey">• {comment.time}</span>
                    </div>
                    <p className="text-sm text-light-grey leading-relaxed">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1 text-xs text-light-grey hover:text-white transition-colors cursor-pointer">
                        <FiThumbsUp /> {comment.likes}
                      </button>
                      <button className="text-xs text-light-grey hover:text-white transition-colors cursor-pointer">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Deals */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDeals.map(d => (
              <DealCard 
                key={d.id} 
                deal={{
                  ...d,
                  storeIcon: getStoreIcon(d.storeIcon)
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
