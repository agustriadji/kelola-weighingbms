import { getDb } from "@/database/client";
import { User } from "@/entities/User.entity";

export const userRepository = async () => {
  const db = await getDb();
  return db.getRepository(User);
};

