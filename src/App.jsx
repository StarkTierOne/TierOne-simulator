import React, { useState } from "react";

const BONUS_MATRIX = {
  // [Same matrix as before — left out here for space, keep yours]
};

const TIER_OPTIONS = ["S-TIER", "A", "B", "C", "D & F"];
const SCORECARD_OPTIONS = ["Fantastic Plus", "Fantastic", "Good", "Fair", "Poor"];
const RATING_OPTIONS = ["Perfect", "Meets"];
const ROLE_OPTIONS = ["Driver", "Trainer", "Supervisor"];
const TENURE_OPTIONS = ["< 1", "1", "2", "3", "4", "5", "5+"];
const NETRADYNE_STATUS_OPTIONS = ["Gold", "Silver", "None"];
const DRIVER_EVENT_OPTIONS = ["No", "Yes"];

function getTenureIndex(tenure) {
  if (tenure === "< 1") return 0;
  if (tenure === "5+") return 5;
  const t = parseInt(tenure);
  return isNaN(t) ? null : Math.min(t, 5);
}

function getBonusRate(scorecard, rating, tier, tenure) {
  const idx = getTenureIndex(tenure);
  if (idx === null) return { rate: null, addOn: null, reason: "Invalid tenure" };
  const matrix = BONUS_MATRIX[scorecard]?.[rating];
  if (!matrix) return { rate: null, addOn: null, reason: "Invalid scorecard or rating" };
  if (tier === "S-TIER") {
    const allRates = Object.values(matrix).flat().filter(Number.isFinite);
    const rate = Math.max(...allRates);
    return { rate, addOn: rate - 24, reason: null };
  }
  const tierKey = scorecard === "Poor" ? "All" : tier;
  const rates = matrix[tierKey];
  const rate = Array.isArray(rates) ? rates[idx] : null;
  return rate ? { rate, addOn: rate - 24, reason: null } : { rate: null, addOn: null, reason: "No eligible bonus" };
}

const formatDecimal = (val) => (val ? val.toFixed(2) : "0.00");
export default function App() {
  const [scorecard, setScorecard] = useState("Fantastic");
  const [rating, setRating] = useState("Perfect");
  const [tier, setTier] = useState("A");
  const [tenure, setTenure] = useState("< 1");
  const [role, setRole] = useState("Driver");
  const [baseRate, setBaseRate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [netradyneStatus, setNetradyneStatus] = useState("Gold");
  const [driverEvent, setDriverEvent] = useState("No");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const bonus = getBonusRate(scorecard, rating, tier, tenure);
    if (!bonus.rate) return setResult(bonus);

    const base = role === "Driver" ? 24 : parseFloat(baseRate);
    const hours = parseFloat(hoursWorked);
    const validBase = !isNaN(base);
    const validHours = !isNaN(hours);
    const cappedHours = validHours ? Math.min(hours, 40) : null;
    const bonusTotal = validHours ? bonus.addOn * cappedHours : null;
    const totalPay = validBase && validHours ? (base + bonus.addOn) * cappedHours : null;

    let netradyneBonus = 0;
    if (driverEvent === "No") {
      if (netradyneStatus === "Gold") netradyneBonus = 20;
      else if (netradyneStatus === "Silver") netradyneBonus = 10;
    }

    setResult({
      ...bonus,
      baseRate: validBase ? base : null,
      hoursWorked: validHours ? cappedHours : null,
      bonusTotal,
      totalPay,
      netradyneBonus
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>TierOne Bonus Simulator</h1>

      <label>Amazon Scorecard:</label>
      <select value={scorecard} onChange={(e) => setScorecard(e.target.value)}>
        {SCORECARD_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      <label>Weekly Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {RATING_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      <label>Tier Grade:</label>
      <select value={tier} onChange={(e) => setTier(e.target.value)}>
        {TIER_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      <label>Tenure (Years):</label>
      <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
        {TENURE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      <label>Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        {ROLE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      {role !== "Driver" && (
        <>
          <label>Your Base Pay ($/hr):</label>
          <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} placeholder="e.g. 26.00" />
        </>
      )}

      <label>Hours Worked This Week <em>(Optional)</em>:</label>
      <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} placeholder="e.g. 40" />

      <hr style={{ margin: "2rem 0" }} />

      <label>Company Netradyne Status:</label>
      <select value={netradyneStatus} onChange={(e) => setNetradyneStatus(e.target.value)}>
        {NETRADYNE_STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      <label>Any Severe Events in Last 6 Weeks?</label>
      <select value={driverEvent} onChange={(e) => setDriverEvent(e.target.value)}>
        {DRIVER_EVENT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
      </select>

      <button onClick={calculate} style={{ marginTop: 20 }}>Calculate Bonus</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          {result.rate ? (
            <>
              <strong>TierOne Bonus:</strong> +${formatDecimal(result.addOn)}/hr<br />
              {result.baseRate !== null && result.hoursWorked !== null && (
                <>
                  <strong>Total Bonus This Week:</strong> ${formatDecimal(result.bonusTotal)}<br />
                  <strong>Total Pay (with Bonus):</strong> ${formatDecimal(result.totalPay)}<br />
                </>
              )}
              {result.baseRate !== null && result.hoursWorked === null && (
                <><strong>Total Hourly Pay:</strong> ${(result.baseRate + result.addOn).toFixed(2)}/hr<br /></>
              )}
              {result.baseRate === null && result.hoursWorked !== null && (
                <><strong>Total Bonus This Week:</strong> ${formatDecimal(result.bonusTotal)}<br /></>
              )}
              <br /><strong>Netradyne Bonus:</strong> ${formatDecimal(result.netradyneBonus)}
            </>
          ) : (
            <span style={{ color: "red" }}>⚠️ {result.reason}</span>
          )}
        </div>
      )}
    </div>
  );
}
