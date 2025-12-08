import { Controller } from 'react-hook-form';
import {
  DONumberMolecule,
  PONumberMolecule,
  ContractNumberMolecule,
  RelationNameMolecule,
  BCTypeMolecule,
  BCNumberMolecule,
  ContainerNumberMolecule,
  SupplierMaterialMolecule,
} from '../molecules/Document.molecules';
import { DriverNameMolecule, DriverIdMolecule } from '@/components/molecules/Driver.molecules';
import {
  VehicleTypeMiscMolecule,
  VehicleNumberMolecule,
} from '@/components/molecules/Vehicle.molecules';
import { TransporterMolecule } from '@/components/molecules/Transporter.molecules';
import { MaterialMolecule } from '../molecules/Material.molecules';
import { SealNumberMolecules } from '../molecules/CheckCondition.molecules';
// import { CCTVStreamMolecule } from '../molecules/Cctv.molecules';

export function DocumentMiscOrganism({ control }) {
  return (
    <section className="space-y-4">
      {/* <h2 className="font-semibold text-sm text-slate-500">Document Verification</h2> */}

      {/* ==== BAGIAN 1 — DOCUMENT NUMBERS & TYPES ==== */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <PONumberMolecule control={control} Controller={Controller} />
          <ContractNumberMolecule control={control} Controller={Controller} />
          <RelationNameMolecule control={control} Controller={Controller} />
          <SupplierMaterialMolecule control={control} Controller={Controller} />
          <MaterialMolecule control={control} Controller={Controller} />
          <DONumberMolecule control={control} Controller={Controller} />
        </div>
        <div className="space-y-3">
          <VehicleNumberMolecule control={control} Controller={Controller} />
          <VehicleTypeMiscMolecule control={control} Controller={Controller} />
          <DriverNameMolecule control={control} Controller={Controller} />
          <DriverIdMolecule control={control} Controller={Controller} />
          <TransporterMolecule control={control} Controller={Controller} />
          <ContainerNumberMolecule control={control} Controller={Controller} />
        </div>
        <div className="space-y-3">
          <SealNumberMolecules control={control} Controller={Controller} />
          <BCTypeMolecule control={control} Controller={Controller} />
          <BCNumberMolecule control={control} Controller={Controller} />
        </div>
      </div>
    </section>
  );
}
