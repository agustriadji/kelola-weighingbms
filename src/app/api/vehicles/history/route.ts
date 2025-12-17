import { NextRequest, NextResponse } from 'next/server';
import { getVehicleHistoryByContract } from '@/services/inbound/batch.service';

export async function GET(req: NextRequest) {
  try {
    const history = await getVehicleHistoryByContract();
    return NextResponse.json({ data: history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
