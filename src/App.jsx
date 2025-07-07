import React, { useState } from "react";

export default function App() {
  const [scorecard, setScorecard] = useState("Fantastic Plus");
  const [rating, setRating] = useState("Perfect");
  const [tier, setTier] = useState("A");
  const [tenure, setTenure] = useState("1+");
  const [netradyne, setNetradyne] = useState("Gold");
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
    // Add "Fantastic", "Good", etc. if needed
  };

  const getBonusRate = () => {
    if (!BONUS_MATRIX[scorecard] || !BONUS_MATRIX[scorecard][rating]) {
      return null;
    }

    const tierKey = tier === "D" || tier === "F" ? "D & F" : tier;
    const rateArray = BONUS_MATRIX[scorecard][rating][tierKey];

    if (!rateArray) return null;

    const index = tenure === "1+" ? 5 : 0;
    const finalRate = rateArray[index];

    const bonusOnly = finalRate - 24;
    return {
      hourly: finalRate,
      bonusOnly: bonusOnly.toFixed(2),
    };
  };

  const result = getBonusRate();

  const getNetradyneBonus = () => {
    if ((rating === "Perfect" || rating === "Meets") && netradyne !== "None") {
      return netradyne === "Gold" ? 20 : 10;
    }
    return 0;
  };

  const netradyneBonus = getNetradyneBonus();
  const totalBonus = result ? (hours ? Math.min(hours, 40) * result.bonusOnly : null) : null;
  const totalPay = result ? (baseRate ? (parseFloat(baseRate) + result.bonusOnly).toFixed(2) : null) : null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TierOne Bonus Simulator</h1>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={scorecard} onChange={(e) => setScorecard(e.target.value)} className="p-2 border rounded">
          <option>Fantastic Plus</option>
          {/* Add other options if needed */}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded">
          <option>Perfect</option>
          <option>Meets</option>
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded">
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="p-2 border rounded">
          <option value="0">Less than 1 yr</option>
          <option value="1+">1+ Years</option>
        </select>
        <select value={netradyne} onChange={(e) => setNetradyne(e.target.value)} className="p-2 border rounded">
          <option>Gold</option>
          <option>Silver</option>
          <option>None</option>
        </select>
        <input
          type="number"
          placeholder="Hours Worked"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Base Pay ($)"
          value={baseRate}
          onChange={(e) => setBaseRate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Bonus Results Section */}
      <hr className="my-8 border-t-2" />
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bonus Results</h2>
        {!result ? (
          <p className="text-red-600">⚠️ Invalid scorecard or rating</p>
        ) : (
          <ul className="space-y-2">
            <li>🎯 <strong>Hourly Rate with Bonus:</strong> ${result.hourly.toFixed(2)}</li>
            <li>💸 <strong>TierOne Bonus Add-On:</strong> +${result.bonusOnly}/hr</li>
            {hours && <li>🕓 <strong>Total Bonus This Week:</strong> ${totalBonus.toFixed(2)} (capped at 40 hrs)</li>}
            {baseRate && <li>💼 <strong>Total Pay (Base + Bonus):</strong> ${totalPay}</li>}
            {netradyneBonus > 0 && (
              <li>🚛 <strong>Netradyne Bonus:</strong> ${netradyneBonus} (paid quarterly)</li>
            )}
          </ul>
        )}
      </div>

      {/* FAQ + Explainer Section */}
      <hr className="my-8 border-t-2" />
      <div className="faq-section mt-8">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">How is my Tier calculated?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Tier is based on a 13-week rolling score including Amazon performance, call-outs, and flags.
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">What is the Weekly Rating?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Weekly Rating is determined by your Total Score and Flag status. Only Perfect and Meets qualify for bonuses.
          </p>
        </details>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">How does the Netradyne Bonus work?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Drivers with Meets or Perfect ratings and no severe events qualify for $20 (Gold) or $10 (Silver) bonuses, paid quarterly.
          </p>
        </details>
        <a
          href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          📘 View the full explainer guide →
        </a>
      </div>
    </div>
  );
}
