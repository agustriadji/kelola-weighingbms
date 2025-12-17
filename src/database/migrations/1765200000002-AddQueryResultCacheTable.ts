import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQueryResultCacheTable1765200000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table exists first
    const tableExists = await queryRunner.hasTable('query_result_cache');
    
    if (!tableExists) {
      await queryRunner.query(`
        CREATE TABLE query_result_cache (
          id SERIAL PRIMARY KEY,
          identifier VARCHAR(255),
          query TEXT NOT NULL,
          time BIGINT NOT NULL,
          duration INTEGER,
          result TEXT NOT NULL
        );
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS query_result_cache;`);
  }
}