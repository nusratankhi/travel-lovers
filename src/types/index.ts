export type UserRole =
  | "super_admin"
  | "saas_admin"
  | "company_owner"
  | "company_admin"
  | "operations_manager"
  | "branch_manager"
  | "counter_manager"
  | "counter_staff"
  | "accountant"
  | "agent"
  | "sub_agent"
  | "driver"
  | "conductor"
  | "customer";

export interface Profile {
  id: string;
  tenant_id?: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  role: UserRole;
  is_super_admin: boolean;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: "starter" | "business" | "enterprise";
  bus_limit: number;
  counter_limit: number;
  staff_limit: number;
  agent_limit: number;
  monthly_price_bdt: number;
  yearly_price_bdt: number;
  features: {
    sms_alerts?: boolean;
    basic_reports?: boolean;
    online_ticketing?: boolean;
    agent_portal?: boolean;
    pos_counters?: boolean;
    advanced_reports?: boolean;
    white_label?: boolean;
    custom_domain?: boolean;
    live_gps?: boolean;
    priority_support?: boolean;
    [key: string]: any;
  };
  is_active: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  code: string;
  logo_url: string;
  status: "trial" | "active" | "suspended" | "cancelled";
  subscription_plan_id: string;
  plan?: SubscriptionPlan;
  trial_ends_at?: string;
  settings: {
    currency: string;
    timezone: string;
    allow_agent_booking: boolean;
    allow_online_booking: boolean;
    max_advance_days: number;
    cancellation_window_hours: number;
  };
  created_at: string;
}

export interface Company {
  id: string;
  tenant_id: string;
  name: string;
  legal_name: string;
  registration_number: string;
  logo_url: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  status: "active" | "inactive";
}

export interface Branch {
  id: string;
  tenant_id: string;
  company_id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  status: "active" | "inactive";
}

export interface Counter {
  id: string;
  tenant_id: string;
  branch_id: string;
  name: string;
  counter_code: string;
  location_details: string;
  contact_phone: string;
  opening_hours: string;
  status: "active" | "inactive";
  branch_name?: string;
}

export interface BusType {
  id: string;
  tenant_id: string;
  name: string;
  class_type: "AC" | "Non-AC" | "Sleeper" | "Double-Decker";
  seat_capacity: number;
  amenities: string[];
}

export interface SeatDefinition {
  seat_number: string;
  row: string;
  col: number;
  type: "standard" | "window" | "aisle" | "vip" | "female_only" | "space";
  deck?: "lower" | "upper";
  price_modifier?: number;
}

export interface SeatLayout {
  id: string;
  tenant_id: string;
  name: string;
  layout_type: "2+2" | "2+1" | "sleeper_single" | "sleeper_double";
  total_rows: number;
  total_cols: number;
  layout_matrix: {
    rows: {
      row: string;
      seats: string[]; // e.g. ["A1", "A2", "aisle", "A3", "A4"]
    }[];
  };
}

export interface Bus {
  id: string;
  tenant_id: string;
  company_id: string;
  reg_no: string;
  bus_number: string;
  bus_type_id: string;
  bus_type_name?: string;
  seat_layout_id: string;
  total_seats: number;
  fitness_expiry?: string;
  tax_token_expiry?: string;
  status: "active" | "maintenance" | "retired";
  company_name?: string;
}

export interface Driver {
  id: string;
  tenant_id: string;
  company_id: string;
  full_name: string;
  phone: string;
  nid: string;
  license_number: string;
  license_expiry: string;
  status: "active" | "inactive";
}

export interface Conductor {
  id: string;
  tenant_id: string;
  company_id: string;
  full_name: string;
  phone: string;
  nid: string;
  status: "active" | "inactive";
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_name: string;
  city: string;
  stop_type: "boarding" | "dropping" | "both";
  order_index: number;
  time_offset_mins: number;
  fare_offset_bdt: number;
}

