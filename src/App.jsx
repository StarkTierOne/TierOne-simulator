import React, { useState } from 'react';

const BONUS_MATRIX = {
  "Fantastic+": 1.25,
  "Fantastic": 1.00,
  "Good": 0.75,
  "Fair": 0.50,
  "Poor": 0.00,
};

const BONUS_ELIGIBILITY = (grade, rating, tenure, amazonScore) => {
  if (["D", "F"].includes(grade)) return false;
  if (grade === "C") {
    if (["Poor", "Fair", "Good"].includes(amazonScore)) return false;
    if (rating === "Perfect") return true;
    if (rating === "Meets" && parseFloat(tenure) >= 1) return true;
    return false;
  }
  if (["A", "B"].includes(grade)) {
    return ["Perfect", "Meets"].includes(rating);
  }
  return false;
};

export default function App() {
  const [grade, setGrade] = useState("");
  const [rating, setRating] = useState("");
  const [tenure, setTenure] = useState("");
  const [amazonScore, setAmazonScore] = useState("");
  const [bonus, setBonus] = useState(null);
  const [eligible, setEligible] = useState(null);

  const calculateBonus = () => {
    const isEligible = BONUS_ELIGIBILITY(grade, rating, tenure, amazonScore);
    setEligible(isEligible);
    if (isEligible) {
      const bonusRate = BONUS_MATRIX[amazonScore] || 0;
      setBonus(`$${(24 + bonusRate).toFixed(2)}/hr`);
    } else {
      setBonus("Not eligible for bonus");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>TierOne Bonus Simulator</h1>
      <input placeholder="Tier Grade (A–F)" value={grade} onChange={e => setGrade(e.target.value.toUpperCase())} /><br />
      <input placeholder="Weekly Rating" value={rating} onChange={e => setRating(e.target.value)} /><br />
      <input placeholder="Tenure (Years)" value={tenure} onChange={e => setTenure(e.target.value)} /><br />
      <input placeholder="Amazon Scorecard" value={amazonScore} onChange={e => setAmazonScore(e.target.value)} /><br />
      <button onClick={calculateBonus}>Calculate Bonus</button>
      {bonus && (
        <div style={{ marginTop: '1rem' }}>
          <strong>{eligible ? "Eligible – " : ""}{bonus}</strong>
        </div>
      )}
    </div>
  );
}
