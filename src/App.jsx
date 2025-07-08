// ✅ Final Clean Build — TierOne Bonus Simulator
// Includes: BONUS_MATRIX, full JSX, fixed return(), safe JSX symbols

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

  const resetForm = () => {
    setRole(""); setScorecard(""); setRating(""); setTier("");
    setTenure(""); setSTier(false); setNetradyne(""); setSevereEvent("");
    setCheckND(false); setHours(""); setBaseRate("");
  };

  const printResults = () => window.print();

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

        <label>Total Hours Worked</label>
        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 38.5" className="p-2 border rounded w-full" />

        {role !== "Driver" && (
          <>
            <label>Base Pay</label>
            <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} placeholder="e.g. 27" className="p-2 border rounded w-full" />
          </>
        )}

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

      <div className="bg-blue-50 p-6 mt-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Bonus Results</h2>
        {!result ? (
          <p className="text-red-600">⚠️ Incomplete or invalid input</p>
        ) : (
          <ul className="space-y-1">
            <li><strong>Your Base Rate:</strong> ${base.toFixed(2)}</li>
            <li><strong>Hourly Bonus:</strong> {isEligible ? `+$${hourlyBonus.toFixed(2)}` : "⚠️ Ineligible for bonus"}</li>
            <li><strong>New Hourly Pay:</strong> {isEligible ? `$${newHourly}` : "⚠️ Ineligible for bonus"}</li>
            <li><strong>Overtime Pay:</strong> ${otPay}</li>
            <li><strong>Weekly Bonus:</strong> {isEligible ? `$${weeklyBonus}` : "⚠️ Ineligible for bonus"}</li>
            <li><strong>Base Pay (incl. OT):</strong> ${basePayInclOT}</li>
            <li><strong>Total Weekly Pay:</strong> {isEligible ? `$${totalWeeklyPay}` : "⚠️ Ineligible for bonus"}</li>
          </ul>
        )}
        <div className="mt-4 flex gap-4">
          <button onClick={resetForm} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">Reset</button>
          <button onClick={printResults} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded">Print</button>
        </div>
      </div>

      <div className="mt-10 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-center mb-4">Frequently Asked Questions</h2>
        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">What is a Performance Grade (A–F)?</summary>
          <p className="mt-2 text-gray-700">
            A = 10 weeks at 100%, rest ≥90%, 1 grace week ≥70%<br />
            B = 5 weeks at 100%, rest ≥90%, 1 grace week ≥70% or all 13 weeks ≥90%<br />
            C = All other valid combinations<br />
            D = 2+ weeks &lt;70% or 6+ weeks between 70–83%<br />
            F = 5+ weeks &lt;70% or all 13 weeks between 70–83%
          </p>
        </details>
        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">How is Weekly Rating determined?</summary>
          <p className="mt-2 text-gray-700">
            Perfect: 100% score, no flags<br />
            Meets: 83–99% + no major flags or 100% + 1 minor flag<br />
            NI: 70–82.99% or 83–99% with minor flags<br />
            AR: &lt;70% or 3+ minor flags or any major flag
          </p>
        </details>
        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">What disqualifies me from bonuses?</summary>
          <p className="mt-2 text-gray-700">
            • Rating is NI or AR<br />
            • Major camera flag<br />
            • Didn’t meet Grade/Tenure/Scorecard threshold<br />
            • Recent severe event
          </p>
        </details>
        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">What is S-Tier?</summary>
          <p className="mt-2 text-gray-700">
            13 Perfect weeks in a row. Unlocks 5-year bonus rate. Must maintain Perfect to stay in.
          </p>
        </details>
        <details className="border rounded p-3">
          <summary className="font-medium cursor-pointer">How does the Netradyne Bonus work?</summary>
          <p className="mt-2 text-gray-700">
            • Stark must earn Gold or Silver<br />
            • Rating = Perfect or Meets<br />
            • No severe events<br />
            Bonus accrues weekly and is paid at quarter-end
          </p>
        </details>
      </div>
    </div>
  );
}
