import { batchRepository } from "@/repositories/batch.repositories";
import { recordRepository } from "@/repositories/record.repositories";

export const getVehicleHistory = async (vehicleId: number, limit = 5) => {
  const batchRepo = await batchRepository();
  
  const batches = await batchRepo.find({
    where: { 
      vehicle: { id: vehicleId },
      status: 'finished'
    },
    relations: ['vehicle'],
    order: { endedAt: 'DESC' },
    take: limit
  });
  
  const history = [];
  for (const batch of batches) {
    const recordRepo = await recordRepository();
    const records = await recordRepo.find({
      where: { batch: { id: batch.id }, stable: true },
      order: { timestamp: 'DESC' },
      take: 2 // Get bruto and tarra
    });
    
    const bruto = records[0]?.weight || 0;
    const tarra = records[1]?.weight || 0;
    const netto = bruto - tarra;
    
    history.push({
      plate: batch.vehicle.plate,
      bruto,
      tarra,
      netto,
      batchId: batch.id
    });
  }
  
  return history;
};

export const getTarraHistory = async (vehicleId: number) => {
  const batchRepo = await batchRepository();
  
  const batches = await batchRepo.find({
    where: { 
      vehicle: { id: vehicleId },
      status: 'finished'
    },
    relations: ['vehicle'],
    order: { endedAt: 'DESC' },
    take: 10
  });
  
  const tarraWeights = [];
  for (const batch of batches) {
    const recordRepo = await recordRepository();
    const tarraRecord = await recordRepo.findOne({
      where: { batch: { id: batch.id }, stable: true },
      order: { timestamp: 'ASC' } // First stable reading is usually tarra
    });
    
    if (tarraRecord) {
      tarraWeights.push(tarraRecord.weight);
    }
  }
  
  if (tarraWeights.length === 0) return null;
  
  const minTarra = Math.min(...tarraWeights);
  const maxTarra = Math.max(...tarraWeights);
  const avgTarra = Math.round(tarraWeights.reduce((a, b) => a + b, 0) / tarraWeights.length);
  
  return {
    plate: batches[0]?.vehicle?.plate,
    initial: tarraWeights[0],
    min: minTarra,
    max: maxTarra,
    average: avgTarra
  };
};