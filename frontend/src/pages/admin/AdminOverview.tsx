import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/features/admin/StatCard';
import {
  FiPackage,
  FiClock,
  FiTag,
  FiUsers,
  FiAlertCircle,
  FiShoppingCart,
} from 'react-icons/fi';
import { getAdminStats } from '@/services/api/admin.api';

interface Stats {
  totalDeals: number;
  activeDeals: number;
  pendingDeals: number;
  totalUsers: number;
  pendingReports: number;
  totalStores: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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
          value={loading ? '...' : stats?.totalDeals || 0}
          icon={FiPackage}
          trend={5}
        />
        <StatCard
          label="Pending Deals"
          value={loading ? '...' : stats?.pendingDeals || 0}
          icon={FiClock}
          trend={-2}
        />
        <StatCard
          label="Pending Reports"
          value={loading ? '...' : stats?.pendingReports || 0}
          icon={FiAlertCircle}
          trend={0}
        />
        <StatCard
          label="Total Users"
          value={loading ? '...' : stats?.totalUsers || 0}
          icon={FiUsers}
          trend={12}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          label="Active Deals"
          value={loading ? '...' : stats?.activeDeals || 0}
          icon={FiTag}
          trend={8}
        />
        <StatCard
          label="Total Stores"
          value={loading ? '...' : stats?.totalStores || 0}
          icon={FiShoppingCart}
          trend={3}
        />
      </div>

      {/* Activity Section Placeholder */}
      <div className="bg-[#2c2c2c] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-black text-white tracking-tight uppercase">
            Platform Health
          </h2>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mb-4">
            <FiTag className="text-green w-8 h-8" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">
            All Systems Operational
          </h3>
          <p className="text-light-grey max-w-sm">
            Platform is running smoothly. Use the sidebar to manage content,
            users, and reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
