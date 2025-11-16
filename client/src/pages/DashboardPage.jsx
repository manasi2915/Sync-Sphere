import React from "react";
import { Link } from "react-router-dom";
import eventsImg from "../assets/events.png";
import studyImg from "../assets/study.png";
import resourcesImg from "../assets/resources.png";

/**
 * DashboardPage.jsx
 * Drop into src/pages/
 *
 * Notes:
 * - Replace "/src/assets/hero.png" with your actual hero illustration path.
 * - Tailwind classes assume your Tailwind config supports default spacing, rounded, shadows.
 * - Uses only React + Tailwind (no external chart libs).
 */

const stats = [
  { id: 1, label: "Active Events", value: "24", meta: "Happening this week", delta: "+12%" },
  { id: 2, label: "Study Sessions", value: "156", meta: "Hours completed", delta: "+8%" },
  { id: 3, label: "Resources Shared", value: "89", meta: "Available for booking", delta: "+15%" },
  { id: 4, label: "Active Users", value: "2.4K", meta: "Online right now", delta: "+5%" },
];

const featureCards = [
  {
    id: "events",
    title: "Event Management",
    subtitle: "Create, join, and manage campus events with ease",
    stats: [{ label: "Upcoming", value: "24" }, { label: "Registered", value: "156" }],
    to: "/dashboard/events",
    image: "/src/assets/events.png",
  },
  {
    id: "study",
    title: "Study Planner",
    subtitle: "Track your study goals and compete with peers",
    stats: [{ label: "Sessions", value: "42" }, { label: "Hours", value: "156" }],
    to: "/dashboard/study",
    image: "/src/assets/study.png",
  },
  {
    id: "resources",
    title: "Resource Sharing",
    subtitle: "Share and book campus resources instantly",
    stats: [{ label: "Available", value: "89" }, { label: "Bookings", value: "234" }],
    to: "/dashboard/resources",
    image: "/src/assets/resources.png",
  },
];

/* Sample engagement series for the SVG chart (Monday..Sunday).
   Two datasets: users (blue) and participation (purple).
*/
const engagementLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const seriesA = [45, 50, 47, 65, 72, 60, 58]; // blue line
const seriesB = [6, 9, 10, 13, 20, 15, 12]; // purple line

function LineChartSimple({ labels = engagementLabels, dataA = seriesA, dataB = seriesB }) {
  // Build a simple responsive SVG line chart
  const width = 900;
  const height = 220;
  const padding = 40;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const maxVal = Math.max(...dataA, ...dataB) || 1;
  const points = (arr) =>
    arr.map((v, i) => {
      const x = padding + (innerW * i) / (arr.length - 1);
      const y = padding + innerH - (innerH * v) / maxVal;
      return `${x},${y}`;
    });

  const pointsA = points(dataA).join(" ");
  const pointsB = points(dataB).join(" ");

  // small circles for each point
  const circlesA = dataA.map((v, i) => {
    const x = padding + (innerW * i) / (dataA.length - 1);
    const y = padding + innerH - (innerH * v) / maxVal;
    return <circle key={"a" + i} cx={x} cy={y} r="3.5" className="fill-current text-[#2b7ff7]" />;
  });

  const circlesB = dataB.map((v, i) => {
    const x = padding + (innerW * i) / (dataB.length - 1);
    const y = padding + innerH - (innerH * v) / maxVal;
    return <circle key={"b" + i} cx={x} cy={y} r="3.5" className="fill-current text-[#9b6eff]" />;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* grid lines */}
      <g className="text-gray-200">
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding + innerH * t;
          return <line key={i} x1={padding} x2={width - padding} y1={y} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />;
        })}
      </g>

      {/* labels (bottom) */}
      <g className="text-gray-500" fontSize="11" fontFamily="Inter, system-ui">
        {labels.map((lab, i) => {
          const x = padding + (innerW * i) / (labels.length - 1);
          const y = height - 8;
          return (
            <text key={lab} x={x} y={y} textAnchor="middle">
              {lab}
            </text>
          );
        })}
      </g>

      {/* area under A (subtle) */}
      <defs>
        <linearGradient id="gradA" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2b7ff7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2b7ff7" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="gradB" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#9b6eff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#9b6eff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <polyline points={pointsA} fill="none" stroke="#2b7ff7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="filter" strokeOpacity="1" />
      <polyline points={pointsB} fill="none" stroke="#9b6eff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="1" />

      {/* subtle filled path for A */}
      <path
        d={`M ${points(dataA)[0]} L ${points(dataA).join(" L ")} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`}
        fill="url(#gradA)"
        opacity="0.95"
      />
      {/* subtle filled path for B */}
      <path
        d={`M ${points(dataB)[0]} L ${points(dataB).join(" L ")} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`}
        fill="url(#gradB)"
        opacity="0.95"
      />

      {/* points */}
      <g className="text-[#2b7ff7]">{circlesA}</g>
      <g className="text-[#9b6eff]">{circlesB}</g>
    </svg>
  );
}

