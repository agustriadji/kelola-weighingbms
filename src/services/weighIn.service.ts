import { weighInRepository } from '@/repositories/weighIn.repository';
import { inboundTransactionRepository } from '@/repositories/inboundTransaction.repository';

const weighInRepo = await weighInRepository();
const inboundRepo = await inboundTransactionRepository();

export const startWeighIn = async (inboundId: number) => {
  const inbound = await inboundRepo.findOne({ where: { id: inboundId } });
  if (!inbound) throw new Error('Inbound not found');

  // create weigh-in record
  const wi = weighInRepo.create({
    inbound,
  });

  return await weighInRepo.save(wi);
};

export const saveBruttoWeight = async (inboundId: number, brutto: number, cctvUrl?: string) => {
  const inbound = await inboundRepo.findOne({
    where: { id: inboundId },
    relations: ['weighInRecords'],
  });

  if (!inbound) throw new Error('Inbound not found');

  const record = inbound.weighInRecords[0]; // each inbound only 1 weigh-in
  if (!record) throw new Error('Weigh-In record not initialized');

  record.brutto = brutto;
  record.cctvBruttoUrl = cctvUrl ?? null;
  record.approved = true;

  await weighInRepo.save(record);

  // update inbound status → ready for weigh-out
  await inboundRepo.update(inboundId, {
    status: 'waiting-weighout',
  });

  return record;
};

export const getBruttoResult = async (inboundId: number) => {
  return await weighInRepo.findOne({
    where: { inbound: { id: inboundId } },
  });
};
