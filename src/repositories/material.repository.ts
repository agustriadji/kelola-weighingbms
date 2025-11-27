import { getDb } from "@/database/client";
import { Material } from "@/entities/Material.entity";

export const materialRepository = async () => {
  const db = await getDb();
  return db.getRepository(Material);
};
