import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FiPackage,
  FiMessageSquare,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import { getUserStats, getMyDeals } from '@/services/api/users.api';
import { useAuth } from '@/context/AuthContext';
import { DealCard } from '@/components/features/deals';
import { mapDealToFrontend } from '@/lib/mappers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="bg-grey border-none text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-light-grey">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-green" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-light-grey mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentDeals, setRecentDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [statsData, dealsData] = await Promise.all([
          getUserStats(),
          getMyDeals({ limit: 3 }),
        ]);
        setStats(statsData);
        setRecentDeals(dealsData.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-light-grey">
          Welcome back,{' '}
          <span className="text-green font-bold">{user?.username}</span>! Here's
          what's happening.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deals"
          value={isLoading ? '...' : stats?.dealsCount || 0}
          icon={FiPackage}
          description="Deals you've shared"
        />
        <StatCard
          title="Karma Points"
          value={isLoading ? '...' : stats?.karma || 0}
          icon={FiZap}
          description={`Level: ${stats?.level || 'Bronze'}`}
        />
        <StatCard
          title="Comments"
          value={isLoading ? '...' : stats?.commentsCount || 0}
          icon={FiMessageSquare}
          description="Total community interaction"
        />
        <StatCard
          title="Impact Score"
          value={isLoading ? '...' : stats?.impactScore || 0}
          icon={FiTrendingUp}
          description="Helpfulness rating"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-grey border-none text-white p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-6">Recent Deals</h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-darker-grey rounded-lg" />
                ))}
              </div>
            ) : recentDeals.length > 0 ? (
              <div className="grid gap-4">
                {recentDeals.map((deal) => (
                  <DealCard key={deal.id} deal={mapDealToFrontend(deal)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-light-grey">
                <FiPackage className="w-12 h-12 mb-4 opacity-20" />
                <p>No deals submitted yet.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-grey border-none text-white p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Community Activity</h3>
          <div className="flex flex-col items-center justify-center h-48 text-light-grey">
            <FiMessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Recent comments on your deals will appear here.</p>
            <span className="text-xs italic mt-2 opacity-50">
              (Coming soon: Comment notifications)
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
