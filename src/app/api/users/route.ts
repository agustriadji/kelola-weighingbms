import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/database/client'
import { User } from '@/entities/User.entity'
import { Role } from '@/entities/Role.entity'
import bcrypt from 'bcrypt'


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb()
    const userRepo = db.getRepository(User)
    
    const users = await userRepo.find({
      relations: ['role'],
      select: {
        id: true,
        username: true,
        fullName: true,
        role: {
          id: true,
          name: true
        }
      }
    })
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, fullName, roleName } = await request.json()
    
    if (!username || !password || !fullName || !roleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const db = await getDb()
    const userRepo = db.getRepository(User)
    const roleRepo = db.getRepository(Role)
    
    // Check if user exists
    const existingUser = await userRepo.findOne({ where: { username } })
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    }
    
    // Find role
    const role = await roleRepo.findOne({ where: { name: roleName } })
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 400 })
    }
    
    // Create user
    const user = new User()
    user.username = username
    user.passwordHash = await bcrypt.hash(password, 10)
    user.fullName = fullName
    user.role = role
    
    await userRepo.save(user)
    
    return NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: role.name
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}