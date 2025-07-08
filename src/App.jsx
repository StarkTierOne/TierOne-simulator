import React, { useState, useEffect, useMemo } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: {
      A: [26, 27, 28, 29, 30, 32],
      B: [25, 26, 27, 28, 29, 30],
      C: [24.75, 25, 25.25, 25.5, 25.75, 26],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [25, 26, 27, 28, 29, 30],
      B: [24.5, 25, 25.5, 26, 26.5, 27],
      C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Fantastic: {
    Perfect: {
      A: [25, 26, 27, 28, 29, 30],
      B: [24.5, 25, 26, 27, 28, 29],
      C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24.5, 25.5, 26, 26.5, 27, 28],
      B: [24.25, 24.5, 25, 25.5, 26, 26.5],
      C: [24, 24.25, 24.5, 24.75, 25, 25.25],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Good: {
    Perfect: {
      A: [24.5, 25, 25.5, 26, 26.5, 27],
      B: [24.25, 24.5, 25, 25.5, 26, 26.5],
      C: [24, 24.25, 24.5, 24.75, 25, 25.25],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24.25, 24.5, 25, 25.25, 25.5, 25.75],
      B: [24, 24.25, 24.5, 24.75, 25, 25.25],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Fair: {
    Perfect: {
      A: [24.25, 24.5, 25, 25.25, 25.5, 25.75],
      B: [24, 24.25, 24.5, 24.75, 25, 25.25],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24, 24.25, 24.5, 24.75, 25, 25.25],
      B: [24, 24, 24, 24, 24, 24],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Poor: {
    Perfect: {
      A: [24, 24, 24, 24, 24, 24],
      B: [24, 24, 24, 24, 24, 24],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24, 24, 24, 24, 24, 24],
      B: [24, 24, 24, 24, 24, 24],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
};

export default function App() {
  // State hooks
  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);

  const [checkND, setCheckND] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);

  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  // Reset S-Tier on rating change
  useEffect(() => {
    if (rating !== "Perfect") setSTier(false);
  }, [rating]);

  // Helpers
  const resetForm = () => {
    setRole("");
    setHours("");
    setBaseRate("");
    setScorecard("");
    setRating("");
    setTier("");
    setTenure("");
    setSTier(false);
    setCheckND(false);
    setNetradyne("");
    setSevereEvent("");
  };
  const printResults = () => {
    if (typeof window !== "undefined") window.print();
  };
  const getTenureIndex = () => {
    if (
      sTier &&
      ["Fantastic Plus", "Fantastic", "Good", "Fair"].includes(scorecard)
    )
      return 5;
    const y = parseInt(tenure.replace("+", ""), 10);
    return isNaN(y) ? 0 : Math.min(y, 5);
  };
  const getBonusRate = () => {
    const key =
      rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier
      ? "A"
      : ["D", "F"].includes(tier)
      ? "D & F"
      : tier;
    const rate = card[tierKey]?.[getTenureIndex()] ?? 24;
    return {
      hourly: Math.min(rate, 32),
      bonusOnly: (Math.min(rate, 32) - 24).toFixed(2),
    };
  };

  // Memoized calculations
  const result = useMemo(() => getBonusRate(), [
    scorecard,
    rating,
    tier,
    tenure,
    sTier,
  ]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const isEligible = ["Perfect", "Meets Requirements"].includes(rating);
  const qualifiesND =
    checkND && isEligible && netradyne !== "None" && severeEvent === "No";
  const netBonus = qualifiesND ? (netradyne === "Gold" ? 20 : 10) : 0;

  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;
  const baseH = Math.min(totalH, 40);
  const base = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const weeklyBonus = (hourlyBonus * baseH).toFixed(2);
  const baseOT = (base * baseH + parseFloat(otPay)).toFixed(2);
  const totalPay = ((base + hourlyBonus) * baseH + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">
        TierOne Bonus Simulator
      </h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>

        {/* Hours */}
        <div>
          <label htmlFor="hours" className="block font-medium mb-1">
            Total Hours Worked (Optional)
          </label>
          <input
            id="hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 38.5"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Base Rate */}
        {(role === "Trainer" || role === "Supervisor") && (
          <div>
            <label htmlFor="baseRate" className="block font-medium mb-1">
              Base Pay (Optional)
            </label>
            <input
              id="baseRate"
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              placeholder="e.g. 27"
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        {/* Scorecard, Rating, Grade, Tenure */}
        {/* … identical to above pattern … */}

        {/* S-Tier toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sTier"
            checked={sTier}
            onChange={(e) => setSTier(e.target.checked)}
            disabled={rating !== "Perfect"}
            className="w-5 h-5"
          />
          <label htmlFor="sTier" className="font-medium">
            S-Tier (13 Perfect Weeks)
          </label>
        </div>

        {/* Netradyne toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="ndToggle"
            checked={checkND}
            onChange={(e) => setCheckND(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="ndToggle" className="font-medium">
            Would you like to check your Netradyne Bonus?
          </label>
        </div>
      </div>

      {/* Netradyne Block */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          {/* Status & Events */}
          {/* … */}
          <p className="font-medium">
            Bonus (if eligible): <span className="text-lg">${netBonus}</span>
          </p>
          <button
            type="button"
            aria-expanded={showNDE}
            aria-controls="nd-explainer"
            onClick={() => setShowNDE(!showNDE)}
            className="font-semibold"
          >
            Netradyne Bonus Explainer {showNDE ? "▲" : "▼"}
          </button>
          {showNDE && (
            <div id="nd-explainer" role="region" className="text-sm pl-4">
              The Netradyne Bonus is paid out quarterly if the company earns
              Gold or Silver status on Amazon's camera safety score. You must
              not have NI or AR ratings or receive major camera flags to
              qualify. If eligible, your bonus accrues weekly and is paid as a
              lump sum at the end of the quarter.
            </div>
          )}
        </div>
      )}

      {/* Bonus Results */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold mb-2">Bonus Results</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Your Base Rate: ${base.toFixed(2)}</li>
          <li>Hourly Bonus: +${hourlyBonus.toFixed(2)}/hr</li>
          <li>New Hourly Rate: ${newRate}/hr</li>
          <li>Overtime Pay: ${otPay}</li>
          <li>Weekly Bonus Total: ${weeklyBonus}</li>
          <li>Base Pay (incl. OT): ${baseOT}</li>
          <li>
            <strong>Total Weekly Pay:</strong> ${totalPay}
          </li>
        </ul>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={printResults}
            className="px-4 py-2 border rounded"
          >
            Print
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <button
          type="button"
          aria-expanded={showFAQ}
          aria-controls="faq-section"
          onClick={() => setShowFAQ(!showFAQ)}
          className="font-semibold"
        >
          Frequently Asked Questions {showFAQ ? "▲" : "▼"}
        </button>
        {showFAQ && (
          <div id="faq-section" role="region" className="text-sm space-y-4 pl-4">
            {/* Repeat collapsible pattern for each question with aria attributes */}
            <div>
              <button
                type="button"
                aria-expanded={showPG}
                aria-controls="faq-pg"
                onClick={() => setShowPG(!showPG)}
                className="font-medium"
              >
                What is a Performance Grade (A–F)? {showPG ? "▲" : "▼"}
              </button>
              {showPG && (
                <div id="faq-pg" role="region" className="mt-1">
                  {/* Content */}
                </div>
              )}
            </div>
            {/* …and so on for the other questions… */}
          </div>
        )}
      </div>
    </div>
  );
}
