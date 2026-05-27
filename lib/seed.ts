import { db } from '@/lib/db';
import { notices, albums, gallery_images, staff, results, site_settings, admin_users, milestones } from '@/lib/schema';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Seed admin user
  const passwordHash = '$2b$10$Wp8LCYlN9pB6Q1TN79SkueF/TO.zBFbINz8i2dcwYMTMQYUuB.LHq';
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
    { key: 'principal_message_en', value: `Dear Students, Parents, Guardians, and Well-wishers,

It is my extreme privilege and honor to serve as the Principal of Shree Jiveen Shakti Secondary School, Sitabasti, Kanchanpur. Ever since our inception in 2037 BS, our school has undergone massive shifts from a modest rural basic school to a full-fledged government secondary educational institution supporting diverse curriculums in Science, Humanities, and Education.

In alignment with the directives of the Ministry of Education, Nepal, our school has consistently achieved highly competitive results in the Secondary Education Examination (SEE). We recognize that textbook learning alone is incomplete. Hence, we prioritize an active integration of digital literacy, library exercises, physical sports, and cultural festivals which draws inspiration from our rich Nepalese identity.

We are highly grateful to the local government authorities of Punarbas-9, our hard-working faculty members, and the collaborative School Management Committee (SMC) who support our operations. We welcome all parents to maintain open communicative relationships with us to ensure our pupils reach their highest academic heights.

Thank you. Wishing everyone a highly productive and fulfilling academic year.` },
    { key: 'principal_message_np', value: `आदरणीय अभिभावक, शिक्षक, सरोकारवाला तथा प्यारा विद्यार्थी भाइबहिनीहरू,

कञ्चनपुर जिल्लाको पुनर्वास नगरपालिकास्थित श्री जिविन शक्ति माध्यमिक विद्यालयको प्रधानाध्यापकका रूपमा यहाँहरूसँग जोडिन पाउँदा म अत्यन्तै गौरवान्वित छु। वि.सं. २०३७ सालमा सामान्य प्राथमिक पाठशालाको रूपमा स्थापना भएको यो विद्यालय आज क्षेत्रकै उत्कृष्ट सामुदायिक माध्यमिक विद्यालय बन्न सफल भएको छ।

नेपाल सरकारको राष्ट्रिय शिक्षा प्रणाली अनुरूप हामीले माध्यमिक शिक्षा परीक्षा (SEE) मा निरन्तर उत्कृष्ट नतिजा हासिल गर्दै आएका छौँ। हामी केवल परीक्षा उत्तीर्ण गर्ने शैक्षिक कारखाना होइनौँ, अपितु विद्यार्थीमा अन्तरनिहित प्रतिभा प्रस्फुटन गरी देश र समाजप्रति जिम्मेवार नागरिक उत्पादन गर्न समर्पित छौँ।

हामी पुनर्वास नगरपालिका, विद्यालय व्यवस्थापन समिति, शिक्षक अभिभावक संघ, लगनशील शिक्षक-कर्मचारी र सहयोगी हातहरू प्रति हार्दिक आभार प्रकट गर्दछौँ। यहाँहरूको साथ र सहयोग नै हाम्रो उत्प्रेरणाको स्रोत हो। आगामी दिनहरूमा पनि यस्तै सहकार्य र शुभेच्छाको अपेक्षा गर्दछौँ।

धन्यवाद। यहाँहरू सबैको शैक्षिक यात्रा सुखद र सफल रहोस्।` },
    { key: 'announcement_text_en', value: 'Admission Open for Academic Year 2081 BS | SEE Results Published | Annual Sports Day on Ashad 15' },
    { key: 'announcement_text_np', value: 'शैक्षिक वर्ष २०८२ को लागि भर्ना खुला | SEE नतिजा प्रकाशित | वार्षिक खेलकुद दिवस असार १५ मा' },
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

  // Seed milestones
  await db.insert(milestones).values([
    {
      title_en: 'School Establishment',
      title_np: 'विद्यालय स्थापना',
      date_label: '२०३७',
      year_ad: '1980',
      description_en: 'Shree Jiveen Shakti Secondary School was established in Punarbas-9, Sitabasti, Kanchanpur with the mission of providing quality education to the local community.',
      description_np: 'श्री जीवन शक्ति माध्यमिक विद्यालय पुनर्वास-९, सिताबस्ती, कञ्चनपुरमा स्थानीय समुदायलाई गुणस्तरीय शिक्षा प्रदान गर्ने उद्देश्यले स्थापित भएको थियो।',
      display_order: 1,
    },
    {
      title_en: 'Secondary Level Approval',
      title_np: 'माध्यमिक तह स्वीकृति',
      date_label: '२०४५',
      year_ad: '1988',
      description_en: 'The school received official approval to operate secondary level education (Grades 9-10), enabling students to pursue SEE examinations.',
      description_np: 'विद्यालयले माध्यमिक तह (कक्षा ९-१०) सञ्चालन गर्न आधिकारिक स्वीकृति प्राप्त गर्यो, जसले विद्यार्थीहरूलाई SEE परीक्षा दिन सक्षम बनायो।',
      display_order: 2,
    },
    {
      title_en: 'Higher Secondary Program Launch',
      title_np: 'उच्च माध्यमिक कार्यक्रम सुरुवात',
      date_label: '२०५५',
      year_ad: '1998',
      description_en: 'Introduced higher secondary education (Grades 11-12) with streams in Science, Management, and Humanities to meet diverse student interests.',
      description_np: 'विविध विद्यार्थी रुचिहरू पूरा गर्न विज्ञान, व्यवस्थापन र मानविकी संकायहरू सहित उच्च माध्यमिक शिक्षा (कक्षा ११-१२) सुरु गरियो।',
      display_order: 3,
    },
    {
      title_en: 'Computer Lab Establishment',
      title_np: 'कम्प्युटर प्रयोगशाला स्थापना',
      date_label: '२०६२',
      year_ad: '2005',
      description_en: 'Established a fully-equipped computer laboratory with internet connectivity, introducing ICT education to students from Grade 4 onwards.',
      description_np: 'इन्टरनेट जडान सहितको पूर्ण सुविधायुक्त कम्प्युटर प्रयोगशाला स्थापना गरियो, जसले कक्षा ४ बाट विद्यार्थीलाई ICT शिक्षा प्रदान गर्यो।',
      display_order: 4,
    },
    {
      title_en: 'Science Lab Modernization',
      title_np: 'विज्ञान प्रयोगशाला आधुनिकीकरण',
      date_label: '२०७२',
      year_ad: '2015',
      description_en: 'Modernized science laboratories with state-of-the-art equipment for Physics, Chemistry, Biology, and Environmental Science practical learning.',
      description_np: 'भौतिक विज्ञान, रसायन विज्ञान, जीव विज्ञान र वातावरणीय विज्ञान प्रयोगात्मक शिक्षाको लागि अत्याधुनिक उपकरणहरू सहित विज्ञान प्रयोगशालाहरूको आधुनिकीकरण गरियो।',
      display_order: 5,
    },
    {
      title_en: 'Digital Records & Online Platform Launch',
      title_np: 'डिजिटल रेकर्ड र अनलाइन प्लेटफर्म सुरुवात',
      date_label: '२०८१',
      year_ad: '2024',
      description_en: 'Implemented a comprehensive digital school management system with online results, e-notices, student records, and a public website to enhance transparency and parent engagement.',
      description_np: 'अभिभावक संलग्नता र पारदर्शिता बढाउन अनलाइन नतिजा, ई-सूचना, विद्यार्थी रेकर्ड र सार्वजनिक वेबसाइट सहितको व्यापक डिजिटल विद्यालय व्यवस्थापन प्रणाली लागू गरियो।',
      display_order: 6,
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
