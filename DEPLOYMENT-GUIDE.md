# WBMS Deployment Guide for Client

## 🚀 Quick Setup (Recommended)

### Prerequisites
- Docker Desktop installed
- `wbms_db.sql` file (database export)

### Step 1: Prepare Files
1. Extract the project files
2. Place `wbms_db.sql` in the project root folder
3. Open terminal/command prompt in project folder

### Step 2: Start Application
```bash
# Start PostgreSQL database only
docker-compose -f docker-compose.local.yml up -d

# Install dependencies (first time only)
npm install

# Setup database and start application
npm run db:setup
npm run dev
```

### Step 3: Access Application
- **URL**: http://localhost:3000
- **Login**: admin / admin123

---

## 🐳 Full Docker Setup (Alternative)

If you prefer everything in Docker:

```bash
# Build and start all services
docker-compose up --build

# If build fails due to network, try:
docker-compose build --no-cache
docker-compose up
```

---

## 📋 Default Users

| Username | Password | Role | Access Level |
|----------|----------|------|--------------|
| admin | admin123 | Admin | Full Access |
| supervisor | super123 | Supervisor | Limited Admin |
| operator | oper123 | Operator | Basic Operations |
| viewer | view123 | Viewer | Read Only |

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# View database logs
docker-compose -f docker-compose.local.yml logs postgres

# Reset database
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

### Application Issues
```bash
# Clear cache and restart
rm -rf .next node_modules
npm install
npm run dev
```

### Port Conflicts
If port 3000 or 5432 is in use:
- Change ports in `docker-compose.local.yml`
- Update `DATABASE_URL` in `.env.local`

---

## 📁 Project Structure
```
wbms-project/
├── wbms_db.sql              # Your database export (REQUIRED)
├── docker-compose.local.yml # Database only
├── docker-compose.yml       # Full Docker setup
├── package.json
├── .env.local               # Auto-created
└── src/                     # Application code
```

---

## 🛑 Stop Services

```bash
# Stop database
docker-compose -f docker-compose.local.yml down

# Stop full Docker setup
docker-compose down
```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure `wbms_db.sql` is in the correct location
3. Verify Docker Desktop is running
4. Try the "Quick Setup" method first

**Recommended**: Use the Quick Setup method for most reliable results.