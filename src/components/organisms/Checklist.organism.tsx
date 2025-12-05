import { Controller, Control } from 'react-hook-form';
import { InboundType } from '@/schemas/inbound.schema';

import {
  DoorLockedMolecules,
  LoadVisibleMolecules,
  NoLeakageMolecules,
  SealConditionMolecules,
  SealNumberMolecules,
  SealRangeMolecules,
} from '../molecules/CheckCondition.molecules';
import {
  SummaryActionButton,
  SummaryInfoTransactionMolecule,
  SummaryStatusMolecule,
} from '../molecules/SummaryInbound.molecules';

export function ChecklistOrganism({ control }: { control: Control<InboundType> }) {
  return (
    <section className="border p-4 rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Vehicle Checklist</h2>

      {/* ==== MAIN 2 COLUMN LAYOUT ==== */}
      <div className="grid grid-cols-5 gap-6">
        {/* LEFT SIDE — CHECKLIST */}
        <div className="col-span-3 space-y-4">
          {/* Seal Number & Seal Range */}
          <div className="grid grid-cols-2 gap-4">
            <SealNumberMolecules control={control} Controller={Controller} />
            <SealRangeMolecules control={control} Controller={Controller} />
          </div>

          {/* Seal Condition (OK / Broken / Missing) */}
          <div className="font-light text-sm">Seal Condition</div>
          <div>
            <SealConditionMolecules control={control} Controller={Controller} />
          </div>

          {/* Checkbox Row */}
          <div className="flex gap-6">
            <NoLeakageMolecules control={control} Controller={Controller} />
            <DoorLockedMolecules control={control} Controller={Controller} />
            <LoadVisibleMolecules control={control} Controller={Controller} />
          </div>
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        <div className="col-span-5 space-y-5">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-base mb-3 text-gray-800">Summary</h3>

            {/* Info Lines */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium text-gray-800">TRX-20250201-000123</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Entry Time</span>
                <span className="font-medium text-gray-800">2025-02-01 10:32</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <SummaryStatusMolecule control={control} Controller={Controller} />
              </div>
            </div>
          </div>

          {/* Button Area */}
          <div className="flex gap-3">
            <SummaryActionButton control={control} Controller={Controller} />
          </div>
        </div>
      </div>
    </section>
  );
}
