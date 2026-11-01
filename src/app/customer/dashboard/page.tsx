"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Printer,
  XCircle,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Booking } from "@/types";

export default function CustomerDashboard() {
  const [currentUser] = useState(db.getCurrentUser());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  const refresh = () => {
    const list = db.getBookings();
    setBookings(list);
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleCancelBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;

    const res = db.cancelBooking(cancelModalBooking.id, cancelReason || "Customer schedule change");
    if (res.success) {
      setCancelFeedback(res.message);
      setTimeout(() => {
        setCancelModalBooking(null);
        setCancelFeedback(null);
        setCancelReason("");
      }, 2000);
    } else {
      setCancelFeedback(res.message);
    }
  };

  const activeBookings = bookings.filter((b) => b.booking_status === "confirmed");
  const cancelledBookings = bookings.filter((b) => b.booking_status === "cancelled");
  const totalSpent = activeBookings.reduce((sum, b) => sum + b.net_amount_bdt, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Welcome Header */}
      <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#142E63] border-2 border-[#FF3D86] flex items-center justify-center text-xl font-bold text-white shrink-0">
            {currentUser.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{currentUser.full_name}</h1>
              <span className="text-[10px] bg-[#F20D65] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Passenger
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentUser.phone} • {currentUser.email}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="bg-[#F20D65] hover:bg-[#d80856] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm"
        >
          Book New Bus Ticket →
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Confirmed Trips
          </span>
          <div className="text-2xl font-black text-[#0B1F4D] mt-1">
            {activeBookings.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active e-tickets</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Cancelled / Refunded
          </span>
          <div className="text-2xl font-black text-slate-700 mt-1">
            {cancelledBookings.length}
          </div>
          <span className="text-[11px] text-slate-500">Processed refunds</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Ticket Spend
          </span>
          <div className="text-2xl font-black text-[#F20D65] mt-1">
            ৳ {totalSpent.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">Travel Lovers Member</span>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#F20D65]" />
            My Bookings & E-Tickets
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No bookings yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't booked any bus trips yet. Plan your journey and book directly with Bangladesh's top operators.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block bg-[#F20D65] text-white text-xs font-bold px-5 py-2.5 rounded-full"
            >
              Search Buses Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isConfirmed = booking.booking_status === "confirmed";

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0B1F4D] text-sm">
                          {booking.booking_ref}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isConfirmed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.booking_status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Booked on {new Date(booking.created_at).toLocaleDateString("en-GB")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/booking/confirmation?ref=${booking.booking_ref}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F4D] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Tickets</span>
                      </Link>

                      {isConfirmed && (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(booking)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Trip</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route & Passenger breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Operator & Bus
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {booking.trip?.operator_name}
                      </span>
                      <span className="text-slate-500 block">
                        {booking.trip?.bus_name} ({booking.trip?.bus_type})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Journey Details
                      </span>
                      <span className="font-bold text-slate-800">
                        {booking.trip?.origin_city} → {booking.trip?.destination_city}
                      </span>
                      <span className="text-slate-500 block">
                        Departure: {booking.trip?.departure_time} ({booking.trip?.trip_date})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Seats & Net Fare
                      </span>
                      <span className="font-extrabold text-[#F20D65]">
                        Seats: {booking.passengers.map((p) => p.seat_number).join(", ")}
                      </span>
                      <span className="text-slate-700 block font-bold">
                        Paid: ৳ {booking.net_amount_bdt.toLocaleString()} ({booking.payment?.gateway})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-black text-lg text-slate-900">Cancel Bus Booking?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel booking{" "}
              <strong>{cancelModalBooking.booking_ref}</strong>? Under Travel Lovers policy, 85% of fare (৳
              {(cancelModalBooking.net_amount_bdt * 0.85).toLocaleString()}) will be refunded to your original payment method.
            </p>

            <form onSubmit={handleCancelBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  required
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Change in travel plans, family emergency..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              {cancelFeedback && (
                <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-slate-800">
                  {cancelFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition"
                >
                  Confirm Cancellation & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
