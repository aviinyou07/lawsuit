-- ============================================================================
-- LEGAL SERVICES MARKETPLACE (LAWSUIT) - DATABASE SCHEMA
-- PostgreSQL 16+ DDL
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('CLIENT', 'LAWYER', 'ADMIN', 'SUPPORT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_enum AS ENUM ('UNSUBMITTED', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE consultation_mode_enum AS ENUM ('CHAT', 'AUDIO', 'VIDEO', 'OFFLINE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED', 'DISPUTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payout_status_enum AS ENUM ('REQUESTED', 'PROCESSING', 'PAID', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE doc_order_status_enum AS ENUM ('REQUESTED', 'QUOTED', 'PAID', 'DRAFTING', 'IN_REVIEW', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE dispute_status_enum AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED_REFUNDED', 'RESOLVED_REJECTED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. USERS & AUTHENTICATION
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_country_code VARCHAR(5) NOT NULL DEFAULT '+91',
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role user_role_enum NOT NULL DEFAULT 'CLIENT',
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4. CLIENT PROFILES
CREATE TABLE IF NOT EXISTS client_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    preferred_language VARCHAR(50) DEFAULT 'English',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. LEGAL CATEGORIES & SPECIALIZATIONS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LAWYER PROFILES & VERIFICATION
CREATE TABLE IF NOT EXISTS lawyer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bar_council_number VARCHAR(100) NOT NULL UNIQUE,
    state_bar_council VARCHAR(100) NOT NULL,
    year_of_enrollment INT NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    bio TEXT,
    qualification_summary TEXT,
    office_address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    languages TEXT[] DEFAULT ARRAY['English'],
    courts_of_practice TEXT[],
    verification_status verification_status_enum NOT NULL DEFAULT 'UNSUBMITTED',
    is_online_for_instant BOOLEAN NOT NULL DEFAULT FALSE,
    rating_average NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    consultation_fee_chat NUMERIC(10, 2) DEFAULT 499.00,
    consultation_fee_audio NUMERIC(10, 2) DEFAULT 699.00,
    consultation_fee_video NUMERIC(10, 2) DEFAULT 999.00,
    consultation_fee_offline NUMERIC(10, 2) DEFAULT 1999.00,
    platform_commission_rate NUMERIC(5, 2) DEFAULT 15.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lawyer_city ON lawyer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_lawyer_rating ON lawyer_profiles(rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_lawyer_experience ON lawyer_profiles(experience_years DESC);
CREATE INDEX IF NOT EXISTS idx_lawyer_verification ON lawyer_profiles(verification_status);

CREATE TABLE IF NOT EXISTS lawyer_categories (
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (lawyer_id, category_id)
);

CREATE TABLE IF NOT EXISTS lawyer_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    bar_council_id_front_url TEXT NOT NULL,
    bar_council_id_back_url TEXT NOT NULL,
    degree_certificate_url TEXT NOT NULL,
    government_id_url TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    status verification_status_enum NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    admin_internal_notes TEXT
);

-- 7. LAWYER AVAILABILITY & SLOTS
CREATE TABLE IF NOT EXISTS lawyer_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 20,
    consultation_mode consultation_mode_enum NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT check_time_order CHECK (start_time < end_time)
);

CREATE TABLE IF NOT EXISTS lawyer_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    CONSTRAINT check_date_order CHECK (start_date <= end_date)
);

-- 8. APPOINTMENTS & CONSULTATIONS
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES categories(id),
    consultation_mode consultation_mode_enum NOT NULL,
    status appointment_status_enum NOT NULL DEFAULT 'PENDING',
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    client_case_brief TEXT,
    consultation_fee NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    lawyer_net_earnings NUMERIC(10, 2) NOT NULL,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    rescheduled_from_id UUID REFERENCES appointments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_scheduled_times CHECK (scheduled_start < scheduled_end)
);

CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lawyer ON appointments(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(scheduled_start);

CREATE TABLE IF NOT EXISTS consultation_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    agora_channel_name VARCHAR(100) NOT NULL UNIQUE,
    agora_token TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    actual_duration_seconds INT DEFAULT 0,
    recording_url TEXT,
    lawyer_notes TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. REAL-TIME CHAT & MESSAGES
CREATE TABLE IF NOT EXISTS chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE REFERENCES appointments(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
    message_text TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON chat_messages(thread_id, created_at DESC);

-- 10. DOCUMENT SERVICES & ORDERS
CREATE TABLE IF NOT EXISTS document_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id),
    description TEXT,
    standard_price NUMERIC(10, 2) NOT NULL,
    delivery_sla_days INT NOT NULL DEFAULT 2,
    revisions_included INT NOT NULL DEFAULT 2,
    intake_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference VARCHAR(30) NOT NULL UNIQUE,
    service_id UUID NOT NULL REFERENCES document_services(id),
    client_id UUID NOT NULL REFERENCES users(id),
    assigned_lawyer_id UUID REFERENCES users(id),
    status doc_order_status_enum NOT NULL DEFAULT 'REQUESTED',
    submitted_inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    price_quote NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) NOT NULL,
    delivery_deadline TIMESTAMPTZ,
    final_document_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES document_orders(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    notes_from_lawyer TEXT,
    client_feedback TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CLIENT DOCUMENT VAULT & ACCESS CONTROL
CREATE TABLE IF NOT EXISTS document_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    s3_key TEXT NOT NULL,
    s3_bucket VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_encrypted BOOLEAN NOT NULL DEFAULT TRUE,
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vault_access_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES document_vault(id) ON DELETE CASCADE,
    granted_to_lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CASE MANAGEMENT
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    lawyer_id UUID NOT NULL REFERENCES users(id),
    case_title VARCHAR(255) NOT NULL,
    cnr_number VARCHAR(50),
    court_name VARCHAR(200) NOT NULL,
    case_type VARCHAR(100) NOT NULL,
    case_status VARCHAR(50) NOT NULL DEFAULT 'FILED',
    filing_date DATE,
    next_hearing_date DATE,
    petitioner_name VARCHAR(150),
    respondent_name VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS case_hearings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    hearing_date DATE NOT NULL,
    court_room VARCHAR(50),
    judge_name VARCHAR(150),
    proceedings_summary TEXT,
    next_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. PAYMENTS, ESCROW & LAWYER WALLETS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    document_order_id UUID REFERENCES document_orders(id),
    gateway_order_id VARCHAR(100) NOT NULL,
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    status payment_status_enum NOT NULL DEFAULT 'INITIATED',
    payment_method VARCHAR(50),
    gateway_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE TABLE IF NOT EXISTS lawyer_wallets (
    lawyer_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    available_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    escrow_locked_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_withdrawn NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_ifsc_code VARCHAR(20) NOT NULL,
    status payout_status_enum NOT NULL DEFAULT 'REQUESTED',
    bank_reference_utr VARCHAR(100),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. REVIEWS, RATINGS & DISPUTES
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    lawyer_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_title VARCHAR(150),
    review_text TEXT,
    lawyer_reply_text TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_reference VARCHAR(30) NOT NULL UNIQUE,
    raised_by_user_id UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    document_order_id UUID REFERENCES document_orders(id),
    issue_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status dispute_status_enum NOT NULL DEFAULT 'OPEN',
    admin_resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    refund_amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    actor_role VARCHAR(50),
    actor_ip VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_entity_id UUID,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
