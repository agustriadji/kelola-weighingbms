import { Controller } from 'react-hook-form';
import {
  DONumberMolecule,
  PONumberMolecule,
  ContractNumberMolecule,
  SupplierMaterialMolecule,
  MillOriginalMolecule,
  CertificateIncomingMolecule,
  ContainerNumberMolecule,
  SPBDateMolecule,
  SPBNumberMolecule,
  BCNumberMolecule,
  BCTypeMolecule,
  BCStatusMolecule,
  FFAMolecule,
  MoistMolecule,
  ImpuritiesMolecule,
  RFIDMolecule,
} from '../molecules/Document.molecules';
import { MaterialMolecule } from '../molecules/Material.molecules';
import { VehicleNumberMolecule, VehicleTypeIncomingMolecule } from '../molecules/Vehicle.molecules';
import { DriverIdMolecule, DriverNameMolecule } from '../molecules/Driver.molecules';
import { TransporterMolecule } from '../molecules/Transporter.molecules';
import { SealNumberMolecules } from '../molecules/CheckCondition.molecules';
import { CCTVStreamMolecule } from '../molecules/Cctv.molecules';

export function DocumentIncomingOrganism({ control }) {
  return (
    <section className="space-y-4">
      {/* <h2 className="font-semibold text-sm text-slate-500">Document Verification</h2> */}

      {/* ==== BAGIAN 1 — DOCUMENT NUMBERS & TYPES ==== */}
      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-6">
          <PONumberMolecule control={control} Controller={Controller} />
          <ContractNumberMolecule control={control} Controller={Controller} />
          <SupplierMaterialMolecule control={control} Controller={Controller} />
          <MaterialMolecule control={control} Controller={Controller} />
          <MillOriginalMolecule control={control} Controller={Controller} />
          <DONumberMolecule control={control} Controller={Controller} />
          <CertificateIncomingMolecule control={control} Controller={Controller} />
        </div>

        {/* ==== Vehicle ==== */}
        <div className="space-y-6">
          <VehicleNumberMolecule control={control} Controller={Controller} />
          <VehicleTypeIncomingMolecule control={control} Controller={Controller} />
          <DriverNameMolecule control={control} Controller={Controller} />
          <DriverIdMolecule control={control} Controller={Controller} />
          <ContainerNumberMolecule control={control} Controller={Controller} />
          <TransporterMolecule control={control} Controller={Controller} />
          <SealNumberMolecules control={control} Controller={Controller} />
        </div>

        {/* ==== SPB - BC ==== */}
        <div className="space-y-6">
          <SPBDateMolecule control={control} Controller={Controller} />
          <SPBNumberMolecule control={control} Controller={Controller} />
          <BCNumberMolecule control={control} Controller={Controller} />
          <BCTypeMolecule control={control} Controller={Controller} />
          <BCStatusMolecule control={control} Controller={Controller} />
          <FFAMolecule control={control} Controller={Controller} />
          <MoistMolecule control={control} Controller={Controller} />
        </div>

        {/* ==== Other ==== */}
        <div className="space-y-6">
          <ImpuritiesMolecule control={control} Controller={Controller} />
          <RFIDMolecule control={control} Controller={Controller} />
          <CCTVStreamMolecule control={control} Controller={Controller} />
        </div>
      </div>
    </section>
  );
}
