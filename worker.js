// Only run cron if environment allows it
if (process.env.ENABLE_SAP_CRON === "true") {
  require("./dist/cron/sapMasterCron").startSapCron();
  console.log("[CRON] SAP Master Sync Started...");
} else {
  console.log("[CRON] SAP Master Sync Disabled (ENABLE_SAP_CRON=false)");
}

