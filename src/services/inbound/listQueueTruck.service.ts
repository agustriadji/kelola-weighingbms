import { inboundRepository } from '@/repositories/inbound.repository';
import { InboundStatus } from './inboundStateMechine.service';

export async function listInbound2(status) {
  const repo = await inboundRepository();

  console.log(status, 'status==================');
  const data = await repo.manager.connection.query(
    `
    SELECT
    inbound_ticket.id,
    inbound_ticket.transaction_id,
    inbound_ticket.transaction_type,

    -- manipulation order by transaction_type
    
    -- vehicle_number
    case
        when inbound_ticket.transaction_type = 'INCOMING' then incoming_detail.vehicle_number
        when inbound_ticket.transaction_type = 'OUTGOING' then outgoing_detail.vehicle_number
        when inbound_ticket.transaction_type = 'MISC' then misc_detail.vehicle_number
    end as vehicle_number,

    -- document
    case 
        when inbound_ticket.transaction_type = 'INCOMING' then incoming_detail.contract_number
        when inbound_ticket.transaction_type = 'OUTGOING' then outgoing_detail.contract_number
        when inbound_ticket.transaction_type = 'MISC' then misc_detail.contract_number
    end as contract_number,

    -- material
    case 
        when inbound_ticket.transaction_type = 'INCOMING' then incoming_detail.material
        when inbound_ticket.transaction_type = 'OUTGOING' then outgoing_detail.material
        when inbound_ticket.transaction_type = 'MISC' then misc_detail.material
    end as material,

    -- relation
    case
        when inbound_ticket.transaction_type = 'INCOMING' then NULL
        when inbound_ticket.transaction_type = 'OUTGOING' then outgoing_detail.relation_name
        when inbound_ticket.transaction_type = 'MISC' then NULL
    end as relation_name, 

    -- transporter
    case
        when inbound_ticket.transaction_type = 'INCOMING' then incoming_detail.transporter
        when inbound_ticket.transaction_type = 'OUTGOING' then outgoing_detail.transporter
        when inbound_ticket.transaction_type = 'MISC' then misc_detail.transporter
    end as transporter,

    inbound_ticket.status,
    inbound_ticket.created_at,
    inbound_ticket.updated_at

    FROM inbound_ticket
    LEFT join incoming_detail ON inbound_ticket.transaction_id = incoming_detail.id
    LEFT join outgoing_detail ON inbound_ticket.transaction_id = outgoing_detail.id
    LEFT join misc_detail ON inbound_ticket.transaction_id = misc_detail.id

    WHERE inbound_ticket.status = $1
    ORDER BY inbound_ticket.created_at DESC
    `,
    [status]
  );

  return data;
}

export async function clearListInboundCache() {
  const repo = await inboundRepository();
  await repo.manager.connection.queryResultCache?.clear();
  console.log('TypeORM database cache cleared');
}
