import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
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
}
