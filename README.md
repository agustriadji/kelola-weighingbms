# Kelola Weighing BMS
Next.js Weighing Bridge Management System

## Features
- 🔐 Login System with IndexedDB storage
- 👥 User Management
- ⚖️ Weighing Display Interface
- 📊 Vehicle & Tarra History
- 🎨 Responsive UI with Tailwind CSS

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### Docker Development

1. Run with Docker Compose (Development):
```bash
docker-compose -f docker-compose.dev.yml up --build
```

2. Run in background:
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

3. Stop services:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Docker Production

1. Build and run production:
```bash
docker-compose up --build
```

2. Run in background:
```bash
docker-compose up -d --build
```

3. Stop services:
```bash
docker-compose down
```

## Project Structure
```
src/
├── app/
│   ├── dashboard/     # Dashboard page
│   ├── login/         # Login page
│   └── user/          # User management
├── components/
│   ├── WeighingDisplay.tsx
│   ├── Footer.tsx
│   └── ...
├── utils/
│   └── storage.ts     # IndexedDB utilities
└── types/
    └── ...
```

## Default Login
- Access login page at `/login`
- Fill username, password, and select filter type
- Data stored in IndexedDB

## Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- IndexedDB
- Zustand
- Docker

## Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose -f docker-compose.dev.yml up --build` | Development mode |
| `docker-compose up --build` | Production mode |
| `docker-compose -f docker-compose.dev.yml down` | Stop dev services |
| `docker-compose down` | Stop prod services |