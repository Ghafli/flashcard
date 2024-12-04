const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

console.log('🔍 Verifying project setup...\n');

// Check required files
const requiredFiles = [
  '.env.local',
  'next.config.js',
  'package.json',
  'tsconfig.json'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    console.log(`${colors.green}✓${colors.reset} ${file} exists`);
  } else {
    if (file === '.env.local') {
      console.log(`${colors.yellow}⚠${colors.reset} ${file} missing - please create from .env.example`);
    } else {
      console.log(`${colors.red}✗${colors.reset} ${file} missing`);
    }
  }
});

// Check Node.js version
console.log('\n📦 Checking Node.js version...');
const nodeVersion = process.version;
const requiredNodeVersion = 'v16';
if (nodeVersion.startsWith(requiredNodeVersion) || nodeVersion > requiredNodeVersion) {
  console.log(`${colors.green}✓${colors.reset} Node.js version ${nodeVersion} (meets requirements)`);
} else {
  console.log(`${colors.red}✗${colors.reset} Node.js version ${nodeVersion} (requires ${requiredNodeVersion} or higher)`);
}

// Check npm dependencies
console.log('\n📦 Checking npm dependencies...');
try {
  const missingDeps = execSync('npm ls', { stdio: ['pipe', 'pipe', 'pipe'] });
  console.log(`${colors.green}✓${colors.reset} All dependencies are installed correctly`);
} catch (error) {
  console.log(`${colors.yellow}⚠${colors.reset} Some dependencies might be missing. Run 'npm install'`);
}

// Check MongoDB connection
console.log('\n🗄️ Checking MongoDB configuration...');
if (process.env.MONGODB_URI) {
  console.log(`${colors.green}✓${colors.reset} MongoDB URI is configured`);
} else {
  console.log(`${colors.red}✗${colors.reset} MongoDB URI is not configured in .env.local`);
}

// Check build configuration
console.log('\n🏗️ Checking build configuration...');
try {
  const nextConfig = require(path.join(process.cwd(), 'next.config.js'));
  if (nextConfig.output === 'export') {
    console.log(`${colors.green}✓${colors.reset} Static export is configured`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} Static export not configured in next.config.js`);
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Error reading next.config.js`);
}

// Final summary
console.log('\n📋 Setup verification complete!');
console.log('Run the following commands to start development:');
console.log('1. npm install     (if there are missing dependencies)');
console.log('2. npm run dev     (to start development server)');
console.log('3. npm run build   (to create production build)');
console.log('4. npm run deploy  (to deploy to GitHub Pages)\n');
