// src/pages/FridgeList.jsx
import React, { useMemo, useState } from "react";
import useFridges from "../hooks/useFridges";
import FridgeCard from "../components/FridgeCard";
import { Link } from "react-router-dom";

const STATUS_LIST = ["all", "available", "low", "needs cleaning", "unavailable"];

const STATUS_EMOJI = {
  available: "🟢",
  low: "🟡",
  "needs cleaning": "🧽",
  unavailable: "⛔",
  all: "📦"
};

export default function FridgeList() {
  const { fridges, loading, reload } = useFridges(5000);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const counts = useMemo(() => {
    const summary = { all: fridges.length, available: 0, low: 0, "needs cleaning": 0, unavailable: 0 };
    fridges.forEach((f) => {
      const k = (f.status || "").toLowerCase().replace("_", " ");
      if (k in summary) summary[k] += 1;
    });
    return summary;
  }, [fridges]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fridges.filter((f) => {
      if (!f) return false;
      if (statusFilter !== "all") {
        const normalized = (f.status || "").toLowerCase().replace("_", " ");
        if (normalized !== statusFilter) return false;
      }
      if (!q) return true;
      return (
        (f.name || "").toLowerCase().includes(q) ||
        (f.address || "").toLowerCase().includes(q) ||
        (f.contact || "").toLowerCase().includes(q)
      );
    });
  }, [fridges, query, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Community Fridges</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => reload()} className="px-3 py-1 border rounded bg-white hover:bg-gray-50">Refresh</button>
            <Link to="/admin" className="px-3 py-1 bg-blue-600 text-white rounded">Add Fridge</Link>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, address, or contact (e.g., 'Market', 'Noida')"
              className="flex-1 border rounded p-2"
            />
            <div className="text-sm text-gray-500">🔎</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_LIST.map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-sm ${active ? "bg-blue-600 text-white" : "bg-white border"}`}
                >
                  <span className="mr-2">{STATUS_EMOJI[s]}</span>
                  {s === "needs cleaning" ? "needs cleaning" : s}
                  <span className="ml-2 text-xs text-gray-500">({counts[s] ?? 0})</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading && <p className="text-gray-600">Loading fridges…</p>}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              No fridges found. Try a different search or add a new fridge.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {filtered.map((f) => (
              <FridgeCard key={f.id} fridge={f} />
            ))}
          </div>
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Quick stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>📦 All</div>
              <div className="font-medium">{counts.all}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>🟢 Available</div>
              <div className="font-medium">{counts.available}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>🟡 Low</div>
              <div className="font-medium">{counts.low}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>🧽 Needs cleaning</div>
              <div className="font-medium">{counts["needs cleaning"]}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>⛔ Unavailable</div>
              <div className="font-medium">{counts.unavailable}</div>
            </div>
          </div>

          <hr className="my-3" />

          <div>
            <h4 className="text-sm font-medium mb-2">Tips</h4>
            <ul className="text-xs text-gray-600 list-disc list-inside">
              <li>Use search to find fridges by place or contact.</li>
              <li>Click a card to update status or add a note.</li>
              <li>Anyone can add a fridge after creating an account.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-12 text-center text-gray-400">
        Built with ❤️ — demo app
      </div>
    </div>
  );
}
