import React, { useState } from "react";

export default function App() {
  const [role, setRole] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [grade, setGrade] = useState("");
  const [weeklyRating, setWeeklyRating] = useState("");
  const [amazonScore, setAmazonScore] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [netradyneToggle, setNetradyneToggle] = useState(false);

  const isTrainerOrSupervisor = role === "Trainer" || role === "Supervisor";
  const parsedHours = parseFloat(hoursWorked || 0);
  const parsedBaseRate = isTrainerOrSupervisor && baseRate ? parseFloat(baseRate) : 24;
  const cappedHours = Math.min(parsedHours, 40);
  const overtimeHours = parsedHours > 40 ? parsedHours - 40 : 0;

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

      {/* Hours Worked */}
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

      {/* Base Rate - Optional */}
      {isTrainerOrSupervisor && (
        <div>
          <label className="block font-medium mb-1">Base Rate (optional):</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="e.g. 26.00"
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
          />
        </div>
      )}

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

      {/* Amazon Scorecard */}
      <div>
        <label className="block font-medium mb-1">Amazon Scorecard Rating:</label>
        <select
          className="w-full border rounded p-2"
          value={amazonScore}
          onChange={(e) => setAmazonScore(e.target.value)}
        >
          <option value="">-- Select Amazon Rating --</option>
          <option value="Fantastic Plus">Fantastic Plus</option>
          <option value="Fantastic">Fantastic</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      {/* Netradyne Bonus Toggle */}
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          checked={netradyneToggle}
          onChange={() => setNetradyneToggle(!netradyneToggle)}
        />
        <label className="text-sm">Include Netradyne Bonus</label>
      </div>

      {/* Calculate Button */}
      {!showResults && (
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowResults(true)}
        >
          Calculate My Bonus
        </button>
      )}
