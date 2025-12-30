import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiMessageSquare,
  FiTag,
  FiSettings,
  FiLogOut,
  FiPlusCircle,
  FiUser,
  FiThumbsUp,
  FiBell,
  FiShoppingCart,
  FiUsers,
  FiLayers,
  FiBarChart2,
  FiShield,
  FiActivity,
  FiHome,
} from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function SidebarItem({ to, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all group duration-300',
        active
          ? 'bg-[#49b99f] text-white shadow-lg shadow-[#49b99f]/20 translate-x-1'
          : 'text-light-grey hover:bg-white/5 hover:text-white'
      )}>
      <Icon
        className={cn(
          'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
          active ? 'text-white' : 'text-light-grey group-hover:text-white'
        )}
      />
      <span className="font-semibold tracking-wide">{label}</span>
    </Link>
  );
}

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const userMenuItems = [
    { to: '/dashboard', icon: FiGrid, label: 'Overview' },
    { to: '/dashboard/profile', icon: FiUser, label: 'Profile' },
    { to: '/dashboard/deals', icon: FiPackage, label: 'My Deals' },
    { to: '/dashboard/votes', icon: FiThumbsUp, label: 'Votes' },
    { to: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
    { to: '/dashboard/submit-deal', icon: FiPlusCircle, label: 'Submit Deal' },
    { to: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
    { to: '/', icon: FiHome, label: 'Back to Home' },
  ];

  const adminMenuItems = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/voting', icon: FiActivity, label: 'Voting System' },
    { to: '/admin/deals', icon: FiPackage, label: 'Deals' },
    { to: '/admin/comments', icon: FiMessageSquare, label: 'Comments' },
    { to: '/admin/stores', icon: FiShoppingCart, label: 'Stores' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/content', icon: FiLayers, label: 'Content' },
    { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
    { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
    { to: '/', icon: FiHome, label: 'Back to Home' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'w-72 flex flex-col border-r border-white/5 shadow-2xl transition-all duration-300 z-50',
          'fixed inset-y-0 left-0 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isAdmin ? 'bg-[#1a1a1a]' : 'bg-[#2c2c2c]'
        )}>
        {/* Header */}
        <div className="p-8 relative">
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:hidden text-light-grey hover:text-white">
            <FiLogOut className="w-5 h-5 rotate-180" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                'p-2 rounded-lg',
                isAdmin ? 'bg-[#49b99f]/10' : 'bg-white/5'
              )}>
              {isAdmin ? (
                <FiShield className="text-[#49b99f] w-6 h-6" />
              ) : (
                <FiGrid className="text-white w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">
                {isAdmin ? 'Admin Panel' : 'Dashboard'}
              </h2>
              <p
                className={cn(
                  'text-[10px] font-black uppercase tracking-[0.2em]',
                  isAdmin ? 'text-[#49b99f]' : 'text-light-grey'
                )}>
                {isAdmin ? 'Management System' : 'Waferlee User'}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 mx-8 mb-8" />

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.to} onClick={onClose}>
              <SidebarItem
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            </div>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-6 mt-auto">
          <div className="bg-[#222] rounded-2xl p-4 flex items-center gap-4 border border-white/5 shadow-inner">
            <div className="relative">
              <Avatar
                className={cn(
                  'w-12 h-12 border-2',
                  isAdmin ? 'border-[#49b99f]/20' : 'border-white/10'
                )}>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-darker-grey text-[#49b99f] font-bold">
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-[#222] rounded-full',
                  isAdmin ? 'bg-[#49b99f]' : 'bg-green-500'
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black truncate text-sm tracking-tight">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-light-grey text-[10px] font-bold uppercase tracking-widest opacity-60">
                {isAdmin ? 'Super Admin' : 'Member'}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-light-grey hover:text-red-500 transition-all cursor-pointer p-2 hover:bg-red-500/10 rounded-xl group">
              <FiLogOut className="w-5 h-5 transform rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
