import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FiClock, FiTrendingUp, FiGrid, FiFilter } from 'react-icons/fi';
import { FaFire, FaAmazon } from 'react-icons/fa';
import { DealCard } from '@/components/features/deals';
import { getDeals } from '@/services/api';
import type { Deal } from '@/lib/types';

// Helper to get store icon component from icon identifier
function getStoreIcon(storeIcon?: string) {
  switch (storeIcon) {
    case 'amazon':
      return <FaAmazon className="w-5 h-5 text-white" />;
    default:
      return null;
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    'latest' | 'hottest' | 'ending' | 'category'
  >('latest');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [dealsPage, setDealsPage] = useState(1);
  const [hasMoreDeals, setHasMoreDeals] = useState(true);

  // Map tab to sort parameter
  const tabToSort = {
    latest: 'newest' as const,
    hottest: 'hottest' as const,
    ending: 'closing' as const,
    category: 'popular' as const,
  };

  // Fetch deals when tab changes
  useEffect(() => {
    async function fetchDeals() {
      setIsLoadingDeals(true);
      setDealsPage(1);
      try {
        const response = await getDeals({
          page: 1,
          limit: 6,
          sort: tabToSort[activeTab],
        });
        setDeals(response.data);
        setHasMoreDeals(response.page < response.totalPages);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setIsLoadingDeals(false);
      }
    }
    fetchDeals();
  }, [activeTab]);

  // Load more deals
  const handleLoadMore = async () => {
    const nextPage = dealsPage + 1;
    try {
      const response = await getDeals({
        page: nextPage,
        limit: 6,
        sort: tabToSort[activeTab],
      });
      setDeals((prev) => [...prev, ...response.data]);
      setDealsPage(nextPage);
      setHasMoreDeals(response.page < response.totalPages);
    } catch (error) {
      console.error('Failed to load more deals:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner Alert */}
      <div className="bg-[#202020] border text-white py-2 px-4 text-center text-sm ">
        <span className="inline-flex items-center gap-2 text-lg font-semibold">
          <FaFire className="w-4 h-4 text-orange-500" />
          Today's Top Deals–Top voted offers right now
        </span>
      </div>

      {/* Christmas Sale Banner */}
      <div className="container mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-xl">
          {/* Background Image */}
          <img
            src="/banner.png"
            alt="Christmas Sale Banner"
            className="w-full h-auto object-cover"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-5xl font-bold mb-4">🎄 Christmas Sale</h1>
            <Badge className="bg-grey text-white hover:bg-red-700 mb-4 p-1 rounded-md">
              LIMITED TIME
            </Badge>
            <p className="text-xl opacity-90">
              Save up to 70% on electronics, fashion & more
            </p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="text-white py-3 px-4">
        <div className="container mx-auto flex items-center gap-2 bg-grey rounded-md p-2 text-lg">
          <FiClock className="w-4 h-4 text-green" />
          Latest: 50+ new deals added today • Popular coupons refreshed hourly
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="w-auto">
            <TabsList className=" bg-grey">
              <TabsTrigger
                value="latest"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <FiTrendingUp className="w-4 h-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="hottest"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <FaFire className="w-4 h-4" />
                Hottest
              </TabsTrigger>
              <TabsTrigger
                value="ending"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <FiClock className="w-4 h-4" />
                Ending Soon
              </TabsTrigger>
              <TabsTrigger
                value="category"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white">
                <FiGrid className="w-4 h-4" />
                By Category
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" className="gap-2 text-light-grey bg-grey">
            <FiFilter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Deals Count */}
        <p className="text-light-grey font-semibold text-lg mb-6">
          {isLoadingDeals
            ? 'Loading deals...'
            : `Showing ${deals.length} deals`}
        </p>

        {/* Deal Cards Grid */}
        {isLoadingDeals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-grey rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={{
                  ...deal,
                  storeIcon: getStoreIcon(deal.storeIcon),
                }}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMoreDeals && !isLoadingDeals && (
          <div className="text-center mb-12">
            <Button
              variant="link"
              className="text-green cursor-pointer text-md"
              onClick={handleLoadMore}>
              Load more deals →
            </Button>
          </div>
        )}

        <Separator className="my-12" />

        {/* Popular Coupons Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Popular Coupons</h2>
            <Link
              to="/coupons"
              className="text-green hover:underline text-sm cursor-pointer">
              View all coupons →
            </Link>
          </div>

          <div className="bg-grey rounded-lg overflow-hidden">
            <iframe
              src="https://coupons.dcmnetwork.com/widget?widgetId=fadd30b6-fa9c-4a60-83dc-a47ab15f115c"
              width="100%"
              height="800"
              style={{ border: 'none' }}
              title="Exclusive Coupons Widget"
              className="w-full min-h-[800px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
