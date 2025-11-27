import { getDb } from "@/database/client";
import { Supplier } from "@/entities/Supplier.entity";

export const supplierRepository = async () => {
  const db = await getDb();
  return db.getRepository(Supplier);
};
