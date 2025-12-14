import { NextResponse } from 'next/server';
import { getInboundDetail } from '@/services/inbound/inbound.service';


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const inbound = await getInboundDetail(Number(params.id));

    return NextResponse.json({ ok: true, data: inbound });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 404 });
  }
}
