import { AppDataSource } from "./source-database";

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
})();
