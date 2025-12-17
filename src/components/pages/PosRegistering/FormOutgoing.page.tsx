'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lazy, Suspense } from 'react';
import { OutgoingSchema, OutgoingType } from '@/schemas/outgoing.schema';
import { InboundStatus, RegisterDocTypeName } from '@/types/inbound.type';
import { useSysStore } from '@/store/sys.store';

const DocumentOutgoingOrganism = lazy(() =>
  import('@/components/organisms/DocumentOutgoing.organism').then((m) => ({
    default: m.DocumentOutgoingOrganism,
  }))
);
const ButtonDocumentAction = lazy(() =>
  import('@/components/molecules/ButtonDocument.molecules').then((m) => ({
    default: m.ButtonDocumentAction,
  }))
);
const DialogFooter = lazy(() =>
  import('@/components/shared/DialogFooter').then((m) => ({ default: m.DialogFooter }))
);

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
      status: InboundStatus.QUEUE_IN,
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
    // Check if reject button was clicked
    const submitter = (e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement;
    const isRejectAction = submitter?.name === 'REJECT';

    if (isRejectAction) {
      setValue('status', 'rejected');
    }
    handleSubmit(onSubmit, onError)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-1 space-y-2  max-h-full mx-auto">
      <div className="overflow-y-auto p-2 max-h-[60vh]">
        <Suspense
          fallback={
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <DocumentOutgoingOrganism control={control} />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="h-16 flex items-center justify-center gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        }
      >
        <DialogFooter>
          <ButtonDocumentAction onClose={onSuccess} />
        </DialogFooter>
      </Suspense>
    </form>
  );
}
