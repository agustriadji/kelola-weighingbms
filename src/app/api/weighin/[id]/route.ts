import { NextResponse } from 'next/server';
import { startWeighIn } from '@/services/weighIn.service';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await startWeighIn(Number(params.id));
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
