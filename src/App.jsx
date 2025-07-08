import React, { useState, useEffect } from "react";

// Performance bonus matrix
const BONUS_MATRIX = {
  "Fantastic Plus": {
    Perfect: {
      A: [26, 27, 28, 29, 30, 32],
      B: [25, 26, 27, 28, 29, 30],
      C: [24.75, 25, 25.25, 25.5, 25.75, 26],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [25, 26, 27, 28, 29, 30],
      B: [24.5, 25, 25.5, 26, 26.5, 27],
      C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Fantastic: {
    Perfect: {
      A: [25, 26, 27, 28, 29, 30],
      B: [24.5, 25, 26, 27, 28, 29],
      C: [24.25, 24.5, 24.75, 25, 25.25, 25.5],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24.5, 25.5, 26, 26.5, 27, 28],
      B: [24.25, 24.5, 25, 25.5, 26, 26.5],
      C: [24, 24.25, 24.5, 24.75, 25, 25.25],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Good: {
    Perfect: {
      A: [24.5, 25, 25.5, 26, 26.5, 27],
      B: [24.25, 24.5, 25, 25.5, 26, 26.5],
      C: [24, 24.25, 24.5, 24.75, 25, 25.25],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24.25, 24.5, 25, 25.25, 25.5, 25.75],
      B: [24, 24.25, 24.5, 24.75, 25, 25.25],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Fair: {
    Perfect: {
      A: [24.25, 24.5, 25, 25.25, 25.5, 25.75],
      B: [24, 24.25, 24.5, 24.75, 25, 25.25],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24, 24.25, 24.5, 24.75, 25, 25.25],
      B: [24, 24, 24, 24, 24, 24],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
  Poor: {
    Perfect: {
      A: [24, 24, 24, 24, 24, 24],
      B: [24, 24, 24, 24, 24, 24],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
    "Meets Requirements": {
      A: [24, 24, 24, 24, 24, 24],
      B: [24, 24, 24, 24, 24, 24],
      C: [24, 24, 24, 24, 24, 24],
      "D & F": [24, 24, 24, 24, 24, 24],
    },
  },
};

export default function App() {
  // --- state hooks ---
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

  // reset S-Tier if rating changes away from Perfect
  useEffect(() => {
    if (rating !== "Perfect") setSTier(false);
  }, [rating]);

  // --- helpers ---
  const resetForm = () => {
    setRole("");
    setHours("");
    setBaseRate("");
    setScorecard("");
    setRating("");
    setTier("");
    setTenure("");
    setSTier(false);

    setCheckND(false);
    setNetradyne("");
    setSevereEvent("");
  };

  const printResults = () => {
    if (typeof window !== "undefined") window.print();
  };

  const getTenureIndex = () => {
    if (sTier && ["Fantastic Plus", "Fantastic", "Good", "Fair"].includes(scorecard))
      return 5;
    const y = parseInt(tenure.replace("+", ""), 10);
    return isNaN(y) ? 0 : Math.min(y, 5);
  };

  const getBonusRate = () => {
    const key = rating === "Meets Requirements" ? "Meets Requirements" : rating;
    const card = BONUS_MATRIX[scorecard]?.[key];
    if (!card) return null;
    const tierKey = sTier ? "A" : ["D", "F"].includes(tier) ? "D & F" : tier;
    const rate = card[tierKey]?.[getTenureIndex()] ?? 24;
    return { hourly: Math.min(rate, 32), bonusOnly: (Math.min(rate, 32) - 24).toFixed(2) };
  };

  // --- calculation ---
  const result = getBonusRate();
  const hourlyBonus = result ? parseFloat(result.bonusOnly) : 0;
  const isEligible = ["Perfect", "Meets Requirements"].includes(rating);
  const qualifiesND = checkND && isEligible && netradyne !== "None" && severeEvent === "No";
  const netBonus = qualifiesND ? (netradyne === "Gold" ? 20 : 10) : 0;

  const totalH = parseFloat(hours || 0);
  const otH = totalH > 40 ? totalH - 40 : 0;
  const baseH = Math.min(totalH, 40);
  const base = role === "Driver" ? 24 : parseFloat(baseRate) || 24;
  const newRate = (base + hourlyBonus).toFixed(2);
  const otPay = (base * 1.5 * otH).toFixed(2);
  const weeklyBonus = (hourlyBonus * baseH).toFixed(2);
  const baseOT = (base * baseH + parseFloat(otPay)).toFixed(2);
  const totalPay = ((base + hourlyBonus) * baseH + parseFloat(otPay)).toFixed(2);

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center">TierOne Bonus Simulator</h1>

      {/* Inputs */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="role" className="block font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select role --</option>
            <option>Driver</option>
            <option>Trainer</option>
            <option>Supervisor</option>
          </select>
        </div>

        <div>
          <label htmlFor="hours" className="block font-medium mb-1">
            Total Hours Worked (Optional)
          </label>
          <input
            id="hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 38.5"
            className="w-full border p-2 rounded"
          />
        </div>

        {(role === "Trainer" || role === "Supervisor") && (
          <div>
            <label htmlFor="baseRate" className="block font-medium mb-1">
              Base Pay (Optional)
            </label>
            <input
              id="baseRate"
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              placeholder="e.g. 27"
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <div>
          <label htmlFor="scorecard" className="block font-medium mb-1">
            Amazon Scorecard
          </label>
          <select
            id="scorecard"
            value={scorecard}
            onChange={(e) => setScorecard(e.target.value)}
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

        <div>
          <label htmlFor="rating" className="block font-medium mb-1">
            Weekly Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select rating --</option>
            <option>Perfect</option>
            <option>Meets Requirements</option>
            <option>Needs Improvement</option>
            <option>Action Required</option>
          </select>
        </div>

        <div>
          <label htmlFor="tier" className="block font-medium mb-1">
            Performance Grade
          </label>
          <select
            id="tier"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
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

        <div>
          <label htmlFor="tenure" className="block font-medium mb-1">
            Years at Stark
          </label>
          <select
            id="tenure"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sTier"
            checked={sTier}
            onChange={(e) => setSTier(e.target.checked)}
            disabled={rating !== "Perfect"}
            className="w-5 h-5"
          />
          <label htmlFor="sTier" className="font-medium">
            S-Tier (13 Perfect Weeks)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="ndToggle"
            checked={checkND}
            onChange={(e) => setCheckND(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="ndToggle" className="font-medium">
            Would you like to check your Netradyne Bonus?
          </label>
        </div>
      </div>

      {/* Netradyne */}
      {checkND && (
        <div className="bg-green-50 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold">📸 Netradyne Bonus</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Netradyne Status</label>
              <select
                value={netradyne}
                onChange={(e) => setNetradyne(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">--</option>
                <option>Gold</option>
                <option>Silver</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Any Severe Events in Last 6 Weeks?
              </label>
              <select
                value={severeEvent}
                onChange={(e) => setSevereEvent(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">--</option>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <p className="font-medium">
              Bonus (if eligible): <span className="text-lg">${netBonus}</span>
            </p>
            <button
              onClick={() => setShowNDE(!showNDE)}
              className="font-semibold"
            >
              Netradyne Bonus Explainer {showNDE ? "▲" : "▼"}
            </button>
            {showNDE && (
              <div className="text-sm pl-4">
                <p>
                  The Netradyne Bonus is paid out quarterly if the company earns
                  Gold or Silver status on Amazon's camera safety score. You
                  must not have NI or AR ratings or receive major camera flags to
                  qualify. If eligible, your bonus accrues weekly and is paid as
                  a lump sum at the end of the quarter.
                </p>
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
          <li>Base Pay (incl. OT): ${baseOT}</li>
          <li>
            <strong>Total Weekly Pay:</strong> ${totalPay}
          </li>
        </ul>
        <div className="flex space-x-4">
          <button onClick={resetForm} className="px-4 py-2 border rounded">
            Reset
          </button>
          <button onClick={printResults} className="px-4 py-2 border rounded">
            Print
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <button
          onClick={() => setShowFAQ(!showFAQ)}
          className="font-semibold"
        >
          Frequently Asked Questions {showFAQ ? "▲" : "▼"}
        </button>
        {showFAQ && (
          <div className="text-sm space-y-4 pl-4">
            {/* Each question is its own collapsible */}
            <div>
              <button
                onClick={() => setShowPG(!showPG)}
                className="font-medium"
              >
                What is a Performance Grade (A–F)? {showPG ? "▲" : "▼"}
              </button>
              {showPG && (
                <div className="mt-1">
                  <p>
                    Your Performance Grade is based on your last 13 weeks of
                    overall Total Score.
                  </p>
                  <p>
                    <strong>A Grade:</strong> 10 weeks at 100%, rest at 90%+,
                    1 grace week at 70%+
                  </p>
                  <p>
                    <strong>B Grade:</strong> 5 weeks at 100%, rest at 90%+,
                    1 grace week at 70%+ or all 13 weeks at 90%+
                  </p>
                  <p>
                    <strong>C Grade:</strong> All other valid combinations
                  </p>
                  <p>
                    <strong>D Grade:</strong> 2+ weeks below 70% or 6+ weeks
                    between 70–83%
                  </p>
                  <p>
                    <strong>F Grade:</strong> 5+ weeks below 70% or all 13 weeks
                    between 70–83%
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowWR(!showWR)}
                className="font-medium"
              >
                How is Weekly Rating determined? {showWR ? "▲" : "▼"}
              </button>
              {showWR && (
                <div className="mt-1">
                  <p>
                    Weekly Rating reflects your Total Score plus any safety,
                    attendance, or behavioral flags.
                  </p>
                  <p>
                    <strong>Perfect:</strong> 100% score with zero flags
                  </p>
                  <p>
                    <strong>Meets Requirements:</strong> 83–99% with no major
                    flags, or 100% with 1 minor flag
                  </p>
                  <p>
                    <strong>Needs Improvement:</strong> 70–82.99%, or 83–99% with
                    minor flags
                  </p>
                  <p>
                    <strong>Action Required:</strong> Less than 70%, or any
                    score with 3+ minor flags or 1 major flag
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowCP(!showCP)}
                className="font-medium"
              >
                What are Call-out Penalties? {showCP ? "▲" : "▼"}
              </button>
              {showCP && (
                <div className="mt-1">
                  <p>• Block-level Callout: -10 points (1 instance in 2 weeks)</p>
                  <p>• 2+ Block Callouts: -15 points</p>
                  <p>• Load-level Callout: -17.1 points (1 instance in 6 weeks)</p>
                  <p>• 2+ Load-level Callouts: -20 points</p>
                  <p>
                    Penalties last 2 weeks for blocks and 6 weeks for loads,
                    affecting eligibility and ratings.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowST(!showST)}
                className="font-medium"
              >
                What is S-Tier? {showST ? "▲" : "▼"}
              </button>
              {showST && (
                <div className="mt-1">
                  <p>
                    S-Tier is reserved for drivers with 13 consecutive Perfect
                    weeks. Once unlocked, it grants access to the 5+ year
                    payband, but you must maintain Perfect rating.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowDQ(!showDQ)}
                className="font-medium"
              >
                What disqualifies me from getting a bonus? {showDQ ? "▲" : "▼"}
              </button>
              {showDQ && (
                <div className="mt-1">
                  <p>• Your Weekly Rating is NI or AR</p>
                  <p>• You receive a major camera or safety flag</p>
                  <p>• You fail to meet Grade + Tenure + Scorecard thresholds</p>
                  <p>• You have a recent severe event that disqualifies you</p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowNDW(!showNDW)}
                className="font-medium"
              >
                How does the Netradyne Bonus work? {showNDW ? "▲" : "▼"}
              </button>
              {showNDW && (
                <div className="mt-1">
                  <p>
                    The Netradyne Bonus is a separate quarterly incentive based
                    on camera safety scores.
                  </p>
                  <p>
                    • Stark must earn Gold or Silver on Amazon's safety score
                  </p>
                  <p>• You must have a Perfect or Meets Requirements rating</p>
                  <p>
                    • No major camera flags or severe events in the last 6
                    weeks
                  </p>
                  <p>
                    If eligible, your bonus accrues weekly and is paid as a lump
                    sum at the end of each quarter.
                  </p>
                </div>
              )}
            </div>

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
