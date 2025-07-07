import React, { useState } from "react";

export default function App() {
  const [role, setRole] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const isTrainerOrSupervisor = role === "Trainer" || role === "Supervisor";

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 text-sm">
      <h1 className="text-xl font-bold">TierOne Bonus Simulator</h1>

      {/* Role Selection */}
      <div>
        <label className="block font-medium mb-1">Select Your Role:</label>
        <select
          className="w-full border rounded p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- Choose Role --</option>
          <option value="Driver">Driver</option>
          <option value="Trainer">Trainer</option>
          <option value="Supervisor">Supervisor</option>
        </select>
      </div>

      {/* Hours Worked (Optional) */}
      <div>
        <label className="block font-medium mb-1">Hours Worked (optional):</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          placeholder="e.g. 40"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
        />
      </div>

      {/* Base Rate (Optional for Trainer/Supervisor Only) */}
      {isTrainerOrSupervisor && (
        <div>
          <label className="block font-medium mb-1">
            Base Rate (optional for {role.toLowerCase()}s):
          </label>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="e.g. 26.00"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
          />
        </div>
      )}

      {/* Placeholder for Bonuses */}
      <div className="mt-6 border-t pt-4">
        <h2 className="font-semibold text-lg">💵 Bonus Results</h2>
        <p className="text-gray-600 italic">
          Your bonus pay, base pay, and overtime (if any) will appear here after completing the full simulator inputs.
        </p>
      </div>
    </div>
  );
}
{/* Tenure */}
<div>
  <label className="block font-medium mb-1">Years at Stark (Tenure):</label>
  <input
    type="number"
    className="w-full border rounded p-2"
    placeholder="e.g. 2"
    step="0.1"
    value={tenure}
    onChange={(e) => setTenure(e.target.value)}
  />
</div>

{/* Amazon Scorecard */}
<div>
  <label className="block font-medium mb-1">Amazon Scorecard Rating:</label>
  <select
    className="w-full border rounded p-2"
    value={amazonScore}
    onChange={(e) => setAmazonScore(e.target.value)}
  >
    <option value="">-- Select Rating --</option>
    <option value="Fantastic Plus">Fantastic Plus</option>
    <option value="Fantastic">Fantastic</option>
    <option value="Good">Good</option>
    <option value="Fair">Fair</option>
    <option value="Poor">Poor</option>
  </select>
</div>

{/* Weekly Rating */}
<div>
  <label className="block font-medium mb-1">Weekly Rating:</label>
  <select
    className="w-full border rounded p-2"
    value={weeklyRating}
    onChange={(e) => setWeeklyRating(e.target.value)}
  >
    <option value="">-- Select Weekly Rating --</option>
    <option value="Perfect">Perfect</option>
    <option value="Meets Requirements">Meets Requirements</option>
    <option value="Needs Improvement">Needs Improvement</option>
    <option value="Action Required">Action Required</option>
  </select>
</div>

{/* Grade */}
<div>
  <label className="block font-medium mb-1">TierOne Grade:</label>
  <select
    className="w-full border rounded p-2"
    value={grade}
    onChange={(e) => setGrade(e.target.value)}
  >
    <option value="">-- Select Grade --</option>
    <option value="S-Tier">S-Tier</option>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="D">D</option>
    <option value="F">F</option>
  </select>
</div>
