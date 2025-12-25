import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiSlash,
  FiCheckCircle,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type StoreStatus = 'Active' | 'Disabled';

interface Store {
  id: string;
  name: string;
  websiteUrl: string;
  dealsCount: number;
  status: StoreStatus;
}

const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'Amazon',
    websiteUrl: 'https://www.amazon.co.uk',
    dealsCount: 342,
    status: 'Disabled',
  },
  {
    id: '2',
    name: 'Currys',
    websiteUrl: 'https://www.currys.co.uk',
    dealsCount: 156,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Argos',
    websiteUrl: 'https://www.argos.co.uk',
    dealsCount: 234,
    status: 'Active',
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

const AdminStores: React.FC = () => {
  const [filter, setFilter] = useState<StoreStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredStores = MOCK_STORES.filter((store) => {
    const matchesFilter = filter === 'All' || store.status === filter;
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.websiteUrl.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
            Stores Management
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            Manage stores available for deal submission
          </p>
        </div>
        <Link to="/admin/stores/new">
          <Button className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 h-12 shadow-lg shadow-[#49b99f]/20 gap-2">
            <FiPlus className="w-5 h-5" />
            Add store
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Stores" value={8} />
        <SummaryCard label="Active" value={7} />
        <SummaryCard label="Disabled" value={1} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Active', 'Disabled'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap',
                filter === opt
                  ? 'bg-[#49b99f] text-white shadow-lg shadow-[#49b99f]/20'
                  : 'text-light-grey hover:text-white'
              )}>
              {opt}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-grey" />
          <Input
            placeholder="Search stores..."
            className="pl-11 bg-[#2c2c2c] border-white/5 rounded-xl h-11 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-[#2c2c2c] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1a1a1a] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Store Name
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Website URL
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                  Deals Count
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
              {filteredStores.map((store) => (
                <tr
                  key={store.id}
                  className="group hover:bg-white/2 transition-colors">
                  <td className="px-6 py-5">
                    <span className="text-white font-bold text-sm tracking-tight">
                      {store.name}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <a
                      href={store.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#49b99f] hover:underline text-sm font-medium flex items-center gap-2 group/link">
                      {store.websiteUrl}
                      <FiExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-white font-black text-sm">
                      {store.dealsCount}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        'text-xs font-bold',
                        store.status === 'Active'
                          ? 'text-[#49b99f]'
                          : 'text-light-grey/60'
                      )}>
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link to={`/admin/stores/edit/${store.id}`}>
                        <button className="p-2 text-light-grey hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-2 text-light-grey hover:text-[#49b99f] transition-all cursor-pointer rounded-lg hover:bg-[#49b99f]/10">
                        {store.status === 'Active' ? (
                          <FiSlash className="w-4 h-4 text-red-500/60" />
                        ) : (
                          <FiCheckCircle className="w-4 h-4 text-[#49b99f]" />
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

export default AdminStores;
