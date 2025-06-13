// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

import { initializeDatabase } from '../lib/db';

async function main() {
  try {
    console.log('Initializing database...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);

    await initializeDatabase();
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
