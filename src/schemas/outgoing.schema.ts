import { InboundStatus } from '@/types/inbound.type';
import { z } from 'zod';

export const OutgoingSchema = z.object({
  vehicleNumber: z.string().nonempty(),
  vehicleType: z.string().nonempty(),
  driverName: z.string().nonempty(),
  transporter: z.string().nonempty(),

  // Outgoing Specific
  contractNumber: z.string().optional(),
  relationName: z.string().nonempty(), // customer / buyer
  material: z.string().nonempty(),
  doNumber: z.string().nonempty(),
  siNumber: z.string().nonempty(), // Shipping Instruction
  certificate: z.string().nonempty(),

  containerNumber: z.string().optional(),
  vesselName: z.string().optional(),
  sealNumber: z.string().optional(),

  //   sealCondition: z.string().optional(),
  //   // Checklist
  //   doorLocked: z.boolean().default(false).optional(),
  //   noLeakage: z.boolean().default(false).optional(),
  //   loadVisible: z.boolean().default(false).optional(),

  status: z.string().optional().default(InboundStatus.WEIGHING_OUT),
});

export type OutgoingType = z.infer<typeof OutgoingSchema>;
