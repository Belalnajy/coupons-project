import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPublicSettings } from '@/services/api/settings.api';

export interface PlatformSettings {
  platform_name: string;
  contact_email: string;
  logo_url: string;
  favicon_url: string;
  deals_enabled: string;
  coupons_enabled: string;
  maintenance_mode: string;
  facebook_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
}

interface SettingsContextType {
  settings: PlatformSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: PlatformSettings = {
  platform_name: 'Waferlee',
  contact_email: 'admin@waferlee.com',
  logo_url: '/waferlee-logo.png',
  favicon_url: '/waferlee-logo.png',
  deals_enabled: 'true',
  coupons_enabled: 'true',
  maintenance_mode: 'false',
  facebook_url: 'https://facebook.com',
  twitter_url: 'https://twitter.com',
  youtube_url: 'https://youtube.com',
  linkedin_url: 'https://linkedin.com',
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await getPublicSettings();
      if (Array.isArray(data)) {
        const mapped = { ...defaultSettings };
        data.forEach((s: any) => {
          mapped[s.key as keyof PlatformSettings] = s.value;
        });
        setSettings(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch platform settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings.platform_name) {
      document.title = `${settings.platform_name} - Best Deals & Free Coupons`;
    }
    if (settings.favicon_url) {
      const link: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = settings.favicon_url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = settings.favicon_url;
        document.head.appendChild(newLink);
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
