require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
    console.log('Environment variables loaded from .env.local');

    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    console.log('Database connection successful!');
    console.log('Test result:', result.rows);

    // Test table creation
    await sql`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Test table created successfully');

    // Test insert
    await sql`INSERT INTO test_table (name) VALUES ('test-connection')`;
    console.log('Test data inserted');

    // Test select
    const selectResult = await sql`SELECT * FROM test_table WHERE name = 'test-connection'`;
    console.log('Test data retrieved:', selectResult.rows);

    // Clean up
    await sql`DROP TABLE IF EXISTS test_table`;
    console.log('Test table cleaned up');

    console.log('✅ Database connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
