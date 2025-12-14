import { MiscRepository } from '@/repositories/misc.repository';
import { createInbound } from '../inbound/createInbound.service';
import { inboundRepository } from '@/repositories/inbound.repository';
import { RegisterDocType } from '@/types/inbound.type';

export async function listMisc() {
  const repo = await inboundRepository();

  const list = await repo
    .createQueryBuilder('inbound')
    .select([
      'inbound.id as id',
      'inbound.transactionType as transaction_type',
      'inbound.transactionId as transaction_id',
      'inbound.status as status',
      'inbound.createdAt as created_at',
      'misc.contractNumber as contract_number',
      'misc.material as material',
      'misc.vehicleNumber as vehicle_number',
      'misc.vehicleType as vehicle_type',
      'misc.transporter as transporter',
    ])
    .innerJoin('misc_detail', 'misc', 'inbound.transactionId = misc.id')
    .where('inbound.transactionType = :type', { type: RegisterDocType.MISCELLANEOUS })
    .cache('list_misc', 30000)
    .getRawMany();

  return list;
}

export async function createMisc(data: {
  rfid?: string;
  vehicleNumber: string;
  driverName: string;
  driverId?: string;
  vehicleType: string;
  transporter: string;
  containerNumber?: string;
  contractNumber: string;
  relationName: string;
  material: string;
  bcType: string;
  bcNumber: string;
  doNumber: string;
  sealNumber: string;
  status: string;
}) {
  const repo = await MiscRepository();

  const detail = repo.create({
    rfid: data.rfid,
    vehicleNumber: data.vehicleNumber,
    driverName: data.driverName,
    driverId: data.driverId,
    vehicleType: data.vehicleType,
    transporter: data.transporter,
    containerNumber: data.containerNumber,
    contractNumber: data.contractNumber,
    relationName: data.relationName,
    material: data.material,
    bcType: data.bcType,
    bcNumber: data.bcNumber,
    doNumber: data.doNumber,
    sealNumber: data.sealNumber,
  });

  const savedDetail = await repo.save(detail);

  const inbound = await createInbound({
    transactionType: RegisterDocType.MISCELLANEOUS,
    transactionId: savedDetail.id,
    statusInbound: data.status || null,
  });

  return { inbound, detail: savedDetail };
}
