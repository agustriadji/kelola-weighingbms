import { StyledInput } from '@/components/atoms/StyledInput';

export function RFIDMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">RFID Number</label>
      <Controller
        name="rfid"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="RFID" />}
      />
    </div>
  );
}
