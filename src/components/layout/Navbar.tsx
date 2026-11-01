"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Smartphone,
  Search,
  User,
  Shield,
  Building2,
  Store,
  Briefcase,
  QrCode,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { UserRole } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(db.getCurrentUser());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setCurrentUser(db.getCurrentUser());
    });
    return unsub;
  }, []);

  const handleRoleChange = (role: UserRole) => {
    db.switchRole(role);
    setRoleDropdownOpen(false);

    // Redirect to respective portal
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
      case "driver":
      case "conductor":
        router.push("/crew/dashboard");
        break;
      case "customer":
      default:
        router.push("/customer/dashboard");
        break;
    }
  };

  const getPortalLinkForRole = () => {
    switch (currentUser.role) {
      case "super_admin":
        return { href: "/admin/dashboard", label: "Super Admin Portal", icon: Shield };
      case "company_admin":
        return { href: "/company/dashboard", label: "Company Portal", icon: Building2 };
      case "counter_staff":
        return { href: "/counter/dashboard", label: "Counter POS", icon: Store };
      case "agent":
        return { href: "/agent/dashboard", label: "Agent Portal", icon: Briefcase };
      case "driver":
      case "conductor":
        return { href: "/crew/dashboard", label: "Crew Portal", icon: QrCode };
      case "customer":
      default:
        return { href: "/customer/dashboard", label: "My Bookings", icon: User };
    }
  };

  const portal = getPortalLinkForRole();
  const PortalIcon = portal.icon;

  return (
    <header className="w-full no-print">
      {/* 1. TOP INFORMATION BAR */}
      <div className="bg-[#0B1F4D] text-white text-xs py-2 px-4 border-b border-[#142E63]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Customer Support
            </span>
            <a
              href="tel:+8801711123456"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#F20D65]" />
              +880 1711 123456
            </a>
            <a
              href="mailto:support@travellovers.com"
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Mail className="w-3.5 h-3.5 text-[#F20D65]" />
              support@travellovers.com
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Role Switcher for instant testing */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#142E63] hover:bg-[#1a3a7c] text-white px-2.5 py-1 rounded text-[11px] font-medium border border-blue-900 transition"
              >
                <span className="text-slate-400">Active Role:</span>
                <span className="text-[#FF3D86] font-semibold uppercase tracking-wider">
                  {currentUser.role.replace("_", " ")}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-[10px] text-slate-400 uppercase tracking-wider border-b">
                    Simulate System Role
                  </div>
                  <button
                    onClick={() => handleRoleChange("super_admin")}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    Super Admin
                  </button>
                  <button
                    onClick={() => handleRoleChange("company_admin")}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Company Admin (Green Line)
                  </button>
                  <button
                    onClick={() => handleRoleChange("counter_staff")}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    Counter Staff (POS)
                  </button>
                  <button
                    onClick={() => handleRoleChange("agent")}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    Agent Portal (Prime Travels)
                  </button>
                  <button
                    onClick={() => handleRoleChange("conductor")}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                    Crew Portal (Conductor/QR)
                  </button>
                  <button
                    onClick={() => handleRoleChange("customer")}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-[#F20D65]" />
                    Customer (Passenger)
                  </button>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-slate-300">
              <Smartphone className="w-3.5 h-3.5 text-[#F20D65]" />
              <span>Download App:</span>
              <span className="font-semibold text-white hover:text-[#FF3D86] cursor-pointer">
                Google Play
              </span>
              <span>•</span>
              <span className="font-semibold text-white hover:text-[#FF3D86] cursor-pointer">
                App Store
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Official Travel Lovers Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-11 w-44 sm:w-52 sm:h-12">
              <Image
                src="/images/logo.png"
                alt="Travel Lovers - Travel More • Worry Less"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-[13px] font-semibold text-slate-700">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/"
                  ? "bg-[#F20D65] text-white shadow-sm"
                  : "hover:text-[#F20D65]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/routes"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/routes"
                  ? "bg-[#F20D65] text-white"
                  : "hover:text-[#F20D65]"
              }`}
            >
              Routes
            </Link>
            <Link
              href="/operators"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/operators"
                  ? "bg-[#F20D65] text-white"
                  : "hover:text-[#F20D65]"
              }`}
            >
              Bus Operators
            </Link>
            <Link
              href="/offers"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/offers"
                  ? "bg-[#F20D65] text-white"
                  : "hover:text-[#F20D65]"
              }`}
            >
              Offers
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/about"
                  ? "bg-[#F20D65] text-white"
                  : "hover:text-[#F20D65]"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/help"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/help"
                  ? "bg-[#F20D65] text-white"
                  : "hover:text-[#F20D65]"
              }`}
            >
              Help
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-1.5 rounded-full transition ${
                pathname === "/contact"
                  ? "bg-[#F20D65] text-white"
                  : "hover:text-[#F20D65]"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              className="p-2 text-slate-600 hover:text-[#0B1F4D] hover:bg-slate-100 rounded-full transition"
              title="Search Trips"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Portal Link based on user role */}
            <Link
              href={portal.href}
              className="hidden sm:flex items-center gap-1.5 bg-[#EAF1FF] text-[#0B1F4D] hover:bg-[#d8e6ff] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-blue-200 transition"
            >
              <PortalIcon className="w-3.5 h-3.5 text-[#F20D65]" />
              <span>{portal.label}</span>
            </Link>

            {/* Login / Sign Up buttons matching reference */}
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-1 text-slate-700 hover:text-[#0B1F4D] border border-slate-300 hover:border-slate-400 px-3.5 py-1.5 rounded-full text-xs font-semibold transition"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Login</span>
            </Link>

            <Link
              href="/register"
              className="bg-[#F20D65] hover:bg-[#e0085a] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm shadow-pink-200 hover:shadow-md transition"
            >
              Sign Up
            </Link>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 hover:text-[#F20D65]"
            >
              Home
            </Link>
            <Link
              href="/routes"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 hover:text-[#F20D65]"
            >
              Routes
            </Link>
            <Link
              href="/operators"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 hover:text-[#F20D65]"
            >
              Bus Operators
            </Link>
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 hover:text-[#F20D65]"
            >
              Offers
            </Link>
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 hover:text-[#F20D65]"
            >
              Help & FAQ
            </Link>
            <div className="pt-2 border-t flex flex-col gap-2">
              <Link
                href={portal.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 bg-[#EAF1FF] text-[#0B1F4D] py-2 px-3 rounded-lg text-xs font-semibold"
              >
                <PortalIcon className="w-4 h-4 text-[#F20D65]" />
                {portal.label}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
