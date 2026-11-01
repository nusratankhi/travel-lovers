"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F20D65] bg-pink-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F4D]">
          Contact Travel Lovers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Have questions about bus ticket booking, operator partnerships, or corporate travel? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-[#0B1F4D] text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Headquarters & Support</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our 24/7 central transport helpline is always ready to assist you with departures, refunds, and inquiries.
            </p>

            <div className="space-y-3 text-xs pt-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FF3D86]" />
                <span>+880 1711 123456</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FF3D86]" />
                <span>support@travellovers.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#FF3D86]" />
                <span>Level 7, Transport Tower, Outer Circular Road, Rajarbagh, Dhaka - 1217</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#142E63] rounded-2xl border border-blue-900 text-xs text-slate-300">
            <strong>Operator Registration:</strong> Bus operators looking to join our multi-tenant SaaS network can call +880 1711 998877.
          </div>
        </div>

        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting Travel Lovers. A customer relationship manager will reply to you within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-base text-[#0B1F4D]">Send Us a Message</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Booking inquiry or partnership"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F20D65] hover:bg-[#d80856] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
