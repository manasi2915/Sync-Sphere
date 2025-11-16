import React from 'react'
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../utils/auth'

export default function NavBar(){
  const user = auth.user()
  const navigate = useNavigate()

  const activeStyle =
    "px-3 py-2 rounded-md bg-pastel-blue/70 text-gray-900 font-medium";
  const baseStyle =
    "px-3 py-2 rounded-md hover:bg-pastel-blue/40 font-medium";

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">

        {/* LEFT LOGO */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SyncSphere Logo"
            className="w-14 h-14 rounded-2xl object-cover shadow-sm"
            style={{ backgroundColor: "#E7ECFF" }}
          />

          <div>
            <div className="text-lg font-semibold">SyncSphere</div>
            <div className="text-xs text-gray-600">
              Where Connection Becomes Collaboration
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex items-center gap-4">
          <nav className="flex gap-3">

            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/dashboard/events"
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              Events
            </NavLink>

            <NavLink
              to="/dashboard/study"
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              Study
            </NavLink>

            <NavLink
              to="/dashboard/resources"
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              Resources
            </NavLink>

            <NavLink
              to="/dashboard/chat"
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              Chat
            </NavLink>

            <NavLink
              to="/dashboard/expenses"
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              Expenses
            </NavLink>

            {/* ADMIN ONLY */}
            {user?.role === "admin" && (
              <NavLink
                to="/dashboard/admin"
                className={({ isActive }) =>
                  isActive ? activeStyle : baseStyle
                }
              >
                Admin
              </NavLink>
            )}

          </nav>

          {/* USER + LOGOUT */}
          <div className="flex items-center gap-3">

            {/* USERNAME AS NAV TAB */}
            <NavLink
              to="/dashboard/profile"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : baseStyle
              }
            >
              {user ? user.name : "Guest"}
            </NavLink>

            <button
              onClick={() => {
                auth.logout();
                navigate("/login");
              }}
              className="px-3 py-1 rounded-md bg-white shadow"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
