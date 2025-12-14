import { NextRequest, NextResponse, MiddlewareConfig } from 'next/server';
import { createInbound, getInboundList } from '@/services/inbound/inbound.service';
import { listInbound } from '@/services/inbound/listInbound.service';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');

    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = auth.replace('Bearer ', '');

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (jwtErr) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    body.userId = user.id;

    const inbound = await createInbound(body);

    return NextResponse.json(inbound);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');

    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = auth.replace('Bearer ', '');

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (jwtErr) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    //const list = await getInboundList();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;

    const data = await listInbound({ type, status });

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
