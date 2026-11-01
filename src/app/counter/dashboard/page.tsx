"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Ticket,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Printer,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Booking, Counter, Trip } from "@/types";

export default function CounterDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [activeCounter, setActiveCounter] = useState<Counter | null>(null);
  const [cashDrawerTotal, setCashDrawerTotal] = useState(18400);

  useEffect(() => {
    const list = db.getBookings();
    setBookings(list);
    const cnts = db.getCounters();
    setCounters(cnts);
    if (cnts.length > 0) setActiveCounter(cnts[0]);

    const unsub = db.subscribe(() => {
      setBookings(db.getBookings());
    });
    return unsub;
  }, []);

  const counterBookings = bookings.filter((b) => b.booking_source === "counter");
  const todayTotalCash = counterBookings.reduce((sum, b) => sum + b.net_amount_bdt, 0);

  const handleCloseShift = () => {
    alert(
      `Shift Closed Successfully!\nCounter: ${activeCounter?.name}\nTotal Cash Collected: ৳${(todayTotalCash + cashDrawerTotal).toLocaleString()}\nReceipt printed.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Counter Bar */}
      <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Counter POS Terminal</h1>
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                Online & Synced
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Active Counter: {activeCounter?.name} ({activeCounter?.counter_code}) • Rajarbagh Head Depot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCloseShift}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition"
          >
            Daily Cash Closing
          </button>
          <Link
            href="/counter/sell-ticket"
            className="bg-[#F20D65] hover:bg-[#d80856] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-pink-500/25 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Ticket Now (Walk-in)</span>
          </Link>
        </div>
      </div>

      {/* POS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Counter Sales Today
          </span>
          <div className="text-2xl font-black text-[#0B1F4D] mt-1">
            ৳ {todayTotalCash.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Walk-in customers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tickets Issued
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {counterBookings.reduce((sum, b) => sum + b.total_seats, 0)} Seats
          </div>
          <span className="text-[11px] text-slate-500">From counter desk</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Cash in Drawer
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ৳ {(todayTotalCash + cashDrawerTotal).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Opening: ৳18,400</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Next Bus Departure
          </span>
          <div className="text-xl font-black text-[#F20D65] mt-1">
            10:30 PM (Cox's Bazar)
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">GL-VIP-201 Scania</span>
        </div>
      </div>

      {/* Counter Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-[#0B1F4D]">Recent Counter Ticket Sales</h3>
            <p className="text-xs text-slate-500">Live feed of tickets printed at this terminal</p>
          </div>
          <Link
            href="/counter/sell-ticket"
            className="text-xs font-bold text-[#F20D65] hover:underline"
          >
            + New Sale
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Booking Ref</th>
                <th className="p-3">Route</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Primary Passenger</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {bookings.slice(0, 8).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {b.booking_ref}
                  </td>
                  <td className="p-3">
                    {b.trip?.origin_city} → {b.trip?.destination_city}
                  </td>
                  <td className="p-3">
                    <span className="bg-[#0B1F4D] text-white px-2 py-0.5 rounded font-bold">
                      {b.passengers.map((p) => p.seat_number).join(", ")}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">
                    {b.passengers[0]?.name}
                  </td>
                  <td className="p-3 uppercase font-bold text-slate-600">
                    {b.payment?.gateway}
                  </td>
                  <td className="p-3 font-bold text-[#F20D65]">
                    ৳ {b.net_amount_bdt.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                      {b.booking_status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/booking/confirmation?ref=${b.booking_ref}`}
                      className="p-1.5 text-slate-600 hover:text-[#0B1F4D] inline-block"
                      title="Reprint Thermal Ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
