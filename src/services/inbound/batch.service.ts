import { inboundRepository } from '@/repositories/inbound.repository';
import { incomingRepository } from '@/repositories/incoming.repository';
import { outgoingRepository } from '@/repositories/outgoing.repository';
import { MiscRepository } from '@/repositories/misc.repository';
import { weighOutRepository } from '@/repositories/weighOut.repository';

import { InboundStatus } from './inboundStateMechine.service';
import { startWeighIn, saveBruttoWeight } from '../weighing/weighIn.service';
import { startWeighOut, saveTarraWeight } from '../weighing/weighOut.service';
import { getRequestContext } from '@/utils/context';
import { RegisterDocType } from '@/types/inbound.type';

// W-IN
export const startWeighingIn = async (id: number, requestId?: string, miscCategory?: string) => {
  const repo = await inboundRepository();
  const context = getRequestContext(requestId);
  const weighingInBy = context.user?.username || 'system';

  const weighIn: any = await startWeighIn(id, requestId, miscCategory);
  return repo.update(id, {
    weighInId: weighIn.id,
    status: InboundStatus.WEIGHING_IN,
    updatedAt: new Date(),
  });
};

export const saveBruttoWeighing = async (
  batchId,
  weight,
  stable,
  source,
  cctvUrl,
  transactionType,
  transactionId,
  status
) => {
  const repo = await inboundRepository();

  await saveBruttoWeight(batchId, weight, cctvUrl);

  return repo.update(batchId, {
    status: InboundStatus.YARD,
    updatedAt: new Date(),
  });
};
// END W-IN

// W-OUT
export const startWeighingOut = async (id: number, weighingInBy: string, miscCategory?: string) => {
  const repo = await inboundRepository();

  const weighOut: any = await startWeighOut(id, miscCategory);
  return repo.update(id, {
    weighOutId: weighOut.id,
    status: InboundStatus.WEIGHING_OUT,
    updatedAt: new Date(),
  });
};

export const saveTarraWeighing = async (
  batchId,
  weight,
  stable,
  source,
  cctvUrl,
  transactionType,
  transactionId,
  status
) => {
  const repo = await inboundRepository();

  await saveTarraWeight(batchId, weight, cctvUrl);
  return repo.update(batchId, {
    status: InboundStatus.WEIGHED_OUT,
    updatedAt: new Date(),
  });
};
// END W-OUT

export const endBatch = async (
  id: number,
  data?: { expectedNetto?: number; actualNetto?: number }
) => {
  const repo = await inboundRepository();
  const weighOutRepo = await weighOutRepository();

  const batch: any = await repo.findOne({
    where: { id },
    relations: ['weighOut'],
  });

  if (!batch) throw new Error('Batch not found');
  if (!batch.weighOut) throw new Error('WeighOut record not found');

  const expectedNet = data?.expectedNetto;
  const actualNet = data?.actualNetto || batch.weighOut.netto;

  let shrinkage = null;

  // Update InboundTicket status
  await repo.update(id, {
    status: InboundStatus.FINISHED,
    updatedAt: new Date(),
  });

  // Update WeighOut with shrinkage data if provided
  if (expectedNet && actualNet) {
    shrinkage = calculateShrinkage(expectedNet, actualNet);

    await weighOutRepo.update(batch.weighOut.id, {
      expectedNetto: expectedNet,
      netto: actualNet,
      shrinkageValue: shrinkage?.shrinkageValue ?? null,
      shrinkagePercent: shrinkage?.shrinkagePercent ?? null,
      warningFlag: shrinkage?.warning ?? false,
      status: 'closed',
      closedAt: new Date(),
    });
  }

  return {
    ok: true,
    shrinkage,
  };
};

export const listBatch = async () => {
  const repo = await inboundRepository();

  return repo.find({
    order: { id: 'DESC' },
    relations: ['vehicle', 'supplier', 'material', 'createdBy'],
  });
};

export const updateBatchWeights = async (
  id: number,
  weights: { expectedNetto?: number; actualNetto?: number }
) => {
  const repo = await inboundRepository();
  const weighOutRepo = await weighOutRepository();

  const batch: any = await repo.findOne({
    where: { id },
    relations: ['weighOut'],
  });

  if (!batch?.weighOut) {
    throw new Error('WeighOut record not found for this batch');
  }

  return weighOutRepo.update(batch.weighOut.id, {
    expectedNetto: weights.expectedNetto,
    netto: weights.actualNetto,
  });
};

