import React, { useState } from "react";

export default function App() {
  const [role, setRole] = useState("Driver");
  const [scorecard, setScorecard] = useState("Fantastic Plus");
  const [rating, setRating] = useState("Perfect");
  const [tier, setTier] = useState("A");
  const [tenure, setTenure] = useState("<1 yr");
  const [sTier, setSTier] = useState(false);
  const [netradyne, setNetradyne] = useState("Gold");
  const [hours, setHours] = useState("");
  const [otHours, setOtHours] = useState("");
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
  };

  const getTenureIndex = () => {
    if (sTier && scorecard === "Fantastic Plus") return 5; // Only unlocks 5-year pay
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
    const capped = Math.min(base, 32); // Max pay = $24 + $8 bonus
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

  const hrs = Math.min(parseFloat(hours || 0), 40);
  const ot = parseFloat(otHours || 0);
  const base = role === "Driver" ? 24 : parseFloat(baseRate || 0);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const newHourly = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * ot).toFixed(2);
  const weeklyBonus = (hourlyBonus * hrs).toFixed(2);
  const basePayInclOT = (base * hrs + parseFloat(otPay)).toFixed(2);
  const totalWeeklyPay = ((base + hourlyBonus) * hrs + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TierOne Bonus Simulator</h1>

      {/* Input Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm font-medium text-gray-700">
        <label>Role</label>
        <label>Amazon Scorecard</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded">
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>
        <select value={scorecard} onChange={(e) => setScorecard(e.target.value)} className="p-2 border rounded">
          <option>Fantastic Plus</option>
          <option>Fantastic</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Poor</option>
        </select>

        <label>Weekly Rating</label>
        <label>Tier Grade</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded">
          <option>Perfect</option>
          <option>Meets</option>
          <option>Needs Improvement</option>
          <option>Action Required</option>
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded">
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>

        <label>Tenure</label>
        <label>Netradyne Status</label>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="p-2 border rounded">
          <option>&lt;1 yr</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5+</option>
        </select>
        <select value={netradyne} onChange={(e) => setNetradyne(e.target.value)} className="p-2 border rounded">
          <option>Gold</option>
          <option>Silver</option>
          <option>None</option>
        </select>

        <label>S-Tier?</label>
        <label>Hours Worked</label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={sTier} onChange={(e) => setSTier(e.target.checked)} />
          <span>Enable</span>
        </label>
        <input
          type="number"
          placeholder="Up to 40"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="p-2 border rounded"
        />

        <label>Overtime Hours</label>
        {role !== "Driver" && <label>Base Rate</label>}
        <input
          type="number"
          placeholder="e.g. 5"
          value={otHours}
          onChange={(e) => setOtHours(e.target.value)}
          className="p-2 border rounded"
        />
        {role !== "Driver" && (
          <input
            type="number"
            placeholder="e.g. 28"
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
          <p className="text-red-600">⚠️ Invalid combination</p>
        ) : (
          <ul className="space-y-2 text-gray-800">
            <li><strong>Your Base Rate:</strong> ${base.toFixed(2)}</li>
            <li><strong>Hourly Bonus:</strong> +${hourlyBonus.toFixed(2)}</li>
            <li><strong>New Hourly Pay (Base + Bonus):</strong> ${newHourly}</li>
            <li><strong>Overtime Rate (Base × 1.5):</strong> ${(base * 1.5).toFixed(2)}</li>
            <li><strong>Weekly Bonus Total (Max 40 hrs):</strong> ${weeklyBonus}</li>
            <li><strong>Base Pay (incl. OT):</strong> ${basePayInclOT}</li>
            <li><strong>Total Weekly Pay (with Bonus):</strong> ${totalWeeklyPay}</li>
            <li><strong>Netradyne Bonus:</strong> ${netradyneBonus} (Paid quarterly)</li>
          </ul>
        )}
      </div>

      {/* FAQ + Explainer */}
      <div className="faq-section mt-10">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">Performance Grade (A–F)</summary>
          <p className="text-sm text-gray-600 mt-1">
            A = 10 weeks @ 100%, rest ≥90%, 1 grace week ≥70%<br />
            B = 5 weeks @ 100%, rest ≥90%, 1 grace ≥70% or all 13 ≥90%<br />
            C = Catch-all<br />
            D = 2+ weeks &lt;70% or 6+ weeks 70–83%<br />
            F = 5+ weeks &lt;70% or 13 weeks 70–83%
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">Weekly Rating Definitions</summary>
          <p className="text-sm text-gray-600 mt-1">
            Perfect = 100% + No Flags<br />
            Meets = 83–99% no major flag or 100% with minor flag<br />
            Needs Improvement = 70–82% or minor flags<br />
            Action Required = &lt;70%, major flag, or 3+ minor flags
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">S-Tier and Forgiveness</summary>
          <p className="text-sm text-gray-600 mt-1">
            S-Tier requires 13 Perfect weeks. Unlocks 5-year pay if Amazon Scorecard is Fantastic Plus.
            Forgiveness: Net ≥950 = 97.5% On-time OK. Net = 1000 = 97.0% OK.
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">Call-out Penalties</summary>
          <p className="text-sm text-gray-600 mt-1">
            Block-level: -10 (1), -15 (2+). Load-level: -17.1 (1), -20 (2+). Duration: 6 weeks.
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
