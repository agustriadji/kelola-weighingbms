'use client';

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentIncomingOrganism } from '@/components/organisms/DocumentIncoming.organism';
import { IncomingSchema, IncomingType } from '@/schemas/incoming.schema';
import { ButtonDocumentAction } from '@/components/molecules/ButtonDocument.molecules';

export default function FormIncomingPage({ onSuccess }: { onSuccess?: () => void }) {
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
    console.log('Submitting data:', data);
    try {
      const res = await fetch('/api/pos1/incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.ok) {
        onSuccess?.();
        alert('Incoming saved!');
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit');
    }
  };

  function onError(errors: FieldErrors<IncomingType>) {
    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('Raw errors object:', errors);
    console.log('Error fields:', Object.keys(errors));

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit, onError)(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-1 p-6 space-y-2 max-w-6xl mx-auto"
    >
      <DocumentIncomingOrganism control={control} />
      <div className="grid grid-cols-2 gap-4 pt-3 max-w-xs ml-auto">
        <ButtonDocumentAction onClose={onSuccess} />
      </div>
    </form>
  );
}
