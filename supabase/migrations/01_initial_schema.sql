-- ============================================================================
-- TRAVEL LOVERS — Multi-Tenant Bus Ticket Booking & Transport Management SaaS
-- 01_initial_schema.sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SAAS PLATFORM & TENANTS
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- starter, business, enterprise
    bus_limit INT NOT NULL DEFAULT 5,
    counter_limit INT NOT NULL DEFAULT 2,
    staff_limit INT NOT NULL DEFAULT 5,
    agent_limit INT NOT NULL DEFAULT 0,
    monthly_price_bdt DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    yearly_price_bdt DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'trial', -- trial, active, suspended, cancelled
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    trial_ends_at TIMESTAMPTZ,
    settings JSONB NOT NULL DEFAULT '{
        "currency": "BDT",
        "timezone": "Asia/Dhaka",
        "allow_agent_booking": true,
        "allow_online_booking": true,
        "max_advance_days": 30,
        "cancellation_window_hours": 12
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenant_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    domain VARCHAR(255) UNIQUE NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    ssl_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, past_due, cancelled, expired
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    last_payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount_bdt DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- bkash, nagad, card, bank
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USERS & ROLES
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- super_admin, company_admin, branch_manager, counter_staff, accountant, agent, driver, conductor, customer
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(100) NOT NULL, -- buses, routes, trips, bookings, finance, users
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, export, approve
    description TEXT,
    UNIQUE (module, action)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE,
    avatar_url TEXT,
    role_code VARCHAR(50) NOT NULL DEFAULT 'customer',
    is_super_admin BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRANSPORT NETWORK & ASSETS
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    registration_number VARCHAR(100),
    logo_url TEXT,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    website VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    counter_code VARCHAR(50) NOT NULL,
    location_details TEXT,
    contact_phone VARCHAR(50) NOT NULL,
    opening_hours VARCHAR(100) DEFAULT '06:00 AM - 11:00 PM',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Luxury Scania Multi-Axle, Hyundai Universe AC, Ashok Leyland Non-AC
    class_type VARCHAR(50) NOT NULL DEFAULT 'AC', -- AC, Non-AC, Sleeper, Double-Decker
    seat_capacity INT NOT NULL DEFAULT 40,
    amenities JSONB NOT NULL DEFAULT '["AC", "WiFi", "Charging Port", "Water Bottle", "Blanket"]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seat_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Standard 2+2 (40 Seats), VIP Business 2+1 (28 Seats), Sleeper Luxury (30 Berths)
    layout_type VARCHAR(50) NOT NULL DEFAULT '2+2',
    total_rows INT NOT NULL DEFAULT 10,
    total_cols INT NOT NULL DEFAULT 4,
    layout_matrix JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    reg_no VARCHAR(100) UNIQUE NOT NULL, -- Dhaka Metro-Ba-11-2345
    bus_number VARCHAR(50) NOT NULL, -- GL-101
    bus_type_id UUID NOT NULL REFERENCES bus_types(id),
    seat_layout_id UUID NOT NULL REFERENCES seat_layouts(id),
    total_seats INT NOT NULL DEFAULT 40,
    fitness_expiry DATE,
    tax_token_expiry DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, maintenance, retired
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    nid VARCHAR(50) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    license_expiry DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conductors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    nid VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROUTES, SCHEDULES & TRIPS
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    distance_km INT NOT NULL DEFAULT 250,
    estimated_duration_mins INT NOT NULL DEFAULT 360,
    base_fare_bdt DECIMAL(10, 2) NOT NULL DEFAULT 650.00,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    stop_type VARCHAR(20) NOT NULL DEFAULT 'both', -- boarding, dropping, both
    order_index INT NOT NULL DEFAULT 1,
    time_offset_mins INT NOT NULL DEFAULT 0,
    fare_offset_bdt DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    bus_id UUID NOT NULL REFERENCES buses(id),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    days_of_week JSONB NOT NULL DEFAULT '["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]'::jsonb,
    is_recurring BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id),
    route_id UUID NOT NULL REFERENCES routes(id),
    bus_id UUID NOT NULL REFERENCES buses(id),
    driver_id UUID REFERENCES drivers(id),
    conductor_id UUID REFERENCES conductors(id),
    trip_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    fare_bdt DECIMAL(10, 2) NOT NULL,
    total_seats INT NOT NULL DEFAULT 40,
    booked_seats_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, boarding, departed, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ATOMIC SEAT LOCKING & BOOKING CONCURRENCY
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL, -- A1, A2, B1, B2
    row_num INT NOT NULL,
    col_num INT NOT NULL,
    seat_type VARCHAR(50) NOT NULL DEFAULT 'standard', -- window, aisle, vip, female_only
    deck_level VARCHAR(20) NOT NULL DEFAULT 'lower', -- lower, upper
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (bus_id, seat_number)
);

