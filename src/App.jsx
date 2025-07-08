// 🚀 Final TierOne Bonus Simulator
// ✅ Includes full BONUS_MATRIX, updated S-Tier toggle, Perfect-only logic, Netradyne logic, Bonus Results, FAQ

import React, { useState, useEffect } from "react";

export default function App() {
  const [role, setRole] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [checkND, setCheckND] = useState(false);
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");

  useEffect(() => {
    if (rating !== "Perfect") setSTier(false);
  }, [rating]);

  const BONUS_MATRIX = {
    "Fantastic Plus": {
      Perfect: {
        A: [26, 27, 28, 29, 30, 32],
        B: [25, 26, 27, 28, 29, 30],
        C: [24.75, 25, 25.25, 25.5, 25.75, 26],
        "D & F": [24],
      },
      "Meets Requirements": {
        A: [25, 26, 27, 28, 29, 30],
        B: [24.5, 25, 25.5, 26, 26.5, 27],
        C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
        "D & F": [24],
      },
    },
    Fantastic: {
      Perfect: {
        A: [25, 26, 27, 28, 29, 30],
        B: [24.5, 25, 26, 27, 28, 29],
        C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
        "D & F": [24],
      },
      "Meets Requirements": {
        A: [24.5, 25.5, 26, 26.5, 27, 28],
        B: [24.25, 24.5, 25, 25.5, 26, 26.5],
        C: [24, 24.25, 24.5, 24.75, 25, 25.25],
        "D & F": [24],
      },
    },
    Good: {
      Perfect: {
        A: [24.5, 25, 25.5, 26, 26.5, 27],
        B: [24.25, 24.5, 25, 25.5, 26, 26.5],
        C: [24, 24.25, 24.5, 24.75, 25, 25.25],
        "D & F": [24],
      },
      "Meets Requirements": {
        A: [24.25, 24.5, 25, 25.25, 25.5, 25.75],
        B: [24, 24.25, 24.5, 24.75, 25, 25.25],
        C: [24, 24, 24, 24, 24, 24],
        "D & F": [24],
      },
    },
    Fair: {
      Perfect: {
        A: [24.25, 24.5, 25, 25.25, 25.5, 25.75],
        B: [24, 24.25, 24.5, 24.75, 25, 25.25],
        C: [24, 24, 24, 24, 24, 24],
        "D & F": [24],
      },
      "Meets Requirements": {
        A: [24, 24.25, 24.5, 24.75, 25, 25.25],
        B: [24, 24, 24, 24, 24, 24],
        C: [24, 24, 24, 24, 24, 24],
        "D & F": [24],
      },
    },
    Poor: {
      Perfect: {
        A: [24, 24, 24, 24, 24, 24],
        B: [24, 24, 24, 24, 24, 24],
        C: [24, 24, 24, 24, 24, 24],
        "D & F": [24],
      },
      "Meets Requirements": {
        A: [24, 24, 24, 24, 24, 24],
        B: [24, 24, 24, 24, 24, 24],
        C: [24, 24, 24, 24, 24, 24],
        "D & F": [24],
      },
    },
  };

  const getTenureIndex = () => {
    if (sTier && scorecard === "Fantastic Plus") return 5;
    const years = parseInt(tenure);
    return isNaN(years) ? 0 : Math.min(years, 5);
  };

  const getBonusRate = () => {
    const ratingKey = rating;
    const tierKey = sTier ? "A" : (tier === "D" || tier === "F" ? "D & F" : tier);
    const card = BONUS_MATRIX[scorecard]?.[ratingKey];
    if (!card) return null;
    const rates = card[tierKey];
    if (!rates) return null;
    const base = rates[getTenureIndex()] || 24;
    return {
      hourly: Math.min(base, 32),
      bonusOnly: (Math.min(base, 32) - 24).toFixed(2),
    };
  };

  const result = getBonusRate();
  const isEligible = rating === "Perfect" || rating === "Meets Requirements";
  const qualifiesForNetradyne =
    isEligible && netradyne !== "None" && severeEvent === "No";
  const netradyneBonus = qualifiesForNetradyne
    ? netradyne === "Gold"
      ? 20
      : 10
    : 0;

  const totalHours = parseFloat(hours || 0);
  const otHours = totalHours > 40 ? totalHours - 40 : 0;
  const baseHours = Math.min(totalHours, 40);
  const base = role === "Driver" ? 24 : parseFloat(baseRate || 0);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const newHourly = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otHours).toFixed(2);
  const weeklyBonus = (hourlyBonus * baseHours).toFixed(2);
  const basePayInclOT = (base * baseHours + parseFloat(otPay)).toFixed(2);
  const totalWeeklyPay = ((base + hourlyBonus) * baseHours + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">TierOne Bonus Simulator</h1>

      <div className="space-y-4 mb-6">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>

        <label>Amazon Scorecard</label>
        <select value={scorecard} onChange={(e) => setScorecard(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Fantastic Plus</option>
          <option>Fantastic</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Poor</option>
        </select>

        <label>Weekly Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Perfect</option>
          <option>Meets Requirements</option>
          <option>Needs Improvement</option>
          <option>Action Required</option>
        </select>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label>Performance Grade</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded w-full">
              <option value="">--</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>F</option>
            </select>
          </div>

          <div>
            <label>Years at Stark</label>
            <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="p-2 border rounded w-full">
              <option value="">--</option>
              <option>&lt;1</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5+</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-base font-semibold mb-2">S-Tier Status</label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              disabled={rating !== "Perfect"}
              onClick={() => setSTier(!sTier)}
              className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors ${
                rating !== "Perfect"
                  ? "bg-gray-300 cursor-not-allowed"
                  : sTier
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-200 ${
                  sTier ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700 max-w-xs">
              {rating !== "Perfect"
                ? "S-Tier is locked. Requires a Perfect rating."
                : sTier
                ? "✅ S-Tier enabled — you're now earning top-tier pay."
                : "Have you been Perfect for 13 weeks straight? Toggle to unlock S-Tier status."}
            </span>
          </div>
        </div>

        <label>Total Hours Worked</label>
        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="p-2 border rounded w-full" />

        {role !== "Driver" && (
          <>
            <label>Base Pay</label>
            <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} className="p-2 border rounded w-full" />
          </>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Bonus Results</h2>
        {!result ? (
          <p className="text-red-600">⚠️ Incomplete or invalid input</p>
        ) : (
          <ul className="space-y-2 text-gray-800">
            <li><strong>Your Base Rate:</strong> ${base.toFixed(2)}</li>
            <li><strong>Hourly Bonus:</strong> {isEligible ? `+$${hourlyBonus.toFixed(2)}` : "⚠️ Ineligible for bonus"}</li>
            <li><strong>New Hourly Pay:</strong> {isEligible ? `$${newHourly}` : "⚠️ Ineligible for bonus"}</li>
            <li><strong>Overtime Pay:</strong> ${otPay}</li>
            <li><strong>Weekly Bonus:</strong> {isEligible ? `$${weeklyBonus}` : "⚠️ Ineligible for bonus"}</li>
            <li><strong>Base Pay (incl. OT):</strong> ${basePayInclOT}</li>
            <li><strong>Total Weekly Pay:</strong> {isEligible ? `$${totalWeeklyPay}` : "⚠️ Ineligible for bonus"}</li>
          </ul>
        )}
      </div>
    </div>
  );
<div className="mb-4">
  <label className="flex items-center space-x-2">
    <input type="checkbox" checked={checkND} onChange={(e) => setCheckND(e.target.checked)} />
    <span className="font-medium">Would you like to check your Netradyne Bonus?</span>
  </label>
</div>

{checkND && (
  <div className="bg-green-50 p-4 rounded-lg shadow mb-8">
    <h3 className="font-semibold mb-2">📸 Netradyne Bonus</h3>

    <label>Netradyne Status</label>
    <select value={netradyne} onChange={(e) => setNetradyne(e.target.value)} className="p-2 border rounded w-full mb-2">
      <option value="">--</option>
      <option>Gold</option>
      <option>Silver</option>
      <option>None</option>
    </select>

    <label>Any Severe Events in Last 6 Weeks?</label>
    <select value={severeEvent} onChange={(e) => setSevereEvent(e.target.value)} className="p-2 border rounded w-full mb-2">
      <option value="">--</option>
      <option>No</option>
      <option>Yes</option>
    </select>

    <p><strong>Bonus (if eligible):</strong> ${netradyneBonus}</p>

    <details className="mt-2 text-sm text-gray-700">
      <summary className="font-medium cursor-pointer">Netradyne Bonus Explainer</summary>
      <p className="mt-2">
        The Netradyne Bonus is paid out quarterly if the company earns Gold or Silver status on Amazon's camera safety score.
        You must not have NI or AR ratings or receive major camera flags to qualify.
        If eligible, your bonus accrues weekly and is paid as a lump sum at the end of the quarter.
      </p>
    </details>
  </div>
)}
