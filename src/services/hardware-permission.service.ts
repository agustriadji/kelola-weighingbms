import { Permissions } from '@/types/rbac';

export interface HardwareAccess {
  gateIndex: number;
  cameraIndex: number;
  lampIndex: number;
  area: string;
}

export class HardwarePermissionService {
  private static instance: HardwarePermissionService;

  static getInstance(): HardwarePermissionService {
    if (!HardwarePermissionService.instance) {
      HardwarePermissionService.instance = new HardwarePermissionService();
    }
    return HardwarePermissionService.instance;
  }

  getHardwareAccess(permissions: string[]): HardwareAccess | null {
    // OPERATOR_REGISTERING: Gate 1, Camera 1, Lamp 1
    if (this.hasRegistrationPermissions(permissions)) {
      return {
        gateIndex: 1,
        cameraIndex: 1,
        lampIndex: 1,
        area: 'REGISTERING'
      };
    }

    // OPERATOR_WEIGHING_IN: Gate 2, Camera 2, Lamp 2
    if (permissions.includes(Permissions.POS_WEIGHINGIN)) {
      return {
        gateIndex: 2,
        cameraIndex: 2,
        lampIndex: 2,
        area: 'WEIGHING_IN'
      };
    }

    // OPERATOR_WEIGHING_OUT: Gate 3, Camera 3, Lamp 3
    if (permissions.includes(Permissions.POS_WEIGHINGOUT)) {
      return {
        gateIndex: 3,
        cameraIndex: 3,
        lampIndex: 3,
        area: 'WEIGHING_OUT'
      };
    }

    return null;
  }

  private hasRegistrationPermissions(permissions: string[]): boolean {
    return permissions.includes(Permissions.CREATE_INCOMING) &&
           permissions.includes(Permissions.CREATE_OUTGOING) &&
           permissions.includes(Permissions.CREATE_MISC);
  }

  canAccessHardware(permissions: string[], targetArea: string): boolean {
    const access = this.getHardwareAccess(permissions);
    return access?.area === targetArea;
  }

  getAllowedAreas(permissions: string[]): string[] {
    const areas: string[] = ['GENERAL']; // GENERAL always accessible
    
    if (this.hasRegistrationPermissions(permissions)) {
      areas.push('REGISTERING');
    }
    
    if (permissions.includes(Permissions.POS_WEIGHINGIN)) {
      areas.push('WEIGHING_IN');
    }
    
    if (permissions.includes(Permissions.POS_WEIGHINGOUT)) {
      areas.push('WEIGHING_OUT');
    }

    return areas;
  }
}