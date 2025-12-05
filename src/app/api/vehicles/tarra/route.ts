import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = auth.replace("Bearer ", "");
    
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtErr) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Mock tarra history data
    const mockTarra = {
      plate: "BK1234ABC",
      initial: 15200,
      min: 15100,
      max: 15300
    };
    
    return NextResponse.json(mockTarra);
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}