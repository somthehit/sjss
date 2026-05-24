import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { db } from '../lib/db';
import { hero_slides } from '../lib/schema';

const images = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800',
  'https://images.unsplash.com/photo-1427504494785-3a9a247ce261?q=80&w=800',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800'
];

async function seed() {
  console.log('Seeding hero slides...');
  for (let i = 0; i < images.length; i++) {
    await db.insert(hero_slides).values({
      image_url: images[i],
      display_order: i,
      is_active: true,
    });
  }
  console.log('Done!');
  process.exit(0);
}

seed().catch(console.error);
