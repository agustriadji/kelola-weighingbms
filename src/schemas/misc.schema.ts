import { z } from 'zod';

export const MiscSchema = z.object({
  contractNumber: z.string().nonempty(),
  poNumber: z.string().nonempty(),
  supplier: z.string().nonempty(),
  relationName: z.string().nonempty(),
  material: z.string().nonempty(),
  doNumber: z.string().nonempty(),
  vehicleNumber: z.string().nonempty(),
  vehicleType: z.string().optional(),
  transporter: z.string().nonempty(),
  driverName: z.string().nonempty(),

  containerNumber: z.string().optional(),
  driverId: z.string().optional(),

  bcType: z.string().nonempty(),
  bcNumber: z.string().nonempty(),
  sealNumber: z.string().optional(),

  status: z.string().optional(),
});

export type MiscType = z.infer<typeof MiscSchema>;
