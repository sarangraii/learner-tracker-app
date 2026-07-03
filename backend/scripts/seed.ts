import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });

  const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
  const sql = fs.readFileSync(seedPath, 'utf-8');

  console.log('Running seed: db/seed.sql');
  try {
    await pool.query(sql);
    console.log('✅ Seed data inserted successfully.');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
