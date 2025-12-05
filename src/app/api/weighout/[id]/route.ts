import { NextResponse } from 'next/server';
import { startWeighOut } from '@/services/weighing/weighOut.service';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await startWeighOut(Number(params.id));
    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
