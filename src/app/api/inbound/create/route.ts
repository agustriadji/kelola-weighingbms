import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = auth.replace("Bearer ", "");
    
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (jwtErr) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    
    // Generate ID untuk inbound transaction
    const inboundId = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-3)}`;
    
    const inboundData = {
      id: inboundId,
      ...body,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Save to database
    console.log('Inbound created:', inboundData);

    return NextResponse.json({
      success: true,
      data: inboundData,
      message: 'Inbound transaction created successfully'
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}