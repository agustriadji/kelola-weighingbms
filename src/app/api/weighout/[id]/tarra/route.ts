import { NextResponse } from 'next/server';
import { saveTarraWeight } from '@/services/weighing/weighOut.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const userHeader = req.headers.get('x-user');
    const user = userHeader ? JSON.parse(userHeader) : null;

    const result = await saveTarraWeight(Number(params.id), body.tarra, body.cctvUrl, user);

    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
