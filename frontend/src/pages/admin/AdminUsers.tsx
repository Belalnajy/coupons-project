import React, { useState } from 'react';
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

type UserStatus = 'Active' | 'Suspended';
type UserLevel = 'Gold' | 'Silver' | 'Bronze';

interface User {
  id: string;
  username: string;
  email: string;
  joinedDate: string;
  dealsCount: number;
  level: UserLevel;
  status: UserStatus;
  role: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'DealsHunter123',
    email: 'dealshunter@example.com',
    joinedDate: '2023-01-15',
    dealsCount: 142,
    level: 'Gold',
    status: 'Active',
    role: 'user',
  },
  {
    id: '2',
    username: 'TechSaver99',
    email: 'techsaver@example.com',
    joinedDate: '2023-03-22',
    dealsCount: 89,
    level: 'Silver',
    status: 'Active',
    role: 'user',
  },
  {
    id: '3',
    username: 'AudioFan',
    email: 'audiofan@example.com',
    joinedDate: '2023-02-10',
    dealsCount: 67,
    level: 'Bronze',
    status: 'Suspended',
    role: 'user',
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

const AdminUsers: React.FC = () => {
  const [filter, setFilter] = useState<UserStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesFilter = filter === 'All' || user.status === filter;
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
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
        <SummaryCard label="Total Users" value={8} />
        <SummaryCard label="Active" value={7} />
        <SummaryCard label="Suspended" value={1} />
        <SummaryCard label="Total Deals Posted" value={736} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#2c2c2c] p-1 rounded-xl border border-white/5 w-full md:w-auto">
          {['All', 'Active', 'Suspended'].map((opt) => (
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
                  Deals Count
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-light-grey/80 text-center">
                  Level
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
              {filteredUsers.map((user) => (
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
                      {user.joinedDate}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-white font-black text-sm">
                      {user.dealsCount}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border',
                        user.level === 'Gold' &&
                          'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                        user.level === 'Silver' &&
                          'text-[#94a3b8] bg-slate-500/10 border-slate-500/20',
                        user.level === 'Bronze' &&
                          'text-orange-600 bg-orange-600/10 border-orange-600/20'
                      )}>
                      {user.level}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        'text-xs font-bold',
                        user.status === 'Active'
                          ? 'text-[#49b99f]'
                          : 'text-red-500'
                      )}>
                      {user.status}
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
                      <button className="p-2 text-red-500 hover:scale-110 transition-all cursor-pointer rounded-lg hover:bg-red-500/10">
                        {user.status === 'Active' ? (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
