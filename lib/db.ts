import dns from 'node:dns';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
dns.setDefaultResultOrder('ipv4first');

// Use connection pooling via Supabase's Postgres connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  keepAlive: true,
});

export const db = drizzle(pool, {
  schema,
  logger: false,
});
export type DB = typeof db;
