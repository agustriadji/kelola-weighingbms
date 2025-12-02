import { weighOutRepository } from '@/repositories/weighOut.repository';
import { inboundTransactionRepository } from '@/repositories/inboundTransaction.repository';

import { calculateShrinkage } from './shared/shrinkage.util';

const inboundRepo = await inboundTransactionRepository();
const weighOutRepo = await weighOutRepository();

export const startWeighOut = async (inboundId: number) => {
  const inbound = await inboundRepo.findOne({ where: { id: inboundId } });
  if (!inbound) throw new Error('Inbound not found');

  const wo = weighOutRepo.create({ inbound });
  return await weighOutRepo.save(wo);
};

export const saveTarraWeight = async (inboundId: number, tarra: number, cctvUrl?: string) => {
  const inbound = await inboundRepo.findOne({
    where: { id: inboundId },
    relations: ['weighOutRecords', 'weighInRecords'],
  });

  if (!inbound) throw new Error('Inbound not found');

  const we = inbound.weighOutRecords[0];
  if (!we) throw new Error('Weigh-Out record not initialized');

  const brutto = inbound.weighInRecords[0]?.brutto;
  const netto = brutto - tarra;

  // shrinkage calculation
  const expected = we.expectedNetto ?? brutto; // fallback if needed
  const shrinkage = calculateShrinkage(expected, netto);

  // update weigh-out
  we.tarra = tarra;
  we.cctvUrl = cctvUrl ?? null;
  we.netto = netto;
  we.expectedNetto = expected;
  we.shrinkageValue = shrinkage.shrinkageValue;
  we.shrinkagePercent = shrinkage.shrinkagePercent;
  we.warningFlag = shrinkage.warning;

  await weighOutRepo.save(we);

  // close inbound
  await inboundRepo.update(inboundId, {
    status: 'closed',
  });

  return {
    brutto,
    tarra,
    netto,
    shrinkage,
  };
};

export const getFinalResult = async (inboundId: number) => {
  return await weighOutRepo.findOne({
    where: { inbound: { id: inboundId } },
  });
};
