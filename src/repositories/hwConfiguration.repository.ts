import { getDb } from "@/database/client";
import { HwConfiguration } from "@/entities/HwConfiguration.entity";

export const hwConfigurationRepository = async () => {
  const db = await getDb();
  return db.getRepository(HwConfiguration);
};