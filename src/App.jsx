import React, { useState } from "react";

export default function App() {
  const [role, setRole] = useState("Driver");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");

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
  const netradyneBonus =
    (rating === "Perfect" || rating === "Meets") && netradyne !== "None"
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TierOne Bonus Simulator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded">
          <option value="">Select Role</option>
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>
        <select value={scorecard} onChange={(e) => setScorecard(e.target.value)} className="p-2 border rounded">
          <option value="">Amazon Scorecard</option>
          <option>Fantastic Plus</option>
          <option>Fantastic</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Poor</option>
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded">
          <option value="">Weekly Rating</option>
          <option>Perfect</option>
          <option>Meets</option>
          <option>Needs Improvement</option>
          <option>Action Required</option>
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded">
          <option value="">Tier Grade</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="p-2 border rounded">
          <option value="">Years at Stark</option>
          <option>&lt;1</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5+</option>
        </select>
        <select value={netradyne} onChange={(e) => setNetradyne(e.target.value)} className="p-2 border rounded">
          <option value="">Netradyne Status</option>
          <option>Gold</option>
          <option>Silver</option>
          <option>None</option>
        </select>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={sTier} onChange={(e) => setSTier(e.target.checked)} />
          <span>Enable S-Tier</span>
        </label>
        <input
          type="number"
          placeholder="Total Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="p-2 border rounded"
        />
        {role !== "Driver" && (
          <input
            type="number"
            placeholder="Base Pay (e.g. 28)"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            className="p-2 border rounded"
          />
        )}
      </div>

      {/* Bonus Results */}
      <div className="bg-blue-50 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Bonus Results</h2>
        {!result ? (
          <p className="text-red-600">⚠️ Incomplete or invalid input</p>
        ) : (
          <ul className="space-y-2 text-gray-800">
            <li><strong>Your Base Rate:</strong> ${base.toFixed(2)}</li>
            <li><strong>Hourly Bonus:</strong> +${hourlyBonus.toFixed(2)}</li>
            <li><strong>New Hourly Pay (Base + Bonus):</strong> ${newHourly}</li>
            <li><strong>Overtime Pay:</strong> ${otPay}</li>
            <li><strong>Weekly Bonus Total (first 40 hrs):</strong> ${weeklyBonus}</li>
            <li><strong>Base Pay (incl. OT):</strong> ${basePayInclOT}</li>
            <li><strong>Total Weekly Pay (with Bonus):</strong> ${totalWeeklyPay}</li>
            <li><strong>Netradyne Bonus:</strong> ${netradyneBonus} (Paid quarterly)</li>
          </ul>
        )}
      </div>

      {/* FAQ */}
      <div className="faq-section mt-10">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">Performance Grade (A–F)</summary>
          <p className="text-sm text-gray-600 mt-1">
            Grades are calculated on a rolling 13-week basis.<br />
            A = 10 weeks @ 100%, rest ≥90%, 1 grace week ≥70%<br />
            B = 5 weeks @ 100%, rest ≥90%, 1 grace ≥70% or all 13 ≥90%<br />
            C = Catch-all<br />
            D = 2+ weeks below 70% or 6+ between 70–83%<br />
            F = 5+ weeks below 70% or all 13 weeks between 70–83%
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">Weekly Rating Definitions</summary>
          <p className="text-sm text-gray-600 mt-1">
            Perfect = Total score of 100% + No Flags<br />
            Meets = Score 83–99% and no major flag, or 100% with a minor flag<br />
            Needs Improvement = 70–82.99%, or 83–99% with minor flags<br />
            Action Required = &lt;70%, or any score with 3+ minor flags or 1 major flag
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">Call-out Penalties</summary>
          <p className="text-sm text-gray-600 mt-1">
            • Block-level callout = minus 10 points (1 instance across 2 weeks)<br />
            • 2+ block callouts = minus 15 points<br />
            • Load-level callout = minus 17.1 points (1 instance across 6 weeks)<br />
            • 2+ load-level = minus 20 points<br />
            Block callout penalties last 2 weeks; Load penalties last 6 weeks.
          </p>
        </details>
        <a
          href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing"
          target="_blank"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          📘 View Full Explainer PDF →
        </a>
      </div>
    </div>
  );
}
