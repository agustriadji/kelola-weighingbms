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

    const roles = [
      'Admin',
      'Supervisor',
      'Operator_Registering',
      'Operator_WeighingIn',
      'Operator_WeighingOut',
      'Viewer',
    ];

    for (const roleName of roles) {
      let role = await roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        role = new Role();
        role.name = roleName;
        await roleRepo.save(role);
        console.log(`👤 Created role: ${roleName}`);
      } else {
        console.log(`👤 Role already exists: ${roleName}`);
      }
    }

    // Handle old role name migration
    const oldRole = await roleRepo.findOne({ where: { name: 'Operator_Weighingout' } });
    if (oldRole) {
      oldRole.name = 'Operator_WeighingOut';
      await roleRepo.save(oldRole);
      console.log(`🔄 Updated role name: Operator_Weighingout -> Operator_WeighingOut`);
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
      Operator_WeighingIn: [
        Permissions.VIEW_DASHBOARD,
        Permissions.VIEW_WEIGHING,
        Permissions.CREATE_WEIGHING,
        Permissions.UPDATE_WEIGHING,
        Permissions.POS_WEIGHINGIN,
      ],
      Operator_WeighingOut: [
        Permissions.VIEW_DASHBOARD,
        Permissions.VIEW_WEIGHING,
        Permissions.CREATE_WEIGHING,
        Permissions.UPDATE_WEIGHING,
        Permissions.POS_WEIGHINGOUT,
      ],
      Viewer: [Permissions.VIEW_DASHBOARD, Permissions.VIEW_WEIGHING, Permissions.VIEW_REPORTS],
    };

    // Always refresh all role permissions to ensure consistency
    for (const [roleName, permissionNames] of Object.entries(rolePermissionMap)) {
      const role = await roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        console.log(`⚠️ Role not found: ${roleName}`);
        continue;
      }

      // Clear existing permissions for this role
      await rolePermissionRepo
        .createQueryBuilder()
        .delete()
        .where('role_id = :roleId', { roleId: role.id })
        .execute();

      // Add all permissions for this role
      for (const permName of permissionNames) {
        const permission = await permissionRepo.findOne({ where: { name: permName } });
        if (permission) {
          const rp = new RolePermission();
          rp.role = role;
          rp.permission = permission;
          await rolePermissionRepo.save(rp);
        } else {
          console.log(`⚠️ Permission not found: ${permName}`);
        }
      }

      console.log(`🔗 Updated ${permissionNames.length} permissions for ${roleName}`);
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
        username: 'operator_weighing_in',
        password: 'oper123',
        fullName: 'Operator User Weighing IN',
        roleName: 'Operator_WeighingIn',
      },
      {
        username: 'operator_weighing_out',
        password: 'oper123',
        fullName: 'Operator User Weighing OUT',
        roleName: 'Operator_WeighingOut',
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
      let user = await userRepo.findOne({ where: { username: userData.username } });
      const role = await roleRepo.findOne({ where: { name: userData.roleName } });

      if (!role) continue;

      if (user) {
        // Update existing user
        user.passwordHash = await bcrypt.hash(userData.password, 10);
        user.fullName = userData.fullName;
        user.role = role;
        await userRepo.save(user);
        console.log(`🔄 Updated user: ${userData.username} (${userData.roleName})`);
      } else {
        // Create new user
        user = new User();
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
