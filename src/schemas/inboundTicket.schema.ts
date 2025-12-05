import { z } from 'zod';

export const InboundTicketSchema = z.object({
  status: z.enum([
    'registered',
    'queue-weigh-in',
    'weighing-in',
    'weighed-in',
    'yard-processing',
    'queue-weigh-out',
    'weighing-out',
    'weighed-out',
    'finished',
  ]),
});

export type InboundTicketType = z.infer<typeof InboundTicketSchema>;
