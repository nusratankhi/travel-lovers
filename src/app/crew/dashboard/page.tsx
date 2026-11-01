"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  QrCode,
  Bus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Clock,
  ShieldCheck,
  Search,
  ScanLine,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Trip, Booking, Ticket } from "@/types";

export default function CrewDashboard() {
  const [currentUser] = useState(db.getCurrentUser());
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [ticketSearch, setTicketSearch] = useState("");
  const [scanResult, setScanResult] = useState<{
    valid: boolean;
    ticket?: Ticket;
    booking?: Booking;
    trip?: Trip;
    message: string;
  } | null>(null);
  const [boardFeedback, setBoardFeedback] = useState<string | null>(null);

  const refresh = () => {
    const list = db.getAllTrips();
    setTrips(list);
    if (list.length > 0 && !activeTrip) {
      setActiveTrip(list[0]);
    }
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleScanTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;

    setBoardFeedback(null);
    const result = db.verifyTicket(ticketSearch.trim());
    setScanResult(result);
  };

  const handleBoardPassenger = (ticketId: string) => {
    const res = db.boardPassenger(ticketId, currentUser.id);
    if (res.success) {
      setBoardFeedback(res.message);
      // Refresh scan result
      if (scanResult && scanResult.ticket) {
        scanResult.ticket.status = "boarded";
      }
      refresh();
    } else {
      setBoardFeedback(res.message);
    }
  };

  // Passenger manifest for current trip
  const tripBookings = activeTrip
    ? db.getBookings().filter((b) => b.trip_id === activeTrip.id && b.booking_status === "confirmed")
    : [];

  const allTickets = tripBookings.flatMap((b) => b.tickets);
  const boardedCount = allTickets.filter((t) => t.status === "boarded").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 text-indigo-400 flex items-center justify-center">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Crew & Conductor Portal — E-Ticket Scanner
              </h1>
              <span className="text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                Conductor Mode
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Trip: {activeTrip?.origin_city} → {activeTrip?.destination_city} ({activeTrip?.departure_time}) • Coach: {activeTrip?.bus_reg_no}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">
            Boarding Progress
          </span>
          <span className="text-xl font-black text-emerald-400">
            {boardedCount} / {allTickets.length} Boarded
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick QR Scanner simulation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2 pb-3 border-b border-slate-100">
              <ScanLine className="w-4 h-4 text-[#F20D65]" />
              Scan QR Code or Type Ticket #
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Scan the passenger's digital QR ticket or enter the ticket reference / security code from their SMS or paper ticket.
            </p>

            <form onSubmit={handleScanTicket} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. TL-GLP-20261031-101 or SEC-..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65] uppercase"
                />
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B1F4D] hover:bg-[#142E63] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                Verify & Scan Ticket
              </button>
            </form>

            {/* Scan Result Feedback Box */}
            {scanResult && (
              <div className="pt-2">
                {scanResult.valid && scanResult.ticket ? (
                  <div
                    className={`p-4 rounded-xl border-2 space-y-3 ${
                      scanResult.ticket.status === "boarded"
                        ? "bg-amber-50 border-amber-400 text-amber-900"
                        : "bg-emerald-50 border-emerald-500 text-emerald-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Valid Ticket Verified
                      </span>
                      <span className="text-xl font-black text-[#F20D65]">
                        Seat {scanResult.ticket.seat_number}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Passenger:</strong> {scanResult.ticket.passenger_name}
                      </div>
                      <div>
                        <strong>Phone:</strong> {scanResult.ticket.passenger_phone}
                      </div>
                      <div>
                        <strong>Boarding Point:</strong> {scanResult.ticket.boarding_point}
                      </div>
                      <div>
                        <strong>Ticket Status:</strong>{" "}
                        <span className="uppercase font-bold">
                          {scanResult.ticket.status}
                        </span>
                      </div>
                    </div>

                    {scanResult.ticket.status !== "boarded" ? (
                      <button
                        type="button"
                        onClick={() => handleBoardPassenger(scanResult.ticket!.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-xs font-bold transition shadow"
                      >
                        ✓ Confirm Passenger Boarding
                      </button>
                    ) : (
                      <div className="p-2 bg-amber-100/80 rounded text-center text-xs font-bold text-amber-800">
                        ⚠ Already Boarded at {scanResult.ticket.boarded_at || "earlier"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{scanResult.message}</span>
                  </div>
                )}
              </div>
            )}

            {boardFeedback && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold">
                {boardFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Right: Trip Passenger Manifest */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-[#0B1F4D]">
                Passenger Boarding Manifest
              </h3>
              <p className="text-xs text-slate-500">Live manifest for trip departure</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {allTickets.length} Passengers Expected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Seat</th>
                  <th className="p-2.5">Passenger</th>
                  <th className="p-2.5">Mobile</th>
                  <th className="p-2.5">Boarding Stop</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">
                      No passengers booked on this trip yet.
                    </td>
                  </tr>
                ) : (
                  allTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-2.5 font-bold text-sm text-[#F20D65]">
                        {t.seat_number}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-800">
                        {t.passenger_name}
                      </td>
                      <td className="p-2.5 text-slate-500">{t.passenger_phone}</td>
                      <td className="p-2.5 text-slate-600">{t.boarding_point}</td>
                      <td className="p-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            t.status === "boarded"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        {t.status !== "boarded" ? (
                          <button
                            type="button"
                            onClick={() => handleBoardPassenger(t.id)}
                            className="bg-[#0B1F4D] text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-[#142E63]"
                          >
                            Board
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-[11px]">
                            ✓ {t.boarded_at || "Done"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
