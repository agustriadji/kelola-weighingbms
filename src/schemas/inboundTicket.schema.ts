import { InboundStatus } from '@/types/inbound.type';
import { z } from 'zod';

export const InboundTicketSchema = z.object({
  status: z.enum([
    InboundStatus.REGISTERED,
    InboundStatus.QUEUE_IN,
    InboundStatus.WEIGHING_IN,
    InboundStatus.WEIGHED_IN,
    InboundStatus.YARD,
    InboundStatus.QUEUE_OUT,
    InboundStatus.WEIGHING_OUT,
    InboundStatus.WEIGHED_OUT,
    InboundStatus.FINISHED,
  ]),
});

export type InboundTicketType = z.infer<typeof InboundTicketSchema>;
