import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    return this.settingRepository.find();
  }

  async findByKey(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async update(key: string, value: any, description?: string) {
    let setting = await this.settingRepository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingRepository.create({ key, value, description });
    }
    return this.settingRepository.save(setting);
  }

  async getValue(key: string, defaultValue: any = null) {
    try {
      const setting = await this.findByKey(key);
      return setting.value;
    } catch (error) {
      return defaultValue;
    }
  }

  async getBool(key: string, defaultValue: boolean = false): Promise<boolean> {
    const value = await this.getValue(key, defaultValue);
    return String(value) === 'true';
  }

  async getInt(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.getValue(key, defaultValue);
    return parseInt(value, 10) || defaultValue;
  }

  async getPublicSettings() {
    const publicKeys = [
      'platform_name',
      'contact_email',
      'logo_url',
      'favicon_url',
      'deals_enabled',
      'coupons_enabled',
      'maintenance_mode',
      'facebook_url',
      'twitter_url',
      'youtube_url',
      'linkedin_url',
    ];
    const settings = await this.settingRepository.find();
    return settings.filter((s) => publicKeys.includes(s.key));
  }

  async resetToDefaults() {
    const defaultSettings = {
      deals_enabled: 'true',
      coupons_enabled: 'true',
      maintenance_mode: 'false',
      hot_deal_threshold: '100',
      vote_cooldown: '24',
      who_can_vote: 'all',
      auto_approve_verified: 'true',
      public_registration: 'true',
      platform_name: 'Waferlee',
      contact_email: 'admin@waferlee.com',
      comment_moderation: 'false',
      support_email: 'support@waferlee.com',
      moderation_email: 'moderation@waferlee.com',
      logo_url: '/waferlee-logo.png',
      favicon_url: '/waferlee-logo.png',
      facebook_url: 'https://facebook.com',
      twitter_url: 'https://twitter.com',
      youtube_url: 'https://youtube.com',
      linkedin_url: 'https://linkedin.com',
    };

    const promises = Object.entries(defaultSettings).map(([key, value]) =>
      this.update(key, value),
    );
    await Promise.all(promises);
    return { success: true };
  }

  async clearSystemCache() {
    await (this.cacheManager as any).reset();
    return { success: true, message: 'System cache cleared successfully' };
  }
}
