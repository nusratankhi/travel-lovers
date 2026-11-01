"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Bus } from "lucide-react";
import { POPULAR_ROUTES } from "@/lib/mock-data";

export default function RoutesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F20D65] bg-pink-50 px-3 py-1 rounded-full">
          Inter-District Routes
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D]">
          Popular Bus Routes in Bangladesh
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Explore daily luxury coach departures connecting Dhaka, Chattogram, Cox's Bazar, Sylhet, Rajshahi, and Khulna with guaranteed seat reservation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_ROUTES.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Express Highway
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Daily Services
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-lg font-black text-[#0B1F4D] flex items-center gap-2">
                  <span>{route.origin_city}</span>
                  <span className="text-[#F20D65]">→</span>
                  <span>{route.destination_city}</span>
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span>Distance: {route.distance_km} km</span>
                  <span>•</span>
                  <span>Duration: ~{Math.floor(route.estimated_duration_mins / 60)} hrs</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Starting Fare
                </span>
                <span className="text-xl font-black text-[#F20D65]">
                  ৳ {route.base_fare_bdt}
                </span>
              </div>

              <Link
                href={`/search?from=${encodeURIComponent(route.origin_city)}&to=${encodeURIComponent(route.destination_city)}`}
                className="bg-[#0B1F4D] hover:bg-[#142E63] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>View Buses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
