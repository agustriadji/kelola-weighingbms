import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/database/client'
import { Role } from '@/entities/Role.entity'
import { Permission } from '@/entities/Permission.entity'
import { RolePermission } from '@/entities/RolePermission.entity'

export async function GET() {
  try {
    const db = await getDb()
    const roleRepo = db.getRepository(Role)
    
    const roles = await roleRepo.find({
      relations: ['permissions', 'permissions.permission']
    })
    
    return NextResponse.json({ roles })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, permissionIds } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 })
    }
    
    const db = await getDb()
    const roleRepo = db.getRepository(Role)
    const permissionRepo = db.getRepository(Permission)
    const rolePermissionRepo = db.getRepository(RolePermission)
    
    // Check if role exists
    const existingRole = await roleRepo.findOne({ where: { name } })
    if (existingRole) {
      return NextResponse.json({ error: 'Role already exists' }, { status: 400 })
    }
    
    // Create role
    const role = new Role()
    role.name = name
    await roleRepo.save(role)
    
    // Add permissions if provided
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
    
    return NextResponse.json({ 
      message: 'Role created successfully',
      role: { id: role.id, name: role.name }
    })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('id')
    
    if (!roleId) {
      return NextResponse.json({ error: 'Role ID is required' }, { status: 400 })
    }
    
    const db = await getDb()
    const roleRepo = db.getRepository(Role)
    const rolePermissionRepo = db.getRepository(RolePermission)
    
    // Delete role permissions first
    await rolePermissionRepo.delete({ role: { id: parseInt(roleId) } })
    
    // Delete role
    await roleRepo.delete(parseInt(roleId))
    
    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 })
  }
}