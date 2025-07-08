import React, { useState, useEffect, useMemo } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: { A: [26,27,28,29,30,32], B: [25,26,27,28,29,30], C: [24.75,25,25.25,25.5,25.75,26], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [25,26,27,28,29,30], B: [24.5,25,25.5,26,26.5,27], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] }
  },
  Fantastic: {
    Perfect: { A: [25,26,27,28,29,30], B: [24.5,25,26,27,28,29], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24.5,25.5,26,26.5,27,28], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] }
  },
  Good: {
    Perfect: { A: [24.5,25,25.5,26,26.5,27], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }
  },
  Fair: {
    Perfect: { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24,24.25,24.5,24.75,25,25.25], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }
  },
  Poor: {
    Perfect: { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }
  }
};

export default function App() {
  // Core form state
  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);

  // Netradyne
  const [checkND, setCheckND] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);

  // FAQ toggles
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  // New bonus fields
  const [daysWorked, setDaysWorked] = useState("");
  const [driverRejects, setDriverRejects] = useState(0);
  const [amazonRejects, setAmazonRejects] = useState(0);
  const [lunchRate, setLunchRate] = useState("");

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
    setDaysWorked("");
    setDriverRejects(0);
    setAmazonRejects(0);
    setLunchRate("");
  };

  const printResults = () => {
    if (typeof window !== "undefined") window.print();
  };

  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus","Fantastic","Good","Fair"].includes(scorecard)) {
      return 5;
    }
    const y = parseInt(tenure.replace("+",""), 10);
    return isNaN(y) ? 0 : Math.min(y, 5);
  };

  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier ? "A" : (["D","F"].includes(tier) ? "D & F" : tier);
    const rate = card[tierKey]?.[getTenureIndex()] ?? 24;
    return { hourly: Math.min(rate,32), bonusOnly: (Math.min(rate,32)-24).toFixed(2) };
  };

  // Memoized base bonus rate
  const result = useMemo(() => getBonusRate(), [scorecard, rating, tier, tenure, sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;

  // Hours calculations
  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;

  // 39-hour Guarantee eligibility
  const is39Eligible =
    rating === "Perfect" &&
    (parseInt(daysWorked,10) || 0) >= 3 &&
    driverRejects === 0;
  const creditedHours39 = is39Eligible ? Math.max(totalH, 39) : totalH;

  // Lunch bonus eligibility
  const lunchEligible = rating === "Perfect" && ["A","B"].includes(tier);
  const lunchAmt = lunchEligible ? (parseInt(daysWorked,10) || 0) * (parseFloat(lunchRate) || 0) : 0;

  // Base rate
  const base = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const weeklyBonus = (hourlyBonus * creditedHours39).toFixed(2);
  const baseOT = (base * creditedHours39 + parseFloat(otPay)).toFixed(2);
  const totalPay = ((base + hourlyBonus) * creditedHours39 + parseFloat(otPay) + lunchAmt).toFixed(2);

  // Netradyne
  const isEligible = ["Perfect","Meets Requirements"].includes(rating);
  const qualifiesND = checkND && isEligible && netradyne !== "None" && severeEvent === "No";
  const netBonus = qualifiesND ? (netradyne === "Gold" ? 20 : 10) : 0;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block font-medium mb-1">Role</label>
          <select id="role" value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>

        {/* Total Hours */}
        <div>
          <label htmlFor="hours" className="block font-medium mb-1">Total Hours Worked (Optional)</label>
          <input id="hours" type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 38.5" className="w-full border p-2 rounded" />
        </div>

        {/* Base Rate */}
        {(role === "Trainer" || role === "Supervisor") && (
          <div>
            <label htmlFor="baseRate" className="block font-medium mb-1">Base Pay (Optional)</label>
            <input id="baseRate" type="number" value={baseRate} onChange={e => setBaseRate(e.target.value)} placeholder="e.g. 27" className="w-full border p-2 rounded" />
          </div>
        )}

        {/* Scorecard */}
        <div>
          <label htmlFor="scorecard" className="block font-medium mb-1">Amazon Scorecard</label>
          <select id="scorecard" value={scorecard} onChange={e => setScorecard(e.target.value)} className="w-full border p-2 rounded">
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
          <label htmlFor="rating" className="block font-medium mb-1">Weekly Rating</label>
          <select id="rating" value={rating} onChange={e => setRating(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="tier" className="block font-medium mb-1">Performance Grade</label>
          <select id="tier" value={tier} onChange={e => setTier(e.target.value)} className="w-full border p-2 rounded">
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
          <label htmlFor="tenure" className="block font-medium mb-1">Years at Stark</label>
          <select id="tenure" value={tenure} onChange={e => setTenure(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select tenure --</option>
            <option><1</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
          </select>
        </div>

        {/* S-Tier */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="sTier" checked={sTier} onChange={e => setSTier(e.target.checked)} disabled={rating !== "Perfect"} className="w-5 h-5" />
          <label htmlFor="sTier" className="font-medium">S-Tier (13 Perfect Weeks)</label>
        </div>

        {/* Netradyne */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="ndToggle" checked={checkND} onChange={e => setCheckND(e.target.checked)} className="w-5 h-5" />
          <label htmlFor="ndToggle" className="font-medium">Would you like to check your Netradyne Bonus?</label>
        </div>

        {/* 39-Hour Guarantee (only if Rating=Perfect) */}
        {rating === "Perfect" && (
          <div className="space-y-4">
            <h3 className="font-semibold">39-Hour Guarantee</h3>
            <button type="button" aria-expanded={is39Eligible} aria-controls="info-39" className="font-medium" onClick={() => setShowFAQ(!showFAQ)}>
              What’s the 39-Hour Guarantee? {showFAQ ? '▲' : '▼'}
            </button>
            {showFAQ && (
              <div id="info-39" className="text-sm pl-4">
                If you have a Perfect rating, work at least 3 days, and have zero driver-initiated rejects, we’ll credit you up to 39 hours at your base rate even if you worked fewer.
              </div>
            )}
            <div>
              <label htmlFor="daysWorked" className="block font-medium mb-1">Days Worked This Week</label>
              <input id="daysWorked" type="number" min="0" max="7" value={daysWorked} onChange={e => setDaysWorked(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="driverRejects" className="block font-medium mb-1">Driver-Rejected Legs</label>
              <input id="driverRejects" type="number" min="0" value={driverRejects} onChange={e => setDriverRejects(parseInt(e.target.value,10)||0)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="amazonRejects" className="block font-medium mb-1">Amazon-Canceled Legs</label>
              <input id="amazonRejects" type="number" min="0" value={amazonRejects} onChange={e => setAmazonRejects(parseInt(e.target.value,10)||0)} className="w-full border p-2 rounded" />
            </div>
          </div>
        )}

        {/* Paid Lunch Bonus (only if Perfect + Grade A/B) */}
        {rating === "Perfect" && ["A","B"].includes(tier) && (
          <div className="space-y-4">
            <h3 className="font-semibold">Paid Lunch Bonus</h3>
            <button type="button" aria-expanded={lunchEligible} aria-controls="info-lunch" className="font-medium" onClick={() => setShowST(!showST)}>
              What’s the Paid Lunch Bonus? {showST ? '▲' : '▼'}
            </button>
            {showST && (
              <div id="info-lunch" className="text-sm pl-4">
                As long as you have a Perfect rating and Grade A or B, you earn the daily lunch bonus for each day worked. Enter your per-day rate above.
              </div>
            )}
            <div>
              <label htmlFor="lunchRate" className="block font-medium mb-1">Lunch Bonus Rate ($/day)</label>
              <input id="lunchRate" type="number" value={lunchRate} onChange={e => setLunchRate(e.target.value)} placeholder="e.g. 5" className="w-full border p-2 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* Netradyne Block */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</n        </div>
      )}

      {/* Bonus Results */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* Results list ... including totalPay which now includes lunchAmt and creditedHours39 */}
      </div>

      {/* FAQ & Links ... unchanged ... */}
    </div>
  );
}
