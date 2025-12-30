import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiCheck,
  FiCheckCircle,
  FiX,
  FiTrash2,
  FiEye,
  FiSlash,
  FiPlay,
  FiPlus,
  FiTrendingUp,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  getAdminDeals,
  approveDeal,
  rejectDeal,
  toggleDeal,
  verifyDeal,
  deleteDeal,
  getAdminStats,
} from '@/services/api/admin.api';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

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
  const [deals, setDeals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== 'All') params.status = filter.toLowerCase();
      const data = await getAdminDeals(params);
      setDeals(data.data || []);

      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [filter]);

  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: 'Approve Deal?',
      text: 'This will make the deal visible to all users.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#49b99f',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, approve it!',
      background: '#2c2c2c',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await approveDeal(id);
        toast.success('Deal approved successfully');
        fetchDeals();
      } catch (error) {
        toast.error('Failed to approve deal');
      }
    }
  };

  const handleReject = async (id: string) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Deal',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter reason here...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#333',
      confirmButtonText: 'Reject Deal',
      background: '#2c2c2c',
      color: '#fff',
    });

    if (reason !== undefined) {
      try {
        await rejectDeal(id, reason);
        toast.success('Deal rejected');
        fetchDeals();
      } catch (error) {
        toast.error('Failed to reject deal');
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleDeal(id);
      toast.success('Deal status toggled');
      fetchDeals();
    } catch (error) {
      toast.error('Failed to toggle deal');
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
        await deleteDeal(id);
        toast.success('Deal deleted');
        fetchDeals();
      } catch (error) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      await verifyDeal(id);
      toast.success(isVerified ? 'Deal unverified' : 'Deal verified');
      fetchDeals();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      (deal.store?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

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
        <SummaryCard label="Total Deals" value={stats?.totalDeals || 0} />
        <SummaryCard
          label="Pending"
          value={stats?.pendingDeals || 0}
          colorClass="text-yellow-500"
        />
        <SummaryCard
          label="Approved"
          value={stats?.activeDeals || 0}
          colorClass="text-[#49b99f]"
        />
        <SummaryCard label="Total Stores" value={stats?.totalStores || 0} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((opt) => (
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
          {loading ? (
            <div className="p-12 text-center text-light-grey">
              Loading deals...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Deal Title
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Store
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-right">
                    Price
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Submitted By
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                    Verified
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                    Temp
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
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      className={cn(
                        'group hover:bg-white/2 transition-colors',
                        !deal.isEnabled && 'opacity-50 grayscale-[0.5]'
                      )}>
                      <td className="px-6 py-5">
                        <p className="text-white font-bold text-sm leading-tight max-w-[200px] line-clamp-2">
                          {deal.title}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-light-grey text-sm">
                          {deal.store?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-mono">
                        <span className="text-[#49b99f] font-bold text-sm">
                          £{deal.dealPrice}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-light-grey text-sm">
                          {deal.user?.username || 'System'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-light-grey text-[11px] leading-tight">
                          {formatDate(deal.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleVerify(deal.id, deal.isVerified)}
                          className={cn(
                            'p-2 rounded-lg transition-all cursor-pointer',
                            deal.isVerified
                              ? 'text-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                              : 'text-light-grey hover:text-blue-500 hover:bg-blue-500/10'
                          )}
                          title={deal.isVerified ? 'Unverify' : 'Verify'}>
                          <FiCheckCircle
                            className={cn(
                              'w-4 h-4',
                              deal.isVerified && 'fill-current'
                            )}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-1 text-orange-500">
                          <FiTrendingUp className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {deal.temperature || 0}°
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={cn(
                              'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border',
                              deal.status === 'pending' &&
                                'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                              deal.status === 'approved' &&
                                'text-[#49b99f] bg-[#49b99f]/10 border-[#49b99f]/20',
                              deal.status === 'rejected' &&
                                'text-red-500 bg-red-500/10 border-red-500/20'
                            )}>
                            {deal.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            to={`/deals/${deal.id}`}
                            target="_blank"
                            className="p-2 text-light-grey hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                            <FiEye className="w-4 h-4" />
                          </Link>
                          {deal.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(deal.id)}
                                className="p-2 text-[#49b99f] hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-[#49b99f]/10">
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(deal.id)}
                                className="p-2 text-red-500 hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-red-500/10">
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleToggle(deal.id)}
                            className={cn(
                              'p-2 transition-all cursor-pointer rounded-lg hover:bg-white/5',
                              deal.isEnabled
                                ? 'text-red-500/60 hover:text-red-500'
                                : 'text-[#49b99f]/60 hover:text-[#49b99f]'
                            )}
                            title={
                              deal.isEnabled ? 'Disable Deal' : 'Enable Deal'
                            }>
                            {deal.isEnabled ? (
                              <FiSlash className="w-4 h-4" />
                            ) : (
                              <FiPlay className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(deal.id)}
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
                      colSpan={9}
                      className="px-6 py-12 text-center text-light-grey">
                      No deals found.
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

export default AdminDeals;
