// ✅ Full top-to-bottom layout for TierOne Bonus Simulator
// ✅ Starts with Role, then Scorecard, Rating, Performance Grade, S-Tier, Tenure, Hours, Base Pay
// ✅ Bonus Results + Netradyne Section + FAQ preserved

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
    const card = BONUS_MATRIX[scorecard]?.[rating];
    if (!card) return null;
    const tierKey = tier === "D" || tier === "F" ? "D & F" : tier;
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

        <label>Performance Grade</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={sTier} disabled={rating !== "Perfect"} onChange={(e) => setSTier(e.target.checked)} />
          <span>Enable S-Tier (Perfect only)</span>
        </label>

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

      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-center">Frequently Asked Questions</h2>

        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">Performance Grade (A–F)</summary>
          <p className="mt-2 text-sm text-gray-700">
            A = 10 weeks at 100%, rest ≥90%, 1 grace week ≥70%<br />
            B = 5 weeks at 100%, rest ≥90%, 1 grace ≥70% or all 13 weeks ≥90%<br />
            C = Catch-all<br />
            D = 2+ weeks below 70% or 6+ weeks between 70–83%<br />
            F = 5+ weeks below 70% or 13 weeks between 70–83%
          </p>
        </details>

        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">Weekly Rating Definitions</summary>
          <p className="mt-2 text-sm text-gray-700">
            Perfect = 100% + No Flags<br />
            Meets Requirements = 83–99% and no major flag, or 100% with a minor flag<br />
            Needs Improvement = 70–82.99%, or 83–99% with minor flags<br />
            Action Required = &lt;70%, or any score with 3+ minor flags or 1 major flag
          </p>
        </details>

        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">Call-out Penalties</summary>
          <p className="mt-2 text-sm text-gray-700">
            • Block-level callout = minus 10 points (1 instance over 2 weeks)<br />
            • 2+ block callouts = minus 15 points<br />
            • Load-level callout = minus 17.1 points (1 instance over 6 weeks)<br />
            • 2+ load-level = minus 20 points<br />
            Block penalties last 2 weeks, load penalties last 6 weeks.
          </p>
        </details>

        <a href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-block">
          📘 View Full Explainer PDF →
        </a>
      </div>
    </div>
  );
}
