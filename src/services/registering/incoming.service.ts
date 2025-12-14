import { incomingRepository } from '@/repositories/incoming.repository';
import { inboundRepository } from '@/repositories/inbound.repository';
import { createInbound } from '../inbound/createInbound.service';
import { RegisterDocType } from '@/types/inbound.type';

export async function listIncoming() {
  const repo = await inboundRepository();

  const list = await repo
    .createQueryBuilder('inbound')
    .select([
      'inbound.id AS id',
      'inbound.transactionType AS transaction_type',
      'inbound.transactionId AS transaction_id',
      'inbound.status AS status',
      'inbound.createdAt AS created_at',
      'incoming.contractNumber AS contract_number',
      'incoming.supplier AS supplier',
      'incoming.material AS material',
      'incoming.certificate AS certificate',
      'incoming.vehicleNumber AS vehicle_number',
      'incoming.vehicleType AS vehicle_type',
      'incoming.driverName AS driver_name',
      'incoming.transporter AS transporter',
      'incoming.spbNumber AS spb_number',
      'incoming.spbDate AS spb_date',
    ])
    .innerJoin('incoming_detail', 'incoming', 'inbound.transactionId = incoming.id')
    .where('inbound.transactionType = :type', { type: RegisterDocType.RAW_MATERIAL })
    .cache('list_incoming', 30000)
    .getRawMany();

  return list;
}

export async function createIncoming(data) {
  const repo = await incomingRepository();

  const detail = repo.create(data);
  const savedDetail: any = await repo.save(detail);

  const inbound: any = await createInbound({
    transactionType: RegisterDocType.RAW_MATERIAL,
    transactionId: savedDetail.id,
    statusInbound: data.status || null,
  });

  return {
    inbound,
    detail: savedDetail,
  };
}
