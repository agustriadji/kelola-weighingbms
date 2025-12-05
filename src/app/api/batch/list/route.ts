import { NextRequest, NextResponse } from 'next/server';
import { listInbound2 } from '@/services/inbound/listQueueTruck.service';

export async function GET(request: NextRequest) {
  // Menangkap query parameters
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const list = await listInbound2(status);
  return NextResponse.json(list);
}
