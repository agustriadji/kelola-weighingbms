import { NextRequest, NextResponse } from 'next/server';
import { getBatchDetail } from '@/services/inbound/batch.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const batch = await getBatchDetail(id);
  return NextResponse.json(batch);
}
