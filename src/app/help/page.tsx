"use client";

import React from "react";
import Link from "next/link";
import { Headphones, Phone, Mail, FileQuestion, ShieldCheck } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F20D65] bg-pink-50 px-3 py-1 rounded-full">
          Support Desk
        </span>
        <h1 className="text-3xl font-extrabold text-[#0B1F4D]">Help Center & FAQs</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Need help with your booking, seat lock, or ticket cancellation? We're available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-pink-50 text-[#F20D65] rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">24/7 Call Center</h3>
          <p className="text-xs text-slate-500">Instant hotline assistance for urgent journeys</p>
          <a
            href="tel:+8801711123456"
            className="block text-sm font-bold text-[#F20D65] hover:underline"
          >
            +880 1711 123456
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Email Support</h3>
          <p className="text-xs text-slate-500">Corporate bookings, refunds & inquiries</p>
          <a
            href="mailto:support@travellovers.com"
            className="block text-sm font-bold text-blue-600 hover:underline"
          >
            support@travellovers.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Verify E-Ticket</h3>
          <p className="text-xs text-slate-500">Check validity of your booked bus seat</p>
          <Link
            href="/ticket/verify"
            className="block text-sm font-bold text-emerald-600 hover:underline"
          >
            Verify Online →
          </Link>
        </div>
      </div>
    </div>
  );
}
