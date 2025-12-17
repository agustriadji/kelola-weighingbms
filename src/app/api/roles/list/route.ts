import { NextResponse } from 'next/server';
import { RoleService } from '@/services/role/role.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const roleService = RoleService.getInstance();
    const roles = await roleService.getRoles();

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}
