# Kelola Weighing BMS

Next.js Weighing Bridge Management System with Complete RBAC & Transaction Workflow

## 🚀 Features

### Core WBMS Features

- ⚖️ **Complete Transaction Workflow**: INCOMING → OUTGOING → MISC transactions
- 📊 **Real-time Weight Simulation**: Auto-capture BRUTO, TARRA, NETTO weights
- 🔍 **Shrinkage Analysis**: 0.2% threshold with automatic warnings
- 📈 **Vehicle & Weight History**: Historical data tracking with tarra management
- 🎯 **Fraud Detection**: Advanced shrinkage monitoring and alerts
- 🚛 **Multi-Transaction Support**: Handle incoming, outgoing, and miscellaneous transactions

### Authentication & Authorization

- 🔐 **JWT Authentication**: Secure token-based login system
- 👥 **Role-Based Access Control (RBAC)**: 5 roles with 20+ permissions
- 🛡️ **bcrypt Password Hashing**: Secure password storage
- 🔑 **Middleware Protection**: API route security with context injection
- 👤 **User Management**: Complete CRUD with role assignments

### Database & Architecture

- 🗄️ **PostgreSQL Database**: Complete schema with 22+ entities using TypeORM
- 🏗️ **Clean Architecture**: Context-Hooks-Stores separation pattern
- 📋 **Master Data Management**: Suppliers, Materials, Vehicles, Drivers
- 🔄 **Audit Trail System**: Complete operation logging with user tracking
- 💾 **State Management**: Zustand with persistence and caching
- 🔄 **Repository Pattern**: Data access layer abstraction

## 🎭 Default Users

| Username            | Password   | Role                 | Permissions                       |
| ------------------- | ---------- | -------------------- | --------------------------------- |
| `admin`             | `admin123` | Admin                | Full Access (All 20+ permissions) |
| `supervisor`        | `super123` | Supervisor           | View + Create + Update operations |
| `operator_weighing` | `oper123`  | Operator Weighing    | Weighing operations only          |
| `operator_register` | `reg123`   | Operator Registering | Registration operations only      |
| `viewer`            | `view123`  | Viewer               | Read-only access                  |

## 🏃♂️ Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 1. Environment Setup

Create `.env.local`:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=newpassword
DB_NAME=wbms_db

JWT_SECRET=supersecret_for_wbms
JWT_EXPIRES=1d

SAP_URL=http://localhost:3002/SAP
REDIS_URL=redis://localhost:6379
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Run migrations and seed data
npm run db:setup
```

### 2a. Docker Database Setup

```bash
# clear image
docker-compose -f docker-compose.dev.yml down -v
# build image
docker-compose -f docker-compose.dev.yml up --build
# run seeding
docker exec -it wbms_app_dev npm run seed
```

### 3. Development

```bash
# Start development server
npm run dev

# Or with SAP cron jobs
npm run dev:all
```

### 4. Access Application

- **Frontend**: http://localhost:3001
- **Login**: http://localhost:3001/login
- **Dashboard**: http://localhost:3001/dashboard

## 📋 WBMS Workflow

### 1. Transaction Registration

```
POST /api/inbound/incoming
{
  "vehicleNumber": "B1234ABC",
  "driverName": "John Doe",
  "transporter": "PT Transport",
  "material": "Palm Oil",
  "doNumber": "DO-001",
  "sealNumber": "SEAL-001"
}
```

### 2. Weighing Process

1. **REGISTER TRANSACTION** → Status: `queue-weigh-in`
2. **START WEIGHING** → Status: `weighing-in` + Real-time simulation
3. **Weight Capture**: Auto-capture when stable
   - BRUTO: Vehicle + Load weight (WeighIn)
   - TARRA: Empty vehicle weight (WeighOut)
   - NETTO: BRUTO - TARRA
4. **COMPLETE TRANSACTION** → Status: `finished` + Shrinkage calculation

### 3. Shrinkage Analysis

```javascript
shrinkage = {
  shrinkageValue: expectedNetto - actualNetto,
  shrinkagePercent: ((expectedNetto - actualNetto) / expectedNetto) * 100,
  warning: shrinkagePercent > 0.2, // 0.2% threshold
};
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/login/         # JWT Authentication
│   │   ├── inbound/            # Transaction operations
│   │   ├── users/              # User management
│   │   ├── role/               # Role management
│   │   └── weighing/           # Weighing operations
│   ├── dashboard/              # Main dashboard
│   ├── weighing/               # Weighing interface
│   ├── inbound/                # Transaction management
│   ├── login/                  # Login page
│   └── user/                   # User management
├── components/
│   ├── atoms/                  # Basic UI components
│   ├── molecules/              # Composite components
│   ├── organisms/              # Complex components
│   ├── pages/                  # Page-specific components
│   ├── shared/                 # Shared components
│   │   ├── PermissionGate.tsx  # RBAC component
│   │   └── LoadingSpinner.tsx  # Loading component
│   └── templates/              # Layout templates
├── entities/                   # TypeORM entities (22+ entities)
│   ├── User.entity.ts
│   ├── Role.entity.ts
│   ├── InboundTicket.entity.ts
│   ├── WeighIn.entity.ts
│   ├── WeighOut.entity.ts
│   └── ...
├── services/                   # Business logic (class-based)
│   ├── authentication/
│   ├── inbound/
│   ├── weighing/
│   ├── user/
│   └── role/
├── repositories/               # Data access layer
├── contexts/                   # React contexts
│   └── weighing.context.ts     # API operations layer
├── hooks/                      # Custom hooks
│   ├── useAuth.ts
│   └── useWeighing.ts          # Integration layer
├── store/                      # Zustand stores
│   └── weighing.store.ts       # State management
├── database/
│   ├── migrations/             # Database migrations
│   └── seeds/                  # Initial data
├── utils/
│   ├── api.ts                  # API utilities with JWT
│   ├── auth.ts                 # Auth utilities
│   └── context.ts              # Request context
└── types/
    ├── rbac.ts                 # RBAC type definitions
    └── inbound.type.ts         # Transaction types
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login with JWT

