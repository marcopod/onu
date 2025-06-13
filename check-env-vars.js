require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL value:', process.env.DATABASE_URL.substring(0, 50) + '...');
}

if (process.env.POSTGRES_URL) {
  console.log('POSTGRES_URL value:', process.env.POSTGRES_URL.substring(0, 50) + '...');
}

// Test the logic from auth.ts
const hasPostgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const isLocalhost = hasPostgresUrl && (
  hasPostgresUrl.includes('localhost') || 
  hasPostgresUrl.includes('127.0.0.1')
);

console.log('\nLogic Test:');
console.log('hasPostgresUrl:', !!hasPostgresUrl);
console.log('isLocalhost:', isLocalhost);

if (hasPostgresUrl && !isLocalhost) {
  console.log('✅ Should use REAL database');
} else if (isLocalhost) {
  console.log('⚠️ Should use MOCK database (localhost)');
} else {
  console.log('❌ Should use MOCK database (no URL)');
}
