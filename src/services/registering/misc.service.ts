import { MiscRepository } from '@/repositories/misc.repository';
import { createInbound } from '../inbound/createInbound.service';
import { inboundRepository } from '@/repositories/inbound.repository';
import { RegisterDocType } from '@/types/inbound.type';

export async function listMisc() {
  const repo = await inboundRepository();

  const list = await repo.manager.query(
    `
    SELECT
      inbound_ticket.id,
      inbound_ticket.transaction_type,
      inbound_ticket.transaction_id,
      inbound_ticket.status,
      misc_detail.contract_number,
      misc_detail.material,
      misc_detail.vehicle_number,
      misc_detail.vehicle_type,
      misc_detail.transporter,
      inbound_ticket.created_at
    FROM
      inbound_ticket
    INNER JOIN
      misc_detail
    ON
      inbound_ticket.transaction_id = misc_detail.id
    WHERE
      inbound_ticket.transaction_type = $1
  `,
    [RegisterDocType.MISCELLANEOUS],
    { cache: { id: 'list_misc', milliseconds: 30000 } }
  );
  return list;
}

export async function createMisc(data) {
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
  });

  return { inbound, detail: savedDetail };
}
