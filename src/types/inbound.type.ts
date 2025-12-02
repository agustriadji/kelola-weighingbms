import { DocumentTypeEnum, SealConditionEnum } from './constanta';

export interface InboundType {
  id?: number;
  rfid: string;
  vehicleNumber: string;
  driverName: string;
  driverId: string;
  transporter: string;

  documentType: DocumentTypeEnum;
  sjNumber?: string;
  poNumber?: string;
  doNumber?: string;

  material: string;
  expectedQuantity?: number;
  actualQuantity?: number;
  uom?: string;

  sealNumber: string;
  sealCondition: SealConditionEnum;

  doorLocked: boolean | false;
  noLeakage: boolean | false;
  loadVisible: boolean | false;

  batchNumber: string;

  createdAt?: Date;
  updatedAt?: Date;
}
