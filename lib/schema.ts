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
  is_active: boolean('is_active').notNull().default(true),
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
