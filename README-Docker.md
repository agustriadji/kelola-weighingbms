# Docker Setup for WBMS

## Quick Start

### Prerequisites
1. Place your `wbms_db.sql` export file in the project root directory
2. The file will be automatically imported during PostgreSQL initialization

### Production Deployment
```bash
# Build and run with PostgreSQL
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### Development Mode
```bash
# Build and run development environment
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## Services

### PostgreSQL Database
- **Container**: `wbms_postgres`
- **Port**: `5432`
- **Database**: `wbms_db`
- **User**: `wbms_user`
- **Password**: `wbms_password`

### Next.js Application
- **Container**: `wbms_app`
- **Port**: `3000`
- **URL**: http://localhost:3000

## Database Features

### Auto-Initialization
- Database schema created automatically
- RBAC system (roles, permissions, users)
- Sample master data (suppliers, materials, vehicles)
- Default users with hashed passwords

### Default Users
| Username | Password | Role | Access |
|----------|----------|------|---------|
| admin | admin123 | Admin | Full Access |
| supervisor | super123 | Supervisor | Limited Admin |
| operator | oper123 | Operator | Basic Operations |
| viewer | view123 | Viewer | Read Only |

## Environment Variables

### Production (.env)
```env
DATABASE_URL=postgresql://wbms_user:wbms_password@postgres:5432/wbms_db
JWT_SECRET=your-super-secret-jwt-key-for-production
ENABLE_SAP_CRON=false
NODE_ENV=production
```

### Development (.env.local)
```env
DATABASE_URL=postgresql://wbms_user:wbms_password@localhost:5432/wbms_db
JWT_SECRET=dev-secret-key
ENABLE_SAP_CRON=false
NODE_ENV=development
```

## Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Database Access
```bash
# Connect to PostgreSQL
docker exec -it wbms_postgres psql -U wbms_user -d wbms_db

# View tables
\dt

# Check users
SELECT * FROM users;
```

### Cleanup
```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a
```

## Troubleshooting

### Database Connection Issues
1. Wait for PostgreSQL to be ready (healthcheck)
2. Check container logs: `docker-compose logs postgres`
3. Verify environment variables

### Application Startup Issues
1. Check if database is initialized
2. Run migrations manually: `docker exec wbms_app npm run db:setup`
3. Check application logs: `docker-compose logs app`

### Port Conflicts
- Change ports in docker-compose.yml if 3000 or 5432 are in use
- Update DATABASE_URL accordingly

## Development Workflow

1. **Start services**: `docker-compose -f docker-compose.dev.yml up -d`
2. **Access app**: http://localhost:3000
3. **Login**: Use default users (admin/admin123)
4. **Database**: Access via localhost:5432
5. **Stop services**: `docker-compose -f docker-compose.dev.yml down`

## Production Deployment

1. **Set environment variables** in docker-compose.yml
2. **Build and deploy**: `docker-compose up -d --build`
3. **Monitor logs**: `docker-compose logs -f`
4. **Scale if needed**: `docker-compose up -d --scale app=2`

## Security Notes

- Change default passwords in production
- Use strong JWT_SECRET
- Configure firewall for exposed ports
- Regular database backups
- Monitor container logs