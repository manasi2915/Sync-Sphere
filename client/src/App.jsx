import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'

import DashboardLayout from './pages/DashboardLayout'
import DashboardPage from './pages/DashboardPage'   // ⭐ IMPORTANT – new dashboard
import Profile from "./pages/Profile";
import Events from './pages/Events'
import StudyPlanner from './pages/StudyPlanner'
import Resources from './pages/Resources'
import ExpenseTracker from './pages/ExpenseTracker'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import AdminRoute from "./components/AdminRoute";

import { auth } from './utils/auth'


function Protected({ children }) {
  if (!auth.isLoggedIn()) return <Navigate to="/login" replace />
  return children
}


export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />


      {/* DASHBOARD ROUTES (PROTECTED) */}
      <Route 
        path="/dashboard" 
        element={<Protected><DashboardLayout /></Protected>}
      >

        {/* ⭐ DEFAULT DASHBOARD LANDING PAGE */}
        <Route index element={<DashboardPage />} />

        {/* OTHER PAGES */}
        <Route path="events" element={<Events />} />
        <Route path="study" element={<StudyPlanner />} />
        <Route path="resources" element={<Resources />} />
        <Route path="expenses" element={<ExpenseTracker />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />

        <Route
  path="admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>



      </Route>


      {/* UNKNOWN ROUTES FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}
