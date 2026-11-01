"use client";

import React from "react";
import Link from "next/link";
import { Tag, Percent, ArrowRight, CheckCircle2, Bus } from "lucide-react";

export default function OffersPage() {
  const offers = [
    {
      code: "EIDTRIP26",
      title: "Eid Special Discount — ৳ 150 OFF",
      desc: "Get flat ৳150 discount on all Scania & Hyundai luxury AC coach bookings to Cox's Bazar, Chattogram and Sylhet.",
      expiry: "Valid till 30 Nov 2026",
      category: "Special Festival Promo",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      code: "WELCOMEBD",
      title: "New User Welcome Promo — ৳ 100 OFF",
      desc: "First time booking on Travel Lovers? Enjoy ৳100 discount on your first bus journey.",
      expiry: "Valid for all new accounts",
      category: "Welcome Offer",
      gradient: "from-purple-600 to-indigo-800",
    },
    {
      code: "BKASH10",
      title: "bKash 10% Instant Cashback",
      desc: "Pay for your ticket using bKash payment gateway and get up to ৳100 instant cashback to your bKash wallet.",
      expiry: "Limited time offer",
      category: "Mobile Banking Partner",
      gradient: "from-blue-700 to-[#0B1F4D]",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F20D65] bg-pink-50 px-3 py-1 rounded-full">
          Discounts & Promos
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D]">
          Exclusive Travel Deals & Coupons
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Apply these coupon codes at checkout to save instantly on your bus tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.code}
            className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-6 text-white shadow-lg space-y-4 flex flex-col justify-between`}
          >
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {offer.category}
              </span>
              <h3 className="text-xl font-black mt-3 leading-tight">{offer.title}</h3>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">{offer.desc}</p>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-200 block">
                  Promo Code
                </span>
                <span className="text-sm font-mono font-black bg-white text-slate-900 px-2.5 py-1 rounded shadow-sm inline-block mt-0.5">
                  {offer.code}
                </span>
              </div>

              <Link
                href="/search"
                className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition"
              >
                Use Code →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
