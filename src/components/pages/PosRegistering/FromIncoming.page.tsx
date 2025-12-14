'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentIncomingOrganism } from '@/components/organisms/DocumentIncoming.organism';
import { IncomingSchema, IncomingType } from '@/schemas/incoming.schema';
import { ButtonDocumentAction } from '@/components/molecules/ButtonDocument.molecules';
import { DialogFooter } from '@/components/shared/DialogFooter';
import { useSysStore } from '@/store/sys.store';
import { RegisterDocTypeName } from '@/types/inbound.type';

export default function FormIncomingPage({ onSuccess }: { onSuccess?: () => void }) {
  const { setLoadingState } = useSysStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IncomingType>({
    resolver: zodResolver(IncomingSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'pending',
      rfid: '',
      vehicleNumber: '',
      certificate: '',
      vehicleType: '',
      driverId: '',
      containerNumber: '',
      sealNumber: '',
      supplier: '',
      poNumber: '',
      doNumber: '',
      millOriginal: '',
      contractNumber: '',
      material: '',
      spbDate: '',
      spbNumber: '',
      driverName: '',
      transporter: '',
      bcStatus: '',
      bcNumber: '',
      bcType: '',
      ffa: '',
      moist: '',
      impurity: '',
    },
  });

  const onSubmit: SubmitHandler<IncomingType> = async (data) => {
    setLoadingState(true);
    try {
      const res = await fetch('/api/pos1/incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        onSuccess?.();
        alert(`${RegisterDocTypeName.RAW_MATERIAL} saved!`);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit');
    }
    setLoadingState(false);
  };

  function onError(errors: FieldErrors<IncomingType>) {
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        <DocumentIncomingOrganism control={control} />
      </div>

      <DialogFooter>
        <ButtonDocumentAction onClose={onSuccess} />
      </DialogFooter>
    </form>
  );
}
