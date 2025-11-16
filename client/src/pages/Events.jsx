import { apiRequest } from "../utils/api";
import React, { useState, useEffect } from "react";

export default function Events() {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState("");

  // Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // Events Data (now loaded from backend)
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
  title: "",
  description: "",
  category: "competition",
  date: "",
  time: "",
  venue: "",
  participants: "0/100"
});


  useEffect(() => {
    async function loadEvents() {
      try {
       const data = await apiRequest('/api/events');
const mapped = data.events.map(ev => ({

          id: ev._id,
          title: ev.title,
          description: ev.description || '',
          category: (ev.tags && ev.tags[0]) || 'other',
          status: 'open',
          date: ev.date ? new Date(ev.date).toLocaleDateString() : '',
          time: '',
          venue: ev.venue || '',
          participants: ev.capacity ? `0/${ev.capacity}` : '0'
        }));
        setEvents(mapped);
      } catch (err) {
        console.error('Error loading events', err);
      }
    }
    loadEvents();
  }, []);

  // Original static seed data (not used anymore, kept for reference)
  // const [events, setEvents] = useState([
    

  // Search + Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    date: "all",
    venue: "all",
  });

  // Filter Logic
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue.toLowerCase().includes(search.toLowerCase()) ||
      ev.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filters.category === "all" || ev.category === filters.category;

    const matchesStatus =
      filters.status === "all" || ev.status === filters.status;

    const matchesDate = filters.date === "all" || ev.date === filters.date;

    const matchesVenue = filters.venue === "all" || ev.venue === filters.venue;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesDate &&
      matchesVenue
    );
  });

  // Register Event
  const handleRegister = (id) => {
    setEvents(
      events.map((ev) =>
        ev.id === id ? { ...ev, status: "registered" } : ev
      )
    );
    showToast("Successfully registered!");
  };

  // Cancel Registration
  const handleCancel = (id) => {
    setEvents(
      events.map((ev) => (ev.id === id ? { ...ev, status: "open" } : ev))
    );
    showToast("Registration cancelled.");
  };

  // Submit New Event
  const submitEvent = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date || new Date().toISOString(),
      venue: form.venue,
      capacity: parseInt(form.participants.split('/')[1] || 0, 10) || undefined,
      tags: form.category ? [form.category] : []
    };

    try {
      const saved = await apiRequest('/api/events', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("sync_token")
  },
  body: JSON.stringify(payload)
});


      const mapped = {
        id: saved._id,
        title: saved.title,
        description: saved.description || '',
        category: (saved.tags && saved.tags[0]) || 'other',
        status: 'open',
        date: saved.date ? new Date(saved.date).toLocaleDateString() : '',
        time: '',
        venue: saved.venue || '',
        participants: saved.capacity ? `0/${saved.capacity}` : '0'
      };

      setEvents([...events, mapped]);
      setShowForm(false);
      showToast("Event Created Successfully!");
    } catch (err) {
      console.error('Error creating event', err);
      showToast(err.message || "Could not create event");
    }
  };

  // Tag Colors
  const categoryColor = {
    competition: "bg-green-100 text-green-700",
    workshop: "bg-purple-100 text-purple-700",
    seminar: "bg-pink-100 text-pink-700",
    social: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-8">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow z-50">
          {toast}
        </div>
      )}

      {/* HEADER */}
      {/* HEADER CARD */}
<div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

  {/* LEFT TEXT */}
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
    <p className="text-gray-600 mt-1">
      Discover and join exciting events happening around campus.
    </p>
  </div>

  {/* CREATE EVENT BUTTON (SAFE) */}
  <button
  onClick={() => setShowForm(true)}
  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#b0c4ff] to-[#e4c7ff] text-gray-900 font-medium shadow-md hover:opacity-90 transition"
>
  + Create Event
</button>


</div>


    
      {/* SEARCH + FILTER PANEL */}
      <div className="flex flex-col gap-4 bg-white/50 p-4 rounded-xl shadow">

        <input
          type="text"
          placeholder="Search events by name, venue, or category..."
          className="p-3 border rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <select
            className="p-3 border rounded-lg"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="all">All Categories</option>
            <option value="competition">Competition</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="social">Social</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="registered">Registered</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          >
            <option value="all">Any Date</option>
            <option value="Dec 10">Dec 10</option>
            <option value="Dec 15">Dec 15</option>
            <option value="Dec 18">Dec 18</option>
            <option value="Dec 20">Dec 20</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.venue}
            onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
          >
            <option value="all">All Venues</option>
            <option value="Computer Science Building">
              Computer Science Building
            </option>
            <option value="Innovation Lab">Innovation Lab</option>
            <option value="Main Auditorium">Main Auditorium</option>
            <option value="Sports Complex">Sports Complex</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">Registered</p>
          <p className="text-2xl font-bold">
            {events.filter((e) => e.status === "registered").length}
          </p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-2xl font-bold">156</p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>

      {/* EVENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((ev) => (
          <div key={ev.id} className="card p-6 space-y-3">

            <div className="flex justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize ${categoryColor[ev.category]}`}
              >
                {ev.category}
              </span>
              <span
                className={`text-xs font-medium ${
                  ev.status === "registered" ? "text-green-600" : "text-gray-600"
                }`}
              >
                {ev.status === "registered" ? "Registered" : "Open"}
              </span>
            </div>

            <h3 className="font-semibold text-lg">{ev.title}</h3>
            <p className="text-gray-600">{ev.description}</p>

            <div className="space-y-1 text-sm text-gray-700">
              <p>📅 {ev.date}</p>
              <p>⏰ {ev.time}</p>
              <p>📍 {ev.venue}</p>
              <p>👥 {ev.participants}</p>
            </div>

            <div className="flex gap-3 pt-2">
              {ev.status === "registered" ? (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => handleCancel(ev.id)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => handleRegister(ev.id)}
                  >
                    Register Now
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    Details
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>

            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p>📅 {selectedEvent.date}</p>
              <p>⏰ {selectedEvent.time}</p>
              <p>📍 {selectedEvent.venue}</p>
              <p>👥 {selectedEvent.participants}</p>
              <p className="capitalize">🏷 Category: {selectedEvent.category}</p>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>

            <form onSubmit={submitEvent} className="space-y-4">

              <input
                required
                type="text"
                placeholder="Event Title"
                className="w-full p-2 border rounded-md"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                required
                placeholder="Event Description"
                className="w-full p-2 border rounded-md"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <select
                className="w-full p-2 border rounded-md"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="competition">Competition</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="social">Social</option>
              </select>

              <div className="flex gap-4">
                <input
                  required
                  type="text"
                  placeholder="Dec 20"
                  className="w-1/2 p-2 border rounded-md"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
                <input
                  required
                  type="text"
                  placeholder="10:00 AM"
                  className="w-1/2 p-2 border rounded-md"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                />
              </div>

              <input
                required
                type="text"
                placeholder="Venue"
                className="w-full p-2 border rounded-md"
                value={form.venue}
                onChange={(e) =>
                  setForm({ ...form, venue: e.target.value })
                }
              />

              <input
                required
                type="text"
                placeholder="156/200"
                className="w-full p-2 border rounded-md"
                value={form.participants}
                onChange={(e) =>
                  setForm({ ...form, participants: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-6">
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
                  Create Event
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
