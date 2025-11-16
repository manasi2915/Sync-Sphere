import React, { useState } from "react";

export default function Resources() {
  const [showForm, setShowForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // Initial Resource Data
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "DSA Textbook",
      description: "Comprehensive Data Structures and Algorithms textbook.",
      type: "book",
      status: "available",
      location: "Library - Shelf A2",
      dateAdded: "Nov 20",
      owner: "Library Admin",
    },
    {
      id: 2,
      title: "Laptop (Dell Inspiron)",
      description: "Laptop available for 4-hour block reservation.",
      type: "device",
      status: "reserved",
      location: "Tech Hub",
      dateAdded: "Dec 01",
      owner: "Tech Services",
    },
    {
      id: 3,
      title: "Chemistry Lab Kit",
      description: "Basic experiment kit for students.",
      type: "equipment",
      status: "available",
      location: "Science Lab",
      dateAdded: "Dec 02",
      owner: "Lab Assistant",
    },
    {
      id: 4,
      title: "Projector",
      description: "Portable projector for classrooms and events.",
      type: "device",
      status: "available",
      location: "AV Room",
      dateAdded: "Dec 10",
      owner: "AV Staff",
    },
  ]);

  // Add Resource Form
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "book",
    location: "",
    dateAdded: "",
    owner: "",
    status: "available",
  });

  // Search + Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    location: "all",
    dateAdded: "all",
  });

  // Filter Logic
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());

    const matchesType = filters.type === "all" || r.type === filters.type;
    const matchesStatus =
      filters.status === "all" || r.status === filters.status;
    const matchesLocation =
      filters.location === "all" || r.location === filters.location;
    const matchesDate =
      filters.dateAdded === "all" || r.dateAdded === filters.dateAdded;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesLocation &&
      matchesDate
    );
  });

  // Reserve Resource
  const handleReserve = (id) => {
    setResources(
      resources.map((r) =>
        r.id === id ? { ...r, status: "reserved" } : r
      )
    );
    showToast("Resource Reserved!");
  };

  // Cancel Reservation
  const handleCancel = (id) => {
    setResources(
      resources.map((r) =>
        r.id === id ? { ...r, status: "available" } : r
      )
    );
    showToast("Reservation Cancelled.");
  };

  // Submit New Resource
  const submitResource = (e) => {
    e.preventDefault();
    setResources([...resources, { id: Date.now(), ...form }]);
    setShowForm(false);
    showToast("Resource Added Successfully!");
  };

  // Tag colors
  const typeColors = {
    book: "bg-blue-100 text-blue-700",
    equipment: "bg-orange-100 text-orange-700",
    device: "bg-purple-100 text-purple-700",
    notes: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-8">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow z-50">
          {toast}
        </div>
      )}

      {/* HEADER CARD — MATCHES EVENTS PAGE */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Resources</h1>
          <p className="text-gray-600 mt-1">
            Borrow, reserve, and explore campus resources.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#b0c4ff] to-[#e4c7ff] text-gray-900 font-medium shadow-md hover:opacity-90 transition"
        >
          + Add Resource
        </button>
      </div>

      {/* SEARCH + FILTER PANEL */}
      <div className="flex flex-col gap-4 bg-white/50 p-4 rounded-xl shadow">

        <input
          type="text"
          placeholder="Search resources by name, type, location..."
          className="p-3 border rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            className="p-3 border rounded-lg"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="device">Devices</option>
            <option value="equipment">Equipment</option>
            <option value="notes">Notes / Study Material</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="all">All Locations</option>
            <option value="Library - Shelf A2">Library - Shelf A2</option>
            <option value="Innovation Lab">Innovation Lab</option>
            <option value="AV Room">AV Room</option>
            <option value="Tech Hub">Tech Hub</option>
            <option value="Science Lab">Science Lab</option>
          </select>

          <select
            className="p-3 border rounded-lg"
            value={filters.dateAdded}
            onChange={(e) =>
              setFilters({ ...filters, dateAdded: e.target.value })
            }
          >
            <option value="all">Any Date</option>
            <option value="Nov 20">Nov 20</option>
            <option value="Dec 01">Dec 01</option>
            <option value="Dec 02">Dec 02</option>
            <option value="Dec 10">Dec 10</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total Resources</p>
          <p className="text-2xl font-bold">{resources.length}</p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold">
            {resources.filter((r) => r.status === "available").length}
          </p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">Reserved</p>
          <p className="text-2xl font-bold">
            {resources.filter((r) => r.status === "reserved").length}
          </p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">New This Week</p>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>

      {/* RESOURCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((r) => (
          <div key={r.id} className="card p-6 space-y-3">

            <div className="flex justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize ${typeColors[r.type]}`}
              >
                {r.type}
              </span>

              <span
                className={`text-xs font-medium ${
                  r.status === "available"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {r.status === "available" ? "Available" : "Reserved"}
              </span>
            </div>

            <h3 className="font-semibold text-lg">{r.title}</h3>
            <p className="text-gray-600">{r.description}</p>

            <div className="space-y-1 text-sm text-gray-700">
              <p>📍 {r.location}</p>
              <p>📅 Added on {r.dateAdded}</p>
              <p>👤 Owner: {r.owner}</p>
            </div>

            <div className="flex gap-3 pt-2">
              {r.status === "available" ? (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => handleReserve(r.id)}
                  >
                    Reserve
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={() => setSelectedResource(r)}
                  >
                    Details
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => handleCancel(r.id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => setSelectedResource(r)}
                  >
                    View Details
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-2xl font-bold mb-2">{selectedResource.title}</h2>
            <p className="text-gray-700 mb-4">{selectedResource.description}</p>

            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p>📍 {selectedResource.location}</p>
              <p>📅 Added on {selectedResource.dateAdded}</p>
              <p>👤 Owner: {selectedResource.owner}</p>
              <p className="capitalize">🏷 Type: {selectedResource.type}</p>
              <p>Status: {selectedResource.status}</p>
            </div>

            <button
              onClick={() => setSelectedResource(null)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD RESOURCE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add New Resource</h2>

            <form onSubmit={submitResource} className="space-y-4">

              <input
                required
                type="text"
                placeholder="Resource Title"
                className="w-full p-2 border rounded-md"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                required
                placeholder="Description"
                className="w-full p-2 border rounded-md"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <select
                className="w-full p-2 border rounded-md"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="book">Book</option>
                <option value="device">Device</option>
                <option value="equipment">Equipment</option>
                <option value="notes">Notes</option>
              </select>

              <input
                required
                type="text"
                placeholder="Location"
                className="w-full p-2 border rounded-md"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <input
                required
                type="text"
                placeholder="Added on (e.g., Dec 02)"
                className="w-full p-2 border rounded-md"
                value={form.dateAdded}
                onChange={(e) =>
                  setForm({ ...form, dateAdded: e.target.value })
                }
              />

              <input
                required
                type="text"
                placeholder="Owner / Incharge"
                className="w-full p-2 border rounded-md"
                value={form.owner}
                onChange={(e) =>
                  setForm({ ...form, owner: e.target.value })
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
                  Add Resource
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
