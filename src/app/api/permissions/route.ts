import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/database/client';
import { Permission } from '@/entities/Permission.entity';


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const permissionRepo = db.getRepository(Permission);

    const permissions = await permissionRepo.find();

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
