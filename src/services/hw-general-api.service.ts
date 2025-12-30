import { HwGeneralApi } from '@/entities/HwGeneralApi.entity';
import { hwGeneralApiRepository } from '@/repositories/hwGeneralApi.repository';
import { UpsertHwGeneralApiRequest, HwGeneralApiResponse } from '@/types/hw-general-api';

export class HwGeneralApiService {
  private static instance: HwGeneralApiService;

  static getInstance(): HwGeneralApiService {
    if (!HwGeneralApiService.instance) {
      HwGeneralApiService.instance = new HwGeneralApiService();
    }
    return HwGeneralApiService.instance;
  }

  async upsert(request: UpsertHwGeneralApiRequest, userId: number): Promise<HwGeneralApiResponse> {
    try {
      const repo = await hwGeneralApiRepository();
      
      // Find existing (should be only one record)
      let config = await repo.findOne({ where: {} });

      if (config) {
        // Update existing
        config.url = request.url;
        config.updatedAt = new Date();
      } else {
        // Create new
        config = new HwGeneralApi();
        config.url = request.url;
        config.createdBy = { id: userId } as any;
      }

      const saved = await repo.save(config);
      return { success: true, data: saved, message: 'General API configuration saved successfully' };
    } catch (error) {
      console.error('Upsert hw general api error:', error);
      return { success: false, message: 'Error saving general API configuration' };
    }
  }

  async get(): Promise<HwGeneralApiResponse> {
    try {
      const repo = await hwGeneralApiRepository();
      const config = await repo.findOne({
        where: {},
        relations: ['createdBy']
      });

      if (config) {
        return { success: true, data: config };
      }
      // Return success with null data when no config exists yet
      return { success: true, data: null, message: 'No configuration found' };
    } catch (error) {
      console.error('Get hw general api error:', error);
      return { success: false, message: 'Error fetching general API configuration' };
    }
  }
}