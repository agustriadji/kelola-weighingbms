import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '@/repositories/user.repositories';
import { setCache } from '@/utils/cache';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const login = async (username: string, password: string) => {
  // Check cache first
  const cacheKey = `user:${username}`;
  let user = null; //getCache(cacheKey);

  if (!user) {
    try {
      const repo = await userRepository();
      user = await repo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .leftJoinAndSelect('permissions.permission', 'permission')
        .where('user.username = :username', { username })
        .getOne();

      if (user) {
        const permissions = user.role?.permissions?.map((rp) => rp.permission.name) || [];
        user.role.permissions = permissions;
        setCache(cacheKey, user, 300); // Cache for 5 minutes
      }
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Database connection failed');
    }
  }

  if (!user) throw new Error('User not found');

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) throw new Error('Invalid password');

  // Get permissions from database or fallback to hardcoded
  const permissions = user.role?.permissions;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role?.name,
      permissions,
    },
    JWT_SECRET.toString(),
    {
      expiresIn: '1d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role?.name,
      permissions,
    },
  };
};
