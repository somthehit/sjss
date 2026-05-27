import { pgTable, text, integer, boolean, timestamp, serial, jsonb, varchar } from 'drizzle-orm/pg-core';

// ─── Notices ────────────────────────────────────────────────────────────────
export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_np: text('title_np').notNull(),
  content_en: text('content_en').notNull(),
  content_np: text('content_np').notNull(),
  category: varchar('category', { length: 50 }).notNull().default('general'),
  is_pinned: boolean('is_pinned').notNull().default(false),
  is_published: boolean('is_published').notNull().default(true),
  pdf_url: text('pdf_url'),
  published_at: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Hero Slides ─────────────────────────────────────────────────────────────
export const hero_slides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  image_url: text('image_url').notNull(),
  caption: text('caption'),
  is_active: boolean('is_active').notNull().default(true),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Events / Calendar ───────────────────────────────────────────────────────
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_np: text('title_np').notNull(),
  date_bs: varchar('date_bs', { length: 50 }).notNull(),
  date_en: varchar('date_en', { length: 50 }).notNull(),
  description_en: text('description_en'),
  description_np: text('description_np'),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Gallery Albums ──────────────────────────────────────────────────────────
export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_np: text('title_np').notNull(),
  description_en: text('description_en'),
  description_np: text('description_np'),
  cover_url: text('cover_url').notNull(),
  is_published: boolean('is_published').notNull().default(true),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const gallery_images = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  album_id: integer('album_id').notNull().references(() => albums.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption_en: text('caption_en'),
  caption_np: text('caption_np'),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Staff / Faculty ─────────────────────────────────────────────────────────
export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  name_en: text('name_en').notNull(),
  name_np: text('name_np').notNull(),
  role_en: text('role_en').notNull(),
  role_np: text('role_np').notNull(),
  department: varchar('department', { length: 80 }).notNull().default('general'),
  qualification: text('qualification'),
  photo_url: text('photo_url'),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Admissions ──────────────────────────────────────────────────────────────
export const admissions = pgTable('admissions', {
  id: serial('id').primaryKey(),
  student_name: text('student_name').notNull(),
  guardian_name: text('guardian_name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: text('email'),
  grade_applying: varchar('grade_applying', { length: 10 }).notNull(),
  dob: text('dob').notNull(),
  address: text('address').notNull(),
  previous_school: text('previous_school'),
  message: text('message'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  submitted_at: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Results ─────────────────────────────────────────────────────────────────
export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  roll_no: varchar('roll_no', { length: 30 }).notNull(),
  student_name: text('student_name').notNull(),
  grade: varchar('grade', { length: 10 }).notNull(),
  academic_year: varchar('academic_year', { length: 20 }).notNull(),
  exam_type: varchar('exam_type', { length: 30 }).notNull().default('terminal'),
  subjects: jsonb('subjects').notNull().default('{}'),
  total_marks: integer('total_marks'),
  obtained_marks: integer('obtained_marks'),
  percentage: text('percentage'),
  division: varchar('division', { length: 30 }),
  remarks: text('remarks'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Site Settings ────────────────────────────────────────────────────────────
export const site_settings = pgTable('site_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Admin Users ──────────────────────────────────────────────────────────────
export const admin_users = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('admin'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Calendar Wall Chart ──────────────────────────────────────────────────────
export const calendar_data = pgTable('calendar_data', {
  id: serial('id').primaryKey(),
  academic_year: varchar('academic_year', { length: 10 }).notNull().default('२०८३'),
  month_name: varchar('month_name', { length: 30 }).notNull(),
  month_index: integer('month_index').notNull(),
  days: jsonb('days').notNull().default('[]'),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Contact Messages ────────────────────────────────────────────────────────
export const contact_messages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  sender_name: text('sender_name').notNull(),
  sender_email: text('sender_email').notNull(),
  sender_phone: varchar('sender_phone', { length: 30 }),
  message: text('message').notNull(),
  is_read: boolean('is_read').notNull().default(false),
  is_replied: boolean('is_replied').notNull().default(false),
  admin_notes: text('admin_notes'),
  submitted_at: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Academic Programs ────────────────────────────────────────────────────────
export const academic_programs = pgTable('academic_programs', {
  id: serial('id').primaryKey(),
  level_en: varchar('level_en', { length: 50 }).notNull(), // e.g. "Primary (Grades 1-8)"
  level_np: varchar('level_np', { length: 50 }).notNull(),
  description_en: text('description_en').notNull(),
  description_np: text('description_np').notNull(),
  subjects: jsonb('subjects').notNull().default('[]'),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
// ─── Historical Milestones ────────────────────────────────────────────────────
export const milestones = pgTable('milestones', {
  id: serial('id').primaryKey(),
  title_en: text('title_en').notNull(),
  title_np: text('title_np').notNull(),
  date_label: varchar('date_label', { length: 50 }).notNull(),
  year_ad: varchar('year_ad', { length: 20 }),
  description_en: text('description_en').notNull(),
  description_np: text('description_np').notNull(),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Students ────────────────────────────────────────────────────────────────
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  reg_no: varchar('reg_no', { length: 30 }).notNull().unique(),       // Admission / Registration Number
  student_name_en: text('student_name_en').notNull(),
  student_name_np: text('student_name_np').notNull().default(''),
  dob: varchar('dob', { length: 30 }),                               // Date of Birth (BS or AD)
  gender: varchar('gender', { length: 10 }).notNull().default('Male'), // Male | Female | Other
  religion: varchar('religion', { length: 50 }),
  ethnicity: varchar('ethnicity', { length: 50 }),
  guardian_name: text('guardian_name').notNull().default(''),
  guardian_relation: varchar('guardian_relation', { length: 30 }),   // Father | Mother | Guardian
  contact_no: varchar('contact_no', { length: 20 }),
  address: text('address'),
  current_class: varchar('current_class', { length: 20 }).notNull(),  // "1", "2", ... "10", "11", "12"
  current_section: varchar('current_section', { length: 5 }).default('A'),
  roll_no: varchar('roll_no', { length: 20 }),
  academic_year: varchar('academic_year', { length: 10 }).notNull(),  // e.g. "2083"
  status: varchar('status', { length: 20 }).notNull().default('Active'), // Active | Passed Out | Dropped | Transferred
  photo_url: text('photo_url'),
  previous_school: text('previous_school'),
  admission_date: varchar('admission_date', { length: 30 }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Student Promotion History ────────────────────────────────────────────────
// Tracks each time a student is promoted (or held back) for audit trail
export const student_promotions = pgTable('student_promotions', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  from_class: varchar('from_class', { length: 20 }).notNull(),
  to_class: varchar('to_class', { length: 20 }).notNull(),
  from_academic_year: varchar('from_academic_year', { length: 10 }).notNull(),
  to_academic_year: varchar('to_academic_year', { length: 10 }).notNull(),
  result_id: integer('result_id').references(() => results.id),
  promotion_type: varchar('promotion_type', { length: 20 }).notNull().default('auto'), // auto | manual
  remarks: text('remarks'),
  promoted_at: timestamp('promoted_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Types (inferred) ────────────────────────────────────────────────────────
export type Notice = typeof notices.$inferSelect;
export type NewNotice = typeof notices.$inferInsert;
export type Album = typeof albums.$inferSelect;
export type GalleryImage = typeof gallery_images.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type Admission = typeof admissions.$inferSelect;
export type NewAdmission = typeof admissions.$inferInsert;
export type Result = typeof results.$inferSelect;
export type SiteSetting = typeof site_settings.$inferSelect;
export type HeroSlide = typeof hero_slides.$inferSelect;
export type NewHeroSlide = typeof hero_slides.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type CalendarMonth = typeof calendar_data.$inferSelect;
export type ContactMessage = typeof contact_messages.$inferSelect;
export type NewContactMessage = typeof contact_messages.$inferInsert;
export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type StudentPromotion = typeof student_promotions.$inferSelect;

