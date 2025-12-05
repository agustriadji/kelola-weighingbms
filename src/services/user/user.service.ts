import { User } from '@/entities/User.entity'
import { Role } from '@/entities/Role.entity'
import { getDb } from '@/database/client'

export interface CreateUserRequest {
  username: string
  password: string
  fullName: string
  roleName: string
  nik: string
}

export interface UpdateUserRequest {
  id: number
  username?: string
  fullName?: string
  roleName?: string
}

export interface UserResponse {
  success: boolean
  user?: User
  users?: User[]
  message?: string
}

export class UserService {
  private static instance: UserService

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    try {
      const validation = this.validateCreateUser(request)
      if (!validation.isValid) {
        return { success: false, message: validation.message }
      }

      const db = await getDb()
      const userRepo = db.getRepository(User)
      const roleRepo = db.getRepository(Role)

      // Check if username exists
      const existingUser = await userRepo.findOne({
        where: { username: request.username }
      })
      
      if (existingUser) {
        return { success: false, message: 'Username already exists' }
      }

      // Find role
      const role = await roleRepo.findOne({
        where: { name: request.roleName }
      })
      
      if (!role) {
        return { success: false, message: 'Role not found' }
      }

      // Create user
      const user = new User()
      user.username = request.username
      user.passwordHash = request.password // Hash in production
      user.fullName = request.fullName
      user.role = role

      const savedUser = await userRepo.save(user)
      
      return { 
        success: true, 
        user: savedUser,
        message: 'User created successfully'
      }
    } catch (error) {
      console.error('Create user error:', error)
      return { success: false, message: 'Error creating user' }
    }
  }

  async getAllUsers(): Promise<UserResponse> {
    try {
      const db = await getDb()
      const userRepo = db.getRepository(User)
      
      const users = await userRepo.find({
        relations: ['role']
      })
      
      return { success: true, users }
    } catch (error) {
      console.error('Get users error:', error)
      return { success: false, message: 'Error fetching users' }
    }
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const db = await getDb()
      const userRepo = db.getRepository(User)
      
      const user = await userRepo.findOne({
        where: { id },
        relations: ['role', 'role.permissions', 'role.permissions.permission']
      })
      
      if (user) {
        return { success: true, user }
      }
      
      return { success: false, message: 'User not found' }
    } catch (error) {
      console.error('Get user error:', error)
      return { success: false, message: 'Error fetching user' }
    }
  }

  async updateUser(request: UpdateUserRequest): Promise<UserResponse> {
    try {
      const db = await getDb()
      const userRepo = db.getRepository(User)
      const roleRepo = db.getRepository(Role)
      
      const user = await userRepo.findOne({
        where: { id: request.id },
        relations: ['role']
      })
      
      if (!user) {
        return { success: false, message: 'User not found' }
      }

      if (request.username) user.username = request.username
      if (request.fullName) user.fullName = request.fullName
      
      if (request.roleName) {
        const role = await roleRepo.findOne({
          where: { name: request.roleName }
        })
        if (role) user.role = role
      }

      const updatedUser = await userRepo.save(user)
      
      return { 
        success: true, 
        user: updatedUser,
        message: 'User updated successfully' 
      }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, message: 'Error updating user' }
    }
  }

  async deleteUser(id: number): Promise<UserResponse> {
    try {
      const db = await getDb()
      const userRepo = db.getRepository(User)
      
      const result = await userRepo.delete(id)
      
      if (result.affected && result.affected > 0) {
        return { success: true, message: 'User deleted successfully' }
      }
      
      return { success: false, message: 'User not found' }
    } catch (error) {
      console.error('Delete user error:', error)
      return { success: false, message: 'Error deleting user' }
    }
  }

  generatePassword(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  private validateCreateUser(request: CreateUserRequest): { isValid: boolean; message?: string } {
    if (!request.username?.trim()) {
      return { isValid: false, message: 'Username is required' }
    }
    
    if (!request.password?.trim()) {
      return { isValid: false, message: 'Password is required' }
    }
    
    if (request.password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters' }
    }
    
    if (!request.fullName?.trim()) {
      return { isValid: false, message: 'Full name is required' }
    }
    
    if (!request.roleName?.trim()) {
      return { isValid: false, message: 'Role is required' }
    }

    return { isValid: true }
  }
}