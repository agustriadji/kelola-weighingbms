/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { setRequestContext, generateRequestId } from '@/utils/context';
import { saveBruttoWeighing, saveTarraWeighing } from '@/services/inbound/batch.service';
import { RegisterDocType } from '@/types/inbound.type';

export async function POST(req: NextRequest) {
  try {
    const requestId = generateRequestId();
    // Get user from middleware
    const userHeader = req.headers.get('x-user');
    const user = userHeader ? JSON.parse(userHeader) : null;

    // Set context untuk service layer
    setRequestContext(requestId, { user });

    let data = null;
    const { batchId, weight, stable, source, cctvUrl, transactionType, transactionId, status } =
      await req.json();

    if (transactionType === RegisterDocType.DISPATCH) {
      data = await saveTarraWeighing(
        batchId,
        weight,
        stable,
        source,
        cctvUrl,
        transactionType,
        transactionId,
        status
      );
    } else {
      data = await saveBruttoWeighing(
        batchId,
        weight,
        stable,
        source,
        cctvUrl,
        transactionType,
        transactionId,
        status
      );
    }

    // Mock save weight record

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
