import { inboundTransactionRepository } from '@/repositories/inboundTransaction.repository';
// import { Vehicle } from '@/entities/Vehicle.entity';
// import { Supplier } from '@/entities/Supplier.entity';
// import { Material } from '@/entities/Material.entity';
// import { Driver } from '@/entities/Driver.entity';

const inboundRepo = await inboundTransactionRepository();

export const createInbound = async (dto: any) => {
  const inbound = inboundRepo.create({
    vehicle: { id: dto.vehicleId },
    driver: { id: dto.driverId },
    supplier: { id: dto.supplierId },
    material: { id: dto.materialId },

    documentType: dto.documentType,
    doNumber: dto.doNumber,
    poNumber: dto.poNumber,
    sjNumber: dto.sjNumber,

    sealNumber: dto.sealNumber,
    sealCondition: dto.sealCondition,

    doorLocked: dto.doorLocked,
    noLeakage: dto.noLeakage,
    loadVisible: dto.loadVisible,

    status: 'waiting-weighin',
  });

  return await inboundRepo.save(inbound);
};

export const getInboundList = async () => {
  return inboundRepo.find({
    order: { id: 'DESC' },
  });
};

export const getInboundDetail = async (id: number) => {
  return inboundRepo.findOne({
    where: { id },
    relations: ['weighInRecords', 'weighOutRecords'],
  });
};
