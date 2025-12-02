import { StyledInput } from '@/components/atoms/StyledInput';
import { StyledSelect } from '../atoms/StyledSelect';

export function VehicleNumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
      <Controller
        name="vehicleNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Vehicle No." />}
      />
    </div>
  );
}

export function VehicleTypeMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
      <Controller
        name="vehicleType"
        control={control}
        render={({ field }) => (
          <StyledSelect
            value={field.value}
            onChange={field.onChange}
            placeholder="Vehicle Type"
            items={[
              { value: 'TRUCK', label: 'Truck' },
              { value: 'DUMP_TRUCK', label: 'Dump Truck' },
              { value: 'ISOTANK', label: 'Isotank' },
              { value: 'CONTAINER', label: 'Container' },
              { value: 'TANKI', label: 'Tanki' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function VehicleTypeIncomingMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
      <Controller
        name="vehicleType"
        control={control}
        render={({ field }) => (
          <StyledSelect
            value={field.value}
            onChange={field.onChange}
            placeholder="Vehicle Type"
            items={[
              { value: 'TRUCK', label: 'Truck' },
              { value: 'DUMP_TRUCK', label: 'Dump Truck' },
              { value: 'ISOTANK', label: 'Isotank' },
              { value: 'CONTAINER', label: 'Container' },
              { value: 'TANKI', label: 'Tanki' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function VehicleTypeOutgoingMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
      <Controller
        name="vehicleType"
        control={control}
        render={({ field }) => (
          <StyledSelect
            value={field.value}
            onChange={field.onChange}
            placeholder="Vehicle Type"
            items={[
              { value: 'ISOTANK', label: 'Isotank' },
              { value: 'TANKI', label: 'Tanki' },
              { value: 'CONTAINER_20FCL', label: 'Container 20 FCL' },
              { value: 'CONTAINER_40FCL', label: 'Container 40 FCL' },
            ]}
          />
        )}
      />
    </div>
  );
}
