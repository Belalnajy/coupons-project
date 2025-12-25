import React from 'react';
import { StatCard } from '@/components/features/admin/StatCard';
import {
  ActivityItem,
  type ActivityType,
} from '@/components/features/admin/ActivityItem';
import { FiPackage, FiClock, FiTag, FiUsers } from 'react-icons/fi';

interface MockActivity {
  id: string;
  type: ActivityType;
  title: string;
  user: string;
  description: string;
  timestamp: string;
}

const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: '1',
    type: 'submission',
    title: 'New deal submitted',
    user: 'DealsHunter123',
    description: 'Samsung Galaxy S24 Ultra - 50% Off',
    timestamp: '5 minutes ago',
  },
  {
    id: '2',
    type: 'approval',
    title: 'Deal approved',
    user: 'Admin',
    description: 'Apple AirPods Pro 2 - 35% Discount',
    timestamp: '12 minutes ago',
  },
  {
    id: '3',
    type: 'submission',
    title: 'New deal submitted',
    user: 'DealMaster',
    description: 'Nike Air Max 2024 - 40% Voucher',
    timestamp: '45 minutes ago',
  },
];

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
          Dashboard Overview
        </h1>
        <p className="text-light-grey text-lg font-medium opacity-60">
          Platform activity and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Deals"
          value={1247}
          trend={12}
          icon={FiPackage}
        />
        <StatCard label="Pending Deals" value={23} trend={-5} icon={FiClock} />
        <StatCard label="Active Coupons" value={89} trend={3} icon={FiTag} />
        <StatCard label="Total Users" value={4582} trend={18} icon={FiUsers} />
      </div>

      {/* Activity Section */}
      <div className="bg-[#2c2c2c] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-black text-white tracking-tight uppercase">
            Recent Activity
          </h2>
          <button className="text-[10px] font-black uppercase tracking-widest text-[#49b99f] hover:underline cursor-pointer">
            View All
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {MOCK_ACTIVITIES.map((activity) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                title={activity.title}
                user={activity.user}
                description={activity.description}
                timestamp={activity.timestamp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
