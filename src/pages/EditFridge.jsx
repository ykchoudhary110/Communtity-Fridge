// src/pages/EditFridge.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function EditFridge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fridge, setFridge] = useState(null);
  const [loading, setLoading] = useState(true);

  // form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("fridges").select("*").eq("id", id).single();
    if (error) {
      console.error("Error loading fridge:", error);
      setFridge(null);
    } else {
      setFridge(data);
      setName(data.name ?? "");
      setAddress(data.address ?? "");
      setLatitude(data.latitude ?? "");
      setLongitude(data.longitude ?? "");
      setCapacity(data.capacity ?? "");
      setContact(data.contact ?? "");
      setStatus(data.status ?? "available");
      setPhotoUrl(data.photo_url ?? "");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    if (!name) return alert("Name is required");
    setSaving(true);

    const payload = {
      name,
      address,
      latitude: latitude !== "" ? Number(latitude) : null,
      longitude: longitude !== "" ? Number(longitude) : null,
      capacity,
      contact,
      status,
      photo_url: photoUrl,
      last_updated: new Date().toISOString()
    };

    const { data, error } = await supabase.from("fridges").update(payload).eq("id", id).select().single();

    if (error) {
      console.error("Error updating fridge:", error);
      alert("Could not update fridge: " + (error.message || "unknown"));
      setSaving(false);
      return;
    }

    // optional: insert status log when status changed
    if (fridge && fridge.status !== status) {
      await supabase.from("fridge_status_logs").insert([{ fridge_id: id, status, note: "Updated via edit form" }]);
    }

    setSaving(false);
    navigate(`/fridge/${id}`);
  }

  if (loading) return <div className="max-w-3xl mx-auto py-6 px-4">Loading…</div>;

  if (!fridge) return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <p className="text-red-600">Fridge not found.</p>
      <Link to="/" className="text-sm text-blue-600 underline">Back to list</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link to={`/fridge/${id}`} className="text-sm underline text-blue-600">← Back</Link>

      <div className="bg-white p-6 rounded shadow mt-4">
        <h2 className="text-2xl font-semibold mb-4">Edit fridge</h2>

        <form onSubmit={handleSave} className="space-y-3">
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
              <input value={latitude ?? ""} onChange={(e) => setLatitude(e.target.value)} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Longitude</label>
              <input value={longitude ?? ""} onChange={(e) => setLongitude(e.target.value)} className="mt-1 w-full border rounded p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full border rounded p-2">
              <option value="available">Available</option>
              <option value="low">Low</option>
              <option value="needs cleaning">Needs cleaning</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Photo URL (optional)</label>
            <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="mt-1 w-full border rounded p-2" />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
            <Link to={`/fridge/${id}`} className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
