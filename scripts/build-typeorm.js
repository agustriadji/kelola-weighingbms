const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building TypeORM configuration...');

try {
  // Ensure dist directory exists
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Build TypeORM
  execSync('tsc -p tsconfig.typeorm.json', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  // Verify required files exist
  const requiredFiles = [
    'dist/database/typeorm.config.js',
    'dist/entities'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file/directory not found: ${file}`);
    }
  }

  console.log('✅ TypeORM build completed successfully');
} catch (error) {
  console.error('❌ TypeORM build failed:', error.message);
  process.exit(1);
}