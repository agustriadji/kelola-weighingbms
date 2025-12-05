/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb } from '../client';
import { Role } from '@/entities/Role.entity';
import { Permission } from '@/entities/Permission.entity';
import { RolePermission } from '@/entities/RolePermission.entity';
import { User } from '@/entities/User.entity';
import { Permissions } from '@/types/rbac';
import bcrypt from 'bcrypt';

export class RBACSeeder {
  static async run() {
    try {
      const db = await getDb();

      console.log('🌱 Starting RBAC seeding...');

      // 1. Create Permissions
      await this.seedPermissions(db);

      // 2. Create Roles
      await this.seedRoles(db);

      // 3. Assign Permissions to Roles
      await this.seedRolePermissions(db);

      // 4. Create Default Users
      await this.seedUsers(db);

      console.log('✅ RBAC seeding completed successfully!');
    } catch (error) {
      console.error('❌ RBAC seeding failed:', error);
      throw error;
    }
  }

  private static async seedPermissions(db: any) {
    const permissionRepo = db.getRepository(Permission);

    const permissions = Object.values(Permissions);

    for (const permName of permissions) {
      const existing = await permissionRepo.findOne({ where: { name: permName } });
      if (!existing) {
        const permission = new Permission();
        permission.name = permName;
        await permissionRepo.save(permission);
        console.log(`📝 Created permission: ${permName}`);
      }
    }
  }

  private static async seedRoles(db: any) {
    const roleRepo = db.getRepository(Role);

    const roles = ['Admin', 'Supervisor', 'Operator_Registering', 'Operator_Weighing', 'Viewer'];

    for (const roleName of roles) {
      const existing = await roleRepo.findOne({ where: { name: roleName } });
      if (!existing) {
        const role = new Role();
        role.name = roleName;
        await roleRepo.save(role);
        console.log(`👤 Created role: ${roleName}`);
      }
    }
  }

  private static async seedRolePermissions(db: any) {
    const roleRepo = db.getRepository(Role);
    const permissionRepo = db.getRepository(Permission);
    const rolePermissionRepo = db.getRepository(RolePermission);

    const rolePermissionMap = {
      Admin: Object.values(Permissions),
      Supervisor: [
        Permissions.VIEW_DASHBOARD,
        Permissions.VIEW_WEIGHING,
        Permissions.CREATE_WEIGHING,
        Permissions.UPDATE_WEIGHING,
        Permissions.VIEW_USERS,
        Permissions.VIEW_REPORTS,
        Permissions.EXPORT_REPORTS,
      ],
      Operator_Registering: [
        Permissions.VIEW_DASHBOARD,
        Permissions.VIEW_INCOMING,
        Permissions.CREATE_INCOMING,
        Permissions.UPDATE_INCOMING,
        Permissions.DELETE_INCOMING,
        Permissions.VIEW_OUTGOING,
        Permissions.CREATE_OUTGOING,
        Permissions.UPDATE_OUTGOING,
        Permissions.DELETE_OUTGOING,
        Permissions.VIEW_MISC,
        Permissions.CREATE_MISC,
        Permissions.UPDATE_MISC,
        Permissions.DELETE_MISC,
      ],
      Operator_Weighing: [
        Permissions.VIEW_DASHBOARD,
        Permissions.VIEW_WEIGHING,
        Permissions.CREATE_WEIGHING,
        Permissions.UPDATE_WEIGHING,
      ],
      Viewer: [Permissions.VIEW_DASHBOARD, Permissions.VIEW_WEIGHING, Permissions.VIEW_REPORTS],
    };

    for (const [roleName, permissionNames] of Object.entries(rolePermissionMap)) {
      const role = await roleRepo.findOne({ where: { name: roleName } });
      if (!role) continue;

      // Clear existing permissions
      await rolePermissionRepo
        .createQueryBuilder()
        .delete()
        .where('role_id = :roleId', { roleId: role.id })
        .execute();

      // Add new permissions
      for (const permName of permissionNames) {
        const permission = await permissionRepo.findOne({ where: { name: permName } });
        if (permission) {
          const rp = new RolePermission();
          rp.role = role;
          rp.permission = permission;
          await rolePermissionRepo.save(rp);
        }
      }

      console.log(`🔗 Assigned ${permissionNames.length} permissions to ${roleName}`);
    }
  }

  private static async seedUsers(db: any) {
    const userRepo = db.getRepository(User);
    const roleRepo = db.getRepository(Role);

    const defaultUsers = [
      {
        username: 'admin',
        password: 'admin123',
        fullName: 'System Administrator',
        roleName: 'Admin',
      },
      {
        username: 'supervisor',
        password: 'super123',
        fullName: 'Supervisor User',
        roleName: 'Supervisor',
      },
      {
        username: 'operator_weighing',
        password: 'oper123',
        fullName: 'Operator User Weighing',
        roleName: 'Operator_Weighing',
      },
      {
        username: 'operator_registering',
        password: 'oper123',
        fullName: 'Operator User Registering',
        roleName: 'Operator_Registering',
      },
      { username: 'viewer', password: 'view123', fullName: 'Viewer User', roleName: 'Viewer' },
    ];

    for (const userData of defaultUsers) {
      const existing = await userRepo.findOne({ where: { username: userData.username } });

      // Delete existing user to recreate with hashed password
      if (existing) {
        await userRepo.remove(existing);
        console.log(`🗑️ Removed existing user: ${userData.username}`);
      }

      const role = await roleRepo.findOne({ where: { name: userData.roleName } });
      if (role) {
        const user = new User();
        user.username = userData.username;
        user.passwordHash = await bcrypt.hash(userData.password, 10);
        user.fullName = userData.fullName;
        user.role = role;
        await userRepo.save(user);
        console.log(`👥 Created user: ${userData.username} (${userData.roleName})`);
      }
    }
  }
}
