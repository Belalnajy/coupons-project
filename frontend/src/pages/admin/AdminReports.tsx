import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiCheckCircle, FiFlag } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  getAdminReports,
  reviewReport,
  getAdminStats,
} from '@/services/api/admin.api';

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-[#333333] p-8 rounded-[1.5rem] border border-white/5 flex-1 min-w-[200px] shadow-xl">
    <p className="text-[#a0a0a0] text-sm font-medium mb-6 uppercase tracking-widest opacity-60">
      {label}
    </p>
    <h3 className="text-5xl font-bold text-white tracking-tighter">{value}</h3>
  </div>
);

import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const AdminReports: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== 'All') params.status = filter.toLowerCase();
      const data = await getAdminReports(params);
      // API returns the array directly, not wrapped in a data property
      setReports(Array.isArray(data) ? data : data.data || []);

      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const handleReview = async (id: string) => {
    const result = await Swal.fire({
      title: 'Resolve Report?',
      text: 'Mark this report as reviewed.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#49b99f',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, resolve it!',
      background: '#2c2c2c',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await reviewReport(id, { status: 'reviewed' });
        toast.success('Report resolved');
        fetchReports();
      } catch (error) {
        toast.error('Failed to resolve report');
      }
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.reason || '').toLowerCase().includes(search.toLowerCase()) ||
      (report.reporter?.username || '')
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
          Reports & Flags
        </h1>
        <p className="text-light-grey text-lg font-medium opacity-60">
          Review reported content and user flags
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Reports" value={reports.length} />
        <SummaryCard
          label="Pending Review"
          value={reports.filter((r) => r.status === 'pending').length}
        />
        <SummaryCard
          label="Reviewed"
          value={reports.filter((r) => r.status === 'reviewed').length}
        />
        <SummaryCard label="Platform Users" value={stats?.totalUsers || 0} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex bg-[#333333] p-1.5 rounded-2xl border border-white/5">
          {['All', 'Pending', 'Reviewed'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap',
                filter === opt
                  ? 'bg-[#49b99f] text-white shadow-lg'
                  : 'text-[#a0a0a0] hover:text-white'
              )}>
              {opt}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-light-grey transition-colors group-focus-within:text-[#49b99f]" />
          <Input
            placeholder="Search Report..."
            className="pl-14 bg-[#333333] border-white/5 rounded-2xl h-14 text-white focus:ring-[#49b99f]/20 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-[#333333] rounded-[1.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-light-grey">
              Loading reports...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#252525] border-b border-white/5">
                <tr>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                    Type
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                    Reason
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                    Reported By
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                    Date
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                    Status
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="group hover:bg-white/2 transition-colors">
                      <td className="px-6 py-6 text-center">
                        <span className="text-white font-black uppercase text-xs">
                          {report.contentType}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-[#a0a0a0] font-medium text-sm">
                          {report.reason}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-white font-black text-sm">
                          {report.reporter?.username || 'Anonymous'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-[#a0a0a0] text-sm opacity-60">
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span
                          className={cn(
                            'text-xs font-bold uppercase p-1 rounded',
                            report.status === 'pending'
                              ? 'text-yellow-500 bg-yellow-500/10'
                              : 'text-[#49b99f] bg-[#49b99f]/10'
                          )}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/reports/${report.id}`)
                            }
                            className="p-2 text-light-grey hover:text-white transition-all hover:scale-110">
                            <FiEye className="w-5 h-5" />
                          </button>
                          {report.status === 'pending' && (
                            <button
                              onClick={() => handleReview(report.id)}
                              className="p-2 text-[#49b99f] hover:scale-110 transition-all">
                              <FiCheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <FiFlag className="w-12 h-12 mx-auto mb-4 text-light-grey opacity-20" />
                      <p className="text-light-grey opacity-40 font-bold uppercase tracking-widest">
                        No reports found
                      </p>
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

export default AdminReports;
