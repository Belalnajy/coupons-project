import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiTag,
  FiPlus,
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { DealCard } from '@/components/features/deals';
import { getDeals, getBanners, getCategories } from '@/services/api';
import { useDebounce } from '@/hooks';
import type { Deal, DealsQueryParams } from '@/lib/types';
import { mapDealToFrontend } from '@/lib/mappers';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [bannersTop, setBannersTop] = useState<any[]>([]);
  const [bannersSidebar, setBannersSidebar] = useState<any[]>([]);
  const [bannersCategory, setBannersCategory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [sort, setSort] = useState<DealsQueryParams['sort']>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeals, setTotalDeals] = useState(0);

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [minDiscount, setMinDiscount] = useState('Any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const DEALS_PER_PAGE = 6;

  // Fetch banners and categories on mount
  useEffect(() => {
    async function fetchSidebarData() {
      setIsLoadingBanners(true);
      try {
        const [top, side, cat, allCats] = await Promise.all([
          getBanners({ placement: 'deals_top' }),
          getBanners({ placement: 'sidebar' }),
          getBanners({ placement: 'category_page' }),
          getCategories(),
        ]);
        setBannersTop(top || []);
        setBannersSidebar(side || []);
        setBannersCategory(cat || []);
        setCategories(allCats || []);
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error);
      } finally {
        setIsLoadingBanners(false);
      }
    }
    fetchSidebarData();
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

  // Fetch deals
  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = getFilterParams();
      const response = await getDeals({
        page: currentPage,
        limit: DEALS_PER_PAGE,
        sort,
        search: debouncedSearch,
        ...params,
      });
      const dealItems = Array.isArray(response.data) ? response.data : [];
      setDeals(dealItems.map(mapDealToFrontend));
      setTotalPages(response.totalPages);
      setTotalDeals(response.total);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    sort,
    debouncedSearch,
    selectedCategory,
    priceRange,
    minDiscount,
    verifiedOnly,
    expiringSoon,
    freeDelivery,
    categories,
  ]);

  // Fetch on mount and when params change
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sort]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSort('popular');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 3;

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
    <div className="min-h-screen bg-background text-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Deals</h1>
          <p className="text-light-grey">
            Browse all community-shared deals and discounts
          </p>
        </div>

        {/* Dynamic Banners Component - Top */}
        <div className="mb-4">
          {isLoadingBanners ? (
            <div className="w-full h-48 bg-grey rounded-xl animate-pulse" />
          ) : (
            bannersTop.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {bannersTop.map((banner: any) => (
                  <a
                    key={banner.id}
                    href={banner.targetUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden rounded-xl block group h-48">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center text-center text-white p-6">
                      <h2 className="text-2xl md:text-3xl font-black mb-1 tracking-tighter uppercase drop-shadow-2xl">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="text-base md:text-lg font-bold opacity-90 tracking-tight drop-shadow-lg">
                          {banner.subtitle}
                        </p>
                      )}
                      <Badge className="mt-3 bg-[#49b99f] hover:bg-[#49b99f] shadow-[0_0_15px_rgba(73,185,159,0.4)] text-white p-1 px-6 rounded-md font-black text-[12px] tracking-widest uppercase border-0 transition-all group-hover:scale-110">
                        View Offer
                      </Badge>
                    </div>
                  </a>
                ))}
              </div>
            )
          )}
        </div>

        {/* Dynamic Banners Component - Category */}
        <div className="mb-8">
          {bannersCategory.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bannersCategory.map((banner: any) => (
                <a
                  key={banner.id}
                  href={banner.targetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden rounded-xl block group h-32">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
                      {banner.title}
                    </h3>
                    <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-[10px] uppercase font-bold tracking-widest px-4">
                      Explore Deals
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Search and Filter Bar */}
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
              {/* Category */}
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

              {/* Price Range */}
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

              {/* Minimum Discount */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-9">
            {/* Stats and Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-light-grey font-medium">
                {isLoading
                  ? 'Loading...'
                  : `Showing ${deals.length} out of ${totalDeals} deals`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-light-grey text-sm">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value as DealsQueryParams['sort'])
                    }
                    className="appearance-none w-[180px] bg-grey text-light-grey border-none h-10 px-4 pr-10 rounded-md cursor-pointer focus:ring-1 focus:ring-green outline-none">
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="hottest">Hottest Deals</option>
                    <option value="closing">Ending Soon</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-light-grey pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Deals Content */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-grey rounded-lg h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : deals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                  {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal as any} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pb-8">
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
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-grey rounded-full flex items-center justify-center mb-6">
                  <FiSearch className="w-10 h-10 text-light-grey" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No deals found</h3>
                <p className="text-light-grey max-w-md mb-8">
                  We couldn't find any deals matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-green hover:bg-green/90 px-8 h-12 font-semibold cursor-pointer">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-grey rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                <FaFire className="text-red-500" /> Hot Offers
              </h3>
              <div className="space-y-4">
                {bannersSidebar.length > 0 ? (
                  bannersSidebar.map((banner: any) => (
                    <a
                      key={banner.id}
                      href={banner.targetUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative overflow-hidden rounded-xl border border-white/5">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-4">
                        <p className="text-white font-bold text-sm tracking-tight drop-shadow-lg mb-2">
                          {banner.title}
                        </p>
                        <span className="text-[10px] text-green font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          View details →
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="aspect-3/4 bg-darker-grey rounded-xl flex items-center justify-center border border-dashed border-white/10 italic text-light-grey text-sm text-center px-4">
                    Check back soon for exclusive offers!
                  </div>
                )}
              </div>
            </div>

            {/* Browse Categories */}
            {/* <div className="bg-grey rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                <FiTag className="text-[#49b99f]" /> Browse Categories
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categories.length > 0 ? (
                  categories.slice(0, 8).map((cat: any) => (
                    <Link
                      key={cat.id}
                      to={`/deals?category=${cat.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-[#49b99f]/10 border border-white/5 hover:border-[#49b99f]/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[#49b99f]/10 flex items-center justify-center text-[#49b99f] group-hover:bg-[#49b99f] group-hover:text-white transition-colors">
                          <FiTag className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-bold text-light-grey group-hover:text-white transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#49b99f] transition-all group-hover:translate-x-1" />
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-light-grey italic opacity-40">
                    Loading categories...
                  </p>
                )}
              </div>
            </div> */}

            {/* Submit Deal CTA */}
            <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#49b99f] to-[#3a947f] p-6 shadow-xl shadow-[#49b99f]/10 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
              <div className="relative z-10">
                <h4 className="text-white font-black uppercase tracking-tighter text-xl mb-1">
                  Share a Deal!
                </h4>
                <p className="text-white/80 text-sm mb-6 leading-snug font-medium">
                  Found a great discount? Share it with the community and help
                  others save!
                </p>
                <Link to="/dashboard/submit-deal">
                  <Button className="w-full bg-white text-[#49b99f] hover:bg-white/90 h-11 font-black uppercase tracking-widest text-[11px] rounded-lg shadow-lg border-0 cursor-pointer">
                    <FiPlus className="w-4 h-4 mr-2" />
                    Submit Now
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
