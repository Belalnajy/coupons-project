import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiMail,
  FiShield,
  FiLock,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAdminUser,
  createAdminUser,
  updateAdminUser,
} from '@/services/api/admin.api';

import { toast } from 'react-hot-toast';

const AdminUserEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    status: 'active' as 'active' | 'suspended',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getAdminUser(id)
        .then((data) => {
          setFormData({
            username: data.username,
            email: data.email,
            role: data.role,
            status: data.status,
            password: '', // Don't fetch password
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit && id) {
        // If password is empty, don't send it
        const updateData: any = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateAdminUser(id, updateData);
        toast.success('User updated successfully');
      } else {
        await createAdminUser(formData);
        toast.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (error) {
      toast.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Bar */}
      <div className="flex items-center gap-6 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-[#2c2c2c] rounded-2xl border border-white/5 text-white hover:bg-[#333] transition-colors cursor-pointer group">
          <FiArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h1>
          <p className="text-light-grey font-medium opacity-60">
            {isEdit
              ? 'Update user account information and platform privileges'
              : 'Create a new user account for the platform'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#2c2c2c] rounded-3xl p-8 border border-white/5 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Username */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#49b99f] flex items-center gap-2">
                <FiUser className="w-3" /> Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="e.g. janesmith"
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#49b99f] flex items-center gap-2">
                <FiMail className="w-3" /> Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g. jane@example.com"
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#49b99f] flex items-center gap-2">
                <FiShield className="w-3" /> Platform Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full h-14 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20 appearance-none outline-none font-bold">
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#49b99f] flex items-center gap-2">
                <FiLock className="w-3" />{' '}
                {isEdit ? 'Change Password' : 'Password'}
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  isEdit
                    ? 'Leave blank to keep current'
                    : 'Enter secure password'
                }
                className="h-14 bg-[#1a1a1a] border-white/5 rounded-2xl px-6 text-white focus:ring-[#49b99f]/20"
                required={!isEdit}
              />
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[#49b99f]">
                Account Status
              </label>
              <div className="flex gap-4">
                {['active', 'suspended'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: status as any })
                    }
                    className={cn(
                      'flex-1 h-14 rounded-2xl border font-bold transition-all capitalize',
                      formData.status === status
                        ? status === 'active'
                          ? 'bg-[#49b99f]/10 border-[#49b99f] text-[#49b99f]'
                          : 'bg-red-500/10 border-red-500 text-red-500'
                        : 'bg-[#1a1a1a] border-white/5 text-light-grey hover:border-white/10'
                    )}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-14 bg-[#49b99f] hover:bg-[#49b99f]/90 text-white font-black uppercase tracking-widest rounded-2xl gap-3 text-sm cursor-pointer border-0 shadow-lg shadow-[#49b99f]/20">
              <FiSave className="w-5 h-5" />
              {loading
                ? 'Saving...'
                : isEdit
                ? 'Update User Account'
                : 'Create User Account'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/users')}
              className="h-14 border-white/10 text-light-grey hover:bg-white/5 hover:text-white px-8 rounded-2xl uppercase tracking-widest font-bold">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminUserEdit;
