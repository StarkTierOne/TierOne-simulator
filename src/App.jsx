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
  // smooth-scroll into hours field
  const focusHours = () => {
    const el = document.getElementById("hours");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  // core form state
  const [role, setRole] = useState("");
  const [hours, setHours] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [rating, setRating] = useState("");
  const [tier, setTier] = useState("");
  const [tenure, setTenure] = useState("");
  const [sTier, setSTier] = useState(false);

  // toggles
  const [checkND, setCheckND] = useState(false);
  const [check39, setCheck39] = useState(false);
  const [checkLunch, setCheckLunch] = useState(false);

  // netradyne details
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);

  // 39-hr guarantee inputs
  const [daysWorked39, setDaysWorked39] = useState("");
  const [driverRejects, setDriverRejects] = useState("");
  const [amazonRejects, setAmazonRejects] = useState("");
  const [show39Exp, setShow39Exp] = useState(false);

  // lunch bonus inputs
  const [daysWorkedLunch, setDaysWorkedLunch] = useState("");
  const [showLunchExp, setShowLunchExp] = useState(false);

  // FAQ toggles
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  // reset 39 & lunch if rating changes
  useEffect(() => {
    if (rating !== "Perfect") {
      setSTier(false);
      setCheck39(false);
      setCheckLunch(false);
    }
  }, [rating]);

  const resetForm = () => {
    setRole(""); setHours(""); setBaseRate("");
    setScorecard(""); setRating(""); setTier("");
    setTenure(""); setSTier(false);
    setCheckND(false); setCheck39(false); setCheckLunch(false);
    setNetradyne(""); setSevereEvent(""); setShowNDE(false);
    setDaysWorked39(""); setDriverRejects(""); setAmazonRejects(""); setShow39Exp(false);
    setDaysWorkedLunch(""); setShowLunchExp(false);
  };
  const printResults = () => window.print();

  // tenure → index
  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus","Fantastic","Good","Fair"].includes(scorecard)) return 5;
    const y = parseInt(tenure.replace("+",""), 10);
    return isNaN(y) ? 0 : Math.min(y, 5);
  };
  // bonus rate lookup
  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tk = sTier ? "A" : (["D","F"].includes(tier) ? "D & F" : tier);
    const rate = card[tk]?.[getTenureIndex()] ?? 24;
    return { hourly: Math.min(rate,32), bonusOnly: (Math.min(rate,32)-24).toFixed(2) };
  };
  const result = useMemo(() => getBonusRate(), [scorecard,rating,tier,tenure,sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;

  // hours & OT
  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;

  // 39-hr guarantee logic
  const is39Elig = check39
    && role==="Driver"
    && rating==="Perfect"
    && parseInt(daysWorked39 || "0",10) >= 3
    && driverRejects === "No";
  // only missing hours up to 39 at $24/hr
  const missingH = is39Elig && totalH < 39 ? (39 - totalH) : 0;
  const guaranteePay = (24 * missingH).toFixed(2);

  // lunch bonus = base/2 × daysWorkedLunch
  const base = role==="Driver" ? 24 : (parseFloat(baseRate) || 24);
  const lunchAmt = (checkLunch
    && role==="Driver"
    && rating==="Perfect"
    && ["A","B"].includes(tier))
    ? ((base/2) * (parseInt(daysWorkedLunch||"0",10))).toFixed(2)
    : "0.00";

  // Netradyne
  const netBonus = (checkND
    && ["Perfect","Meets Requirements"].includes(rating)
    && netradyne !== "None"
    && severeEvent === "No")
    ? (netradyne === "Gold" ? 20 : 10)
    : 0;

  // rates & totals
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const performanceTotal = (hourlyBonus * totalH).toFixed(2);
  const baseOT = (base * totalH + parseFloat(otPay)).toFixed(2);
  const totalPay = (
    (parseFloat(baseOT) + parseFloat(guaranteePay) + parseFloat(lunchAmt))
  ).toFixed(2);

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>

      {/* ▶︎ FORM */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">

        {/* role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>

        {/* hours */}
        <div>
          <label htmlFor="hours" className="block font-medium mb-1">
            Total Hours Worked (Optional)
          </label>
          <input
            id="hours"
            type="number"
            value={hours}
            onChange={e => setHours(e.target.value)}
            placeholder="e.g. 38.5"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* baseRate */}
        {(role === "Trainer" || role === "Supervisor") && (
          <div>
            <label className="block font-medium mb-1">
              Base Rate (Optional)
            </label>
            <input
              type="number"
              value={baseRate}
              onChange={e => setBaseRate(e.target.value)}
              placeholder="e.g. 27"
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        {/* amazon scorecard */}
        <div>
          <label className="block font-medium mb-1">Amazon Scorecard</label>
          <select
            value={scorecard}
            onChange={e => setScorecard(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select scorecard --</option>
            <option>Fantastic Plus</option>
            <option>Fantastic</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
        </div>

        {/* weekly rating */}
        <div>
          <label className="block font-medium mb-1">Weekly Rating</label>
          <select
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        {/* performance grade */}
        <div>
          <label className="block font-medium mb-1">Performance Grade</label>
          <select
            value={tier}
            onChange={e => setTier(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select grade --</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>F</option>
          </select>
        </div>

        {/* tenure */}
        <div>
          <label className="block font-medium mb-1">Years at Stark</label>
          <select
            value={tenure}
            onChange={e => setTenure(e.target.value)}
            className="w-full border p-2 rounded"
          >
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
          <input
            type="checkbox"
            checked={sTier}
            onChange={e => setSTier(e.target.checked)}
            disabled={rating !== "Perfect"}
            className="w-5 h-5"
          />
          <label className="font-medium">S-Tier (13 Perfect Weeks)</label>
        </div>

        {/* toggles */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkND}
              onChange={e => setCheckND(e.target.checked)}
              className="w-5 h-5"
            />
            <label className="font-medium">Would you like to check your Netradyne Bonus?</label>
          </div>
          {checkND && (
            <div className="ml-6 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={check39}
                  onChange={e => setCheck39(e.target.checked)}
                  className="w-5 h-5"
                />
                <label className="font-medium">Would you like to check if you qualify for the 39-Hour Guarantee?</label>
              </div>
              {check39 && (
                <div className="ml-6 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checkLunch}
                    onChange={e => setCheckLunch(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label className="font-medium">Would you like to check if you qualify for the Paid Lunch Bonus?</label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ▶︎ Netradyne */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              value={netradyne}
              onChange={e => setNetradyne(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">--</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Any Severe Events in Last 6 Weeks?</label>
            <select
              value={severeEvent}
              onChange={e => setSevereEvent(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">--</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <p className="font-medium">Netradyne Bonus: ${netBonus.toFixed(2)}</p>
          <button
            className="font-semibold text-blue-600"
            onClick={() => setShowNDE(!showNDE)}
          >
            Bonus Explainer {showNDE ? "▲" : "▼"}
          </button>
          {showNDE && (
            <div className="text-sm pl-4">
              The Netradyne Bonus is paid quarterly if the company
              achieves Gold or Silver on Amazon’s safety score. You must
              not have NI/AR ratings or major camera flags. Paid lump-sum
              at quarter-end.
            </div>
          )}
        </div>
      )}

      {/* ▶︎ 39-Hour Guarantee */}
      {check39 && (
        <div className="bg-blue-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">🕒 39-Hour Guarantee</h2>
          <button
            className="font-semibold text-blue-600"
            onClick={() => setShow39Exp(!show39Exp)}
          >
            What’s the 39-Hour Guarantee? {show39Exp ? "▲" : "▼"}
          </button>
          {show39Exp && (
            <div className="text-sm pl-4">
              Perfect rating + ≥3 days + no driver rejects → credit missing
              hours up to 39 at $24/hr.
            </div>
          )}
          <label className="block font-medium">Days Worked</label>
          <select
            value={daysWorked39}
            onChange={e => setDaysWorked39(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">--</option>
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i} value={i+1}>{i+1}</option>
            ))}
          </select>
          <label className="block font-medium">Driver-Rejected Legs?</label>
          <select
            value={driverRejects}
            onChange={e => setDriverRejects(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">--</option>
            <option>No</option>
            <option>Yes</option>
          </select>
          <label className="block font-medium">Amazon-Cancelled Legs?</label>
          <select
            value={amazonRejects}
            onChange={e => setAmazonRejects(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">--</option>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      )}

      {/* ▶︎ Paid Lunch Bonus */}
      {checkLunch && (
        <div className="bg-yellow-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">🍽️ Paid Lunch Bonus</h2>
          <button
            className="font-semibold text-blue-600"
            onClick={() => setShowLunchExp(!showLunchExp)}
          >
            What’s the Paid Lunch Bonus? {showLunchExp ? "▲" : "▼"}
          </button>
          {showLunchExp && (
            <div className="text-sm pl-4">
              Perfect + Grade A/B → half-hour lunch bonus per day worked.
            </div>
          )}
          <label className="block font-medium">Days Worked</label>
          <select
            value={daysWorkedLunch}
            onChange={e => setDaysWorkedLunch(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">--</option>
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
      )}

      {/* ▶︎ RESULTS */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold">Bonus Results</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Your Base Rate: ${base.toFixed(2)}</li>
          <li>Weekly Bonus Total: ${performanceTotal}</li>
          <li>Hourly Bonus: +${hourlyBonus.toFixed(2)}/hr</li>
          <li>New Hourly Rate: ${newRate}/hr</li>
          {check39 && (
            <li>39-Hour Guarantee Pay: ${guaranteePay}</li>
          )}
          {checkLunch && (
            <li>Lunch Bonus Total: ${lunchAmt}</li>
          )}
          {checkND && (
            <li>Netradyne Bonus: ${netBonus.toFixed(2)}</li>
          )}
          <li>Overtime Pay: ${otPay}</li>
          <li>Base Pay (incl. OT): ${baseOT}</li>
          <li><strong>Total Weekly Pay:</strong> ${totalPay}</li>
        </ul>
        <div className="flex space-x-4">
          <button onClick={resetForm} className="px-4 py-2 border rounded">Reset</button>
          <button onClick={printResults} className="px-4 py-2 border rounded">Print</button>
        </div>
      </div>

      {/* ▶︎ FAQ */}
      <div className="space-y-4">
        <button onClick={() => setShowFAQ(!showFAQ)} className="font-semibold">
          Frequently Asked Questions {showFAQ ? "▲" : "▼"}
        </button>
        {showFAQ && (
          <div className="text-sm space-y-4 pl-4">
            {/* 1 */}
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
            {/* 2 */}
            <div>
              <button onClick={() => setShowWR(!showWR)} className="font-medium">
                How is Weekly Rating determined? {showWR ? "▲" : "▼"}
              </button>
              {showWR && (
                <div className="mt-1">
                  <p>Weekly Rating reflects your Total Score plus any safety, attendance, or behavioral flags.</p>
                  <p><strong>Perfect:</strong> 100% with zero flags</p>
                  <p><strong>Meets Requirements:</strong> 83–99% no major flags, or 100% with 1 minor flag</p>
                  <p><strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with minor flags</p>
                  <p><strong>Action Required:</strong> &lt;70%, or any score with ≥3 minor flags or 1 major flag</p>
                </div>
              )}
            </div>
            {/* 3 */}
            <div>
              <button onClick={() => setShowCP(!showCP)} className="font-medium">
                What are Call-out Penalties? {showCP ? "▲" : "▼"}
              </button>
              {showCP && (
                <div className="mt-1">
                  <p>• Block-level Callout: –10 points (1 in 2 weeks)</p>
                  <p>• 2+ Block Callouts: –15 points</p>
                  <p>• Load-level Callout: –17.1 points (1 in 6 weeks)</p>
                  <p>• 2+ Load-level Callouts: –20 points</p>
                  <p>Penalties last 2 weeks for blocks, 6 weeks for loads.</p>
                </div>
              )}
            </div>
            {/* 4 */}
            <div>
              <button onClick={() => setShowST(!showST)} className="font-medium">
                What is S-Tier? {showST ? "▲" : "▼"}
              </button>
              {showST && (
                <div className="mt-1">
                  <p>S-Tier is reserved for drivers with 13 consecutive Perfect weeks. Unlocks 5+ yr payband; must maintain Perfect weeks.</p>
                </div>
              )}
            </div>
            {/* 5 */}
            <div>
              <button onClick={() => setShowDQ(!showDQ)} className="font-medium">
                What disqualifies me from getting a bonus? {showDQ ? "▲" : "▼"}
              </button>
              {showDQ && (
                <div className="mt-1">
                  <p>• Rating: NI or AR</p>
                  <p>• Major safety flag (camera, following distance, seatbelt)</p>
                  <p>• Fail Grade+Tenure+Scorecard thresholds</p>
                  <p>• Recent severe event</p>
                </div>
              )}
            </div>
            {/* 6 */}
            <div>
              <button onClick={() => setShowNDW(!showNDW)} className="font-medium">
                How does the Netradyne Bonus work? {showNDW ? "▲" : "▼"}
              </button>
              {showNDW && (
                <div className="mt-1">
                  <p>The Netradyne Bonus is a quarterly incentive based on camera safety scores.</p>
                  <p>• Company must earn Gold or Silver on Amazon score</p>
                  <p>• Driver must have Perfect or Meets Requirements rating</p>
                  <p>• No major camera flags or severe events in last 6 weeks</p>
                  <p>If eligible, accrues weekly and paid lump-sum at quarter-end.</p>
                </div>
              )}
            </div>
            {/* links */}
            <div>
              <a href="https://drive.google.com/file/d/1CWVesfvKWsSFn7wv7bGvHv6kLb20Mzec/view?usp=sharing"
                 target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 underline">
                📘 View Full Explainer PDF →
              </a>
            </div>
            <div>
              <a href="https://docs.google.com/spreadsheets/d/1gTmNlGNo_OH1zysEFvh7dAbvEibC5vgoGX6AMINxFWQ/edit?usp=sharing"
                 target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 underline">
                📊 View Bonus Matrix Spreadsheet →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
