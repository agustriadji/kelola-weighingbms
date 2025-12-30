import { getDb } from "@/database/client";
import { HwGeneralApi } from "@/entities/HwGeneralApi.entity";

export const hwGeneralApiRepository = async () => {
  const db = await getDb();
  return db.getRepository(HwGeneralApi);
};