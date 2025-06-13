require('dotenv').config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

async function simpleCheck() {
  try {
    const result = await sql`SELECT email FROM users WHERE email = 'test12345@test.com'`;
    console.log('User exists:', result.rows.length > 0);
    if (result.rows.length > 0) {
      console.log('✅ Registration successful!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

simpleCheck();
