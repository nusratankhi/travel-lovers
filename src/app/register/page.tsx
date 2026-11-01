"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db-store";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    db.switchRole("customer");
    router.push("/customer/dashboard");
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
          <h2 className="text-xl font-black text-[#0B1F4D]">Create an Account</h2>
          <p className="text-xs text-slate-500">
            Book bus tickets faster, save favorite routes, and manage refunds easily
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Sabbir Hossain"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs font-semibold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="e.g. +880 1715-998877"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-semibold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. sabbir@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold p-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
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
            className="w-full bg-[#F20D65] hover:bg-[#d80856] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
          >
            Create Customer Account →
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#F20D65] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
