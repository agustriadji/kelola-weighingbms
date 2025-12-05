import { NextRequest, NextResponse } from 'next/server';
import { createBatch } from '@/services/inbound/batch.service';
import jwt from 'jsonwebtoken';

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

    const batch = await createBatch(body);
    return NextResponse.json(batch);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
