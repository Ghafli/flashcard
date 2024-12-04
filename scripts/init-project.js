const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}🚀 Initializing Flashcard Project${colors.reset}\n`);

async function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function initProject() {
  try {
    // 1. Check and install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Dependencies installed\n`);

    // 2. Set up environment variables
    console.log('🔧 Setting up environment variables...');
    const envExample = path.join(process.cwd(), '.env.example');
    const envLocal = path.join(process.cwd(), '.env.local');

    if (!fs.existsSync(envLocal)) {
      const mongoUri = await question('Enter MongoDB URI (or press Enter for default): ');
      const defaultUri = 'mongodb://localhost:27017/flashcard';
      
      const nextAuthSecret = require('crypto').randomBytes(32).toString('hex');
      const nextAuthUrl = await question('Enter NextAuth URL (or press Enter for default): ');
      const defaultUrl = 'http://localhost:3000';

      const envContent = `# Database
MONGODB_URI=${mongoUri || defaultUri}

# Authentication
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=${nextAuthUrl || defaultUrl}

# Optional: Analytics
NEXT_PUBLIC_GA_ID=

# Environment
NODE_ENV=development`;

      fs.writeFileSync(envLocal, envContent);
      console.log(`${colors.green}✓${colors.reset} Environment variables configured\n`);
    } else {
      console.log(`${colors.yellow}!${colors.reset} .env.local already exists, skipping...\n`);
    }

    // 3. Initialize Git hooks
    console.log('🔄 Setting up Git hooks...');
    execSync('npm run prepare', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Git hooks initialized\n`);

    // 4. Build the project
    console.log('🏗️ Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Project built successfully\n`);

    // 5. Run tests
    console.log('🧪 Running tests...');
    execSync('npm test', { stdio: 'inherit' });
    console.log(`${colors.green}✓${colors.reset} Tests completed\n`);

    // 6. Final verification
    console.log('🔍 Running setup verification...');
    execSync('npm run verify', { stdio: 'inherit' });

    console.log(`\n${colors.green}✨ Project initialization complete!${colors.reset}\n`);
    console.log('Next steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Begin development!\n');

  } catch (error) {
    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

initProject();
