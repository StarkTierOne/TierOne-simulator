// ✅ Final Clean Build — TierOne Bonus Simulator
// Includes: BONUS_MATRIX, full JSX, fixed return(), safe JSX symbols

import React, { useState, useEffect } from "react";

// TIP: Move this outside of the component for better render performance
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: { A: [26, 27, 28, 29, 30, 32], B: [25, 26, 27, 28, 29, 30], C: [24.75, 25, 25.25, 25.5, 25.75, 26], "D & F": [24] },
    "Meets Requirements": { A: [25, 26, 27, 28, 29, 30], B: [24.5, 25, 25.5, 26, 26.5, 27], C: [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24] }
  },
  Fantastic: {
    Perfect: { A: [25, 26, 27, 28, 29, 30], B: [24.5, 25, 26, 27, 28, 29], C: [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24] },
    "Meets Requirements": { A: [24.5, 25.5, 26, 26.5, 27, 28], B: [24.25, 24.5, 25, 25.5, 26, 26.5], C: [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24] }
  },
  Good: {
    Perfect: { A: [24.5, 25, 25.5, 26, 26.5, 27], B: [24.25, 24.5, 25, 25.5, 26, 26.5], C: [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24] },
    "Meets Requirements": { A: [24.25, 24.5, 25, 25.25, 25.5, 25.75], B: [24, 24.25, 24.5, 24.75, 25, 25.25], C: [24, 24, 24, 24, 24, 24], "D & F": [24] }
  },
  Fair: {
    Perfect: { A: [24.25, 24.5, 25, 25.25, 25.5, 25.75], B: [24, 24.25, 24.5, 24.75, 25, 25.25], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
    "Meets Requirements": { A: [24, 24.25, 24.5, 24.75, 25, 25.25], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24] }
  },
  Poor: {
    Perfect: { A: [24, 24, 24, 24, 24, 24], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
    "Meets Requirements": { A: [24, 24, 24, 24, 24, 24], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24] }
  }
};

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

  const resetForm = () => {
    setRole(""); setScorecard(""); setRating(""); setTier("");
    setTenure(""); setSTier(false); setNetradyne(""); setSevereEvent("");
    setCheckND(false); setHours(""); setBaseRate("");
  };

  const printResults = () => window.print();

  const getTenureIndex = () => {
    const validSTierScores = ["Fantastic Plus", "Fantastic", "Good", "Fair"];
    if (sTier && validSTierScores.includes(scorecard)) return 5;
    const years = parseInt(tenure);
    return isNaN(years) ? 0 : Math.min(years, 5);
  };

  const getBonusRate = () => {
    const ratingKey = rating === "Meets" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[ratingKey];
    if (!card) return null;
    const tierKey = sTier ? "A" : (tier === "D" || tier === "F" ? "D & F" : tier);
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
  const qualifiesForNetradyne = isEligible && netradyne !== "None" && severeEvent === "No";
  const netradyneBonus = qualifiesForNetradyne ? (netradyne === "Gold" ? 20 : 10) : 0;

  const totalHours = parseFloat(hours || 0);
  const otHours = totalHours > 40 ? totalHours - 40 : 0;
  const baseHours = Math.min(totalHours, 40);
  const base = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const newHourly = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otHours).toFixed(2);
  const weeklyBonus = (hourlyBonus * baseHours).toFixed(2);
  const basePayInclOT = (base * baseHours + parseFloat(otPay)).toFixed(2);
  const totalWeeklyPay = ((base + hourlyBonus) * baseHours + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-bold text-center mb-8">TierOne Bonus Simulator</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow-md">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>

        <label>Total Hours Worked</label>
        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 38.5" className="p-2 border rounded w-full" />

        {role !== "Driver" && (
          <>
            <label>Base Pay</label>
            <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} placeholder="e.g. 27" className="p-2 border rounded w-full" />
            <p className="text-xs text-gray-500 mt-1">* Trainers/Supervisors: Enter your base pay here</p>
          </>
        )}

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

        <label>Performance Grade</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>

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

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={sTier} onChange={(e) => setSTier(e.target.checked)} disabled={rating !== "Perfect"} className="w-5 h-5" />
          <span>S-Tier (13 Perfect Weeks)</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={checkND} onChange={(e) => setCheckND(e.target.checked)} className="w-5 h-5" />
          <span>📸 Check Netradyne Bonus</span>
        </label>

        {checkND && (
          <div className="bg-green-50 p-4 rounded-lg">
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
          </div>
        )}
      </div>
    </div>
  );
}
