import { AppDataSource } from "./source-database";
import { DataSource } from "typeorm";

let dataSource: DataSource | null = null;
let initPromise: Promise<DataSource> | null = null;

export const getDb = async (): Promise<DataSource> => {
  // Return existing connection if available
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start new initialization
  initPromise = AppDataSource.initialize()
    .then((ds) => {
      dataSource = ds;
      initPromise = null;
      return ds;
    })
    .catch((error) => {
      initPromise = null;
      console.error('Database connection failed:', error);
      throw error;
    });

  return initPromise;
};

