const { execSync } = require('child_process');

console.log('🚀 Starting database seeding...');

try {
  // Run the seeder using tsx
  execSync('npx tsx src/database/seeds/index.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Database seeding completed!');
} catch (error) {
  console.error('❌ Database seeding failed:', error.message);
  process.exit(1);
}