export default function DashboardPage() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-pastel-blue to-pastel-purple">

    <div className="space-y-8">


      {/* HERO CARD */}
      <div className="bg-white/60 backdrop-blur rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* LEFT */}
          <div className="space-y-6">
            

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Your Smart Campus{" "}
              <span className="bg-gradient-to-r from-[#5b8ff9] to-[#9b6eff] bg-clip-text text-transparent">Collaboration Hub</span>
            </h1>

            <p className="text-gray-600 max-w-xl">
              Everything you need for campus life in one place. Manage events,
              study sessions, resources, and connect with your peers seamlessly.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/dashboard/events"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#5b8ff9] to-[#9b6eff] text-white shadow"
              >
                Explore Features →
              </Link>

              <Link
                to="/dashboard/events"
                className="px-6 py-3 rounded-full bg-white border shadow"
              >
                View Events
              </Link>
            </div>
          </div>

          {/* RIGHT HERO IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-gradient-to-br from-[#eef6ff] to-[#f6f0ff] rounded-2xl p-4 shadow-lg">
              <img
                src="/src/assets/hero.png"
                alt="Campus illustration"
                className="w-full h-56 object-cover rounded-xl shadow-inner"
              />
            </div>
          </div>

        </div>
      </div>

      {/* UNIFIED STAT CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-green-600 font-medium">{s.delta}</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{s.meta}</div>
          </div>
        ))}
      </div>

      {/* ENGAGEMENT CHART */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Campus Engagement</h3>
          <div className="text-sm text-gray-500">
            User activity and events over the last 7 days
          </div>
        </div>

        <LineChartSimple />
      </div>

      {/* FEATURE CARDS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Explore Features</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-4 shadow-sm border overflow-hidden"
            >
              <div className="h-40 w-full rounded-lg overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h4 className="text-lg font-semibold">{f.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{f.subtitle}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {f.stats.map((s, idx) => (
  <div
    key={idx}
    className="bg-gray-50 rounded-lg p-3 text-center"
  >
    <div className="text-xs text-gray-500">{s.label}</div>

    {/* MAKE THE NUMBER BLUE */}
    <div className="text-lg font-bold text-[#2b7ff7]">
      {s.value}
    </div>
  </div>
))}

                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={f.to}
                    className="px-4 py-2 bg-[#2b7ff7] text-white rounded-lg shadow"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BAR */}
      <div className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#5b8ff9] to-[#9b6eff] p-6 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between">
          <div>
            <h4 className="text-xl font-bold">Ready to get started?</h4>
            <p className="text-sm opacity-90 mt-1">
              Join thousands of students making the most of their campus
              experience.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/dashboard/chat"
              className="px-4 py-2 bg-white/10 rounded-lg border border-white/30"
            >
              Join Chat
            </Link>
            <Link
  to="/dashboard/profile"
  className="px-4 py-2 bg-white text-[#2b7ff7] rounded-lg"
>
  View Profile
</Link>

          </div>
        </div>
      </div>

    </div>
  </div>
);
}