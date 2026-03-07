const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:4mKLxtxDXXv4KoQ44@db.bohqriukxtrjwvhqhdhc.supabase.co:5432/postgres' });
  try {
    await client.connect();
    console.log('Connected directly to db!');
    const sql = fs.readFileSync('setup_db.sql', 'utf8');
    await client.query(sql);
    console.log('Tables created successfully via standard SQL!');
  } catch (err) {
    console.log('ERROR:', err);
  } finally {
    await client.end();
  }
}

run();
