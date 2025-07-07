import React, { useState, useEffect } from "react";

export default function App() {
  const [role, setRole] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);
  const [netradyne, setNetradyne] = useState("");
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
      Meets: {
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
      Meets: {
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
      Meets: {
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
      Meets: {
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
      Meets: {
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
    const card = BONUS_MATRIX[scorecard]?.[rating];
    if (!card) return null;
    const tierKey = tier === "D" || tier === "F" ? "D & F" : tier;
    const rates = card[tierKey];
    if (!rates) return null;
    const base = rates[getTenureIndex()] || 24;
    const capped = Math.min(base, 32);
    return {
      hourly: capped,
      bonusOnly: (capped - 24).toFixed(2),
    };
  };

  const result = getBonusRate();
  const isEligible = rating === "Perfect" || rating === "Meets";
  const bonusMessage = !isEligible ? "⚠️ Ineligible for bonus" : "";

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
  const netradyneBonus =
    (rating === "Perfect" || rating === "Meets") && netradyne !== "None"
      ? netradyne === "Gold"
        ? 20
        : 10
      : 0;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TierOne Bonus Simulator</h1>

      <div className="space-y-4 mb-6">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Select Role</option>
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>

        <select value={scorecard} onChange={(e) => setScorecard(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Amazon Scorecard</option>
          <option>Fantastic Plus</option>
          <option>Fantastic</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Poor</option>
        </select>

        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Weekly Rating</option>
          <option>Perfect</option>
          <option>Meets</option>
          <option>Needs Improvement</option>
          <option>Action Required</option>
        </select>

        <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Tier Grade</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>

        <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Years at Stark</option>
          <option>&lt;1</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5+</option>
        </select>

        <select value={netradyne} onChange={(e) => setNetradyne(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Netradyne Status</option>
          <option>Gold</option>
          <option>Silver</option>
          <option>None</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sTier}
            disabled={rating !== "Perfect"}
            onChange={(e) => setSTier(e.target.checked)}
          />
          <span>S-Tier (Perfect only)</span>
        </label>

        <input
          type="number"
          placeholder="Total Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="p-2 border rounded w-full"
        />

        {role !== "Driver" && (
          <input
            type="number"
            placeholder="Base Pay (e.g. 28)"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Bonus Results</h2>
        {!result ? (
          <p className="text-red-600">⚠️ Incomplete or invalid input</p>
        ) : (
          <ul className="space-y-2 text-gray-800">
            <li><strong>Your Base Rate:</strong> ${base.toFixed(2)}</li>
            <li><strong>Hourly Bonus:</strong> {isEligible ? `+$${hourlyBonus.toFixed(2)}` : bonusMessage}</li>
            <li><strong>New Hourly Pay:</strong> {isEligible ? `$${newHourly}` : bonusMessage}</li>
            <li><strong>Overtime Pay:</strong> ${otPay}</li>
            <li><strong>Weekly Bonus:</strong> {isEligible ? `$${weeklyBonus}` : bonusMessage}</li>
            <li><strong>Base Pay (incl. OT):</strong> ${basePayInclOT}</li>
            <li><strong>Total Weekly Pay:</strong> {isEligible ? `$${totalWeeklyPay}` : bonusMessage}</li>
            <li><strong>Netradyne Bonus:</strong> ${netradyneBonus}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
