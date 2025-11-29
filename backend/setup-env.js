import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
  console.log('🔧 Setting up backend environment variables...\n');

  const envPath = path.join(__dirname, '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('Please provide the following information:\n');

  const port = await question('Backend port (default: 5000): ') || '5000';
  const dbHost = await question('PostgreSQL host (default: localhost): ') || 'localhost';
  const dbPort = await question('PostgreSQL port (default: 5432): ') || '5432';
  const dbName = await question('Database name (default: cmis_db): ') || 'cmis_db';
  const dbUser = await question('PostgreSQL user (default: postgres): ') || 'postgres';
  const dbPassword = await question('PostgreSQL password: ');
  
  if (!dbPassword) {
    console.log('⚠️  Warning: Database password is empty. Please update .env file manually.');
  }

  const jwtSecret = await question('JWT secret (press Enter for default): ') || 'cmis_super_secret_jwt_key_change_in_production_2024';
  const corsOrigin = await question('CORS origin (default: http://localhost:3000): ') || 'http://localhost:3000';

  const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}

# JWT Secret Key (Change this to a random string in production)
JWT_SECRET=${jwtSecret}

# CORS Configuration
CORS_ORIGIN=${corsOrigin}
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file created successfully!');
  console.log(`📁 Location: ${envPath}\n`);
  console.log('Next steps:');
  console.log('1. Verify the database credentials in .env');
  console.log('2. Run: npm run migrate');
  console.log('3. (Optional) Run: npm run seed');
  console.log('4. Start server: npm run dev\n');

  rl.close();
}

setupEnv().catch(console.error);


