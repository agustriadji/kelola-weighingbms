'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentMiscOrganism } from '@/components/organisms/DocumentMisc.organism';
import { MiscSchema, MiscType } from '@/schemas/misc.schema';
import { ButtonDocumentAction } from '@/components/molecules/ButtonDocument.molecules';
import { RegisterDocType } from '@/types/inbound.type';
import { DialogFooter } from '@/components/shared/DialogFooter';
import { useSysStore } from '@/store/sys.store';

export default function MiscFormPage({ onSuccess }: { onSuccess?: () => void }) {
  const { setLoadingState } = useSysStore();
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
    setLoadingState(true);
    try {
      const ok = window.confirm('Are you sure you want to submit this data ?');
      if (!ok) {
        return;
      }
      const res = await fetch('/api/pos1/misc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        onSuccess?.();
        alert(`${RegisterDocType.MISCELLANEOUS} saved!`);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit');
    }
    setLoadingState(false);
  };

  function onError(errors: FieldErrors<MiscType>) {
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

  async function handlerSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    // Check if reject button was clicked
    const submitter = (e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement;
    const isRejectAction = submitter?.name === 'REJECT';

    if (isRejectAction) {
      setValue('status', 'rejected');
    }
    handleSubmit(onSubmit, onError)();
  }

  return (
    <form
      onSubmit={handlerSubmitForm}
      className="flex flex-col gap-1 space-y-2  max-h-full mx-auto"
    >
      <div className="overflow-y-auto p-2 max-h-[60vh]">
        <DocumentMiscOrganism control={control} />
      </div>
      <DialogFooter>
        <ButtonDocumentAction onClose={onSuccess} />
      </DialogFooter>
    </form>
  );
}
