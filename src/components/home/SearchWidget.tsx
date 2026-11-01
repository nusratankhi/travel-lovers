"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bus,
  Store,
  Briefcase,
  MapPin,
  Calendar,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import { format } from "date-fns";

const CITIES = [
  "Dhaka",
  "Chattogram",
  "Cox's Bazar",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Bogura",
  "Comilla",
  "Benapole",
];

const BUS_TYPES = ["All Types", "AC", "Non-AC", "Sleeper"];

export default function SearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"online" | "counter" | "agent">("online");
  const [fromCity, setFromCity] = useState("Dhaka");
  const [toCity, setToCity] = useState("Cox's Bazar");
  const [journeyDate, setJourneyDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [busType, setBusType] = useState("All Types");

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "counter") {
      router.push(`/counter/sell-ticket?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${journeyDate}`);
      return;
    }
    if (activeTab === "agent") {
      router.push(`/agent/dashboard?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${journeyDate}`);
      return;
    }
    router.push(
      `/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${journeyDate}&busType=${encodeURIComponent(busType)}`
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 3 Booking Tabs matching reference image */}
      <div className="flex items-center gap-1 sm:gap-2 mb-0 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("online")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === "online"
              ? "bg-[#F20D65] text-white"
              : "bg-white/90 text-slate-700 hover:bg-white"
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Online Booking</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("counter")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === "counter"
              ? "bg-[#F20D65] text-white"
              : "bg-white/90 text-slate-700 hover:bg-white"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Counter Booking</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agent")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold transition shadow-sm ${
            activeTab === "agent"
              ? "bg-[#F20D65] text-white"
              : "bg-white/90 text-slate-700 hover:bg-white"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Agent Booking</span>
        </button>
      </div>

      {/* Main Search Bar Form */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl sm:rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* FROM CITY */}
          <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-blue-400 transition relative">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              From
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F20D65] shrink-0" />
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="hidden md:flex md:col-span-1 justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-100 hover:bg-[#F20D65] hover:text-white text-slate-600 transition shadow-sm border border-slate-200"
              title="Swap Departure and Destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* TO CITY */}
          <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-blue-400 transition">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              To
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B1F4D] shrink-0" />
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* JOURNEY DATE */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-blue-400 transition">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Journey Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F20D65] shrink-0" />
              <input
                type="date"
                value={journeyDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* BUS TYPE */}
          <div className="md:col-span-1.5 lg:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-blue-400 transition">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Bus Type
            </label>
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {BUS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH BUTTON */}
          <div className="md:col-span-1.5 lg:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#F20D65] hover:bg-[#d80856] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Buses</span>
            </button>
          </div>
        </form>

        {activeTab === "counter" && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
            <span>
              <strong>Counter Mode:</strong> Walk-in customer ticketing with instant cash collection & thermal printer support.
            </span>
            <span className="font-semibold underline cursor-pointer" onClick={() => router.push("/counter/dashboard")}>
              Go to Counter Terminal →
            </span>
          </div>
        )}

        {activeTab === "agent" && (
          <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
            <span>
              <strong>Agent B2B Mode:</strong> Book tickets using agent wallet credit with 7.5% commission settlement.
            </span>
            <span className="font-semibold underline cursor-pointer" onClick={() => router.push("/agent/dashboard")}>
              Go to Agent Portal →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
