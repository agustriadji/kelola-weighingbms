import { Controller } from 'react-hook-form';
import {
  DONumberMolecule,
  PONumberMolecule,
  ContractNumberMolecule,
  RelationNameMolecule,
  BCTypeMolecule,
  BCNumberMolecule,
  ContainerNumberMolecule,
} from '../molecules/Document.molecules';
import { DriverNameMolecule, DriverIdMolecule } from '@/components/molecules/Driver.molecules';
import {
  VehicleTypeOutgoingMolecule,
  VehicleNumberMolecule,
} from '@/components/molecules/Vehicle.molecules';
import { TransporterMolecule } from '@/components/molecules/Transporter.molecules';
import { MaterialMolecule } from '../molecules/Material.molecules';
import { ButtonDocumentAction } from '../molecules/ButtonDocument.molecules';
// import { CCTVStreamMolecule } from '../molecules/Cctv.molecules';

export function DocumentMiscOrganism({ control }) {
  return (
    <section className="p-4 rounded-xl space-y-4 bg-white shadow-sm">
      <h2 className="font-semibold text-sm text-slate-500">Document Verification</h2>

      {/* ==== BAGIAN 1 — DOCUMENT NUMBERS & TYPES ==== */}
      <div className="grid grid-cols-3 gap-6 pt-3 border-t">
        <div className="space-y-3">
          <PONumberMolecule control={control} Controller={Controller} />
          <ContractNumberMolecule control={control} Controller={Controller} />
          <RelationNameMolecule control={control} Controller={Controller} />
          <MaterialMolecule control={control} Controller={Controller} />
          <DONumberMolecule control={control} Controller={Controller} />
        </div>
        <div className="space-y-3">
          <VehicleNumberMolecule control={control} Controller={Controller} />
          <VehicleTypeOutgoingMolecule control={control} Controller={Controller} />
          <DriverNameMolecule control={control} Controller={Controller} />
          <DriverIdMolecule control={control} Controller={Controller} />
          <TransporterMolecule control={control} Controller={Controller} />
          <ContainerNumberMolecule control={control} Controller={Controller} />
        </div>
        <div className="space-y-3">
          <BCTypeMolecule control={control} Controller={Controller} />
          <BCNumberMolecule control={control} Controller={Controller} />
        </div>
      </div>
    </section>
  );
}
