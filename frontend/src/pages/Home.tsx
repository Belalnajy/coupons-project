import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  FiClock,
  FiTrendingUp,
  FiGrid,
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { DealCard } from '@/components/features/deals';
import { getDeals, getBanners, getCategories } from '@/services/api';
import type { Deal, DealsQueryParams } from '@/lib/types';
import { mapDealToFrontend } from '@/lib/mappers';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks';

// Helper to get store icon component from icon identifier

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    'latest' | 'hottest' | 'ending' | 'category'
  >('latest');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState('All');
  const [minDiscount, setMinDiscount] = useState('Any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);

  // Map tab to sort parameter
  const tabToSort = {
    latest: 'newest' as const,
    hottest: 'hottest' as const,
    ending: 'closing' as const,
    category: 'popular' as const,
  };

  // Fetch banners and categories on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoadingBanners(true);
      try {
        const [bannerData, catData] = await Promise.all([
          getBanners({ placement: 'home_top' }),
          getCategories(),
        ]);
        setBanners(Array.isArray(bannerData) ? bannerData : []);
        setCategories(catData || []);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoadingBanners(false);
      }
    }
    fetchData();
  }, []);

  // Map filters to API params
  const getFilterParams = () => {
    const params: Partial<DealsQueryParams> = {};
    if (selectedCategory !== 'All') {
      const cat = categories.find((c) => c.name === selectedCategory);
      if (cat) params.category = cat.slug;
    }

    if (priceRange !== 'All') {
      if (priceRange === 'Under £50') params.maxPrice = 50;
      if (priceRange === '£50-£200') {
        params.minPrice = 50;
        params.maxPrice = 200;
      }
      if (priceRange === '£200-£500') {
        params.minPrice = 200;
        params.maxPrice = 500;
      }
      if (priceRange === '£500+') params.minPrice = 500;
    }

    if (minDiscount !== 'Any') {
      params.minDiscount = parseInt(minDiscount);
    }

    if (verifiedOnly) params.isVerified = true;
    if (expiringSoon) params.isExpiringSoon = true;
    if (freeDelivery) params.freeDelivery = true;

    return params;
  };

  // Fetch deals when tab, filters or page change
  useEffect(() => {
    async function fetchDeals() {
      setIsLoadingDeals(true);
      try {
        const params = getFilterParams();
        const response = await getDeals({
          page: currentPage,
          limit: 6,
          sort: tabToSort[activeTab],
          search: debouncedSearch,
          ...params,
        });

        const dealItems = Array.isArray(response.data) ? response.data : [];
        setDeals(dealItems.map(mapDealToFrontend));
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setIsLoadingDeals(false);
      }
    }
    fetchDeals();
  }, [
    activeTab,
    debouncedSearch,
    selectedCategory,
    priceRange,
    minDiscount,
    verifiedOnly,
    expiringSoon,
    freeDelivery,
    categories,
    currentPage,
  ]);

  // Reset page to 1 when filters or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    debouncedSearch,
    selectedCategory,
    priceRange,
    minDiscount,
    verifiedOnly,
    expiringSoon,
    freeDelivery,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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

      {/* Dynamic Banners Component */}
      <div className="container mx-auto px-4 mt-6">
        {isLoadingBanners ? (
          <div className="w-full h-64 bg-grey rounded-xl animate-pulse" />
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {banners.map((banner) => (
              <a
                key={banner.id}
                href={banner.targetUrl || '#'}
                className="relative overflow-hidden rounded-xl block group">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-auto min-h-[200px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center text-center text-white p-6">
                  <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter uppercase drop-shadow-2xl">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-lg md:text-xl font-bold opacity-90 tracking-tight drop-shadow-lg">
                      {banner.subtitle}
                    </p>
                  )}
                  <Badge className="mt-4 bg-[#49b99f] hover:bg-[#49b99f] text-white p-1.5 px-6 rounded-full font-black text-xs tracking-widest uppercase border-0 shadow-xl shadow-[#49b99f]/20">
                    Discover Now
                  </Badge>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* Fallback static banner if no active ones */
          <div className="relative overflow-hidden rounded-xl">
            <img
              src="/banner.png"
              alt="Welcome Banner"
              className="w-full h-auto object-cover opacity-30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Welcome to Waferlee</h1>
              <p className="text-xl opacity-90">
                Find the best deals & coupons around you
              </p>
            </div>
          </div>
        )}
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
        {/* Advanced Filtration Bar */}
        <div className="bg-grey rounded-2xl p-6 mb-8 border border-white/5 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-grey w-5 h-5 opacity-50" />
              <Input
                placeholder="Search deals by title, store, or category..."
                className="pl-12 bg-darker-grey border-white/5 h-14 text-white placeholder:text-light-grey/40 rounded-xl focus-visible:ring-1 focus-visible:ring-green text-lg transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'h-14 px-8 font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 rounded-xl border border-white/5 shadow-lg',
                showFilters
                  ? 'bg-green text-white shadow-green/20'
                  : 'bg-darker-grey text-light-grey hover:bg-darker-grey/80 hover:text-white'
              )}>
              <FiFilter className="w-5 h-5" />
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-300">
              {/* Category Chips */}
              <div className="space-y-4">
                <h4 className="text-light-grey/60 text-[10px] font-black uppercase tracking-widest pl-1">
                  Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['All', ...categories.map((c) => c.name)]
                    .slice(0, 10)
                    .map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          'px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer',
                          selectedCategory === cat
                            ? 'bg-green border-green text-white shadow-lg shadow-green/20'
                            : 'bg-darker-grey border-white/5 text-light-grey hover:border-white/20 hover:text-white'
                        )}>
                        {cat === 'All' ? 'All Categories' : cat}
                      </button>
                    ))}
                </div>
              </div>

              {/* Price Range Chips */}
              <div className="space-y-4">
                <h4 className="text-light-grey/60 text-[10px] font-black uppercase tracking-widest pl-1">
                  Price Range
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Under £50', '£50-£200', '£200-£500', '£500+'].map(
                    (range) => (
                      <button
                        key={range}
                        onClick={() => setPriceRange(range)}
                        className={cn(
                          'px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer',
                          priceRange === range
                            ? 'bg-green border-green text-white shadow-lg shadow-green/20'
                            : 'bg-darker-grey border-white/5 text-light-grey hover:border-white/20 hover:text-white'
                        )}>
                        {range}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Minimum Discount Chips */}
              <div className="space-y-4">
                <h4 className="text-light-grey/60 text-[10px] font-black uppercase tracking-widest pl-1">
                  Minimum Discount
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Any', '10%', '25%', '50%'].map((disc) => (
                    <button
                      key={disc}
                      onClick={() => setMinDiscount(disc)}
                      className={cn(
                        'px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer',
                        minDiscount === disc
                          ? 'bg-green border-green text-white shadow-lg shadow-green/20'
                          : 'bg-darker-grey border-white/5 text-light-grey hover:border-white/20 hover:text-white'
                      )}>
                      {disc === 'Any' ? 'Any' : `${disc}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-8 pt-2">
                <div
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}>
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) =>
                      setVerifiedOnly(checked as boolean)
                    }
                    className="border-white/20 data-[state=checked]:bg-green data-[state=checked]:border-green w-5 h-5 rounded-md transition-all group-hover:border-green/50"
                  />
                  <Label
                    htmlFor="verified"
                    className="text-sm font-bold text-light-grey transition-colors group-hover:text-white cursor-pointer select-none">
                    Verified deals only
                  </Label>
                </div>

                <div
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={() => setExpiringSoon(!expiringSoon)}>
                  <Checkbox
                    id="expiring"
                    checked={expiringSoon}
                    onCheckedChange={(checked) =>
                      setExpiringSoon(checked as boolean)
                    }
                    className="border-white/20 data-[state=checked]:bg-green data-[state=checked]:border-green w-5 h-5 rounded-md transition-all group-hover:border-green/50"
                  />
                  <Label
                    htmlFor="expiring"
                    className="text-sm font-bold text-light-grey transition-colors group-hover:text-white cursor-pointer select-none">
                    Expiring soon
                  </Label>
                </div>

                <div
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={() => setFreeDelivery(!freeDelivery)}>
                  <Checkbox
                    id="delivery"
                    checked={freeDelivery}
                    onCheckedChange={(checked) =>
                      setFreeDelivery(checked as boolean)
                    }
                    className="border-white/20 data-[state=checked]:bg-green data-[state=checked]:border-green w-5 h-5 rounded-md transition-all group-hover:border-green/50"
                  />
                  <Label
                    htmlFor="delivery"
                    className="text-sm font-bold text-light-grey transition-colors group-hover:text-white cursor-pointer select-none">
                    Free delivery
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="w-full md:w-auto">
            <TabsList className="bg-grey p-1 h-12 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto flex justify-start md:justify-center">
              <TabsTrigger
                value="latest"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-6 rounded-lg transition-all">
                <FiTrendingUp className="w-4 h-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="hottest"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-6 rounded-lg transition-all">
                <FaFire className="w-4 h-4" />
                Hottest
              </TabsTrigger>
              <TabsTrigger
                value="ending"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-6 rounded-lg transition-all">
                <FiClock className="w-4 h-4" />
                Ending Soon
              </TabsTrigger>
              <TabsTrigger
                value="category"
                className="gap-2 text-light-grey data-[state=active]:bg-green data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] px-6 rounded-lg transition-all">
                <FiGrid className="w-4 h-4" />
                By Category
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 mb-12">
            <Button
              variant="outline"
              className="bg-grey border-none hover:bg-grey/80 p-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              <FiChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                className={
                  page === currentPage
                    ? 'bg-green hover:bg-green/90 w-10 h-10 p-0'
                    : 'bg-grey border-none hover:bg-grey/80 w-10 h-10 p-0'
                }
                variant={page === currentPage ? 'default' : 'outline'}
                onClick={() => handlePageChange(page)}>
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              className="bg-grey border-none hover:bg-grey/80 p-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              <span className="hidden sm:inline mr-1">Next</span>
              <FiChevronRight className="w-5 h-5" />
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
