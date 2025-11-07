// src/pages/AdminAddFridge.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function AdminAddFridge() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function handleAdd(e) {
    e.preventDefault();
    if (!name) return alert("Name is required");
    setSaving(true);

    const payload = {
      name,
      address,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      capacity,
      contact,
      status: "available",
    };

    const { data, error } = await supabase.from("fridges").insert([payload]).select().single();

    if (error) {
      console.error("Error adding fridge:", error);
      alert("Error adding fridge: " + (error.message || "unknown"));
      setSaving(false);
      return;
    }

    navigate(`/fridge/${data.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link to="/" className="text-sm underline text-blue-600">← Back to list</Link>
      <div className="bg-white p-6 rounded shadow mt-4">
        <h2 className="text-xl font-semibold mb-4">Add a new fridge</h2>

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">Latitude</label>
              <input value={latitude} onChange={(e) => setLatitude(e.target.value)} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Longitude</label>
              <input value={longitude} onChange={(e) => setLongitude(e.target.value)} className="mt-1 w-full border rounded p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Capacity (small/medium/large)</label>
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
              {saving ? "Adding…" : "Add fridge"}
            </button>
            <Link to="/" className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
