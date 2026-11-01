"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
  Bus,
} from "lucide-react";
import { db } from "@/lib/db-store";
import { Trip, PassengerInput } from "@/types";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tripId = searchParams.get("tripId") || "";
  const seatsParam = searchParams.get("seats") || "";
  const sessionId = searchParams.get("sessionId") || "";

  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);

  // Passenger form inputs
  const [passengers, setPassengers] = useState<
    { name: string; phone: string; gender: "male" | "female"; age: number }[]
  >([]);
  const [boardingPoint, setBoardingPoint] = useState<string>("");
  const [droppingPoint, setDroppingPoint] = useState<string>("");

  // Promo code
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountBdt, setDiscountBdt] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Payment method
  const [paymentGateway, setPaymentGateway] = useState<
    "bkash" | "nagad" | "sslcommerz" | "cash"
  >("bkash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    const foundTrip = db.getTripById(tripId);
    if (foundTrip) {
      setTrip(foundTrip);
      setBoardingPoint(foundTrip.boarding_points[0] || "");
      setDroppingPoint(foundTrip.dropping_points[0] || "");

      const seatArray = seatsParam ? seatsParam.split(",").filter(Boolean) : [];
      setSelectedSeatNumbers(seatArray);

      // Initialize passenger fields
      setPassengers(
        seatArray.map((seat, i) => ({
          name: i === 0 ? "Sabbir Hossain" : `Passenger ${i + 1}`,
          phone: "+880 1715-998877",
          gender: "male",
          age: 28,
        }))
      );
    }
  }, [tripId, seatsParam]);

  if (!trip) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Trip not found or session expired</h2>
        <Link href="/" className="mt-4 inline-block text-sm text-[#F20D65] font-semibold underline">
          ← Return to Home Search
        </Link>
      </div>
    );
  }

  const baseFare = selectedSeatNumbers.length * trip.fare_bdt;
  const netAmount = Math.max(0, baseFare - discountBdt);

  const handleApplyPromo = () => {
    setPromoMessage(null);
    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();
    if (code === "EIDTRIP26") {
      setDiscountBdt(150);
      setPromoMessage({ text: "Promo applied: ৳150 discount!", error: false });
    } else if (code === "WELCOMEBD") {
      setDiscountBdt(100);
      setPromoMessage({ text: "Welcome promo applied: ৳100 discount!", error: false });
    } else {
      setPromoMessage({ text: "Invalid promo code. Try EIDTRIP26 or WELCOMEBD.", error: true });
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Prepare passenger inputs
    const passengerInputs: PassengerInput[] = selectedSeatNumbers.map((seatNum, idx) => ({
      name: passengers[idx]?.name || `Passenger ${idx + 1}`,
      phone: passengers[idx]?.phone || "+880 1700-000000",
      gender: passengers[idx]?.gender || "male",
      age: passengers[idx]?.age || 25,
      seat_number: seatNum,
      fare: trip.fare_bdt,
      boarding_stop: boardingPoint,
      dropping_stop: droppingPoint,
    }));

    const result = db.createBooking({
      tripId: trip.id,
      passengers: passengerInputs,
      paymentGateway,
      bookingSource: "online",
      discountBdt,
      sessionId,
    });

    setIsSubmitting(false);

    if (result.success && result.booking) {
      router.push(`/booking/confirmation?ref=${result.booking.booking_ref}`);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/search?from=${encodeURIComponent(trip.origin_city)}&to=${encodeURIComponent(trip.destination_city)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B1F4D] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Passenger Info & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleConfirmBooking} className="space-y-6">
            {/* 1. Boarding & Dropping Points */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F20D65]" />
                Select Boarding & Dropping Points
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Boarding Point ({trip.origin_city})
                  </label>
                  <select
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    required
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#F20D65] focus:outline-none"
                  >
                    {trip.boarding_points.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Dropping Point ({trip.destination_city})
                  </label>
                  <select
                    value={droppingPoint}
                    onChange={(e) => setDroppingPoint(e.target.value)}
                    required
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#F20D65] focus:outline-none"
                  >
                    {trip.dropping_points.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Passenger Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
                <User className="w-4 h-4 text-[#F20D65]" />
                Passenger Details ({selectedSeatNumbers.length} Seats)
              </h3>

              <div className="space-y-4">
                {selectedSeatNumbers.map((seatNum, idx) => (
                  <div
                    key={seatNum}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#0B1F4D]">
                        Passenger {idx + 1} (Seat {seatNum})
                      </span>
                      <span className="text-[11px] bg-pink-100 text-[#F20D65] font-bold px-2 py-0.5 rounded">
                        ৳ {trip.fare_bdt}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={passengers[idx]?.name || ""}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setPassengers(updated);
                          }}
                          placeholder="Passenger Name"
                          className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#F20D65]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Gender *
                        </label>
                        <select
                          value={passengers[idx]?.gender || "male"}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[idx] = {
                              ...updated[idx],
                              gender: e.target.value as "male" | "female",
                            };
                            setPassengers(updated);
                          }}
                          className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={passengers[idx]?.age || 25}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[idx] = {
                              ...updated[idx],
                              age: parseInt(e.target.value) || 20,
                            };
                            setPassengers(updated);
                          }}
                          className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Payment Method Selection (Bangladesh Gateways) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#0B1F4D] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#F20D65]" />
                Select Payment Method (Bangladesh Gateway)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* bKash */}
                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition ${
                    paymentGateway === "bkash"
                      ? "border-[#F20D65] bg-pink-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="bkash"
                    checked={paymentGateway === "bkash"}
                    onChange={() => setPaymentGateway("bkash")}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-[#E2136E]">bKash Payment</span>
                  <span className="text-[10px] text-slate-500">Instant Wallet Pay</span>
                </label>

                {/* Nagad */}
                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition ${
                    paymentGateway === "nagad"
                      ? "border-[#F20D65] bg-pink-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="nagad"
                    checked={paymentGateway === "nagad"}
                    onChange={() => setPaymentGateway("nagad")}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-[#E65100]">Nagad Pay</span>
                  <span className="text-[10px] text-slate-500">Instant Wallet Pay</span>
                </label>

                {/* SSLCommerz / Cards */}
                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition ${
                    paymentGateway === "sslcommerz"
                      ? "border-[#F20D65] bg-pink-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="sslcommerz"
                    checked={paymentGateway === "sslcommerz"}
                    onChange={() => setPaymentGateway("sslcommerz")}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-[#0B1F4D]">Cards / SSLCommerz</span>
                  <span className="text-[10px] text-slate-500">Visa, Master, Amex</span>
                </label>

                {/* Cash at Counter */}
                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition ${
                    paymentGateway === "cash"
                      ? "border-[#F20D65] bg-pink-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value="cash"
                    checked={paymentGateway === "cash"}
                    onChange={() => setPaymentGateway("cash")}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-emerald-700">Cash Collection</span>
                  <span className="text-[10px] text-slate-500">Pay at Counter Desk</span>
                </label>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Sandbox / Verified Mode:</strong> In demo mode, live API callbacks are verified seamlessly and an immutable transaction ID is generated.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || selectedSeatNumbers.length === 0}
              className="w-full bg-[#F20D65] hover:bg-[#d80856] text-white py-4 px-6 rounded-2xl font-black text-sm shadow-xl shadow-pink-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing Ticket & Processing Payment...</span>
              ) : (
                <span>Pay ৳ {netAmount.toLocaleString()} & Confirm Booking →</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Journey & Fare Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0B1F4D] pb-3 border-b border-slate-100">
              Booking Summary
            </h3>

            {/* Operator and Journey details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Bus Operator
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {trip.operator_name}
                </span>
                <span className="block text-slate-500">{trip.bus_name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    From
                  </span>
                  <span className="font-bold text-slate-800">{trip.origin_city}</span>
                  <span className="text-slate-500 block">{trip.departure_time}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    To
                  </span>
                  <span className="font-bold text-slate-800">{trip.destination_city}</span>
                  <span className="text-slate-500 block">{trip.arrival_time}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Selected Seats
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeatNumbers.map((s) => (
                    <span
                      key={s}
                      className="bg-[#0B1F4D] text-white px-2 py-0.5 rounded text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. EIDTRIP26"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2 rounded-lg border border-slate-200 uppercase bg-slate-50 focus:outline-none focus:border-[#F20D65]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-[#0B1F4D] hover:bg-[#142E63] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-[11px] mt-1 font-semibold ${
                    promoMessage.error ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Fare Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({selectedSeatNumbers.length} Seats)</span>
                <span className="font-semibold">৳ {baseFare.toLocaleString()}</span>
              </div>

              {discountBdt > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Special Promo Discount</span>
                  <span>- ৳ {discountBdt.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-[#0B1F4D]">
                <span>Total Payable</span>
                <span className="text-[#F20D65] text-lg">
                  ৳ {netAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-600">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
