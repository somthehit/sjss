const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    // Clear existing events
    await client.query("DELETE FROM events");
    console.log("Cleared existing events.");

    const seedQuery = `
      INSERT INTO events (title_en, title_np, date_bs, date_en, description_en, description_np, display_order)
      VALUES 
      (
        'Parent-Teacher Meeting',
        'अभिभावक-शिक्षक बैठक',
        'जेठ २५, २०८१',
        '2025-06-08',
        'First parent-teacher interaction to discuss student progress, attendance, and upcoming term plans.',
        'विद्यार्थीको प्रगति, उपस्थिति र आगामी शैक्षिक योजनाहरूका बारेमा छलफल गर्न पहिलो अभिभावक-शिक्षक बैठक।',
        1
      ),
      (
        'Annual Sports Day',
        'वार्षिक खेलकुद दिवस',
        'असार १५, २०८१',
        '2025-06-28',
        'Exciting athletic tracks, high jumps, and group sports competitions followed by certificate distribution.',
        'विभिन्न खेलकुद प्रतियोगिता, दौड र पुरस्कार वितरण समारोह सहितको भव्य वार्षिक खेलकुद दिवस।',
        2
      ),
      (
        'First Terminal Exam Begins',
        'प्रथम टर्मिनल परीक्षा शुरु',
        'साउन ५, २०८१',
        '2025-07-20',
        'First terminal examinations for Grades 1 to 10. Students must maintain 75% attendance to qualify.',
        'कक्षा १ देखि १० सम्मको प्रथम त्रैमासिक परीक्षा सुरु। परीक्षामा सामेल हुन ७५% उपस्थिति अनिवार्य छ।',
        3
      ),
      (
        'Independence Day Celebration',
        'स्वतन्त्रता दिवस उत्सव',
        'भाद्र १, २०८१',
        '2025-08-17',
        'Cultural dance, patriotic songs, and essay writing competitions organized by the students.',
        'विद्यार्थीहरूद्वारा आयोजित सांस्कृतिक नृत्य, राष्ट्रिय गीत प्रस्तुति र निबन्ध लेखन प्रतियोगिता।',
        4
      ),
      (
        'Dashain Holidays Begin',
        'दशैँ बिदा शुरु',
        'असोज २८, २०८१',
        '2025-10-14',
        'School will remain closed for the auspicious occasion of Vijaya Dashami and Deepawali festivals.',
        'विजया दशमी र दीपावलीको पावन अवसरमा विद्यालयमा दिइने पर्व बिदा सुरु।',
        5
      );
    `;

    await client.query(seedQuery);
    console.log("Successfully seeded 5 events from the first image!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.end();
  }
}

run();
