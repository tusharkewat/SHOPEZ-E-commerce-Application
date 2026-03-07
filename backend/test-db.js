const { Client } = require('pg');

async function test(connStr) {
  console.log(`Testing: ${connStr}`);
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    console.log('SUCCESS!');
    await client.end();
  } catch (err) {
    console.log('ERROR:', err.message);
  }
}

async function run() {
  await test('postgresql://postgres:%5B4mKLxtxDXXv4KoQ44%5D@db.bohqriukxtrjwvhqhdhc.supabase.co:5432/postgres');
  await test('postgresql://postgres:4mKLxtxDXXv4KoQ44@db.bohqriukxtrjwvhqhdhc.supabase.co:5432/postgres');
  // test pooler ports if required, though the host for pooler is usually different, but let's see what pg error is.
}

run();
