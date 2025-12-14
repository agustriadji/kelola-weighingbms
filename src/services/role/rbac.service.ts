import { User } from '@/entities/User.entity'
import { Role } from '@/entities/Role.entity'
import { Permission } from '@/entities/Permission.entity'
import { RolePermission } from '@/entities/RolePermission.entity'
import { Permissions } from '@/types/rbac'
import { getDb } from '@/database/client'

export interface PermissionCheck {
  hasPermission: boolean
  reason?: string
}

export class RBACService {
  private static instance: RBACService

  static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService()
    }
    return RBACService.instance
  }

  async checkPermission(user: User | null, permission: Permissions): Promise<PermissionCheck> {
    if (!user) {
      return { hasPermission: false, reason: 'User not authenticated' }
    }

    if (!user.role) {
      return { hasPermission: false, reason: 'User has no role' }
    }

    const permissions = await this.getUserPermissions(user)
    const hasPermission = permissions.includes(permission)
    
    return {
      hasPermission,
      reason: hasPermission ? undefined : `Missing permission: ${permission}`
    }
  }

  async checkAnyPermission(user: User | null, permissions: Permissions[]): Promise<PermissionCheck> {
    if (!user) {
      return { hasPermission: false, reason: 'User not authenticated' }
    }

    if (!user.role) {
      return { hasPermission: false, reason: 'User has no role' }
    }

    const userPermissions = await this.getUserPermissions(user)
    const hasAnyPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    )

    return {
      hasPermission: hasAnyPermission,
      reason: hasAnyPermission ? undefined : `Missing any of permissions: ${permissions.join(', ')}`
    }
  }

  checkRole(user: User | null, roleName: string): PermissionCheck {
    if (!user) {
      return { hasPermission: false, reason: 'User not authenticated' }
    }

    if (!user.role) {
      return { hasPermission: false, reason: 'User has no role' }
    }

    const hasRole = user.role.name === roleName
    
    return {
      hasPermission: hasRole,
      reason: hasRole ? undefined : `Required role: ${roleName}, current role: ${user.role.name}`
    }
  }

  async getUserPermissions(user: User | null): Promise<string[]> {
    if (!user || !user.role) {
      return []
    }

    try {
      const db = await getDb()
      const rolePermissionRepo = db.getRepository(RolePermission)
      
      const rolePermissions = await rolePermissionRepo.find({
        where: { role: { id: user.role.id } },
        relations: ['permission']
      })

      return rolePermissions
        .filter(rp => rp.permission)
        .map(rp => rp.permission.name)
    } catch (error) {
      console.error('Error fetching user permissions:', error)
      return []
    }
  }

  async canAccessWeighing(user: User | null, action: 'view' | 'create' | 'update' | 'delete'): Promise<PermissionCheck> {
    const permissionMap = {
      view: Permissions.VIEW_WEIGHING,
      create: Permissions.CREATE_WEIGHING,
      update: Permissions.UPDATE_WEIGHING,
      delete: Permissions.DELETE_WEIGHING
    }

    return this.checkPermission(user, permissionMap[action])
  }

  async canAccessUsers(user: User | null, action: 'view' | 'create' | 'update' | 'delete'): Promise<PermissionCheck> {
    const permissionMap = {
      view: Permissions.VIEW_USERS,
      create: Permissions.CREATE_USERS,
      update: Permissions.UPDATE_USERS,
      delete: Permissions.DELETE_USERS
    }

    return this.checkPermission(user, permissionMap[action])
  }

  async canAccessReports(user: User | null, action: 'view' | 'export'): Promise<PermissionCheck> {
    const permissionMap = {
      view: Permissions.VIEW_REPORTS,
      export: Permissions.EXPORT_REPORTS
    }

    return this.checkPermission(user, permissionMap[action])
  }

  async canManageSystem(user: User | null): Promise<PermissionCheck> {
    return this.checkPermission(user, Permissions.MANAGE_SYSTEM)
  }

  async getAccessibleRoutes(user: User | null): Promise<string[]> {
    if (!user) return ['/login']

    const routes: string[] = []
    
    if ((await this.checkPermission(user, Permissions.VIEW_DASHBOARD)).hasPermission) {
      routes.push('/dashboard')
    }
    
    if ((await this.checkPermission(user, Permissions.VIEW_USERS)).hasPermission) {
      routes.push('/user')
    }
    
    if ((await this.checkPermission(user, Permissions.VIEW_REPORTS)).hasPermission) {
      routes.push('/reports')
    }

    return routes
  }

  async validateRouteAccess(user: User | null, route: string): Promise<PermissionCheck> {
    const routePermissions = {
      '/dashboard': Permissions.VIEW_DASHBOARD,
      '/user': Permissions.VIEW_USERS,
      '/reports': Permissions.VIEW_REPORTS,
      '/weighing': Permissions.VIEW_WEIGHING
    }

    const requiredPermission = routePermissions[route as keyof typeof routePermissions]
    
    if (!requiredPermission) {
      return { hasPermission: true } // Public route
    }

    return this.checkPermission(user, requiredPermission)
  }

  async initializeDefaultRolesAndPermissions(): Promise<void> {
    try {
      const db = await getDb()
      const roleRepo = db.getRepository(Role)
      const permissionRepo = db.getRepository(Permission)

      // Create permissions if they don't exist
      const permissions = Object.values(Permissions)
      for (const permName of permissions) {
        const existing = await permissionRepo.findOne({ where: { name: permName } })
        if (!existing) {
          const permission = new Permission()
          permission.name = permName
          await permissionRepo.save(permission)
        }
      }

      // Create default roles if they don't exist
      const defaultRoles = ['Admin', 'Supervisor', 'Operator', 'Viewer']
      for (const roleName of defaultRoles) {
        const existing = await roleRepo.findOne({ where: { name: roleName } })
        if (!existing) {
          const role = new Role()
          role.name = roleName
          await roleRepo.save(role)
        }
      }
    } catch (error) {
      console.error('Error initializing roles and permissions:', error)
    }
  }
}