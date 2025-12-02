import { StyledInput } from '../atoms/StyledInput';

export function MaterialMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Material</label>
      <Controller
        name="material"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Material" />}
      />
    </div>
  );
}
