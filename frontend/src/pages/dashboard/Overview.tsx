import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FiPackage,
  FiMessageSquare,
  FiTag,
  FiTrendingUp,
} from 'react-icons/fi';

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-light-grey">
          Welcome back, here's what's happening with your deals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deals"
          value="12"
          icon={FiPackage}
          description="+2 from last month"
        />
        <StatCard
          title="My Coupons"
          value="5"
          icon={FiTag}
          description="3 active right now"
        />
        <StatCard
          title="Comments"
          value="48"
          icon={FiMessageSquare}
          description="+12 this week"
        />
        <StatCard
          title="Total Views"
          value="1,284"
          icon={FiTrendingUp}
          description="+18% since yesterday"
        />
      </div>

      {/* Placeholder for Recent Activity or Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-grey border-none text-white p-6 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Recent Deals</h3>
          <div className="flex flex-col items-center justify-center h-full text-light-grey">
            <FiPackage className="w-12 h-12 mb-4 opacity-20" />
            <p>Your recently submitted deals will appear here.</p>
          </div>
        </Card>
        <Card className="bg-grey border-none text-white p-6 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Community Activity</h3>
          <div className="flex flex-col items-center justify-center h-full text-light-grey">
            <FiMessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Recent comments on your deals will appear here.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
