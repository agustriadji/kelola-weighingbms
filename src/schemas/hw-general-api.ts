import { z } from 'zod';

export const HwGeneralApiSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export const UpsertHwGeneralApiSchema = HwGeneralApiSchema.extend({
  id: z.number().optional(),
});

export type HwGeneralApiType = z.infer<typeof HwGeneralApiSchema>;
export type UpsertHwGeneralApiType = z.infer<typeof UpsertHwGeneralApiSchema>;