/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createOutgoing, listOutgoing } from '@/services/registering/outgoing.service';
import { RegisterDocType, RegisterDocTypeName } from '@/types/inbound.type';


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await listOutgoing();

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

    const result = await createOutgoing(body);

    return NextResponse.json({
      ok: true,
      type: RegisterDocType.DISPATCH,
      inbound: result.inbound,
      detail: result.detail,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        error: err.message || `Failed to create ${RegisterDocTypeName.DISPATCH} transaction`,
      },
      { status: 500 }
    );
  }
}
