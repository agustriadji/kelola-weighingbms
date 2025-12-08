'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentOutgoingOrganism } from '@/components/organisms/DocumentOutgoing.organism';
import { OutgoingSchema, OutgoingType } from '@/schemas/outgoing.schema';
import { ButtonDocumentAction } from '@/components/molecules/ButtonDocument.molecules';
import { RegisterDocTypeName } from '@/types/inbound.type';

import { DialogFooter } from '@/components/shared/DialogFooter';
import { useSysStore } from '@/store/sys.store';

export default function OutgoingFormPage({ onSuccess }: { onSuccess?: () => void }) {
  const { setLoadingState } = useSysStore();
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
    // Log each error with details
    Object.entries(errors).forEach(([field, error]) => {
      console.log(`Field "${field}":`, {
        message: error?.message,
        type: error?.type,
        value: control._formValues[field],
      });
    });

    alert(`Validation errors in: ${Object.keys(errors).join(', ')}`);
  }

  const onSubmit: SubmitHandler<OutgoingType> = async (data) => {
    setLoadingState(true);
    try {
      const res = await fetch('/api/pos1/outgoing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        onSuccess?.();
        alert(`${RegisterDocTypeName.DISPATCH} saved!`);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit');
    }
    setLoadingState(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit, onError)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-1 space-y-2  max-h-full mx-auto">
      <div className="overflow-y-auto p-2 max-h-[60vh]">
        <DocumentOutgoingOrganism control={control} />
      </div>
      <DialogFooter>
        <ButtonDocumentAction onClose={onSuccess} />
      </DialogFooter>
    </form>
  );
}
