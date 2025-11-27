import { NextResponse } from 'next/server'
import { getDb } from '@/database/client'
import { Vehicle } from '@/entities/Vehicle.entity'

export async function GET() {
  try {
    const db = await getDb()
    const vehicles = await db.getRepository(Vehicle).find()
    return NextResponse.json({ vehicles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}