import { NextResponse } from 'next/server'
import { getDb } from '@/database/client'
import { Supplier } from '@/entities/Supplier.entity'


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb()
    const suppliers = await db.getRepository(Supplier).find()
    return NextResponse.json({ suppliers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
  }
}