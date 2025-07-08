import React, { useState, useEffect } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: { A: [26,27,28,29,30,32], B: [25,26,27,28,29,30], C: [24.75,25,25.25,25.5,25.75,26], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [25,26,27,28,29,30], B: [24.5,25,25.5,26,26.5,27], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] }
  },
  Fantastic: {
    Perfect: { A: [25,26,27,28,29,30], B: [24.5,25,26,27,28,29], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24.5,25.5,26,26.5,27,28], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] }
  },
  Good: {
    Perfect: { A: [24.5,25,25.5,26,26.5,27], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }
  },
  Fair: {
    Perfect: { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24,24.25,24.5,24.75,25,25.25], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }
  },
  Poor: {
    Perfect: { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] }
  }
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
    const key = rating === "Meets Requirements" ? key="Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier ? "A" : (tier === "D"||tier==="F"?"D & F":tier);
    const rates = card[tierKey];
    const rate = rates?.[getTenureIndex()]||24;
    return {hourly:Math.min(rate,32),bonusOnly:(Math.min(rate,32)-24).toFixed(2)};
  };

  const result = getBonusRate();
  const hourlyBonus = result?parseFloat(result.bonusOnly):0;
  const isEligible = rating==="Perfect"||rating==="Meets Requirements";
  const qualifiesForNetradyne = checkND&&isEligible&&netradyne!="None"&&severeEvent==="No";
  const netradyneBonus = qualifiesForNetradyne?(netradyne==="Gold"?20:10):0;

  const totalHours = parseFloat(hours||0);
  const otHours = totalHours>40?totalHours-40:0;
  const baseHours = Math.min(totalHours,40);
  const base = role==="Driver"?24:parseFloat(baseRate)||24;
  const newHourly = (base+hourlyBonus).toFixed(2);
  const otPay = (base*1.5*otHours).toFixed(2);
  const weeklyBonus = (hourlyBonus*baseHours).toFixed(2);
  const basePayInclOT = (base*baseHours+parseFloat(otPay)).toFixed(2);
  const totalWeeklyPay = ((base+hourlyBonus)*baseHours+parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-bold text-center mb-8">TierOne Bonus Simulator</h1>
      <div className="space-y-4 bg-white p-6 rounded shadow-md">
        {/* Role */}
        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={e=>setRole(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Driver</option>
          <option>Trainer</option>
          <option>Supervisor</option>
        </select>

        {/* Hours */}
        <label htmlFor="hours">Total Hours Worked</label>
        <input id="hours" type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="e.g. 38.5" className="p-2 border rounded w-full" />

        {/* Base Rate if not Driver */}
        {role!=="Driver"&&(
          <>
            <label htmlFor="baseRate">Base Pay</label>
            <input id="baseRate" type="number" value={baseRate} onChange={e=>setBaseRate(e.target.value)} placeholder="e.g. 27" className="p-2 border rounded w-full" />
            <p className="text-xs text-gray-500">* Enter base rate</p>
          </>
        )}

        {/* Scorecard */}
        <label htmlFor="scorecard">Amazon Scorecard</label>
        <select id="scorecard" value={scorecard} onChange={e=>setScorecard(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Fantastic Plus</option>
          <option>Fantastic</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Poor</option>
        </select>

        {/* Rating */}
        <label htmlFor="rating">Weekly Rating</label>
        <select id="rating" value={rating} onChange={e=>setRating(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>Perfect</option>
          <option>Meets Requirements</option>
          <option>Needs Improvement</option>
          <option>Action Required</option>
        </select>

        {/* Tier */}
        <label htmlFor="tier">Performance Grade</label>
        <select id="tier" value={tier} onChange={e=>setTier(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>F</option>
        </select>

        {/* Tenure */}
        <label htmlFor="tenure">Years at Stark</label>
        <select id="tenure" value={tenure} onChange={e=>setTenure(e.target.value)} className="p-2 border rounded w-full">
          <option value="">--</option>
          <option>&lt;1</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5+</option>
        </select>

        {/* S-Tier */}
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={sTier} onChange={e=>setSTier(e.target.checked)} disabled={rating!=="Perfect"} className="w-5 h-5"/>
          <span>S-Tier (13 Perfect Weeks)</span>
        </label>

        {/* Netradyne toggle */}
        <div className="mt-6">
          <p className="font-medium">Would you like to check your Netradyne Bonus?</p>
          <label className="flex items-center space-x-2 mt-2">
            <input type="checkbox" checked={checkND} onChange={e=>setCheckND(e.target.checked)} className="w-5 h-5"/>
            <span>Enable Netradyne Bonus Check</span>
          </label>
        </div>
      </div>

      {/* Netradyne section */}
      {checkND&&(
        <div className="mt-4 bg-green-50 p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          <div>
            <label>Netradyne Status</label>
            <select value={netradyne} onChange={e=>setNetradyne(e.target.value)} className="p-2 border rounded w-full">
              <option value="">--</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label>Any Severe Events in Last 6 Weeks?</label>
            <select value={severeEvent} onChange={e=>setSevereEvent(e.target.value)} className="p-2 border rounded w-full">
              <option value="">--</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <p className="font-medium">Bonus (if eligible): <span className="text-lg">${netradyneBonus}</span></p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Netradyne Bonus Explainer</h3>
            <p>The Netradyne Bonus is paid out quarterly if the company earns Gold or Silver status on Amazon's camera safety score. You must not have NI or AR ratings or receive major camera flags to qualify. If eligible, your bonus accrues weekly and is paid as a lump sum at the end of the quarter.</p>
          </div>
        </div>
      )}

      {/* Bonus Results */}
      <div className="mt-6 bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2">Bonus Results</h3>
        <ul className="list-disc ml-6">
          <li>Your Base Rate: ${base.toFixed(2)}</li>
          <li>Hourly Bonus: +${hourlyBonus.toFixed(2)}/hr</li>
          <li>New Hourly Rate: ${newHourly}/hr</li>
          <li>Overtime Pay: ${otPay}</li>
          <li>Weekly Bonus Total: ${weeklyBonus}</li>
          <li>Base Pay (incl. OT): ${basePayInclOT}</li>
          <li><strong>Total Weekly Pay:</strong> ${totalWeeklyPay}</li>
        </ul>
        <div className="flex space-x-4 mt-4">
          <button onClick={resetForm} className="px-4 py-2 border rounded">Reset</button>
          <button onClick={printResults} className="px-4 py-2 border rounded">Print</button>
        </div>
      </div>

      {/* FAQs & PDF link always visible */}
      <div className="mt-6 text-sm space-y-4">
        <h4 className="text-lg font-semibold">Frequently Asked Questions</h4>
        <div>
          <p className="font-medium">What is a Performance Grade (A–F)?</p>
          <ul className="list-disc list-inside ml-6">
            <li><strong>A Grade:</strong> 10 weeks at 100%, rest at 90%+, 1 grace week at 70%+</li>
            <li><strong>B Grade:</strong> 5 weeks at 100%, rest at 90%+, 1 grace week at 70%+ or all 13 weeks at 90%+</li>
            <li><strong>C Grade:</strong> All other valid combinations</li>
            <li><strong>D Grade:</strong> 2+ weeks below 70% or 6+ weeks between 70–83%</li>
            <li><strong>F Grade:</strong> 5+ weeks below 70% or all 13 weeks between 70–83%</li>
          </ul>
        </div>
        <div>
          <p className="font-medium">How is Weekly Rating determined?</p>
          <ul className="list-disc list-inside ml-6">
            <li><strong>Perfect:</strong> 100% score with zero flags</li>
            <li><strong>Meets Requirements:</strong> 83–99% with no major flags, or 100% with 1 minor flag</li>
            <li><strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with minor flags</li>
            <li><strong>Action Required:</strong> Less than 70%, or any score with 3+ minor flags or 1 major flag</li>
          </ul>
        </div>
        <div>
          <p className="font-medium">What are Call-out Penalties?</p>
          <ul className="list-disc list-inside ml-6">
            <li>Block-level Callout: -10 points (1 instance in 2 weeks)</li>
            <li>2+ Block Callouts: -15 points</li>
            <li>Load-level Callout: -17.1 points (1 instance in 6 weeks)</li>
            <li>2+ Load-level Callouts: -20 points</li>
          </ul>
        </div>
        <div>
          <p className="font-medium">What is S-Tier?</p>
          <p>S-Tier is a special tier for drivers who achieve 13 consecutive Perfect weeks. Unlocking S-Tier grants access to the 5+ year payband, regardless of tenure—but you must maintain Perfect rating.</p>
        </div>
        <div>
          <p className="font-medium">What disqualifies me from getting a bonus?</p>
          <ul className="list-disc list-inside ml-6">
            <li>Your Weekly Rating is NI or AR</li>
            <li>You receive a major camera or safety flag</li>
            <li>You fail to meet Grade + Tenure + Scorecard thresholds</li>
            <li>A recent severe event disqualifies you from Netradyne bonus</li>
          </ul>
        </div>
        <div>
          <p className="font-medium">How does the Netradyne Bonus work?</p>
          <ul className="list-disc list-inside ml-6">
            <li>Stark must earn Gold or Silver on Amazon's safety score</li>
            <li>You must have a Perfect or Meets Requirements rating</li>
            <li>No major camera flags or severe events in the last 6 weeks</li>
          </ul>
        </div>
        <a href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          📘 View Full Explainer PDF →
        </a>
      </div>
    </div>
  );
}
