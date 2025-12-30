import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiPlus, FiPackage } from 'react-icons/fi';
import { DealCard } from '@/components/features/deals';
import { getMyDeals } from '@/services/api/users.api';
import { mapDealToFrontend } from '@/lib/mappers';
import type { Deal } from '@/lib/types';

export default function MyDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchDeals() {
      setIsLoading(true);
      try {
        const response = await getMyDeals({ limit: 100 }); // Get many for now, or implement pagination
        const items = Array.isArray(response.data) ? response.data : [];
        setDeals(items.map(mapDealToFrontend));
        setTotal(response.total || items.length);
      } catch (error) {
        console.error('Failed to fetch user deals:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDeals();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Deals</h1>
          <p className="text-light-grey text-lg">
            {isLoading
              ? 'Fetching your deals...'
              : `You have shared ${total} deals with the community.`}
          </p>
        </div>
        <Link to="/dashboard/submit-deal">
          <Button className="bg-[#49b99f] hover:bg-[#3ea58c] text-white gap-2 h-[56px] px-8 rounded-2xl shadow-lg shadow-[#49b99f]/10 text-lg font-bold">
            <FiPlus className="w-6 h-6" />
            Add New Deal
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 bg-grey/30 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="bg-grey/30 rounded-3xl p-20 text-center border border-dashed border-white/10">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiPackage className="w-12 h-12 text-light-grey/20" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No deals found</h3>
          <p className="text-light-grey mb-10 max-w-sm mx-auto text-lg leading-relaxed">
            You haven't posted any deals yet. Start sharing with the community
            to earn karma!
          </p>
          <Link to="/dashboard/submit-deal">
            <Button className="bg-[#49b99f] hover:bg-[#3ea58c] text-white gap-2 h-[56px] px-10 rounded-2xl text-lg font-bold">
              <FiPlus className="w-6 h-6" />
              Post Your First Deal
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
