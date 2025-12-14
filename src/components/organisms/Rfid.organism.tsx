import { Controller } from 'react-hook-form';
import { DriverNameMolecule, DriverIdMolecule } from '@/components/molecules/Driver.molecules';
import { RFIDMolecule } from '../molecules/Rfid.molecules';
import { TransporterMolecule } from '../molecules/Transporter.molecules';
import { CCTVStreamMolecule } from '../molecules/Cctv.molecules';
import { VehicleNumberMolecule } from '../molecules/Vehicle.molecules';

export function RFIDOrganism({ control }) {
  return (
    <section className="border p-4 rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-4">RFID & Vehicle Identification</h2>

      {/* ==== 2 MAIN COLUMNS WRAPPER ==== */}
      <div className="grid grid-cols-3 gap-4">
        {/* LEFT COLUMN: full form fields (span 2 cols) */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <RFIDMolecule control={control} Controller={Controller} />
          <TransporterMolecule control={control} Controller={Controller} />

          <VehicleNumberMolecule control={control} Controller={Controller} />

          <DriverNameMolecule control={control} Controller={Controller} />
          <DriverIdMolecule control={control} Controller={Controller} />
        </div>

        {/* RIGHT COLUMN: CCTV Preview */}
        <div className="col-span-1">
          <div
            className="rounded-xl border bg-gray-100 p-2
                w-full h-[160px] flex items-center justify-center"
          >
            <CCTVStreamMolecule control={control} Controller={Controller} />
          </div>
        </div>
      </div>
    </section>
  );
}
