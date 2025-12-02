export const statusColor = (status: string) => {
  switch (status) {
    case 'registered':
      return 'text-blue-600';
    case 'queue-weigh-in':
      return 'text-orange-600';
    case 'weighing-in':
      return 'text-yellow-600';
    case 'weighed-in':
      return 'text-green-600';
    case 'yard-processing':
      return 'text-purple-600';
    case 'queue-weigh-out':
      return 'text-orange-600';
    case 'weighing-out':
      return 'text-yellow-600';
    case 'weighed-out':
      return 'text-green-600';
    case 'finished':
      return 'text-gray-600';
    default:
      return 'text-black';
  }
};
