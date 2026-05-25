const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database successfully.");

    const query = `
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title_en TEXT NOT NULL,
        title_np TEXT NOT NULL,
        date_bs VARCHAR(50) NOT NULL,
        date_en VARCHAR(50) NOT NULL,
        description_en TEXT,
        description_np TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    await client.query(query);
    console.log("Created 'events' table successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

run();
