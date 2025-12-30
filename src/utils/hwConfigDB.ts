// IndexedDB utility for hardware configuration caching
import { apiGet } from './api';
import { HwAreaEnum } from '@/entities/HwConfiguration.entity';

class HwConfigDB {
  private dbName = 'hw_config_db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Store for general API config
        if (!db.objectStoreNames.contains('general_api')) {
          db.createObjectStore('general_api', { keyPath: 'id' });
        }
        
        // Store for area configs
        if (!db.objectStoreNames.contains('area_configs')) {
          db.createObjectStore('area_configs', { keyPath: 'area' });
        }
      };
    });
  }

  async setGeneralApi(data: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['general_api'], 'readwrite');
      const store = transaction.objectStore('general_api');
      const request = store.put({ id: 'general', ...data });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getGeneralApi(): Promise<any | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['general_api'], 'readonly');
      const store = transaction.objectStore('general_api');
      const request = store.get('general');
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async setAreaConfig(area: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['area_configs'], 'readwrite');
      const store = transaction.objectStore('area_configs');
      const request = store.put({ area, ...data });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAreaConfig(area: string): Promise<any | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['area_configs'], 'readonly');
      const store = transaction.objectStore('area_configs');
      const request = store.get(area);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  // Background sync all HW configurations after login
  async syncAllConfigurations(): Promise<void> {
    try {
      // Sync general API
      const generalResponse = await apiGet('/api/hw-general-api');
      const generalResult = await generalResponse.json();
      if (generalResult.success && generalResult.data) {
        await this.setGeneralApi(generalResult.data);
      }

      // Sync all area configurations
      const areas = [HwAreaEnum.REGISTERING, HwAreaEnum.WEIGHING_IN, HwAreaEnum.WEIGHING_OUT];
      for (const area of areas) {
        try {
          const areaResponse = await apiGet(`/api/hw-configuration?area=${area}`);
          const areaResult = await areaResponse.json();
          if (areaResult.success && areaResult.data) {
            await this.setAreaConfig(area, areaResult.data);
          }
        } catch (error) {
          console.warn(`Failed to sync area ${area}:`, error);
        }
      }
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}

export const hwConfigDB = new HwConfigDB();