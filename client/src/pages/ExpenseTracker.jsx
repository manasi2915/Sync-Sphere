import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { apiRequest } from "../utils/api";
import { auth } from "../utils/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseTracker() {
  const [showForm, setShowForm] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [toast, setToast] = useState("");
  const [expenses, setExpenses] = useState([]);

  const currentUser = auth.user(); // logged in user
  const userId = currentUser?._id;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // -----------------------------------------------------
  // LOAD EXPENSES FROM BACKEND
  // -----------------------------------------------------
  const loadExpenses = async () => {
    try {
      const data = await apiRequest("/api/expenses");
      // Add frontend-only fields: status + date formatting
      const mapped = data.map((exp) => ({
        id: exp._id,
        title: exp.title,
        amount: exp.amount,
        category: exp.category || "Others",
        paidBy: exp.paidBy?.name || "You",
        date: new Date(exp.createdAt).toLocaleDateString(),
        people: exp.splits?.length || 1,
        each: exp.splits?.[0]?.share || 0,
        status: "pending", // frontend-only (your choice B)
      }));
      setExpenses(mapped);
    } catch (err) {
      console.error("Error loading expenses:", err);
      showToast("Failed to load expenses");
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // -----------------------------------------------------
  // FORM STATE
  // -----------------------------------------------------
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    people: 1,
    date: "",
  });

  // -----------------------------------------------------
  // CALCULATIONS
  // -----------------------------------------------------
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const youOwe = expenses
    .filter((e) => e.paidBy !== currentUser?.name)
    .reduce((a, e) => a + e.each, 0);

  const owedToYou = expenses
    .filter((e) => e.paidBy === currentUser?.name)
    .reduce((a, e) => a + (e.amount - e.each), 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#5B8FF9", "#5AD8A6", "#F6BD16", "#E86452"],
      },
    ],
  };

  // -----------------------------------------------------
  // ADD EXPENSE → BACKEND
  // -----------------------------------------------------
  const submitExpense = async (e) => {
    e.preventDefault();

    const eachShare = Math.round(form.amount / form.people);

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      paidBy: userId, // real backend user id
      splits: [
        {
          user: userId,
          share: eachShare,
        },
      ],
    };

    try {
      await apiRequest("/api/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast("Expense added!");
      setShowForm(false);
      setForm({ title: "", amount: "", category: "Food", people: 1, date: "" });
      loadExpenses();
    } catch (err) {
      console.error("Add expense error:", err);
      showToast("Failed to add expense");
    }
  };

  // -----------------------------------------------------
  // SETTLE EXPENSE (frontend only)
  // -----------------------------------------------------
  const settleExpense = (id) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, status: "settled" } : e
      )
    );
    showToast("Settled!");
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
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Manage and split expenses with your friends.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#b0c4ff] to-[#e4c7ff] 
                       text-gray-900 font-medium shadow-md hover:opacity-90 transition"
        >
          + Add Expense
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold">₹{totalExpenses}</p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">You Owe</p>
          <p className="text-2xl font-bold text-red-500">₹{youOwe}</p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">Owed to You</p>
          <p className="text-2xl font-bold text-green-500">₹{owedToYou}</p>
        </div>

        <div className="card p-4">
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="text-2xl font-bold">{expenses.length}</p>
        </div>
      </div>

      {/* EXPENSE + PIE */}
      <div className="grid grid-cols-3 gap-6">
        {/* RECENT EXPENSES */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>

          {expenses.map((exp) => (
            <div key={exp.id} className="card p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-gray-600">
                  Paid by {exp.paidBy} • {exp.date}
                </p>

                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">{exp.category}</span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    Split {exp.people} ways
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">₹{exp.amount}</p>

                {exp.status === "pending" ? (
                  <button
                    onClick={() => settleExpense(exp.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Settle
                  </button>
                ) : (
                  <span className="mt-2 inline-block px-4 py-2 bg-green-100 text-green-600 rounded">
                    Settled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PIE CHART */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* SETTLE UP SECTION */}
      <div className="bg-gradient-to-r from-pastel-blue to-pastel-purple p-6 rounded-xl text-white flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">Settle Up</p>
          <p>You owe ₹{youOwe}. Time to settle your expenses!</p>
        </div>

        <button onClick={() => setShowBalance(true)} className="px-4 py-2 bg-white text-black rounded shadow">
          View Balances
        </button>
      </div>

      {/* BALANCE MODAL */}
      {showBalance && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">
            <h2 className="text-xl font-bold mb-4">Your Balances</h2>

            <p className="text-gray-700 mb-1">You Owe: ₹{youOwe}</p>
            <p className="text-gray-700 mb-1">Owed to You: ₹{owedToYou}</p>

            <p className="text-gray-900 font-semibold text-lg mt-4">
              Net Balance: ₹{owedToYou - youOwe}
            </p>

            <button
              onClick={() => setShowBalance(false)}
              className="px-4 py-2 mt-6 bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>

            <form onSubmit={submitExpense} className="space-y-4">

              <input
                required
                type="text"
                placeholder="Expense Title"
                className="w-full p-2 border rounded-md"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                required
                type="number"
                placeholder="Total Amount"
                className="w-full p-2 border rounded-md"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />

              <select
                className="w-full p-2 border rounded-md"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Food</option>
                <option>Supplies</option>
                <option>Entertainment</option>
                <option>Others</option>
              </select>

              <input
                required
                type="number"
                placeholder="Split Between (number of people)"
                className="w-full p-2 border rounded-md"
                value={form.people}
                onChange={(e) =>
                  setForm({ ...form, people: Number(e.target.value) })
                }
              />

              <input
                required
                type="text"
                placeholder="Date (frontend only)"
                className="w-full p-2 border rounded-md"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
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
                  Add Expense
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
