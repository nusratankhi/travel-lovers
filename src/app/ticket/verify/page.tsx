"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Printer,
  Bus,
  MapPin,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Ticket, Booking, Trip } from "@/types";

export default function TicketVerifyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    ticket?: Ticket;
    booking?: Booking;
    trip?: Trip;
    message: string;
  } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setHasSearched(true);
    const result = db.verifyTicket(searchTerm.trim());
    setVerificationResult(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F20D65]" />
          Official Verification Portal
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B1F4D]">
          Verify Bus E-Ticket
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Ticket Number, Booking Reference (e.g. TL-GLP-...), or Verification Hash to confirm ticket legitimacy.
        </p>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-xl mx-auto mb-8">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ticket Number / Booking Reference / Code
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. TL-GLP-20261031-101 or SEC-..."
                className="w-full text-sm font-semibold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65] uppercase"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B1F4D] hover:bg-[#142E63] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
          >
            Verify Authenticity
          </button>
        </form>
      </div>

      {/* Verification Result */}
      {hasSearched && verificationResult && (
        <div className="max-w-2xl mx-auto">
          {verificationResult.valid && verificationResult.ticket ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-lg space-y-4">
              <div className="bg-emerald-500 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-extrabold text-sm uppercase tracking-wide">
                    Genuine & Valid Ticket
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  Status: {verificationResult.ticket.status.toUpperCase()}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Passenger Name
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {verificationResult.ticket.passenger_name}
                    </span>
                    <span className="text-slate-500 block">
                      {verificationResult.ticket.passenger_phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Assigned Seat
                    </span>
                    <span className="text-2xl font-black text-[#F20D65]">
                      {verificationResult.ticket.seat_number}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Route
                    </span>
                    <span className="font-bold text-slate-800">
                      {verificationResult.trip?.origin_city} →{" "}
                      {verificationResult.trip?.destination_city}
                    </span>
                    <span className="text-slate-500 block">
                      {verificationResult.trip?.operator_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Departure
                    </span>
                    <span className="font-bold text-slate-800">
                      {verificationResult.trip?.departure_time}
                    </span>
                    <span className="text-slate-500 block">
                      {verificationResult.trip?.trip_date}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Ticket Ref
                    </span>
                    <span className="font-mono text-slate-700">
                      {verificationResult.ticket.ticket_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Security Hash
                    </span>
                    <span className="font-mono text-slate-700 font-bold">
                      {verificationResult.ticket.verification_hash}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
              <XCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="font-bold text-sm text-red-900">Ticket Not Recognized</h3>
              <p className="text-xs text-red-700 max-w-sm mx-auto">
                No matching active ticket found for "{searchTerm}". Please check the characters or contact Travel Lovers customer helpline.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
