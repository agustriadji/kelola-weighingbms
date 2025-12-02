import { z } from 'zod';

export const MiscSchema = z.object({
  contractNumber: z.string().optional(),
  poNumber: z.string().optional(),
  supplier: z.string().optional(),
  material: z.string(),
  doNumber: z.string().optional(),
  vehicleNumber: z.string(),
  vehicleType: z.string().optional(),
  containerNumber: z.string().optional(),
  transporter: z.string(),
  driverName: z.string(),
  driverId: z.string().optional(),

  bcType: z.string().optional(),
  bcNumber: z.string().optional(),
  sealNumber: z.string().optional(),
  status: z.string().optional(),
});

export type MiscType = z.infer<typeof MiscSchema>;
