import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from 'react-icons/fi';
import { FaAmazon } from 'react-icons/fa';
import { DealCard } from '@/components/features/deals';
import { getDeals } from '@/services/api';
import { useDebounce } from '@/hooks';
import type { Deal, DealsQueryParams } from '@/lib/types';

// Helper to get store icon component from icon identifier
function getStoreIcon(storeIcon?: string) {
  switch (storeIcon) {
    case 'amazon':
      return <FaAmazon className="w-5 h-5 text-white" />;
    default:
      return null;
  }
}

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<DealsQueryParams['sort']>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeals, setTotalDeals] = useState(0);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const DEALS_PER_PAGE = 12;

  // Fetch deals
  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDeals({
        page: currentPage,
        limit: DEALS_PER_PAGE,
        sort,
        search: debouncedSearch,
      });
      setDeals(response.data);
      setTotalPages(response.totalPages);
      setTotalDeals(response.total);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sort, debouncedSearch]);

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

        {/* Search and Filter Bar */}
        <div className="bg-grey rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-grey w-5 h-5" />
              <Input
                placeholder="Search deals by title, store, or category..."
                className="pl-10 bg-darker-grey border-none h-12 text-white placeholder:text-light-grey focus-visible:ring-1 focus-visible:ring-green"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6 bg-darker-grey text-light-grey border-none flex items-center gap-2 hover:bg-darker-grey/80 hover:text-white cursor-pointer">
              <FiFilter className="w-5 h-5" />
              Filter
            </Button>
          </div>
        </div>

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
              <div key={i} className="bg-grey rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <>
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
              We couldn't find any deals matching your criteria. Try adjusting
              your filters or search terms.
            </p>
            <Button
              onClick={handleClearFilters}
              className="bg-green hover:bg-green/90 px-8 h-12 font-semibold cursor-pointer">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
