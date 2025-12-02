import { Controller } from 'react-hook-form';
import {
  SummaryActionButton,
  SummaryInfoTransactionMolecule,
  SummaryStatusMolecule,
} from '../molecules/SummaryInbound.molecules';

export function SummaryInboundOrganism({ control }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="font-semibold text-lg">Summary</h2>

      <div className="flex justify-between items-start">
        <div className="space-y-1 text-sm">
          <SummaryInfoTransactionMolecule />
          <SummaryStatusMolecule control={control} Controller={Controller} />
        </div>

        <div className="flex gap-3">
          <SummaryActionButton control={control} Controller={Controller} />
        </div>
      </div>
    </div>
  );
}
