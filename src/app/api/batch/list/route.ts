import { NextResponse } from "next/server";
import { listBatch } from "@/services/batch.service";

export async function GET() {
  const list = await listBatch();
  return NextResponse.json(list);
}