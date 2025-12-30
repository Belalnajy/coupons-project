import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiSlash,
  FiCheckCircle,
  FiShoppingCart,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAdminStores,
  toggleStore,
  deleteStore,
  getAdminStats,
} from '@/services/api/admin.api';

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

import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getAdminStores();
      setStores(data.data || []);

      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await toggleStore(id);
      toast.success('Store status updated');
      fetchStores();
    } catch (error) {
      toast.error('Failed to toggle store status');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, delete it!',
      background: '#2c2c2c',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await deleteStore(id);
        toast.success('Store deleted');
        fetchStores();
      } catch (error) {
        toast.error('Failed to delete store');
      }
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && store.status === 'active') ||
      (filter === 'Disabled' && store.status === 'disabled');
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.websiteUrl || '').toLowerCase().includes(search.toLowerCase());
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
        <SummaryCard label="Total Stores" value={stats?.totalStores || 0} />
        <SummaryCard
          label="Active"
          value={stores.filter((s) => s.status === 'active').length}
          colorClass="text-[#49b99f]"
        />
        <SummaryCard
          label="Disabled"
          value={stores.filter((s) => s.status === 'disabled').length}
          colorClass="text-red-500/60"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Active', 'Disabled'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
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
          {loading ? (
            <div className="p-12 text-center text-light-grey">
              Loading stores...
            </div>
          ) : (
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
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
                          {store.websiteUrl || 'No URL'}
                          <FiExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={cn(
                            'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border',
                            store.status === 'active'
                              ? 'text-[#49b99f] bg-[#49b99f]/10 border-[#49b99f]/20'
                              : 'text-red-500 bg-red-500/10 border-red-500/20'
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
                          <button
                            onClick={() => handleToggle(store.id)}
                            className="p-2 transition-all cursor-pointer rounded-lg hover:bg-white/5">
                            {store.status === 'active' ? (
                              <FiSlash className="w-4 h-4 text-red-500/60" />
                            ) : (
                              <FiCheckCircle className="w-4 h-4 text-[#49b99f]" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(store.id)}
                            className="p-2 text-red-500/60 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-light-grey">
                      <FiShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No stores found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStores;
