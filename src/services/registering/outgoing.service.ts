import { inboundRepository } from '@/repositories/inbound.repository';
import { outgoingRepository } from '../../repositories/outgoing.repository';
import { createInbound } from '../inbound/createInbound.service';
import { RegisterDocType } from '@/types/inbound.type';

export async function listOutgoing() {
  const repo = await inboundRepository();

  const list = await repo.manager.query(
    `
    SELECT
      inbound_ticket.id,
      inbound_ticket.transaction_type,
      inbound_ticket.transaction_id,
      inbound_ticket.status,
      outgoing_detail.contract_number,
      outgoing_detail.material,
      outgoing_detail.certificate,
      outgoing_detail.vehicle_number,
      outgoing_detail.vehicle_type,
      outgoing_detail.transporter,
      outgoing_detail.vessel_name,
      inbound_ticket.created_at
    FROM
      inbound_ticket
    INNER JOIN
      outgoing_detail
    ON
      inbound_ticket.transaction_id = outgoing_detail.id
    WHERE
      inbound_ticket.transaction_type = $1
  `,
    [RegisterDocType.DISPATCH],
    { cache: { id: 'list_outgoing', milliseconds: 30000 } }
  );
  return list;
}

export async function createOutgoing(data) {
  const repo = await outgoingRepository();

  const detail = repo.create({
    rfid: data.rfid,
    vehicleNumber: data.vehicleNumber,
    vehicleType: data.vehicleType,
    driverName: data.driverName,
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
  });

  return { inbound, detail: savedDetail };
}
