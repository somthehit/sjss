import { config } from 'dotenv';
import { seedDatabase } from '../lib/seed';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function main() {
  try {
    await seedDatabase();
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
