import { StyledRadio } from '@/components/atoms/StyledRadio';
import { StyledInput } from '../atoms/StyledInput';
import { StyledCheckbox } from '../atoms/StyledCheckbox';

export function SealNumberMolecules({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Seal Number</label>
      <Controller
        name="sealNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Seal Number" />}
      />
    </div>
  );
}

export function SealRangeMolecules({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Seal Range</label>
      <Controller
        name="sealRange"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Seal Range" />}
      />
    </div>
  );
}

export function SealConditionMolecules({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Seal Condition</label>
      <Controller
        name="sealCondition"
        control={control}
        render={({ field }) => (
          <StyledRadio
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: 'ok', label: 'OK' },
              { value: 'broken', label: 'Broken' },
              { value: 'missing', label: 'Missing' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function DoorLockedMolecules({ control, Controller }) {
  return (
    <Controller
      name="doorLocked"
      control={control}
      render={({ field }) => (
        <StyledCheckbox
          id="doorlocked"
          checked={!!field.value}
          onChange={(v) => field.onChange(!!v)}
          label="Door Locked"
        />
      )}
    />
  );
}

export function NoLeakageMolecules({ control, Controller }) {
  return (
    <Controller
      name="noLeakage"
      control={control}
      render={({ field }) => (
        <StyledCheckbox
          id="leakage"
          checked={!!field.value}
          onChange={(v) => field.onChange(!!v)}
          label="No Leakage"
        />
      )}
    />
  );
}

export function LoadVisibleMolecules({ control, Controller }) {
  return (
    <Controller
      name="loadVisible"
      control={control}
      render={({ field }) => (
        <StyledCheckbox
          id="visible"
          checked={!!field.value}
          onChange={(v) => field.onChange(!!v)}
          label="Load Visible"
        />
      )}
    />
  );
}
