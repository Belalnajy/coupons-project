import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FiCamera, FiAward, FiZap, FiTag, FiTrendingUp } from 'react-icons/fi';

export default function UserProfile() {
  const userStats = {
    username: 'DealsHunter123',
    email: 'info@gmail.com',
    bio: 'Love finding and sharing great deals! Always on the hunt for the best discounts.',
    karma: 1240,
    level: 'Gold',
    avatar: 'De',
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-[3px] border-[#49b99f] p-1 shadow-2xl shadow-[#49b99f]/10">
              <Avatar className="w-full h-full border-none">
                <AvatarFallback className="bg-transparent text-[#49b99f] text-4xl font-bold tracking-tight">
                  {userStats.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
            <button className="absolute bottom-1 right-1 bg-[#49b99f] p-3 rounded-full text-white cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl z-20 border-[3px] border-[#222]">
              <FiCamera className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight">
              {userStats.username}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-yellow-500/20">
                <FiZap className="w-3 h-3" />
                {userStats.karma.toLocaleString()} Karma
              </div>
              <div className="flex items-center gap-2 bg-green/10 text-green px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green/20">
                <FiAward className="w-3 h-3" />
                {userStats.level} Member
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid (Inputs) */}
        <div className="w-full space-y-8 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#666] ml-4">
              Username
            </label>
            <input
              type="text"
              value={userStats.username}
              className="w-full bg-[#333]/50 border border-white/5 text-[#ddd] py-5 px-8 rounded-2xl text-lg focus:ring-2 focus:ring-[#49b99f]/50 outline-none transition-all"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#666] ml-4">
              Email Address
            </label>
            <input
              type="email"
              value={userStats.email}
              className="w-full bg-[#333]/50 border border-white/5 text-[#ddd] py-5 px-8 rounded-2xl text-lg focus:ring-2 focus:ring-[#49b99f]/50 outline-none transition-all"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#666] ml-4">
              Bio
            </label>
            <div className="relative group">
              <textarea
                value={userStats.bio}
                rows={3}
                className="w-full bg-[#333]/50 border border-white/5 text-[#ddd] py-5 px-8 rounded-2xl text-lg focus:ring-2 focus:ring-[#49b99f]/50 outline-none transition-all resize-none"
                readOnly
              />
              <div className="absolute right-4 bottom-[-24px] text-[#555] text-xs font-bold">
                {userStats.bio.length}/200
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="bg-[#333]/30 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center group hover:bg-[#333]/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="text-blue-500 w-6 h-6" />
            </div>
            <p className="text-white font-bold text-xl">145</p>
            <p className="text-[10px] text-light-grey uppercase font-black tracking-widest opacity-50">
              Impact Score
            </p>
          </div>
          <div className="bg-[#333]/30 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center group hover:bg-[#333]/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiTag className="text-purple-500 w-6 h-6" />
            </div>
            <p className="text-white font-bold text-xl">28</p>
            <p className="text-[10px] text-light-grey uppercase font-black tracking-widest opacity-50">
              Deals Shared
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full max-w-2xl gap-5 pt-4">
          <Button className="flex-1 h-16 bg-[#333] hover:bg-[#444] text-white text-xl font-bold rounded-2xl transition-all border-none">
            Cancel
          </Button>
          <Button className="flex-1 h-16 bg-[#49b99f] hover:bg-[#3ea58c] text-white text-xl font-bold rounded-2xl transition-all border-none shadow-lg shadow-[#49b99f]/20">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
