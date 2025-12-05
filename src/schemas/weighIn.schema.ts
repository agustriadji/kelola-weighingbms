import { z } from 'zod';

export const WeighInSchema = z.object({
  inboundId: z.number(),
  brutto: z.number(),
  stable: z.boolean(),
  approved: z.boolean(),
  cctvBruttoUrl: z.string().optional(),
});

export type WeighInType = z.infer<typeof WeighInSchema>;
