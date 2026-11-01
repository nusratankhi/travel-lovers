-- ============================================================================
-- TRAVEL LOVERS — Multi-Tenant Bus Ticket Booking & Transport Management SaaS
-- 02_rls_and_functions.sql
-- ============================================================================

-- Function: Atomic Seat Locking (Prevents race conditions)
CREATE OR REPLACE FUNCTION lock_trip_seats(
    p_trip_id UUID,
    p_seat_ids UUID[],
    p_seat_numbers VARCHAR[],
    p_user_id UUID,
    p_session_id VARCHAR,
    p_role VARCHAR,
    p_lock_minutes INT DEFAULT 10
)
RETURNS TABLE (
    success BOOLEAN,
    message VARCHAR,
    locked_seat_numbers VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_seat_id UUID;
    v_seat_num VARCHAR;
    v_idx INT;
    v_already_booked BOOLEAN;
    v_already_locked BOOLEAN;
    v_expires_at TIMESTAMPTZ;
BEGIN
    v_expires_at := NOW() + (p_lock_minutes || ' minutes')::INTERVAL;
    
    -- 1. First, delete any expired locks for this trip
    DELETE FROM seat_locks 
    WHERE trip_id = p_trip_id AND expires_at <= NOW();

    -- 2. Validate none of the requested seats are booked or currently actively locked by someone else
    FOR v_idx IN 1 .. array_length(p_seat_ids, 1) LOOP
        v_seat_id := p_seat_ids[v_idx];
        v_seat_num := p_seat_numbers[v_idx];

        -- Check booked
        SELECT EXISTS(
            SELECT 1 FROM booking_seats 
            WHERE trip_id = p_trip_id AND seat_id = v_seat_id
        ) INTO v_already_booked;

        IF v_already_booked THEN
            RETURN QUERY SELECT false, ('Seat ' || v_seat_num || ' is already booked')::VARCHAR, ARRAY[]::VARCHAR[];
            RETURN;
        END IF;

        -- Check active lock by different session
        SELECT EXISTS(
            SELECT 1 FROM seat_locks 
            WHERE trip_id = p_trip_id 
              AND seat_id = v_seat_id 
              AND expires_at > NOW()
              AND lock_session_id <> p_session_id
        ) INTO v_already_locked;

        IF v_already_locked THEN
            RETURN QUERY SELECT false, ('Seat ' || v_seat_num || ' is currently being booked by another customer')::VARCHAR, ARRAY[]::VARCHAR[];
            RETURN;
        END IF;
    END LOOP;

    -- 3. Upsert or refresh seat locks for this session
    FOR v_idx IN 1 .. array_length(p_seat_ids, 1) LOOP
        v_seat_id := p_seat_ids[v_idx];
        v_seat_num := p_seat_numbers[v_idx];

        DELETE FROM seat_locks WHERE trip_id = p_trip_id AND seat_id = v_seat_id;

        INSERT INTO seat_locks (
            trip_id, seat_id, seat_number, user_id, lock_session_id, locked_by_role, expires_at
        ) VALUES (
            p_trip_id, v_seat_id, v_seat_num, p_user_id, p_session_id, p_role, v_expires_at
        );
    END LOOP;

    RETURN QUERY SELECT true, 'Seats successfully locked'::VARCHAR, p_seat_numbers;
END;
$$;

-- Function: Atomic Booking Confirmation
CREATE OR REPLACE FUNCTION confirm_seat_booking(
    p_booking_id UUID,
    p_trip_id UUID,
    p_seat_ids UUID[],
    p_seat_numbers VARCHAR[],
    p_fares DECIMAL[],
    p_passengers JSONB, -- array of {name, phone, gender, age, boarding_stop_id, dropping_stop_id}
    p_session_id VARCHAR
)
RETURNS TABLE (
    success BOOLEAN,
    message VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_idx INT;
    v_passenger JSONB;
BEGIN
    -- Insert each seat and verify uniqueness constraint
    FOR v_idx IN 1 .. array_length(p_seat_ids, 1) LOOP
        v_passenger := p_passengers->(v_idx - 1);
        
        INSERT INTO booking_seats (
            booking_id,
            trip_id,
            seat_id,
            seat_number,
            fare_bdt,
            boarding_stop_id,
            dropping_stop_id,
            passenger_name,
            passenger_phone,
            passenger_gender,
            passenger_age
        ) VALUES (
            p_booking_id,
            p_trip_id,
            p_seat_ids[v_idx],
            p_seat_numbers[v_idx],
            p_fares[v_idx],
            (v_passenger->>'boarding_stop_id')::UUID,
            (v_passenger->>'dropping_stop_id')::UUID,
            v_passenger->>'name',
            v_passenger->>'phone',
            COALESCE(v_passenger->>'gender', 'male'),
            (v_passenger->>'age')::INT
        );
    END LOOP;

    -- Release locks for this session
    DELETE FROM seat_locks 
    WHERE trip_id = p_trip_id AND lock_session_id = p_session_id;

    -- Update booked_seats_count in trips
    UPDATE trips 
    SET booked_seats_count = booked_seats_count + array_length(p_seat_ids, 1)
    WHERE id = p_trip_id;

    RETURN QUERY SELECT true, 'Booking confirmed and seats secured successfully'::VARCHAR;
EXCEPTION
    WHEN unique_violation THEN
        RETURN QUERY SELECT false, 'One or more seats have already been booked by another customer. Please select different seats.'::VARCHAR;
    WHEN OTHERS THEN
        RETURN QUERY SELECT false, SQLERRM::VARCHAR;
END;
$$;

-- Enable Row Level Security (RLS) on all tenant-isolated tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;

-- Super Admin bypass policy
CREATE POLICY super_admin_all_tenants ON tenants
    FOR ALL USING (auth.jwt() ->> 'is_super_admin' = 'true');

-- Public readable for active tenant companies, routes and trips
CREATE POLICY public_view_companies ON companies
    FOR SELECT USING (status = 'active');

CREATE POLICY public_view_routes ON routes
    FOR SELECT USING (status = 'active');

CREATE POLICY public_view_trips ON trips
    FOR SELECT USING (status IN ('scheduled', 'boarding'));
