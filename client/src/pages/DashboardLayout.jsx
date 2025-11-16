import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function DashboardLayout() {
  return (
    <div className="px-6 pt-6">
  <NavBar />
  <Outlet />
</div>

  )
}