export interface Route {
  id: string;
  tenant_id: string;
  company_id: string;
  origin_city: string;
  destination_city: string;
  distance_km: number;
  estimated_duration_mins: number;
  base_fare_bdt: number;
  status: "active" | "inactive";
  stops?: RouteStop[];
}

export interface Trip {
  id: string;
  tenant_id: string;
  schedule_id?: string;
  route_id: string;
  bus_id: string;
  driver_id?: string;
  conductor_id?: string;
  trip_date: string;
  departure_time: string;
  arrival_time: string;
  fare_bdt: number;
  total_seats: number;
  booked_seats_count: number;
  status: "scheduled" | "boarding" | "departed" | "completed" | "cancelled";
  // Joined details
  operator_name: string;
  operator_logo: string;
  bus_name: string;
  bus_reg_no: string;
  bus_type: "AC" | "Non-AC" | "Sleeper" | "Double-Decker";
  amenities: string[];
  origin_city: string;
  destination_city: string;
  boarding_points: string[];
  dropping_points: string[];
  layout_type: "2+2" | "2+1" | "sleeper_single";
}

export type SeatStatus = "available" | "selected" | "locked" | "booked" | "blocked" | "female_booked";

export interface SeatMapItem {
  seat_number: string;
  status: SeatStatus;
  type: "standard" | "window" | "aisle" | "vip" | "female_only" | "space";
  price: number;
  deck?: "lower" | "upper";
  row: string;
  col: number;
  locked_by_user?: string;
  lock_expires_at?: string;
}

export interface PassengerInput {
  name: string;
  phone: string;
  gender: "male" | "female" | "other";
  age?: number;
  seat_number: string;
  fare: number;
  boarding_stop: string;
  dropping_stop: string;
}

export interface Booking {
  id: string;
  tenant_id: string;
  trip_id: string;
  customer_id?: string;
  booking_ref: string;
  booking_source: "online" | "counter" | "agent";
  counter_id?: string;
  agent_id?: string;
  booked_by_user_id?: string;
  total_seats: number;
  total_fare_bdt: number;
  discount_bdt: number;
  net_amount_bdt: number;
  payment_status: "pending" | "paid" | "refunded" | "failed";
  booking_status: "confirmed" | "cancelled" | "on_hold";
  created_at: string;
  // Details
  trip?: Trip;
  passengers: PassengerInput[];
  tickets: Ticket[];
  payment?: Payment;
}

export interface Ticket {
  id: string;
  booking_id: string;
  ticket_number: string;
  seat_number: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_gender: string;
  boarding_point: string;
  dropping_point: string;
  fare_bdt: number;
  qr_code_data: string;
  verification_hash: string;
  status: "active" | "boarded" | "cancelled" | "refunded";
  boarded_at?: string;
  boarded_by?: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  booking_id: string;
  gateway: "bkash" | "nagad" | "sslcommerz" | "cash" | "agent_wallet";
  amount_bdt: number;
  currency: string;
  transaction_id: string;
  status: "initiated" | "success" | "failed";
  created_at: string;
}

export interface Wallet {
  id: string;
  tenant_id: string;
  owner_type: "agent" | "counter" | "company";
  owner_id: string;
  owner_name: string;
  balance_bdt: number;
  credit_limit_bdt: number;
  status: "active" | "suspended";
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "credit" | "debit";
  amount_bdt: number;
  balance_after_bdt: number;
  reference_type: "ticket_sale" | "topup" | "commission" | "settlement" | "refund";
  reference_id?: string;
  remarks: string;
  created_at: string;
}

export interface FinancialLedgerEntry {
  id: string;
  tenant_id: string;
  entry_type: "income" | "expense" | "commission" | "refund" | "counter_shift";
  account_name: string;
  amount_bdt: number;
  counter_name?: string;
  trip_ref?: string;
  notes?: string;
  created_at: string;
}
