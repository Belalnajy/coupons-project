import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSlash,
  FiCheckCircle,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAdminUsers,
  toggleUserStatus,
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

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers({ search });
      setUsers(data.data || []);

      const statsData = await getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]); // Search is dynamic here

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';

    const result = await Swal.fire({
      title: `Confirm ${action}?`,
      text: `Are you sure you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'suspend' ? '#ef4444' : '#49b99f',
      cancelButtonColor: '#333',
      confirmButtonText: `Yes, ${action} user`,
      background: '#2c2c2c',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await toggleUserStatus(id, action);
        toast.success(`User ${action}ed successfully`);
        fetchUsers();
      } catch (error) {
        toast.error(`Failed to ${action} user`);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && user.status === 'active') ||
      (filter === 'Suspended' && user.status === 'suspended');
    return matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
            Users Management
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            View and manage platform users
          </p>
        </div>
        <Link to="/admin/users/new">
          <Button className="bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl px-8 h-12 shadow-lg shadow-[#49b99f]/20 gap-2">
            <FiUserPlus className="w-5 h-5" />
            Add New User
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Users" value={stats?.totalUsers || 0} />
        <SummaryCard
          label="Active"
          value={users.filter((u) => u.status === 'active').length}
          colorClass="text-[#49b99f]"
        />
        <SummaryCard
          label="Suspended"
          value={users.filter((u) => u.status === 'suspended').length}
          colorClass="text-red-500"
        />
        <SummaryCard label="Platform Stores" value={stats?.totalStores || 0} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Active', 'Suspended'].map((opt) => (
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
            placeholder="Search users..."
            className="pl-11 bg-[#2c2c2c] border-white/5 rounded-xl h-11 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#2c2c2c] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-light-grey">
              Loading users...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Username
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                    Karma
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-white/2 transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-white font-bold text-sm tracking-tight">
                          {user.username}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-light-grey text-sm font-medium opacity-80">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-light-grey text-sm font-medium opacity-80">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-xs font-black uppercase tracking-widest text-light-grey opacity-60">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center font-mono">
                        <span className="text-white font-black text-sm">
                          {user.karma || 0}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={cn(
                            'text-xs font-bold leading-none',
                            user.status === 'active'
                              ? 'text-[#49b99f] bg-[#49b99f]/10 px-2 py-1 rounded'
                              : 'text-red-500 bg-red-500/10 px-2 py-1 rounded'
                          )}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-2 text-light-grey hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <Link to={`/admin/users/edit/${user.id}`}>
                            <button className="p-2 text-[#49b99f] hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-[#49b99f]/10">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.status)
                            }
                            className={cn(
                              'p-2 hover:scale-110 transition-all cursor-pointer rounded-lg',
                              user.status === 'active'
                                ? 'text-red-500 hover:bg-red-500/10'
                                : 'text-[#49b99f] hover:bg-[#49b99f]/10'
                            )}>
                            {user.status === 'active' ? (
                              <FiSlash className="w-4 h-4" />
                            ) : (
                              <FiCheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-2 text-red-500/60 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-light-grey">
                      No users found.
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

export default AdminUsers;
