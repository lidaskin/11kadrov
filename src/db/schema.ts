import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Registered users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin credentials table for password-authenticated administrator access
export const adminCredentials = pgTable('admin_credentials', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admin login attempt audit logs
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  action: text('action').notNull(),
  ipAddress: text('ip_address'),
  success: boolean('success').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Festival competition applications received via mailer and form
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  externalId: text('external_id').unique(),
  authorName: text('author_name').notNull(),
  birthDate: text('birth_date'),
  age: integer('age'),
  city: text('city'),
  organization: text('organization'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  telegram: text('telegram'),
  workTitle: text('work_title').notNull(),
  nominationId: text('nomination_id').notNull(),
  nominationTitle: text('nomination_title').notNull(),
  duration: text('duration'),
  description: text('description'),
  link: text('link').notNull(),
  technique: text('technique'),
  consent: boolean('consent').default(true).notNull(),
  status: text('status').default('pending').notNull(), // pending, approved, rejected, reviewing
  emailSent: boolean('email_sent').default(false).notNull(),
  emailError: text('email_error'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Email delivery logs (mailer audit)
export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  recipient: text('recipient').notNull(),
  subject: text('subject').notNull(),
  applicationId: integer('application_id'),
  status: text('status').notNull(), // 'sent', 'queued', 'failed', 'simulated'
  error: text('error'),
  previewBody: text('preview_body'),
  createdAt: timestamp('created_at').defaultNow(),
});
