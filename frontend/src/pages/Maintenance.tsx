import React from 'react';
import {
  FiSettings,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
} from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';

const Maintenance: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Animated Icon Container */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-[#49b99f]/10 rounded-3xl flex items-center justify-center relative z-10 animate-pulse">
            <FiSettings className="w-12 h-12 text-[#49b99f] animate-spin-slow" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center animate-bounce">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
            Maintenance <span className="text-[#49b99f]">Mode</span>
          </h1>
          <p className="text-light-grey text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed opacity-80">
            We're currently fine-tuning{' '}
            {settings.platform_name || 'the platform'} to provide you with a
            better experience. We'll be back shortly!
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-[#2c2c2c] border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-[#49b99f] rounded-full animate-ping" />
            <span className="text-[#49b99f] text-xs font-black uppercase tracking-[0.3em]">
              System Update in Progress
            </span>
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4">
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-3 text-white hover:text-[#49b99f] transition-colors group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#49b99f]/10 transition-colors">
                  <FiMail className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">
                  {settings.contact_email}
                </span>
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 pt-4">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 rounded-xl text-light-grey hover:text-white hover:bg-[#49b99f]/20 transition-all">
                <FiFacebook className="w-5 h-5" />
              </a>
            )}
            {settings.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 rounded-xl text-light-grey hover:text-white hover:bg-[#49b99f]/20 transition-all">
                <FiTwitter className="w-5 h-5" />
              </a>
            )}
            {settings.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 rounded-xl text-light-grey hover:text-white hover:bg-[#49b99f]/20 transition-all">
                <FiYoutube className="w-5 h-5" />
              </a>
            )}
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 rounded-xl text-light-grey hover:text-white hover:bg-[#49b99f]/20 transition-all">
                <FiLinkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Footer & Admin Access */}
        <div className="space-y-4">
          <p className="text-[10px] text-light-grey opacity-30 font-black uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} {settings.platform_name}
          </p>
          <div className="pt-4">
            <a
              href="/signin"
              className="text-[10px] font-black uppercase tracking-widest text-[#49b99f] opacity-40 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <div className="w-1 h-1 bg-[#49b99f] rounded-full" />
              Administrator Access
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
