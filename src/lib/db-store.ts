"use client";

import {
  Trip,
  SeatMapItem,
  Booking,
  PassengerInput,
  Ticket,
  Payment,
  Profile,
  Tenant,
  SubscriptionPlan,
  Bus,
  Route,
  Counter,
  Wallet,
  FinancialLedgerEntry,
  UserRole,
} from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import {
  INITIAL_PLANS,
  INITIAL_TENANTS,
  INITIAL_COMPANIES,
  INITIAL_COUNTERS,
  INITIAL_BUSES,
  POPULAR_ROUTES,
  INITIAL_TRIPS,
  INITIAL_DEMO_USERS,
  INITIAL_WALLETS,
  INITIAL_BOOKINGS,
  INITIAL_LEDGER,
} from "./mock-data";

export interface ActiveSeatLock {
  tripId: string;
  seatNumber: string;
  sessionId: string;
  role: string;
  expiresAt: number; // timestamp in ms
}

class DatabaseStore {
  private trips: Trip[] = [];
  private bookings: Booking[] = [];
  private seatLocks: ActiveSeatLock[] = [];
  private tenants: Tenant[] = [];
  private plans: SubscriptionPlan[] = [];
  private buses: Bus[] = [];
  private routes: Route[] = [];
  private counters: Counter[] = [];
  private wallets: Wallet[] = [];
  private ledger: FinancialLedgerEntry[] = [];
  private users: Profile[] = [];
  private currentUser: Profile = INITIAL_DEMO_USERS[0];
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === "undefined") {
      this.loadDefaults();
      return;
    }

    try {
      const storedTrips = localStorage.getItem("tl_trips");
      const storedBookings = localStorage.getItem("tl_bookings");
      const storedLocks = localStorage.getItem("tl_seat_locks");
      const storedTenants = localStorage.getItem("tl_tenants");
      const storedPlans = localStorage.getItem("tl_plans");
      const storedBuses = localStorage.getItem("tl_buses");
      const storedRoutes = localStorage.getItem("tl_routes");
      const storedCounters = localStorage.getItem("tl_counters");
      const storedWallets = localStorage.getItem("tl_wallets");
      const storedLedger = localStorage.getItem("tl_ledger");
      const storedUser = localStorage.getItem("tl_current_user");

      this.trips = storedTrips ? JSON.parse(storedTrips) : INITIAL_TRIPS;
      this.bookings = storedBookings ? JSON.parse(storedBookings) : INITIAL_BOOKINGS;
      this.seatLocks = storedLocks ? JSON.parse(storedLocks) : [];
      this.tenants = storedTenants ? JSON.parse(storedTenants) : INITIAL_TENANTS;
      this.plans = storedPlans ? JSON.parse(storedPlans) : INITIAL_PLANS;
      this.buses = storedBuses ? JSON.parse(storedBuses) : INITIAL_BUSES;
      this.routes = storedRoutes ? JSON.parse(storedRoutes) : POPULAR_ROUTES;
      this.counters = storedCounters ? JSON.parse(storedCounters) : INITIAL_COUNTERS;
      this.wallets = storedWallets ? JSON.parse(storedWallets) : INITIAL_WALLETS;
      this.ledger = storedLedger ? JSON.parse(storedLedger) : INITIAL_LEDGER;
      this.users = INITIAL_DEMO_USERS;
      this.currentUser = storedUser ? JSON.parse(storedUser) : INITIAL_DEMO_USERS[0];

      // Clean expired locks
      this.cleanExpiredLocks();
      this.isInitialized = true;

      if (isSupabaseConfigured()) {
        this.syncWithSupabase();
      }
    } catch {
      this.loadDefaults();
    }
  }

  public async syncWithSupabase() {
    try {
      const { data: dbTenants } = await supabase.from("tenants").select("*");
      if (dbTenants && dbTenants.length > 0) {
        this.tenants = dbTenants.map((t: any) => ({
          ...t,
          settings:
            typeof t.settings === "string"
              ? JSON.parse(t.settings)
              : t.settings || {
                  currency: "BDT",
                  timezone: "Asia/Dhaka",
                  allow_agent_booking: true,
                  allow_online_booking: true,
                  max_advance_days: 30,
                  cancellation_window_hours: 12,
                },
        }));
      }

      const { data: dbRoutes } = await supabase.from("routes").select("*");
      if (dbRoutes && dbRoutes.length > 0) {
        this.routes = dbRoutes;
      }

      const { data: dbPlans } = await supabase.from("subscription_plans").select("*");
      if (dbPlans && dbPlans.length > 0) {
        this.plans = dbPlans;
      }

      this.notify();
    } catch (err) {
      console.warn("Supabase background sync:", err);
    }
  }

  private loadDefaults() {
    this.trips = [...INITIAL_TRIPS];
    this.bookings = [...INITIAL_BOOKINGS];
    this.seatLocks = [];
    this.tenants = [...INITIAL_TENANTS];
    this.plans = [...INITIAL_PLANS];
    this.buses = [...INITIAL_BUSES];
    this.routes = [...POPULAR_ROUTES];
    this.counters = [...INITIAL_COUNTERS];
    this.wallets = [...INITIAL_WALLETS];
    this.ledger = [...INITIAL_LEDGER];
    this.users = [...INITIAL_DEMO_USERS];
    this.currentUser = INITIAL_DEMO_USERS[0];
  }

  private save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("tl_trips", JSON.stringify(this.trips));
      localStorage.setItem("tl_bookings", JSON.stringify(this.bookings));
      localStorage.setItem("tl_seat_locks", JSON.stringify(this.seatLocks));
      localStorage.setItem("tl_tenants", JSON.stringify(this.tenants));
      localStorage.setItem("tl_plans", JSON.stringify(this.plans));
      localStorage.setItem("tl_buses", JSON.stringify(this.buses));
      localStorage.setItem("tl_routes", JSON.stringify(this.routes));
      localStorage.setItem("tl_counters", JSON.stringify(this.counters));
      localStorage.setItem("tl_wallets", JSON.stringify(this.wallets));
      localStorage.setItem("tl_ledger", JSON.stringify(this.ledger));
      localStorage.setItem("tl_current_user", JSON.stringify(this.currentUser));
    } catch (e) {
      console.error("Storage error:", e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private cleanExpiredLocks() {
    const now = Date.now();
    this.seatLocks = this.seatLocks.filter((lock) => lock.expiresAt > now);
  }

  // Session & User Switching
  public getCurrentUser(): Profile {
    return this.currentUser;
  }

  public switchRole(role: UserRole) {
    const found = this.users.find((u) => u.role === role);
    if (found) {
      this.currentUser = found;
    } else {
      this.currentUser = {
        id: `usr-${role}`,
        full_name: `${role.toUpperCase().replace("_", " ")} User`,
        email: `${role}@travellovers.com`,
        phone: "+880 1711-000000",
        role,
        is_super_admin: role === "super_admin",
        status: "active",
        created_at: new Date().toISOString(),
      };
    }
    this.save();
  }

  // Trips & Search
  public searchTrips(fromCity: string, toCity: string, date?: string): Trip[] {
    this.cleanExpiredLocks();
    return this.trips.filter((t) => {
      const matchFrom =
        !fromCity ||
        fromCity === "All" ||
        t.origin_city.toLowerCase() === fromCity.toLowerCase();
      const matchTo =
        !toCity ||
        toCity === "All" ||
        t.destination_city.toLowerCase() === toCity.toLowerCase();
      const matchDate = !date || t.trip_date === date;
      return matchFrom && matchTo && matchDate;
    });
  }

  public getTripById(id: string): Trip | undefined {
    return this.trips.find((t) => t.id === id);
  }

  public getAllTrips(): Trip[] {
    return this.trips;
  }

  public addTrip(newTrip: Omit<Trip, "id" | "booked_seats_count">): Trip {
    const trip: Trip = {
      ...newTrip,
      id: `trip-${Date.now()}`,
      booked_seats_count: 0,
    };
    this.trips.unshift(trip);
    this.save();
    return trip;
  }

  // Seat Management & Concurrency Control
  public getSeatsForTrip(tripId: string, currentSessionId: string): SeatMapItem[] {
    this.cleanExpiredLocks();
    const trip = this.getTripById(tripId);
    if (!trip) return [];

    // Find all booked seats for this trip
    const bookedSeatSet = new Set<string>();
    const femaleSeatSet = new Set<string>();

    this.bookings
      .filter((b) => b.trip_id === tripId && b.booking_status === "confirmed")
      .forEach((b) => {
        b.passengers.forEach((p) => {
          bookedSeatSet.add(p.seat_number);
          if (p.gender === "female") {
            femaleSeatSet.add(p.seat_number);
          }
        });
      });

    // Find all actively locked seats
    const lockedSeatsMap = new Map<string, ActiveSeatLock>();
    this.seatLocks
      .filter((lock) => lock.tripId === tripId)
      .forEach((lock) => {
        lockedSeatsMap.set(lock.seatNumber, lock);
      });

    const is2plus1 = trip.layout_type === "2+1";
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    const seats: SeatMapItem[] = [];

    rows.forEach((row) => {
      const colLimit = is2plus1 ? 3 : 4;
      for (let c = 1; c <= colLimit; c++) {
        const seatNum = `${row}${c}`;
        let status: SeatMapItem["status"] = "available";

        if (bookedSeatSet.has(seatNum)) {
          status = femaleSeatSet.has(seatNum) ? "female_booked" : "booked";
        } else if (lockedSeatsMap.has(seatNum)) {
          const lock = lockedSeatsMap.get(seatNum)!;
          if (lock.sessionId === currentSessionId) {
            status = "selected";
          } else {
            status = "locked";
          }
        }

        const isWindow = c === 1 || c === colLimit;
        const isVip = row === "A" || row === "B";

        seats.push({
          seat_number: seatNum,
          status,
          type: isVip ? "vip" : isWindow ? "window" : "standard",
          price: trip.fare_bdt + (isVip ? 100 : 0),
          row,
          col: c,
          locked_by_user: lockedSeatsMap.get(seatNum)?.role,
          lock_expires_at: lockedSeatsMap.get(seatNum)
            ? new Date(lockedSeatsMap.get(seatNum)!.expiresAt).toISOString()
            : undefined,
        });
      }
    });

    return seats;
  }

  // Atomic Lock Method
  public lockSeats(
    tripId: string,
    seatNumbers: string[],
    sessionId: string,
    role: string,
    lockMinutes: number = 10
  ): { success: boolean; message: string; expiresAt?: number } {
    this.cleanExpiredLocks();

    // Check if any seat is already booked
    const tripBookings = this.bookings.filter(
      (b) => b.trip_id === tripId && b.booking_status === "confirmed"
    );
    for (const b of tripBookings) {
      for (const p of b.passengers) {
        if (seatNumbers.includes(p.seat_number)) {
          return {
            success: false,
            message: `Seat ${p.seat_number} has already been booked.`,
          };
        }
      }
    }

    // Check if any seat is locked by someone else
    const now = Date.now();
    for (const lock of this.seatLocks) {
      if (
        lock.tripId === tripId &&
        seatNumbers.includes(lock.seatNumber) &&
        lock.sessionId !== sessionId &&
        lock.expiresAt > now
      ) {
        return {
          success: false,
          message: `Seat ${lock.seatNumber} is currently held by another customer.`,
        };
      }
    }

    // Clear previous locks for this session on this trip
    this.seatLocks = this.seatLocks.filter(
      (l) => !(l.tripId === tripId && l.sessionId === sessionId)
    );

    // Apply new locks
    const expiresAt = now + lockMinutes * 60 * 1000;
    seatNumbers.forEach((seatNum) => {
      this.seatLocks.push({
        tripId,
        seatNumber: seatNum,
        sessionId,
        role,
        expiresAt,
      });
    });

    this.save();
    return {
      success: true,
      message: `${seatNumbers.length} seat(s) held for ${lockMinutes} minutes.`,
      expiresAt,
    };
  }

  public releaseSessionLocks(tripId: string, sessionId: string) {
    this.seatLocks = this.seatLocks.filter(
      (l) => !(l.tripId === tripId && l.sessionId === sessionId)
    );
    this.save();
  }

  // Atomic Booking & Ticketing
  public createBooking(data: {
    tripId: string;
    passengers: PassengerInput[];
    paymentGateway: "bkash" | "nagad" | "sslcommerz" | "cash" | "agent_wallet";
    bookingSource: "online" | "counter" | "agent";
    counterId?: string;
    agentId?: string;
    discountBdt?: number;
    sessionId: string;
  }): { success: boolean; message: string; booking?: Booking } {
    this.cleanExpiredLocks();
    const trip = this.getTripById(data.tripId);
    if (!trip) {
      return { success: false, message: "Trip not found." };
    }

    const seatNumbers = data.passengers.map((p) => p.seat_number);

    // 1. Strict duplicate validation
    const tripBookings = this.bookings.filter(
      (b) => b.trip_id === data.tripId && b.booking_status === "confirmed"
    );
    for (const b of tripBookings) {
      for (const p of b.passengers) {
        if (seatNumbers.includes(p.seat_number)) {
          return {
            success: false,
            message: `Concurrency conflict: Seat ${p.seat_number} was just booked by another customer. Please choose other seats.`,
          };
        }
      }
    }

    // 2. Calculate Fares
    const totalFare = data.passengers.reduce((sum, p) => sum + p.fare, 0);
    const discount = data.discountBdt || 0;
    const netAmount = Math.max(0, totalFare - discount);

    // 3. Handle Agent Wallet deduction if agent booking
    if (data.paymentGateway === "agent_wallet" && data.agentId) {
      const agentWallet = this.wallets.find((w) => w.owner_id === data.agentId);
      if (agentWallet) {
        if (agentWallet.balance_bdt + agentWallet.credit_limit_bdt < netAmount) {
          return {
            success: false,
            message: "Insufficient agent wallet balance and credit limit.",
          };
        }
        agentWallet.balance_bdt -= netAmount;
      }
    }

    // 4. Generate Unique Booking & Tickets
    const bookingRef = `TL-${trip.operator_name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const bookingId = `bk-${Date.now()}`;

    const tickets: Ticket[] = data.passengers.map((p, idx) => ({
      id: `tkt-${Date.now()}-${idx + 1}`,
      booking_id: bookingId,
      ticket_number: `TKT-${bookingRef}-${p.seat_number}`,
      seat_number: p.seat_number,
      passenger_name: p.name,
      passenger_phone: p.phone,
      passenger_gender: p.gender,
      boarding_point: p.boarding_stop,
      dropping_point: p.dropping_stop,
      fare_bdt: p.fare,
      qr_code_data: JSON.stringify({
        ref: bookingRef,
        tkt: `TKT-${bookingRef}-${p.seat_number}`,
        seat: p.seat_number,
        passenger: p.name,
        tripId: trip.id,
      }),
      verification_hash: `SEC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: "active",
    }));

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      tenant_id: trip.tenant_id,
      booking_id: bookingId,
      gateway: data.paymentGateway,
      amount_bdt: netAmount,
      currency: "BDT",
      transaction_id: `TXN-${data.paymentGateway.toUpperCase()}-${Date.now().toString().slice(-8)}`,
      status: "success",
      created_at: new Date().toISOString(),
    };

    const newBooking: Booking = {
      id: bookingId,
      tenant_id: trip.tenant_id,
      trip_id: trip.id,
      customer_id: this.currentUser.id,
      booking_ref: bookingRef,
      booking_source: data.bookingSource,
      counter_id: data.counterId,
      agent_id: data.agentId,
      booked_by_user_id: this.currentUser.id,
      total_seats: data.passengers.length,
      total_fare_bdt: totalFare,
      discount_bdt: discount,
      net_amount_bdt: netAmount,
      payment_status: "paid",
      booking_status: "confirmed",
      created_at: new Date().toISOString(),
      trip,
      passengers: data.passengers,
      tickets,
      payment,
    };

    this.bookings.unshift(newBooking);

    // Update trip occupancy
    trip.booked_seats_count += data.passengers.length;

    // Release locks
    this.releaseSessionLocks(data.tripId, data.sessionId);

    // Record in Financial Ledger
    this.ledger.unshift({
      id: `led-${Date.now()}`,
      tenant_id: trip.tenant_id,
      entry_type: "income",
      account_name: `${data.bookingSource.toUpperCase()} Ticket Sale (${data.paymentGateway})`,
      amount_bdt: netAmount,
      trip_ref: bookingRef,
      notes: `${data.passengers.length} seat(s) booked for ${trip.origin_city} -> ${trip.destination_city}`,
      created_at: new Date().toISOString(),
    });

    this.save();
    return {
      success: true,
      message: "Ticket booked successfully!",
      booking: newBooking,
    };
  }

  // QR Ticket Scanning & Boarding (Conductor / Crew Portal)
  public verifyTicket(ticketNumberOrHash: string): {
    valid: boolean;
    ticket?: Ticket;
    booking?: Booking;
    trip?: Trip;
    message: string;
  } {
    for (const b of this.bookings) {
      for (const t of b.tickets) {
        if (
          t.ticket_number.toLowerCase() === ticketNumberOrHash.toLowerCase() ||
          t.verification_hash.toLowerCase() === ticketNumberOrHash.toLowerCase() ||
          t.qr_code_data.includes(ticketNumberOrHash)
        ) {
          const trip = this.getTripById(b.trip_id);
          return {
            valid: true,
            ticket: t,
            booking: b,
            trip,
            message:
              t.status === "boarded"
                ? `Already Boarded at ${t.boarded_at}`
                : "Valid Ticket. Ready for Boarding.",
          };
        }
      }
    }
    return { valid: false, message: "Invalid or unrecognized ticket." };
  }

  public boardPassenger(ticketId: string, crewId: string): { success: boolean; message: string } {
    for (const b of this.bookings) {
      const ticket = b.tickets.find((t) => t.id === ticketId);
      if (ticket) {
        if (ticket.status === "boarded") {
          return {
            success: false,
            message: `Passenger already boarded at ${ticket.boarded_at}!`,
          };
        }
        ticket.status = "boarded";
        ticket.boarded_at = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        ticket.boarded_by = crewId;
        this.save();
        return {
          success: true,
          message: `Boarding confirmed for seat ${ticket.seat_number} (${ticket.passenger_name})`,
        };
      }
    }
    return { success: false, message: "Ticket not found." };
  }

  // Booking Cancellation & Refunds
  public cancelBooking(
    bookingId: string,
    reason: string
  ): { success: boolean; message: string; refundAmount?: number } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: "Booking not found." };
    }
    if (booking.booking_status === "cancelled") {
      return { success: false, message: "Booking is already cancelled." };
    }

    const refundAmount = Math.max(0, booking.net_amount_bdt * 0.85); // 85% refund, 15% cancellation fee
    booking.booking_status = "cancelled";
    booking.payment_status = "refunded";

    booking.tickets.forEach((t) => {
      t.status = "cancelled";
    });

    const trip = this.getTripById(booking.trip_id);
    if (trip) {
      trip.booked_seats_count = Math.max(
        0,
        trip.booked_seats_count - booking.passengers.length
      );
    }

    // Ledger entry for refund
    this.ledger.unshift({
      id: `led-${Date.now()}`,
      tenant_id: booking.tenant_id,
      entry_type: "refund",
      account_name: "Customer Ticket Refund",
      amount_bdt: refundAmount,
      trip_ref: booking.booking_ref,
      notes: `Cancellation refund: ${reason}`,
      created_at: new Date().toISOString(),
    });

    this.save();
    return {
      success: true,
      message: `Booking cancelled successfully. Refund of ৳${refundAmount.toLocaleString()} has been queued.`,
      refundAmount,
    };
  }

  // Getters for specific dashboards
  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getTenants(): Tenant[] {
    return this.tenants;
  }

  public getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  public getBuses(): Bus[] {
    return this.buses;
  }

  public addBus(bus: Omit<Bus, "id">): Bus {
    const newBus: Bus = {
      ...bus,
      id: `bus-${Date.now()}`,
    };
    this.buses.unshift(newBus);
    this.save();
    return newBus;
  }

  public getRoutes(): Route[] {
    return this.routes;
  }

  public addRoute(route: Omit<Route, "id">): Route {
    const newRoute: Route = {
      ...route,
      id: `rt-${Date.now()}`,
    };
    this.routes.unshift(newRoute);
    this.save();
    return newRoute;
  }

  public getCounters(): Counter[] {
    return this.counters;
  }

  public getWallets(): Wallet[] {
    return this.wallets;
  }

  public getLedger(): FinancialLedgerEntry[] {
    return this.ledger;
  }

  public topUpWallet(walletId: string, amount: number): boolean {
    const wallet = this.wallets.find((w) => w.id === walletId);
    if (wallet) {
      wallet.balance_bdt += amount;
      this.save();
      return true;
    }
    return false;
  }
}

// Global Singleton
export const db = new DatabaseStore();
