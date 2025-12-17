# Docker Setup Instructions

## Quick Start (Clean Database)

```bash
# 1. Clear existing containers and volumes
docker-compose -f docker-compose.dev.yml down -v

# 2. Build and start containers
docker-compose -f docker-compose.dev.yml up --build -d

# 3. Wait for database to be ready (30 seconds)
timeout 30

# 4. Run database seeding
docker exec -it wbms_app_dev npm run seed
```

## Production Setup

```bash
# 1. Clear existing containers and volumes
docker-compose down -v

# 2. Build and start containers
docker-compose up --build -d

# 3. Wait for database to be ready
timeout 30

# 4. Run database seeding
docker exec -it wbms_app npm run seed
```

## Manual Steps

```bash
# Check container status
docker ps

# View logs
docker logs wbms_app_dev

# Access container shell
docker exec -it wbms_app_dev bash

# Run migrations only
docker exec -it wbms_app_dev npm run migration:run

# Run seeding only
docker exec -it wbms_app_dev npm run seed
```

## Troubleshooting

- If seeding fails, wait longer for database to initialize
- Check logs: `docker logs wbms_db_dev`
- Restart containers: `docker-compose -f docker-compose.dev.yml restart`