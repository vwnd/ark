import { config } from 'dotenv';
import * as fs from 'fs';

const testEnvFile = '.env.test';
const envFile = '.env';

// Check for env file.
if (!fs.existsSync(envFile)) {
  throw new Error('.env file not found.');
}

// Check for test env file.
if (!fs.existsSync(testEnvFile)) {
  throw new Error('.env.test file not found.');
}

// Override enviroment with test env file.
config({ path: envFile });
config({ path: testEnvFile, override: true });
