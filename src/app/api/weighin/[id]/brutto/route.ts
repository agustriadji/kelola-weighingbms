import { NextResponse } from 'next/server';
import { saveBruttoWeight } from '@/services/weighing/weighIn.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const userHeader = req.headers.get('x-user');
    const user = userHeader ? JSON.parse(userHeader) : null;
    
    const result = await saveBruttoWeight(
      Number(params.id),
      body.brutto,
      body.cctvUrl,
      user
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
