import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCheck, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  getAdminComments,
  approveComment,
  deleteComment,
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

const AdminComments: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== 'All') params.status = filter.toLowerCase();
      const data = await getAdminComments(params);
      setComments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch admin comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      await approveComment(id);
      toast.success('Comment approved');
      fetchComments();
    } catch (error) {
      toast.error('Failed to approve comment');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
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
        await deleteComment(id);
        toast.success('Comment deleted');
        fetchComments();
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      (comment.user?.username || '')
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesSearch;
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
        <SummaryCard label="Total Comments" value={comments.length} />
        <SummaryCard
          label="Pending"
          value={comments.filter((c) => c.status === 'pending').length}
          colorClass="text-yellow-500"
        />
        <SummaryCard
          label="Approved"
          value={comments.filter((c) => c.status === 'approved').length}
          colorClass="text-[#49b99f]"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Pending', 'Approved'].map((opt) => (
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
          {loading ? (
            <div className="p-12 text-center text-light-grey">
              Loading comments...
            </div>
          ) : (
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
                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <tr
                      key={comment.id}
                      className="group hover:bg-white/2 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-white font-bold text-sm leading-snug max-w-[300px]">
                          {comment.content}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-light-grey text-sm font-medium">
                          {comment.user?.username || 'Anonymous'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Link
                          to={`/deals/${comment.deal?.id}`}
                          target="_blank"
                          className="text-[#49b99f] hover:underline font-bold text-sm line-clamp-2">
                          {comment.deal?.title || 'View Deal'}
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-light-grey text-[11px] leading-tight font-medium">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={cn(
                            'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border',
                            comment.status === 'pending' &&
                              'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                            comment.status === 'approved' &&
                              'text-[#49b99f] bg-[#49b99f]/10 border-[#49b99f]/20'
                          )}>
                          {comment.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {comment.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(comment.id)}
                              className="p-2 text-[#49b99f] hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-[#49b99f]/10">
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-2 text-red-500 hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-red-500/10">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-light-grey">
                      <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No comments found.</p>
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

export default AdminComments;
