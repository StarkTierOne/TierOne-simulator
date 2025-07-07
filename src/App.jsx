import React, { useState } from "react";

export default function App() {
  const [role, setRole] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [amazonScore, setAmazonScore] = useState("");
  const [weeklyRating, setWeeklyRating] = useState("");
  const [grade, setGrade] = useState("");
  const [calculate, setCalculate] = useState(false);
  const [includeNetradyne, setIncludeNetradyne] = useState(false);

  const isTrainerOrSupervisor = role === "Trainer" || role === "Supervisor";
  const numericHours = parseFloat(hoursWorked || 0);
  const effectiveBaseRate = isTrainerOrSupervisor && baseRate ? parseFloat(baseRate) : 24;
  const regularHours = Math.min(numericHours, 40);
  const overtimeHours = numericHours > 40 ? numericHours - 40 : 0;

  // Bonus/hr logic from your matrix (simplified demo version)
  function getBonusRate() {
    if (grade === "S-Tier" && weeklyRating === "Perfect" && amazonScore === "Fantastic Plus") return 8.0;
    if (grade === "A" && weeklyRating === "Perfect" && parseFloat(tenure) >= 5 && amazonScore === "Fantastic") return 7.5;
    if (grade === "B" && weeklyRating === "Perfect" && parseFloat(tenure) >= 3 && amazonScore === "Fantastic") return 6.5;
    if (grade === "C" && weeklyRating === "Perfect" && parseFloat(tenure) >= 1 && amazonScore === "Fantastic") return 5.5;
    if (grade === "C" && weeklyRating === "Perfect" && parseFloat(tenure) < 1 && amazonScore === "Fantastic Plus") return 0.75;
    if (["Fair", "Poor"].includes(amazonScore)) return 0;
    if (grade === "C" && weeklyRating === "Meets Requirements" && parseFloat(tenure) < 1) return 0;
    if (["Action Required", "Needs Improvement"].includes(weeklyRating)) return 0;
    return 0; // fallback
  }

  const bonusRate = getBonusRate();
  const bonusPay = regularHours * bonusRate;
  const basePay = effectiveBaseRate * regularHours;
  const otPay = overtimeHours * effectiveBaseRate * 1.5;

  // Netradyne bonus logic
  const netradyneBonus =
    includeNetradyne && ["Perfect", "Meets Requirements"].includes(weeklyRating)
      ? amazonScore === "Fantastic Plus" || amazonScore === "Fantastic"
        ? 20
        : amazonScore === "Good"
        ? 10
        : 0
      : 0;

  const totalPay = basePay + bonusPay + otPay + netradyneBonus;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-sm">
      <h1 className="text-xl font-bold">TierOne Bonus Simulator</h1>

      <div>
        <label className="block font-medium mb-1">Select Your Role:</label>
        <select className="w-full border p-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Choose Role --</option>
          <option value="Driver">Driver</option>
          <option value="Trainer">Trainer</option>
          <option value="Supervisor">Supervisor</option>
        </select>
      </div>

      <div>
        <label className="block">Hours Worked (optional):</label>
        <input type="number" className="w-full border p-2" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} />
      </div>

      {isTrainerOrSupervisor && (
        <div>
          <label className="block">Base Rate (optional):</label>
          <input type="number" className="w-full border p-2" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} />
        </div>
      )}

      <div>
        <label className="block">Years at Stark (Tenure):</label>
        <input type="number" step="0.1" className="w-full border p-2" value={tenure} onChange={(e) => setTenure(e.target.value)} />
      </div>

      <div>
        <label className="block">Amazon Scorecard Rating:</label>
        <select className="w-full border p-2" value={amazonScore} onChange={(e) => setAmazonScore(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Fantastic Plus">Fantastic Plus</option>
          <option value="Fantastic">Fantastic</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block">Weekly Rating:</label>
        <select className="w-full border p-2" value={weeklyRating} onChange={(e) => setWeeklyRating(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Perfect">Perfect</option>
          <option value="Meets Requirements">Meets Requirements</option>
          <option value="Needs Improvement">Needs Improvement</option>
          <option value="Action Required">Action Required</option>
        </select>
      </div>

      <div>
        <label className="block">TierOne Grade:</label>
        <select className="w-full border p-2" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="S-Tier">S-Tier</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
      </div>

      {!calculate && (
        <button onClick={() => setCalculate(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Calculate
        </button>
      )}

      {calculate && (
        <>
          <div className="mt-6 border-t pt-4 space-y-2">
            <h2 className="font-semibold text-lg">💵 Bonus Results</h2>
            <div><strong>Base Pay:</strong> ${basePay.toFixed(2)}</div>
            <div><strong>TierOne Bonus:</strong> ${bonusPay.toFixed(2)}</div>
            {overtimeHours > 0 && <div><strong>Overtime Pay:</strong> ${otPay.toFixed(2)}</div>}
            {includeNetradyne && <div><strong>Netradyne Bonus:</strong> ${netradyneBonus.toFixed(2)}</div>}
            <div className="pt-2 border-t font-bold">Total Weekly Pay: ${totalPay.toFixed(2)}</div>
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={includeNetradyne}
                onChange={(e) => setIncludeNetradyne(e.target.checked)}
              />
              Include Netradyne Bonus
            </label>
          </div>
        </>
      )}
    </div>
  );
}
