import React, { useState } from 'react';

const BONUS_MATRIX = {
  "Fantastic Plus": {
    "Perfect": {
      "A": [26, 27, 28, 29, 30, 32],
      "B": [25, 26, 27, 28, 29, 30],
      "C": [24.75, 25, 25.25, 25.5, 25.75, 26],
      "D & F": [24]
    },
    "Meets": {
      "A": [25, 26, 27, 28, 29, 30],
      "B": [24.5, 25, 25.5, 26, 26.5, 27],
      "C": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24]
    }
  },
  "Fantastic": {
    "Perfect": {
      "A": [25, 26, 27, 28, 29, 30],
      "B": [24.5, 25, 25.5, 26, 26.5, 27],
      "C": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24]
    },
    "Meets": {
      "A": [24.75, 25, 25.25, 25.5, 25.75, 26],
      "B": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "C": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "D & F": [24]
    }
  },
  "Good": {
    "Perfect": {
      "A": [24.5, 24.75, 25, 25.25, 25.5, 25.75],
      "B": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "C": [24]  // Only defined for <1
    },
    "Meets": {
      "A": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "B": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "C": [24]  // Use base rate
    }
  },
  "Fair": {
    "Perfect": {
      "A": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "B": [24]
    },
    "Meets": {
      "A": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "B": [24]
    }
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

  // S-Tier override: use highest rate available
  if (cleanTier === "S-TIER") {
    const top = Object.values(matrix).flat().filter(Number.isFinite);
    const rate = Math.max(...top);
    return { rate, addOn: rate - 24, reason: null };
  }

  // For Poor, use "All" tier
  const tierKey = cleanScorecard === "Poor" ? "All" : cleanTier;
  const rates = matrix[tierKey];
  const rate = Array.isArray(rates) ? rates[idx] : null;
  if (!rate) return { rate: null, addOn: null, reason: "Not eligible or missing" };

  return { rate, addOn: rate - 24, reason: null };
}

export default function App() {
  const [scorecard, setScorecard] = useState("Fantastic");
  const [rating, setRating] = useState("Perfect");
  const [tier, setTier] = useState("A");
  const [tenure, setTenure] = useState("");
  const [role, setRole] = useState("Driver");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const bonus = getBonusRate(scorecard, rating, tier, tenure);
    setResult(bonus);
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

      <button style={{ marginTop: "1rem" }} onClick={calculate}>Calculate Bonus</button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {result.rate ? (
            <>
              <strong>Total Rate:</strong> ${result.rate.toFixed(2)}/hr<br />
              <strong>TierOne Bonus:</strong> +${result.addOn.toFixed(2)}<br />
              <em>(Apply bonus to your own base pay — varies by role)</em>
            </>
          ) : (
            <span style={{ color: "red" }}>⚠️ {result.reason}</span>
          )}
        </div>
      )}
    </div>
  );
}
