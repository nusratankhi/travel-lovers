"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Shield,
  Building2,
  Store,
  Briefcase,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleLogin = (role: UserRole) => {
    db.switchRole(role);
    switch (role) {
      case "super_admin":
        router.push("/admin/dashboard");
        break;
      case "company_admin":
        router.push("/company/dashboard");
        break;
      case "counter_staff":
        router.push("/counter/dashboard");
        break;
      case "agent":
        router.push("/agent/dashboard");
        break;
      case "conductor":
      case "driver":
        router.push("/crew/dashboard");
        break;
      case "customer":
      default:
        router.push("/customer/dashboard");
        break;
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleRoleLogin("customer");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="relative h-12 w-44 mx-auto mb-3">
            <Image
              src="/images/logo.png"
              alt="Travel Lovers"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-black text-[#0B1F4D]">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Sign in to manage your tickets, fleets, or counter terminal
          </p>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleFormLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. sabbir@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F20D65] hover:bg-[#d80856] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
          >
            Sign In as Customer →
          </button>
        </form>

        {/* Instant Role Simulation Bar */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              One-Click Role Simulation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleRoleLogin("super_admin")}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin("company_admin")}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Company Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin("counter_staff")}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Counter POS</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin("agent")}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Agent Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin("conductor")}
              className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Crew / QR Scan</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin("customer")}
              className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <User className="w-3.5 h-3.5 text-[#F20D65] shrink-0" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{" "}
          <Link href="/register" className="font-bold text-[#F20D65] hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
