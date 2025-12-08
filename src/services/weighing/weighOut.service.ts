import { weighOutRepository } from '@/repositories/weighOut.repository';
import { inboundRepository } from '@/repositories/inbound.repository';

import { calculateShrinkage } from '../shared/shrinkage.util';
import { RegisterDocType } from '@/types/inbound.type';

const inboundRepo = await inboundRepository();
const weighOutRepo = await weighOutRepository();

export const startWeighOut = async (inboundId: number) => {
  const inbound = await inboundRepo.findOne({ where: { id: inboundId } });
  if (!inbound) throw new Error('Inbound not found');

  const wo = weighOutRepo.create({
    inbound,
    weightType: inbound.transactionType !== RegisterDocType.DISPATCH ? 'TARRA' : 'BRUTTO',
  });
  return await weighOutRepo.save(wo);
};

export const saveTarraWeight = async (inboundId: number, tarra: number, cctvUrl?: string) => {
  const inbound = await inboundRepo.findOne({
    where: { id: inboundId },
    relations: ['weighOut', 'weighIn'],
  });

  if (!inbound) throw new Error('Inbound not found');

  const we = inbound.weighOut[0];
  if (!we) throw new Error('Weigh-Out record not initialized');

  const brutto = inbound.weighIn[0]?.brutto;
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
  we.timestamp = new Date();

  await weighOutRepo.save(we);

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
