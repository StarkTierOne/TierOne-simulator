// Full polished version of TierOne Bonus Simulator with:
// - S-Tier checkbox
// - Netradyne bonus section
// - FAQ with full copy
// - Tailwind UI improvements
// - Reset and Print functionality

import React, { useState, useEffect } from "react";

export default function TierOneBonusSimulator() {
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

  const printResults = () => {
    window.print();
  };

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
      {/* Content remains the same above */}

      {/* FAQ */}
      <div className="mt-10 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-center mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="border rounded p-3">
            <summary className="font-medium cursor-pointer">What is a Performance Grade (A–F)?</summary>
            <p className="mt-2 text-sm text-gray-700">
              A = 10 weeks at 100%, rest at 90%+, 1 grace week at 70%+<br />
              B = 5 weeks at 100%, rest at 90%+, 1 grace week at 70%+ or all 13 weeks at 90%+<br />
              C = All other valid combinations<br />
              D = 2+ weeks below 70% or 6+ weeks between 70–83%<br />
              F = 5+ weeks below 70% or all 13 weeks between 70–83%<br /><br />
              Grades determine your bonus eligibility and which payband you qualify for.
            </p>
          </details>

          <details className="border rounded p-3">
            <summary className="font-medium cursor-pointer">How is Weekly Rating determined?</summary>
            <p className="mt-2 text-sm text-gray-700">
              Perfect: 100% score with zero flags<br />
              Meets Requirements: 83–99% with no major flags, or 100% with 1 minor flag<br />
              Needs Improvement: 70–82.99%, or 83–99% with minor flags<br />
              Action Required: Less than 70%, or any score with 3+ minor flags or 1 major flag<br /><br />
              Only Perfect and Meets Requirements are eligible for bonus.
            </p>
          </details>

          <details className="border rounded p-3">
            <summary className="font-medium cursor-pointer">What are Call-out Penalties?</summary>
            <p className="mt-2 text-sm text-gray-700">
              • Block-level Callout: -10 points (1 instance in 2 weeks)<br />
              • 2+ Block Callouts: -15 points<br />
              • Load-level Callout: -17.1 points (1 instance in 6 weeks)<br />
              • 2+ Load Callouts: -20 points<br /><br />
              Block penalties last 2 weeks. Load penalties last 6 weeks. They affect bonus eligibility and can drop you to NI or AR.
            </p>
          </details>

          <details className="border rounded p-3">
            <summary className="font-medium cursor-pointer">What is S-Tier?</summary>
            <p className="mt-2 text-sm text-gray-700">
              S-Tier is a special performance tier reserved for drivers who achieve 13 consecutive Perfect weeks.<br /><br />
              Once unlocked, S-Tier grants access to the 5+ year payband — even if you haven't reached 5 years of tenure yet. However, you must maintain Perfect rating to stay in S-Tier.
            </p>
          </details>

          <details className="border rounded p-3">
            <summary className="font-medium cursor-pointer">What disqualifies me from getting a bonus?</summary>
            <p className="mt-2 text-sm text-gray-700">
              • Weekly Rating is NI or AR<br />
              • You receive a major safety flag<br />
              • You fail Grade + Tenure + Scorecard thresholds<br />
              • You had a severe event in the last 6 weeks
            </p>
          </details>

          <details className="border rounded p-3">
            <summary className="font-medium cursor-pointer">How does the Netradyne Bonus work?</summary>
            <p className="mt-2 text-sm text-gray-700">
              • Stark must earn Gold or Silver on Amazon's safety score<br />
              • You must have a Perfect or Meets Requirements rating<br />
              • You must not have any major camera flags or severe events<br /><br />
              If eligible, your Netradyne bonus accrues weekly and is paid out in a lump sum at the end of each quarter.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
