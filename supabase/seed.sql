-- ============================================================================
-- TRAVEL LOVERS — Multi-Tenant Bus Ticket Booking & Transport Management SaaS
-- seed.sql (Comprehensive Initial Seed Data)
-- ============================================================================

-- 1. Subscription Plans
INSERT INTO subscription_plans (id, name, code, bus_limit, counter_limit, staff_limit, agent_limit, monthly_price_bdt, yearly_price_bdt, features) VALUES
('11111111-1111-1111-1111-111111111111', 'Starter Fleet', 'starter', 5, 2, 5, 2, 2999.00, 29990.00, '{"sms_alerts": true, "basic_reports": true, "online_ticketing": true}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Business Growth', 'business', 25, 10, 25, 20, 7999.00, 79990.00, '{"sms_alerts": true, "agent_portal": true, "pos_counters": true, "advanced_reports": true}'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Enterprise Transport', 'enterprise', 999, 999, 999, 999, 18999.00, 189990.00, '{"white_label": true, "custom_domain": true, "live_gps": true, "priority_support": true}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 2. Tenants (Operators)
INSERT INTO tenants (id, name, slug, code, logo_url, status, subscription_plan_id) VALUES
('aaaa1111-0000-0000-0000-000000000001', 'Green Line Paribahan', 'green-line', 'GLP', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100', 'active', '33333333-3333-3333-3333-333333333333'),
('aaaa2222-0000-0000-0000-000000000002', 'Shohagh Paribahan', 'shohagh', 'SHP', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', 'active', '33333333-3333-3333-3333-333333333333'),
('aaaa3333-0000-0000-0000-000000000003', 'Shyamoli NR Travels', 'shyamoli', 'SNT', 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=100', 'active', '22222222-2222-2222-2222-222222222222'),
('aaaa4444-0000-0000-0000-000000000004', 'Hanif Enterprise', 'hanif', 'HNF', 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=100', 'active', '33333333-3333-3333-3333-333333333333'),
('aaaa5555-0000-0000-0000-000000000005', 'Ena Transport', 'ena', 'ENA', 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=100', 'active', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (code) DO NOTHING;

-- 3. Companies Profile
INSERT INTO companies (id, tenant_id, name, legal_name, registration_number, logo_url, phone, email, address, website) VALUES
('bbbb1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'Green Line Paribahan Ltd.', 'Green Line Paribahan Limited', 'REG-GLP-2003-BD', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100', '+8801711592345', 'info@greenlinebd.com', '9/2 Outer Circular Road, Rajarbagh, Dhaka', 'https://greenline.com.bd'),
('bbbb2222-0000-0000-0000-000000000002', 'aaaa2222-0000-0000-0000-000000000002', 'Shohagh Paribahan', 'Shohagh Elite Transport Ltd.', 'REG-SHP-1998-BD', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', '+8801711567890', 'support@shohagh.com', 'Panthapath, Dhaka - 1205', 'https://shohagh.com'),
('bbbb3333-0000-0000-0000-000000000003', 'aaaa3333-0000-0000-0000-000000000003', 'Shyamoli NR Travels', 'NR Group Bangladesh', 'REG-SNT-2005-BD', 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=100', '+8801711998877', 'contact@shyamolinr.com', 'Sayedabad Bus Terminal, Dhaka', 'https://shyamolinr.com'),
('bbbb4444-0000-0000-0000-000000000004', 'aaaa4444-0000-0000-0000-000000000004', 'Hanif Enterprise', 'Hanif Transport Corporation', 'REG-HNF-1992-BD', 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=100', '+8801713045678', 'sales@hanif.com.bd', 'Gabtoli Inter-district Bus Terminal, Dhaka', 'https://hanif.com.bd'),
('bbbb5555-0000-0000-0000-000000000005', 'aaaa5555-0000-0000-0000-000000000005', 'Ena Transport', 'Ena Paribahan Pvt Ltd', 'REG-ENA-2010-BD', 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=100', '+8801715887766', 'care@enatransport.com', 'Mohakhali Bus Terminal, Dhaka', 'https://enatransport.com')
ON CONFLICT DO NOTHING;

-- 4. Branches & Counters
INSERT INTO branches (id, tenant_id, company_id, name, city, address, phone) VALUES
('cccc1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Rajarbagh Head Office', 'Dhaka', 'Rajarbagh, Outer Circular Road', '+8801711592345'),
('cccc1111-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dampara Branch', 'Chattogram', 'Dampara Bus Stand, Chattogram', '+8801711592346'),
('cccc1111-0000-0000-0000-000000000003', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Kolatoli Branch', 'Cox''s Bazar', 'Hotel Motel Zone, Kolatoli', '+8801711592347')
ON CONFLICT DO NOTHING;

INSERT INTO counters (id, tenant_id, branch_id, name, counter_code, location_details, contact_phone) VALUES
('dddd1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000001', 'Rajarbagh Counter 1', 'GL-RJB-01', 'Main Ticket Hall Counter 1', '+8801711592345'),
('dddd1111-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000001', 'Arambagh Counter', 'GL-ARB-01', 'Near Notre Dame College', '+8801711592348'),
('dddd1111-0000-0000-0000-000000000003', 'aaaa1111-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000002', 'Dampara Main Counter', 'GL-DMP-01', 'Opposite Police Line', '+8801711592346'),
('dddd1111-0000-0000-0000-000000000004', 'aaaa1111-0000-0000-0000-000000000001', 'cccc1111-0000-0000-0000-000000000003', 'Kolatoli Beach Counter', 'GL-KLB-01', 'Beside Seagull Hotel', '+8801711592347')
ON CONFLICT DO NOTHING;

-- 5. Bus Types & Seat Layouts
INSERT INTO bus_types (id, tenant_id, name, class_type, seat_capacity, amenities) VALUES
('eeee1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'Scania Multi-Axle Luxury AC', 'AC', 36, '["AC", "WiFi", "Charging Port", "Water Bottle", "Blanket", "Reclining Seats"]'::jsonb),
('eeee1111-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', 'Hyundai Universe Business Class', 'AC', 28, '["AC", "Snacks", "WiFi", "Personal Screen", "Charging Port"]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO seat_layouts (id, tenant_id, name, layout_type, total_rows, total_cols, layout_matrix) VALUES
('ffff1111-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'Standard 2+2 Luxury (36 Seats)', '2+2', 9, 4, '{
    "rows": [
        {"row": "A", "seats": ["A1", "A2", "aisle", "A3", "A4"]},
        {"row": "B", "seats": ["B1", "B2", "aisle", "B3", "B4"]},
        {"row": "C", "seats": ["C1", "C2", "aisle", "C3", "C4"]},
        {"row": "D", "seats": ["D1", "D2", "aisle", "D3", "D4"]},
        {"row": "E", "seats": ["E1", "E2", "aisle", "E3", "E4"]},
        {"row": "F", "seats": ["F1", "F2", "aisle", "F3", "F4"]},
        {"row": "G", "seats": ["G1", "G2", "aisle", "G3", "G4"]},
        {"row": "H", "seats": ["H1", "H2", "aisle", "H3", "H4"]},
        {"row": "I", "seats": ["I1", "I2", "aisle", "I3", "I4"]}
    ]
}'::jsonb),
('ffff2222-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', 'VIP Business 2+1 (28 Seats)', '2+1', 9, 3, '{
    "rows": [
        {"row": "A", "seats": ["A1", "aisle", "A2", "A3"]},
        {"row": "B", "seats": ["B1", "aisle", "B2", "B3"]},
        {"row": "C", "seats": ["C1", "aisle", "C2", "C3"]},
        {"row": "D", "seats": ["D1", "aisle", "D2", "D3"]},
        {"row": "E", "seats": ["E1", "aisle", "E2", "E3"]},
        {"row": "F", "seats": ["F1", "aisle", "F2", "F3"]},
        {"row": "G", "seats": ["G1", "aisle", "G2", "G3"]},
        {"row": "H", "seats": ["H1", "aisle", "H2", "H3"]},
        {"row": "I", "seats": ["I1", "I2", "I3", "I4"]}
    ]
}'::jsonb)
ON CONFLICT DO NOTHING;

-- 6. Buses
INSERT INTO buses (id, tenant_id, company_id, reg_no, bus_number, bus_type_id, seat_layout_id, total_seats, status) VALUES
('10101010-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dhaka Metro-Ba-14-9801', 'GL-Scania-101', 'eeee1111-0000-0000-0000-000000000001', 'ffff1111-0000-0000-0000-000000000001', 36, 'active'),
('10101010-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dhaka Metro-Ba-14-9802', 'GL-Scania-102', 'eeee1111-0000-0000-0000-000000000001', 'ffff1111-0000-0000-0000-000000000001', 36, 'active'),
('10101010-0000-0000-0000-000000000003', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dhaka Metro-Ba-15-1105', 'GL-VIP-201', 'eeee1111-0000-0000-0000-000000000002', 'ffff2222-0000-0000-0000-000000000002', 28, 'active')
ON CONFLICT DO NOTHING;

-- 7. Routes & Stops
INSERT INTO routes (id, tenant_id, company_id, origin_city, destination_city, distance_km, estimated_duration_mins, base_fare_bdt) VALUES
('20202020-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dhaka', 'Chattogram', 245, 330, 550.00),
('20202020-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dhaka', 'Cox''s Bazar', 395, 540, 700.00),
('20202020-0000-0000-0000-000000000003', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Chattogram', 'Sylhet', 360, 480, 600.00),
('20202020-0000-0000-0000-000000000004', 'aaaa1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'Dhaka', 'Sylhet', 240, 300, 650.00)
ON CONFLICT DO NOTHING;

INSERT INTO route_stops (route_id, stop_name, city, stop_type, order_index, time_offset_mins, fare_offset_bdt) VALUES
('20202020-0000-0000-0000-000000000002', 'Rajarbagh Counter', 'Dhaka', 'boarding', 1, 0, 0.00),
('20202020-0000-0000-0000-000000000002', 'Arambagh Counter', 'Dhaka', 'boarding', 2, 20, 0.00),
('20202020-0000-0000-0000-000000000002', 'Sayedabad Terminal', 'Dhaka', 'boarding', 3, 40, 0.00),
('20202020-0000-0000-0000-000000000002', 'Comilla Highway Point', 'Comilla', 'both', 4, 150, 0.00),
('20202020-0000-0000-0000-000000000002', 'Chakaria Terminal', 'Cox''s Bazar', 'dropping', 5, 450, 0.00),
('20202020-0000-0000-0000-000000000002', 'Kolatoli Beach Point', 'Cox''s Bazar', 'dropping', 6, 540, 0.00)
ON CONFLICT DO NOTHING;
