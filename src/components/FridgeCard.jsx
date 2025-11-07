// src/components/FridgeCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const STATUS_EMOJI = {
  available: "🟢",
  low: "🟡",
  "needs cleaning": "🧽",
  unavailable: "⛔",
  default: "❔"
};

export default function FridgeCard({ fridge }) {
  const statusKey = (fridge.status || "").toLowerCase().replace("_", " ");
  const emoji = STATUS_EMOJI[statusKey] || STATUS_EMOJI.default;

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex gap-4">
      <div className="text-4xl">{emoji}</div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{fridge.name}</h3>
            <p className="text-sm text-gray-600">{fridge.address}</p>
            {fridge.contact && <p className="text-sm text-gray-600">Contact: {fridge.contact}</p>}
            <p className="text-xs text-gray-500 mt-1">Capacity: {fridge.capacity ?? "unknown"}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={fridge.status} />
            <Link to={`/fridge/${fridge.id}`} className="text-sm underline text-blue-600 hover:text-blue-800">View</Link>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <span className="mr-2">Updated: {fridge.last_updated ? new Date(fridge.last_updated).toLocaleString() : "—"}</span>
          <span> • ID: {String(fridge.id).slice(0,8)}</span>
        </div>
      </div>
    </div>
  );
}
