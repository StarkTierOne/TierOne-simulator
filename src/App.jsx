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

  // Netradyne Bonus state
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

  // 39-Hour & Lunch Bonus state
  const [daysWorked, setDaysWorked] = useState("");
  const [driverRejects, setDriverRejects] = useState(0);
  const [amazonRejects, setAmazonRejects] = useState(0);
  const [show39Exp, setShow39Exp] = useState(false);
  const [lunchRate, setLunchRate] = useState("");
  const [showLunchExp, setShowLunchExp] = useState(false);

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
    setLunchRate(""); setShow39Exp(false); setShowLunchExp(false);
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

  // Calculations
  const result = useMemo(() => getBonusRate(), [scorecard, rating, tier, tenure, sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;

  // 39-Hour Guarantee (Driver only)
  const is39Eligible =
    role === "Driver" &&
    rating === "Perfect" &&
    (parseInt(daysWorked,10) || 0) >= 3 &&
    driverRejects === 0;
  const creditedHours39 = is39Eligible ? Math.max(totalH,39) : totalH;

  // Paid Lunch Bonus (Driver only)
  const lunchEligible =
    role === "Driver" &&
    rating === "Perfect" &&
    ["A","B"].includes(tier);
  const lunchAmt = lunchEligible
    ? (parseInt(daysWorked,10)||0) * (parseFloat(lunchRate)||0)
    : 0;

  // Base & Totals
  const base = role === "Driver" ? 24 : parseFloat(baseRate)||24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const perfBonusTotal = (hourlyBonus * totalH).toFixed(2);
  const guaranteePay = (base * creditedHours39).toFixed(2);
  const baseOT = (base * creditedHours39 + parseFloat(otPay)).toFixed(2);
  const totalPay = (
    (base + hourlyBonus) * creditedHours39 +
    parseFloat(otPay) +
    lunchAmt
  ).toFixed(2);

  // Netradyne Bonus
  const isElig = ["Perfect","Meets Requirements"].includes(rating);
  const qualifiesND = checkND && isElig && netradyne !== "None" && severeEvent === "No";
  const netBonus = qualifiesND ? (netradyne === "Gold" ? 20 : 10) : 0;

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

        {/* Total Hours */}
        <div>
          <label htmlFor="hours" className="block font-medium mb-1">Total Hours Worked (Optional)</label>
          <input id="hours" type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 38.5" className="w-full border p-2 rounded" />
        </div>

        {/* Base Rate */}
        {(role === "Trainer" || role === "Supervisor") && (
          <div>
            <label htmlFor="baseRate" className="block font-medium mb-1">Base Rate (Optional)</label>
            <input id="baseRate" type="number" value={baseRate} onChange={e => setBaseRate(e.target.value)} placeholder="e.g. 27" className="w-full border p-2 rounded" />
          </div>
        )}

        {/* Scorecard */}
        <div>
          <label htmlFor="scorecard" className="block font-medium mb-1">Amazon Scorecard</label>
          <select id="scorecard" value={scorecard} onChange={e => setScorecard(e.target.value)} className="w-full border p-2 rounded">
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
          <select id="rating" value={rating} onChange={e => setRating(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        {/* Performance Grade */}
        <div>
          <label htmlFor="tier" className="block font-medium mb-1">Performance Grade</label>
          <select id="tier" value={tier} onChange={e => setTier(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select grade --</option>
            <option>A</option><option>B</option><option>C</option><option>D</option><option>F</option>
          </select>
        </div>

        {/* Tenure */}
        <div>
          <label htmlFor="tenure" className="block font-medium mb-1">Years at Stark</label>
          <select id="tenure" value={tenure} onChange={e => setTenure(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select tenure --</option><option>&lt;1</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
          </select>
        </div>

        {/* S-Tier */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="sTier" checked={sTier} onChange={e => setSTier(e.target.checked)} disabled={rating !== "Perfect"} className="w-5 h-5" />
          <label htmlFor="sTier" className="font-medium">S-Tier (13 Perfect Weeks)</label>
        </div>

        {/* Netradyne Toggle */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="ndToggle" checked={checkND} onChange={e => setCheckND(e.target.checked)} className="w-5 h-5" />
          <label htmlFor="ndToggle" className="font-medium">Would you like to check your Netradyne Bonus?</label>
        </div>

        {/* 39-Hour Guarantee */}
        {role === "Driver" && rating === "Perfect" && (
          <div className="space-y-4">
            <h3 className="font-semibold">39-Hour Guarantee</h3>
            <button type="button" className="font-medium" onClick={() => setShow39Exp(!show39Exp)}>
              What’s the 39-Hour Guarantee? {show39Exp ? "▲" : "▼"}
            </button>
            {show39Exp && (
              <div className="text-sm pl-4">
                If you have Perfect rating, work at least 3 days, and have zero driver-initiated rejects, you’ll be credited up to 39 hours at your base rate even if you worked fewer.
              </div>
            )}
            <div>
              <label htmlFor="daysWorked" className="block font-medium mb-1">Days Worked This Week</label>
              <input id="daysWorked" type="number" min="0" max="7" value={daysWorked} onChange={e => setDaysWorked(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="driverRejects" className="block font-medium mb-1">Driver-Rejected Legs</label>
              <input id="driverRejects" type="number" min="0" value={driverRejects} onChange={e => setDriverRejects(parseInt(e.target.value,10)||0)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="amazonRejects" className="block font-medium mb-1">Amazon-Canceled Legs</label>
              <input id="amazonRejects" type="number" min="0" value={amazonRejects} onChange={e => setAmazonRejects(parseInt(e.target.value,10)||0)} className="w-full border p-2 rounded" />
            </div>
          </div>
        )}

        {/* Paid Lunch Bonus */}
        {role === "Driver" && lunchEligible && (
          <div className="space-y-4">
            <h3 className="font-semibold">Paid Lunch Bonus</h3>
            <button type="button" className="font-medium" onClick={() => setShowLunchExp(!showLunchExp)}>
              What’s the Paid Lunch Bonus? {showLunchExp ? "▲" : "▼"}
            </button>
            {showLunchExp && (
              <div className="text-sm pl-4">
                With Perfect rating and Grade A/B, you earn a lunch bonus per day worked. Enter your per-day rate above.
              </div>
            )}
            <div>
              <label htmlFor="lunchRate" className="block font-medium mb-1">Lunch Bonus Rate ($/day)</label>
              <input id="lunchRate" type="number" value={lunchRate} onChange={e => setLunchRate(e.target.value)} placeholder="e.g. 5" className="w-full border p-2 rounded" />
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
              <select value={netradyne} onChange={e => setNetradyne(e.target.value)} className="w-full border p-2 rounded">
                <option value="">--</option><option>Gold</option><option>Silver</option><option>None</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Severe Events Last 6 Weeks?</label>
              <select value={severeEvent} onChange={e => setSevereEvent(e.target.value)} className="w-full border p-2 rounded">
                <option value="">--</option><option>No</option><option>Yes</option>
              </select>
            </div>
            <p className="font-medium">Bonus (if eligible): <span className="text-lg">${netBonus}</span></p>
            <button type="button" className="font-semibold" onClick={() => setShowNDE(!showNDE)}>
              Netradyne Bonus Explainer {showNDE ? "▲" : "▼"}
            </button>
            {showNDE && (
              <div className="text-sm pl-4">
                The Netradyne Bonus is paid out quarterly if the company earns Gold or Silver on Amazon’s camera safety score. You must not have NI or AR ratings or major camera flags to qualify. If eligible, your bonus accrues weekly and is paid as a lump sum at quarter’s end.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grouped Bonus Results */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h3 className="text-xl font-semibold mb-2">Bonus Results</h3>

        {/* 1. Performance */}
        <div>
          <h4 className="font-medium">TierOne Performance Bonus</h4>
          <ul className="list-disc ml-6 space-y-1">
            <li>Hourly Bonus: +${hourlyBonus.toFixed(2)}/hr</li>
            <li>Weekly Bonus Total: ${perfBonusTotal}</li>
          </ul>
        </div>

        {/* 2. 39-Hour Guarantee */}
        {role === "Driver" && rating === "Perfect" && (
          <div>
            <h4 className="font-medium">39-Hour Guarantee</h4>
            <ul className="list-disc ml-6 space-y-1">
              <li>Credited Hours: {creditedHours39.toFixed(2)} hrs</li>
              <li>Guarantee Pay: ${guaranteePay}</li>
            </ul>
          </div>
        )}

        {/* 3. Paid Lunch */}
        {role === "Driver" && lunchEligible && (
          <div>
            <h4 className="font-medium">Paid Lunch Bonus</h4>
            <ul className="list-disc ml-6 space-y-1">
              <li>Lunch Days: {parseInt(daysWorked,10)||0}</li>
              <li>Lunch Bonus Total: ${lunchAmt.toFixed(2)}</li>
            </ul>
          </div>
        )}

        {/* 4. Netradyne */}
        {checkND && (
          <div>
            <h4 className="font-medium">Netradyne Safety Bonus</h4>
            <ul className="list-disc ml-6 space-y-1">
              <li>Weekly Netradyne Bonus: ${netBonus}</li>
            </ul>
          </div>
        )}

        {/* 5. Totals & OT */}
        <div>
          <h4 className="font-medium">Totals & Overtime</h4>
          <ul className="list-disc ml-6 space-y-1">
            <li>New Hourly Rate: ${newRate}/hr</li>
            <li>Overtime Pay: ${otPay}</li>
            <li>Base Pay (incl. OT): ${baseOT}</li>
            <li><strong>Total Weekly Pay:</strong> ${totalPay}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button onClick={resetForm} className="px-4 py-2 border rounded">Reset</button>
          <button onClick={printResults} className="px-4 py-2 border rounded">Print</button>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <button onClick={() => setShowFAQ(!showFAQ)} className="font-semibold">
          Frequently Asked Questions {showFAQ ? "▲" : "▼"}
        </button>
        {showFAQ && (
          <div className="text-sm space-y-4 pl-4">
            {/* Performance Grade */}
            <div>
              <button onClick={() => setShowPG(!showPG)} className="font-medium">
                What is a Performance Grade (A–F)? {showPG ? "▲" : "▼"}
              </button>
              {showPG && (
                <div className="mt-1">
                  <p>Your Performance Grade is based on your last 13 weeks of overall Total Score.</p>
                  <p><strong>A Grade:</strong> 10 weeks at 100%, rest at 90%+, 1 grace week at 70%+</p>
                  <p><strong>B Grade:</strong> 5 weeks at 100%, rest at 90%+, 1 grace week at 70%+ or all 13 weeks at 90%+</p>
                  <p><strong>C Grade:</strong> All other valid combinations</p>
                  <p><strong>D Grade:</strong> 2+ weeks below 70% or 6+ weeks between 70–83%</p>
                  <p><strong>F Grade:</strong> 5+ weeks below 70% or all 13 weeks between 70–83%</p>
                </div>
              )}
            </div>
            {/* Weekly Rating */}
            <div>
              <button onClick={() => setShowWR(!showWR)} className="font-medium">
                How is Weekly Rating determined? {showWR ? "▲" : "▼"}
              </button>
              {showWR && (
                <div className="mt-1">
                  <p>Weekly Rating reflects your Total Score plus any safety, attendance, or behavioral flags.</p>
                  <p><strong>Perfect:</strong> 100% score with zero flags</p>
                  <p><strong>Meets Requirements:</strong> 83–99% no major flags, or 100% with 1 minor flag</p>
                  <p><strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with minor flags</p>
                  <p><strong>Action Required:</strong> &lt;70%, or any score with 3+ minor flags or 1 major flag</p>
                </div>
              )}
            </div>
            {/* Call-out Penalties */}
            <div>
              <button onClick={() => setShowCP(!showCP)} className="font-medium">
                What are Call-out Penalties? {showCP ? "▲" : "▼"}
              </button>
              {showCP && (
                <div className="mt-1">
                  <p>• Block-level: -10 points (1 in 2 weeks)</p>
                  <p>• 2+ Block-level: -15 points</p>
                  <p>• Load-level: -17.1 points (1 in 6 weeks)</p>
                  <p>• 2+ Load-level: -20 points</p>
                  <p>Penalties last 2 weeks for blocks and 6 weeks for loads.</p>
                </div>
              )}
            </div>
            {/* S-Tier */}
            <div>
              <button onClick={() => setShowST(!showST)} className="font-medium">
                What is S-Tier? {showST ? "▲" : "▼"}
              </button>
              {showST && (
                <div className="mt-1">
                  <p>S-Tier is for drivers with 13 consecutive Perfect weeks. Once unlocked, it grants access to the 5+ year payband—but you must maintain Perfect rating.</p>
                </div>
              )}
            </div>
            {/* Disqualifiers */}
            <div>
              <button onClick={() => setShowDQ(!showDQ)} className="font-medium">
                What disqualifies me from getting a bonus? {showDQ ? "▲" : "▼"}
              </button>
              {showDQ && (
                <div className="mt-1">
                  <p>• Weekly Rating is NI or AR</p>
                  <p>• Any major safety flag</p>
                  <p>• Failing Grade+Tenure+Scorecard thresholds</p>
                  <p>• Recent severe event disqualifier</p>
                </div>
              )}
            </div>
            {/* Netradyne Bonus */}
            <div>
              <button onClick={() => setShowNDW(!showNDW)} className="font-medium">
                How does the Netradyne Bonus work? {showNDW ? "▲" : "▼"}
              </button>
              {showNDW && (
                <div className="mt-1">
                  <p>The Netradyne Bonus is a quarterly incentive based on camera safety scores.</p>
                  <p>• Company must earn Gold or Silver on Amazon’s safety score</p>
                  <p>• You need a Perfect or Meets Requirements rating</p>
                  <p>• No major camera flags or severe events in the last 6 weeks</p>
                  <p>If eligible, your bonus accrues weekly and is paid as a lump sum end of quarter.</p>
                </div>
              )}
            </div>
            {/* Links */}
            <div>
              <a
                href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📘 View Full Explainer PDF →
              </a>
            </div>
            <div>
              <a
                href="https://docs.google.com/spreadsheets/d/1gTmNlGNo_OH1zysEFvh7dAbvEibC5vgoGX6AMINxFWQ/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📊 View Bonus Matrix Spreadsheet →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
