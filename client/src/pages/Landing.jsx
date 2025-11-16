import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import heroImg from "../assets/landing.png"; // <-- Hero image

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-start lg:items-center">
      {/* Center Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-10">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="SyncSphere Logo"
              className="w-10 h-10 object-contain rounded-md shadow-sm"
            />
            <div className="text-lg font-semibold">SyncSphere</div>
          </div>

          <button
  onClick={() => navigate("/login")}
  className="px-4 py-2 rounded-md 
  bg-gradient-to-r from-[#c5b1ff] to-[#e6d8ff] text-[#4a2e7f] font-medium shadow
  transition-all duration-200
  hover:bg-white hover:from-transparent hover:to-transparent"
>
  Login
</button>


        </header>

        {/* HERO SECTION */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT CONTENT */}
          <div>
            <span className="text-sm bg-white/40 backdrop-blur px-3 py-1 rounded-full">
              Welcome to SyncSphere
            </span>

            <h1 className="text-5xl font-extrabold leading-tight mt-4 mb-6 text-gray-900">
              Introducing{" "}
              <span className="bg-gradient-to-r from-[#5b8ff9] to-[#9b6eff] bg-clip-text text-transparent">
                SyncSphere
              </span>
            </h1>

            <p className="text-gray-700 max-w-lg mb-8 leading-relaxed">
              Designed to simplify student life, SyncSphere brings everything you need for
              campus life into one seamless platform. From event planners and study organizers
              to resource sharing, chat, and expense tracking, our integrated web app keeps you
              connected, productive, and stress-free throughout your academic journey.
              Whether you're coordinating a group project, managing club activities, borrowing
              resources, or splitting bills with friends,SyncSphere is built to support every
              aspect of student collaboration. Experience smarter campus living, powered by
              technology that understands your needs.
            </p>

            {/* CTA BUTTONS BELOW INTRODUCING */}
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/login"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pastel-blue to-pastel-purple text-black shadow hover:opacity-90"
              >
                Explore Features
              </Link>

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-full bg-white/80 border shadow hover:bg-white transition"
              >
                View Events
              </button>
            </div>

            {/* STATS BELOW BUTTONS */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Active Events", value: "24" },
                { label: "Study Sessions", value: "156" },
                { label: "Resources", value: "89" },
                { label: "Active Users", value: "2.4K" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur p-4 rounded-xl shadow-sm">
                  <div className="text-xs text-gray-600">{item.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT HERO CARD with landing.png */}
          <div className="bg-white/50 backdrop-blur rounded-2xl p-8 shadow-md self-start">
            <div className="w-full h-60 rounded-xl overflow-hidden shadow-inner">
              <img
                src={heroImg}
                alt="SyncSphere Hero"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Explore Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Event Management", "Study Planner", "Resource Sharing"].map((txt, i) => (
                  <div key={i} className="p-3 text-center rounded-lg bg-white shadow-sm">
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          © SyncSphere — Smart Campus Collaboration
        </footer>
      </div>
    </div>
  );
}
