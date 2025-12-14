import { NextResponse } from 'next/server'
import { getDb } from '@/database/client'
import { Material } from '@/entities/Material.entity'


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb()
    const materials = await db.getRepository(Material).find()
    return NextResponse.json({ materials })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}