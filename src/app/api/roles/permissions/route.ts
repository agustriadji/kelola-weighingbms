import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/database/client'
import { Role } from '@/entities/Role.entity'
import { Permission } from '@/entities/Permission.entity'
import { RolePermission } from '@/entities/RolePermission.entity'


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const { roleId, permissionIds } = await request.json()
    
    if (!roleId) {
      return NextResponse.json({ error: 'Role ID is required' }, { status: 400 })
    }
    
    const db = await getDb()
    const roleRepo = db.getRepository(Role)
    const permissionRepo = db.getRepository(Permission)
    const rolePermissionRepo = db.getRepository(RolePermission)
    
    // Find role
    const role = await roleRepo.findOne({ where: { id: roleId } })
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }
    
    // Delete existing permissions
    await rolePermissionRepo.delete({ role: { id: roleId } })
    
    // Add new permissions
    if (permissionIds && permissionIds.length > 0) {
      for (const permissionId of permissionIds) {
        const permission = await permissionRepo.findOne({ where: { id: permissionId } })
        if (permission) {
          const rp = new RolePermission()
          rp.role = role
          rp.permission = permission
          await rolePermissionRepo.save(rp)
        }
      }
    }
    
    return NextResponse.json({ message: 'Role permissions updated successfully' })
  } catch (error) {
    console.error('Error updating role permissions:', error)
    return NextResponse.json({ error: 'Failed to update role permissions' }, { status: 500 })
  }
}