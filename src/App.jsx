import React, { useState } from 'react';

// Full bonus matrix from your spreadsheet
const BONUS_MATRIX = {
  "Fantastic Plus": {
    "Perfect": {
      "A": [26, 27, 28, 29, 30, 32],
      "B": [25, 26, 27, 28, 29, 30],
    }
  },
  "Fantastic": {
    "Perfect": {
      "A": [25, 26, 27, 28, 29, 30],
      "B": [24.5, 25, 25.5, 26, 26.5, 27],
      "C": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24, null, null, null, null, null]
    },
    "Meets": {
      "A": [24.75, 25, 25.25, 25.5, 25.75, 26],
      "B": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "C": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "D & F": [24, null, null, null, null, null]
    }
  },
  "Good": {
    "Perfect": {
      "A": [24.5, 24.75, 25, 25.25, 25.5, 25.75],
      "B": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "C": [24, 24.25, 24.5, 24.75, 25, 25.25]
    },
    "Meets": {
      "A": [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "B": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "C": [24, 24.25, 24.5, 24.75, 25, 25.25]
    }
  },
  "Fair": {
    "Perfect": {
      "A": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "B": [24, null, null, null, null, null]
    },
    "Meets": {
      "A": [24, 24.25, 24.5, 24.75, 25, 25.25],
      "B": [24, null, null, null, null, null]
    }
  },
  "Poor": {
    "Perfect": {
      "All": [24, 24, 24, 24, 24, 24]
    },
    "Meets": {
      "All": [24, 24, 24, 24, 24, 24]
    }
  }
};

// Map numeric tenure to index (0–5)
function getTenureIndex(tenure) {
  const t = parseFloat(tenure);
  if (isNaN(t)) return null;
  if (t <= 0) return 0;
  if (t > 5) return 5;
  return Math.floor(t);
}

// Return bonus rate from matrix
function getBonusRate(scorecard, rating, tier, tenure) {
  const idx = getTenureIndex(tenure);
  if (idx === null) return "⚠️ Invalid tenure";

  // Normalize inputs
  const normScorecard = scorecard.trim();
  const normRating = rating.trim().toLowerCase().startsWith("perfect")
    ? "Perfect"
    : rating.trim().toLowerCase().startsWith("meets")
    ? "Meets"
    : null;
  const normTier = tier.trim().toUpperCase();

  if (!normRating) return "⚠️ Rating must be Perfect or Meets";

  // S-Tier override: always return top rate for rating in scorecard
  if (normTier === "S-TIER") {
    const options = BONUS_MATRIX[normScorecard]?.[normRating];
    if (!options) return "⚠️ No match for this scorecard";
    const topTier = Object.values(options)
      .flat()
      .filter(val => typeof val === "number");
    return topTier.length ? `$${Math.max(...topTier).toFixed(2)}/hr` : "⚠️ No bonus available";
  }

  // Handle Poor (one fallback tier only)
  const tierKey = normScorecard === "Poor" ? "All" : normTier;
  const rate = BONUS_MATRIX[normScorecard]?.[normRating]?.[tierKey]?.[idx];
  return typeof rate === "number" ? `$${rate.toFixed(2)}/hr` : "Not eligible for bonus";
}

export default function App() {
  const [scorecard, setScorecard] = useState("Fantastic");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState(null);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>TierOne Bonus Simulator</h1>
      <input placeholder="Amazon Scorecard (e.g. Fantastic)" value={scorecard} onChange={e => setScorecard(e.target.value)} /><br />
      <input placeholder="Weekly Rating (Perfect or Meets)" value={rating} onChange={e => setRating(e.target.value)} /><br />
      <input placeholder="Tier (A, B, S-Tier, etc.)" value={tier} onChange={e => setTier(e.target.value)} /><br />
      <input placeholder="Tenure (Years)" value={tenure} onChange={e => setTenure(e.target.value)} /><br />
      <button onClick={() => setResult(getBonusRate(scorecard, rating, tier, tenure))} style={{ marginTop: '1rem' }}>Calculate Bonus</button>
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <strong>{result}</strong>
        </div>
      )}
    </div>
  );
}
