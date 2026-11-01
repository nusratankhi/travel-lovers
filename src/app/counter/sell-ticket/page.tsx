"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  Printer,
  CreditCard,
  DollarSign,
  User,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Trip, SeatMapItem, PassengerInput } from "@/types";
import SeatMap from "@/components/booking/SeatMap";

function SellTicketContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatMapItem[]>([]);
  const [sessionId] = useState(() => `pos-${Math.random().toString(36).substring(2, 9)}`);

  // Quick Passenger Fields
  const [passengerName, setPassengerName] = useState("Walk-in Passenger");
  const [passengerPhone, setPassengerPhone] = useState("+880 1711-");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash" | "nagad">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const list = db.getAllTrips();
    setTrips(list);
    if (list.length > 0) {
      setSelectedTrip(list[0]);
    }
  }, []);

  const totalFare = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleIssueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || selectedSeats.length === 0) {
      setErrorMsg("Please select at least 1 seat.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const passengerInputs: PassengerInput[] = selectedSeats.map((s, idx) => ({
      name: idx === 0 ? passengerName : `${passengerName} (${idx + 1})`,
      phone: passengerPhone,
      gender: "male",
      age: 30,
      seat_number: s.seat_number,
      fare: s.price,
      boarding_stop: selectedTrip.boarding_points[0] || "Counter Point",
      dropping_stop: selectedTrip.dropping_points[0] || "Destination Terminal",
    }));

    const res = db.createBooking({
      tripId: selectedTrip.id,
      passengers: passengerInputs,
      paymentGateway: paymentMethod,
      bookingSource: "counter",
      counterId: "cnt-rjb-01",
      sessionId,
    });

    setIsSubmitting(false);

    if (res.success && res.booking) {
      router.push(`/booking/confirmation?ref=${res.booking.booking_ref}`);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/counter/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B1F4D] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Counter Dashboard</span>
        </Link>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
          POS Walk-in Terminal (Counter #1)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Select Trip & Passenger Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#F20D65]" />
              1. Select Scheduled Trip
            </h3>

            <div className="space-y-2">
              {trips.slice(0, 4).map((t) => {
                const isSelected = selectedTrip?.id === t.id;
                const available = t.total_seats - t.booked_seats_count;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTrip(t);
                      setSelectedSeats([]);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? "border-[#F20D65] bg-pink-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {t.origin_city} → {t.destination_city} ({t.departure_time})
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {t.operator_name} • {t.bus_name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-[#F20D65] block">৳ {t.fare_bdt}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {available} seats left
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Passenger Input Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
              <User className="w-4 h-4 text-[#F20D65]" />
              2. Passenger Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Customer Mobile Phone *
                </label>
                <input
                  type="text"
                  required
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Payment Collection Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-2 rounded-lg border text-xs font-bold transition ${
                      paymentMethod === "cash"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-2 rounded-lg border text-xs font-bold transition ${
                      paymentMethod === "bkash"
                        ? "bg-[#E2136E] text-white border-[#E2136E] shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-2 rounded-lg border text-xs font-bold transition ${
                      paymentMethod === "nagad"
                        ? "bg-[#E65100] text-white border-[#E65100] shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Nagad
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Print & Confirm Button */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-500 font-bold uppercase">Total to Collect:</span>
                <span className="text-xl font-black text-[#F20D65]">
                  ৳ {totalFare.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleIssueTicket}
                disabled={isSubmitting || selectedSeats.length === 0}
                className="w-full bg-[#0B1F4D] hover:bg-[#142E63] text-white py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Confirm Payment & Print Ticket ({selectedSeats.length} Seats)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Seat Map for Counter */}
        <div className="lg:col-span-7">
          {selectedTrip ? (
            <SeatMap
              trip={selectedTrip}
              sessionId={sessionId}
              onSeatSelectionChange={(seats) => setSelectedSeats(seats)}
            />
          ) : (
            <div className="bg-white p-12 text-center text-slate-400">
              Please select a trip first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellTicketPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-600">Loading POS Terminal...</div>}>
      <SellTicketContent />
    </Suspense>
  );
}
