import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiCheck,
  FiX,
  FiTrash2,
  FiEye,
  FiThumbsUp,
  FiThumbsDown,
  FiSlash,
  FiPlay,
  FiPlus,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type DealStatus = 'Pending' | 'Approved' | 'Rejected';

interface Deal {
  id: string;
  title: string;
  store: string;
  price: string;
  submittedBy: string;
  date: string;
  upvotes: number;
  downvotes: number;
  status: DealStatus;
  isEnabled: boolean;
}

const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal',
    store: 'Amazon',
    price: '£279',
    submittedBy: 'DealsHunter123',
    date: '2023-12-16 14:30',
    upvotes: 0,
    downvotes: 0,
    status: 'Pending',
    isEnabled: true,
  },
  {
    id: '2',
    title: 'Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal',
    store: 'Amazon',
    price: '£279',
    submittedBy: 'DealsHunter123',
    date: '2023-12-16 14:30',
    upvotes: 89,
    downvotes: 8,
    status: 'Approved',
    isEnabled: true,
  },
  {
    id: '3',
    title: 'Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal',
    store: 'Amazon',
    price: '£279',
    submittedBy: 'DealsHunter123',
    date: '2023-12-16 14:30',
    upvotes: 0,
    downvotes: 0,
    status: 'Pending',
    isEnabled: false,
  },
];

const SummaryCard = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string | number;
  colorClass?: string;
}) => (
  <div className="bg-[#2c2c2c] p-6 rounded-2xl border border-white/5 flex-1 min-w-[200px]">
    <p className="text-light-grey text-sm font-medium mb-1 uppercase tracking-wider opacity-60">
      {label}
    </p>
    <h3
      className={cn(
        'text-4xl font-black text-white tracking-tight',
        colorClass
      )}>
      {value}
    </h3>
  </div>
);

const AdminDeals: React.FC = () => {
  const [filter, setFilter] = useState<DealStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredDeals = MOCK_DEALS.filter((deal) => {
    const matchesFilter = filter === 'All' || deal.status === filter;
    const matchesSearch =
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.store.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
            Deals Management
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            Review and moderate user-submitted deals
          </p>
        </div>
        <Link
          to="/admin/deals/new"
          className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl px-6 h-12 flex items-center gap-2 shadow-xl shadow-[#49b99f]/20 transition-all hover:-translate-y-1 w-fit">
          <FiPlus className="w-5 h-5" />
          New Deal
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Deals" value={7} />
        <SummaryCard label="Pending Review" value={3} />
        <SummaryCard label="Approved" value={1} />
        <SummaryCard label="Rejected" value={0} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap',
                filter === opt
                  ? 'bg-[#49b99f] text-white shadow-lg shadow-[#49b99f]/20'
                  : 'text-light-grey hover:text-white'
              )}>
              {opt} {opt === 'Pending' ? `(2)` : ''}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-grey" />
          <Input
            placeholder="Search deals..."
            className="pl-11 bg-[#2c2c2c] border-white/5 rounded-xl h-11 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-[#2c2c2c] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1a1a1a] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Deal Title
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Store
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Submitted By
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                  Votes
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  className={cn(
                    'group hover:bg-white/2 transition-colors',
                    !deal.isEnabled && 'opacity-50 grayscale-[0.5]'
                  )}>
                  <td className="px-6 py-5">
                    <p className="text-white font-bold text-sm leading-tight max-w-[200px] line-clamp-3">
                      {deal.title}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-light-grey text-sm">
                      {deal.store}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[#49b99f] font-bold text-sm">
                      {deal.price}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-light-grey text-sm">
                      {deal.submittedBy}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-light-grey text-[11px] leading-tight">
                      {deal.date.split(' ')[0]}
                      <br />
                      <span className="opacity-50 font-medium">
                        {deal.date.split(' ')[1]}
                      </span>
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-[#49b99f]">
                        <FiThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                          {deal.upvotes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-red-500">
                        <FiThumbsDown className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                          {deal.downvotes}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={cn(
                          'text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border',
                          deal.status === 'Pending' &&
                            'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                          deal.status === 'Approved' &&
                            'text-[#49b99f] bg-[#49b99f]/10 border-[#49b99f]/20',
                          deal.status === 'Rejected' &&
                            'text-red-500 bg-red-500/10 border-red-500/20'
                        )}>
                        {deal.status}
                      </span>
                      {!deal.isEnabled && (
                        <span className="text-[10px] font-black uppercase text-red-500/80 bg-red-500/5 px-2 py-0.5 rounded-sm border border-red-500/10">
                          Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        to={`/admin/deals/${deal.id}`}
                        className="p-2 text-light-grey hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                        <FiEye className="w-4 h-4" />
                      </Link>
                      {deal.status === 'Pending' && (
                        <>
                          <button className="p-2 text-[#49b99f] hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-[#49b99f]/10">
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-red-500/10">
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className={cn(
                          'p-2 transition-all cursor-pointer rounded-lg hover:bg-white/5',
                          deal.isEnabled
                            ? 'text-red-500/60 hover:text-red-500'
                            : 'text-[#49b99f]/60 hover:text-[#49b99f]'
                        )}
                        title={deal.isEnabled ? 'Disable Deal' : 'Enable Deal'}>
                        {deal.isEnabled ? (
                          <FiSlash className="w-4 h-4" />
                        ) : (
                          <FiPlay className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-2 text-red-500/60 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDeals;
