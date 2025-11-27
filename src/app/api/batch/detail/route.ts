import { NextRequest, NextResponse } from "next/server";
import { getBatchDetail } from "@/services/batch.service";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const batch = await getBatchDetail(id);
  return NextResponse.json(batch);
}