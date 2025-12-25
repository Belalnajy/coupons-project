import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiCheckCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Report {
  id: string;
  content: string;
  reason: string;
  reportedBy: string;
  date: string;
  status: 'Pending' | 'Reviewed';
}

const MOCK_REPORTS: Report[] = [
  {
    id: '#1',
    content: 'Fake iPhone 15 Pro - Too Good to Be True',
    reason: 'Suspicious link / Potential scam',
    reportedBy: 'SafetyFirst',
    date: '2023-12-16 15:30',
    status: 'Pending',
  },
  {
    id: '#2',
    content: 'Comment on "AirPods Pro 2 Deal"',
    reason: 'Offensive language',
    reportedBy: 'User123',
    date: '2023-12-16 14:15',
    status: 'Reviewed',
  },
  {
    id: '#3',
    content: 'Dell XPS 13 Laptop - Student Discount',
    reason: 'Against platform rules',
    reportedBy: 'TechUser99',
    date: '2023-12-16 12:45',
    status: 'Pending',
  },
];

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-[#333333] p-8 rounded-[1.5rem] border border-white/5 flex-1 min-w-[200px] shadow-xl">
    <p className="text-[#a0a0a0] text-sm font-medium mb-6">{label}</p>
    <h3 className="text-5xl font-bold text-white tracking-tighter">{value}</h3>
  </div>
);

const AdminReports: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Reviewed'>('All');
  const [search, setSearch] = useState('');

  const filteredReports = MOCK_REPORTS.filter((report) => {
    const matchesFilter = filter === 'All' || report.status === filter;
    const matchesSearch =
      report.content.toLowerCase().includes(search.toLowerCase()) ||
      report.reason.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
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
        <SummaryCard label="Total Reports" value={7} />
        <SummaryCard label="Pending Review" value={4} />
        <SummaryCard label="Reviewed" value={3} />
        <SummaryCard label="Deal Reports" value={4} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex bg-[#333333] p-1.5 rounded-2xl border border-white/5">
          {[
            { id: 'All', label: 'All' },
            { id: 'Pending', label: 'Pending(4)' },
            { id: 'Reviewed', label: 'Reviewed' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id as any)}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap',
                filter === opt.id
                  ? 'bg-[#49b99f] text-white shadow-lg'
                  : 'text-[#a0a0a0] hover:text-white'
              )}>
              {opt.label}
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
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#252525] border-b border-white/5">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                  ID
                </th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-[#a0a0a0] text-center">
                  Content
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
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="group hover:bg-white/2 transition-colors">
                  <td className="px-6 py-6 text-center">
                    <span className="text-white font-black">{report.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[#a0a0a0] font-medium text-sm leading-relaxed block max-w-[250px] mx-auto text-center">
                      {report.content}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[#a0a0a0] font-medium text-sm block max-w-[250px] mx-auto text-center">
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-white font-black text-sm">
                      {report.reportedBy}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-[#a0a0a0] text-sm opacity-60 whitespace-nowrap">
                      {report.date.split(' ')[0]}
                      <br />
                      {report.date.split(' ')[1]}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span
                      className={cn(
                        'text-xs font-black uppercase tracking-widest',
                        report.status === 'Pending'
                          ? 'text-yellow-500'
                          : 'text-[#49b99f]'
                      )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/reports/${report.id.replace('#', '')}`
                          )
                        }
                        className="p-2 text-light-grey hover:text-white transition-all hover:scale-110">
                        <FiEye className="w-5 h-5" />
                      </button>
                      {report.status === 'Pending' && (
                        <button className="p-2 text-[#49b99f] hover:scale-110 transition-all">
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReports.length === 0 && (
            <div className="py-20 text-center text-light-grey opacity-40 font-bold uppercase tracking-widest">
              No reports found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
