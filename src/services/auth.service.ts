import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "@/repositories/user.repositories";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";

export const login = async (username: string, password: string) => {
  const repo = await userRepository();
  
  const user = await repo.findOne({
    where: { username },
    relations: ["role", "role.permissions", "role.permissions.permission"],
  });

  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid password");

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role?.name,
      permissions: user.role?.permissions?.map(rp => rp.permission.name) || [],
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES,
    }
  );

  // Update last login
  user.lastLogin = new Date();
  await repo.save(user);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role?.name,
    }
  };
};