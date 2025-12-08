import { incomingRepository } from '@/repositories/incoming.repository';
import { inboundRepository } from '@/repositories/inbound.repository';
import { createInbound } from '../inbound/createInbound.service';
import { RegisterDocType } from '@/types/inbound.type';

export async function listIncoming() {
  const repo = await inboundRepository();

  const list = await repo.manager.query(
    `
    SELECT
      inbound_ticket.id,
      inbound_ticket.transaction_type,
      inbound_ticket.transaction_id,
      inbound_ticket.status,
      incoming_detail.contract_number,
      incoming_detail.supplier,
      incoming_detail.material,
      incoming_detail.certificate,
      incoming_detail.vehicle_number,
      incoming_detail.vehicle_type,
      incoming_detail.driver_name,
      incoming_detail.transporter,
      incoming_detail.spb_number,
      incoming_detail.spb_date,
      inbound_ticket.created_at
    FROM
      inbound_ticket
    INNER JOIN
      incoming_detail
    ON
      inbound_ticket.transaction_id = incoming_detail.id
    WHERE
      inbound_ticket.transaction_type = $1
  `,
    [RegisterDocType.RAW_MATERIAL],
    { cache: { id: 'list_incoming', milliseconds: 30000 } }
  );
  return list;
}

export async function createIncoming(data) {
  const repo = await incomingRepository();

  const detail = repo.create(data);

  const savedDetail = await repo.save(detail);

  const inbound = await createInbound({
    transactionType: RegisterDocType.RAW_MATERIAL,
    transactionId: savedDetail?.id,
  });

  return {
    inbound,
    detail: savedDetail,
  };
}
