"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bus, MapPin, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import { INITIAL_TENANTS, INITIAL_COMPANIES } from "@/lib/mock-data";

export default function OperatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F20D65] bg-pink-50 px-3 py-1 rounded-full">
          Fleet Partners
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D]">
          Our Bus Operators & Transport Companies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Travel Lovers partners directly with Bangladesh's most reputable transport companies offering luxury Scania, Hyundai, and Volvo fleets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_TENANTS.map((op) => (
          <div
            key={op.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border p-1 shrink-0">
                  <Image src={op.logo_url} alt={op.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{op.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Operator
                  </span>
                </div>
              </div>

              <div className="py-3 text-xs text-slate-600 space-y-1.5">
                <p>
                  <strong>Popular Destinations:</strong> Dhaka, Chattogram, Cox's Bazar, Sylhet
                </p>
                <p>
                  <strong>Fleet Types:</strong> Scania Multi-Axle AC, Hyundai Universe 2+1
                </p>
                <p>
                  <strong>Advance Booking:</strong> Up to 30 days ahead
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Daily Departures</span>
              <Link
                href={`/search?from=Dhaka&to=Cox%27s+Bazar`}
                className="bg-[#F20D65] hover:bg-[#d80856] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Find Buses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
