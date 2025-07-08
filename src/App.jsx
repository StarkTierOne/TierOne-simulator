// ✅ Rebuilt TierOne Bonus Simulator
// Includes:
// - All Amazon scorecards
// - Full S-Tier override logic (no manual A/Perfect needed)
// - Clean top-to-bottom layout
// - Bonus Results
// - Netradyne Bonus section
// - Full FAQ section

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

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label>Performance Grade</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)} className="p-2 border rounded w-full">
              <option value="">--</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>F</option>
            </select>
          </div>

          <div>
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
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-semibold">S-Tier Status</label>
              <p className="text-sm text-gray-700">
                Achieve 13 consecutive Perfect weeks to unlock automatic top-tier pay.<br />
                {sTier
                  ? "✅ S-Tier enabled — you're earning the 5-year payband."
                  : rating !== "Perfect"
                  ? "S-Tier is locked. Requires a Perfect rating."
                  : "Toggle below to enable if eligible."}
              </p>
            </div>
            <button
              type="button"
              disabled={rating !== "Perfect"}
              onClick={() => setSTier(!sTier)}
              className={`w-16 h-8 rounded-full border transition-colors duration-300 focus:outline-none ${
                rating !== "Perfect"
                  ? "bg-gray-300 cursor-not-allowed border-gray-400"
                  : sTier
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-500"
                  : "bg-gray-300 border-gray-400"
              }`}
            >
              <div
                className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  sTier ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <label>Total Hours Worked</label>
        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="p-2 border rounded w-full" />

        {role !== "Driver" && (
          <>
            <label>Base Pay</label>
            <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} className="p-2 border rounded w-full" />
          </>
        )}
   </div>
}
{/* Bonus Results */}
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

{/* Netradyne Toggle */}
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

{/* FAQ Section */}
<div className="mt-10 space-y-4">
  <h2 className="text-xl font-semibold text-center">Frequently Asked Questions</h2>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">What is a Performance Grade (A–F)?</summary>
    <p className="mt-2 text-sm text-gray-700">
      Your grade is based on your last 13 weeks of Total Score:<br /><br />
      A = 10 weeks at 100%, rest ≥90%, 1 grace week ≥70%<br />
      B = 5 weeks at 100%, rest ≥90%, 1 grace week ≥70% or all 13 weeks ≥90%<br />
      C = Catch-all<br />
      D = 2+ weeks below 70% or 6+ weeks between 70–83%<br />
      F = 5+ weeks below 70% or 13 weeks between 70–83%
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">What is Weekly Rating?</summary>
    <p className="mt-2 text-sm text-gray-700">
      Rating is based on your Total Score + any safety/behavioral flags:<br /><br />
      Perfect = 100% + No Flags<br />
      Meets = 83–99% + no major flags, or 100% + 1 minor flag<br />
      NI = 70–82.99%, or 83–99% + minor flags<br />
      AR = &lt;70%, or 3+ minor or 1 major flag
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">What are Call-out Penalties?</summary>
    <p className="mt-2 text-sm text-gray-700">
      • Block-level = -10 pts (1x in 2 wks), -15 pts (2+)<br />
      • Load-level = -17.1 pts (1x in 6 wks), -20 pts (2+)<br />
      Block penalties last 2 weeks, load penalties 6 weeks.
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">How does S-Tier work?</summary>
    <p className="mt-2 text-sm text-gray-700">
      S-Tier unlocks the 5-year bonus payband even if you haven’t reached 5 years. Requires 13 straight Perfect weeks to activate. You must maintain Perfect rating to stay in.
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">How does the Netradyne Bonus work?</summary>
    <p className="mt-2 text-sm text-gray-700">
      • Company must earn Gold or Silver<br />
      • You must be Perfect or Meets Requirements<br />
      • No major flags or recent severe events<br /><br />
      Bonus accrues weekly, paid quarterly.
    </p>
  </details>

  <a
    href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline text-sm inline-block"
  >
    📘 View Full Explainer PDF →
  </a>
</div>
