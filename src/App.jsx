import React, { useState, useEffect, useMemo } from "react";

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
  // Core form state
  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);

  // Netradyne
  const [checkND, setCheckND] = useState(false);
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);

  // FAQ toggles
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  // 39-Hour & Lunch bonus state
  const [daysWorked, setDaysWorked] = useState("");
  const [driverRejects, setDriverRejects] = useState(0);
  const [amazonRejects, setAmazonRejects] = useState(0);
  const [show39Exp, setShow39Exp] = useState(false);
  const [lunchRate, setLunchRate] = useState("");
  const [showLunchExp, setShowLunchExp] = useState(false);

  // Reset S-Tier if rating changes
  useEffect(() => {
    if (rating !== "Perfect") setSTier(false);
  }, [rating]);

  // Helpers
  const resetForm = () => {
    setRole(""); setHours(""); setBaseRate("");
    setScorecard(""); setRating(""); setTier("");
    setTenure(""); setSTier(false);
    setCheckND(false); setNetradyne(""); setSevereEvent("");
    setDaysWorked(""); setDriverRejects(0); setAmazonRejects(0);
    setLunchRate("");
  };
  const printResults = () => { if (typeof window !== "undefined") window.print(); };
  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus","Fantastic","Good","Fair"].includes(scorecard)) return 5;
    const y = parseInt(tenure.replace("+",""),10);
    return isNaN(y) ? 0 : Math.min(y,5);
  };
  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier ? "A" : (["D","F"].includes(tier) ? "D & F" : tier);
    const rate = card[tierKey]?.[getTenureIndex()] ?? 24;
    return { hourly: Math.min(rate,32), bonusOnly: (Math.min(rate,32)-24).toFixed(2) };
  };

  // Memoized calcs
  const result = useMemo(() => getBonusRate(), [scorecard, rating, tier, tenure, sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;

  // 39-Hour Guarantee
  const is39Eligible = rating === "Perfect"
    && (parseInt(daysWorked,10) || 0) >= 3
    && driverRejects === 0;
  const creditedHours39 = is39Eligible ? Math.max(totalH,39) : totalH;

  // Paid Lunch Bonus
  const lunchEligible = rating === "Perfect" && ["A","B"].includes(tier);
  const lunchAmt = lunchEligible
    ? (parseInt(daysWorked,10) || 0) * (parseFloat(lunchRate)||0)
    : 0;

  // Base & totals
  const base = role === "Driver" ? 24 : parseFloat(baseRate)||24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const weeklyBonus = (hourlyBonus * creditedHours39).toFixed(2);
  const baseOT = (base * creditedHours39 + parseFloat(otPay)).toFixed(2);
  const totalPay = (
    (base + hourlyBonus) * creditedHours39
    + parseFloat(otPay)
    + lunchAmt
  ).toFixed(2);

  // Netradyne bonus
  const isEligible = ["Perfect","Meets Requirements"].includes(rating);
  const qualifiesND = checkND && isEligible && netradyne!=="None" && severeEvent==="No";
  const netBonus = qualifiesND ? (netradyne==="Gold"?20:10) : 0;

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

        {/* Total Hours */}
        <div>
          <label htmlFor="hours" className="block font-medium mb-1">Total Hours Worked (Optional)</label>
          <input id="hours" type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="e.g. 38.5" className="w-full border p-2 rounded"/>
        </div>

        {/* Base Pay */}
        {(role==="Trainer"||role==="Supervisor") && (
          <div>
            <label htmlFor="baseRate" className="block font-medium mb-1">Base Pay (Optional)</label>
            <input id="baseRate" type="number" value={baseRate} onChange={e=>setBaseRate(e.target.value)} placeholder="e.g. 27" className="w-full border p-2 rounded"/>
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
            <option>A</option><option>B</option><option>C</option><option>D</option><option>F</option>
          </select>
        </div>

        {/* Tenure */}
        <div>
          <label htmlFor="tenure" className="block font-medium mb-1">Years at Stark</label>
          <select id="tenure" value={tenure} onChange={e=>setTenure(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select tenure --</option>
            <option>&lt;1</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
          </select>
        </div>

        {/* S-Tier */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="sTier" checked={sTier} onChange={e=>setSTier(e.target.checked)} disabled={rating!=="Perfect"} className="w-5 h-5"/>
          <label htmlFor="sTier" className="font-medium">S-Tier (13 Perfect Weeks)</label>
        </div>

        {/* Netradyne */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="ndToggle" checked={checkND} onChange={e=>setCheckND(e.target.checked)} className="w-5 h-5"/>
          <label htmlFor="ndToggle" className="font-medium">Would you like to check your Netradyne Bonus?</label>
        </div>

        {/* 39-Hour Guarantee */}
        {rating==="Perfect" && (
          <div className="space-y-4">
            <h3 className="font-semibold">39-Hour Guarantee</h3>
            <button type="button" aria-expanded={show39Exp} aria-controls="info-39" className="font-medium" onClick={()=>setShow39Exp(!show39Exp)}>
              What’s the 39-Hour Guarantee? {show39Exp ? "▲" : "▼"}
            </button>
            {show39Exp && (
              <div id="info-39" className="text-sm pl-4">
                If you have a Perfect rating, work at least 3 days, and have zero driver-initiated rejects, we’ll credit you up to 39 hours at your base rate even if you actually worked fewer.
              </div>
            )}
            <div>
              <label htmlFor="daysWorked" className="block font-medium mb-1">Days Worked This Week</label>
              <input id="daysWorked" type="number" min="0" max="7" value={daysWorked} onChange={e=>setDaysWorked(e.target.value)} className="w-full border p-2 rounded"/>
            </div>
            <div>
              <label htmlFor="driverRejects" className="block font-medium mb-1">Driver-Rejected Legs</label>
              <input id="driverRejects" type="number" min="0" value={driverRejects} onChange={e=>setDriverRejects(parseInt(e.target.value,10)||0)} className="w-full border p-2 rounded"/>
            </div>
            <div>
              <label htmlFor="amazonRejects" className="block font-medium mb-1">Amazon-Canceled Legs</label>
              <input id="amazonRejects" type="number" min="0" value={amazonRejects} onChange={e=>setAmazonRejects(parseInt(e.target.value,10)||0)} className="w-full border p-2 rounded"/>
            </div>
          </div>
        )}

        {/* Paid Lunch Bonus */}
        {rating==="Perfect" && ["A","B"].includes(tier) && (
          <div className="space-y-4">
            <h3 className="font-semibold">Paid Lunch Bonus</h3>
            <button type="button" aria-expanded={showLunchExp} aria-controls="info-lunch" className="font-medium" onClick={()=>setShowLunchExp(!showLunchExp)}>
              What’s the Paid Lunch Bonus? {showLunchExp ? "▲" : "▼"}
            </button>
            {showLunchExp && (
              <div id="info-lunch" className="text-sm pl-4">
                As long as you have a Perfect rating and Grade A or B, you earn the daily lunch bonus for each day worked. Enter your per-day rate above.
              </div>
            )}
            <div>
              <label htmlFor="lunchRate" className="block font-medium mb-1">Lunch Bonus Rate ($/day)</label>
              <input id="lunchRate" type="number" value={lunchRate} onChange={e=>setLunchRate(e.target.value)} placeholder="e.g. 5" className="w-full border p-2 rounded"/>
            </div>
          </div>
        )}
      </div>

      {/* Netradyne Block */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Netradyne Status</label>
              <select value={netradyne} onChange={e=>setNetradyne(e.target.value)} className="w-full border p-2 rounded">
                <option value="">--</option><option>Gold</option><option>Silver</option><option>None</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Any Severe Events in Last 6 Weeks?</label>
              <select value={severeEvent} onChange={e=>setSevereEvent(e.target.value)} className="w-full border p-2 rounded">
                <option value="">--</option><option>No</option><option>Yes</option>
              </select>
            </div>
            <p className="font-medium">Bonus (if eligible): <span className="text-lg">${netBonus}</span></p>
            <button type="button" aria-expanded={showNDE} aria-controls="nd-explainer" className="font-semibold" onClick={()=>setShowNDE(!showNDE)}>
              Netradyne Bonus Explainer {showNDE ? "▲" : "▼"}
            </button>
            {showNDE && (
              <div id="nd-explainer" role="region" className="text-sm pl-4">
                The Netradyne Bonus is paid out quarterly if the company earns Gold or Silver status on Amazon's camera safety score. You must not have NI or AR ratings or receive major camera flags to qualify. If eligible, your bonus accrues weekly and is paid as a lump sum at the end of the quarter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bonus Results */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold mb-2">Bonus Results</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Your Base Rate: ${base.toFixed(2)}</li>
          <li>Hourly Bonus: +${hourlyBonus.toFixed(2)}/hr</li>
          <li>New Hourly Rate: ${newRate}/hr</li>
          <li>Overtime Pay: ${otPay}</li>
          <li>Weekly Bonus Total: ${weeklyBonus}</li>
          <li>Lunch Bonus Total: ${lunchAmt.toFixed(2)}</li>
          <li>Total Pay (incl. OT & Lunch): ${totalPay}</li>
        </ul>
        <div className="flex space-x-4">
          <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Reset</button>
          <button type="button" onClick={printResults} className="px-4 py-2 border rounded">Print</button>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <button type="button" aria-expanded={showFAQ} aria-controls="faq-section" className="font-semibold" onClick={()=>setShowFAQ(!showFAQ)}>
          Frequently Asked Questions {showFAQ ? "▲" : "▼"}
        </button>
        {showFAQ && (
          <div id="faq-section" role="region" className="text-sm space-y-4 pl-4">
            {/* 1 */}
            <div>
              <button type="button" aria-expanded={showPG} aria-controls="faq-pg" className="font-medium" onClick={()=>setShowPG(!showPG)}>
                What is a Performance Grade (A–F)? {showPG ? "▲" : "▼"}
              </button>
              {showPG && (
                <div id="faq-pg" role="region" className="mt-1">
                  <p>Your Performance Grade is based on your last 13 weeks of overall Total Score.</p>
                  <p><strong>A Grade:</strong> 10 weeks at 100%, rest at 90%+, 1 grace week at 70%+</p>
                  <p><strong>B Grade:</strong> 5 weeks at 100%, rest at 90%+, 1 grace week at 70%+ or all 13 weeks at 90%+</p>
                  <p><strong>C Grade:</strong> All other valid combinations</p>
                  <p><strong>D Grade:</strong> 2+ weeks below 70% or 6+ weeks between 70–83%</p>
                  <p><strong>F Grade:</strong> 5+ weeks below 70% or all 13 weeks between 70–83%</p>
                </div>
              )}
            </div>
            {/* 2 */}
            <div>
              <button type="button" aria-expanded={showWR} aria-controls="faq-wr" className="font-medium" onClick={()=>setShowWR(!showWR)}>
                How is Weekly Rating determined? {showWR ? "▲" : "▼"}
              </button>
              {showWR && (
                <div id="faq-wr" role="region" className="mt-1">
                  <p>Weekly Rating reflects how you performed this week — it's based on your Total Score plus any safety, attendance, or behavioral flags.</p>
                  <p><strong>Perfect:</strong> 100% score with zero flags</p>
                  <p><strong>Meets Requirements:</strong> 83–99% with no major flags, or 100% with 1 minor flag</p>
                  <p><strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with minor flags</p>
                  <p><strong>Action Required:</strong> Less than 70%, or any score with 3+ minor flags or 1 major flag</p>
                </div>
              )}
            </div>
            {/* 3 */}
            <div>
              <button type="button" aria-expanded={showCP} aria-controls="faq-cp" className="font-medium" onClick={()=>setShowCP(!showCP)}>
                What are Call-out Penalties? {showCP ? "▲" : "▼"}
              </button>
              {showCP && (
                <div id="faq-cp" role="region" className="mt-1">
                  <p>• Block-level Callout: -10 points (1 instance in 2 weeks)</p>
                  <p>• 2+ Block Callouts: -15 points</p>
                  <p>• Load-level Callout: -17.1 points (1 instance in 6 weeks)</p>
                  <p>• 2+ Load-level Callouts: -20 points</p>
                  <p>Penalties last 2 weeks for blocks and 6 weeks for loads, affecting eligibility and ratings.</p>
                </div>
              )}
            </div>
            {/* 4 */}
            <div>
              <button type="button" aria-expanded={showST} aria-controls="faq-st" className="font-medium" onClick={()=>setShowST(!showST)}>
                What is S-Tier? {showST ? "▲" : "▼"}
              </button>
              {showST && (
                <div id="faq-st" role="region" className="mt-1">
                  <p>S-Tier is a special performance tier reserved for drivers who achieve 13 consecutive Perfect weeks. Once unlocked, S-Tier grants access to the 5+ year payband — even if you haven't reached 5 years of tenure yet. However, you must maintain Perfect rating to stay in S-Tier.</p>
                </div>
              )}
            </div>
            {/* 5 */}
            <div>
              <button type="button" aria-expanded={showDQ} aria-controls="faq-dq" className="font-medium" onClick={()=>setShowDQ(!showDQ)}>
                What disqualifies me from getting a bonus? {showDQ ? "▲" : "▼"}
              </button>
              {showDQ && (
                <div id="faq-dq" role="region" className="mt-1">
                  <p>• Your Weekly Rating is NI or AR</p>
                  <p>• You receive a major safety flag (e.g., camera, following distance, seatbelt)</p>
                  <p>• You fail to meet Grade + Tenure + Scorecard thresholds for your payband</p>
                  <p>• You have a recent severe event that disqualifies you from Netradyne bonus</p>
                </div>
              )}
            </div>
            {/* 6 */}  
            <div>
              <button type="button" aria-expanded={showNDW} aria-controls="faq-ndw" className="font-medium" onClick={()=>setShowNDW(!showNDW)}>
                How does the Netradyne Bonus work? {showNDW ? "▲" : "▼"}
              </button>
              {showNDW && (
                <div id="faq-ndw" role="region" className="mt-1">
                  <p>The Netradyne Bonus is a separate quarterly incentive based on camera safety scores.</p>
                  <p>• Stark must earn Gold or Silver on Amazon's safety score</p>
                  <p>• You must have a Perfect or Meets Requirements rating</p>
                  <p>• You must not have any major camera flags or severe events in the last 6 weeks</p>
                  <p>If eligible, your Netradyne bonus accrues weekly and is paid out in a lump sum at the end of each quarter.</p>
                </div>
              )}
            </div>

            {/* Links */}
            <div>
              <a href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                📘 View Full Explainer PDF →
              </a>
            </div>
            <div>
              <a href="https://docs.google.com/spreadsheets/d/1gTmNlGNo_OH1zysEFvh7dAbvEibC5vgoGX6AMINxFWQ/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                📊 View Bonus Matrix Spreadsheet →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
