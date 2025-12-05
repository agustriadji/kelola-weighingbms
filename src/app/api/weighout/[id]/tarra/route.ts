import { NextResponse } from 'next/server';
import { saveTarraWeight } from '@/services/weighing/weighOut.service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const result = await saveTarraWeight(Number(params.id), body.tarra, body.cctvUrl);

    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
