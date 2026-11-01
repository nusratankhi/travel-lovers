"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Bus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Printer,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Bus as BusType, Route, Trip, FinancialLedgerEntry, Booking } from "@/types";

export default function CompanyDashboard() {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [ledger, setLedger] = useState<FinancialLedgerEntry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modals
  const [addBusModalOpen, setAddBusModalOpen] = useState(false);
  const [newBusNumber, setNewBusNumber] = useState("");
  const [newBusRegNo, setNewBusRegNo] = useState("");
  const [newBusType, setNewBusType] = useState("Scania Multi-Axle Luxury AC");

  const [addRouteModalOpen, setAddRouteModalOpen] = useState(false);
  const [newOrigin, setNewOrigin] = useState("Dhaka");
  const [newDestination, setNewDestination] = useState("Cox's Bazar");
  const [newFare, setNewFare] = useState("1200");

  const refresh = () => {
    setBuses(db.getBuses());
    setRoutes(db.getRoutes());
    setTrips(db.getAllTrips());
    setLedger(db.getLedger());
    setBookings(db.getBookings());
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusRegNo.trim()) return;

    db.addBus({
      tenant_id: "tenant-glp",
      company_id: "comp-glp",
      reg_no: newBusRegNo.trim(),
      bus_number: newBusNumber.trim() || "GL-Express",
      bus_type_id: "bt-scania",
      bus_type_name: newBusType,
      seat_layout_id: "layout-2-2-36",
      total_seats: 36,
      fitness_expiry: "2027-12-31",
      tax_token_expiry: "2027-12-31",
      status: "active",
      company_name: "Green Line Paribahan",
    });

    setAddBusModalOpen(false);
    setNewBusRegNo("");
    setNewBusNumber("");
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    db.addRoute({
      tenant_id: "tenant-glp",
      company_id: "comp-glp",
      origin_city: newOrigin,
      destination_city: newDestination,
      distance_km: 300,
      estimated_duration_mins: 420,
      base_fare_bdt: parseFloat(newFare) || 800,
      status: "active",
    });

    setAddRouteModalOpen(false);
  };

  const companyTrips = trips.filter((t) => t.tenant_id === "tenant-glp");
  const totalRevenue = bookings.reduce((sum, b) => sum + b.net_amount_bdt, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#142E63] border-2 border-[#FF3D86] flex items-center justify-center text-xl font-bold text-white shrink-0">
            GL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Green Line Paribahan — Company Portal
              </h1>
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                Active Tenant
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Multi-Tenant SaaS Isolation • Plan: Enterprise Transport (Unlimited Fleet)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddBusModalOpen(true)}
            className="bg-[#142E63] hover:bg-[#1a3a7c] text-white border border-blue-900 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Bus</span>
          </button>
          <button
            onClick={() => setAddRouteModalOpen(true)}
            className="bg-[#F20D65] hover:bg-[#d80856] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Route</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Fleet Size
          </span>
          <div className="text-2xl font-black text-[#0B1F4D] mt-1">{buses.length} Coaches</div>
          <span className="text-[11px] text-emerald-600 font-semibold">All Active & Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Scheduled Trips
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {companyTrips.length} Trips
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">Today & Tomorrow</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Gross Ticket Sales
          </span>
          <div className="text-2xl font-black text-[#F20D65] mt-1">
            ৳ {totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Online, Counter & Agents</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Operational Routes
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {routes.length} Routes
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Dhaka, CTG, Cox's Bazar</span>
        </div>
      </div>

      {/* Bus Fleet & Route Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left: Registered Buses */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#F20D65]" />
              Registered Fleet Coaches
            </h3>
            <button
              onClick={() => setAddBusModalOpen(true)}
              className="text-xs font-bold text-[#F20D65] hover:underline"
            >
              + Add Coach
            </button>
          </div>

          <div className="space-y-3">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{bus.bus_number}</span>
                  <span className="text-[11px] text-slate-500">{bus.reg_no}</span>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
                    {bus.bus_type_name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-800 block">{bus.total_seats} Seats</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">
                    ● {bus.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Routes */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B1F4D]" />
              Company Routes & Base Fares
            </h3>
            <button
              onClick={() => setAddRouteModalOpen(true)}
              className="text-xs font-bold text-[#F20D65] hover:underline"
            >
              + Add Route
            </button>
          </div>

          <div className="space-y-3">
            {routes.map((rt) => (
              <div
                key={rt.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {rt.origin_city} ⇄ {rt.destination_city}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {rt.distance_km} km • Approx {Math.floor(rt.estimated_duration_mins / 60)} hrs
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-[#F20D65] text-sm block">
                    ৳ {rt.base_fare_bdt}
                  </span>
                  <span className="text-[10px] text-slate-500">Base Ticket Fare</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Ledger Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-[#0B1F4D] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#F20D65]" />
              Immutable Financial Ledger
            </h3>
            <p className="text-xs text-slate-500">Auditable log of income, fuel, commissions and refunds</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Account / Description</th>
                <th className="p-3">Reference / Counter</th>
                <th className="p-3 text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 text-slate-500">
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.entry_type === "income"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.entry_type === "expense"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.entry_type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{item.account_name}</td>
                  <td className="p-3 text-slate-500">{item.trip_ref || item.counter_name || "—"}</td>
                  <td
                    className={`p-3 text-right font-black ${
                      item.entry_type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {item.entry_type === "income" ? "+" : "-"} ৳ {item.amount_bdt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Modal */}
      {addBusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-slate-900">Register New Fleet Bus</h3>
            <form onSubmit={handleAddBus} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Bus Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Metro-Ba-15-9922"
                  value={newBusRegNo}
                  onChange={(e) => setNewBusRegNo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Bus Coach Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GL-Scania-105"
                  value={newBusNumber}
                  onChange={(e) => setNewBusNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Bus Model</label>
                <select
                  value={newBusType}
                  onChange={(e) => setNewBusType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="Scania Multi-Axle Luxury AC">Scania Multi-Axle Luxury AC (36 Seats)</option>
                  <option value="Hyundai Universe Business Class (2+1)">Hyundai Universe Business Class (28 Seats)</option>
                  <option value="Volvo 9400 Multi-Axle AC">Volvo 9400 Multi-Axle AC (36 Seats)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddBusModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0B1F4D] text-white rounded-xl shadow"
                >
                  Register Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {addRouteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-slate-900">Create New Route</h3>
            <form onSubmit={handleAddRoute} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Origin City</label>
                  <input
                    type="text"
                    required
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Base Ticket Fare (BDT)
                </label>
                <input
                  type="number"
                  required
                  value={newFare}
                  onChange={(e) => setNewFare(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddRouteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#F20D65] text-white rounded-xl shadow"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
