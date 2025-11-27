import { getDb } from "@/database/client";
import { Driver } from "@/entities/Driver.entity";

export const driverRepository = async () => {
  const db = await getDb();
  return db.getRepository(Driver);
};
