import { HardwarePermissionService } from './hardware-permission.service';

export interface HardwareRequest {
  ClientType: number;
  RequestType?: number;
  Gate?: number;
  Camera?: number;
  Reader?: number;
  Card?: string;
}

export interface HardwareResponse {
  ResponseType: number;
  Status: number;
  Message: string;
  Photo?: string;
}

export class HardwareService {
  private static instance: HardwareService;
  private permissionService = HardwarePermissionService.getInstance();

  static getInstance(): HardwareService {
    if (!HardwareService.instance) {
      HardwareService.instance = new HardwareService();
    }
    return HardwareService.instance;
  }

  private async callHardwareAPI(baseUrl: string, payload: HardwareRequest): Promise<HardwareResponse> {
    const auth = btoa('cardteck:fokus321'); // Basic Auth
    
    const response = await fetch(`${baseUrl}/Gate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Hardware API error: ${response.status}`);
    }

    return response.json();
  }

  async openGateByPermission(gateApiUrl: string, userPermissions: string[]): Promise<HardwareResponse> {
    const access = this.permissionService.getHardwareAccess(userPermissions);
    if (!access) {
      throw new Error('No hardware access permission');
    }
    
    return this.callHardwareAPI(gateApiUrl, {
      ClientType: 121,
      RequestType: 1,
      Gate: access.gateIndex
    });
  }

  async activateFlashLampByPermission(gateApiUrl: string, userPermissions: string[]): Promise<HardwareResponse> {
    const access = this.permissionService.getHardwareAccess(userPermissions);
    if (!access) {
      throw new Error('No hardware access permission');
    }
    
    return this.callHardwareAPI(gateApiUrl, {
      ClientType: 121,
      RequestType: 2,
      Gate: access.lampIndex
    });
  }

  async capturePhotoByPermission(camApiUrl: string, userPermissions: string[]): Promise<HardwareResponse> {
    const access = this.permissionService.getHardwareAccess(userPermissions);
    if (!access) {
      throw new Error('No hardware access permission');
    }
    
    return this.callHardwareAPI(camApiUrl, {
      ClientType: 121,
      RequestType: 3,
      Camera: access.cameraIndex
    });
  }

  async testConnection(apiUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      // Test dengan ping request sederhana
      const response = await fetch(`${apiUrl}/Gate`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa('cardteck:fokus321')}`
        }
      });
      
      return {
        success: response.ok,
        message: response.ok ? 'Connection successful' : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
}