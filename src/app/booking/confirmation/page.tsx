"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Printer,
  Download,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Bus,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";
import QRCode from "qrcode";
import { db } from "@/lib/db-store";
import { Booking } from "@/types";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ref) return;
    const allBookings = db.getBookings();
    const found = allBookings.find((b) => b.booking_ref === ref);
    if (found) {
      setBooking(found);

      // Generate real QR code image data URLs for each ticket
      found.tickets.forEach(async (t) => {
        try {
          const url = await QRCode.toDataURL(t.qr_code_data, {
            width: 140,
            margin: 1,
            color: { dark: "#0B1F4D", light: "#FFFFFF" },
          });
          setQrCodeUrls((prev) => ({ ...prev, [t.id]: url }));
        } catch (e) {
          console.error("QR Code generation error:", e);
        }
      });
    }
  }, [ref]);

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Booking reference not found</h2>
        <Link href="/" className="mt-4 inline-block text-sm text-[#F20D65] font-semibold underline">
          ← Return to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Success Notification Bar (no-print) */}
      <div className="no-print bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 mb-8 shadow-sm">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-emerald-900">
          Booking Confirmed & Paid!
        </h1>
        <p className="text-xs text-emerald-700 max-w-md mx-auto">
          Your journey is confirmed. A digital ticket and SMS confirmation have been sent to your mobile phone number.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#0B1F4D] hover:bg-[#142E63] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print E-Tickets</span>
          </button>
          <Link
            href="/customer/dashboard"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm"
          >
            <span>My Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* PRINTABLE DIGITAL TICKETS */}
      <div className="space-y-6">
        {booking.tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-md print:border print:shadow-none"
          >
            {/* Ticket Header */}
            <div className="bg-[#0B1F4D] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#142E63]">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-32 bg-white rounded p-1">
                  <Image
                    src="/images/logo.png"
                    alt="Travel Lovers"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">
                    {booking.trip?.operator_name || "Travel Lovers Partner"}
                  </h3>
                  <span className="text-[10px] text-pink-300 uppercase tracking-widest font-bold">
                    Official Boarding Pass
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Ticket Number
                </span>
                <span className="text-xs font-mono font-bold bg-[#142E63] px-2.5 py-1 rounded text-white border border-blue-900">
                  {ticket.ticket_number}
                </span>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Journey Route & Timings */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      From (Boarding Point)
                    </span>
                    <span className="text-base font-extrabold text-[#0B1F4D] block">
                      {booking.trip?.origin_city}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold block">
                      {ticket.boarding_point}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      To (Dropping Point)
                    </span>
                    <span className="text-base font-extrabold text-[#0B1F4D] block">
                      {booking.trip?.destination_city}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold block">
                      {ticket.dropping_point}
                    </span>
                  </div>
                </div>

                {/* Passenger Info & Seat */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Passenger
                    </span>
                    <span className="font-bold text-slate-800">{ticket.passenger_name}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {ticket.passenger_phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Seat No.
                    </span>
                    <span className="text-base font-black text-[#F20D65]">
                      {ticket.seat_number}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Coach Type
                    </span>
                    <span className="font-bold text-slate-800">
                      {booking.trip?.bus_type} Luxury
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Reg: {booking.trip?.bus_reg_no}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Ticket Fare
                    </span>
                    <span className="font-bold text-slate-800">
                      ৳ {ticket.fare_bdt.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Paid via {booking.payment?.gateway.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code & Conductor Verification Hash */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                {qrCodeUrls[ticket.id] ? (
                  <div className="relative w-28 h-28 bg-white p-1 rounded-lg border shadow-sm">
                    <img
                      src={qrCodeUrls[ticket.id]}
                      alt="Ticket QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-[10px] text-slate-500">
                    Generating QR...
                  </div>
                )}

                <span className="mt-2 text-[10px] uppercase font-bold text-slate-400">
                  Verification Code
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 tracking-wider">
                  {ticket.verification_hash}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">
                  Scan with Conductor App to Board
                </span>
              </div>
            </div>

            {/* Ticket Footer / Instructions */}
            <div className="bg-slate-100 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
              <span>
                Please arrive at the counter 20 minutes before departure time with this digital ticket or printed copy.
              </span>
              <span className="font-bold text-[#0B1F4D]">
                Ref: {booking.booking_ref}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-600">Loading Confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
