import React, { useEffect, useState } from 'react';
import {
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiSearch,
  FiAlertTriangle,
  FiPauseCircle,
  FiPlayCircle,
  FiBarChart2,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  getAdminDeals,
  freezeVoting,
  unfreezeVoting,
  getVotingAnalytics,
} from '@/services/api/admin.api';

const calculateTemperature = (hot: number, cold: number) => {
  return hot - cold;
};

import { toast } from 'react-hot-toast';

const AnalyticsCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: any;
  colorClass: string;
}) => (
  <div className="bg-[#333333] p-8 rounded-[1.75rem] border border-white/5 flex-1 shadow-2xl relative overflow-hidden group">
    <div
      className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 ${colorClass}`}>
      <Icon className="w-24 h-24" />
    </div>
    <div className="relative z-10">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <h3 className="text-4xl font-black text-white tracking-tighter mb-2">
        {value}
      </h3>
      <p className="text-[#a0a0a0] font-bold uppercase tracking-widest text-xs mb-1">
        {label}
      </p>
      <p className="text-light-grey opacity-40 text-xs font-medium">
        {subtext}
      </p>
    </div>
  </div>
);

const AdminVoting: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dealsData = await getAdminDeals();
      setDeals(dealsData.data || []);

      const stats = await getVotingAnalytics();
      setAnalytics(stats);
    } catch (error) {
      console.error('Failed to fetch voting data:', error);
      toast.error('Failed to load voting data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVoting = async (id: string, currentlyFrozen: boolean) => {
    try {
      if (currentlyFrozen) {
        await unfreezeVoting(id);
        toast.success('Voting unfrozen');
      } else {
        await freezeVoting(id);
        toast.success('Voting frozen');
      }
      fetchData();
    } catch (error) {
      toast.error('Failed to update voting status');
    }
  };

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
          Voting System
        </h1>
        <p className="text-light-grey text-lg font-medium opacity-60">
          Monitor trends, analyze temperatures, and moderate voting fraud
        </p>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          label="Total Votes"
          value={analytics?.totalVotes || '0'}
          subtext="Lifetime platform interaction"
          icon={FiTrendingUp}
          colorClass="text-red-500"
        />
        <AnalyticsCard
          label="Platform Users"
          value={analytics?.uniqueVoters || '0'}
          subtext="Unique users who voted"
          icon={FiActivity}
          colorClass="text-[#49b99f]"
        />
        <AnalyticsCard
          label="Frozen Deals"
          value={`${deals.filter((d) => d.isVotingFrozen).length} Deals`}
          subtext="Voting currently suspended"
          icon={FiAlertTriangle}
          colorClass="text-orange-500"
        />
      </div>

      {/* Main Table Section */}
      <div className="bg-[#2c2c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Search Header */}
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#252525]">
          <h3 className="text-xl font-bold text-white tracking-tight uppercase flex items-center gap-3">
            <FiBarChart2 className="text-[#49b99f]" /> Voting Overview
          </h3>

          <div className="relative w-full md:w-96 group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-light-grey transition-colors group-focus-within:text-[#49b99f]" />
            <Input
              placeholder="Search deals..."
              className="pl-14 bg-[#1a1a1a] border-white/5 rounded-2xl h-14 text-white focus:ring-1 focus:ring-[#49b99f]/30 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 p-8">
          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center text-light-grey">
                Loading deals...
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40">
                      Deal Info
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40 text-center">
                      Temperature
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40 text-center">
                      Votes Breakdown
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40 text-center">
                      Status
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((deal) => {
                    const temp = calculateTemperature(
                      deal.hotVotes || 0,
                      deal.coldVotes || 0
                    );
                    return (
                      <tr key={deal.id} className="group">
                        <td className="px-6 py-4 bg-[#1a1a1a]/50 rounded-l-[1.5rem] first:border-l border-y border-white/5">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-sm tracking-tight group-hover:text-[#49b99f] transition-colors">
                              {deal.title}
                            </span>
                            <span className="text-[10px] text-light-grey font-bold opacity-60">
                              by {deal.user?.username || 'Anonymous'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5 text-center">
                          <span
                            className={cn(
                              'text-xl font-black',
                              temp > 0
                                ? 'text-red-500'
                                : temp < 0
                                ? 'text-blue-400'
                                : 'text-light-grey'
                            )}>
                            {temp}°
                          </span>
                        </td>
                        <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5 text-center">
                          <div className="flex items-center justify-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1 text-red-500">
                              <FiTrendingUp /> {deal.hotVotes || 0}
                            </span>
                            <span className="flex items-center gap-1 text-blue-400">
                              <FiTrendingDown /> {deal.coldVotes || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5 text-center">
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                              !deal.isVotingFrozen
                                ? 'bg-[#49b99f]/10 text-[#49b99f]'
                                : 'bg-red-500/10 text-red-500'
                            )}>
                            {!deal.isVotingFrozen ? 'Active' : 'Frozen'}
                          </span>
                        </td>
                        <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-r border-white/5 rounded-r-[1.5rem] text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleToggleVoting(deal.id, deal.isVotingFrozen)
                              }
                              className={cn(
                                'p-2 rounded-xl transition-all hover:scale-110',
                                !deal.isVotingFrozen
                                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                  : 'bg-[#49b99f]/10 text-[#49b99f] hover:bg-[#49b99f]/20'
                              )}
                              title={
                                !deal.isVotingFrozen
                                  ? 'Freeze Voting'
                                  : 'Enable Voting'
                              }>
                              {!deal.isVotingFrozen ? (
                                <FiPauseCircle className="w-5 h-5" />
                              ) : (
                                <FiPlayCircle className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoting;
