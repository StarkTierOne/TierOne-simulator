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

 <span className="text-sm text-gray-700">
  {rating !== "Perfect"
    ? "S-Tier requires a Perfect rating"
    : sTier
    ? "✅ S-Tier enabled — top pay unlocked"
    : "Have you been Perfect for 13 weeks straight? Toggle to unlock S-Tier status and earn top-tier pay."}
</span>

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
    <summary className="font-medium cursor-pointer">What is a Performance Grade (A–F)?</summary>
    <p className="mt-2 text-sm text-gray-700">
      Your Performance Grade is based on your last 13 weeks of overall Total Score.
      <br /><br />
      <strong>A Grade:</strong> 10 weeks at 100%, rest at 90%+, 1 grace week at 70%+<br />
      <strong>B Grade:</strong> 5 weeks at 100%, rest at 90%+, 1 grace week at 70%+ or all 13 weeks at 90%+<br />
      <strong>C Grade:</strong> All other valid combinations<br />
      <strong>D Grade:</strong> 2+ weeks below 70% or 6+ weeks between 70–83%<br />
      <strong>F Grade:</strong> 5+ weeks below 70% or all 13 weeks between 70–83%<br /><br />
      Grades determine your bonus eligibility and which payband you qualify for.
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">How is Weekly Rating determined?</summary>
    <p className="mt-2 text-sm text-gray-700">
      Weekly Rating reflects how you performed this week — it's based on your Total Score plus any safety, attendance, or behavioral flags.
      <br /><br />
      <strong>Perfect:</strong> 100% score with zero flags<br />
      <strong>Meets Requirements:</strong> 83–99% with no major flags, or 100% with 1 minor flag<br />
      <strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with minor flags<br />
      <strong>Action Required:</strong> Less than 70%, or any score with 3+ minor flags or 1 major flag<br /><br />
      Only Perfect and Meets Requirements are eligible for bonus.
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">What are Call-out Penalties?</summary>
    <p className="mt-2 text-sm text-gray-700">
      Call-outs directly reduce your Total Score and affect both Weekly Rating and Grade.
      <br /><br />
      • <strong>Block-level Callout:</strong> -10 points (1 instance in 2 weeks)<br />
      • <strong>2+ Block Callouts:</strong> -15 points<br />
      • <strong>Load-level Callout:</strong> -17.1 points (1 instance in 6 weeks)<br />
      • <strong>2+ Load Callouts:</strong> -20 points<br /><br />
      Block-level penalties last for 2 weeks. Load-level penalties last for 6 weeks. They affect bonus eligibility and can drop you to NI or AR.
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">What is S-Tier?</summary>
    <p className="mt-2 text-sm text-gray-700">
      S-Tier is a special performance tier reserved for drivers who achieve <strong>13 consecutive Perfect weeks</strong>.
      <br /><br />
      Once unlocked, S-Tier grants access to the 5+ year payband — even if you haven't reached 5 years of tenure yet. However, you must maintain Perfect rating to stay in S-Tier.
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">What disqualifies me from getting a bonus?</summary>
    <p className="mt-2 text-sm text-gray-700">
      You may be disqualified if:
      <br /><br />
      • Your Weekly Rating is NI or AR<br />
      • You receive a major safety flag (e.g., camera, following distance, seatbelt)<br />
      • You fail to meet Grade + Tenure + Scorecard thresholds for your payband<br />
      • You have a recent severe event that disqualifies you from Netradyne bonus
    </p>
  </details>

  <details className="border rounded p-3">
    <summary className="font-medium cursor-pointer">How does the Netradyne Bonus work?</summary>
    <p className="mt-2 text-sm text-gray-700">
      The Netradyne Bonus is a separate quarterly incentive based on camera safety scores.
      <br /><br />
      • Stark must earn Gold or Silver on Amazon's safety score<br />
      • You must have a Perfect or Meets Requirements rating<br />
      • You must not have any major camera flags or severe events in the last 6 weeks<br /><br />
      If eligible, your Netradyne bonus accrues weekly and is paid out in a lump sum at the end of each quarter.
    </p>
  </details>

  <a href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-block">
    📘 View Full Explainer PDF →
  </a>
</div>
</div>
);
}
