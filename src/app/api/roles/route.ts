import { NextRequest, NextResponse } from 'next/server';
import { RoleService } from '@/services/role/role.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const roleService = RoleService.getInstance();
    const result = await roleService.getAllRoles();

    if (result.success) {
      return NextResponse.json({ roles: result.roles });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, permissionIds } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    const roleService = RoleService.getInstance();
    const result = await roleService.createRole({ name, permissionIds });

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        role: result.role,
      });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('id');

    if (!roleId) {
      return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }

    const roleService = RoleService.getInstance();
    const result = await roleService.deleteRole(parseInt(roleId));

    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
