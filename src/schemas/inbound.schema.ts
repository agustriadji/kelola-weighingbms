import { z } from 'zod';
import { DocumentTypeEnum, SealConditionEnum } from '@/types/constanta';

export const InboundSchema = z.object({
  id: z.number().optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
  rfid: z.string().min(1, 'RFID is required'),
  vehicleNumber: z.string().min(1, 'Vehicle Number is required'),
  driverName: z.string().min(1, 'Driver Name is required'),
  driverId: z.string().min(1, 'Driver ID is required'),
  transporter: z.string().min(1, 'Transporter is required'),
  documentType: z.enum([DocumentTypeEnum.SJ, DocumentTypeEnum.PO, DocumentTypeEnum.DO]),
  sjNumber: z.string().optional(),
  poNumber: z.string().optional(),
  doNumber: z.string().optional(),
  material: z.string().min(1, 'Material is required'),
  expectedQuantity: z.number().optional(),
  actualQuantity: z.number().optional(),
  uom: z.string().optional(),
  sealNumber: z.string().min(1, 'Seal Number is required'),
  sealCondition: z.enum([
    SealConditionEnum.BROKEN,
    SealConditionEnum.MISSING,
    SealConditionEnum.OK,
  ]),
  doorLocked: z.boolean().optional(),
  noLeakage: z.boolean().optional(),
  loadVisible: z.boolean().optional(),
  batchNumber: z.string().min(1, 'Batch Number is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type InboundType = z.infer<typeof InboundSchema>;
