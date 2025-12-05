import { NextResponse } from 'next/server';
import { getInboundDetail } from '@/services/inbound/inbound.service';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const trx = await getInboundDetail(Number(params.id));

    return NextResponse.json({
      ok: true,
      data: {
        inbound: trx,
        // weighIn: trx?.weighInRecords?.[0] ?? null,
        // weighOut: trx?.weighOutRecords?.[0] ?? null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 404 });
  }
}
