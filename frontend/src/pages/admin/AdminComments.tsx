import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCheck, FiTrash2 } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type CommentStatus = 'Pending' | 'Approved';

interface Comment {
  id: string;
  text: string;
  user: string;
  relatedDeal: {
    id: string;
    title: string;
  };
  date: string;
  status: CommentStatus;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    text: 'Great deal! Just ordered one. Thanks for sharing!',
    user: 'DealsHunter123',
    relatedDeal: {
      id: 'deal-1',
      title: 'Samsung Galaxy S24 Ultra - 50% Off',
    },
    date: '2023-12-16 14:30',
    status: 'Approved',
  },
  {
    id: '2',
    text: 'This is spam content with suspicious links',
    user: 'Spammer123',
    relatedDeal: {
      id: 'deal-2',
      title: 'Fake iPhone Deal',
    },
    date: '2023-12-16 14:30',
    status: 'Pending',
  },
  {
    id: '3',
    text: 'Does this work with the student discount?',
    user: 'TechSaver99',
    relatedDeal: {
      id: 'deal-3',
      title: 'Apple AirPods Pro 2 - 35% Discount',
    },
    date: '2023-12-16 14:30',
    status: 'Pending',
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

const AdminComments: React.FC = () => {
  const [filter, setFilter] = useState<CommentStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredComments = MOCK_COMMENTS.filter((comment) => {
    const matchesFilter = filter === 'All' || comment.status === filter;
    const matchesSearch =
      comment.text.toLowerCase().includes(search.toLowerCase()) ||
      comment.user.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
          Comments Moderation
        </h1>
        <p className="text-light-grey text-lg font-medium opacity-60">
          Review and moderate user comments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Comments" value={7} />
        <SummaryCard label="Pending Review" value={2} />
        <SummaryCard label="Approved" value={5} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Pending', 'Approved'].map((opt) => (
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
            placeholder="Search comments..."
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
                  Comment
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  User
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Related Deal
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                  Date
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
              {filteredComments.map((comment) => (
                <tr
                  key={comment.id}
                  className="group hover:bg-white/2 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-white font-bold text-sm leading-snug max-w-[300px]">
                      {comment.text}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-light-grey text-sm font-medium">
                      {comment.user}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <Link
                      to={`/admin/deals/${comment.relatedDeal.id}`}
                      className="text-[#49b99f] hover:underline font-bold text-sm line-clamp-2">
                      {comment.relatedDeal.title}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-light-grey text-[11px] leading-tight font-medium">
                      {comment.date.split(' ')[0]}
                      <br />
                      <span className="opacity-50">
                        {comment.date.split(' ')[1]}
                      </span>
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        'text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border',
                        comment.status === 'Pending' &&
                          'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                        comment.status === 'Approved' &&
                          'text-[#49b99f] bg-[#49b99f]/10 border-[#49b99f]/20'
                      )}>
                      {comment.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {comment.status === 'Pending' && (
                        <button className="p-2 text-[#49b99f] hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-[#49b99f]/10">
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-red-500 hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-red-500/10">
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

export default AdminComments;
