import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { pool } from './config/db';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  // Fail fast if the database is unreachable
  try {
    await pool.query('SELECT 1');
    // eslint-disable-next-line no-console
    console.log('✅ Connected to PostgreSQL');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Could not connect to PostgreSQL:', err);
    process.exit(1);
  }

  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 API listening on http://localhost:${PORT}`);
  });
}

main();
