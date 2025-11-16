// client/src/pages/StudyPlanner.jsx
import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "../utils/api";
import { auth } from "../utils/auth";

export default function StudyPlanner() {
  const user = auth.user();

  // Pomodoro
  const DEFAULT_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Study sessions + stats
  const [sessions, setSessions] = useState([]);
  const [toast, setToast] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    duration: 60,
    maxParticipants: 5,
  });

  const [streak, setStreak] = useState(0);
  const [rank, setRank] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ------------ LOAD DATA -------------
  async function loadSessions() {
    try {
      const data = await apiRequest("/api/study");
      setSessions(data);
    } catch (err) {
      console.error("Failed loading study sessions", err);
    }
  }

  async function loadStats() {
    try {
      const stats = await apiRequest("/api/study/stats");
      setStreak(stats.streak || 0);
      setRank(stats.rank ?? null);
    } catch (err) {
      console.error("Failed loading study stats", err);
    }
  }

  useEffect(() => {
    loadSessions();
    loadStats();
  }, []);

  // ------------ CREATE SESSION -------------
  async function createSession(e) {
    e.preventDefault();
    try {
      await apiRequest("/api/study", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({ title: "", subject: "", duration: 60, maxParticipants: 5 });
      showToast("Study Session Created!");
      loadSessions();
      loadStats();
    } catch (err) {
      console.error(err);
      showToast("Error creating study session");
    }
  }

  // ------------ JOIN SESSION -------------
  async function joinSession(id) {
    try {
      await apiRequest(`/api/study/${id}/join`, { method: "POST" });
      showToast("Joined Session!");
      loadSessions();
      loadStats();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Cannot join session");
    }
  }

  // ------------ POMODORO -------------
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((p) => {
          if (p <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIME);
  };

  // ------------ STATS -------------
  const totalMinutes = sessions.reduce((a, s) => a + (s.duration || 0), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const sessionsCount = sessions.length;

  // Helper to know if current user joined a session
  const hasJoined = (session) => {
    const myId = user?.id;
    if (!myId || !session.participants) return false;
    return session.participants.some(
      (p) => p._id === myId || p === myId
    );
  };

  return (
    <div className="space-y-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow z-50">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Study Planner</h1>
        <p className="text-gray-600">Track your progress and focus better</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Total Study Time</h3>
          <p className="text-3xl font-bold">{totalHours}h</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Sessions</h3>
          <p className="text-3xl font-bold">{sessionsCount}</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Day Streak</h3>
          <p className="text-3xl font-bold">{streak} day{streak === 1 ? "" : "s"}</p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-gray-600">Rank</h3>
          <p className="text-3xl font-bold">
            {rank ? `#${rank}` : "—"}
          </p>
        </div>
      </div>

      {/* MAIN: TIMER + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TIMER */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Pomodoro Timer</h2>
          <p className="text-gray-600 mb-4">
            Stay focused with 25-minute work sessions
          </p>

          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 rounded-full border-8 border-pastel-purple flex items-center justify-center text-5xl font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-2 rounded-lg bg-pastel-blue text-white shadow"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="px-6 py-2 rounded-lg bg-gray-200 shadow"
            >
              Reset
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 w-full rounded-md bg-white border hover:bg-gray-100 mb-2"
          >
            New Study Session
          </button>

          <button
            className="px-4 py-2 w-full rounded-md bg-white border opacity-60 cursor-default"
          >
            Find Study Buddy (soon)
          </button>

          <button
            className="px-4 py-2 w-full rounded-md bg-white border opacity-60 cursor-default mt-2"
          >
            View Challenges (soon)
          </button>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>

        {sessions.length === 0 && (
          <p className="text-gray-500">No sessions yet</p>
        )}

        <div className="space-y-3">
          {sessions.map((s) => {
            const joined = hasJoined(s);
            return (
              <div
                key={s._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-gray-600">
                    {s.subject || "General"} • {s.duration || 0} min
                  </p>
                </div>

                {joined ? (
                  <span className="text-green-600 text-sm font-medium">
                    Joined
                  </span>
                ) : (
                  <button
                    onClick={() => joinSession(s._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Join
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-xl font-bold mb-4">New Study Session</h2>

            <form onSubmit={createSession} className="space-y-4">
              <input
                required
                placeholder="Title"
                className="w-full p-2 border rounded-md"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                required
                placeholder="Subject"
                className="w-full p-2 border rounded-md"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />

              <input
                type="number"
                min="10"
                placeholder="Duration (min)"
                className="w-full p-2 border rounded-md"
                value={form.duration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration: Number(e.target.value) || 0,
                  })
                }
              />

              <input
                type="number"
                min="1"
                placeholder="Max participants (optional)"
                className="w-full p-2 border rounded-md"
                value={form.maxParticipants}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxParticipants: Number(e.target.value) || undefined,
                  })
                }
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pastel-blue text-white rounded-md shadow"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
