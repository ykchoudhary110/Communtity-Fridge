// src/components/StatusBadge.jsx
import React from "react";

const STATUS_CLASSES = {
  available: "bg-green-100 text-green-800",
  low: "bg-yellow-100 text-yellow-800",
  "needs cleaning": "bg-red-100 text-red-800",
  unavailable: "bg-gray-100 text-gray-800",
};

export default function StatusBadge({ status }) {
  const cls = STATUS_CLASSES[(status || "").toLowerCase()] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>
      {status ?? "unknown"}
    </span>
  );
}
