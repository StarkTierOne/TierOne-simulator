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
  const [baseRate, setBaseRate] = useState("");

  const BONUS_MATRIX = {
    "Fantastic Plus": {
      Perfect: {
        S: [30, 31, 32, 33, 34, 35],
        A: [26, 27, 28, 29, 30, 32],
        B: [25, 26, 27, 28, 29, 30],
        C: [24.75, 25, 25.25, 25.5, 25.75, 26],
        "D & F": [24],
      },
      Meets: {
        S: [28, 29, 30, 31, 32, 33],
        A: [25, 26, 27, 28, 29, 30],
        B: [24.5, 25, 25.5, 26, 26.5, 27],
        C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
        "D & F": [24],
      },
    },
    // Add other scorecards (Fantastic, Good, etc.) if needed
  };

  const getTenureIndex = () => {
    if (sTier) return 5;
    const years = parseInt(tenure);
    return isNaN(years) ? 0 : Math.min(years, 5);
  };

  const getBonusRate = () => {
    const card = BONUS_MATRIX[scorecard]?.[rating];
    if (!card) return null;
    const tierKey = sTier ? "S" : (tier === "D" || tier === "F" ? "D & F" : tier);
    const rates = card[tierKey];
    if (!rates) return null;
    const rate = rates[getTenureIndex()];
    return {
      hourly: rate,
      bonusOnly: (rate - 24).toFixed(2),
    };
  };

  const result = getBonusRate();
  const netradyneBonus = (rating === "Perfect" || rating === "Meets") && netradyne !== "None"
    ? netradyne === "Gold" ? 20 : 10
    : 0;

  const hrs = Math.min(parseFloat(hours || 0), 40);
  const base = role === "Driver" ? 24 : parseFloat(baseRate || 0);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const newHourly = (base + hourlyBonus).toFixed(2);
  const otRate = (base * 1.5).toFixed(2);
  const weeklyBonus = (hourlyBonus * hrs).toFixed(2);
  const basePayInclOT = (base * hrs).toFixed(2);
  const totalWeeklyPay = ((base + hourlyBonus) * hrs).toFixed(2);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TierOne Bonus Simulator</h1>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={sTier} onChange={(e) => setSTier(e.target.checked)} />
          <span>S-Tier?</span>
        </label>
        <input
          type="number"
          placeholder="Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="p-2 border rounded"
        />
        {role !== "Driver" && (
          <input
            type="number"
            placeholder="Base Pay"
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
            <li><strong>Overtime Rate (Base × 1.5):</strong> ${otRate}</li>
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
          <summary className="font-medium cursor-pointer">What is TierOne?</summary>
          <p className="mt-2 text-sm text-gray-600">A pay system based on Amazon performance, weekly ratings, and tenure.</p>
        </details>
        <details className="mb-2">
          <summary className="font-medium cursor-pointer">How is my Grade calculated?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Grade = your 13-week Total Score average, based on: On-time performance, Netradyne score, Acceptance rate, Block & Load callouts.
          </p>
        </details>
        <details className="mb-2">
          <summary className="font-medium cursor-pointer">What is Weekly Rating?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Weekly Rating = your performance this week (Perfect, Meets, NI, AR). Determines eligibility for bonuses.
          </p>
        </details>
        <details className="mb-2">
          <summary className="font-medium cursor-pointer">How do I qualify for S-Tier?</summary>
          <p className="mt-2 text-sm text-gray-600">
            S-Tier = 13 consecutive Perfect weeks. Unlocks top bonus tier early (without waiting 5+ years).
          </p>
        </details>
        <details className="mb-2">
          <summary className="font-medium cursor-pointer">What are the Meets Requirements?</summary>
          <p className="mt-2 text-sm text-gray-600">
            On-time ≥ 98%, Netradyne ≥ 900, Acceptance ≥ 99%. Forgiveness: Netradyne ≥ 950 allows 97.5% On-time. Netradyne 1000 allows 97.0%.
          </p>
        </details>
        <details className="mb-2">
          <summary className="font-medium cursor-pointer">How do callouts affect my score?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Block callouts: -10 (1x), -15 (2+). Load callouts: -17.1 (1), -20 (2+). Penalties last 6 weeks.
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