export const getBatchDetail = async (id: number) => {
  let dataDocument = null;
  let dataInbound = null;
  try {
    const repo = await inboundRepository();
    dataInbound = await repo.findOne({
      where: { id },
      relations: ['weighIn', 'weighOut'],
    });

    if (dataInbound?.transactionType === RegisterDocType.RAW_MATERIAL) {
      const repoIncoming = await incomingRepository();
      dataDocument = await repoIncoming.findOne({
        where: { id: dataInbound?.transactionId },
      });
    } else if (dataInbound?.transactionType === RegisterDocType.DISPATCH) {
      const repoOutgoing = await outgoingRepository();
      dataDocument = await repoOutgoing.findOne({
        where: { id: dataInbound?.transactionId },
      });
    } else if (dataInbound?.transactionType === RegisterDocType.MISCELLANEOUS) {
      const repoMisc = await MiscRepository();
      dataDocument = await repoMisc.findOne({
        where: { id: dataInbound?.transactionId },
      });
    }
  } catch (error) {
    console.error('Error fetching batch detail:', error);
    throw new Error('Error fetching batch detail');
  }

  return {
    inbound: dataInbound || null,
    document: dataDocument,
  };
};

export const calculateShrinkage = (expectedNet: number, actualNet: number) => {
  if (!expectedNet || !actualNet) return null;

  const diff = expectedNet - actualNet;
  const percent = (diff / expectedNet) * 100;

  return {
    shrinkageValue: diff,
    shrinkagePercent: percent,
    warning: percent > 0.2, // 0.2% threshold
  };
};

export const getVehicleHistoryByContract = async (contractNumber: string) => {
  const repo = await inboundRepository();
  
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const query = repo.createQueryBuilder('it')
    .select([
      'detail.driver_number as driver_number',
      'wi.weight as brutto', 
      'wo.weight as tarra',
      'wo.netto as netto'
    ])
    .innerJoin('weigh_in', 'wi', 'it.weigh_in_id = wi.id')
    .innerJoin('weigh_out', 'wo', 'it.weigh_out_id = wo.id')
    .where('it.status = :status', { status: InboundStatus.FINISHED })
    .andWhere('it.created_at >= :threeMonthsAgo', { threeMonthsAgo })
    .andWhere('wi.weight_type = :bruttoType', { bruttoType: 'BRUTTO' })
    .andWhere('wo.weight_type = :tarraType', { tarraType: 'TARRA' })
    .orderBy('(wi.weight + wo.weight + wo.netto)', 'DESC')
    .limit(20)
    .cache(300000); // 5 minutes cache

  // Dynamic join based on transaction type
  query.leftJoin(
    '(SELECT id, driver_number, contract_number, "RAW_MATERIAL" as type FROM incoming_detail ' +
    'UNION ALL SELECT id, driver_number, contract_number, "DISPATCH" as type FROM outgoing_detail ' +
    'UNION ALL SELECT id, driver_number, contract_number, "MISCELLANEOUS" as type FROM misc_detail)',
    'detail',
    'it.transaction_id = detail.id AND it.transaction_type = detail.type'
  );
  
  query.andWhere('detail.contract_number = :contractNumber', { contractNumber });

  return query.getRawMany();
};

export const getVehicleTarraHistoryByContract = async (contractNumber: string) => {
  const repo = await inboundRepository();
  
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const query = repo.createQueryBuilder('it')
    .select([
      'detail.driver_number as driver_number',
      'MIN(wo.weight) as tarra_terendah',
      'MAX(wo.weight) as tarra_tertinggi',
      'FIRST_VALUE(wo.weight) OVER (ORDER BY it.created_at ASC) as tarra_awal'
    ])
    .innerJoin('weigh_out', 'wo', 'it.weigh_out_id = wo.id')
    .where('it.status = :status', { status: InboundStatus.FINISHED })
    .andWhere('it.created_at >= :threeMonthsAgo', { threeMonthsAgo })
    .andWhere('wo.weight_type = :tarraType', { tarraType: 'TARRA' })
    .groupBy('detail.driver_number')
    .cache(300000); // 5 minutes cache

  // Dynamic join based on transaction type
  query.leftJoin(
    '(SELECT id, driver_number, contract_number, "RAW_MATERIAL" as type FROM incoming_detail ' +
    'UNION ALL SELECT id, driver_number, contract_number, "DISPATCH" as type FROM outgoing_detail ' +
    'UNION ALL SELECT id, driver_number, contract_number, "MISCELLANEOUS" as type FROM misc_detail)',
    'detail',
    'it.transaction_id = detail.id AND it.transaction_type = detail.type'
  );
  
  query.andWhere('detail.contract_number = :contractNumber', { contractNumber });

  const result = await query.getRawOne();
  return result || null;
};
