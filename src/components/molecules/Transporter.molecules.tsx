import { StyledInput } from '@/components/atoms/StyledInput';

export function TransporterMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Transporter*</label>
      <Controller
        name="transporter"
        control={control}
        render={({ field }) => (
          <StyledInput {...field} placeholder="Transporter Name" required={true} />
        )}
      />
    </div>
  );
}
