'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentOutgoingOrganism } from '@/components/organisms/DocumentOutgoing.organism';
import { OutgoingSchema, OutgoingType } from '@/schemas/outgoing.schema';
import { ButtonDocumentAction } from '@/components/molecules/ButtonDocument.molecules';

export default function OutgoingFormPage({ onSuccess }: { onSuccess?: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OutgoingType>({
    resolver: zodResolver(OutgoingSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'pending',
    },
  });

  function onError(errors: FieldErrors<OutgoingType>) {
    console.log('Form validation errors:', errors);
    alert('Please check the form for errors!');
  }

  const onSubmit: SubmitHandler<OutgoingType> = async (data) => {
    try {
      const res = await fetch('/api/pos1/outgoing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        onSuccess?.();
        alert('Outgoing saved!');
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-1 p-6 space-y-2 max-w-6xl mx-auto"
    >
      <DocumentOutgoingOrganism control={control} />
      <div className="grid grid-cols-2 gap-4 pt-3 max-w-xs ml-auto">
        <ButtonDocumentAction onClose={onSuccess} />
      </div>
    </form>
  );
}
