"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Clock,
  Wifi,
  Zap,
  Coffee,
  Check,
  ChevronDown,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Trip, SeatMapItem } from "@/types";
import SeatMap from "@/components/booking/SeatMap";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromCityParam = searchParams.get("from") || "Dhaka";
  const toCityParam = searchParams.get("to") || "Cox's Bazar";
  const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const busTypeParam = searchParams.get("busType") || "All Types";

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatMapItem[]>([]);
  const [sessionId] = useState(() => `sess-${Math.random().toString(36).substring(2, 9)}`);

  // Filters
  const [filterAcOnly, setFilterAcOnly] = useState(busTypeParam === "AC");
  const [filterOperator, setFilterOperator] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"time" | "price_asc" | "price_desc">("time");

  useEffect(() => {
    const results = db.searchTrips(fromCityParam, toCityParam, dateParam);
    setTrips(results);
  }, [fromCityParam, toCityParam, dateParam]);

  // Filter & Sort
  const filteredTrips = trips
    .filter((trip) => {
      if (filterAcOnly && trip.bus_type !== "AC") return false;
      if (filterOperator !== "All" && trip.operator_name !== filterOperator) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.fare_bdt - b.fare_bdt;
      if (sortBy === "price_desc") return b.fare_bdt - a.fare_bdt;
      return a.departure_time.localeCompare(b.departure_time);
    });

  const handleProceedToCheckout = (trip: Trip) => {
    if (selectedSeats.length === 0) {
      alert("Please select at least 1 seat to proceed.");
      return;
    }
    const seatNumbers = selectedSeats.map((s) => s.seat_number).join(",");
    router.push(
      `/booking/checkout?tripId=${trip.id}&seats=${seatNumbers}&sessionId=${sessionId}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#142E63] rounded-2xl p-6 text-white mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#FF3D86] mb-1">
              <span>Bus Search Results</span>
              <span>•</span>
              <span>{new Date(dateParam).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              <span>{fromCityParam}</span>
              <span className="text-[#F20D65]">→</span>
              <span>{toCityParam}</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Showing {filteredTrips.length} available bus services
            </p>
          </div>

          <Link
            href="/"
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full font-semibold transition"
          >
            Modify Search
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#F20D65]" />
                Filters
              </span>
              <button
                type="button"
                onClick={() => {
                  setFilterAcOnly(false);
                  setFilterOperator("All");
                  setSortBy("time");
                }}
                className="text-xs text-[#F20D65] hover:underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#F20D65]"
              >
                <option value="time">Earliest Departure</option>
                <option value="price_asc">Lowest Price First</option>
                <option value="price_desc">Highest Price First</option>
              </select>
            </div>

            {/* Bus Operator Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Bus Operator
              </label>
              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#F20D65]"
              >
                <option value="All">All Operators</option>
                <option value="Green Line Paribahan">Green Line Paribahan</option>
                <option value="Shohagh Paribahan">Shohagh Paribahan</option>
                <option value="Hanif Enterprise">Hanif Enterprise</option>
                <option value="Ena Transport">Ena Transport</option>
                <option value="Shyamoli NR Travels">Shyamoli NR Travels</option>
              </select>
            </div>

            {/* AC Filter */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={filterAcOnly}
                  onChange={(e) => setFilterAcOnly(e.target.checked)}
                  className="rounded text-[#F20D65] focus:ring-[#F20D65] w-4 h-4"
                />
                <span>AC Coaches Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="lg:col-span-9 space-y-4">
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 text-[#F20D65] mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Trips Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No scheduled buses matched your current search filters. Try selecting a different date or clearing the operator filters.
              </p>
              <button
                onClick={() => {
                  setFilterAcOnly(false);
                  setFilterOperator("All");
                }}
                className="bg-[#F20D65] text-white text-xs font-bold px-5 py-2.5 rounded-full"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const isExpanded = selectedTripId === trip.id;
              const availableSeats = trip.total_seats - trip.booked_seats_count;

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition"
                >
                  {/* Trip Card Main Body */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Operator & Bus Name */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border p-1 shrink-0">
                        <Image
                          src={trip.operator_logo}
                          alt={trip.operator_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{trip.operator_name}</h4>
                        <p className="text-xs text-slate-500">{trip.bus_name}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {trip.bus_type} • {trip.layout_type}
                        </span>
                      </div>
                    </div>

                    {/* Schedule & Duration */}
                    <div className="md:col-span-4 flex items-center justify-between text-center px-2">
                      <div>
                        <div className="text-base font-extrabold text-[#0B1F4D]">
                          {trip.departure_time}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {trip.origin_city}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-medium">Approx 8 hrs</span>
                        <div className="w-20 h-0.5 bg-slate-300 relative my-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F20D65] absolute right-0 -top-0.5" />
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">Direct Route</span>
                      </div>

                      <div>
                        <div className="text-base font-extrabold text-[#0B1F4D]">
                          {trip.arrival_time}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {trip.destination_city}
                        </div>
                      </div>
                    </div>

                    {/* Fare, Seats & Action Button */}
                    <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-5">
                      <div className="text-right">
                        <div className="text-lg font-black text-[#F20D65]">
                          ৳ {trip.fare_bdt.toLocaleString()}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600">
                          <span className={availableSeats <= 5 ? "text-red-600 font-bold" : "text-emerald-600"}>
                            {availableSeats} seats left
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (isExpanded) {
                            setSelectedTripId(null);
                            setSelectedSeats([]);
                          } else {
                            setSelectedTripId(trip.id);
                            setSelectedSeats([]);
                          }
                        }}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
                          isExpanded
                            ? "bg-[#0B1F4D] text-white"
                            : "bg-[#F20D65] hover:bg-[#d80856] text-white"
                        }`}
                      >
                        {isExpanded ? "Close Map" : "View Seats"}
                      </button>
                    </div>
                  </div>

                  {/* Amenities & Boarding points mini-strip */}
                  <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>Amenities: {trip.amenities.slice(0, 4).join(" • ")}</span>
                    </div>
                    <div className="font-semibold text-slate-600">
                      Boarding: {trip.boarding_points[0]}
                    </div>
                  </div>

                  {/* EXPANDED INTERACTIVE SEAT SELECTION DRAWER */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-5 space-y-4">
                      <SeatMap
                        trip={trip}
                        sessionId={sessionId}
                        onSeatSelectionChange={(seats) => setSelectedSeats(seats)}
                      />

                      {selectedSeats.length > 0 && (
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => handleProceedToCheckout(trip)}
                            className="bg-[#F20D65] hover:bg-[#d80856] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-pink-500/25 transition cursor-pointer"
                          >
                            Proceed to Passenger Details ({selectedSeats.length} Seats) →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-600">Loading Search Results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
