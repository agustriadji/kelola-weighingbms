import { NextResponse } from 'next/server';
import { createIncoming, listIncoming } from '@/services/registering/incoming.service';
import { RegisterDocType, RegisterDocTypeName } from '@/types/inbound.type';

// import { getInboundList } from '@/services/inbound/getInbound.service';

export async function GET() {
  try {
    const list = await listIncoming();

    return NextResponse.json({
      ok: true,
      data: list,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.vehicleNumber) {
      return NextResponse.json({ ok: false, error: 'vehicle number is required' }, { status: 400 });
    }

    const result = await createIncoming(body);

    return NextResponse.json({
      ok: true,
      type: RegisterDocType.RAW_MATERIAL,
      inbound: result.inbound,
      detail: result.detail,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        error: err.message || `Failed to create ${RegisterDocTypeName.RAW_MATERIAL} transaction`,
      },
      { status: 500 }
    );
  }
}
