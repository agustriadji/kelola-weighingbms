import { z } from 'zod';

export const OutgoingSchema = z.object({
  vehicleNumber: z.string(),
  vehicleType: z.string(),
  driverName: z.string(),
  transporter: z.string(),

  // Outgoing Specific
  contractNumber: z.string().optional(),
  relationName: z.string(), // customer / buyer
  material: z.string(),
  doNumber: z.string(),
  siNumber: z.string().optional(), // Shipping Instruction
  certificate: z.string().optional(),
  containerNumber: z.string().optional(),
  vesselName: z.string().optional(),

  // Seal
  sealNumber: z.string().optional(),
  //   sealCondition: z.string().optional(),

  //   // Checklist
  //   doorLocked: z.boolean().default(false).optional(),
  //   noLeakage: z.boolean().default(false).optional(),
  //   loadVisible: z.boolean().default(false).optional(),

  //  certificate: z.string().optional(),

  status: z.string().optional(),
});

export type OutgoingType = z.infer<typeof OutgoingSchema>;
