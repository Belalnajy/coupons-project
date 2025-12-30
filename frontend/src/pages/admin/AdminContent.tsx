import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiImage,
  FiLink,
  FiTarget,
  FiEdit2,
  FiTrash2,
  FiSearch,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAdminBanners, deleteBanner } from '@/services/api/admin.api';

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-[#333333] p-10 rounded-[1.75rem] border border-white/5 flex-1 min-w-[240px] shadow-2xl">
    <p className="text-[#a0a0a0] text-lg font-medium mb-6 uppercase tracking-widest opacity-60">
      {label}
    </p>
    <h3 className="text-6xl font-black text-white tracking-tighter">{value}</h3>
  </div>
);

import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const AdminContent: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await getAdminBanners();
      // Backend returns raw array, not {data: []}
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch admin banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

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
        await deleteBanner(id);
        toast.success('Banner deleted');
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const filteredBanners = banners.filter((banner) => {
    const searchLower = search.toLowerCase();
    const titleMatch = (banner.title || '').toLowerCase().includes(searchLower);
    const urlMatch = (banner.targetUrl || '')
      .toLowerCase()
      .includes(searchLower);
    return titleMatch || urlMatch;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Content Management
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            Control site visual assets and marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/admin/content/new')}
            className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 h-14 shadow-xl shadow-[#49b99f]/20 gap-3 border-0 transition-all hover:-translate-y-1">
            <FiPlus className="w-6 h-6" />
            New Banner
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Banners" value={banners.length} />
        <SummaryCard
          label="Active"
          value={banners.filter((b) => b.status === 'active').length}
        />
        <SummaryCard
          label="Platform Stores"
          value={banners.length > 0 ? 'Dynamic' : 0}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-[#2c2c2c] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Search Header */}
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#252525]">
          <h3 className="text-xl font-bold text-white tracking-tight uppercase flex items-center gap-3">
            <FiImage className="text-[#49b99f]" /> All Banners
          </h3>

          <div className="relative w-full md:w-96 group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-light-grey transition-colors group-focus-within:text-[#49b99f]" />
            <Input
              placeholder="Search banners..."
              className="pl-14 bg-[#1a1a1a] border-white/5 rounded-2xl h-14 text-white focus:ring-1 focus:ring-[#49b99f]/30 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List / Table Section */}
        <div className="flex-1 p-8">
          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center text-light-grey">
                Loading banners...
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40">
                      Visual Preview
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40">
                      Details
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40">
                      Placement
                    </th>
                    <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-light-grey/40 text-center">
                      Order
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
                  {filteredBanners.map((banner) => (
                    <tr key={banner.id} className="group">
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 rounded-l-[1.5rem] first:border-l border-y border-white/5">
                        <div className="relative w-32 h-16 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-black text-sm tracking-tight group-hover:text-[#49b99f] transition-colors">
                            {banner.title}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-light-grey font-bold opacity-60">
                            <FiLink className="min-w-fit" />
                            <span className="truncate max-w-[150px]">
                              {banner.targetUrl}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5">
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#49b99f]/80">
                          <FiTarget className="w-3 h-3" />
                          {banner.placement}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5 text-center">
                        <span className="text-white font-black text-sm">
                          {banner.sortOrder}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-white/5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span
                            className={cn(
                              'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500',
                              banner.status === 'active' &&
                                'text-[#49b99f] bg-[#49b99f]/10 border-[#49b99f]/20 shadow-[0_0_15px_rgba(73,185,159,0.1)]',
                              (banner.status === 'draft' ||
                                banner.status === 'expired') &&
                                'text-orange-400 bg-orange-400/10 border-orange-400/20'
                            )}>
                            {banner.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-[#1a1a1a]/50 border-y border-r border-white/5 rounded-r-[1.5rem] text-center">
                        <div className="flex items-center justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              navigate(`/admin/content/edit/${banner.id}`)
                            }
                            className="p-3 bg-white/5 hover:bg-white/10 text-[#49b99f] rounded-xl transition-all hover:scale-110">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-3 bg-white/5 hover:bg-white/10 text-red-400 rounded-xl transition-all hover:scale-110">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && filteredBanners.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="p-10 bg-white/5 rounded-[2.5rem] mb-6">
                  <FiImage className="w-20 h-20 text-light-grey opacity-20" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                  No Assets Found
                </h3>
                <p className="text-light-grey opacity-60 max-w-xs mx-auto">
                  Start by uploading your first visual banner or promotional
                  item to your platform.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
