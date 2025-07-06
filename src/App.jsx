import React, { useState } from 'react';

const BONUS_MATRIX = {
  "Fantastic Plus": {
    "Perfect": { "A": [26, 27, 28, 29, 30, 32], "B": [25, 26, 27, 28, 29, 30], "C": [24.75, 25, 25.25, 25.5, 25.75, 26], "D & F": [24] },
    "Meets": { "A": [25, 26, 27, 28, 29, 30], "B": [24.5, 25, 25.5, 26, 26.5, 27], "C": [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24] }
  },
  "Fantastic": {
    "Perfect": { "A": [25, 26, 27, 28, 29, 30], "B": [24.5, 25, 25.5, 26, 26.5, 27], "C": [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24] },
    "Meets": { "A": [24.75, 25, 25.25, 25.5, 25.75, 26], "B": [24.25, 24.5, 24.75, 25, 25.25, 25.5], "C": [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24] }
  },
  "Good": {
    "Perfect": { "A": [24.5, 24.75, 25, 25.25, 25.5, 25.75], "B": [24, 24.25, 24.5, 24.75, 25, 25.25], "C": [24] },
    "Meets": { "A": [24.25, 24.5, 24.75, 25, 25.25, 25.5], "B": [24, 24.25, 24.5, 24.75, 25, 25.25], "C": [24] }
  },
  "Fair": {
    "Perfect": { "A": [24, 24.25, 24.5, 24.75, 25, 25.25], "B": [24] },
    "Meets": { "A": [24, 24.25, 24.5, 24.75, 25, 25.25], "B": [24] }
  },
  "Poor": {
    "Perfect": { "All": [24] },
    "Meets": { "All": [24] }
  }
};

const TIER_OPTIONS = ["S-TIER", "A", "B", "C", "D & F"];
const SCORECARD_OPTIONS = ["Fantastic Plus", "Fantastic", "Good", "Fair", "Poor"];
const RATING_OPTIONS = ["Perfect", "Meets"];
const ROLE_OPTIONS = ["Driver", "Trainer", "Supervisor"];

function getTenureIndex(tenure) {
  const t = parseFloat(tenure);
  if (isNaN(t)) return null;
  if (t <= 0) return 0;
  if (t > 5) return 5;
  return Math.floor(t);
}

function getBonusRate(scorecard, rating, tier, tenure) {
  const idx = getTenureIndex(tenure);
  if (idx === null) return { rate: null, addOn: null, reason: "Invalid tenure" };

  const cleanScorecard = scorecard.trim();
  const cleanRating = rating.trim();
  const cleanTier = tier.trim().toUpperCase();

  const matrix = BONUS_MATRIX[cleanScorecard]?.[cleanRating];
  if (!matrix) return { rate: null, addOn: null, reason: "Invalid rating or scorecard" };

  if (cleanTier === "S-TIER") {
    const top = Object.values(matrix).flat().filter(Number.isFinite);
    const rate = Math.max(...top);
    return { rate, addOn: rate - 24, reason: null, isSTier: true };
  }

  const tierKey = cleanScorecard === "Poor" ? "All" : cleanTier;
  const rates = matrix[tierKey];
  const rate = Array.isArray(rates) ? rates[idx] : null;
  if (!rate) return { rate: null, addOn: null, reason: "Not eligible or missing" };

  return { rate, addOn: rate - 24, reason: null, isSTier: false };
}
export default function App() {
  const [scorecard, setScorecard] = useState("Fantastic");
  const [rating, setRating] = useState("Perfect");
  const [tier, setTier] = useState("A");
  const [tenure, setTenure] = useState("");
  const [role, setRole] = useState("Driver");
  const [baseRate, setBaseRate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [result, setResult] = useState(null);

  const formatDecimal = (val) => (val ? val.toFixed(2) : "0.00");

  const calculate = () => {
    const bonus = getBonusRate(scorecard, rating, tier, tenure);
    if (!bonus.rate) {
      setResult(bonus);
      return;
    }

    const base = role === "Driver" ? 24 : parseFloat(parseFloat(baseRate).toFixed(2));
    const hours = parseFloat(hoursWorked);
    const validBase = !isNaN(base);
    const validHours = !isNaN(hours);

    const cappedHours = validHours ? Math.min(hours, 40) : null;
    const bonusTotal = validHours ? (bonus.addOn * cappedHours) : null;
    const totalPay = validBase && validHours ? ((base + bonus.addOn) * cappedHours) : null;

    setResult({
      ...bonus,
      baseRate: validBase ? base : null,
      hoursWorked: validHours ? cappedHours : null,
      bonusTotal,
      totalPay
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>TierOne Bonus Simulator</h1>

      <label>Amazon Scorecard:</label>
      <select value={scorecard} onChange={(e) => setScorecard(e.target.value)}>
        {SCORECARD_OPTIONS.map(s => <option key={s}>{s}</option>)}
      </select>

      <label>Weekly Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {RATING_OPTIONS.map(r => <option key={r}>{r}</option>)}
      </select>
      <small style={{ display: "block", marginBottom: "10px" }}>
        Drivers rated <strong>Needs Improvement</strong> or <strong>Action Required</strong> are not eligible for bonuses.
      </small>

      <label>Tier Grade:</label>
      <select value={tier} onChange={(e) => setTier(e.target.value)}>
        {TIER_OPTIONS.map(t => <option key={t}>{t}</option>)}
      </select>

      <label>Tenure (Years):</label>
      <input value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="e.g. 1, 2, 5" />

      <label>Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
      </select>

      {role !== "Driver" && (
        <div>
          <label>Your Base Pay ($/hr):</label>
          <input
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            placeholder="e.g. 26.00"
          />
        </div>
      )}

      <label>Hours Worked This Week:</label>
      <input
        value={hoursWorked}
        onChange={(e) => setHoursWorked(e.target.value)}
        placeholder="e.g. 38"
      />

      <button style={{ marginTop: "1rem" }} onClick={calculate}>Calculate Bonus</button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {result.rate ? (
            <>
              {result.isSTier && <strong style={{ color: "#0070f3" }}>💎 S-Tier Bonus Unlocked!</strong>}<br />
              <strong>TierOne Bonus:</strong> +${formatDecimal(result.addOn)}/hr<br />
              {result.baseRate !== null && result.hoursWorked !== null && (
                <>
                  <strong>Total Bonus This Week:</strong> ${formatDecimal(result.bonusTotal)}<br />
                  <strong>Total Pay (with Bonus):</strong> ${formatDecimal(result.totalPay)}<br />
                </>
              )}
              {result.baseRate !== null && result.hoursWorked === null && (
                <strong>Total Hourly Pay:</strong> ${(result.baseRate + result.addOn).toFixed(2)}/hr<br />
              )}
              {result.baseRate === null && result.hoursWorked !== null && (
                <strong>Total Bonus This Week:</strong> ${formatDecimal(result.bonusTotal)}<br />
              )}
            </>
          ) : (
            <span style={{ color: "red" }}>⚠️ {result.reason}</span>
          )}
        </div>
      )}
    </div>
  );
}
