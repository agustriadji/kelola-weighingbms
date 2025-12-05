import { inboundRepository } from '@/repositories/inbound.repository';
import { incomingRepository } from '@/repositories/incoming.repository';
import { outgoingRepository } from '@/repositories/outgoing.repository';
import { MiscRepository } from '@/repositories/misc.repository';

import { InboundStatus } from './inboundStateMechine.service';
import { startWeighIn, saveBruttoWeight } from '../weighing/weighIn.service';
import { startWeighOut, saveTarraWeight } from '../weighing/weighOut.service';
import { getRequestContext } from '@/utils/context';

// W-IN
export const startWeighingIn = async (id: number, requestId?: string) => {
  const repo = await inboundRepository();
  const context = getRequestContext(requestId);
  const weighingInBy = context.user?.username || 'system';

  const weighIn = await startWeighIn(id);
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

  const data = await saveBruttoWeight(batchId, weight, cctvUrl);
  console.log(data, 'DATA===============');
  return repo.update(batchId, {
    status: InboundStatus.YARD,
    updatedAt: new Date(),
  });
};
// END W-IN

// W-OUT
export const startWeighingOut = async (id: number, weighingInBy: string) => {
  const repo = await inboundRepository();

  const weighOut = await startWeighOut(id);
  return repo.update(id, {
    weighInId: weighOut.id,
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
    status: InboundStatus.FINISHED,
    updatedAt: new Date(),
  });
};
// END W-OUT

export const endBatch = async (
  id: number,
  data?: { expectedNetto?: number; actualNetto?: number }
) => {
  const repo = await inboundRepository();

  const batch = await repo.findOne({
    where: { id },
    relations: ['vehicle', 'supplier', 'material'],
  });

  if (!batch) throw new Error('Batch not found');

  const expectedNet = data?.expectedNetto || batch?.expectedNetto;
  const actualNet = data?.actualNetto || batch?.actualNetto;

  let shrinkage = null;
  let updateData: any = {
    status: 'finished',
    endedAt: new Date(),
  };

  if (expectedNet && actualNet) {
    shrinkage = calculateShrinkage(expectedNet, actualNet);
    updateData = {
      ...updateData,
      expectedNetto: expectedNet,
      actualNetto: actualNet,
      shrinkageValue: shrinkage?.shrinkageValue ?? null,
      shrinkagePercent: shrinkage?.shrinkagePercent ?? null,
      warningFlag: shrinkage?.warning ?? false,
    };
  }

  await repo.update(id, updateData);

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
  return repo.update(id, weights);
};

export const getBatchDetail = async (id: number) => {
  let dataDocument = null;
  let dataInbound = null;
  try {
    const repo = await inboundRepository();
    dataInbound = await repo.findOne({
      where: { id },
    });

    console.log(dataInbound, 'DATA');

    if (dataInbound?.transactionType === 'INCOMING') {
      const repoIncoming = await incomingRepository();
      dataDocument = await repoIncoming.findOne({
        where: { id: dataInbound?.transactionId },
      });
    } else if (dataInbound?.transactionType === 'OUTGOING') {
      const repoOutgoing = await outgoingRepository();
      dataDocument = await repoOutgoing.findOne({
        where: { id: dataInbound?.transactionId },
      });
    } else if (dataInbound?.transactionType === 'MISC') {
      const repoMisc = await MiscRepository();
      dataDocument = await repoMisc.findOne({
        where: { id: dataInbound?.transactionId },
      });
    }
  } catch (error) {
    console.error('Error fetching batch detail:', error);
    throw new Error('Error fetching batch detail');
  }
  console.log(
    {
      inbound: dataInbound || null,
      document: dataDocument,
    },
    'MASA GA'
  );
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
