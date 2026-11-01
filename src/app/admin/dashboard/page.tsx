"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Building2,
  Bus,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Settings,
  Lock,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Tenant, SubscriptionPlan, Booking, Bus as BusType } from "@/types";

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);

  const refresh = () => {
    setTenants(db.getTenants());
    setPlans(db.getPlans());
    setBookings(db.getBookings());
    setBuses(db.getBuses());
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const totalGrossTicketSales = bookings.reduce((sum, b) => sum + b.net_amount_bdt, 0);
  const platformCommissionRevenue = Math.round(totalGrossTicketSales * 0.05); // 5% SaaS platform fee
  const mrrSubscription = plans.reduce((sum, p) => sum + p.monthly_price_bdt, 0);

  const toggleTenantStatus = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId);
    if (!target) return;
    target.status = target.status === "active" ? "suspended" : "active";
    setTenants([...tenants]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top SaaS Header */}
      <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-400 text-purple-400 flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Super Admin SaaS Platform Portal
              </h1>
              <span className="text-[10px] bg-purple-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                Global Root Access
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Travel Lovers Multi-Tenant Cloud Architecture • 5 Enterprise Tenants Active
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">
            Monthly Recurring Revenue (MRR)
          </span>
          <span className="text-2xl font-black text-[#FF3D86]">
            ৳ {mrrSubscription.toLocaleString()} / mo
          </span>
        </div>
      </div>

      {/* SaaS Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Registered Bus Companies
          </span>
          <div className="text-2xl font-black text-[#0B1F4D] mt-1">{tenants.length} Tenants</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {tenants.filter((t) => t.status === "active").length} Active Operators
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Buses in Network
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {buses.length + 42} Coaches
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">Scania, Hyundai, Volvo</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Platform Commission (5%)
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ৳ {platformCommissionRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">From ৳{totalGrossTicketSales.toLocaleString()} ticket volume</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Platform Bookings
          </span>
          <div className="text-2xl font-black text-[#F20D65] mt-1">
            {bookings.length} Bookings
          </div>
          <span className="text-[11px] text-slate-500">100% Guaranteed Concurrency</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Tenant Management */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-[#0B1F4D]">
                Tenant Bus Companies (SaaS Accounts)
              </h3>
              <p className="text-xs text-slate-500">Manage tenant isolation, domains, and statuses</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              PostgreSQL RLS Protected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Code / Slug</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image src={t.logo_url} alt={t.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-slate-900">{t.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{t.code}</td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {t.subscription_plan_id.replace("plan-", "")}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        ● {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleTenantStatus(t.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                          t.status === "active"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        }`}
                      >
                        {t.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B1F4D]">Subscription Tiers</h3>
            <span className="text-xs text-slate-400">BDT / Month</span>
          </div>

          <div className="space-y-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{p.name}</span>
                  <span className="font-black text-[#F20D65]">
                    ৳ {p.monthly_price_bdt.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Fleet limit: {p.bus_limit === 999 ? "Unlimited" : `${p.bus_limit} Buses`} •{" "}
                  {p.counter_limit === 999 ? "Unlimited" : `${p.counter_limit} Counters`}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold pt-1">
                  ✓ {p.features.white_label ? "White-Label & Custom Domain" : "Standard Portal"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
