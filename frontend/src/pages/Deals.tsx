import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { FaAmazon } from "react-icons/fa";
import { DealCard, type DealProps } from "@/components/shared/DealCard";

// Mock data for deals
const mockDeals: DealProps[] = Array(6).fill({
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
  trending: true,
  storeIcon: <FaAmazon className="w-5 h-5 text-white" />
}).map((deal, index) => ({ ...deal, id: index + 1 }));

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<DealProps[]>([]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setDeals(mockDeals);
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Deals</h1>
          <p className="text-light-grey">Browse all community-shared deals and discounts</p>
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
            <Button variant="outline" className="h-12 px-6 bg-darker-grey text-light-grey border-none flex items-center gap-2 hover:bg-darker-grey/80 hover:text-white cursor-pointer">
              <FiFilter className="w-5 h-5" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats and Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-light-grey font-medium">
            Showing {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-light-grey text-sm">Sort by:</span>
            <div className="relative">
              <select 
                defaultValue="popular"
                className="appearance-none w-[180px] bg-grey text-light-grey border-none h-10 px-4 pr-10 rounded-md cursor-pointer focus:ring-1 focus:ring-green outline-none"
              >
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
        {deals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12 pb-8">
              <Button variant="outline" className="bg-grey border-none hover:bg-grey/80 p-2">
                <FiChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>
              <Button className="bg-green hover:bg-green/90 w-10 h-10 p-0">1</Button>
              <Button variant="outline" className="bg-grey border-none hover:bg-grey/80 w-10 h-10 p-0">2</Button>
              <Button variant="outline" className="bg-grey border-none hover:bg-grey/80 w-10 h-10 p-0">3</Button>
              <Button variant="outline" className="bg-grey border-none hover:bg-grey/80 p-2">
                <span className="hidden sm:inline mr-1">Next</span>
                <FiChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-grey rounded-full flex items-center justify-center mb-6">
              <FiSearch className="w-10 h-10 text-light-grey" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No deals found</h3>
            <p className="text-light-grey max-w-md mb-8">
              We couldn't find any deals matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button 
              onClick={handleClearFilters}
              className="bg-green hover:bg-green/90 px-8 h-12 font-semibold"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
