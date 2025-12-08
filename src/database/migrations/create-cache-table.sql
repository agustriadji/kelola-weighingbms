-- Create query result cache table for TypeORM
CREATE TABLE IF NOT EXISTS query_result_cache (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255),
  time BIGINT NOT NULL,
  duration INTEGER NOT NULL,
  query TEXT NOT NULL,
  result TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_query_result_cache_identifier ON query_result_cache(identifier);
CREATE INDEX IF NOT EXISTS idx_query_result_cache_time ON query_result_cache(time);
