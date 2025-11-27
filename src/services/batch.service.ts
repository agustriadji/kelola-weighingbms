import { batchRepository } from "@/repositories/batch.repositories";

export const createBatch = async (dto: any) => {
  const repo = await batchRepository();

  const batch = repo.create({
    batchName: dto.batchName,
    vehicle: { id: dto.vehicleId },
    supplier: { id: dto.supplierId },
    material: { id: dto.materialId },
    status: "pending",
    createdBy: { id: dto.userId },
  });

  return await repo.save(batch);
};

export const startBatch = async (id: number) => {
  const repo = await batchRepository();

  return repo.update(id, {
    status: "ongoing",
    startedAt: new Date(),
  });
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

export const endBatch = async (id: number, data?: { expectedNetto?: number; actualNetto?: number }) => {
  const repo = await batchRepository();

  const batch = await repo.findOne({
    where: { id },
    relations: ["vehicle", "supplier", "material"]
  });

  if (!batch) throw new Error("Batch not found");

  const expectedNet = data?.expectedNetto || batch.expectedNetto;
  const actualNet = data?.actualNetto || batch.actualNetto;

  let shrinkage = null;
  let updateData: any = {
    status: "finished",
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
      warningFlag: shrinkage?.warning ?? false
    };
  }

  await repo.update(id, updateData);

  return {
    ok: true,
    shrinkage
  };
};

export const listBatch = async () => {
  const repo = await batchRepository();
  
  return repo.find({
    order: { id: "DESC" },
    relations: ["vehicle", "supplier", "material", "createdBy"],
  });
};

export const updateBatchWeights = async (id: number, weights: { expectedNetto?: number; actualNetto?: number }) => {
  const repo = await batchRepository();
  return repo.update(id, weights);
};

export const getBatchDetail = async (id: number) => {
  const repo = await batchRepository();

  return repo.findOne({
    where: { id },
    relations: ["vehicle", "supplier", "material", "createdBy"],
  });
};