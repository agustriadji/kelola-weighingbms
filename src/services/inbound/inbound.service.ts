import { getDb } from '@/database/client';
import { InboundTicket } from '@/entities/inboundTicket.entity';
import { IncomingDetail } from '@/entities/IncomingDetail.entity';
import { OutgoingDetail } from '@/entities/OutgoingDetail.entity';
import { MiscDetail } from '@/entities/MiscDetail.entity';

export const createInbound = async (dto: any) => {
  const db = await getDb();
  
  // Create detail record based on transaction type
  let detailId: number;
  
  if (dto.transactionType === 'RAW_MATERIAL') {
    const incomingRepo = db.getRepository(IncomingDetail);
    const incoming = incomingRepo.create({
      vehicleNumber: dto.vehicleNumber,
      driverName: dto.driverName,
      driverId: dto.driverId,
      transporter: dto.transporter,
      vehicleType: dto.vehicleType,
      poNumber: dto.poNumber,
      contractNumber: dto.contractNumber,
      supplier: dto.supplier,
      material: dto.material,
      doNumber: dto.doNumber,
      sealNumber: dto.sealNumber,
      containerNumber: dto.containerNumber,
      createdBy: dto.userId?.toString(),
    });
    const saved = await incomingRepo.save(incoming);
    detailId = saved.id;
  } else if (dto.transactionType === 'DISPATCH') {
    const outgoingRepo = db.getRepository(OutgoingDetail);
    const outgoing = outgoingRepo.create({
      vehicleNumber: dto.vehicleNumber,
      driverName: dto.driverName,
      transporter: dto.transporter,
      vehicleType: dto.vehicleType,
      contractNumber: dto.contractNumber,
      relationName: dto.relationName,
      material: dto.material,
      doNumber: dto.doNumber,
      sealNumber: dto.sealNumber,
      containerNumber: dto.containerNumber,
      createdBy: dto.userId?.toString(),
    });
    const saved = await outgoingRepo.save(outgoing);
    detailId = saved.id;
  } else {
    const miscRepo = db.getRepository(MiscDetail);
    const misc = miscRepo.create({
      vehicleNumber: dto.vehicleNumber,
      driverName: dto.driverName,
      driverId: dto.driverId,
      transporter: dto.transporter,
      vehicleType: dto.vehicleType,
      material: dto.material,
      doNumber: dto.doNumber,
      sealNumber: dto.sealNumber,
      containerNumber: dto.containerNumber,
      relationName: dto.relationName,
      createdBy: dto.userId?.toString(),
    });
    const saved = await miscRepo.save(misc);
    detailId = saved.id;
  }

  // Create inbound ticket
  const ticketRepo = db.getRepository(InboundTicket);
  const ticket = ticketRepo.create({
    transactionType: dto.transactionType,
    transactionId: detailId,
    status: 'registered',
    remark: dto.remark,
  });

  return await ticketRepo.save(ticket);
};

export const getInboundList = async () => {
  const db = await getDb();
  const ticketRepo = db.getRepository(InboundTicket);
  return ticketRepo.find({
    order: { id: 'DESC' },
  });
};

export const getInboundDetail = async (id: number) => {
  const db = await getDb();
  const ticketRepo = db.getRepository(InboundTicket);
  return ticketRepo.findOne({
    where: { id },
    relations: ['weighIn', 'weighOut'],
  });
};
