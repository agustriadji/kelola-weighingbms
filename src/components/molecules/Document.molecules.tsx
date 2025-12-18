import { StyledSelect } from '@/components/atoms/StyledSelect';
import { StyledInput } from '@/components/atoms/StyledInput';
import { StyledDate } from '../atoms/StyledDate';

export function DocumentTypeMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Document Type</label>
      <Controller
        name="documentType"
        control={control}
        render={({ field }) => (
          <StyledSelect
            value={field.value}
            onChange={field.onChange}
            placeholder="Document Type"
            items={[
              { value: 'do', label: 'Delivery Order (DO)' },
              { value: 'po', label: 'Purchase Order (PO)' },
              { value: 'sj', label: 'Surat Jalan' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function DONumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">DO Number*</label>
      <Controller
        name="doNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="DO Number" required={true} />}
      />
    </div>
  );
}

export function ContainerNumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Container Number</label>
      <Controller
        name="containerNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Container Number" />}
      />
    </div>
  );
}

export function PONumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Po Number*</label>
      <Controller
        name="poNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="PO Number" required={true} />}
      />
    </div>
  );
}

export function SJNumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Surat Jalan</label>
      <Controller
        name="sjNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Delivery Note" />}
      />
    </div>
  );
}

export function ContractNumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Contract SO/Number*</label>
      <Controller
        name="contractNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="SO Number" required={true} />}
      />
    </div>
  );
}

export function DestinationMolecule({ control, Controller }) {
  return (
    <Controller
      name="destination"
      control={control}
      render={({ field }) => <StyledInput {...field} placeholder="Destination" required={true} />}
    />
  );
}

export function SupplierMaterialMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Supplier*</label>
      <Controller
        name="supplier"
        control={control}
        render={({ field }) => (
          <StyledSelect
            required={true}
            value={field.value}
            onChange={field.onChange}
            placeholder="Supplier Material"
            items={[
              { value: 'majujaya', label: 'PT Maju Jaya' },
              { value: 'angkutlancar', label: 'PT Angkut Lancar' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function MillOriginalMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Mill Original*</label>
      <Controller
        name="millOriginal"
        control={control}
        render={({ field }) => (
          <StyledInput {...field} placeholder="Mill Original" required={true} />
        )}
      />
    </div>
  );
}

export function RelationNameMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Relation Name*</label>
      <Controller
        name="relationName"
        control={control}
        render={({ field }) => (
          <StyledInput {...field} placeholder="Relation Name" required={true} />
        )}
      />
    </div>
  );
}

export function SINumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">SI Number*</label>
      <Controller
        name="siNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="SI Number" required={true} />}
      />
    </div>
  );
}

export function VesselNameMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Vessel Name</label>
      <Controller
        name="vesselName"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Vessel Name" />}
      />
    </div>
  );
}

export function CertificateOutgoingMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Certificate*</label>
      <Controller
        name="certificate"
        control={control}
        render={({ field }) => (
          <StyledSelect
            required={true}
            value={field.value}
            onChange={field.onChange}
            placeholder="Certificate"
            items={[
              { value: 'NONE', label: 'None' },
              { value: 'RSPO', label: 'RSPO' },
              { value: 'ISCC', label: 'ISCC' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function CertificateIncomingMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Certificate*</label>
      <Controller
        name="certificate"
        control={control}
        render={({ field }) => (
          <StyledSelect
            required={true}
            value={field.value}
            onChange={field.onChange}
            placeholder="Certificate"
            items={[
              { value: 'NONE', label: 'NONE' },
              { value: 'RSPO', label: 'RSPO' },
              { value: 'ISCC', label: 'ISCC' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function BCTypeMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">BC Type*</label>
      <Controller
        name="bcType"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Type BC" required={true} />}
      />
    </div>
  );
}

export function BCNumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">BC Number*</label>
      <Controller
        name="bcNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="BC Number" required={true} />}
      />
    </div>
  );
}

export function BCStatusMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">BC Status*</label>
      <Controller
        name="bcStatus"
        control={control}
        render={({ field }) => (
          <StyledSelect
            required={true}
            value={field.value}
            onChange={field.onChange}
            placeholder="BC Status"
            items={[
              { value: 'READY', label: 'Ready' },
              { value: 'NOT_READY', label: 'Not Ready' },
            ]}
          />
        )}
      />
    </div>
  );
}

export function SPBNumberMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">SPB Number*</label>
      <Controller
        name="spbNumber"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="SPB Number" required={true} />}
      />
    </div>
  );
}

export function SPBDateMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">SPB Date*</label>
      <Controller
        name="spbDate"
        control={control}
        render={({ field }) => <StyledDate {...field} placeholder="SPB Date" required={true} />}
      />
    </div>
  );
}

export function FFAMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">FFA*</label>
      <Controller
        name="ffa"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="FFA" required={true} />}
      />
    </div>
  );
}

export function MoistMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Moist*</label>
      <Controller
        name="moist"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Moist" required={true} />}
      />
    </div>
  );
}

export function ImpuritiesMolecule({ control, Controller }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Impurity*</label>
      <Controller
        name="impurity"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Impurity" required={true} />}
      />
    </div>
  );
}
