import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiPlus, FiPackage } from 'react-icons/fi';
import { DealCard } from '@/components/features/deals';
import type { DealProps } from '@/components/features/deals/DealCard';

const MOCK_USER_DEALS: DealProps[] = [
  {
    id: 1,
    title: 'Apple MacBook Air M2 - $899 at Amazon',
    store: 'Amazon',
    price: '$899',
    originalPrice: '$1,199',
    discount: '25% OFF',
    comments: 12,
    timePosted: '2 hours ago',
    timeLeft: '3 days',
    verified: true,
    trending: true,
    heatScore: 345,
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 Noise Canceling Headphones',
    store: 'Best Buy',
    price: '$298',
    originalPrice: '$399',
    discount: '25% OFF',
    comments: 8,
    timePosted: '5 hours ago',
    timeLeft: '1 day',
    verified: true,
    trending: false,
    heatScore: 120,
  },
];

export default function MyDeals() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Deals</h1>
          <p className="text-light-grey text-lg">
            Manage and track the performance of your shared deals.
          </p>
        </div>
        <Link to="/dashboard/submit-deal">
          <Button className="bg-[#49b99f] hover:bg-[#3ea58c] text-white gap-2 h-[56px] px-8 rounded-2xl shadow-lg shadow-[#49b99f]/10 text-lg font-bold">
            <FiPlus className="w-6 h-6" />
            Add New Deal
          </Button>
        </Link>
      </div>

      {MOCK_USER_DEALS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {MOCK_USER_DEALS.map((deal) => (
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
