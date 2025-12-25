import React, { useState } from 'react';
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

interface VotingDeal {
  id: string;
  title: string;
  author: string;
  hotVotes: number;
  coldVotes: number;
  decayFactor: number;
  isVotingEnabled: boolean;
  isFlagged: boolean;
}

const MOCK_VOTING_DEALS: VotingDeal[] = [
  {
    id: '1',
    title: 'PlayStation 5 Slim Console',
    author: 'GamerPro',
    hotVotes: 450,
    coldVotes: 12,
    decayFactor: 0.95,
    isVotingEnabled: true,
    isFlagged: false,
  },
  {
    id: '2',
    title: 'Samsung 65" 4K TV',
    author: 'TechSavvy',
    hotVotes: 890,
    coldVotes: 45,
    decayFactor: 0.8, // Older deal, decayed more
    isVotingEnabled: true,
    isFlagged: false,
  },
  {
    id: '3',
    title: 'Suspicious 99% Off iPhone',
    author: 'UnknownUser',
    hotVotes: 50,
    coldVotes: 200,
    decayFactor: 1.0,
    isVotingEnabled: false,
    isFlagged: true,
  },
  {
    id: '4',
    title: 'Free Coffee Coupon',
    author: 'CoffeeLover',
    hotVotes: 120,
    coldVotes: 5,
    decayFactor: 0.98,
    isVotingEnabled: true,
    isFlagged: false,
  },
];

const calculateTemperature = (hot: number, cold: number, decay: number) => {
  return Math.round((hot - cold) * decay);
};

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
  const [deals, setDeals] = useState(MOCK_VOTING_DEALS);
  const [search, setSearch] = useState('');

  const toggleVoting = (id: string) => {
    setDeals(
      deals.map((deal) =>
        deal.id === id
          ? { ...deal, isVotingEnabled: !deal.isVotingEnabled }
          : deal
      )
    );
  };

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(search.toLowerCase())
  );

  const hottestDeal = [...deals].sort(
    (a, b) =>
      calculateTemperature(b.hotVotes, b.coldVotes, b.decayFactor) -
      calculateTemperature(a.hotVotes, a.coldVotes, a.decayFactor)
  )[0];

  const mostActiveDeal = [...deals]
    .sort((a, b) => a.hotVotes + a.coldVotes - (b.hotVotes + b.coldVotes))
    .reverse()[0];

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
          label="Hottest Deal"
          value={`${calculateTemperature(
            hottestDeal.hotVotes,
            hottestDeal.coldVotes,
            hottestDeal.decayFactor
          )}°`}
          subtext={hottestDeal.title}
          icon={FiTrendingUp}
          colorClass="text-red-500"
        />
        <AnalyticsCard
          label="Most Active"
          value={`${mostActiveDeal.hotVotes + mostActiveDeal.coldVotes} Votes`}
          subtext={mostActiveDeal.title}
          icon={FiActivity}
          colorClass="text-[#49b99f]"
        />
        <AnalyticsCard
          label="Suspicious Activity"
          value="1 Flagged"
          subtext="Requires meaningful review"
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
                    deal.hotVotes,
                    deal.coldVotes,
                    deal.decayFactor
                  );
                  return (
                    <tr key={deal.id} className="group">
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 rounded-l-[1.5rem] first:border-l border-y border-white/5">
                        <div className="flex flex-col">
                          <span className="text-white font-black text-sm tracking-tight group-hover:text-[#49b99f] transition-colors">
                            {deal.title}
                          </span>
                          <span className="text-[10px] text-light-grey font-bold opacity-60">
                            by {deal.author}
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
                            <FiTrendingUp /> {deal.hotVotes}
                          </span>
                          <span className="flex items-center gap-1 text-blue-400">
                            <FiTrendingDown /> {deal.coldVotes}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5 text-center">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                            deal.isVotingEnabled
                              ? 'bg-[#49b99f]/10 text-[#49b99f]'
                              : 'bg-red-500/10 text-red-500'
                          )}>
                          {deal.isVotingEnabled ? 'Active' : 'Frozen'}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-r border-white/5 rounded-r-[1.5rem] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleVoting(deal.id)}
                            className={cn(
                              'p-2 rounded-xl transition-all hover:scale-110',
                              deal.isVotingEnabled
                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                : 'bg-[#49b99f]/10 text-[#49b99f] hover:bg-[#49b99f]/20'
                            )}
                            title={
                              deal.isVotingEnabled
                                ? 'Freeze Voting'
                                : 'Enable Voting'
                            }>
                            {deal.isVotingEnabled ? (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoting;
