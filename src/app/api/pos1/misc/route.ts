/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createMisc, listMisc } from '@/services/registering/misc.service';
import { RegisterDocType } from '@/types/inbound.type';
// import { getInboundList } from '@/services/inbound/getInbound.service';

export async function GET() {
  try {
    const list = await listMisc();

    return NextResponse.json({
      ok: true,
      data: list,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await createMisc(body);

    return NextResponse.json({
      ok: true,
      type: RegisterDocType.MISCELLANEOUS,
      inbound: result.inbound,
      detail: result.detail,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        error: err.message || `Failed to create ${RegisterDocType.MISCELLANEOUS} transaction`,
      },
      { status: 500 }
    );
  }
}
