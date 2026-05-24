import { db } from '@/lib/db';
import { notices, albums, gallery_images, staff, results, site_settings, admin_users } from '@/lib/schema';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('Admin@4sjss', 10);
  await db.insert(admin_users).values([
    {
      email: 'admin@sjsss.edu.np',
      password_hash: passwordHash,
      name: 'Admin',
      role: 'admin',
    },
  ]).onConflictDoNothing();

  // Seed site settings
  await db.insert(site_settings).values([
    { key: 'school_motto_en', value: 'Knowledge, Character, Service' },
    { key: 'school_motto_np', value: 'ज्ञान, चरित्र, सेवा' },
    { key: 'principal_message_en', value: 'Welcome to Shree Jiveen Shakti Secondary School. Our mission is to nurture young minds with quality education rooted in Nepali values and global perspectives. We believe every child has immense potential, and our dedicated faculty strives to help each student realize their full capabilities.' },
    { key: 'principal_message_np', value: 'श्री जीवन शक्ति माध्यमिक विद्यालयमा स्वागत छ। हाम्रो लक्ष्य नेपाली मूल्य र वैश्विक दृष्टिकोणमा आधारित गुणस्तरीय शिक्षाद्वारा युवा मनहरूलाई पोषण दिनु हो।' },
    { key: 'announcement_text_en', value: 'Admission Open for Academic Year 2081 BS | SEE Results Published | Annual Sports Day on Ashad 15' },
    { key: 'announcement_text_np', value: 'शैक्षिक वर्ष २०८१ को लागि भर्ना खुला | SEE नतिजा प्रकाशित | वार्षिक खेलकुद दिवस असार १५ मा' },
    { key: 'total_students', value: '847' },
    { key: 'total_staff', value: '42' },
    { key: 'established_year_bs', value: '2037' },
    { key: 'phone', value: '+977-099-420XXX' },
    { key: 'email', value: 'info@sjss.edu.np' },
    { key: 'address_en', value: 'Punarbas-9, Sitabasti, Kanchanpur, Nepal' },
    { key: 'address_np', value: 'पुनर्बास-९, सीतावस्ती, कञ्चनपुर, नेपाल' },
    { key: 'emis', value: 'EMIS-00000' },
  ]).onConflictDoNothing();

  // Seed notices
  await db.insert(notices).values([
    {
      title_en: 'Admission Open for Grade 1-10 (Academic Year 2081 BS)',
      title_np: 'कक्षा १-१० को लागि भर्ना खुला (शैक्षिक वर्ष २०८१)',
      content_en: 'Shree Jiveen Shakti Secondary School is pleased to announce that admissions are now open for the academic year 2081 BS for all classes from Grade 1 to Grade 10. Interested candidates are requested to visit the school office with relevant documents.',
      content_np: 'श्री जीवन शक्ति माध्यमिक विद्यालयले सूचित गर्दछ कि शैक्षिक वर्ष २०८१ को लागि कक्षा १ देखि १० सम्मका सबै कक्षाहरूमा भर्ना खुला भएको छ।',
      category: 'admission',
      is_pinned: true,
    },
    {
      title_en: 'SEE 2080 Results - Check Your Result Now',
      title_np: 'SEE २०८० नतिजा - आफ्नो नतिजा अहिले हेर्नुहोस्',
      content_en: 'The SEE (Secondary Education Examination) 2080 results have been published. Students can check their results using their roll number on the Results page.',
      content_np: 'SEE (माध्यमिक शिक्षा परीक्षा) २०८० को नतिजा प्रकाशित भएको छ। विद्यार्थीहरूले नतिजा पृष्ठमा आफ्नो क्रमांक प्रयोग गरेर नतिजा हेर्न सक्नुहुन्छ।',
      category: 'results',
      is_pinned: true,
    },
    {
      title_en: 'Annual Sports Day - Ashad 15, 2081',
      title_np: 'वार्षिक खेलकुद दिवस - असार १५, २०८१',
      content_en: 'The annual sports day event will be held on Ashad 15, 2081 at the school grounds. All students are encouraged to participate in the various athletic and cultural events.',
      content_np: 'वार्षिक खेलकुद दिवस असार १५, २०८१ मा विद्यालय मैदानमा आयोजना गरिनेछ। सबै विद्यार्थीहरूलाई विभिन्न खेलकुद र सांस्कृतिक कार्यक्रमहरूमा सहभागी हुन प्रोत्साहित गरिन्छ।',
      category: 'event',
    },
    {
      title_en: 'Parent-Teacher Meeting - Jestha 25',
      title_np: 'अभिभावक-शिक्षक बैठक - जेठ २५',
      content_en: 'A parent-teacher meeting is scheduled for Jestha 25, 2081. All parents are requested to attend and discuss their children\'s progress with the respective subject teachers.',
      content_np: 'जेठ २५, २०८१ मा अभिभावक-शिक्षक बैठक निर्धारित गरिएको छ। सबै अभिभावकहरूलाई आफ्ना बालबालिकाको प्रगतिबारे सम्बन्धित विषय शिक्षकहरूसँग छलफल गर्न उपस्थित हुन अनुरोध गरिन्छ।',
      category: 'meeting',
    },
    {
      title_en: 'School Closed for Dashain Festival (Ashwin 28 - Kartik 5)',
      title_np: 'दशैँ बिदा - असोज २८ देखि कार्तिक ५ सम्म',
      content_en: 'The school will remain closed from Ashwin 28 to Kartik 5, 2081 for the Dashain festival. Classes will resume from Kartik 6.',
      content_np: 'दशैँ चाडपर्वको अवसरमा विद्यालय असोज २८ देखि कार्तिक ५, २०८१ सम्म बन्द रहनेछ। कार्तिक ६ देखि कक्षा सुरु हुनेछन्।',
      category: 'holiday',
    },
  ]).onConflictDoNothing();

  // Seed staff
  await db.insert(staff).values([
    {
      name_en: 'Prayag Raj Upadhyaya',
      name_np: 'प्रयाग राज उपाध्याय',
      role_en: 'Principal',
      role_np: 'प्रधानाध्यापक',
      department: 'administration',
      qualification: 'M.Ed. (Education Management)',
      display_order: 1,
    },
    {
      name_en: 'Ram Prasad Sharma',
      name_np: 'राम प्रसाद शर्मा',
      role_en: 'Head of Science Department',
      role_np: 'विज्ञान विभाग प्रमुख',
      department: 'science',
      qualification: 'B.Sc., B.Ed.',
      display_order: 2,
    },
    {
      name_en: 'Sita Devi Joshi',
      name_np: 'सीता देवी जोशी',
      role_en: 'Mathematics Teacher',
      role_np: 'गणित शिक्षिका',
      department: 'science',
      qualification: 'B.Sc. (Mathematics), B.Ed.',
      display_order: 3,
    },
    {
      name_en: 'Hari Bahadur Bist',
      name_np: 'हरि बहादुर बिष्ट',
      role_en: 'Nepali & Social Studies Teacher',
      role_np: 'नेपाली र सामाजिक शिक्षक',
      department: 'arts',
      qualification: 'M.A. (Nepali), B.Ed.',
      display_order: 4,
    },
    {
      name_en: 'Kamala Thapa',
      name_np: 'कमला थापा',
      role_en: 'English Teacher',
      role_np: 'अंग्रेजी शिक्षिका',
      department: 'arts',
      qualification: 'M.A. (English), B.Ed.',
      display_order: 5,
    },
    {
      name_en: 'Gopal Krishna Pandey',
      name_np: 'गोपाल कृष्ण पाण्डेय',
      role_en: 'Computer Science Teacher',
      role_np: 'कम्प्युटर विज्ञान शिक्षक',
      department: 'science',
      qualification: 'B.C.S., B.Ed.',
      display_order: 6,
    },
  ]).onConflictDoNothing();

  // Seed albums
  const [album1, album2, album3] = await db.insert(albums).values([
    {
      title_en: 'Annual Day Celebration 2080',
      title_np: 'वार्षिक दिवस समारोह २०८०',
      description_en: 'Highlights from our grand annual day celebration',
      description_np: 'हाम्रो वार्षिक दिवसको विशेष क्षण',
      cover_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800',
      display_order: 1,
    },
    {
      title_en: 'Science Exhibition 2080',
      title_np: 'विज्ञान प्रदर्शनी २०८०',
      description_en: 'Students showcase innovative science projects',
      description_np: 'विद्यार्थीहरूले नवीन विज्ञान परियोजनाहरू प्रदर्शन गर्दछन्',
      cover_url: 'https://images.unsplash.com/photo-1532094349884-543559be716d?w=800',
      display_order: 2,
    },
    {
      title_en: 'Sports Day 2080',
      title_np: 'खेलकुद दिवस २०८०',
      description_en: 'Our annual sports competition',
      description_np: 'हाम्रो वार्षिक खेलकुद प्रतियोगिता',
      cover_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      display_order: 3,
    },
  ]).returning();

  // Seed results
  await db.insert(results).values([
    {
      roll_no: 'SEE-2080-001',
      student_name: 'Aarav Sharma',
      grade: '10',
      academic_year: '2080',
      exam_type: 'SEE',
      subjects: { nepali: 87, english: 79, math: 92, science: 88, social: 83, opt_math: 91 },
      total_marks: 600,
      obtained_marks: 520,
      percentage: '86.67',
      division: 'Distinction',
    },
    {
      roll_no: 'SEE-2080-002',
      student_name: 'Priya Thapa',
      grade: '10',
      academic_year: '2080',
      exam_type: 'SEE',
      subjects: { nepali: 75, english: 82, math: 78, science: 80, social: 77, opt_math: 85 },
      total_marks: 600,
      obtained_marks: 477,
      percentage: '79.50',
      division: 'First Division',
    },
  ]).onConflictDoNothing();

  console.log('✅ Database seeded successfully!');
}
