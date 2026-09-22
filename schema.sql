-- ============================================================================
-- ДАЛЬНЕВОСТОЧНЫЙ ФЕСТИВАЛЬ КРЕАТИВНОЙ АНИМАЦИИ «11 КАДРОВ» (г. Чита)
-- Схема базы данных PostgreSQL для промышленного развёртывания (Production DDL)
-- ============================================================================

-- Включение расширений (при необходимости)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Таблица пользователей (пользователи и администраторы)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- 2. Таблица учётных записей администраторов фестиваля
CREATE TABLE IF NOT EXISTS admin_credentials (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Первичная инициализация учётной записи администратора оргкомитета:
-- Логин по умолчанию: admin
-- Пароль по умолчанию: 11kadrov (SHA-256: 6596642cd723842b5485c9c503083f5c83b80c0cade2b9d63a270c97bf27520b)
INSERT INTO admin_credentials (username, password_hash, role, is_active)
VALUES ('admin', '6596642cd723842b5485c9c503083f5c83b80c0cade2b9d63a270c97bf27520b', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- 3. Журнал аудита входов в панель управления оргкомитета
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_logs(created_at DESC);

-- 4. Таблица конкурсных заявок фестиваля анимации
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    external_id TEXT UNIQUE,
    author_name TEXT NOT NULL,
    birth_date TEXT,
    age INTEGER,
    city TEXT,
    organization TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    telegram TEXT,
    work_title TEXT NOT NULL,
    nomination_id TEXT NOT NULL,
    nomination_title TEXT NOT NULL,
    duration TEXT,
    description TEXT,
    link TEXT NOT NULL,
    technique TEXT,
    consent BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, reviewing
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    email_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_nomination ON applications(nomination_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

-- 5. Журнал доставки почтовых уведомлений (Nodemailer / Mailer Audit)
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    application_id INTEGER REFERENCES applications(id) ON DELETE SET NULL,
    status TEXT NOT NULL, -- 'sent', 'failed', 'simulated', 'queued'
    error TEXT,
    preview_body TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- ============================================================================
-- Вывод информации об успешной инициализации
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE 'База данных фестиваля «11 кадров» успешно инициализирована!';
    RAISE NOTICE 'Таблицы: users, admin_credentials, admin_audit_logs, applications, email_logs созданы.';
    RAISE NOTICE 'Администратор по умолчанию: login "admin", пароль "11kadrov" подготовлен.';
END $$;
