import React, { useState, useEffect } from "react";

// Performance bonus matrix moved outside component for efficiency\ nconst BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: { A: [26, 27, 28, 29, 30, 32], B: [25, 26, 27, 28, 29, 30], C: [24.75, 25, 25.25, 25.5, 25.75, 26], "D & F": [24] },
    "Meets Requirements": { A: [25, 26, 27, 28, 29, 30], B: [24.5, 25, 25.5, 26, 26.5, 27], C: [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24] },
  },
  Fantastic: {
    Perfect: { A: [25, 26, 27, 28, 29, 30], B: [24.5, 25, 26, 27, 28, 29], C: [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24] },
    "Meets Requirements": { A: [24.5, 25.5, 26, 26.5, 27, 28], B: [24.25, 24.5, 25, 25.5, 26, 26.5], C: [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24] },
  },
  Good: {
    Perfect: { A: [24.5, 25, 25.5, 26, 26.5, 27], B: [24.25, 24.5, 25, 25.5, 26, 26.5], C: [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24] },
    "Meets Requirements": { A: [24.25, 24.5, 25, 25.25, 25.5, 25.75], B: [24, 24.25, 24.5, 24.75, 25, 25.25], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
  },
  Fair: {
    Perfect: { A: [24.25, 24.5, 25, 25.25, 25.5, 25.75], B: [24, 24.25, 24.5, 24.75, 25, 25.25], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
    "Meets Requirements": { A: [24, 24.25, 24.5, 24.75, 25, 25.25], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
  },
  Poor: {
    Perfect: { A: [24, 24, 24, 24, 24, 24], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
    "Meets Requirements": { A: [24, 24, 24, 24, 24, 24], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24] },
  }
};

export default function App() {
  const [role, setRole] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);
  const [checkND, setCheckND] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");

  useEffect(() => {
    if (rating !== "Perfect") setSTier(false);
  }, [rating]);

  const resetForm = () => {
    setRole(""); setScorecard(""); setRating(""); setTier("");
    setTenure(""); setSTier(false); setCheckND(false);
    setNetradyne(""); setSevereEvent(""); setHours("");
    setBaseRate("");
  };

  const printResults = () => {
    if (typeof window !== "undefined") window.print();
  };

  const getTenureIndex = () => {
    const validSTierScores = ["Fantastic Plus", "Fantastic", "Good", "Fair"];
    if (sTier && validSTierScores.includes(scorecard)) return 5;
    const years = parseInt(tenure);
    return isNaN(years) ? 0 : Math.min(years, 5);
  };

  const getBonusRate = () => {
    const ratingKey = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[ratingKey];
    if (!card) return null;
    const tierKey = sTier ? "A" : (tier === "D" || tier === "F" ? "D & F" : tier);
    const rates = card[tierKey];
    if (!rates) return null;
    const base = rates[getTenureIndex()] || 24;
    return { hourly: Math.min(base, 32), bonusOnly: (Math.min(base, 32) - 24).toFixed(2) };
  };

  const result = getBonusRate();
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const isEligible = rating === "Perfect" || rating === "Meets Requirements";
  const qualifiesForNetradyne = checkND && isEligible && netradyne !== "None" && severeEvent === "No";
  const netradyneBonus = qualifiesForNetradyne ? (netradyne === "Gold" ? 20 : 10) : 0;

  const totalHours = parseFloat(hours || 0);
  const otHours = totalHours > 40 ? totalHours - 40 : 0;
  const baseHours = Math.min(totalHours, 40);
  const base = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const newHourly = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otHours).toFixed(2);
  const weeklyBonus = (hourlyBonus * baseHours).toFixed(2);
  const basePayInclOT = (base * baseHours + parseFloat(otPay)).toFixed(2);
  const totalWeeklyPay = ((base + hourlyBonus) * baseHours + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-bold text-center mb-8">TierOne Bonus Simulator</h1>
      <div className="space-y-4 bg-white p-6 rounded shadow-md">
        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={e => setRole(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>

        <label htmlFor="hours">Total Hours Worked</label>
        <input id="hours" type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 38.5" className="p-2 border rounded w-full" />

        {role !== "Driver" && (
          <>
            <label htmlFor="baseRate">Base Pay</label>
            <input id="baseRate" type="number" value={baseRate} onChange={e => setBaseRate(e.target.value)} placeholder="e.g. 27" className="
