import { AppDataSource } from "./source-database";
import { DataSource } from "typeorm";

let dataSource: DataSource;

export const getDb = async () => {
  if (!dataSource || !dataSource.isInitialized) {
    dataSource = await AppDataSource.initialize();
  }
  return dataSource;
};

