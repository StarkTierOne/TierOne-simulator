import React, { useState, useEffect, useMemo } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: { A: [26, 27, 28, 29, 30, 32], B: [25, 26, 27, 28, 29, 30], C: [24.75, 25, 25.25, 25.5, 25.75, 26], "D & F": [24, 24, 24, 24, 24, 24] },
    "Meets Requirements": { A: [25, 26, 27, 28, 29, 30], B: [24.5, 25, 25.5, 26, 26.5, 27], C: [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24, 24, 24, 24, 24, 24] }
  },
  Fantastic: {
    Perfect: { A: [25, 26, 27, 28, 29, 30], B: [24.5, 25, 26, 27, 28, 29], C: [24.25, 24.5, 24.75, 25, 25.25, 25.5], "D & F": [24, 24, 24, 24, 24, 24] },
    "Meets Requirements": { A: [24.5, 25.5, 26, 26.5, 27, 28], B: [24.25, 24.5, 25, 25.5, 26, 26.5], C: [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24, 24, 24, 24, 24, 24] }
  },
  Good: {
    Perfect: { A: [24.5, 25, 25.5, 26, 26.5, 27], B: [24.25, 24.5, 25, 25.5, 26, 26.5], C: [24, 24.25, 24.5, 24.75, 25, 25.25], "D & F": [24, 24, 24, 24, 24, 24] },
    "Meets Requirements": { A: [24.25, 24.5, 25, 25.25, 25.5, 25.75], B: [24, 24.25, 24.5, 24.75, 25, 25.25], C: [24, 24, 24, 24, 24, 24], "D & F": [24, 24, 24, 24, 24, 24] }
  },
  Fair: {
    Perfect: { A: [24.25, 24.5, 25, 25.25, 25.5, 25.75], B: [24, 24.25, 24.5, 24.75, 25, 25.25], C: [24, 24, 24, 24, 24, 24], "D & F": [24, 24, 24, 24, 24, 24] },
    "Meets Requirements": { A: [24, 24.25, 24.5, 24.75, 25, 25.25], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24, 24, 24, 24, 24, 24] }
  },
  Poor: {
    Perfect: { A: [24, 24, 24, 24, 24, 24], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24, 24, 24, 24, 24, 24] },
    "Meets Requirements": { A: [24, 24, 24, 24, 24, 24], B: [24, 24, 24, 24, 24, 24], C: [24, 24, 24, 24, 24, 24], "D & F": [24, 24, 24, 24, 24, 24] }
  }
};

export default function App() {
  const focusHours = () => {
    const el = document.getElementById("hours");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);

  const [checkND, setCheckND] = useState(false);
  const [check39, setCheck39] = useState(false);
  const [checkLunch, setCheckLunch] = useState(false);

  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);

  const [daysWorked, setDaysWorked] = useState("");
  const [driverRejects, setDriverRejects] = useState(0);
  const [amazonRejects, setAmazonRejects] = useState(0);
  const [show39Exp, setShow39Exp] = useState(false);

  const [lunchRate, setLunchRate] = useState("");
  const [showLunchExp, setShowLunchExp] = useState(false);

  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  useEffect(() => {
    if (rating !== "Perfect") {
      setSTier(false);
      setCheck39(false);
      setCheckLunch(false);
    }
  }, [rating]);

  const resetForm = () => {
    setRole(""); setHours(""); setBaseRate("");
    setScorecard(""); setRating(""); setTier(""); setTenure(""); setSTier(false);
    setCheckND(false); setCheck39(false); setCheckLunch(false);
    setNetradyne(""); setSevereEvent(""); setShowNDE(false);
    setDaysWorked(""); setDriverRejects(0); setAmazonRejects(0); setShow39Exp(false);
    setLunchRate(""); setShowLunchExp(false);
  };
  const printResults = () => window.print();

  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus","Fantastic","Good","Fair"].includes(scorecard)) return 5;
    const y = parseInt(tenure.replace("+",""), 10);
    return isNaN(y) ? 0 : Math.min(y, 5);
  };
  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier ? "A" : (["D","F"].includes(tier) ? "D & F" : tier);
    const rate = card[tierKey]?.[getTenureIndex()] ?? 24;
    return { hourly: Math.min(rate, 32), bonusOnly: (Math.min(rate, 32) - 24).toFixed(2) };
  };

  const result = useMemo(() => getBonusRate(), [scorecard, rating, tier, tenure, sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;

  const is39Elig =
    check39 && role === "Driver" && rating === "Perfect" &&
    (parseInt(daysWorked, 10) || 0) >= 3 && driverRejects === 0 && totalH > 0;
  const credited39 = is39Elig ? Math.max(totalH, 39) : totalH;

  const isLunchElig =
    checkLunch && role === "Driver" && rating === "Perfect" && ["A","B"].includes(tier) && totalH > 0;
  const lunchAmt = isLunchElig ? (parseInt(daysWorked, 10) || 0) * (parseFloat(lunchRate) || 0) : 0;

  const base = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const perfTotal = (hourlyBonus * totalH).toFixed(2);
  const guaranteePay = (base * credited39).toFixed(2);
  const baseOT = (base * credited39 + parseFloat(otPay)).toFixed(2);
  const totalPay = ((base + hourlyBonus) * credited39 + parseFloat(otPay) + lunchAmt).toFixed(2);

  const isNDElig = checkND && ["Perfect","Meets Requirements"].includes(rating) && netradyne !== "None" && severeEvent === "No";
  const netBonus = isNDElig ? (netradyne === "Gold" ? 20 : 10) : 0;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block font-medium mb-1">Role</label>
          <select id="role" value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>
        {/* …rest… */}
      </div>
    </div>
  );
}
