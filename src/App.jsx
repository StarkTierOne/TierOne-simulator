import React, { useState } from 'react';

const scorecardLevels = ['Fantastic+', 'Fantastic', 'Good', 'Fair', 'Poor'];
const weeklyRatings = ['Perfect', 'Meets Requirements (MR)', 'Needs Improvement (NI)', 'Action Required (AR)'];
const grades = ['A', 'B', 'C', 'D', 'F'];
const tenures = ['< 1 year', '1 year', '2 years', '3 years', '4 years', '5+ years'];
const roles = ['Driver', 'Trainer', 'Supervisor'];

function App() {
  const [scorecard, setScorecard] = useState('Fantastic+');
  const [rating, setRating] = useState('Perfect');
  const [grade, setGrade] = useState('A');
  const [tenure, setTenure] = useState('1 year');
  const [role, setRole] = useState('Driver');
  const [baseRateInput, setBaseRateInput] = useState('');
  const [hoursWorked, setHoursWorked] = useState(40);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showNetraPopup, setShowNetraPopup] = useState(false);

  const defaultBaseRate = role === 'Trainer' ? 24.5 : role === 'Supervisor' ? 25 : 24;
  const baseRate = baseRateInput !== '' ? parseFloat(baseRateInput) : defaultBaseRate;

  const disqualified = rating.includes('NI') || rating.includes('AR');
  const tenureYears = parseInt(tenure[0]) || 0;
  const isSTier = grade === 'A' && rating === 'Perfect' && tenureYears >= 5;

  const qualified = !disqualified && (
    grade === 'A' || grade === 'B' || (
      grade === 'C' && scorecard.includes('Fantastic') && (rating === 'Perfect' || tenure !== '< 1 year')
    )
  );

  const bonusPerHour = qualified ? (isSTier ? 8 : 3.25) : 0;
  const newHourlyPay = baseRate + bonusPerHour;

  const regularHours = Math.min(hoursWorked, 40);
  const overtimeHours = Math.max(hoursWorked - 40, 0);
  const overtimeRate = baseRate * 1.5;

  const bonusTotal = bonusPerHour * regularHours;
  const basePay = baseRate * regularHours + overtimeRate * overtimeHours;
  const totalPay = basePay + bonusTotal;
    return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-800">🚛 TierOne Bonus Simulator</h1>
        <p className="text-sm text-center text-gray-500 mb-4">"Earn More. Drive Higher."</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block font-semibold">Amazon Scorecard</label>
            <select value={scorecard} onChange={e => setScorecard(e.target.value)} className="w-full p-2 border rounded">
              {scorecardLevels.map(level => <option key={level}>{level}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Weekly Rating</label>
            <select value={rating} onChange={e => setRating(e.target.value)} className="w-full p-2 border rounded">
              {weeklyRatings.map(level => <option key={level}>{level}</option>)}
            </select>
            {disqualified && <p className="text-sm text-red-600 mt-1">⚠️ You are disqualified from all bonuses this week due to NI or AR rating.</p>}
          </div>

          <div>
            <label className="block font-semibold">TierOne Grade</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-2 border rounded">
              {grades.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Tenure</label>
            <select value={tenure} onChange={e => setTenure(e.target.value)} className="w-full p-2 border rounded">
              {tenures.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded">
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Base Rate Override (Optional)</label>
            <input type="number" step="0.01" placeholder="e.g. $24.50" value={baseRateInput} onChange={e => setBaseRateInput(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Hours Worked (Optional)</label>
            <input type="number" value={hoursWorked} onChange={e => setHoursWorked(Number(e.target.value))} className="w-full p-2 border rounded" min="0" />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-bold mb-2">💰 Bonus Results</h2>
          <p className="text-md">Your Base Rate: <span className="font-bold text-gray-800">${baseRate.toFixed(2)}</span></p>
          <p className="text-md">Hourly Bonus: <span className="font-bold text-green-600">${bonusPerHour.toFixed(2)}</span> {isSTier && <span className="ml-2 text-yellow-600">🌟 S-Tier Unlocked</span>}</p>
          <p className="text-md">New Hourly Pay (Base + Bonus): <span className="font-bold text-blue-700">${newHourlyPay.toFixed(2)}</span></p>
          <p className="text-md">Overtime Rate (Base × 1.5): <span className="font-bold text-gray-700">${overtimeRate.toFixed(2)}</span></p>
          <p className="text-md mt-2">Weekly Bonus Total (Max 40 hrs): <span className="font-bold text-green-700">${bonusTotal.toFixed(2)}</span></p>
          <p className="text-md">Base Pay (incl. OT): <span className="font-bold text-gray-700">${basePay.toFixed(2)}</span></p>
          <p className="text-lg">Total Weekly Pay (with Bonus): <span className="font-bold text-purple-700">${totalPay.toFixed(2)}</span></p>
          {!qualified && !disqualified && <p className="text-sm text-orange-600 mt-2">⚠️ You didn’t meet eligibility requirements this week.</p>}
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">Would you like to check your NetraDyne Bonus?</label>
          <button onClick={() => setShowNetraPopup(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Check NetraDyne Bonus</button>
        </div>
                {showNetraPopup && (
          <div className="mt-4 bg-white border border-blue-300 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold text-blue-800 mb-2">📸 NetraDyne Bonus Explainer</h3>
            <p className="text-sm text-gray-700">
              The NetraDyne Bonus is paid out quarterly if the company earns Gold or Silver status on Amazon's camera safety score.
              You must not have NI or AR ratings or receive major camera flags to qualify.
              When we qualify, your bonus accrues weekly and shows up in your driver summary. It is paid as a lump sum at the end of the quarter.
            </p>
            <button onClick={() => setShowNetraPopup(false)} className="mt-3 text-sm text-blue-600 underline">Close</button>
          </div>
        )}

        <div className="mt-6">
          <button onClick={() => setShowFAQ(!showFAQ)} className="text-blue-600 underline font-medium">
            {showFAQ ? 'Hide How This Is Calculated' : '📘 See How This Is Calculated'}
          </button>

          {showFAQ && (
            <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4 shadow-inner">
              <h3 className="text-lg font-bold mb-2 text-blue-800">📘 Bonus System Explained</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li><strong>Grade</strong> = your 13-week <strong>Total Score average</strong>, based on:</li>
                <ul className="ml-5 list-disc text-gray-600">
                  <li>On-time performance</li>
                  <li>Netradyne score</li>
                  <li>Acceptance rate</li>
                  <li>Block-level callouts</li>
                  <li>Load-level callouts</li>
                </ul>
                <li><strong>Weekly Rating</strong> = your performance this week (Perfect, Meets, NI, or AR)</li>
                <li><strong>S-Tier</strong> = a special rank unlocked by 13 consecutive Perfect weeks — it lets you reach top pay faster than waiting 5+ years of tenure.</li>
                <li><strong>Meets Requirements:</strong> On-time ≥ 98%, Netradyne ≥ 900, Acceptance ≥ 99%</li>
                <li><strong>Forgiveness:</strong> Netradyne ≥ 950 allows On-time as low as 97.5% and still qualify. Netradyne 1000 allows 97.0% On-time — still MR but may not reach B Grade.</li>
                <li><strong>Block-level Callouts:</strong> -10 points (1 callout for 2 weeks), -15 points (2+)</li>
                <li><strong>Load-level Callouts:</strong> -17.1 points (1), -20 points (2+) — penalty lasts 6 weeks</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
