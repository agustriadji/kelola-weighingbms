import { NextRequest, NextResponse } from 'next/server';
import { endBatch } from '@/services/inbound/batch.service';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');

    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = auth.replace('Bearer ', '');

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtErr) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id, expectedNetto, actualNetto } = await req.json();

    const result = await endBatch(id, { expectedNetto, actualNetto });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
