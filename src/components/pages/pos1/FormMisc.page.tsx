'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentMiscOrganism } from '@/components/organisms/DocumentMisc.organism';
import { MiscSchema, MiscType } from '@/schemas/misc.schema';
import { ButtonDocumentAction } from '@/components/molecules/ButtonDocument.molecules';

export default function MiscFormPage({ onSuccess }: { onSuccess?: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MiscType>({
    resolver: zodResolver(MiscSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'pending',
    },
  });

  const onSubmit: SubmitHandler<MiscType> = async (data) => {
    try {
      const res = await fetch('/api/pos1/misc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        onSuccess?.();
        alert('Misc saved!');
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit');
    }
  };

  function onError(errors: FieldErrors<MiscType>) {
    console.log('Form validation errors:', errors);
    alert('Please check the form for errors!');
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-1 p-6 space-y-2 max-w-6xl mx-auto"
    >
      <DocumentMiscOrganism control={control} />
      <div className="grid grid-cols-2 gap-4 pt-3 max-w-xs ml-auto">
        <ButtonDocumentAction onClose={onSuccess} />
      </div>
    </form>
  );
}
