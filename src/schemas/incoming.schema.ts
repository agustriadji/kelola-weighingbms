import { z } from 'zod';

export const IncomingSchema = z.object({
  // RFID & Vehicle
  rfid: z.string().optional(),
  vehicleNumber: z.string().min(3),
  vehicleType: z.string().optional(),
  driverName: z.string().min(3),
  driverId: z.string().optional(),
  transporter: z.string().min(1),
  containerNumber: z.string().optional(),
  sealNumber: z.string().optional(),

  // Document
  contractNumber: z.string().nonempty(),
  doNumber: z.string().nonempty(),
  poNumber: z.string().nonempty(),
  supplier: z.string().nonempty(),
  material: z.string().nonempty(),
  //   destination: z.string().nonempty(),
  millOriginal: z.string().nonempty(),
  certificate: z.string().nonempty(),

  // SPB / BC
  spbNumber: z.string().nonempty(),
  spbDate: z.string().nonempty(),
  bcType: z.string().nonempty(),
  bcNumber: z.string().nonempty(),
  bcStatus: z.string().nonempty(),
  ffa: z.string().nonempty(),
  moist: z.string().nonempty(),
  impurity: z.string().nonempty(),

  // Status default
  status: z.string().optional(),
});

export type IncomingType = z.infer<typeof IncomingSchema>;
