import { inboundRepository } from '@/repositories/inbound.repository';
import { outgoingRepository } from '../../repositories/outgoing.repository';
import { createInbound } from '../inbound/createInbound.service';
import { RegisterDocType } from '@/types/inbound.type';

export async function listOutgoing() {
  const repo = await inboundRepository();

  const list = await repo
    .createQueryBuilder('inbound')
    .select([
      'inbound.id as id',
      'inbound.transactionType as transaction_type',
      'inbound.transactionId as transaction_id',
      'inbound.status as status',
      'inbound.createdAt as created_at',
      'outgoing.contractNumber as contract_number',
      'outgoing.material as material',
      'outgoing.certificate as certificate',
      'outgoing.vehicleNumber as vehicle_number',
      'outgoing.vehicleType as vehicle_type',
      'outgoing.transporter as transporter',
      'outgoing.vesselName as vessel_name',
    ])
    .innerJoin('outgoing_detail', 'outgoing', 'inbound.transactionId = outgoing.id')
    .where('inbound.transactionType = :type', { type: RegisterDocType.DISPATCH })
    .cache('list_outgoing', 30000)
    .getRawMany();
  return list;
}

export async function createOutgoing(data: {
  rfid?: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverId?: string;
  transporter: string;
  contractNumber: string;
  relationName: string;
  material: string;
  doNumber: string;
  siNumber: string;
  containerNumber?: string;
  vesselName?: string;
  certificate: string;
  sealNumber?: string;
  status: string;
}) {
  const repo = await outgoingRepository();

  const detail = repo.create({
    rfid: data.rfid,
    vehicleNumber: data.vehicleNumber,
    vehicleType: data.vehicleType,
    driverName: data.driverName,
    driverId: data.driverId,
    transporter: data.transporter,
    contractNumber: data.contractNumber,
    relationName: data.relationName,
    material: data.material,
    doNumber: data.doNumber,
    siNumber: data.siNumber,
    containerNumber: data.containerNumber,
    vesselName: data.vesselName,
    certificate: data.certificate,
    sealNumber: data.sealNumber,
  });

  const savedDetail = await repo.save(detail);

  const inbound = await createInbound({
    transactionType: RegisterDocType.DISPATCH,
    transactionId: savedDetail.id,
    statusInbound: data.status || null,
  });

  return { inbound, detail: savedDetail };
}
