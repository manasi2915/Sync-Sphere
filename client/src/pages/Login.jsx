import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../utils/auth'

export default function Login(){
  const [email, setEmail] = useState('student@example.com')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handle(e){
    e.preventDefault()
    if(!email || !password){
      alert('Please enter both email and password')
      return
    }
    try {
      await auth.login({email, password})
      navigate('/dashboard')
    } catch (err) {
      alert(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full card">
        <h1 className="text-2xl font-semibold mb-2 text-center">Welcome back</h1>
        <p className="small-muted text-center mb-6">
          Log in to access your SyncSphere dashboard.
        </p>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full p-2 rounded-md border"
              placeholder="you@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full p-2 rounded-md border"
              placeholder="password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="px-4 py-2 rounded-md bg-pastel-blue/80 text-black">Login</button>
            
          </div>
        </form>
      </div>
    </div>
  )
}
