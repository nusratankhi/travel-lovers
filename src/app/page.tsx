"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Headphones,
  Tag,
  Star,
  ChevronRight,
  ArrowRight,
  Bus,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Percent,
} from "lucide-react";
import SearchWidget from "@/components/home/SearchWidget";
import { POPULAR_ROUTES, INITIAL_TENANTS } from "@/lib/mock-data";

export default function HomePage() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How can I book a bus ticket on Travel Lovers?",
      a: "Select your departure city, destination city, journey date, and preferred bus operator. Pick your seats from our interactive seat map, enter passenger information, and pay instantly via bKash, Nagad, cards, or at the counter. Your confirmed digital ticket with a QR code will be generated immediately.",
    },
    {
      q: "Can two people book the same seat at the same time?",
      a: "No! Travel Lovers uses a real-time atomic seat-locking engine. When you select a seat, it is temporarily locked for you for 10 minutes. No other customer, counter staff, or agent can book that seat while you complete checkout.",
    },
    {
      q: "What payment methods are supported in Bangladesh?",
      a: "We support bKash, Nagad, Rocket, debit/credit cards (Visa, Mastercard, Amex), internet banking via SSLCommerz, counter cash, and agent wallet credits.",
    },
    {
      q: "How do I cancel a ticket or get a refund?",
      a: "You can request ticket cancellation through your Customer Dashboard up to 6 hours before departure time. Eligible refunds (85% fare after standard cancellation fee) are processed directly back to your payment account.",
    },
    {
      q: "Can bus companies and counter operators use Travel Lovers?",
      a: "Yes! Travel Lovers is an enterprise-grade multi-tenant SaaS platform. Bus companies get an isolated Company Portal, Counter POS terminal for fast walk-in sales, Driver/Conductor boarding apps, and B2B Agent management.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (Mirroring Reference Image) */}
      <section className="relative bg-gradient-to-br from-[#0B1F4D] via-[#10275c] to-[#142E63] text-white pt-8 pb-16 lg:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F20D65]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#F20D65]" />
                Bangladesh's Leading Bus Booking Platform
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Book Your Bus Ticket <br className="hidden sm:inline" />
                with <span className="text-[#F20D65]">Travel Lovers</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium">
                Safe • Comfortable • Affordable Journey
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="#search-booking"
                  className="inline-flex items-center gap-2 bg-[#F20D65] hover:bg-[#d80856] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-pink-500/30 transition transform hover:-translate-y-0.5"
                >
                  <span>Start Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="text-xs text-slate-300 font-medium italic border-l-2 border-[#F20D65] pl-3 py-0.5">
                  "Travel More • Worry Less"
                </div>
              </div>
            </div>

            {/* Right Hero Image (Bus Visual) */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="/images/hero-reference.jpg"
                  alt="Travel Lovers Luxury Coach Bus"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] uppercase tracking-widest text-[#FF3D86] font-bold">
                    Official Fleet Partner
                  </span>
                  <h3 className="text-lg font-bold">Premium Scania & Hyundai Multi-Axle Coaches</h3>
                </div>
              </div>
            </div>
          </div>

          {/* BUS SEARCH WIDGET (3 TABS) */}
          <div id="search-booking" className="pt-2">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* 2. TRUST & SECURITY BENEFITS BAR (From Reference) */}
      <section className="bg-white border-y border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0B1F4D] flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Secure Payment</h4>
            <p className="text-[11px] text-slate-500 font-medium">100% Safe & Encrypted</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#F20D65] flex items-center justify-center mb-1">
              <Zap className="w-5 h-5 text-[#F20D65]" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Instant Booking</h4>
            <p className="text-[11px] text-slate-500 font-medium">Confirmed in Seconds</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
              <Headphones className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">24/7 Support</h4>
            <p className="text-[11px] text-slate-500 font-medium">Always Here to Help</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Best Price</h4>
            <p className="text-[11px] text-slate-500 font-medium">Guaranteed Low Fares</p>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center gap-1.5 p-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Trusted by Millions</h4>
            <p className="text-[11px] text-slate-500 font-medium">Over 500,000+ Journeys</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR ROUTES & OUR BUS OPERATORS (Two-Column Section from Reference) */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Popular Routes */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F20D65]" />
                <h2 className="text-lg sm:text-xl font-bold text-[#0B1F4D]">Popular Routes</h2>
              </div>
              <Link
                href="/routes"
                className="text-xs sm:text-sm font-semibold text-[#0B1F4D] hover:text-[#F20D65] flex items-center gap-1 transition"
              >
                <span>View All Routes</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {POPULAR_ROUTES.slice(0, 4).map((route) => {
                const photos: Record<string, string> = {
                  "rt-dhk-ctg": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300",
                  "rt-dhk-cxb": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
                  "rt-ctg-syl": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=300",
                  "rt-dhk-syl": "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=300",
                };

                return (
                  <Link
                    key={route.id}
                    href={`/search?from=${encodeURIComponent(route.origin_city)}&to=${encodeURIComponent(route.destination_city)}`}
                    className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 transition flex flex-col"
                  >
                    <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={photos[route.id] || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300"}
                        alt={`${route.origin_city} to ${route.destination_city}`}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 text-white flex justify-between items-end">
                        <div>
                          <span className="text-xs font-bold block">
                            {route.origin_city} → {route.destination_city}
                          </span>
                          <span className="text-[11px] text-pink-300 font-semibold">
                            ৳ {route.base_fare_bdt} onwards
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white text-[#0B1F4D] flex items-center justify-center text-xs group-hover:bg-[#F20D65] group-hover:text-white transition">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Column: Our Bus Operators */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-[#F20D65]" />
                <h2 className="text-lg sm:text-xl font-bold text-[#0B1F4D]">Our Bus Operators</h2>
              </div>
              <Link
                href="/operators"
                className="text-xs sm:text-sm font-semibold text-[#0B1F4D] hover:text-[#F20D65] flex items-center gap-1 transition"
              >
                <span>View All Operators</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INITIAL_TENANTS.map((op) => (
                <Link
                  key={op.id}
                  href={`/operators`}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-pink-300 shadow-sm hover:shadow transition flex flex-col items-center justify-center text-center gap-2 group"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-50 border p-1 group-hover:scale-105 transition">
                    <Image
                      src={op.logo_url}
                      alt={op.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#F20D65]">
                    {op.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    Verified Partner
                  </span>
                </Link>
              ))}

              <Link
                href="/operators"
                className="bg-slate-50 hover:bg-pink-50 p-3 rounded-xl border border-dashed border-slate-300 hover:border-pink-300 transition flex flex-col items-center justify-center text-center gap-1 text-slate-500 hover:text-[#F20D65]"
              >
                <span className="text-lg font-bold">+</span>
                <span className="text-xs font-bold">More Operators</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE TRAVEL LOVERS BANNER (Bottom Banner from Reference) */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-500">
                <Star className="w-5 h-5 fill-amber-500" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F4D]">
                  Why Choose Travel Lovers?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Your trusted travel partner for a better journey. We bring you real-time seat locks, authenticated operators, transparent ticket fares, and instant customer assistance.
              </p>

              <div className="grid grid-cols-2 gap-4 text-left pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 text-[#0B1F4D] shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Modern Fleet</h5>
                    <p className="text-[11px] text-slate-500">Scania, Hyundai & Volvo</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">100% Secure</h5>
                    <p className="text-[11px] text-slate-500">Zero double-booking guarantee</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-pink-100 text-[#F20D65] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Fast Booking</h5>
                    <p className="text-[11px] text-slate-500">Quick checkout & SMS e-ticket</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Dedicated Support</h5>
                    <p className="text-[11px] text-slate-500">24/7 hotline & refund care</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Traveler Photo composition */}
            <div className="relative w-full max-w-sm h-56 rounded-xl overflow-hidden shadow-lg border border-white">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500"
                alt="Travel with Travel Lovers"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-white font-bold text-sm tracking-wide">
                  Travel with Travel Lovers • Safe & Worry Less
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPECIAL OFFERS & PROMO CODES */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0B1F4D]">Exclusive Travel Deals</h2>
            <p className="text-xs text-slate-500">Save extra on every bus ticket booking</p>
          </div>
          <Link href="/offers" className="text-xs font-bold text-[#F20D65] hover:underline">
            View All Offers →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-white/10">
              <Percent className="w-32 h-32" />
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Eid Special
            </span>
            <h3 className="text-2xl font-black mt-3">৳ 150 OFF</h3>
            <p className="text-xs text-pink-100 mt-1">
              On Dhaka to Cox's Bazar Scania AC bookings.
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-white text-[#F20D65] px-2.5 py-1 rounded">
                EIDTRIP26
              </span>
              <span className="text-[11px] text-pink-100">Valid till Nov 30</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-[#0B1F4D] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-white/10">
              <Tag className="w-32 h-32" />
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              bKash Cashback
            </span>
            <h3 className="text-2xl font-black mt-3">10% CASHBACK</h3>
            <p className="text-xs text-blue-100 mt-1">
              Pay using bKash payment gateway and get instant cashback.
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-white text-[#0B1F4D] px-2.5 py-1 rounded">
                BKASH10
              </span>
              <span className="text-[11px] text-blue-100">Max ৳ 100</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-800 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-white/10">
              <Bus className="w-32 h-32" />
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              First Booking
            </span>
            <h3 className="text-2xl font-black mt-3">FLAT ৳ 100</h3>
            <p className="text-xs text-purple-100 mt-1">
              Welcome discount on your first bus ticket on Travel Lovers.
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-white text-purple-800 px-2.5 py-1 rounded">
                WELCOMEBD
              </span>
              <span className="text-[11px] text-purple-100">For new users</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0B1F4D]">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Everything you need to know about booking with Travel Lovers</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-[#0B1F4D] hover:text-[#F20D65]"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-slate-400 font-mono">
                    {selectedFaq === index ? "−" : "+"}
                  </span>
                </button>
                {selectedFaq === index && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
