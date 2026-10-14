-- ============================================================================
-- LEGAL SERVICES MARKETPLACE (LAWSUIT) - SEED DATA
-- Default Categories, Specializations, Document Services, and Test Accounts
-- ============================================================================

-- 1. SEED CATEGORIES (11 Standard Categories from Requirements)
INSERT INTO categories (id, slug, name, description, icon_url, display_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'criminal-law', 'Criminal Law', 'Bail, FIR quashing, trials, cyber crime defense, and criminal appeals.', 'gavel', 1, TRUE),
('c0000000-0000-0000-0000-000000000002', 'civil-law', 'Civil Law', 'Property suits, recovery, injunctions, partition suits, and civil appeals.', 'balance-scale', 2, TRUE),
('c0000000-0000-0000-0000-000000000003', 'family-divorce', 'Family & Divorce', 'Mutual & contested divorce, child custody, maintenance, and domestic violence.', 'users', 3, TRUE),
('c0000000-0000-0000-0000-000000000004', 'property-real-estate', 'Property & Real Estate', 'RERA complaints, title verification, builder delays, and eviction disputes.', 'home', 4, TRUE),
('c0000000-0000-0000-0000-000000000005', 'consumer-disputes', 'Consumer Disputes', 'Deficiency of service, unfair trade practices, e-commerce, and medical negligence.', 'shopping-bag', 5, TRUE),
('c0000000-0000-0000-0000-000000000006', 'cyber-crime', 'Cyber Crime', 'Online fraud, data theft, identity theft, defamation, and IT Act violations.', 'shield', 6, TRUE),
('c0000000-0000-0000-0000-000000000007', 'employment-labour', 'Employment & Labour', 'Wrongful termination, unpaid wages, POSH matters, and employment contracts.', 'briefcase', 7, TRUE),
('c0000000-0000-0000-0000-000000000008', 'corporate-business', 'Corporate & Business', 'Company incorporation, compliance, contracts, M&A, and shareholder disputes.', 'landmark', 8, TRUE),
('c0000000-0000-0000-0000-000000000009', 'financial-disputes', 'Cheque & Financial Disputes', 'Section 138 cheque bounce notices, debt recovery (DRT), and loan disputes.', 'credit-card', 9, TRUE),
('c0000000-0000-0000-0000-000000000010', 'accident-insurance', 'Accident & Insurance', 'Motor Accident Claims Tribunal (MACT), insurance repudiation, and life claims.', 'ambulance', 10, TRUE),
('c0000000-0000-0000-0000-000000000011', 'other-legal', 'Other Legal Matters', 'Constitutional writs, PIL, immigration, tax, and administrative tribunals.', 'folder', 11, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED SPECIALIZATIONS
INSERT INTO specializations (category_id, name, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'Anticipatory & Regular Bail', 'Urgent bail applications in Sessions & High Courts'),
('c0000000-0000-0000-0000-000000000001', 'White Collar Crime & Fraud', 'Economic offences and corporate financial fraud'),
('c0000000-0000-0000-0000-000000000003', 'Mutual Consent Divorce', 'Fast-track settlement and joint petition drafting'),
('c0000000-0000-0000-0000-000000000003', 'Child Custody & Visitation', 'Guardianship and welfare of minors'),
('c0000000-0000-0000-0000-000000000004', 'RERA & Builder Grievance', 'Non-delivery of possession and compensation claims'),
('c0000000-0000-0000-0000-000000000009', 'Section 138 Cheque Bounce', 'Statutory legal demand notice and magistrate trials')
ON CONFLICT DO NOTHING;

-- 3. SEED DOCUMENT SERVICES
INSERT INTO document_services (id, slug, name, category_id, description, standard_price, delivery_sla_days, revisions_included, intake_schema) VALUES
('d0000000-0000-0000-0000-000000000001', 'rent-agreement-drafting', 'Residential Rent Agreement', 'c0000000-0000-0000-0000-000000000004', 'Legally vetted 11-month residential tenancy agreement customized with customized terms and penalty clauses.', 999.00, 2, 2, '{"type":"object","properties":{"landlord_name":{"type":"string"},"tenant_name":{"type":"string"},"monthly_rent":{"type":"number"},"deposit_amount":{"type":"number"},"property_address":{"type":"string"}},"required":["landlord_name","tenant_name","monthly_rent","property_address"]}'::jsonb),
('d0000000-0000-0000-0000-000000000002', 'legal-notice-cheque-bounce', 'Section 138 Cheque Bounce Notice', 'c0000000-0000-0000-0000-000000000009', 'Mandatory 30-day statutory demand notice drafted by an advocate with Bar registration seal for dishonoured cheques.', 1499.00, 1, 2, '{"type":"object","properties":{"payee_name":{"type":"string"},"drawer_name":{"type":"string"},"cheque_number":{"type":"string"},"cheque_amount":{"type":"number"},"cheque_date":{"type":"string"},"return_memo_reason":{"type":"string"}},"required":["payee_name","drawer_name","cheque_number","cheque_amount"]}'::jsonb),
('d0000000-0000-0000-0000-000000000003', 'non-disclosure-agreement', 'Non-Disclosure Agreement (NDA)', 'c0000000-0000-0000-0000-000000000008', 'Mutual or Unilateral NDA protecting proprietary data, business secrets, and intellectual property.', 1299.00, 2, 2, '{"type":"object","properties":{"disclosing_party":{"type":"string"},"receiving_party":{"type":"string"},"jurisdiction_city":{"type":"string"}},"required":["disclosing_party","receiving_party"]}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED ADMIN USER
INSERT INTO users (id, phone_country_code, phone_number, email, role, is_phone_verified, is_email_verified, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', '+91', '9999999999', 'admin@lawsuit.com', 'ADMIN', TRUE, TRUE, TRUE)
ON CONFLICT (phone_number) DO NOTHING;

-- 5. SEED VERIFIED ADVOCATE ACCOUNT
INSERT INTO users (id, phone_country_code, phone_number, email, role, is_phone_verified, is_email_verified, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', '+91', '9888888888', 'advocate.sharma@lawsuit.com', 'LAWYER', TRUE, TRUE, TRUE)
ON CONFLICT (phone_number) DO NOTHING;

INSERT INTO lawyer_profiles (
    user_id, full_name, avatar_url, bar_council_number, state_bar_council,
    year_of_enrollment, experience_years, bio, qualification_summary,
    office_address, city, state, latitude, longitude, languages, courts_of_practice,
    verification_status, is_online_for_instant, rating_average, rating_count,
    consultation_fee_chat, consultation_fee_audio, consultation_fee_video, consultation_fee_offline
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Adv. Rajesh Sharma',
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
    'D/1482/2010',
    'Bar Council of Delhi',
    2010,
    14,
    'Practicing Advocate at Delhi High Court and Supreme Court specializing in Civil Litigation, Property Disputes, and Family Law with 14+ years of courtroom experience.',
    'B.A. LL.B (Hons.), National Law University; LL.M (Commercial Law)',
    'Chamber No. 422, Lawyers Chambers Block, Delhi High Court',
    'New Delhi',
    'Delhi',
    28.6139,
    77.2090,
    ARRAY['English', 'Hindi'],
    ARRAY['Supreme Court of India', 'Delhi High Court', 'Patiala House Courts'],
    'APPROVED',
    TRUE,
    4.90,
    142,
    499.00,
    799.00,
    1199.00,
    2499.00
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lawyer_categories (lawyer_id, category_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- Seed Lawyer Wallet
INSERT INTO lawyer_wallets (lawyer_id, available_balance, escrow_locked_balance, total_withdrawn) VALUES
('b0000000-0000-0000-0000-000000000001', 12500.00, 2400.00, 85000.00)
ON CONFLICT (lawyer_id) DO NOTHING;
