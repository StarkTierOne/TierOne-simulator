import React, { useState, useEffect, useMemo } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: { A: [26,27,28,29,30,32], B: [25,26,27,28,29,30], C: [24.75,25,25.25,25.5,25.75,26], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [25,26,27,28,29,30], B: [24.5,25,25.5,26,26.5,27], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] },
  },
  Fantastic: {
    Perfect: { A: [25,26,27,28,29,30], B: [24.5,25,26,27,28,29], C: [24.25,24.5,24.75,25,25.25,25.5], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24.5,25.5,26,26.5,27,28], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] },
  },
  Good: {
    Perfect: { A: [24.5,25,25.5,26,26.5,27], B: [24.25,24.5,25,25.5,26,26.5], C: [24,24.25,24.5,24.75,25,25.25], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
  },
  Fair: {
    Perfect: { A: [24.25,24.5,25,25.25,25.5,25.75], B: [24,24.25,24.5,24.75,25,25.25], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24,24.25,24.5,24.75,25,25.25], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
  },
  Poor: {
    Perfect: { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
    "Meets Requirements": { A: [24,24,24,24,24,24], B: [24,24,24,24,24,24], C: [24,24,24,24,24,24], "D & F": [24,24,24,24,24,24] },
  },
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

  // form state
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

  // netradyne
  const [netradyne, setNetradyne] = useState("");
  const [severeEvent, setSevereEvent] = useState("");
  const [showNDE, setShowNDE] = useState(false);

  // 39-hour guarantee
  const [daysWorked, setDaysWorked] = useState("");
  const [driverRejects, setDriverRejects] = useState("");
  const [amazonRejects, setAmazonRejects] = useState("");
  const [show39Exp, setShow39Exp] = useState(false);

  // lunch bonus
  const [lunchRate, setLunchRate] = useState("");
  const [showLunchExp, setShowLunchExp] = useState(false);

  // FAQ toggles
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPG, setShowPG] = useState(false);
  const [showWR, setShowWR] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showDQ, setShowDQ] = useState(false);
  const [showNDW, setShowNDW] = useState(false);

  // reset extras when rating changes
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
    setScorecard(""); setRating(""); setTier(""); setTenure("");
    setSTier(false);
    setCheckND(false); setCheck39(false); setCheckLunch(false);
    setNetradyne(""); setSevereEvent(""); setShowNDE(false);
    setDaysWorked(""); setDriverRejects(""); setAmazonRejects(""); setShow39Exp(false);
    setLunchRate(""); setShowLunchExp(false);
  };
  const printResults = () => window.print();

  // bonus helper
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

  // memoized rate
  const result = useMemo(() => getBonusRate(), [scorecard, rating, tier, tenure, sTier]);
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;

  // hours calc
  const totalH = parseFloat(hours||0);
  const otH = totalH>40 ? totalH-40 : 0;

  // 39-Hour Guarantee
  const is39Elig =
    check39 &&
    role==="Driver" &&
    rating==="Perfect" &&
    (parseInt(daysWorked,10)||0)>=3 &&
    driverRejects==="No";
  const credited39 = is39Elig ? Math.max(totalH,39) : totalH;
  const guaranteePay = (24 * credited39).toFixed(2);

  // Lunch Bonus
  const isLunchElig =
    checkLunch &&
    role==="Driver" &&
    rating==="Perfect" &&
    ["A","B"].includes(tier);
  const lunchAmt = isLunchElig
    ? (parseInt(daysWorked,10)||0) * (0.5)
    : 0;

  // base & totals
  const base = role==="Driver" ? 24 : parseFloat(baseRate)||24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base*1.5*otH).toFixed(2);
  const perfTotal = (hourlyBonus*totalH).toFixed(2);
  const baseOT = (base*credited39 + parseFloat(otPay)).toFixed(2);
  const totalPay = ((base+hourlyBonus)*credited39 + parseFloat(otPay) + lunchAmt).toFixed(2);

  // netradyne
  const isNDElig =
    checkND &&
    ["Perfect","Meets Requirements"].includes(rating) &&
    netradyne!=="None" &&
    severeEvent==="No";
  const netBonus = isNDElig ? (netradyne==="Gold"?20:10) : 0;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={e=>setRole(e.target.value)}
          >
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>

        {/* Hours */}
        <div>
          <label className="block font-medium mb-1" htmlFor="hours">
            Total Hours Worked (Optional)
          </label>
          <input
            id="hours"
            type="number"
            className="w-full border p-2 rounded"
            placeholder="e.g. 38.5"
            value={hours}
            onChange={e=>setHours(e.target.value)}
          />
        </div>

        {/* Base Rate for Trainer/Supervisor */}
        {(role==="Trainer"||role==="Supervisor") && (
          <div>
            <label className="block font-medium mb-1">Base Rate (Optional)</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="e.g. 27"
              value={baseRate}
              onChange={e=>setBaseRate(e.target.value)}
            />
          </div>
        )}

        {/* Scorecard */}
        <div>
          <label className="block font-medium mb-1">Amazon Scorecard</label>
          <select
            className="w-full border p-2 rounded"
            value={scorecard}
            onChange={e=>setScorecard(e.target.value)}
          >
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
          <label className="block font-medium mb-1">Weekly Rating</label>
          <select
            className="w-full border p-2 rounded"
            value={rating}
            onChange={e=>setRating(e.target.value)}
          >
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="block font-medium mb-1">Performance Grade</label>
          <select
            className="w-full border p-2 rounded"
            value={tier}
            onChange={e=>setTier(e.target.value)}
          >
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
          <label className="block font-medium mb-1">Years at Stark</label>
          <select
            className="w-full border p-2 rounded"
            value={tenure}
            onChange={e=>setTenure(e.target.value)}
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
            disabled={rating!=="Perfect"}
            checked={sTier}
            onChange={e=>setSTier(e.target.checked)}
            className="w-5 h-5"
          />
          <label className="font-medium">S-Tier (13 Perfect Weeks)</label>
        </div>

        {/* Toggles */}
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkND}
              onChange={e=>setCheckND(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-medium">Would you like to check your Netradyne Bonus?</span>
          </label>
          {role==="Driver"&&rating==="Perfect"&&(
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={check39}
                onChange={e=>setCheck39(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-medium">Would you like to check the 39-Hour Guarantee?</span>
            </label>
          )}
          {role==="Driver"&&rating==="Perfect"&&["A","B"].includes(tier)&&(
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checkLunch}
                onChange={e=>setCheckLunch(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-medium">Would you like to check the Paid Lunch Bonus?</span>
            </label>
          )}
        </div>
      </div>

      {/* Netradyne */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          <div>
            <label className="block font-medium mb-1">Netradyne Status</label>
            <select
              className="w-full border p-2 rounded"
              value={netradyne}
              onChange={e=>setNetradyne(e.target.value)}
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
              className="w-full border p-2 rounded"
              value={severeEvent}
              onChange={e=>setSevereEvent(e.target.value)}
            >
              <option value="">--</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <p className="font-medium">Netradyne Bonus: ${netBonus.toFixed(2)}</p>
          <button
            onClick={()=>setShowNDE(!showNDE)}
            className="font-semibold text-blue-600"
          >
            Netradyne Bonus Explainer {showNDE?"▲":"▼"}
          </button>
          {showNDE && (
            <div className="text-sm pl-4">
              The Netradyne Bonus is paid out quarterly if the company earns Gold or Silver status on Amazon's camera safety score. You must not have NI or AR ratings or receive major camera flags to qualify. If eligible, your bonus accrues weekly and is paid as a lump sum at the end of the quarter.
            </div>
          )}
        </div>
      )}

      {/* 39-Hour Guarantee */}
      {check39 && (
        <div className="bg-blue-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">🕒 39-Hour Guarantee</h2>
          <button
            onClick={()=>setShow39Exp(!show39Exp)}
            className="font-semibold text-blue-600"
          >
            What’s the 39-Hour Guarantee? {show39Exp?"▲":"▼"}
          </button>
          {show39Exp && (
            <div className="text-sm pl-4">
              If you have a Perfect rating, work at least 3 days, and have zero driver-initiated rejects, we’ll credit you up to 39 hours at your base rate even if you actually worked fewer.
            </div>
          )}
          <div>
            <label className="block font-medium mb-1">Days Worked This Week</label>
            <select
              className="w-full border p-2 rounded"
              value={daysWorked}
              onChange={e=>setDaysWorked(e.target.value)}
            >
              <option value="">--</option>
              {[...Array(8).keys()].slice(1).map(d=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Driver-Rejected Legs?</label>
            <select
              className="w-full border p-2 rounded"
              value={driverRejects}
              onChange={e=>setDriverRejects(e.target.value)}
            >
              <option value="">--</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Amazon-Canceled Legs?</label>
            <select
              className="w-full border p-2 rounded"
              value={amazonRejects}
              onChange={e=>setAmazonRejects(e.target.value)}
            >
              <option value="">--</option>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
        </div>
      )}

      {/* Lunch Bonus */}
      {checkLunch && (
        <div className="bg-yellow-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">🍽️ Paid Lunch Bonus</h2>
          <button
            onClick={()=>setShowLunchExp(!showLunchExp)}
            className="font-semibold text-blue-600"
          >
            What’s the Paid Lunch Bonus? {showLunchExp?"▲":"▼"}
          </button>
          {showLunchExp && (
            <div className="text-sm pl-4">
              As long as you have a Perfect rating and Grade A or B, you earn a lunch bonus of $0.50/day for each day worked.
            </div>
          )}
          <div>
            <label className="block font-medium mb-1">Days Worked This Week</label>
            <select
              className="w-full border p-2 rounded"
              value={daysWorked}
              onChange={e=>setDaysWorked(e.target.value)}
            >
              <option value="">--</option>
              {[...Array(8).keys()].slice(1).map(d=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold">Bonus Results</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Hourly Bonus:&nbsp;
            {hours
              ? `+${hourlyBonus.toFixed(2)}/hr`
              : <span className="text-gray-400 italic underline cursor-pointer" onClick={focusHours}>
                  $0.00 (enter hours)
                </span>
            }
          </li>
          <li>
            New Hourly Rate:&nbsp;
            {hours
              ? `${newRate}/hr`
              : <span className="text-gray-400 italic underline cursor-pointer" onClick={focusHours}>
                  $0.00 (enter hours)
                </span>
            }
          </li>
          {check39 && (
            <li>
              39-Hour Guarantee Pay:&nbsp;
              {hours
                ? `$${guaranteePay}`
                : <span className="text-gray-400 italic underline cursor-pointer" onClick={focusHours}>
                    $0.00 (enter hours)
                  </span>
              }
            </li>
          )}
          {checkLunch && (
            <li>Paid Lunch Bonus: ${lunchAmt.toFixed(2)}</li>
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

      {/* FAQ */}
      <div className="space-y-4">
        <button onClick={()=>setShowFAQ(!showFAQ)} className="font-semibold">
          Frequently Asked Questions {showFAQ?"▲":"▼"}
        </button>
        {showFAQ && (
          <div className="text-sm space-y-4 pl-4">
            {/* 1 */}
            <div>
              <button onClick={()=>setShowPG(!showPG)} className="font-medium">
                What is a Performance Grade (A–F)? {showPG?"▲":"▼"}
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
              <button onClick={()=>setShowWR(!showWR)} className="font-medium">
                How is Weekly Rating determined? {showWR?"▲":"▼"}
              </button>
              {showWR && (
                <div className="mt-1">
                  <p>Weekly Rating reflects your Total Score plus any safety, attendance, or behavioral flags.</p>
                  <p><strong>Perfect:</strong> 100% score with zero flags</p>
                  <p><strong>Meets Requirements:</strong> 83–99% with no major flags, or 100% with 1 minor flag</p>
                  <p><strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with minor flags</p>
                  <p><strong>Action Required:</strong> Less than 70%, or any score with 3+ minor flags or 1 major flag</p>
                </div>
              )}
            </div>
            {/* 3 */}
            <div>
              <button onClick={()=>setShowCP(!showCP)} className="font-medium">
                What are Call-out Penalties? {showCP?"▲":"▼"}
              </button>
              {showCP && (
                <div className="mt-1">
                  <p>• Block-level Callout: -10 points (1 instance in 2 weeks)</p>
                  <p>• 2+ Block Callouts: -15 points</p>
                  <p>• Load-level Callout: -17.1 points (1 instance in 6 weeks)</p>
                  <p>• 2+ Load-level Callouts: -20 points</p>
                  <p>Penalties last 2 weeks for blocks and 6 weeks for loads.</p>
                </div>
              )}
            </div>
            {/* 4 */}
            <div>
              <button onClick={()=>setShowST(!showST)} className="font-medium">
                What is S-Tier? {showST?"▲":"▼"}
              </button>
              {showST && (
                <div className="mt-1">
                  <p>S-Tier is reserved for drivers with 13 consecutive Perfect weeks. Once unlocked, it grants access to the 5+ year payband— but you must maintain Perfect rating.</p>
                </div>
              )}
            </div>
            {/* 5 */}
            <div>
              <button onClick={()=>setShowDQ(!showDQ)} className="font-medium">
                What disqualifies me from getting a bonus? {showDQ?"▲":"▼"}
              </button>
              {showDQ && (
                <div className="mt-1">
                  <p>• Your Weekly Rating is NI or AR</p>
                  <p>• You receive a major safety flag (e.g., camera, following distance, seatbelt)</p>
                  <p>• You fail to meet Grade + Tenure + Scorecard thresholds</p>
                  <p>• You have a recent severe event that disqualifies you</p>
                </div>
              )}
            </div>
            {/* 6 */}
            <div>
              <button onClick={()=>setShowNDW(!showNDW)} className="font-medium">
                How does the Netradyne Bonus work? {showNDW?"▲":"▼"}
              </button>
              {showNDW && (
                <div className="mt-1">
                  <p>The Netradyne Bonus is a separate quarterly incentive based on camera safety scores.</p>
                  <p>• Stark must earn Gold or Silver on Amazon's safety score</p>
                  <p>• You must have a Perfect or Meets Requirements rating</p>
                  <p>• You must not have any major camera flags or severe events in the last 6 weeks</p>
                  <p>If eligible, your bonus accrues weekly and is paid as a lump sum at the end of each quarter.</p>
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
