import { z } from 'zod';
import { HwAreaEnum } from '@/entities/HwConfiguration.entity';

export const HwConfigurationSchema = z.object({
  area: z.enum([HwAreaEnum.REGISTERING, HwAreaEnum.WEIGHING_IN, HwAreaEnum.WEIGHING_OUT]),
  dataConfig: z.object({
    gate: z.number().min(1).max(5).nullable().optional(),
    camera: z.number().min(1).max(5).nullable().optional(),
    lamp: z.number().min(1).max(5).nullable().optional(),
    mqtt: z.object({
      topic_get_weight: z.string().nullable().optional(),
      topic_post_command: z.string().nullable().optional(),
    }).nullable().optional(),
  }),
});

export const UpsertHwConfigurationSchema = HwConfigurationSchema.extend({
  id: z.number().optional(),
});

export type HwConfigurationType = z.infer<typeof HwConfigurationSchema>;
export type UpsertHwConfigurationType = z.infer<typeof UpsertHwConfigurationSchema>;