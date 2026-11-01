"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Wallet as WalletIcon,
  DollarSign,
  PlusCircle,
  Percent,
  CheckCircle2,
  TrendingUp,
  Printer,
  Bus,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Wallet, Booking, Trip } from "@/types";

export default function AgentDashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [topUpAmount, setTopUpAmount] = useState("10000");
  const [topUpFeedback, setTopUpFeedback] = useState<string | null>(null);

  const refresh = () => {
    const wList = db.getWallets();
    setWallets(wList);
    const agentW = wList.find((w) => w.owner_type === "agent");
    if (agentW) setActiveWallet(agentW);
    setBookings(db.getBookings());
  };

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWallet) return;
    const amt = parseFloat(topUpAmount) || 0;
    if (amt <= 0) return;

    const ok = db.topUpWallet(activeWallet.id, amt);
    if (ok) {
      setTopUpFeedback(`Successfully credited ৳${amt.toLocaleString()} to Agent Wallet!`);
      setTimeout(() => setTopUpFeedback(null), 3000);
      refresh();
    }
  };

  const agentBookings = bookings.filter((b) => b.booking_source === "agent");
  const totalCommissionEarned = bookings.reduce((sum, b) => sum + b.net_amount_bdt * 0.075, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Agent B2B Portal — Prime Travels
              </h1>
              <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                Gold Partner
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Authorized B2B Partner for Green Line, Shohagh, Shyamoli, Hanif & Ena
            </p>
          </div>
        </div>

        <Link
          href="/search"
          className="bg-[#F20D65] hover:bg-[#d80856] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-pink-500/25 transition flex items-center gap-2"
        >
          <Bus className="w-4 h-4" />
          <span>Book Tickets with Agent Credit →</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Wallet Balance
          </span>
          <div className="text-2xl font-black text-[#0B1F4D] mt-1">
            ৳ {activeWallet?.balance_bdt.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active & Usable</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Approved Credit Line
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            ৳ {activeWallet?.credit_limit_bdt.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Overdraft protection</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Agent Commission Rate
          </span>
          <div className="text-2xl font-black text-[#F20D65] mt-1">7.50%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Instant settlement</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Commission Earned
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1">
            ৳ {Math.round(totalCommissionEarned).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Credited to wallet</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Wallet Top-up form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2 pb-3 border-b border-slate-100">
            <WalletIcon className="w-4 h-4 text-[#F20D65]" />
            Instant Wallet Recharge
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed">
            Recharge your B2B wallet via bank transfer, bKash Merchant pay, or company cheque to continue issuing tickets smoothly.
          </p>

          <form onSubmit={handleTopUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Top-Up Amount (BDT)
              </label>
              <div className="flex gap-2">
                {["5000", "10000", "25000", "50000"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      topUpAmount === amt
                        ? "bg-[#0B1F4D] text-white border-[#0B1F4D]"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    ৳{parseInt(amt) / 1000}k
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full mt-2 text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            {topUpFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{topUpFeedback}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0B1F4D] hover:bg-[#142E63] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
            >
              Recharge Agent Wallet
            </button>
          </form>
        </div>

        {/* B2B Bookings Feed */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0B1F4D]">
              Agent Issued Tickets & Commissions
            </h3>
            <span className="text-xs text-slate-400">Live Commission Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Ref</th>
                  <th className="p-2.5">Passenger</th>
                  <th className="p-2.5">Seats</th>
                  <th className="p-2.5">Gross Fare</th>
                  <th className="p-2.5 text-right">Commission (7.5%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.slice(0, 5).map((b) => {
                  const comm = Math.round(b.net_amount_bdt * 0.075);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-2.5 font-mono font-bold text-slate-800">
                        {b.booking_ref}
                      </td>
                      <td className="p-2.5">{b.passengers[0]?.name}</td>
                      <td className="p-2.5 font-bold text-[#F20D65]">
                        {b.passengers.map((p) => p.seat_number).join(", ")}
                      </td>
                      <td className="p-2.5">৳ {b.net_amount_bdt.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-black text-emerald-600">
                        + ৳ {comm.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
