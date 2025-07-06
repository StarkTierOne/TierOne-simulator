import React, { useState } from 'react';

const scorecardLevels = ['Fantastic+', 'Fantastic', 'Good', 'Fair', 'Poor'];
const weeklyRatings = ['Perfect', 'Meets', 'Needs Improvement (NI)', 'Action Required (AR)'];
const grades = ['A', 'B', 'C', 'D', 'F'];
const tenures = ['< 1 year', '1 year', '2 years', '3 years', '4 years', '5+ years'];

function App() {
  const [scorecard, setScorecard] = useState('Fantastic+');
  const [rating, setRating] = useState('Perfect');
  const [grade, setGrade] = useState('A');
  const [tenure, setTenure] = useState('1 year');
  const [showFAQ, setShowFAQ] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(40);

  const baseRate = 24;

  const disqualified = rating.includes('NI') || rating.includes('AR');
  const tenureYears = parseInt(tenure[0]) || 0;

  const qualified = !disqualified && (
    grade === 'A' || grade === 'B' || (
      grade === 'C' && scorecard.includes('Fantastic') && (rating === 'Perfect' || tenure !== '< 1 year')
    )
  );

  const bonusPerHour = qualified
    ? grade === 'A' && rating === 'Perfect' && tenureYears >= 5
      ? 8
      : 3.25
    : 0;

  const regularHours = Math.min(hoursWorked, 40);
  const overtimeHours = Math.max(hoursWorked - 40, 0);
  const overtimePay = baseRate * 1.5 * overtimeHours;

  const bonusTotal = bonusPerHour * regularHours;
  const basePay = baseRate * regularHours + overtimePay;
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
            {disqualified && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ You are disqualified from all bonuses this week due to NI or AR rating.
              </p>
            )}
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
            <label className="block font-semibold">Hours Worked</label>
            <input
              type="number"
              value={hoursWorked}
              onChange={e => setHoursWorked(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-bold mb-2">💰 Bonus Results</h2>
          <p className="text-lg">Hourly Bonus: <span className="font-bold text-green-600">${bonusPerHour.toFixed(2)}</span></p>
          <p className="text-lg">Bonus This Week (max 40 hrs): <span className="font-bold text-blue-700">${bonusTotal.toFixed(2)}</span></p>
          <p className="text-lg">Base Pay (incl. OT): <span className="font-bold text-gray-700">${basePay.toFixed(2)}</span></p>
          <p className="text-lg">Total Weekly Pay: <span className="font-bold text-purple-700">${totalPay.toFixed(2)}</span></p>
          {!qualified && !disqualified && (
            <p className="text-sm text-orange-600 mt-2">⚠️ You didn’t meet eligibility for bonus this week.</p>
          )}
        </div>

        <div className="mt-4">
          <button onClick={() => setShowFAQ(!showFAQ)} className="text-blue-600 underline font-medium">
            {showFAQ ? 'Hide FAQ' : 'View FAQ & Explainer'}
          </button>
          {showFAQ && (
            <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4 shadow-inner">
              <h3 className="text-lg font-bold mb-2 text-blue-800">📘 Bonus Explainer (Made Simple)</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li><strong>Grade</strong> = your 13-week average performance</li>
                <li><strong>Weekly Rating</strong> = how you did this week</li>
                <li><strong>Tenure</strong> = how long you've been here</li>
                <li><strong>Scorecard</strong> = how the company is performing</li>
                <li><strong>NI or AR</strong> = disqualifies you from all bonuses including Netradyne</li>
              </ul>
              <h3 className="text-md font-bold mt-4 mb-1 text-blue-800">❓ FAQ</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li><strong>Q: Why is my bonus $0?</strong> — You may be disqualified due to rating or grade/tenure mismatch.</li>
                <li><strong>Q: What’s the max bonus?</strong> — Up to $8/hr with A+ Grade, Perfect Rating, 5-year tenure, and Fantastic+ company score.</li>
                <li><strong>Q: What if I worked overtime?</strong> — Base pay includes OT, but bonus is capped at 40 hrs.</li>
                <li><strong>Q: What's Netradyne?</strong> — It's the camera system tracking safety. NI/AR disqualifies you from Netradyne bonuses.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
