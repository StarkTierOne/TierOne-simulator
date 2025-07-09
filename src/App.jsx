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
  // scroll & focus helper
  const focusHours = () => {
    const el = document.getElementById("hours");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  // state
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
  const [driverRejects, setDriverRejects] = useState("No");
  const [amazonRejects, setAmazonRejects] = useState("No");
  const [show39Exp, setShow39Exp] = useState(false);

  const [lunchRate, setLunchRate] = useState(0.5);
  const [showLunchExp, setShowLunchExp] = useState(false);

  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  // clear toggles when role changes
  useEffect(() => {
    setCheckND(false);
    setCheck39(false);
    setCheckLunch(false);
  }, [role]);
  // clear extras when rating changes
  useEffect(() => {
    if (rating !== "Perfect") {
      setSTier(false);
      setCheck39(false);
      setCheckLunch(false);
    }
  }, [rating]);

  // reset & print
  const resetForm = () => {
    setRole(""); setHours(""); setBaseRate("");
    setScorecard(""); setRating(""); setTier(""); setTenure(""); setSTier(false);
    setCheckND(false); setCheck39(false); setCheckLunch(false);
    setNetradyne(""); setSevereEvent(""); setShowNDE(false);
    setDaysWorked(""); setDriverRejects("No"); setAmazonRejects("No"); setShow39Exp(false);
    setLunchRate(0.5); setShowLunchExp(false);
  };
  const printResults = () => window.print();

  // bonus rate helper
  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus","Fantastic","Good","Fair"].includes(scorecard)) return 5;
    const y = parseInt(tenure.replace("+",""), 10);
    return isNaN(y) ? 0 : Math.min(y, 5);
  };
  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tk = sTier ? "A" : (["D","F"].includes(tier) ? "D & F" : tier);
    const rate = card[tk]?.[getTenureIndex()] ?? 24;
    return { hourly: Math.min(rate, 32), bonusOnly: (Math.min(rate, 32) - 24).toFixed(2) };
  };

  // memoized
  const result = useMemo(() => getBonusRate(), [scorecard, rating, tier, tenure, sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;

  // 39-hour guarantee for Driver & Trainer
  const is39Elig = check39 && (role==="Driver"||role==="Trainer") && rating==="Perfect" && (parseInt(daysWorked, 10) || 0) >= 3 && driverRejects === "No";
  const cred39 = is39Elig ? Math.max(totalH, 39) : totalH;
  const guaranteePay = (parseFloat(baseRate || (role==="Driver"?24:parseFloat(baseRate)||24)) * (Math.max(39 - totalH, 0))).toFixed(2);

  // lunch bonus for Driver & Trainer
  const isLunchElig = checkLunch && (role==="Driver"||role==="Trainer") && rating==="Perfect" && ["A","B"].includes(tier);
  const lunchAmt = isLunchElig ? ((parseInt(daysWorked, 10)||0) * lunchRate).toFixed(2) : "0.00";

  // netradyne
  const isNDElig = checkND && ["Perfect","Meets Requirements"].includes(rating) && netradyne !== "None" && severeEvent === "No";
  const netBonus = isNDElig ? (netradyne === "Gold" ? 20 : 10) : 0;

  // base & totals
  const base = role==="Driver" ? 24 : parseFloat(baseRate) || 24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otRate = (base * 1.5).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const baseOT = (base * totalH + parseFloat(otPay)).toFixed(2);
  const bonusTotalMax40 = (hourlyBonus * Math.min(totalH, 40)).toFixed(2);
  const totalPay = ((base + hourlyBonus) * totalH + parseFloat(otPay) + parseFloat(lunchAmt) + netBonus).toFixed(2);

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block font-medium mb-1">Role</label>
          <select id="role" value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>

        {/* Hours */}
        <div>
          <label htmlFor="hours" className="block font-medium mb-1">Total Hours Worked (Optional)</label>
          <input id="hours" type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="e.g. 38.5" className="w-full border p-2 rounded" />
        </div>

        {/* Base Rate for non-Driver*/}
        {role!=="Driver" && (
          <div>
            <label htmlFor="baseRate" className="block font-medium mb-1">Base Rate (Optional)</label>
            <input id="baseRate" type="number" value={baseRate} onChange={e=>setBaseRate(e.target.value)} placeholder="e.g. 27" className="w-full border p-2 rounded" />
          </div>
        )}

        {/* Scorecard */}
        <div>
          <label htmlFor="scorecard" className="block font-medium mb-1">Amazon Scorecard</label>
          <select id="scorecard" value={scorecard} onChange={e=>setScorecard(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select scorecard --</option>
            <option>Fantastic Plus</option>
            <option>Fantastic</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block font-medium mb-1">Weekly Rating</label>
          <select id="rating" value={rating} onChange={e=>setRating(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="tier" className="block font-medium mb-1">Performance Grade</label>
          <select id="tier" value={tier} onChange={e=>setTier(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select grade --</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>F</option>
          </select>
        </div>

        {/* Tenure */}
        <div>
          <label htmlFor="tenure" className="block font-medium mb-1">Years at Stark</label>
          <select id="tenure" value={tenure} onChange={e=>setTenure(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select tenure --</option>
            <option>&lt;1</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
          </select>
        </div>

        {/* S-Tier */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="sTier" checked={sTier} onChange={e=>setSTier(e.target.checked)} disabled={rating!=="Perfect"} className="w-5 h-5" />
          <label htmlFor="sTier" className="font-medium">S-Tier (13 Perfect Weeks)</label>
        </div>

        {/* Toggles */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="ndToggle" checked={checkND} onChange={e=>setCheckND(e.target.checked)} className="w-5 h-5" />
          <label htmlFor="ndToggle" className="font-medium">Would you like to check your Netradyne Bonus?</label>
        </div>
        {(role==="Driver"||role==="Trainer") && rating==="Perfect" && (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="g39Toggle" checked={check39} onChange={e=>setCheck39(e.target.checked)} className="w-5 h-5" />
            <label htmlFor="g39Toggle" className="font-medium">Would you like to check the 39-Hour Guarantee?</label>
          </div>
        )}
        {(role==="Driver"||role==="Trainer") && rating==="Perfect" && ["A","B"].includes(tier) && (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="lunchToggle" checked={checkLunch} onChange={e=>setCheckLunch(e.target.checked)} className="w-5 h-5" />
            <label htmlFor="lunchToggle" className="font-medium">Would you like to check the Paid Lunch Bonus?</label>
          </div>
        )}
      </div>

      {/* Netradyne */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          <label className="block font-medium">Status</label>
          <select value={netradyne} onChange={e=>setNetradyne(e.target.value)} className="w-full border p-2 rounded">
            <option value="">--</option><option>Gold</option><option>Silver</option><option>None</option>
          </select>
          <label className="block font-medium">Severe Events Last 6 Weeks?</label>
          <select value={severeEvent} onChange={e=>setSevereEvent(e.target.value)} className="w-full border p-2 rounded">
            <option value="">--</option><option>No</option><option>Yes</option>
          </select>
          <p className="font-medium">Netradyne Bonus: ${netBonus.toFixed(2)}</p>
          <button type="button" onClick={()=>setShowNDE(!showNDE)} className="font-semibold text-blue-600">Netradyne Bonus Explainer {showNDE?"▲":"▼"}</button>
          {showNDE && (
            <div className="text-sm pl-4">The Netradyne Bonus is paid out quarterly if the company earns Gold or Silver status on Amazon's camera safety score. You must not have NI or AR ratings or receive major camera flags to qualify. If eligible, your bonus accrues weekly and is paid as a lump sum at the end of the quarter.</div>
          )}
        </div>
      )}

      {/* 39-Hour Guarantee */}
      {check39 && (
        <div className="bg-blue-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">🕒 39-Hour Guarantee</
