import { getDb } from "@/database/client";
import { Vehicle } from "@/entities/Vehicle.entity";

export const vehicleRepository = async () => {
  const db = await getDb();
  return db.getRepository(Vehicle);
};
