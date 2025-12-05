import { NextRequest, NextResponse } from 'next/server';
import { getLatestWeight } from '@/services/weighing/weight.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json({ error: 'batchId required' }, { status: 400 });
    }

    const weight = await getLatestWeight(parseInt(batchId));
    return NextResponse.json(weight);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
