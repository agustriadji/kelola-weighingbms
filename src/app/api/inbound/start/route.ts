/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { startWeighingIn, startWeighingOut } from '@/services/inbound/batch.service';
import { getUser } from '@/utils/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Get user from middleware
    const inboundId = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      Date.now()
    ).slice(-3)}`;
    const user = getUser(req);

    const { id, isYard, miscCategory } = await req.json();
    console.info({ inboundId, user, id, isYard }, 'ADA APA');

    if (isYard) {
      await startWeighingOut(id, miscCategory, user);
    } else {
      await startWeighingIn(id, miscCategory, user);
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.info(err, '--------------------');
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
