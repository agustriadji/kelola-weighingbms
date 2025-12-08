import { StyledInput } from '@/components/atoms/StyledInput';

export function DriverNameMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Driver Name*</label>
      <Controller
        name="driverName"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Driver Name" required={true} />}
      />
    </div>
  );
}

export function DriverIdMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">SIM / Driver ID</label>
      <Controller
        name="driverId"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Driver SIM / ID" />}
      />
    </div>
  );
}