CREATE TABLE IF NOT EXISTS seat_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES profiles(id),
    lock_session_id VARCHAR(100) NOT NULL,
    locked_by_role VARCHAR(50) NOT NULL DEFAULT 'customer', -- customer, counter_staff, agent
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BOOKINGS, PASSENGERS & TICKETING
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    gender VARCHAR(20) DEFAULT 'other',
    total_trips INT NOT NULL DEFAULT 0,
    loyalty_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES trips(id),
    customer_id UUID REFERENCES customers(id),
    booking_ref VARCHAR(50) UNIQUE NOT NULL, -- TL-20261031-98765
    booking_source VARCHAR(50) NOT NULL DEFAULT 'online', -- online, counter, agent
    counter_id UUID REFERENCES counters(id),
    agent_id UUID REFERENCES profiles(id),
    booked_by_user_id UUID REFERENCES profiles(id),
    total_seats INT NOT NULL DEFAULT 1,
    total_fare_bdt DECIMAL(12, 2) NOT NULL,
    discount_bdt DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    net_amount_bdt DECIMAL(12, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, refunded, failed
    booking_status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled, on_hold
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES trips(id),
    seat_id UUID NOT NULL REFERENCES seats(id),
    seat_number VARCHAR(20) NOT NULL,
    fare_bdt DECIMAL(10, 2) NOT NULL,
    boarding_stop_id UUID REFERENCES route_stops(id),
    dropping_stop_id UUID REFERENCES route_stops(id),
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(50) NOT NULL,
    passenger_gender VARCHAR(20) NOT NULL DEFAULT 'male',
    passenger_age INT,
    UNIQUE (trip_id, seat_id) -- Strict physical database guarantee: seat cannot be double-booked for the same trip!
);

CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code_data TEXT NOT NULL,
    verification_hash VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, boarded, cancelled, refunded
    boarded_at TIMESTAMPTZ,
    boarded_by_crew_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cancellations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id),
    cancelled_by UUID REFERENCES profiles(id),
    reason TEXT NOT NULL,
    refund_eligibility_pct INT NOT NULL DEFAULT 80,
    cancellation_fee_bdt DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cancellation_id UUID REFERENCES cancellations(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    refund_amount_bdt DECIMAL(12, 2) NOT NULL,
    refund_method VARCHAR(50) NOT NULL DEFAULT 'bkash', -- bkash, nagad, bank, counter_cash
    refund_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, processed, rejected
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PAYMENTS, AGENTS, WALLETS & FINANCIAL LEDGER
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    gateway VARCHAR(50) NOT NULL, -- bkash, nagad, sslcommerz, cash, agent_wallet
    amount_bdt DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    gateway_response JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    owner_type VARCHAR(50) NOT NULL, -- agent, counter, company
    owner_id UUID NOT NULL,
    balance_bdt DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    credit_limit_bdt DECIMAL(12, 2) NOT NULL DEFAULT 50000.00,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- credit, debit
    amount_bdt DECIMAL(12, 2) NOT NULL,
    balance_after_bdt DECIMAL(12, 2) NOT NULL,
    reference_type VARCHAR(50) NOT NULL, -- ticket_sale, topup, commission, settlement, refund
    reference_id VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES profiles(id),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_fare_bdt DECIMAL(12, 2) NOT NULL,
    commission_pct DECIMAL(5, 2) NOT NULL DEFAULT 7.50,
    commission_amount_bdt DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'settled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entry_type VARCHAR(50) NOT NULL, -- income, expense, commission, refund, counter_shift
    account_name VARCHAR(100) NOT NULL, -- Online Booking Revenue, Counter Cash, Agent Commission, Diesel Expense
    amount_bdt DECIMAL(12, 2) NOT NULL,
    counter_id UUID REFERENCES counters(id),
    trip_id UUID REFERENCES trips(id),
    created_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. COMMUNICATIONS, AUDIT LOGS & CMS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'in_app', -- in_app, sms, email
    is_read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- booking, refund, cancellation, bus_delay, other
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL, -- login, book_seat, cancel_ticket, create_bus, update_fare
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
