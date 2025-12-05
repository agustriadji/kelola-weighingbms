import { NextRequest, NextResponse } from 'next/server';
import { updateBatchWeights } from '@/services/inbound/batch.service';

export async function POST(req: NextRequest) {
  try {
    const { id, expectedNetto, actualNetto } = await req.json();
    await updateBatchWeights(id, { expectedNetto, actualNetto });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
