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
  // State
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

  // Reset S-Tier if rating changes
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
    const tierKey = sTier ? "A" : ["D", "F"].includes(tier) ? "D & F" : tier;
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
          <label htmlFor="role" className="block font-medium mb-1">Role</label>
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

        {/* Total Hours */}
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

        {/* Base Pay */}
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

        {/* Scorecard */}
        <div>
          <label htmlFor="scorecard" className="block font-medium mb-1">
            Amazon Scorecard
          </label>
          <select
            id="scorecard"
            value={scorecard}
            onChange={(e) => setScorecard(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select scorecard --</option>
            <option>Fantastic Plus</option>
            <option>Fantastic</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block font-medium mb-1">
            Weekly Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="tier" className="block font-medium mb-1">
            Performance Grade
          </label>
          <select
            id="tier"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select grade --</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>F</option>
          </select>
        </div>

        {/* Tenure */}
        <div>
          <label htmlFor="tenure" className="block font-medium mb-1">
            Years at Stark
          </label>
          <select
            id="tenure"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select tenure --</option>
            <option>&lt;1</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
          </select>
        </div>

        {/* S-Tier */}
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

        {/* Netradyne Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="ndToggle"
            checked={checkND}
            onChange={(e) => setCheckND(e.target.checked)}
            className="w-5 h-5"
