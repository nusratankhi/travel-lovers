"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1F4D] text-slate-300 text-sm border-t border-[#142E63] no-print">
      {/* Upper Footer: Newsletter & App Banner */}
      <div className="bg-[#142E63] py-8 px-4 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Never Miss a Great Travel Deal!
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Subscribe to get exclusive bus ticket discounts, promo codes, and Eid holiday alerts.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="bg-white/10 border border-blue-800 text-white placeholder-slate-400 px-4 py-2.5 rounded-full text-xs sm:text-sm w-full md:w-72 focus:outline-none focus:border-[#F20D65]"
            />
            <button
              onClick={() => alert("Thank you for subscribing to Travel Lovers offers!")}
              className="bg-[#F20D65] hover:bg-[#e0085a] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition shrink-0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-12 w-48 bg-white/95 rounded-lg p-1.5 inline-block">
            <Image
              src="/images/logo.png"
              alt="Travel Lovers"
              fill
              className="object-contain p-1"
            />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Travel Lovers is Bangladesh's premier multi-tenant bus ticketing and transport management SaaS platform. We connect millions of passengers with the country’s leading luxury coach operators for safe, comfortable, and affordable journeys.
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#F20D65]" />
              <span>+880 1711 123456 (24/7 Helpline)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#F20D65]" />
              <span>support@travellovers.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F20D65]" />
              <span>Level 7, Transport Tower, Rajarbagh, Dhaka - 1217</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/routes" className="hover:text-white transition">
                Bus Routes
              </Link>
            </li>
            <li>
              <Link href="/operators" className="hover:text-white transition">
                Bus Operators
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-white transition">
                Offers & Promo Codes
              </Link>
            </li>
            <li>
              <Link href="/ticket/verify" className="hover:text-white transition">
                Verify E-Ticket
              </Link>
            </li>
            <li>
              <Link href="/customer/dashboard" className="hover:text-white transition">
                Customer Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Routes */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
            Popular Routes
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/search?from=Dhaka&to=Cox%27s+Bazar" className="hover:text-white transition">
                Dhaka → Cox's Bazar
              </Link>
            </li>
            <li>
              <Link href="/search?from=Dhaka&to=Chattogram" className="hover:text-white transition">
                Dhaka → Chattogram
              </Link>
            </li>
            <li>
              <Link href="/search?from=Dhaka&to=Sylhet" className="hover:text-white transition">
                Dhaka → Sylhet
              </Link>
            </li>
            <li>
              <Link href="/search?from=Chattogram&to=Sylhet" className="hover:text-white transition">
                Chattogram → Sylhet
              </Link>
            </li>
            <li>
              <Link href="/search?from=Dhaka&to=Rajshahi" className="hover:text-white transition">
                Dhaka → Rajshahi
              </Link>
            </li>
            <li>
              <Link href="/search?from=Dhaka&to=Khulna" className="hover:text-white transition">
                Dhaka → Khulna
              </Link>
            </li>
          </ul>
        </div>

        {/* Operators & SaaS */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
            For Operators
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/company/dashboard" className="hover:text-white transition">
                Company Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/counter/dashboard" className="hover:text-white transition">
                Counter POS Terminal
              </Link>
            </li>
            <li>
              <Link href="/agent/dashboard" className="hover:text-white transition">
                Agent B2B Portal
              </Link>
            </li>
            <li>
              <Link href="/crew/dashboard" className="hover:text-white transition">
                Crew QR Scanner Portal
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="hover:text-white transition">
                Super Admin SaaS Portal
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white transition">
                Operator API & White Label
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Partner & Bottom Copyright */}
      <div className="bg-[#081738] py-4 px-4 border-t border-blue-950 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Secure Payments via bKash, Nagad, Rocket, Visa & Mastercard</span>
          </div>

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Travel Lovers. All rights reserved. Travel More • Worry Less.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
