import { z } from 'zod';

export const WeighOutSchema = z.object({
  inboundId: z.number(),
  tarra: z.number(),
  cctvUrl: z.string().optional(),

  // auto computed
  expectedNetto: z.number().optional(),
  netto: z.number().optional(),
  shrinkageValue: z.number().optional(),
  shrinkagePercent: z.number().optional(),

  status: z.string().default('closing'),
});

export type WeighOutType = z.infer<typeof WeighOutSchema>;
