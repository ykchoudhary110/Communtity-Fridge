// src/pages/FridgeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function FridgeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [fridge, setFridge] = useState(null);
  const [logs, setLogs] = useState([]); // <--- added state for logs
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch fridge details
  async function loadFridge() {
    const { data, error } = await supabase.from("fridges").select("*").eq("id", id).single();
    if (error) {
      console.error("Error loading fridge:", error);
      setFridge(null);
    } else {
      setFridge(data);
      setStatus(data?.status ?? "");
    }
  }

  // Fetch logs for this fridge
  async function loadLogs() {
    const { data, error } = await supabase
      .from("fridge_status_logs")
      .select("*")
      .eq("fridge_id", id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error loading logs:", error);
    } else {
      setLogs(data || []);
    }
  }

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await loadFridge();
      await loadLogs();
      setLoading(false);
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update status + add log
  async function handleUpdateStatus(e) {
    e.preventDefault();
    if (!status || !fridge) return;
    setSaving(true);

    const { error: updateError } = await supabase
      .from("fridges")
      .update({ status, last_updated: new Date().toISOString() })
      .eq("id", fridge.id);

    if (updateError) {
      console.error("Error updating fridge status:", updateError);
      setSaving(false);
      return;
    }

    const { error: logError } = await supabase.from("fridge_status_logs").insert([
      { fridge_id: fridge.id, status, note },
    ]);
    if (logError) {
      console.error("Error creating status log:", logError);
    }

    await loadFridge();
    await loadLogs(); // <--- refresh logs after saving
    setNote("");
    setSaving(false);
  }

  if (loading)
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <p className="text-gray-600">Loading fridge details…</p>
      </div>
    );

  if (!fridge)
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <p className="text-red-600">Fridge not found.</p>
        <Link to="/" className="text-blue-600 underline">Back to list</Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/" className="text-sm underline text-blue-600">
        ← Back to list
      </Link>

      <div className="bg-white p-6 rounded shadow mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{fridge.name}</h2>
            <p className="text-gray-600">{fridge.address}</p>
            {fridge.contact && (
              <p className="text-sm text-gray-600">📞 {fridge.contact}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Capacity: {fridge.capacity ?? "unknown"}
            </p>
          </div>

          <div className="text-right flex flex-col items-end gap-2">
            <StatusBadge status={fridge.status} />
            <p className="text-xs text-gray-400 mt-2">
              Last updated:{" "}
              {fridge.last_updated
                ? new Date(fridge.last_updated).toLocaleString()
                : "—"}
            </p>
            {user && (
              <Link
                to={`/fridge/${id}/edit`}
                className="text-sm mt-2 px-3 py-1 border rounded bg-blue-50 text-blue-700"
              >
                ✏️ Edit
              </Link>
            )}
          </div>
        </div>

        <hr className="my-4" />

        {/* STATUS UPDATE FORM */}
        {user && (
          <form onSubmit={handleUpdateStatus} className="space-y-3">
            <label className="block">
              <div className="text-sm font-medium">Update status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
              >
                <option value="">-- select status --</option>
                <option value="available">Available</option>
                <option value="low">Low</option>
                <option value="needs cleaning">Needs cleaning</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm font-medium">Note / message (optional)</div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., fridge needs restocking"
                className="mt-1 block w-full border rounded p-2"
              />
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || !status}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save status"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus(fridge.status);
                  setNote("");
                }}
                className="px-4 py-2 border rounded"
              >
                Reset
              </button>
            </div>
          </form>
        )}

        {/* ACTIVITY LOG */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
            📜 Activity Log
          </h3>

          {logs.length === 0 && (
            <p className="text-sm text-gray-500">No updates yet.</p>
          )}

          {logs.map((log) => (
            <div
              key={log.id}
              className="border-t py-2 flex justify-between items-start"
            >
              <div>
                <p className="text-sm">
                  <span className="font-medium">
                    {log.status === "available"
                      ? "🟢 Available"
                      : log.status === "low"
                      ? "🟡 Low"
                      : log.status === "needs cleaning"
                      ? "🧽 Needs Cleaning"
                      : log.status === "unavailable"
                      ? "⛔ Unavailable"
                      : log.status}
                  </span>
                </p>
                {log.note && (
                  <p className="text-sm text-gray-600 mt-1">💬 {log.note}</p>
                )}
              </div>
              <p className="text-xs text-gray-500 text-right">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
