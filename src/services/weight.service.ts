import { recordRepository } from "@/repositories/record.repositories";

export const saveWeightRecord = async (data: {
  batchId: number;
  weight: number;
  stable: boolean;
  source: string;
}) => {
  const repo = await recordRepository();
  
  const record = repo.create({
    batch: { id: data.batchId },
    weight: data.weight,
    timestamp: new Date(),
    stable: data.stable,
    source: data.source
  });
  
  return await repo.save(record);
};

export const getLatestWeight = async (batchId: number) => {
  const repo = await recordRepository();
  
  return repo.findOne({
    where: { batch: { id: batchId } },
    order: { timestamp: "DESC" }
  });
};

export const getWeightHistory = async (batchId: number, limit = 10) => {
  const repo = await recordRepository();
  
  return repo.find({
    where: { batch: { id: batchId } },
    order: { timestamp: "DESC" },
    take: limit
  });
};