# Kelola Weighing BMS
Next.js Weighing Bridge Management System with Complete RBAC & Batch Workflow

## 🚀 Features

### Core WBMS Features
- ⚖️ **Complete Batch Workflow**: CREATE → START → WEIGHING → END
- 📊 **Real-time Weight Simulation**: Auto-capture BRUTO, TARRA, NETTO
- 🔍 **Shrinkage Analysis**: 0.2% threshold with automatic warnings
- 📈 **Vehicle & Tarra History**: Historical weight data tracking
- 🎯 **Fraud Detection**: Advanced shrinkage monitoring

### Authentication & Authorization
- 🔐 **JWT Authentication**: Secure token-based login system
- 👥 **Role-Based Access Control (RBAC)**: 4 roles with 12 permissions
- 🛡️ **bcrypt Password Hashing**: Secure password storage
- 🔑 **Middleware Protection**: API route security

### Database & Architecture
- 🗄️ **PostgreSQL Database**: Complete schema with TypeORM
- 🏗️ **Modular Architecture**: Independent WBMS with SAP integration
- 📋 **Master Data Management**: Suppliers, Materials, Vehicles
- 🔄 **Audit Trail System**: Complete operation logging

## 🎭 Default Users

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `admin` | `admin123` | Admin | Full Access (All 12 permissions) |
| `supervisor` | `super123` | Supervisor | View + Create + Update operations |
| `operator` | `oper123` | Operator | Basic weighing operations |
| `viewer` | `view123` | Viewer | Read-only access |

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 1. Environment Setup
Create `.env.local`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/wbms_db
JWT_SECRET=your-super-secret-jwt-key
ENABLE_SAP_CRON=false
```

### 2. Database Setup
```bash
# Install dependencies
npm install

# Run migrations and seed data
npm run db:setup
```

### 3. Development
```bash
# Start development server
npm run dev

# Or with SAP cron jobs
npm run dev:all
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

## 📋 WBMS Workflow

### 1. Batch Creation
```
POST /api/batch/create
{
  "batchName": "BATCH-001",
  "vehicleId": "1",
  "supplierId": "1", 
  "materialId": "1",
  "driverName": "John Doe",
  "ticketNumber": "TN-123456"
}
```

### 2. Weighing Process
1. **CREATE BATCH** → Status: `pending`
2. **START WEIGHING** → Status: `ongoing` + Real-time simulation
3. **Weight Capture**: Auto-capture when stable
   - BRUTO: Vehicle + Load weight
   - TARRA: Empty vehicle weight  
   - NETTO: BRUTO - TARRA
4. **END BATCH** → Status: `finished` + Shrinkage calculation

### 3. Shrinkage Analysis
```javascript
shrinkage = {
  shrinkageValue: expectedNetto - actualNetto,
  shrinkagePercent: ((expectedNetto - actualNetto) / expectedNetto) * 100,
  warning: shrinkagePercent > 0.2 // 0.2% threshold
}
```

## 🏗️ Project Structure
```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/login/         # JWT Authentication
│   │   ├── batch/              # Batch CRUD operations
│   │   ├── users/              # User management
│   │   ├── suppliers/          # Master data
│   │   ├── materials/          # Master data
│   │   └── vehicles/           # Master data
│   ├── dashboard/              # Main weighing interface
│   ├── login/                  # Login page
│   └── user/                   # User management
├── components/
│   ├── WeighingDisplay.tsx     # Main WBMS interface
│   ├── PermissionGate.tsx      # RBAC component
│   └── Footer.tsx
├── entities/                   # TypeORM entities
│   ├── User.entity.ts
│   ├── Role.entity.ts
│   ├── Batch.entity.ts
│   ├── Supplier.entity.ts
│   └── ...
├── services/                   # Business logic
│   ├── auth.service.ts
│   ├── batch.service.ts
│   └── ...
├── repositories/               # Data access layer
├── database/
│   ├── migrations/             # Database migrations
│   └── seeds/                  # Initial data
├── utils/
│   ├── api.ts                  # API utilities with JWT
│   └── auth.ts                 # Auth utilities
└── types/
    └── rbac.ts                 # RBAC type definitions
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login with JWT

### Batch Management
- `GET /api/batch/list` - List all batches
- `POST /api/batch/create` - Create new batch
- `POST /api/batch/start` - Start weighing process
- `POST /api/batch/end` - End batch with shrinkage
- `GET /api/batch/detail/:id` - Get batch details

### Master Data
- `GET /api/suppliers` - List suppliers
- `GET /api/materials` - List materials  
- `GET /api/vehicles` - List vehicles

### User Management
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless functions
- **TypeORM** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **Node Cron** - SAP sync jobs

## 🔒 RBAC System

### Roles & Permissions Matrix

| Permission | Admin | Supervisor | Operator | Viewer |
|------------|-------|------------|----------|---------|
| view_dashboard | ✅ | ✅ | ✅ | ✅ |
| view_weighing | ✅ | ✅ | ✅ | ✅ |
| create_weighing | ✅ | ✅ | ✅ | ❌ |
| update_weighing | ✅ | ✅ | ❌ | ❌ |
| delete_weighing | ✅ | ❌ | ❌ | ❌ |
| view_users | ✅ | ✅ | ❌ | ❌ |
| create_users | ✅ | ❌ | ❌ | ❌ |
| update_users | ✅ | ❌ | ❌ | ❌ |
| delete_users | ✅ | ❌ | ❌ | ❌ |
| view_reports | ✅ | ✅ | ❌ | ✅ |
| export_reports | ✅ | ✅ | ❌ | ❌ |
| manage_system | ✅ | ❌ | ❌ | ❌ |

## 🐳 Docker Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production
```bash
docker-compose up --build
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@db:5432/wbms

# Security
JWT_SECRET=your-production-secret-key

# Features
ENABLE_SAP_CRON=true
SAP_API_URL=https://sap-system.company.com
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts with role assignments
- `roles` - System roles (Admin, Supervisor, etc.)
- `permissions` - Granular permissions
- `role_permissions` - Role-permission mapping
- `batches` - Weighing batch records
- `suppliers` - Supplier master data
- `materials` - Material master data
- `vehicles` - Vehicle master data
- `records` - Weight measurement history
- `audit_logs` - System audit trail

## 🔄 SAP Integration

### Hybrid Verification Strategy
1. **Direct SAP Verification** (1000ms timeout)
2. **Fallback to Queue Processing** (reliability)
3. **Audit Trail Flow**: WBMS → SAP

### Data Ownership
- **WBMS Owns**: Vehicles, Drivers, Weighing Operations
- **SAP Owns**: Suppliers, Materials (synced via cron)
- **Audit Flow**: WBMS → SAP (fire and forget)

## 🚀 Advanced Features

### Fraud Detection
- Real-time shrinkage monitoring
- Historical pattern analysis
- Automatic threshold alerts
- Audit trail integration

### Reporting & Analytics
- Batch performance reports
- Shrinkage trend analysis
- Vehicle utilization metrics
- Supplier performance tracking

## 📝 Development Commands

```bash
# Database
npm run migration:run          # Run migrations
npm run migration:revert       # Revert last migration
npm run migration:generate     # Generate new migration
npm run seed                   # Seed initial data

# Development
npm run dev                    # Start dev server
npm run dev:all               # Dev server + cron jobs
npm run build                  # Build for production
npm run start                  # Start production server

# Background Jobs
npm run cron                   # Run SAP sync jobs
npm run start:cron            # Production cron jobs
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs` folder
- Review API documentation in Postman collection

---

**Built with ❤️ for Modern Weighbridge Management**