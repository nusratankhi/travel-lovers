"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bus, ShieldCheck, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F20D65] bg-pink-50 px-3 py-1 rounded-full">
          About Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D]">
          About Travel Lovers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          "Travel More • Worry Less" — Redefining inter-city bus travel across Bangladesh.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner">
          <Image
            src="/images/hero-reference.jpg"
            alt="Travel Lovers Fleet"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Travel Lovers</strong> is Bangladesh's first full-stack multi-tenant SaaS bus ticketing ecosystem. Designed to empower both everyday passengers and the country's most respected transport companies, our platform solves double-booking, ensures transparent fares, and eliminates friction at the counter.
          </p>
          <p>
            Whether booking online from your smartphone, buying a ticket from a physical counter POS desk, or scanning digital boarding passes via our conductor app, Travel Lovers delivers a seamless, reliable, and premium experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-center">
          <div>
            <div className="text-3xl font-black text-[#0B1F4D]">500k+</div>
            <span className="text-xs text-slate-500 font-semibold">Happy Passengers</span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#F20D65]">5+</div>
            <span className="text-xs text-slate-500 font-semibold">Tier-1 Operators</span>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600">100%</div>
            <span className="text-xs text-slate-500 font-semibold">Guaranteed Concurrency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
