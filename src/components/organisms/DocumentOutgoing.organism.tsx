import { Controller } from 'react-hook-form';
import {
  DONumberMolecule,
  SINumberMolecule,
  ContractNumberMolecule,
  RelationNameMolecule,
  CertificateOutgoingMolecule,
  ContainerNumberMolecule,
  VesselNameMolecule,
} from '../molecules/Document.molecules';
import { SealNumberMolecules } from '@/components/molecules/CheckCondition.molecules';
import { DriverNameMolecule, DriverIdMolecule } from '@/components/molecules/Driver.molecules';
import {
  VehicleTypeOutgoingMolecule,
  VehicleNumberMolecule,
} from '@/components/molecules/Vehicle.molecules';
import { TransporterMolecule } from '@/components/molecules/Transporter.molecules';
import { MaterialMolecule } from '../molecules/Material.molecules';
import { ButtonDocumentAction } from '../molecules/ButtonDocument.molecules';
// import { CCTVStreamMolecule } from '../molecules/Cctv.molecules';

export function DocumentOutgoingOrganism({ control }) {
  return (
    <section className="p-4 rounded-xl space-y-4 bg-white shadow-sm">
      <h2 className="font-semibold text-sm text-slate-500">Document Verification</h2>

      {/* ==== BAGIAN 1 — DOCUMENT NUMBERS & TYPES ==== */}
      <div className="grid grid-cols-3 gap-6 pt-3 border-t">
        <div className="space-y-3">
          <ContractNumberMolecule control={control} Controller={Controller} />
          <RelationNameMolecule control={control} Controller={Controller} />
          <MaterialMolecule control={control} Controller={Controller} />
          <DONumberMolecule control={control} Controller={Controller} />
          <SINumberMolecule control={control} Controller={Controller} />
          <CertificateOutgoingMolecule control={control} Controller={Controller} />
        </div>
        <div className="space-y-3">
          <VehicleTypeOutgoingMolecule control={control} Controller={Controller} />
          <VehicleNumberMolecule control={control} Controller={Controller} />
          <TransporterMolecule control={control} Controller={Controller} />
          <DriverNameMolecule control={control} Controller={Controller} />
          <DriverIdMolecule control={control} Controller={Controller} />
          <ContainerNumberMolecule control={control} Controller={Controller} />
        </div>
        <div className="space-y-3">
          <VesselNameMolecule control={control} Controller={Controller} />
          <SealNumberMolecules control={control} Controller={Controller} />
        </div>
      </div>
    </section>
  );
}
