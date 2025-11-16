import React, {useState} from 'react'

const resources = [
  {id:1, name:'Digital Oscilloscope', bookings:28, status:'booked'},
  {id:2, name:'3D Printer', bookings:42, status:'available'},
  {id:3, name:'Acoustic Guitar', bookings:15, status:'available'},
  {id:4, name:'Algorithms Textbook', bookings:12, status:'available'}
]

export default function Admin(){
  const [tab, setTab] = useState('resources')
  const [list, setList] = useState(resources)

  function toggleStatus(id){
    setList(list.map(it=> it.id===id ? {...it, status: it.status==='available' ? 'booked' : 'available'} : it))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Panel</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><div className="text-sm">Total Users</div><div className="text-2xl font-bold">2,456</div></div>
        <div className="card"><div className="text-sm">Active Events</div><div className="text-2xl font-bold">124</div></div>
        <div className="card"><div className="text-sm">Resources</div><div className="text-2xl font-bold">89</div></div>
        <div className="card"><div className="text-sm">Daily Active</div><div className="text-2xl font-bold">1.2K</div></div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={()=>setTab('users')} className={"px-4 py-2 rounded-md "+(tab==='users'?'bg-pastel-blue/60':'')}>Users</button>
            <button onClick={()=>setTab('events')} className={"px-4 py-2 rounded-md "+(tab==='events'?'bg-pastel-purple/60':'')}>Events</button>
            <button onClick={()=>setTab('resources')} className={"px-4 py-2 rounded-md "+(tab==='resources'?'bg-pastel-cyan/60':'')}>Resources</button>
          </div>
          <div><button className="px-4 py-2 rounded-md bg-gradient-to-r from-pastel-cyan to-pastel-pink text-white">+ Add Resource</button></div>
        </div>

        {tab==='resources' && (
          <div>
            {list.map(it=> (
              <div key={it.id} className="flex items-center justify-between p-3 border-b">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm small-muted">{it.bookings} bookings</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={"px-3 py-1 rounded-full text-sm "+(it.status==='available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>{it.status}</div>
                  <button onClick={()=>toggleStatus(it.id)} className="px-3 py-2 rounded-md bg-white border">Toggle</button>
                  <button className="px-3 py-2 rounded-md text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='users' && <div className="small-muted">User list placeholder</div>}
        {tab==='events' && <div className="small-muted">Events admin placeholder</div>}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Analytics Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 rounded-lg">User Growth<br/><strong className="text-green-600">+12%</strong></div>
          <div className="p-4 bg-white/50 rounded-lg">Event Participation<br/><strong>85%</strong></div>
          <div className="p-4 bg-white/50 rounded-lg">Resource Utilization<br/><strong>92%</strong></div>
        </div>
      </div>
    </div>
  )
}
