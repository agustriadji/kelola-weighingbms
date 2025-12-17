import { Role } from '@/entities/Role.entity';
import { Permission } from '@/entities/Permission.entity';
import { RolePermission } from '@/entities/RolePermission.entity';
import { User } from '@/entities/User.entity';
import { getDb } from '@/database/client';
import {
  AssignPermissionsRequest,
  AssignRoleToUserRequest,
  CreateRoleRequest,
  RoleResponse,
} from '@/types/rbac';
import { nameToFullname } from '@/utils/stringUtils';

export class RoleService {
  private static instance: RoleService;

  static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  async createRole(request: CreateRoleRequest): Promise<RoleResponse> {
    try {
      const db = await getDb();
      const roleRepo = db.getRepository(Role);

      // Check if role exists
      const existingRole = await roleRepo.findOne({
        where: { name: request.name },
      });

      if (existingRole) {
        return { success: false, message: 'Role already exists' };
      }

      const role = new Role();
      role.name = request.name;
      role.fullname = nameToFullname(request.name);

      const savedRole = await roleRepo.save(role);

      // Clear specific role cache
      await db.queryResultCache?.remove(['roles_list']);

      // Assign permissions if provided
      if (request.permissionIds && request.permissionIds.length > 0) {
        await this.setRolePermissions({
          roleId: savedRole.id,
          permissionIds: request.permissionIds,
        });
      }

      const mappedRole = {
        id: savedRole.id,
        name: savedRole.name,
        fullname: savedRole.fullname,
        permissions: [],
      };

      return {
        success: true,
        role: mappedRole,
        message: 'Role created successfully',
      };
    } catch (error) {
      console.error('Create role error:', error);
      return { success: false, message: 'Error creating role' };
    }
  }

  async setRolePermissions(request: AssignPermissionsRequest): Promise<RoleResponse> {
    try {
      const db = await getDb();
      const roleRepo = db.getRepository(Role);
      const permissionRepo = db.getRepository(Permission);
      const rolePermissionRepo = db.getRepository(RolePermission);

      // Validate role exists
      const role = await roleRepo.findOne({ where: { id: request.roleId } });
      if (!role) {
        return { success: false, message: 'Role not found' };
      }

      // Validate permissions exist
      const permissions = await permissionRepo.findByIds(request.permissionIds);
      if (permissions.length !== request.permissionIds.length) {
        return { success: false, message: 'Some permissions not found' };
      }

      // Remove existing role permissions
      await rolePermissionRepo.delete({ role: { id: request.roleId } });

      // Add new role permissions
      const rolePermissions = permissions.map((permission) => {
        const rp = new RolePermission();
        rp.role = role;
        rp.permission = permission;
        return rp;
      });

      await rolePermissionRepo.save(rolePermissions);

      // Clear specific role cache
      await db.queryResultCache?.remove(['roles_list']);

      return {
        success: true,
        message: 'Role permissions updated successfully',
      };
    } catch (error) {
      console.error('Set role permissions error:', error);
      return { success: false, message: 'Error setting role permissions' };
    }
  }

  async assignRoleToUser(request: AssignRoleToUserRequest): Promise<RoleResponse> {
    try {
      const db = await getDb();
      const userRepo = db.getRepository(User);
      const roleRepo = db.getRepository(Role);

      // Validate user and role exist
      const [user, role] = await Promise.all([
        userRepo.findOne({ where: { id: request.userId } }),
        roleRepo.findOne({ where: { id: request.roleId } }),
      ]);

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (!role) {
        return { success: false, message: 'Role not found' };
      }

      // Assign role to user
      user.role = role;
      await userRepo.save(user);

      return {
        success: true,
        message: 'Role assigned to user successfully',
      };
    } catch (error) {
      console.error('Assign role to user error:', error);
      return { success: false, message: 'Error assigning role to user' };
    }
  }

  async getRoles(): Promise<any> {
    try {
      const db = await getDb();
      const roleRepo = db.getRepository(Role);

      const roles = await roleRepo.find({
        select: ['id', 'name', 'fullname'],
        cache: {
          id: 'roles_list',
          milliseconds: 30000,
        },
      });

      return { success: true, roles };
    } catch (error) {
      console.error('Get roles error:', error);
      return { success: false, message: 'Error fetching roles' };
    }
  }
  async getAllRoles(): Promise<RoleResponse> {
    try {
      const db = await getDb();
      const roleRepo = db.getRepository(Role);

      const roles = await roleRepo.find({
        relations: ['permissions', 'permissions.permission'],
      });

      const mappedRoles = roles.map((role) => ({
        id: role.id,
        name: role.name,
        fullname: role.fullname,
        permissions: role.permissions.map((rp) => rp.permission),
      }));

      return { success: true, roles: mappedRoles };
    } catch (error) {
      console.error('Get roles error:', error);
      return { success: false, message: 'Error fetching roles' };
    }
  }

  async getRoleById(id: number): Promise<RoleResponse> {
    try {
      const db = await getDb();
      const roleRepo = db.getRepository(Role);

      const role = await roleRepo.findOne({
        where: { id },
        relations: ['permissions', 'permissions.permission', 'users'],
      });

      if (!role) {
        return { success: false, message: 'Role not found' };
      }

      const mappedRole = {
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((rp) => rp.permission),
      };

      return { success: true, role: mappedRole };
    } catch (error) {
      console.error('Get role error:', error);
      return { success: false, message: 'Error fetching role' };
    }
  }

  async deleteRole(id: number): Promise<RoleResponse> {
    try {
      const db = await getDb();
      const roleRepo = db.getRepository(Role);
      const userRepo = db.getRepository(User);

      // Check if role is assigned to any users
      const usersWithRole = await userRepo.count({
        where: { role: { id } },
      });

      if (usersWithRole > 0) {
        return {
          success: false,
          message: `Cannot delete role. ${usersWithRole} users are assigned to this role.`,
        };
      }

      const result = await roleRepo.delete(id);

      if (result.affected && result.affected > 0) {
        // Clear specific role cache
        await db.queryResultCache?.remove(['roles_list']);
        return { success: true, message: 'Role deleted successfully' };
      }

      return { success: false, message: 'Role not found' };
    } catch (error) {
      console.error('Delete role error:', error);
      return { success: false, message: 'Error deleting role' };
    }
  }

  async getAllPermissions(): Promise<{
    success: boolean;
    permissions?: Permission[];
    message?: string;
  }> {
    try {
      const db = await getDb();
      const permissionRepo = db.getRepository(Permission);

      const permissions = await permissionRepo.find({
        order: { name: 'ASC' },
      });

      return { success: true, permissions };
    } catch (error) {
      console.error('Get permissions error:', error);
      return { success: false, message: 'Error fetching permissions' };
    }
  }

  async createPermission(
    name: string
  ): Promise<{ success: boolean; permission?: Permission; message?: string }> {
    try {
      const db = await getDb();
      const permissionRepo = db.getRepository(Permission);

      // Check if permission exists
      const existing = await permissionRepo.findOne({ where: { name } });
      if (existing) {
        return { success: false, message: 'Permission already exists' };
      }

      const permission = new Permission();
      permission.name = name;

      const savedPermission = await permissionRepo.save(permission);

      return {
        success: true,
        permission: savedPermission,
        message: 'Permission created successfully',
      };
    } catch (error) {
      console.error('Create permission error:', error);
      return { success: false, message: 'Error creating permission' };
    }
  }
}
