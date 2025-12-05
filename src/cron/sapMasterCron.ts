import cron from "node-cron";
import {
  syncMaterials,
  syncSuppliers,
  syncVehicles,
  syncDrivers
} from "@/services/sap/syncMaster.service";

export const startSapCron = () => {
  console.log("[CRON] SAP Master Sync Started...");

  cron.schedule("*/5 * * * *", async () => {
    console.log("[CRON] Syncing SAP Master Data...");

    try {
      await syncMaterials();
      await syncSuppliers();
      await syncVehicles();
      await syncDrivers();
      console.log("[CRON] SAP Sync OK");

    } catch (err: any) {
      console.error("[CRON] SAP Sync ERROR:", err.message);
    }
  });
};
