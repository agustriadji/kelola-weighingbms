import { getDb } from "@/database/client";
import { Record } from "@/entities/Record.entity";

export const recordRepository = async () => {
  const db = await getDb();
  return db.getRepository(Record);
};