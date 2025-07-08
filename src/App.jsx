import React, { useState, useEffect } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": { Perfect: { A: [26,27,28,29,30,32], B: [25,26,27,28,29,30], C: [24.75,25,25.25,25.5,25.75,26], "D & F": [24,24,24,24,24,24] }, "Meets Requirements": { A: [25,26,27,28,29,30], B: [24.5,25,25.5,26,26.5,27], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] } },
  Fantastic:        { Perfect: { A: [25,26,27,28,29,30], B: [24.5,25,26,27,28,29], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] }, "Meets Requirements": { A: [24.5,25.5,26,26.5,27,28], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] } },
  Good:             { Perfect: { A: [24.5,25,25.5,26,26.5,27], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] }, "Meets Requirements": { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] } },
  Fair:             { Perfect: { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }, "Meets Requirements": { A: [24,24.25,24.5,24.75,25,25.25], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] } },
  Poor:             { Perfect: { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }, "Meets Requirements": { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] } }
};

export default function App() {
  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);
  const [checkND, setCheckND] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  useEffect(() => {
    if (rating !== "Perfect") setSTier(false);
  }, [rating]);

  const resetForm = () => {
    setRole(""); setHours(""); setBaseRate(""); setScorecard(""); setRating(""); setTier(""); setTenure(""); setSTier(false);
    setCheckND(false); setNetradyne(""); setSevereEvent("");
  };

  const printResults = () => {
    if (typeof window !== "undefined") window.print();
  };

  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus","Fantastic","Good","Fair"].includes(scorecard)) return 5;
    const years = parseInt(tenure.replace("+",""));
    return isNaN(years) ? 0 : Math.min(years,5);
  };

  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier ? "A" : (tier === "D" || tier === "F" ? "D & F" : tier);
    const rate = card[tierKey]?.[getTenureIndex()] || 24;
    return { hourly: Math.min(rate,32), bonusOnly: (Math.min(rate,32)-24).toFixed(2) };
  };

  const result       = getBonusRate();
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const isEligible  = rating === "Perfect" || rating === "Meets Requirements";
  const qualifiesND = checkND && isEligible && netradyne !== "None" && severeEvent === "No";
  const netBonus    = qualifiesND ? (netradyne === "Gold" ? 20 : 10) : 0;

  const totalH      = parseFloat(hours || 0);
  const otH         = totalH > 40 ? totalH - 40 : 0;
  const baseH       = Math.min(totalH,40);
  const base        = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const newRate     = (base + hourlyBonus).toFixed(2);
  const otPay       = (base * 1.5 * otH).toFixed(2);
  const weeklyBonus = (hourlyBonus * baseH).toFixed(2);
  const baseOT      = (base * baseH + parseFloat(otPay)).toFixed(2);
  const totalPay    = ((base + hourlyBonus)*baseH + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block font-medium mb-1" htmlFor="role">Role</label>
          <select id="role" value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-2 rounded">...
