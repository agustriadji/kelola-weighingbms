import { z } from 'zod';

export const IncomingSchema = z.object({
  // RFID & Vehicle
  rfid: z.string().optional(),
  vehicleNumber: z.string().min(1),
  vehicleType: z.string().optional(),
  driverName: z.string().min(1),
  driverId: z.string().optional(),
  transporter: z.string().min(1),
  containerNumber: z.string().optional(),
  sealNumber: z.string().optional(),

  // Document
  contractNumber: z.string().optional(),
  doNumber: z.string().optional(),
  poNumber: z.string().optional(),
  supplier: z.string().optional(),
  material: z.string().min(1),
  //   destination: z.string().optional(),
  millOriginal: z.string().optional(),
  certificate: z.string().optional(),

  // SPB / BC
  spbNumber: z.string().optional(),
  spbDate: z.string().optional(),
  bcType: z.string().optional(),
  bcNumber: z.string().optional(),
  bcStatus: z.string().optional(),
  ffa: z.string().optional(),
  moist: z.string().optional(),
  impurity: z.string().optional(),

  // Status default
  status: z.string().optional(),
});

export type IncomingType = z.infer<typeof IncomingSchema>;
