import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Landing(){
  const navigate = useNavigate()
  return (
    <div className="container py-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pastel-cyan to-pastel-pink rounded-full flex items-center justify-center text-lg font-bold">SS</div>
          <div className="text-lg font-semibold">SyncSphere</div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={()=>navigate('/login')} className="px-4 py-2 rounded-md bg-white/80">Login</button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <span className="text-sm bg-white/30 px-3 py-1 rounded-full">Welcome to SyncSphere</span>
          <h1 className="text-4xl font-extrabold mt-4 mb-4">Your Smart Campus <span className="text-pastel-blue">Collaboration Hub</span></h1>
          <p className="small-muted mb-6">Everything you need for campus life in one place. Manage events, study sessions, resources, and connect with your peers seamlessly.</p>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-3 rounded-full bg-gradient-to-r from-pastel-blue to-pastel-purple text-white">Explore Features</Link>
            <a href="#events" className="px-6 py-3 rounded-full bg-white/80">View Events</a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="card">
              <div className="text-sm">Active Events</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="card">
              <div className="text-sm">Study Sessions</div>
              <div className="text-2xl font-bold">156</div>
            </div>
            <div className="card">
              <div className="text-sm">Resources</div>
              <div className="text-2xl font-bold">89</div>
            </div>
            <div className="card">
              <div className="text-sm">Active Users</div>
              <div className="text-2xl font-bold">2.4K</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="w-full h-56 bg-gradient-to-br from-pastel-purple to-pastel-cyan rounded-xl flex items-center justify-center text-white">Illustration / Hero</div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Explore Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/80">Event Management</div>
              <div className="p-4 rounded-lg bg-white/80">Study Planner</div>
              <div className="p-4 rounded-lg bg-white/80">Resource Sharing</div>
            </div>
          </div>
        </div>
      </main>

    

      <footer className="mt-12 text-center small-muted">© SyncSphere — Smart Campus Collaboration</footer>
    </div>
  )
}
