"use client";

import React, { useState, useEffect } from "react";
import { Trip, SeatMapItem } from "@/types";
import { db } from "@/lib/db-store";
import {
  Clock,
  ShieldAlert,
  Armchair,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SeatMapProps {
  trip: Trip;
  sessionId: string;
  onSeatSelectionChange: (selectedSeats: SeatMapItem[], totalFare: number) => void;
}

export default function SeatMap({ trip, sessionId, onSeatSelectionChange }: SeatMapProps) {
  const [seats, setSeats] = useState<SeatMapItem[]>([]);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [lockExpiresAt, setLockExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUser] = useState(db.getCurrentUser());

  // Load seats for this trip and session
  const refreshSeats = () => {
    const tripSeats = db.getSeatsForTrip(trip.id, sessionId);
    setSeats(tripSeats);
  };

  useEffect(() => {
    refreshSeats();
    const unsub = db.subscribe(() => {
      refreshSeats();
    });
    return unsub;
  }, [trip.id, sessionId]);

  // Lock countdown timer
  useEffect(() => {
    if (!lockExpiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const diffSecs = Math.max(0, Math.floor((lockExpiresAt - Date.now()) / 1000));
      setRemainingSeconds(diffSecs);

      if (diffSecs <= 0) {
        clearInterval(interval);
        setSelectedSeatNumbers([]);
        setLockExpiresAt(null);
        setErrorMessage("Your seat lock has expired. Please select your seats again.");
        db.releaseSessionLocks(trip.id, sessionId);
        refreshSeats();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiresAt, trip.id, sessionId]);

  const handleSeatClick = (seat: SeatMapItem) => {
    setErrorMessage(null);

    // Can't select booked or locked by someone else
    if (seat.status === "booked" || seat.status === "female_booked") {
      setErrorMessage(`Seat ${seat.seat_number} is already booked.`);
      return;
    }
    if (seat.status === "locked") {
      setErrorMessage(
        `Seat ${seat.seat_number} is currently locked by another customer. Please choose another seat.`
      );
      return;
    }

    let newSelected: string[];
    if (selectedSeatNumbers.includes(seat.seat_number)) {
      newSelected = selectedSeatNumbers.filter((s) => s !== seat.seat_number);
    } else {
      if (selectedSeatNumbers.length >= 4) {
        setErrorMessage("You can select up to 4 seats per booking.");
        return;
      }
      newSelected = [...selectedSeatNumbers, seat.seat_number];
    }

    if (newSelected.length === 0) {
      setSelectedSeatNumbers([]);
      setLockExpiresAt(null);
      db.releaseSessionLocks(trip.id, sessionId);
      onSeatSelectionChange([], 0);
      refreshSeats();
      return;
    }

    // Attempt atomic lock
    const lockResult = db.lockSeats(
      trip.id,
      newSelected,
      sessionId,
      currentUser.role,
      10 // 10 minutes lock
    );

    if (lockResult.success) {
      setSelectedSeatNumbers(newSelected);
      setLockExpiresAt(lockResult.expiresAt || null);

      const chosenSeats = seats.filter((s) => newSelected.includes(s.seat_number));
      const total = chosenSeats.reduce((sum, s) => sum + s.price, 0);
      onSeatSelectionChange(chosenSeats, total);
      refreshSeats();
    } else {
      setErrorMessage(lockResult.message);
      refreshSeats();
    }
  };

  const is2plus1 = trip.layout_type === "2+1";
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Header & Lock Countdown Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Select Your Seats</h3>
          <p className="text-xs text-slate-500">
            {trip.operator_name} • {trip.bus_name} ({trip.layout_type} Layout)
          </p>
        </div>

        {remainingSeconds > 0 && (
          <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 text-[#F20D65] px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Locked for: {Math.floor(remainingSeconds / 60)}:
              {(remainingSeconds % 60).toString().padStart(2, "0")} mins
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#F20D65] text-white" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-amber-400 text-white" />
          <span>Locked (Other User)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-slate-300 text-slate-600" />
          <span>Booked (Male)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-pink-200 text-pink-700" />
          <span>Booked (Female)</span>
        </div>
      </div>

      {/* Bus Realistic Frame & Seat Grid */}
      <div className="max-w-xs mx-auto bg-slate-100 p-4 rounded-3xl border-2 border-slate-300 shadow-inner">
        {/* Front of bus / Steering Wheel */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b-2 border-dashed border-slate-300 px-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            [ Entry Door ]
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
            <span>Driver Cabin</span>
            <div className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center font-bold text-xs bg-white">
              ⎈
            </div>
          </div>
        </div>

        {/* Seat rows */}
        <div className="space-y-2.5">
          {rows.map((row) => {
            const rowSeats = seats.filter((s) => s.row === row);
            if (rowSeats.length === 0) return null;

            return (
              <div key={row} className="flex items-center justify-between gap-1">
                {/* Left Side (Col 1, 2) */}
                <div className="flex gap-1.5">
                  {rowSeats
                    .filter((s) => s.col <= (is2plus1 ? 1 : 2))
                    .map((seat) => renderSeatButton(seat))}
                </div>

                {/* Central Aisle */}
                <div className="w-6 text-center text-[10px] font-mono text-slate-400">
                  {row}
                </div>

                {/* Right Side (Col 3, 4) */}
                <div className="flex gap-1.5">
                  {rowSeats
                    .filter((s) => s.col > (is2plus1 ? 1 : 2))
                    .map((seat) => renderSeatButton(seat))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear Engine */}
        <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-300 text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          [ Rear Engine ]
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeatNumbers.length > 0 && (
        <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-600 font-medium">Selected Seats:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {selectedSeatNumbers.map((seatNum) => (
                <span
                  key={seatNum}
                  className="bg-[#F20D65] text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm"
                >
                  {seatNum}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-600 font-medium">Estimated Fare:</span>
            <div className="text-lg font-black text-[#0B1F4D]">
              ৳{" "}
              {seats
                .filter((s) => selectedSeatNumbers.includes(s.seat_number))
                .reduce((sum, s) => sum + s.price, 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderSeatButton(seat: SeatMapItem) {
    const isSelected = selectedSeatNumbers.includes(seat.seat_number);

    let bgClass = "bg-white border-slate-300 text-slate-700 hover:border-[#F20D65]";
    let cursor = "cursor-pointer";

    if (seat.status === "booked") {
      bgClass = "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed";
      cursor = "cursor-not-allowed";
    } else if (seat.status === "female_booked") {
      bgClass = "bg-pink-200 border-pink-300 text-pink-700 cursor-not-allowed";
      cursor = "cursor-not-allowed";
    } else if (seat.status === "locked") {
      bgClass = "bg-amber-400 border-amber-500 text-white cursor-not-allowed";
      cursor = "cursor-not-allowed";
    } else if (isSelected) {
      bgClass = "bg-[#F20D65] border-[#F20D65] text-white shadow-md scale-105";
    }

    return (
      <button
        key={seat.seat_number}
        type="button"
        disabled={seat.status === "booked" || seat.status === "female_booked" || seat.status === "locked"}
        onClick={() => handleSeatClick(seat)}
        title={`Seat ${seat.seat_number} (${seat.type}) - ৳${seat.price}`}
        className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center text-[11px] font-bold transition ${bgClass} ${cursor}`}
      >
        <span>{seat.seat_number}</span>
      </button>
    );
  }
}
