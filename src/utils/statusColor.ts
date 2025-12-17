import { InboundStatus } from '@/types/inbound.type';

export const statusColor = (status: string) => {
  switch (status) {
    case InboundStatus.REGISTERED:
      return 'text-white bg-gray-500';
    case InboundStatus.QUEUE_IN:
      return 'text-white bg-orange-600 ';
    case InboundStatus.WEIGHING_IN:
      return 'text-white bg-yellow-600';
    case InboundStatus.WEIGHED_IN:
      return 'text-white bg-green-600';
    case InboundStatus.YARD:
      return 'text-white bg-purple-600';
    case InboundStatus.QUEUE_OUT:
      return 'text-white bg-orange-600';
    case InboundStatus.WEIGHING_OUT:
      return 'text-white bg-yellow-600';
    case InboundStatus.WEIGHED_OUT:
      return 'text-white bg-green-600';
    case InboundStatus.FINISHED:
      return 'text-black bg-gray-200';
    default:
      return 'text-black';
  }
};
