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

    // Mock vehicle history data
    const mockHistory = [
      { plate: "BK1234ABC", bruto: 35500, tarra: 15200, netto: 20300 },
      { plate: "BK1234ABC", bruto: 35200, tarra: 15100, netto: 20100 },
      { plate: "BK1234ABC", bruto: 35800, tarra: 15300, netto: 20500 }
    ];
    
    return NextResponse.json(mockHistory);
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}