'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChecklistOrganism } from '../organisms/Checklist.organism';
import { DocumentIncomingOrganism } from '../organisms/DocumentIncoming.organism';
import { RFIDOrganism } from '../organisms/Rfid.organism';
import { InboundSchema, InboundType } from '@/schemas/inbound.schema';

export default function InboundFormPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InboundType>({
    resolver: zodResolver(InboundSchema),
    defaultValues: {
      status: 'pending',
    },
  });

  function onSubmit(data: InboundType) {
    console.log('Inbound Data: ', data);
    alert('Inbound saved!');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-2 max-w-5xl mx-auto">
      <RFIDOrganism control={control} />
      <DocumentIncomingOrganism control={control} />
      <ChecklistOrganism control={control} />
    </form>
  );
}
