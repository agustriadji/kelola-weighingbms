import { HwConfiguration, HwAreaEnum } from '@/entities/HwConfiguration.entity';
import { hwConfigurationRepository } from '@/repositories/hwConfiguration.repository';
import { UpsertHwConfigRequest, HwConfigResponse, HwConfigListResponse } from '@/types/hw-configuration';

export class HwConfigurationService {
  private static instance: HwConfigurationService;

  static getInstance(): HwConfigurationService {
    if (!HwConfigurationService.instance) {
      HwConfigurationService.instance = new HwConfigurationService();
    }
    return HwConfigurationService.instance;
  }

  async upsert(request: UpsertHwConfigRequest, userId: number): Promise<HwConfigResponse> {
    try {
      const repo = await hwConfigurationRepository();
      
      // Find existing config by area
      let config = await repo.findOne({
        where: { area: request.area, isDeleted: false }
      });

      if (config) {
        // Update existing
        config.dataConfig = request.dataConfig;
        config.updatedAt = new Date();
      } else {
        // Create new
        config = new HwConfiguration();
        config.area = request.area;
        config.dataConfig = request.dataConfig;
        config.createdBy = { id: userId } as any;
      }

      const saved = await repo.save(config);
      return { success: true, data: saved, message: 'Configuration saved successfully' };
    } catch (error) {
      console.error('Upsert hw config error:', error);
      return { success: false, message: 'Error saving configuration' };
    }
  }

  async getByArea(area: HwAreaEnum): Promise<HwConfigResponse> {
    try {
      const repo = await hwConfigurationRepository();
      const config = await repo.findOne({
        where: { area, isDeleted: false },
        relations: ['createdBy']
      });

      if (config) {
        return { success: true, data: config };
      }
      return { success: false, message: 'Configuration not found' };
    } catch (error) {
      console.error('Get hw config error:', error);
      return { success: false, message: 'Error fetching configuration' };
    }
  }

  async getAll(): Promise<HwConfigListResponse> {
    try {
      const repo = await hwConfigurationRepository();
      const configs = await repo.find({
        where: { isDeleted: false },
        relations: ['createdBy'],
        order: { area: 'ASC' }
      });

      return { success: true, data: configs };
    } catch (error) {
      console.error('Get all hw configs error:', error);
      return { success: false, message: 'Error fetching configurations' };
    }
  }

  async remove(area: HwAreaEnum): Promise<HwConfigResponse> {
    try {
      const repo = await hwConfigurationRepository();
      const config = await repo.findOne({
        where: { area, isDeleted: false }
      });

      if (!config) {
        return { success: false, message: 'Configuration not found' };
      }

      config.isDeleted = true;
      config.updatedAt = new Date();
      await repo.save(config);

      return { success: true, message: 'Configuration removed successfully' };
    } catch (error) {
      console.error('Remove hw config error:', error);
      return { success: false, message: 'Error removing configuration' };
    }
  }
}