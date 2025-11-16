import React, { useState, useEffect, useRef } from "react";

export default function StudyPlanner() {
  // Pomodoro Logic
  const DEFAULT_TIME = 25 * 60; // 25 minutes
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIME);
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      {/* STUDY HEADER CARD */}
<div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm mb-6 flex flex-col gap-2">

  <h1 className="text-3xl font-bold text-gray-900">Study Planner</h1>

  <p className="text-gray-600">
    Track your progress, stay focused, and compete with peers.
  </p>
</div>


      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Total Time</h3>
          <p className="text-3xl font-bold">2h</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Sessions</h3>
          <p className="text-3xl font-bold">2</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Day Streak</h3>
          <p className="text-3xl font-bold">10</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Rank</h3>
          <p className="text-3xl font-bold">#3</p>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* POMODORO TIMER */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-xl font-semibold mb-2">Pomodoro Timer</h2>
          <p className="text-gray-600 mb-6">Stay focused with 25-minute work sessions</p>

          {/* TIMER CIRCLE */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 rounded-full border-8 border-pastel-purple flex items-center justify-center text-5xl font-bold text-pastel-blue">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-2 rounded-lg bg-pastel-blue text-white shadow"
            >
              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              onClick={resetTimer}
              className="px-6 py-2 rounded-lg bg-gray-200 shadow hover:bg-gray-300"
            >
              Reset
            </button>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Semester Goal</span>
              <span>85 / 120 hours</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-xl overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pastel-purple to-pastel-blue" style={{ width: "71%" }}></div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <div className="flex flex-col gap-3">
            <button className="px-4 py-2 rounded-md bg-white border hover:bg-gray-100">
              New Study Session
            </button>
            <button className="px-4 py-2 rounded-md bg-white border hover:bg-gray-100">
              Find Study Buddy
            </button>
            <button className="px-4 py-2 rounded-md bg-white border hover:bg-gray-100">
              View Challenges
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT SESSIONS */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Mathematics</p>
                <p className="text-sm text-gray-600">90 minutes</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Physics</p>
                <p className="text-sm text-gray-600">60 minutes</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Chemistry</p>
                <p className="text-sm text-gray-600">45 minutes</p>
              </div>
              <span className="text-yellow-600 text-sm font-medium">Pending</span>
            </div>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>

          <div className="space-y-3">
            {[
              { name: "Alice Johnson", hours: "42h", streak: "15 day streak", rank: 1 },
              { name: "Bob Smith", hours: "38h", streak: "12 day streak", rank: 2 },
              { name: "You", hours: "35h", streak: "10 day streak", rank: 3 },
              { name: "Carol White", hours: "32h", streak: "8 day streak", rank: 4 },
              { name: "David Brown", hours: "28h", streak: "7 day streak", rank: 5 },
            ].map((person) => (
              <div key={person.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{person.rank}. {person.name}</p>
                  <p className="text-sm text-gray-600">{person.streak}</p>
                </div>
                <span className="font-medium">{person.hours}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