### Transaction Management

- `GET /api/inbound/list` - List all transactions
- `POST /api/inbound/incoming` - Create incoming transaction
- `POST /api/inbound/outgoing` - Create outgoing transaction
- `POST /api/inbound/misc` - Create misc transaction
- `GET /api/inbound/detail/:id` - Get transaction details
- `POST /api/inbound/start-weighing` - Start weighing process

### Weighing Operations

- `POST /api/weighing/save-weight` - Save weight record
- `GET /api/weighing/history/:vehicle` - Get vehicle history
- `POST /api/weighing/end-batch` - End weighing with shrinkage

### Master Data

- `GET /api/suppliers` - List suppliers
- `GET /api/materials` - List materials
- `GET /api/vehicles` - List vehicles
- `GET /api/drivers` - List drivers

### User Management

- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Role Management

- `GET /api/role` - List roles
- `POST /api/role` - Create role
- `PUT /api/role/:id` - Update role
- `DELETE /api/role/:id` - Delete role

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

| Permission      | Admin | Supervisor | Op.Weighing | Op.Register | Viewer |
| --------------- | ----- | ---------- | ----------- | ----------- | ------ |
| view_dashboard  | ✅    | ✅         | ✅          | ✅          | ✅     |
| view_incoming   | ✅    | ✅         | ❌          | ✅          | ✅     |
| create_incoming | ✅    | ✅         | ❌          | ✅          | ❌     |
| update_incoming | ✅    | ✅         | ❌          | ✅          | ❌     |
| delete_incoming | ✅    | ❌         | ❌          | ❌          | ❌     |
| view_outgoing   | ✅    | ✅         | ❌          | ✅          | ✅     |
| create_outgoing | ✅    | ✅         | ❌          | ✅          | ❌     |
| view_misc       | ✅    | ✅         | ❌          | ✅          | ✅     |
| create_misc     | ✅    | ✅         | ❌          | ✅          | ❌     |
| view_weighing   | ✅    | ✅         | ✅          | ❌          | ✅     |
| create_weighing | ✅    | ✅         | ✅          | ❌          | ❌     |
| update_weighing | ✅    | ✅         | ✅          | ❌          | ❌     |
| delete_weighing | ✅    | ❌         | ❌          | ❌          | ❌     |
| view_users      | ✅    | ✅         | ❌          | ❌          | ❌     |
| create_users    | ✅    | ❌         | ❌          | ❌          | ❌     |
| update_users    | ✅    | ❌         | ❌          | ❌          | ❌     |
| delete_users    | ✅    | ❌         | ❌          | ❌          | ❌     |
| view_reports    | ✅    | ✅         | ❌          | ❌          | ✅     |
| export_reports  | ✅    | ✅         | ❌          | ❌          | ❌     |
| manage_system   | ✅    | ❌         | ❌          | ❌          | ❌     |

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
- `inbound_ticket` - Main transaction records
- `incoming_detail` - Incoming transaction details
- `outgoing_detail` - Outgoing transaction details
- `misc_detail` - Miscellaneous transaction details
- `weigh_in` - Bruto weight records
- `weigh_out` - Tarra weight records with shrinkage
- `suppliers` - Supplier master data
- `materials` - Material master data
- `vehicles` - Vehicle master data
- `drivers` - Driver master data
- `weighbridges` - Weighbridge configuration
- `records` - Weight measurement history
- `audit_logs` - System audit trail
- `sync_queue` - SAP synchronization queue
- `master_sync_status` - Master data sync status

## 🔄 SAP Integration

### Hybrid Verification Strategy

1. **Direct SAP Verification** (1000ms timeout)
2. **Fallback to Queue Processing** (reliability)
3. **Audit Trail Flow**: WBMS → SAP

### Data Ownership

- **WBMS Owns**: Vehicles, Drivers, Weighing Operations, Transaction Records
- **SAP Owns**: Suppliers, Materials (synced via cron jobs)
- **Audit Flow**: WBMS → SAP (fire and forget with queue fallback)
- **State Management**: Multi-level caching with session storage and Zustand persistence

## 🚀 Advanced Features

### Fraud Detection

- Real-time shrinkage monitoring (0.2% threshold)
- Historical pattern analysis
- Automatic threshold alerts with warnings
- Complete audit trail integration
- Weight stability validation

### State Management Architecture

- **Context Layer**: API operations and data fetching
- **Store Layer**: Zustand with persistence and caching
- **Hook Layer**: Integration between context and store
- **Component Layer**: UI components with permission gates

### Reporting & Analytics

- Transaction performance reports
- Shrinkage trend analysis
- Vehicle utilization metrics
- Weight history tracking
- Real-time dashboard monitoring

## 📝 Development Commands

```bash
# Database
npm run migration:run          # Run migrations
npm run migration:revert       # Revert last migration
npm run migration:generate     # Generate new migration
npm run seed                   # Seed initial data
npm run db:setup              # Run migrations + seed

# Development
npm run dev                    # Start dev server with migrations
npm run dev:all               # Dev server + cron jobs
npm run build                  # Build for production with migrations
npm run start                  # Start production server with migrations

# Background Jobs
npm run cron                   # Run SAP sync jobs
npm run start:cron            # Production cron jobs

# TypeORM
npm run build:typeorm         # Build TypeORM configuration
npm run migration:create      # Create new migration
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
