import { NextRequest, NextResponse } from 'next/server';
import { startWeighingIn } from '@/services/inbound/batch.service';
import { setRequestContext, generateRequestId, clearRequestContext } from '@/utils/context';

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();

  try {
    // Get user from middleware
    const userHeader = req.headers.get('x-user');
    const user = userHeader ? JSON.parse(userHeader) : null;

    // Set context untuk service layer
    setRequestContext(requestId, { user });

    const { id } = await req.json();

    console.log(id, 'ID');
    await startWeighingIn(id, requestId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.log(err, 'ID');
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    // Cleanup context
    clearRequestContext(requestId);
  }
}
